import { User } from "@/types/user";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    fetchUser: async () => {
        set({isLoading: true, error: null});
        try {
            
        }
    }
}))