/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string; // Add your environment variables here
    // Add other variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}