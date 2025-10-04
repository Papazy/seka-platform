// app/components/Navbar.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/enum";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ✅ Get real user data and auth functions
  const { user, logout, isLoading } = useAuth();

  const getNavLinks = () => {
    if (!user) return [];
    const baseLinks = [
      { name: "Beranda", href: `/${user?.role.toLowerCase()}` },
    ];

    switch (user.role) {
      case UserRole.ADMIN:
        return [...baseLinks];
      case UserRole.LABORAN:
        return [
          ...baseLinks,
          { name: "Praktikum", href: "/laboran/praktikum" },
          { name: "Tugas", href: "/laboran/tugas" },
          { name: "Soal", href: "/laboran/soal" },
        ];
      case UserRole.DOSEN:
        return [
          ...baseLinks,
          { name: "Praktikum", href: "/dosen/praktikum" },
          { name: "Tugas", href: "/dosen/tugas" },
          { name: "Nilai", href: "/dosen/nilai" },
        ];
      case UserRole.MAHASISWA:
        return [
          ...baseLinks,
          { name: "Praktikum", href: "/mahasiswa/praktikum" },
          { name: "Tugas", href: "/mahasiswa/tugas" },
        ];
      default:
        return baseLinks;
    }
  };

  //  Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  //  Get user initials for avatar
  const getUserInitials = (name: string) => {
    console.log("User:", user);
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  //  Format role display
  const formatRole = (role: string) => {
    switch (role.toUpperCase()) {
      case "STUDENT":
        return "Student";
      case "DOSEN":
        return "Dosen";
      case "ADMIN":
        return "Admin";
      default:
        return role;
    }
  };

  //  Close dropdown when clicking outside
  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  //  Show loading state
  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-[#3ECF8E] rounded-md flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  SEKA USK
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {getNavLinks().map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "text-[#3ECF8E] bg-[#3ECF8E]/5"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  //  Don't show navigation if not authenticated
  if (!user) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-[#3ECF8E] rounded-md flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  SEKA USK
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {getNavLinks().map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "text-[#3ECF8E] bg-[#3ECF8E]/5"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-[#3ECF8E] rounded-md flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                SEKA USK
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {getNavLinks().map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#3ECF8E] bg-[#3ECF8E]/5"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                {/* ✅ Real user avatar with initials */}
                <div className="w-8 h-8 bg-[#3ECF8E] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserInitials(user.nama)}
                  </span>
                </div>

                {/* ✅ Real user info */}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.nama}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRole(user.role)}
                  </div>
                </div>

                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  {/* ✅ Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {/* ✅ Real user info in dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.nama}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRole(user.role)}
                      </p>
                    </div>

                    {/* ✅ Profile actions */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push("/profile");
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Profile Settings</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push("/help");
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Help & Support</span>
                      </div>
                    </button>

                    <hr className="my-1" />

                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
