/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** "1" força o modo local: lê data/requisitos.json em vez do banco. */
  readonly VITE_LOCAL_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
