"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  shortName?: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon, shortName: "Home" },
  {
    name: "Laboran",
    href: "/admin/laboran",
    icon: UsersIcon,
    shortName: "Lab",
  },
  {
    name: "Fakultas",
    href: "/admin/fakultas",
    icon: BuildingOfficeIcon,
    shortName: "Fak",
  },
  {
    name: "Program Studi",
    href: "/admin/program-studi",
    icon: AcademicCapIcon,
    shortName: "Prodi",
  },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  // Auto-collapse pada layar kecil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsDesktopCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed(!isDesktopCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Hi, {user?.nama?.split(" ")[0]}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  SEKA Admin
                </h2>
                <p className="text-sm text-gray-500">
                  Sistem Evaluasi Kode Aman
                </p>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-8 px-4">
              {sidebarItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-2 transition-all ${
                    isActive(item.href)
                      ? "bg-[#3ECF8E] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile User Info & Logout */}
            <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#3ECF8E] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.nama?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.nama}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block lg:flex-shrink-0 transition-all duration-300 ${
          isDesktopCollapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
          {/* Desktop Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div
              className={`transition-all duration-300 ${isDesktopCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                SEKA Admin
              </h2>
              <p className="text-sm text-gray-500">Sistem Evaluasi</p>
            </div>
            <button
              onClick={toggleDesktopSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isDesktopCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-1 mt-8 px-4">
            {sidebarItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-2 transition-all relative ${
                  isActive(item.href)
                    ? "bg-[#3ECF8E] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={isDesktopCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={`h-5 w-5 ${isDesktopCollapsed ? "mx-auto" : "mr-3"}`}
                />
                <span
                  className={`transition-all duration-300 ${
                    isDesktopCollapsed
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100"
                  }`}
                >
                  {item.name}
                </span>

                {/* Tooltip for collapsed state */}
                {isDesktopCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop User Info & Logout */}
          <div className="p-4 border-t">
            {!isDesktopCollapsed && (
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center space-x-3 mb-3 cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#3ECF8E] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.nama?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.nama}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>
            )}

            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                isDesktopCollapsed ? "justify-center" : ""
              }`}
              title={isDesktopCollapsed ? "Logout" : undefined}
            >
              <ArrowRightOnRectangleIcon
                className={`h-5 w-5 ${isDesktopCollapsed ? "" : "mr-3"}`}
              />
              {!isDesktopCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
