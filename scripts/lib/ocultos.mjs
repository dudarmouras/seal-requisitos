// O que está oculto do deploy sem sair de `docs/`.
//
// A documentação continua inteira no Markdown — ela é a fonte da verdade. O que
// fica desligado é a entrada destes itens nas páginas navegáveis do app: a HU some
// da lista do módulo, a prancha e a tela somem dos índices, e as HUs ocultas saem
// da legenda das pranchas e telas que ficam. A leitura integral (`/doc/...`) e o
// índice por id (`/id/...`) continuam com o texto completo.
//
// Um bloco oculto também pode ser comentado em `docs/`, entre `<!-- OCULTO <motivo>`
// e `-->`, cada marca sozinha na linha: a marca esconde o bloco do Markdown
// renderizado (GitHub) e `semMarcasDeOculto` a tira na leitura, de modo que o
// gerador e o `data:conferir` enxergam o texto como sempre e só esta lista decide
// o que o app mostra.
//
// Para ocultar um item: ponha o id na lista certa, com o motivo ao lado, e rode
// `npm run data:sync`. Para trazê-lo de volta: apague a linha dele aqui, tire as
// duas linhas da marca do Markdown, se houver, e rode `npm run data:sync`.
// `scripts/conferir-md-vs-json.mjs` lê a mesma lista.
//
// Nada do SEALog está oculto hoje.

export const HUS_OCULTAS = new Set([]);

export const FLUXOGRAMAS_OCULTOS = new Set([]);

export const TELAS_OCULTAS = new Set([]);

/** Tira as marcas `<!-- OCULTO ...` e `-->` que envolvem os blocos ocultos em `docs/`,
 *  deixando o texto do bloco. As marcas ficam sozinhas na linha; quem lê `docs/` por este
 *  caminho vê o Markdown como se o comentário não existisse. */
export function semMarcasDeOculto(texto) {
  let dentro = false;
  const saida = [];
  for (const linha of texto.replace(/\r\n/g, "\n").split("\n")) {
    if (!dentro && linha.startsWith("<!-- OCULTO")) { dentro = true; continue; }
    if (dentro && linha === "-->") { dentro = false; continue; }
    saida.push(linha);
  }
  return saida.join("\n");
}
