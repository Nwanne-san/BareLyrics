"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
// import { syncEnvironmentUsersToDatabase } from "@/lib/admin-auth";

export function AdminSetupBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Show banner only in development or if explicitly enabled
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_SHOW_SETUP_BANNER === "true"
    ) {
      setIsVisible(true);
    }
  }, []);

  const handleSync = async () => {
    setIsLoading(true);
    setStatus("idle");

    try {
    //   await syncEnvironmentUsersToDatabase();
      setStatus("success");
      setTimeout(() => setIsVisible(false), 3000);
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">
              Admin Setup Required
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Sync your environment admin credentials to the database for secure
              authentication.
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <Button
                onClick={handleSync}
                disabled={isLoading}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  "Sync Environment Users"
                )}
              </Button>

              {status === "success" && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Sync completed!</span>
                </div>
              )}

              {status === "error" && (
                <span className="text-sm text-red-600">
                  Sync failed. Check console for details.
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-yellow-600 hover:text-yellow-700"
          >
            ✕
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
