import { prisma } from "@/lib/prisma";
import { ServiceResponse } from "./utils";
import { Semester } from "@prisma/client";

export const getActiveSemester = async () => {
  try {
    const data = await prisma.pengaturanSistem.findFirst();
    return ServiceResponse({
      data: {
        id: data?.id,
        tahun: data?.currentYear,
        semester: data?.currentSemester,
      },
    });
  } catch (error) {
    return ServiceResponse({
      success: false,
      data: [],
    });
  }
};

export const setActiveSemester = async ({
  tahun,
  semester,
}: {
  tahun: number;
  semester: Semester;
}) => {
  try {
    const oldData = await getActiveSemester();
    const data = await prisma.pengaturanSistem.update({
      where: {
        id: oldData?.data?.id,
      },
      data: {
        currentSemester: semester,
        currentYear: tahun,
      },
    });
    return ServiceResponse({
      data,
      message: "Berhasil mengupdate semester aktif",
    });
  } catch (error) {
    return ServiceResponse({
      success: false,
      data: [],
      message: "Gagal mengupdate semester aktif",
    });
  }
};
