type ViteEnv = {
    VITE_API_DOMAIN: string;
    VITE_API_BASE_PATH: string;

    VITE_AUTH_LOGIN_ATTEMPTS_KEY: string;
    VITE_AUTH_LOGIN_ATTEMPTS_MAX: string;
    VITE_AUTH_LOGIN_ATTEMPTS_WINDOW_MIN: string;
};

function requiredString(name: keyof ViteEnv, raw: unknown): string {
    const value = String(raw ?? "").trim();
    if (!value) {
        throw new Error(`[env] Missing or empty ${name}`);
    }
    return value;
}

function requiredInt(name: keyof ViteEnv, raw: unknown): number {
    const str = requiredString(name, raw);
    const n = Number(str);
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
        throw new Error(`[env] ${name} must be an integer, got "${str}"`);
    }
    return n;
}

function joinUrl(domain: string, basePath: string): string {
    const d = domain.replace(/\/+$/, "");
    const p = basePath.startsWith("/") ? basePath : `/${basePath}`;
    return `${d}${p}`.replace(/\/+$/, "");
}

const raw = import.meta.env as unknown as Partial<ViteEnv>;

const API_DOMAIN = requiredString("VITE_API_DOMAIN", raw.VITE_API_DOMAIN);
const API_BASE_PATH = requiredString("VITE_API_BASE_PATH", raw.VITE_API_BASE_PATH);

const LOGIN_ATTEMPTS_KEY = requiredString("VITE_AUTH_LOGIN_ATTEMPTS_KEY", raw.VITE_AUTH_LOGIN_ATTEMPTS_KEY);
const LOGIN_ATTEMPTS_MAX = requiredInt("VITE_AUTH_LOGIN_ATTEMPTS_MAX", raw.VITE_AUTH_LOGIN_ATTEMPTS_MAX);
const LOGIN_ATTEMPTS_WINDOW_MIN = requiredInt("VITE_AUTH_LOGIN_ATTEMPTS_WINDOW_MIN", raw.VITE_AUTH_LOGIN_ATTEMPTS_WINDOW_MIN);

export const env = Object.freeze({
    api: Object.freeze({
        domain: API_DOMAIN,
        basePath: API_BASE_PATH,
        baseUrl: joinUrl(API_DOMAIN, API_BASE_PATH),
    }),
    auth: Object.freeze({
        loginAttemptsKey: LOGIN_ATTEMPTS_KEY,
        loginAttemptsMax: LOGIN_ATTEMPTS_MAX,
        loginAttemptsWindowMin: LOGIN_ATTEMPTS_WINDOW_MIN
    }),
});