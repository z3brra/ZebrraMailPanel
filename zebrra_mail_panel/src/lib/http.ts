import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

import { env } from "@/lib/env";
import { tokenStore } from "@/features/auth/services/token.store";

import { isApiErrorResponse } from "@/lib/api.types";
import type { AuthMeResponse } from "@/features/auth/services/auth.types";

type RefreshResponse = {
    data: {
        token: string;
        tokenType: "Bearer" | string;
        expiresIn: number;
    };
};

type LoginResponse = {
    data: {
        token: string;
        refreshTokenIssued: boolean;
    };
};

declare module "axios" {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
        _skipAuth?: boolean;
    }
}

const baseURL = env.api.baseUrl;

export const http: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});

const authFreeEndpoints = new Set([
    "/auth/login",
    "/auth/refresh",
    "/auth/logout",
]);

function isAuthFreeRequest(config: AxiosRequestConfig): boolean {
    const url = (config.url ?? "").toString();
    return authFreeEndpoints.has(url);
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

type Pending = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let pendingQueue: Pending[] = [];

function resolveQueue(token: string) {
    pendingQueue.forEach((p) => p.resolve(token));
    pendingQueue = [];
}

function rejectQueue(err: unknown) {
    pendingQueue.forEach((p) => p.reject(err));
    pendingQueue = [];
}

async function refreshAccessToken(): Promise<string> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        const response = await http.post<RefreshResponse>("/auth/refresh", undefined, {
            _skipAuth: true,
        } as any);

        const newToken = response.data.data.token;
        tokenStore.setAccessToken(newToken);
        return newToken;
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

http.interceptors.request.use((config) => {
    if (config._skipAuth) {
        return config;
    }
    if (isAuthFreeRequest(config)) {
        return config;
    }

    const token = tokenStore.getAccessToken();
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    async (error:  AxiosError) => {
        const config = error.config as any;
        if (!config) {
            return Promise.reject(error);
        }

        if (config._skipAuth || config._retry || isAuthFreeRequest(config)) {
            return Promise.reject(error);
        }

        const status = error.response?.status;

        const data = error.response?.data;
        const apiCode = isApiErrorResponse(data) ? data.error.code : undefined;
        const shouldTryRefresh =
            status === 401 &&
            (
                apiCode  === undefined ||
                apiCode === "AUTH_REQUIRED" ||
                apiCode === "AUTH_INVALID"
            );
        
        if (!shouldTryRefresh) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingQueue.push({
                    resolve: (token) => {
                        config._retry = true;
                        config.headers = config.headers ?? {};
                        config.headers.Authorization = `Bearer ${token}`;
                        resolve(http.request(config));
                    },
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            const token = await refreshAccessToken();
            resolveQueue(token);

            config._retry = true;
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;

            return http.request(config);
        } catch (refreshError) {
            rejectQueue(refreshError);
            tokenStore.clear();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>(
        "/auth/login",
        { email, password },
        { _skipAuth: true } as any
    );

    tokenStore.setAccessToken(response.data.data.token);
    return response.data;
}

export async function logout(): Promise<void> {
    await http.delete("/auth/logout", { _skipAuth: true } as any);
    tokenStore.clear();
}

export async function me(): Promise<AuthMeResponse> {
    const response = await http.get<AuthMeResponse>("/auth/me");
    return response.data;
}