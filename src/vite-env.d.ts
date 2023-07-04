/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_HOST: string;
    readonly VITE_ACCESS_TOKEN_KEY: string;
    readonly VITE_REFRESH_TOKEN_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
