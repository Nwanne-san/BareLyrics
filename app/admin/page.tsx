"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, LogIn, Shield, AlertTriangle } from "lucide-react";
import {
  validateAdminCredentials,
  setAdminToken,
  generateAdminToken,
  getAdminToken,
  validateAdminToken,
  type AdminUser,
} from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const token = getAdminToken();
    if (token) {
      const user = validateAdminToken(token);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // Token expired or invalid
        localStorage.removeItem("admin_token");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const adminUser = await validateAdminCredentials(email, password);

      if (adminUser) {
        const token = generateAdminToken(adminUser);
        setAdminToken(token);
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
      } else {
        setError(
          "Invalid credentials. Access is restricted to authorized personnel only."
        );
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <p className="text-gray-600">BareLyrics Administration Panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800"
                disabled={isSubmitting}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isSubmitting ? "Authenticating..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    Restricted Access
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    This admin panel is only accessible to authorized BareLyrics
                    team members. Credentials are provided by the development
                    team.
                  </p>
                </div>
              </div>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Development Mode
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Default credentials are available in development. Check
                  environment variables or contact the developer.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard currentUser={currentUser} />;
}
