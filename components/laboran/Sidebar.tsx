"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  shortName?: string;
}

// Move to constants to prevent recreation
const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Dashboard", href: "/laboran", icon: HomeIcon, shortName: "Home" },
  {
    name: "Praktikum",
    href: "/laboran/praktikum",
    icon: BookOpenIcon,
    shortName: "Praktikum",
  },
  {
    name: "Mahasiswa",
    href: "/laboran/mahasiswa",
    icon: UsersIcon,
    shortName: "Mahasiswa",
  },
  {
    name: "Dosen",
    href: "/laboran/dosen",
    icon: AcademicCapIcon,
    shortName: "Dosen",
  },
];

// Breakpoint constant
const DESKTOP_BREAKPOINT = 1024;

export default function LaboranSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Memoized active state checker
  const isActive = useCallback(
    (href: string) => {
      if (href === "/laboran") {
        return pathname === "/laboran";
      }
      return pathname.startsWith(href);
    },
    [pathname],
  );

  // Memoized user display data
  const userDisplayData = useMemo(() => {
    if (!user?.nama) return { firstName: "", initials: "", fullName: "" };

    const firstName = user.nama.split(" ")[0];
    const initials = user.nama.charAt(0).toUpperCase();

    return {
      firstName,
      initials,
      fullName: user.nama,
    };
  }, [user?.nama]);

  // Memoized navigation items with active state
  const navigationItems = useMemo(() => {
    return SIDEBAR_ITEMS.map(item => ({
      ...item,
      isActive: isActive(item.href),
    }));
  }, [isActive]);

  // Optimized resize handler with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth < DESKTOP_BREAKPOINT) {
          setIsDesktopCollapsed(false);
        }
      }, 100); // 100ms debounce
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Optimized callbacks
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout]);

  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopCollapsed(prev => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader
        onToggleSidebar={toggleMobileSidebar}
        userFirstName={userDisplayData.firstName}
        onLogout={handleLogout}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={closeMobileSidebar}
        navigationItems={navigationItems}
        userDisplayData={userDisplayData}
        onLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        isCollapsed={isDesktopCollapsed}
        onToggleCollapse={toggleDesktopSidebar}
        navigationItems={navigationItems}
        userDisplayData={userDisplayData}
        onLogout={handleLogout}
      />
    </>
  );
}

// Memoized sub-components with display names
const MobileHeader = React.memo(function MobileHeader({
  onToggleSidebar,
  userFirstName,
  onLogout,
}: {
  onToggleSidebar: () => void;
  userFirstName: string;
  onLogout: () => void;
}) {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Laboran Panel</h1>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Hi, {userFirstName}</span>
        <button
          onClick={onLogout}
          className="p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
});

const MobileSidebar = React.memo(function MobileSidebar({
  isOpen,
  onClose,
  navigationItems,
  userDisplayData,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: Array<SidebarItem & { isActive: boolean }>;
  userDisplayData: { firstName: string; initials: string; fullName: string };
  onLogout: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              SEKA Laboran
            </h2>
            <p className="text-sm text-gray-500">Kelola Praktikum</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <NavigationList
          items={navigationItems}
          onItemClick={onClose}
          variant="mobile"
        />

        <UserProfile
          userDisplayData={userDisplayData}
          onLogout={onLogout}
          variant="mobile"
        />
      </div>
    </div>
  );
});

const DesktopSidebar = React.memo(function DesktopSidebar({
  isCollapsed,
  onToggleCollapse,
  navigationItems,
  userDisplayData,
  onLogout,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  navigationItems: Array<SidebarItem & { isActive: boolean }>;
  userDisplayData: { firstName: string; initials: string; fullName: string };
  onLogout: () => void;
}) {
  return (
    <div
      className={`hidden lg:block lg:flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? "lg:w-16" : "lg:w-64"
      }`}
    >
      <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div
            className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            <h2 className="text-lg font-semibold text-gray-900">
              SEKA Laboran
            </h2>
            <p className="text-sm text-gray-500">Kelola Praktikum</p>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <NavigationList
          items={navigationItems}
          variant="desktop"
          isCollapsed={isCollapsed}
        />

        <UserProfile
          userDisplayData={userDisplayData}
          onLogout={onLogout}
          variant="desktop"
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
});

const NavigationList = React.memo(function NavigationList({
  items,
  onItemClick,
  variant = "desktop",
  isCollapsed = false,
}: {
  items: Array<SidebarItem & { isActive: boolean }>;
  onItemClick?: () => void;
  variant?: "mobile" | "desktop";
  isCollapsed?: boolean;
}) {
  return (
    <nav className={`flex-1 mt-8 px-4 ${variant === "mobile" ? "" : ""}`}>
      {items.map(item => (
        <NavigationItem
          key={item.href}
          item={item}
          onClick={onItemClick}
          isCollapsed={isCollapsed}
          variant={variant}
        />
      ))}
    </nav>
  );
});

const NavigationItem = React.memo(function NavigationItem({
  item,
  onClick,
  isCollapsed,
  variant,
}: {
  item: SidebarItem & { isActive: boolean };
  onClick?: () => void;
  isCollapsed?: boolean;
  variant?: "mobile" | "desktop";
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-2 transition-all relative ${
        item.isActive
          ? "bg-green-primary text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
      title={isCollapsed ? item.name : undefined}
    >
      <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"}`} />

      {variant === "desktop" && (
        <span
          className={`transition-all duration-300 ${
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          {item.name}
        </span>
      )}

      {variant === "mobile" && <span>{item.name}</span>}

      {isCollapsed && variant === "desktop" && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {item.name}
        </div>
      )}
    </Link>
  );
});

const UserProfile = React.memo(function UserProfile({
  userDisplayData,
  onLogout,
  variant,
  isCollapsed = false,
}: {
  userDisplayData: { firstName: string; initials: string; fullName: string };
  onLogout: () => void;
  variant: "mobile" | "desktop";
  isCollapsed?: boolean;
}) {
  return (
    <div
      className={`p-4 border-t ${variant === "mobile" ? "absolute bottom-0 w-full bg-gray-50" : ""}`}
    >
      {(variant === "mobile" || !isCollapsed) && (
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-green-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {userDisplayData.initials}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userDisplayData.fullName}
            </p>
            <p className="text-xs text-gray-500">Laboran</p>
          </div>
        </div>
      )}

      <button
        onClick={onLogout}
        className={`flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg ${
          isCollapsed && variant === "desktop" ? "justify-center" : ""
        }`}
        title={isCollapsed ? "Logout" : undefined}
      >
        <ArrowRightOnRectangleIcon
          className={`h-5 w-5 ${isCollapsed && variant === "desktop" ? "" : "mr-3"}`}
        />
        {(!isCollapsed || variant === "mobile") && "Logout"}
      </button>
    </div>
  );
});
