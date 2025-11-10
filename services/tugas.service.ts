import { prisma } from "@/lib/prisma";
import { ServiceResponse } from "./utils";
import { PraktikumRole } from "@/lib/constants";

export type CreateTugasType = {
  judul: string;
  deskripsi: string;
  deadline: Date;
  maksimalSubmit?: number;
  idPraktikum: string;
  idAsisten: string;
  tugasBahasa?: string[];
};

export type UpdateTugasType = {
  judul?: string;
  deskripsi?: string;
  deadline?: Date;
  maksimalSubmit?: number;
  tugasBahasa?: string[];
};

export interface GetTugasDataForMahasiswaProps {
  praktikumId: string;
  tugasId: string;
  mahasiswaId: string;
}

/**
 * Create a new tugas
 */
export const createTugas = async (data: CreateTugasType) => {
  const {
    judul,
    deskripsi,
    deadline,
    maksimalSubmit,
    idPraktikum,
    idAsisten,
    tugasBahasa,
  } = data;

  // Validation
  if (!judul || !deskripsi || !deadline || !idPraktikum || !idAsisten) {
    return ServiceResponse({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Judul, deskripsi, deadline, praktikum, dan asisten wajib diisi",
    });
  }

  const deadlineDate = new Date(deadline);
  if (deadlineDate <= new Date()) {
    return ServiceResponse({
      success: false,
      error: "INVALID_DEADLINE",
      message: "Deadline harus di masa depan",
    });
  }

  try {
    // Check if praktikum exists
    const praktikum = await prisma.praktikum.findUnique({
      where: { id: idPraktikum },
    });

    if (!praktikum) {
      return ServiceResponse({
        success: false,
        error: "PRAKTIKUM_NOT_FOUND",
        message: "Praktikum tidak ditemukan",
      });
    }

    // Check if asisten exists and is assigned to this praktikum
    const asisten = await prisma.asistenPraktikum.findFirst({
      where: {
        id: idAsisten,
        idPraktikum: idPraktikum,
      },
    });

    if (!asisten) {
      return ServiceResponse({
        success: false,
        error: "ASISTEN_NOT_FOUND",
        message:
          "Asisten tidak ditemukan atau tidak terdaftar di praktikum ini",
      });
    }

    // Create tugas
    const tugas = await prisma.tugas.create({
      data: {
        judul,
        deskripsi,
        deadline: deadlineDate,
        maksimalSubmit: maksimalSubmit || 3,
        idPraktikum,
        idAsisten,
      },
      include: {
        praktikum: {
          select: {
            nama: true,
            kodePraktikum: true,
            kelas: true,
          },
        },
        asisten: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                npm: true,
              },
            },
          },
        },
      },
    });

    // Add tugasBahasa if provided
    if (tugasBahasa && Array.isArray(tugasBahasa) && tugasBahasa.length > 0) {
      const tugasBahasaData = tugasBahasa.map((idBahasa: string) => ({
        idTugas: tugas.id,
        idBahasa,
      }));

      await prisma.tugasBahasa.createMany({
        data: tugasBahasaData,
      });
    }

    return ServiceResponse({
      success: true,
      data: {
        id: tugas.id,
        judul: tugas.judul,
        deskripsi: tugas.deskripsi,
        deadline: tugas.deadline.toISOString(),
        maksimalSubmit: tugas.maksimalSubmit,
        praktikum: tugas.praktikum,
        pembuat: tugas.asisten.mahasiswa,
      },
      message: "Tugas berhasil dibuat",
    });
  } catch (error) {
    console.error("Error in createTugas:", error);
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal membuat tugas",
    });
  }
};

/**
 * Update an existing tugas
 */
export const updateTugas = async (
  tugasId: string,
  praktikumId: string,
  data: UpdateTugasType,
) => {
  const { judul, deskripsi, deadline, maksimalSubmit, tugasBahasa } = data;

  try {
    // Check if tugas exists and belongs to this praktikum
    const existingTugas = await prisma.tugas.findFirst({
      where: {
        id: tugasId,
        idPraktikum: praktikumId,
      },
    });

    if (!existingTugas) {
      return ServiceResponse({
        success: false,
        error: "TUGAS_NOT_FOUND",
        message: "Tugas tidak ditemukan",
      });
    }

    // Validate deadline if provided
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        return ServiceResponse({
          success: false,
          error: "INVALID_DEADLINE",
          message: "Deadline harus di masa depan",
        });
      }
    }

    // Update tugasBahasa if provided
    if (tugasBahasa && Array.isArray(tugasBahasa)) {
      // Delete existing tugasBahasa
      await prisma.tugasBahasa.deleteMany({
        where: { idTugas: tugasId },
      });

      // Create new tugasBahasa
      if (tugasBahasa.length > 0) {
        const tugasBahasaData = tugasBahasa.map((idBahasa: string) => ({
          idTugas: tugasId,
          idBahasa,
        }));

        await prisma.tugasBahasa.createMany({
          data: tugasBahasaData,
        });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (judul) updateData.judul = judul;
    if (deskripsi) updateData.deskripsi = deskripsi;
    if (deadline) updateData.deadline = new Date(deadline);
    if (maksimalSubmit !== undefined)
      updateData.maksimalSubmit = Number(maksimalSubmit);

    // Update tugas
    const updatedTugas = await prisma.tugas.update({
      where: { id: tugasId },
      data: updateData,
      include: {
        praktikum: {
          select: {
            nama: true,
            kodePraktikum: true,
            kelas: true,
          },
        },
        asisten: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                npm: true,
              },
            },
          },
        },
      },
    });

    return ServiceResponse({
      success: true,
      data: {
        id: updatedTugas.id,
        judul: updatedTugas.judul,
        deskripsi: updatedTugas.deskripsi,
        deadline: updatedTugas.deadline.toISOString(),
        maksimalSubmit: updatedTugas.maksimalSubmit,
        praktikum: updatedTugas.praktikum,
        pembuat: updatedTugas.asisten.mahasiswa,
      },
      message: "Tugas berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error in updateTugas:", error);
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal memperbarui tugas",
    });
  }
};

/**
 * Delete a tugas
 */
export const deleteTugas = async (tugasId: string, praktikumId: string) => {
  try {
    // Check if tugas exists and belongs to this praktikum
    const existingTugas = await prisma.tugas.findFirst({
      where: {
        id: tugasId,
        idPraktikum: praktikumId,
      },
    });

    if (!existingTugas) {
      return ServiceResponse({
        success: false,
        error: "TUGAS_NOT_FOUND",
        message: "Tugas tidak ditemukan",
      });
    }

    // Check if there are submissions
    const submissionsCount = await prisma.submission.count({
      where: {
        soal: {
          idTugas: tugasId,
        },
      },
    });

    if (submissionsCount > 0) {
      return ServiceResponse({
        success: false,
        error: "HAS_SUBMISSIONS",
        message: "Tidak dapat menghapus tugas yang sudah memiliki submission",
      });
    }

    // Delete related data first
    await prisma.$transaction(async tx => {
      // Delete tugasBahasa
      await tx.tugasBahasa.deleteMany({
        where: { idTugas: tugasId },
      });

      // Delete test cases for all soal in this tugas
      const soalIds = await tx.soal.findMany({
        where: { idTugas: tugasId },
        select: { id: true },
      });

      const soalIdsList = soalIds.map(s => s.id);

      if (soalIdsList.length > 0) {
        await tx.testCase.deleteMany({
          where: { idSoal: { in: soalIdsList } },
        });

        await tx.contohTestCase.deleteMany({
          where: { idSoal: { in: soalIdsList } },
        });

        // Delete soal
        await tx.soal.deleteMany({
          where: { idTugas: tugasId },
        });
      }

      // Finally, delete the tugas
      await tx.tugas.delete({
        where: { id: tugasId },
      });
    });

    return ServiceResponse({
      success: true,
      data: { id: tugasId },
      message: "Tugas berhasil dihapus",
    });
  } catch (error) {
    console.error("Error in deleteTugas:", error);
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal menghapus tugas",
    });
  }
};

/**
 * Get tugas detail by ID
 */
export const getTugasById = async (tugasId: string, praktikumId?: string) => {
  try {
    const whereClause: any = { id: tugasId };
    if (praktikumId) {
      whereClause.idPraktikum = praktikumId;
    }

    const tugas = await prisma.tugas.findFirst({
      where: whereClause,
      include: {
        praktikum: {
          select: {
            nama: true,
            kodePraktikum: true,
            kelas: true,
          },
        },
        asisten: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                npm: true,
              },
            },
          },
        },
        tugasBahasa: {
          include: {
            bahasa: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        soal: {
          select: {
            id: true,
            judul: true,
            bobotNilai: true,
          },
        },
      },
    });

    if (!tugas) {
      return ServiceResponse({
        success: false,
        error: "TUGAS_NOT_FOUND",
        message: "Tugas tidak ditemukan",
      });
    }

    return ServiceResponse({
      success: true,
      data: {
        id: tugas.id,
        judul: tugas.judul,
        deskripsi: tugas.deskripsi,
        deadline: tugas.deadline.toISOString(),
        maksimalSubmit: tugas.maksimalSubmit,
        praktikum: tugas.praktikum,
        pembuat: tugas.asisten.mahasiswa,
        bahasa: tugas.tugasBahasa.map((tb: any) => tb.bahasa),
        soal: tugas.soal,
      },
      message: "Tugas berhasil ditemukan",
    });
  } catch (error) {
    console.error("Error in getTugasById:", error);
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal mengambil detail tugas",
    });
  }
};

/**
 * Get all tugas for a praktikum
 */
export const getTugasByPraktikum = async (praktikumId: string) => {
  try {
    const tugas = await prisma.tugas.findMany({
      where: { idPraktikum: praktikumId },
      include: {
        asisten: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                npm: true,
              },
            },
          },
        },
        soal: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            soal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ServiceResponse({
      success: true,
      data: tugas.map(t => ({
        id: t.id,
        judul: t.judul,
        deskripsi: t.deskripsi,
        deadline: t.deadline.toISOString(),
        maksimalSubmit: t.maksimalSubmit,
        pembuat: t.asisten.mahasiswa,
        jumlahSoal: t._count.soal,
        createdAt: t.createdAt.toISOString(),
      })),
      message: "Daftar tugas berhasil diambil",
    });
  } catch (error) {
    console.error("Error in getTugasByPraktikum:", error);
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal mengambil daftar tugas",
    });
  }
};

/**
 * Verify if user has access to edit tugas
 */
export const verifyTugasAccess = async (
  tugasId: string,
  praktikumId: string,
  mahasiswaId: string,
) => {
  try {
    // Check if user is asisten for this praktikum
    const asisten = await prisma.asistenPraktikum.findFirst({
      where: {
        idMahasiswa: mahasiswaId,
        idPraktikum: praktikumId,
      },
    });

    if (!asisten) {
      return ServiceResponse({
        success: false,
        error: "ACCESS_DENIED",
        message: "Akses ditolak. Hanya asisten yang dapat mengedit tugas",
      });
    }

    // Check if tugas exists and belongs to this praktikum
    const tugas = await prisma.tugas.findFirst({
      where: {
        id: tugasId,
        idPraktikum: praktikumId,
      },
    });

    if (!tugas) {
      return ServiceResponse({
        success: false,
        error: "TUGAS_NOT_FOUND",
        message: "Tugas tidak ditemukan",
      });
    }

    return ServiceResponse({
      success: true,
      data: { hasAccess: true },
      message: "Akses diverifikasi",
    });
  } catch (error) {
    console.error("Error in verifyTugasAccess:", error);
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal memverifikasi akses",
    });
  }
};

export const verifyPraktikumAccess = async (
  praktikumId: string,
  mahasiswaId: string,
) => {
  try {
    if (!praktikumId || !mahasiswaId) {
      return ServiceResponse({
        success: false,
        error: "ACCESS_DENIED_TO_PRAKTIKUM",
        message: "Maaf, anda tidak memiliki akses ke praktikum ini",
      });
    }

    // periksa apakah peserta atau aslab
    const [peserta, asisten] = await Promise.all([
      prisma.pesertaPraktikum.findFirst({
        where: {
          idMahasiswa: mahasiswaId,
          idPraktikum: praktikumId,
        },
      }),
      prisma.asistenPraktikum.findFirst({
        where: {
          idMahasiswa: mahasiswaId,
          idPraktikum: praktikumId,
        },
      }),
    ]);

    if (asisten) {
      return ServiceResponse({
        success: true,
        message: "Akses diverifikasi sebagai asisten",
        data: {
          role: PraktikumRole.ASISTEN,
          data: asisten,
        },
      });
    }

    if (peserta) {
      return ServiceResponse({
        success: true,
        message: "Akses diverifikasi sebagai praktikan",
        data: {
          role: PraktikumRole.PRAKTIKAN,
          data: peserta,
        },
      });
    }

    return ServiceResponse({
      success: false,
      error: "ACCESS_DENIED",
      message: "Akses ditolak, anda bukan peserta praktikum ini",
    });
  } catch (error) {
    return ServiceResponse({
      success: false,
      error: "ERROR_VERIFY_ACCESS",
      message: "Error, terjadi kesalah saat verifikasi akses praktikum",
    });
  }
};

/**
 * Get tugas detail for praktikan/asisten
 * Menyediakan atribut khusus yang diperlukan untuk praktikan/asisten
 */
export const getTugasDataForMahasiswa = async (
  props: GetTugasDataForMahasiswaProps,
) => {
  try {
    const { praktikumId, tugasId, mahasiswaId } = props;

    if (!praktikumId || !tugasId || !mahasiswaId) {
      return ServiceResponse({
        success: false,
        error: "PROPS_NOT_FOUND",
        message: "Error: periksa atribut praktikumId, tugasId, mahasiswaId",
      });
    }

    // Verify access
    const aksesResponse = await verifyPraktikumAccess(praktikumId, mahasiswaId);
    if (!aksesResponse.success) {
      return ServiceResponse({
        success: false,
        error: "ACCESS_DENIED",
        message: "Akses ditolak, anda bukan peserta praktikum ini",
      });
    }

    const { role: mahasiswaRole, data: mahasiswaData } = aksesResponse.data;
    const pesertaId =
      mahasiswaRole === PraktikumRole.PRAKTIKAN ? mahasiswaData.id : null;

    // Fetch tugas dengan include yang sama untuk kedua role
    const tugas = await prisma.tugas.findFirst({
      where: {
        id: tugasId,
        idPraktikum: praktikumId,
      },
      include: {
        praktikum: {
          select: {
            nama: true,
            kodePraktikum: true,
            kelas: true,
            id: true,
          },
        },
        asisten: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                npm: true,
              },
            },
          },
        },
        tugasBahasa: {
          include: {
            bahasa: true,
          },
        },
        soal: {
          orderBy: { id: "asc" },
          include: {
            contohTestCase: true,
            testCase: true,
            submission:
              mahasiswaRole === PraktikumRole.PRAKTIKAN && pesertaId
                ? {
                  where: { idPeserta: pesertaId },
                  orderBy: { submittedAt: "desc" },
                  include: {
                    bahasa: {
                      select: {
                        nama: true,
                        ekstensi: true,
                      },
                    },
                    testCaseResult: {
                      include: {
                        testCase: true,
                      },
                    },
                  },
                }
                : false,
            _count: {
              select: {
                submission: true,
              },
            },
          },
        },
        hasilTugasMahasiswa:
          mahasiswaRole.PRAKTIKAN && pesertaId
            ? {
              where: { idPeserta: pesertaId },
              select: {
                totalNilai: true,
                createdAt: true,
                updatedAt: true,
              },
            }
            : false,
      },
    });

    if (!tugas) {
      return ServiceResponse({
        success: false,
        error: "TUGAS_NOT_FOUND",
        message: "Tugas tidak ditemukan",
      });
    }

    // Check deadline
    const isOverdue = new Date() > new Date(tugas.deadline);

    // Calculate submission stats dan totalPeserta untuk asisten (parallel queries)
    let submissionStats = null;
    if (mahasiswaRole === PraktikumRole.ASISTEN) {
      const [allSubmissions, totalPeserta] = await Promise.all([
        prisma.submission.findMany({
          where: {
            soal: {
              idTugas: tugasId,
            },
          },
          select: {
            idPeserta: true,
          },
        }),
        prisma.pesertaPraktikum.count({
          where: { idPraktikum: praktikumId },
        }),
      ]);

      const uniqueSubmitters = new Set(allSubmissions.map(s => s.idPeserta));

      submissionStats = {
        totalSubmissions: allSubmissions.length,
        uniqueSubmitters: uniqueSubmitters.size,
        totalPeserta,
      };
    }

    // Transform soal data
    const soalData = tugas.soal.map((s: any) => {
      const baseSoal: any = {
        id: s.id,
        judul: s.judul,
        deskripsi: s.deskripsi,
        batasan: s.batasan,
        formatInput: s.formatInput,
        formatOutput: s.formatOutput,
        batasanMemoriKb: s.batasanMemoriKb,
        batasanWaktuEksekusiMs: s.batasanWaktuEksekusiMs,
        templateKode: s.templateKode,
        bobotNilai: s.bobotNilai,
        contohTestCase: s.contohTestCase.map((tc: any) => ({
          id: tc.id,
          contohInput: tc.contohInput,
          contohOutput: tc.contohOutput,
          penjelasanInput: tc.penjelasanInput,
          penjelasanOutput: tc.penjelasanOutput,
        })),
        totalTestCase: s.testCase ? s.testCase.length : 0,
      };

      // Add praktikan-specific data
      if (mahasiswaRole === PraktikumRole.PRAKTIKAN && s.submission) {
        const userSubmissions = s.submission;
        const bestSubmission =
          userSubmissions.length > 0
            ? userSubmissions.reduce((best: any, current: any) =>
              current.score > best.score ? current : best,
            )
            : null;

        baseSoal.userSubmissions = userSubmissions.map((sub: any) => ({
          id: sub.id,
          score: sub.score,
          attemptNumber: sub.attemptNumber,
          submittedAt: sub.submittedAt.toISOString(),
          bahasa: sub.bahasa,
          testCaseResults: sub.testCaseResult.map((tcr: any) => ({
            status: tcr.status,
            outputDihasilkan: tcr.outputDihasilkan,
            waktuEksekusiMs: tcr.waktuEksekusiMs,
            memoriKb: tcr.memoriKb,
          })),
        }));
        baseSoal.bestScore = bestSubmission?.score || 0;
        baseSoal.submissionCount = userSubmissions.length;
        baseSoal.canSubmit =
          userSubmissions.length < tugas.maksimalSubmit && !isOverdue;
      }

      // Add asisten-specific data
      if (mahasiswaRole === PraktikumRole.ASISTEN && s._count) {
        baseSoal.totalSubmissions = s._count.submission;
      }

      return baseSoal;
    });

    // Build response
    const response: any = {
      id: tugas.id,
      judul: tugas.judul,
      deskripsi: tugas.deskripsi,
      deadline: tugas.deadline.toISOString(),
      maksimalSubmit: tugas.maksimalSubmit,
      tugasBahasa: tugas.tugasBahasa,
      createdAt: tugas.createdAt.toISOString(),
      isOverdue,
      userRole: mahasiswaRole,
      praktikum: tugas.praktikum,
      pembuat: {
        nama: tugas.asisten.mahasiswa.nama,
        npm: tugas.asisten.mahasiswa.npm,
      },
      soal: soalData,
    };

    // Add praktikan-specific data
    if (mahasiswaRole === PraktikumRole.PRAKTIKAN && tugas.hasilTugasMahasiswa) {
      response.hasilTugasMahasiswa = tugas.hasilTugasMahasiswa[0] || null;
      response.totalBobot = tugas.soal.reduce(
        (sum: number, s: any) => sum + s.bobotNilai,
        0,
      );
    }

    // Add asisten-specific data
    if (mahasiswaRole === PraktikumRole.ASISTEN && submissionStats) {
      response.submissionStats = submissionStats;
      response.praktikum.totalPeserta = submissionStats.totalPeserta;
    }

    return ServiceResponse({
      success: true,
      data: response,
      message: "Berhasil mendapatkan data tugas",
    });
  } catch (error) {
    console.error("Error in getTugasDataForMahasiswa:", error);
    return ServiceResponse({
      success: false,
      error: "Internal Error Server",
      message: "Terjadi kesalahan saat mengambil data tugas",
    });
  }
};

/**
 * Mengupdate status tugas praktikan secara otomatis berdasarkan submission yang dilakukan
 */
export const updateHasilTugasMahasiswa = async (
  idPraktikan: string,
  idTugas: string,
) => {
  if (!idPraktikan || !idTugas) {
    return ServiceResponse({
      success: false,
      error: "INVALID_PARAMS",
      message: "ID praktikan dan ID tugas wajib diisi",
    });
  }

  const [dataPeserta, dataTugas, dataSoal] = await Promise.all([
    prisma.pesertaPraktikum.findFirst({
      where: { idMahasiswa: idPraktikan},
    }),
    prisma.tugas.findFirst({
      where: {id: idTugas},
    }),
    prisma.soal.findMany({
      where: {idTugas: idTugas},
    }),
  ])

  const soalIds = dataSoal?.map(soal => soal.id) || [];

  const submissions = await prisma.submission.findMany({
    where: {
      idPeserta: dataPeserta?.id,
      idSoal: { in: soalIds },
    }
  })

  console.log("--- DEBUG updateHasilTugasMahasiswa ---", {
    dataPeserta,
    dataTugas,
    dataSoal,
    submissions
  });

  if (!dataPeserta || !dataTugas || !dataSoal) {
    return ServiceResponse({
      success: false,
      error: "DATA_NOT_FOUND",
      message: "Data peserta, tugas, atau soal tidak ditemukan",
    });
  }  
}

export const getOrCreateHasilTugasMahasiswa = async (idPeserta: string, idTugas: string) => {

  if(!idPeserta || !idTugas) {
    return ServiceResponse({
      success: false,
      error: "INVALID_PARAMS",
      message: "ID peserta dan ID tugas wajib diisi",
    });
  }

  const dataTugas = await prisma.tugas.findFirst({
    where: {
      id: idTugas,
    },
    include: {
      soal: true,
    }
  })

  const hasiTugas = await prisma.hasilTugasMahasiswa.findFirst({
    where: {
      idPeserta: idPeserta,
      idTugas: idTugas,
    }
  })

  if(!hasiTugas) {
    const newHasilTugas = await prisma.hasilTugasMahasiswa.create({
      data: {
        idPeserta: idPeserta,
        idTugas: idTugas,
        status: "NOT_STARTED",
        totalNilai: 0,
        jumlahSubmission: 0,
        jumlahSoalSelesai: 0,
        jumlahSoal: dataTugas?.soal.length || 0,
        isLate: false,
      }
    })

    return ServiceResponse({
      success: true,
      data: newHasilTugas,
      message: "Hasil tugas mahasiswa berhasil dibuat",
    });
  }

  return ServiceResponse({
    success: true,
    data: hasiTugas,
    message: "Hasil tugas mahasiswa berhasil diambil",
  });
}