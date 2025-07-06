'use client';

import { UserRole } from "@/lib/enum";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User { 
  id: number;
  nama: string;
  email: string;
  role: UserRole;
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType| undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] =  useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter()

  useEffect(()=>{
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try{
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      if (data.error) {
        console.error('Authentication error:', data.error);
        setUser(null);
      } else {
        setUser(data.user);
      }
    }catch(error: any) {
      console.error('Error checking authentication:', error);
      router.push('/login');
      router.refresh();
      setUser(null);
    }finally{
      setIsLoading(false);
    }
  }

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
        throw new Error('Login failed');
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

  const refreshUser = async () => {
   await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
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