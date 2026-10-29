# Documentos de origem

Inventário do material recebido sobre o projeto SEAL, usado como base desta documentação de
requisitos. Serve para rastreabilidade: quando um documento for atualizado, o `sha256` muda e a
documentação derivada precisa ser revisada.

**Local dos arquivos:** `~/Downloads/`
*(fora deste repositório — os originais não são versionados aqui)*

---

## Como a documentação foi produzida

A origem **não é engenharia reversa**: é o enunciado do Desafio Prático em Grupo (SEAL
2026.2/2027.1), o material de apoio, a reunião com o cliente e o planejamento da equipe. A partir
deles a documentação propõe a solução: cada regra diz se é fato da origem ou proposta, e cada
história aponta o gargalo que resolve.

Quando as fontes discordam, vale a mais recente: **a reunião de 28/10/2026 manda sobre o
enunciado**. Foi nela que o cliente contou que a SEALog terceirizou as entregas.

| Fonte | Recebida em | Como se cita | O que decide |
|---|---|---|---|
| Enunciado (`Projeto da Dinâmica.pdf`) | 29/10/2026 | `Enunciado §N` — as seções 1 a 8 do PDF | A operação antes da terceirização, os horários, os dados do pedido, os quatro casos, o que a entrega precisa mostrar |
| Material de apoio (`Material de Apoio para o Projeto da Dinâmica.pdf`) | 29/10/2026 | `Apoio §N` | As técnicas sugeridas: requisitos, stakeholders, casos de uso, arquitetura, backlog, MVP, MoSCoW, modelagem |
| Resumo dos gargalos (`SEALog gargalos e problemas da operação.pdf`) | 27/10/2026 | `Gargalos §N` | Derivado do enunciado; a numeração está em [`docs/01-sealog/00-visao-geral.md`](../docs/01-sealog/00-visao-geral.md) §9 |
| Encontro 1 com o cliente, Equipe 11 | 28/10/2026 | `Encontro 1 [mm:ss]` — o minuto da transcrição | A terceirização, a coleta pela terceirizada, o padrão de comprovação, as restrições de custo e os 400 pedidos por dia |
| Planejamento da equipe | 29/10/2026 | `Planejamento da equipe` | Papéis, decisões da primeira reunião e a lista RF-01 a RF-20 |

A transcrição do Encontro 1 não é versionada: ela traz nomes de participantes e o link da
gravação. As decisões dela estão registradas em `docs/`, com o minuto citado.

---

## Inventário

| Sistema | Tipo | Arquivo | Páginas | Tam. | Recebido em | `sha256` (12) |
|---|---|---|---:|---:|---|---|
| `SL` | Enunciado | `Projeto da Dinâmica.pdf` | 11 | 2,7M | 29/10/2026 | `9e17c598309a` |
| `SL` | Material de apoio | `Material de Apoio para o Projeto da Dinâmica.pdf` | 13 | 1,2M | 29/10/2026 | `2146f88a5c89` |
| `SL` | Resumo dos gargalos | `SEALog gargalos e problemas da operação.pdf` | 2 | 88K | 27/10/2026 | `31c00f043661` |

`sha256` completos:

- `Projeto da Dinâmica.pdf`: `9e17c598309ae091492d3e2d6be6d370c8c24bc155b99153f146e23748eb3419`
- `Material de Apoio para o Projeto da Dinâmica.pdf`: `2146f88a5c8956e33ff2f69e3899316a837149afa0d834355c206ad62e0348d6`
- `SEALog gargalos e problemas da operação.pdf`: `31c00f043661f79ad20ce9b2655d0ef4d3a532a795e9a3d20a4b450034124725`
