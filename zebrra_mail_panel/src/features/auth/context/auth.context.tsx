import React from "react";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import type { AuthMe } from "@/features/auth/services/auth.types";
import { authService, type LoginInput } from "@/features/auth/services/auth.service";
import { isApiErrorResponse } from "@/lib/api.types";

type AuthState = {
    user: AuthMe | null;
    isLoading: boolean;
};

type AuthContextValue = AuthState & {
    isAuthenticated: boolean;
    hasRole: (role: string) => boolean;

    bootstrap: () => Promise<void>;
    login: (input: LoginInput) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: AuthMe | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthFailure(error: unknown): boolean {
    const anyError = error as any;
    const data = anyError?.response?.data;
    if (isApiErrorResponse(data)) {
        return data.error.code === "AUTH_REQUIRED" || data.error.code === "AUTH_INVALID";
    }

    const status = anyError?.response?.status;
    return status === 401;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthMe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const bootstrap = useCallback(async () => {
        setIsLoading(true);
        try {
            const me = await authService.me();
            setUser(me);
        } catch (error) {
            if (isAuthFailure(error)) {
                setUser(null);
            } else {
                console.error("[auth] bootstrap failed", error);
                setUser(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (input: LoginInput) => {
        setIsLoading(true);
        try {
            const me = await authService.login(input);
            setUser(me);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);

    const value = useMemo<AuthContextValue>(() => {
        const roles = user?.roles ?? [];
        return {
            user,
            setUser,
            isLoading,
            isAuthenticated: !!user,
            hasRole: (role: string) => roles.includes(role),
            bootstrap,
            login,
            logout,
        };
    }, [user, isLoading, bootstrap, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
    const ctx = React.useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within <AuthProvider />");
    }
    return ctx;
}