import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface SemesterData {
    id: string;
    tahun: number;
    semester: "GANJIL" | "GENAP";
}

interface SetActiveSemesterPayload {
    tahun: number;
    semester: "GANJIL" | "GENAP";
}

// Hook untuk mendapatkan semester aktif
export const useActiveSemester = () => {
    return useQuery<SemesterData>({
        queryKey: ["activeSemester"],
        queryFn: async () => {
            const response = await fetch("/api/pengaturan-sistem", {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Gagal memuat semester aktif");
            }

            const result = await response.json();
            return result.data;
        },
        staleTime: 1000 * 60 * 5, // Cache selama 5 menit
        retry: 2,
    });
};

// Hook untuk mengubah semester aktif
export const useSetActiveSemester = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SetActiveSemesterPayload) =>{
            const response = await fetch("/api/pengaturan-sistem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || "Gagal mengubah semester aktif");
            }

            return response.json();
        },
        onMutate: (variables) => {
            queryClient.setQueryData(["activeSemester"], {
                tahun: variables.tahun,
                semester: variables.semester,
            });
        },
        onSuccess: (data, variables) => {
            // optimistic update

            // invalidate to refetch
            queryClient.invalidateQueries({ queryKey: ["activeSemester"] });
            
            toast.success("Semester aktif berhasil diubah");
        },
        onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: ["activeSemester"] });
            toast.error(error.message || "Gagal mengubah semester aktif");
        }
    })
};

// Hook kombinasi untuk kemudahan penggunaan
export const useSemester = () => {
    const { data, isLoading, error, refetch } = useActiveSemester();
    const setActiveSemester = useSetActiveSemester();

    return {
        activeSemester: data,
        isLoading,
        error,
        refetch,
        setActiveSemester: setActiveSemester.mutate,
        setActiveSemesterAsync: setActiveSemester.mutateAsync,
        isUpdating: setActiveSemester.isPending,
        updateError: setActiveSemester.error,

    };
};