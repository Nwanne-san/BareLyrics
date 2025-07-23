"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, LogOut, Shield, User } from "lucide-react";
import { removeAdminToken, type AdminUser } from "@/lib/admin-auth";

interface AdminNavbarProps {
  currentUser: AdminUser | null;
}

export function AdminNavbar({ currentUser }: AdminNavbarProps) {
  const handleLogout = () => {
    removeAdminToken();
    window.location.reload();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center"
              >
                <Music className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black font-poppins">
                BareLyrics
              </h1>
              <p className="text-sm text-gray-600 -mt-1">
                Administration Panel
              </p>
            </div>
          </motion.div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-black">
                    {currentUser.name}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-gray-500" />
                    <Badge
                      variant={
                        currentUser.role === "developer"
                          ? "default"
                          : currentUser.role === "admin"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {currentUser.role}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mobile User Info */}
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <Badge
                  variant={
                    currentUser.role === "developer"
                      ? "default"
                      : currentUser.role === "admin"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {currentUser.role}
                </Badge>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-300 bg-transparent hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
