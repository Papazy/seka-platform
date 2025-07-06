'use client'
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
  allowedRoles 
}: ProtectedRouteProps) {
  const {user, isLoading} = useAuth();
  const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login');
      }
    }, [isLoading,, router]);


    if (isLoading) {

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </div>
      )
    }

    if(!user) {
      return null
    }
    

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
      )
    }

    return <>{children}</>;
  
}