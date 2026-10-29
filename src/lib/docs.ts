/** Rótulo de cada um dos dez arquivos do contrato (CONVENCOES.md §3). */
const ROTULOS: Record<string, string> = {
  "00-visao-geral": "Visão geral",
  "01-atores-e-permissoes": "Atores e permissões",
  "02-regras-de-negocio": "Regras de negócio",
  "03-historias-de-usuario": "Histórias de usuário",
  "04-fluxogramas": "Fluxogramas",
  "05-telas-e-campos": "Telas e campos",
  "06-modelo-de-dados": "Modelo de dados",
  "07-integracoes": "Integrações",
  "08-mensagens-e-erros": "Mensagens e erros",
  "09-divergencias-e-lacunas": "Divergências e lacunas",
};

/** "02-regras-de-negocio" -> "Regras de negócio"; fora do contrato, o título do próprio arquivo. */
export function rotuloDoArquivo(file: string, titulo?: string): string {
  return ROTULOS[file] ?? titulo ?? file;
}

/** "02-regras-de-negocio" -> "02"; arquivo sem número, vazio. */
export function numeroDoArquivo(file: string): string {
  return /^\d\d-/.test(file) ? file.slice(0, 2) : "";
}
