import { login as httpLogin, logout as httpLogout, me as httpMe } from "@/lib/http";
import type { AuthMe } from "@/features/auth/services/auth.types";

export type LoginInput = {
    email: string;
    password: string;
};

export const authService = {
    async login(input: LoginInput): Promise<AuthMe> {
        await httpLogin(input.email, input.password);
        const response = await httpMe();
        return response.data;
    },

    async me(): Promise<AuthMe> {
        const response = await httpMe();
        return response.data;
    },

    async logout(): Promise<void> {
        await httpLogout();
    },
};