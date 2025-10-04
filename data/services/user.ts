import { prisma } from "@/lib/prisma";

export const fetchCurrentUser = async () => {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  const data = await response.json();
  return data.user;
};
