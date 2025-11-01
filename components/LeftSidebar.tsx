"use client";

import React, { useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useRolePraktikum } from "@/contexts/RolePraktikumContext";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: any;
}

export interface SidebarConfig {
  title: string;
  backPath?: string;
  backLabel?: string;
  activeItemId?: string;
  showRole?: boolean;
  menuItems: MenuItem[];
  onTabChange?: (tab: string) => void;
}

interface LeftSidebarProps {
  config: SidebarConfig;
  currentPath: string;
}

export default function LeftSidebar({ config, currentPath }: LeftSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { checkRole } = useRolePraktikum();

  const praktikumId = params.id as string;
  const userRole = checkRole(praktikumId);

  const handleBack = () => {
    if (config.backPath) router.replace(config.backPath);
    else router.back();
  };

  const handleTabChange = (tab: string) => {
    if (config.onTabChange) {
      config.onTabChange(tab);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-64 flex-shrink-0">
      <div className="space-y-1">
        {/* Header */}
        <div className="pb-3 mb-2 border-b border-gray-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {config.title}
            </h2>
            <button
              onClick={handleBack}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              {config.backLabel || "Kembali"}
            </button>
          </div>

          {/* Role Badge - Clean & Minimal */}
          {config.showRole && userRole && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  userRole === "ASISTEN" ? "bg-blue-500" : "bg-green-500"
                }`}
              />
              <span className="text-xs text-gray-600">
                {userRole === "ASISTEN" ? "Asisten" : "Praktikan"}
              </span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {config.menuItems.map(item => {
            const isActive =
              currentPath === item.path || config.activeItemId === item.id;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.path}
                prefetch={true}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm rounded-lg transition-all ${
                  isActive
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
