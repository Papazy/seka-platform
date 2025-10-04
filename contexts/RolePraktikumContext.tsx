"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useFetchMahasiswaRoles } from "@/hooks/useFetchMahasiswaRoles";

export interface MahasiswaRole {
  praktikumId: string;
  role: "ASISTEN" | "PESERTA";
  permissions: string[];
}

export interface RolePraktikumContextType {
  mahasiswaRoles: MahasiswaRole[];
  isLoadingRoles: boolean;
  checkRole: (praktikumId: string) => "ASISTEN" | "PESERTA" | null;
  isAsisten: (praktikumId: string) => boolean;
  isPeserta: (praktikumId: string) => boolean;
}

const RolePraktikumContext = createContext<
  RolePraktikumContextType | undefined
>(undefined);

export const RolePraktikumProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const {
    data: mahasiswaRoles = [],
    isLoading: isLoadingRoles,
    refetch: refetchRoles,
  } = useFetchMahasiswaRoles(!!user);

  // helper functions
  const checkRole = (praktikumId: string): "ASISTEN" | "PESERTA" | null => {
    const mahasiswaRole = mahasiswaRoles.find(
      role => role.praktikumId === praktikumId,
    );
    return mahasiswaRole?.role || null;
  };

  const isAsisten = (praktikumId: string): boolean => {
    return checkRole(praktikumId) === "ASISTEN";
  };

  const isPeserta = (praktikumId: string): boolean => {
    return checkRole(praktikumId) === "PESERTA";
  };

  return (
    <RolePraktikumContext.Provider
      value={{
        mahasiswaRoles,
        isLoadingRoles,
        checkRole,
        isAsisten,
        isPeserta,
      }}
    >
      {children}
    </RolePraktikumContext.Provider>
  );
};

export const useRolePraktikum = () => {
  const context = useContext(RolePraktikumContext);
  if (!context) {
    throw new Error("useRolePraktikum must be used within a RoleProvider");
  }
  return context;
};
