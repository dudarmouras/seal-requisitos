import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Login de conta única, só no navegador: não há servidor de autenticação por
 * trás. Barra a tela, não os dados — a leitura no Supabase segue liberada ao
 * role anon (ver data.tsx).
 */
const CONTA = { usuario: "cliente.seal@admin.com", senha: "clienteseal123" };
const CHAVE = "requisitos-seal:sessao";

interface AuthValue {
  usuario: string | null;
  entrar: (usuario: string, senha: string) => boolean;
  sair: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function lerSessao(): string | null {
  try {
    return localStorage.getItem(CHAVE) === CONTA.usuario ? CONTA.usuario : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(lerSessao);

  const entrar = useCallback((u: string, senha: string) => {
    if (u.trim().toLowerCase() !== CONTA.usuario || senha !== CONTA.senha) return false;
    try {
      localStorage.setItem(CHAVE, CONTA.usuario);
    } catch {
      /* sem armazenamento: a sessão vale só até recarregar */
    }
    setUsuario(CONTA.usuario);
    return true;
  }, []);

  const sair = useCallback(() => {
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      /* nada a limpar */
    }
    setUsuario(null);
  }, []);

  const value = useMemo(() => ({ usuario, entrar, sair }), [usuario, entrar, sair]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fora do AuthProvider");
  return ctx;
}
