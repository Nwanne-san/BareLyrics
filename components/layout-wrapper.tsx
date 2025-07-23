"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Navbar from "./navbar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Navbar />}
      <section className={!isAdminPage ? "pt-16" : ""}>{children}</section>
    </>
  )
}
