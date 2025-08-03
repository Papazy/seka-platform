'use client';

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@/lib/enum";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User { 
  id: string;
  nama: string;
  email: string;
  role: UserRole;
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType| undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] =  useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter()

  const {data: userData, error} = useCurrentUser();
  useEffect(()=> {
    if (userData) {
      setUser(userData);
      setIsLoading(false);
    } else if (error) {
      // console.error('Error fetching user data:', error);
      setUser(null);
      setIsLoading(false);
    }
  }, [userData, error]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error('Login gagal, periksa email dan password Anda');
      }

      const data = await response.json();
      setUser(data.user);

      switch(data.user.role){
        case UserRole.ADMIN:
          router.push('/admin');
          break;
        case UserRole.DOSEN:
          router.push('/dosen');
          break;
        case UserRole.LABORAN:
          router.push('/laboran');
          break;
        case UserRole.MAHASISWA:
          router.push('/mahasiswa');
          break;
        default:
          router.push('/')
      }

    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>

  )

}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}