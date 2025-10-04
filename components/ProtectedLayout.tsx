// app/components/ProtectedRoutes.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika tidak loading dan tidak ada user, redirect ke login
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    // Jika ada user dan allowedRoles, cek permission
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect ke dashboard sesuai role user
      router.push(`/${user.role.toLowerCase()}`);
      return;
    }
  }, [isLoading, user, router, allowedRoles]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Akan redirect via useEffect
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          <button
            onClick={() => router.push(`/${user.role.toLowerCase()}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
