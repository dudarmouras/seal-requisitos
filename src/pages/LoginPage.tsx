import { useState, type FormEvent } from "react";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const { entrar } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    setErro(!entrar(usuario, senha));
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={enviar}>
        <div className="brand-row">
          <div className="brand-mark">SEAL</div>
          <div className="brand-text">
            <strong>Requisitos &amp; Fluxogramas</strong>
            <span>SEALog — operação de entregas</span>
          </div>
        </div>
        <p className="login-hint">Entre com a conta de acesso para ver os requisitos.</p>

        <label htmlFor="login-usuario">Usuário</label>
        <input
          id="login-usuario"
          type="text"
          autoComplete="username"
          autoFocus
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <label htmlFor="login-senha">Senha</label>
        <input
          id="login-senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p className="login-error">Usuário ou senha incorretos.</p>}

        <button type="submit" className="btn-primary">
          Entrar
        </button>
      </form>
    </div>
  );
}
