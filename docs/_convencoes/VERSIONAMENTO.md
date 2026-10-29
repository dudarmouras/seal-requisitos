# Versionamento das HUs

Cada HU tem versão, data e escopo em [`data/versoes.json`](../../data/versoes.json), e a página
da HU mostra os três ("Versão v2.0 · Atualizado em 16 de novembro de 2026 · Pedido do cliente"),
com o histórico recolhido.

## Quem mantém

Quem mergeia a PR em `main`, ou uma agente encarregada disso. A cada PR, compara as HUs publicadas
antes e depois do merge — título, história, descrição, regras e critérios — e decide:

| Mudança | Versão | Escopo |
|---|---|---|
| HU nova | `1.0`, com a data do merge | `base` |
| Só cumpre o requisito original: texto reescrito sem mudar o comportamento, campo de rastreio (origem legada, referências, catálogo), HU oculta ou reaparecida | não muda | — |
| Comportamento novo ou ampliado que a SEALog pediu (reunião, resposta a uma `Q-SL-*`, enunciado) | sobe a maior: `1.0` → `2.0` → `3.0` | `pedido-cliente` |
| Comportamento corrigido porque o requisito estava errado | sobe a maior | `correcao-bug` |

A data é a do merge da PR. Mudança mista numa HU sobe uma vez só, e o escopo é o do que pesou mais.

## Regras do arquivo

- Não é derivado de `docs/`: o gerador não o lê e `npm run data:sync` não o toca. Entra no bundle
  do app.
- `ultimaPr` é a última PR já processada; a próxima passada começa depois dela.
- HU que não está no arquivo aparece como v1.0, sem data.

O ponto de partida é 29/10/2026: as HUs do SEALog nasceram nessa data e valem como base, v1.0.
O arquivo começa vazio; a primeira mudança de comportamento é a primeira entrada.
