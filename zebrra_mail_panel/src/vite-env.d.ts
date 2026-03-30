interface ImportMetaEnv {
    readonly VITE_API_DOMAIN: string;
    readonly VITE_API_BASE_PATH: string;

    readonly VITE_AUTH_LOGIN_ATTEMPTS_KEY: string;
    readonly VITE_AUTH_LOGIN_ATTEMPTS_MAX: string;
    readonly VITE_AUTH_LOGIN_ATTEMPTS_WINDOW_MIN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}