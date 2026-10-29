# Documentos de origem

Inventário do material recebido sobre o projeto SEAL, usado como base desta documentação de
requisitos. Serve para rastreabilidade: quando um documento for atualizado, o `sha256` muda e a
documentação derivada precisa ser revisada.

**Local dos arquivos:** `~/Downloads/`
*(fora deste repositório — os originais não são versionados aqui)*

---

## Como a documentação foi produzida

A origem **não é engenharia reversa**. É um resumo, em duas páginas, dos gargalos e problemas da
operação da SEALog, identificados no enunciado do Desafio Prático em Grupo (SEAL 2026.2) e
agrupados por etapa da operação. A partir dele, a documentação propõe a solução: cada regra diz se
é fato do resumo ou proposta, e cada história aponta o gargalo que resolve.

Nas referências, o resumo é citado como `Gargalos §N`. Ele não numera as seções; a numeração está
em [`docs/01-sealog/00-visao-geral.md`](../docs/01-sealog/00-visao-geral.md) §9.

O enunciado completo do desafio ainda não foi recebido (`Q-GERAL-01`).

---

## Inventário

| Sistema | Tipo | Arquivo | Páginas | Tam. | Recebido em | `sha256` (12) |
|---|---|---|---:|---:|---|---|
| `SL` | Resumo dos gargalos | `SEALog gargalos e problemas da operação.pdf` | 2 | 88K | 27/10/2026 | `31c00f043661` |

`sha256` completo: `31c00f043661f79ad20ce9b2655d0ef4d3a532a795e9a3d20a4b450034124725`.
