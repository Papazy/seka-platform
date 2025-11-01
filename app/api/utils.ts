import { prisma } from "@/lib/prisma";

export const getCurrentSemester = async () => {
  try {
    const data = await prisma.pengaturanSistem.findFirst();
    return { semester: data?.currentSemester, tahun: data?.currentYear };
  } catch (error) {
    console.error("Error fetching current semester:", error);
    return { semester: null, tahun: null };
  }
};
