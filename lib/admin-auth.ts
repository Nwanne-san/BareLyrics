import { supabase } from "./superbase"
import bcrypt from "bcryptjs"

// Admin credentials from environment variables
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL ,
  password: process.env.ADMIN_PASSWORD, // Default for development
  developerEmail: process.env.DEVELOPER_EMAIL,
  developerPassword: process.env.DEVELOPER_PASSWORD, // Default for development
}

export interface AdminUser {
  id: number
  email: string
  name: string
  role: "admin" | "developer" | "moderator"
  created_at: string
  updated_at: string
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Validate admin credentials against environment variables and database
export async function validateAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  try {
    // First check environment-based credentials (primary admin and developer)
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return {
        id: 1,
        email: ADMIN_CREDENTIALS.email,
        name: "Primary Admin",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    if (email === ADMIN_CREDENTIALS.developerEmail && password === ADMIN_CREDENTIALS.developerPassword) {
      return {
        id: 2,
        email: ADMIN_CREDENTIALS.developerEmail,
        name: "Developer",
        role: "developer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    // Then check database for additional admin users
    const { data: adminUser, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error || !adminUser) {
      return null
    }

    // If password is stored as hash, verify it
    if (adminUser.password_hash) {
      const isValid = await verifyPassword(password, adminUser.password_hash)
      if (!isValid) {
        return null
      }
    } else {
      // For backwards compatibility, check plain text (not recommended for production)
      if (adminUser.password && adminUser.password !== password) {
        return null
      }
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      created_at: adminUser.created_at,
      updated_at: adminUser.updated_at,
    }
  } catch (error) {
    console.error("Admin validation error:", error)
    return null
  }
}

// Check if current domain is admin subdomain
export function isAdminDomain(): boolean {
  if (typeof window === "undefined") return false
  return window.location.hostname.startsWith("admin.") || window.location.hostname.includes("admin")
}

// Token management
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("admin_token")
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_token", token)
}

export function removeAdminToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("admin_token")
}

export function generateAdminToken(adminUser: AdminUser): string {
  const tokenData = {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
    timestamp: Date.now(),
  }
  return btoa(JSON.stringify(tokenData))
}

export function validateAdminToken(token: string): AdminUser | null {
  try {
    const tokenData = JSON.parse(atob(token))

    // Check if token is not too old (24 hours)
    const tokenAge = Date.now() - tokenData.timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    if (tokenAge > maxAge) {
      return null
    }

    return {
      id: tokenData.id,
      email: tokenData.email,
      name: tokenData.name || "Admin User",
      role: tokenData.role,
      created_at: new Date(tokenData.timestamp).toISOString(),
      updated_at: new Date(tokenData.timestamp).toISOString(),
    }
  } catch (error) {
    return null
  }
}

// Get current admin user from token
export function getCurrentAdminUser(): AdminUser | null {
  const token = getAdminToken()
  if (!token) return null
  return validateAdminToken(token)
}

// Database functions for managing admin users
export async function createAdminUser(userData: {
  email: string
  name: string
  password: string
  role: "admin" | "moderator"
}): Promise<AdminUser> {
  const passwordHash = await hashPassword(userData.password)

  const { data, error } = await supabase
    .from("admin_users")
    .insert([
      {
        email: userData.email,
        name: userData.name,
        password_hash: passwordHash,
        role: userData.role,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create admin user: ${error.message}`)
  }

  return data
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, name, role, created_at, updated_at")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch admin users: ${error.message}`)
  }

  return data || []
}

export async function updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<AdminUser> {
  const { data, error } = await supabase.from("admin_users").update(updates).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update admin user: ${error.message}`)
  }

  return data
}

export async function deleteAdminUser(id: number): Promise<void> {
  const { error } = await supabase.from("admin_users").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete admin user: ${error.message}`)
  }
}

// Check if user has required role
export function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    developer: 3,
    admin: 2,
    moderator: 1,
  }

  return (
    roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  )
}
