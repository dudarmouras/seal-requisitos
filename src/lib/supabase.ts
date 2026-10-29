import { createClient } from "@supabase/supabase-js";

/*
 * A anon key é pública por natureza — quem controla o acesso aos dados são as
 * policies de RLS no banco (leitura somente para usuários autenticados; o role
 * anon não recebe grant nenhum). O schema precisa constar em
 * Project Settings → Data API → Exposed schemas.
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SCHEMA = "app_requisitos_seal";

/** Falso quando falta configuração — o app cai no modo local em vez de quebrar. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder",
  { db: { schema: SUPABASE_SCHEMA } }
);
