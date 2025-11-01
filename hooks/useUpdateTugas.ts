import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface UpdateTugasDataPayload {
  judul: string;
  deskripsi: string;
  deadline: string;
  maksimalSubmit: number;
  tugasBahasa: Array<string>;
}

export interface UpdateTugasPayload {
  tugasId: string;
  praktikumId: string;
  data: UpdateTugasDataPayload;
}

const updateTugas = async ({
  tugasId,
  praktikumId,
  data,
}: UpdateTugasPayload): Promise<any> => {
  const response = await fetch(
    `/api/praktikum/${praktikumId}/tugas/${tugasId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Gagal mengupdate tugas");
  }

  return response.json();
};

export const useUpdateTugas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTugas,
    onSuccess: (data, variables) => {
      toast.success("Tugas berhasil diupdate!");

      queryClient.invalidateQueries({
        queryKey: ["tugas-detail", variables.praktikumId, variables.tugasId],
      });
    },
    onError: (error: any) => {
      toast.error("Gagal mengupdate tugas");
      console.error("Error update tugas: ", error);
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({
        queryKey: ["tugas-detail", variables.praktikumId, variables.tugasId],
      });

      const previousData = queryClient.getQueryData([
        "tugas-detail",
        variables.praktikumId,
        variables.tugasId,
      ]);

      // context in case got error
      return {
        previousData,
      };
    },
  });
};
