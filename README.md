# Requisitos SEAL

Documentação de requisitos do **SEALog**, o sistema proposto para a operação de entregas da
SEALog — o caso do Desafio Prático em Grupo do **SEAL 2026.2** —, e o aplicativo navegável que a
apresenta.

Hoje a operação inteira corre em grupos de WhatsApp e em planilhas. O resumo dos gargalos aponta a
causa comum: **não existe fonte única da verdade sobre o estado de cada entrega**. O SEALog é essa
fonte: o pedido é validado na entrada, a entrega tem um registro só, o motorista registra cada
parada no celular, o cliente acompanha por um link e é avisado quando há problema, e a cobrança
sai do mesmo registro.

---

## O sistema

| Sigla | Sistema | Papel | Documentação |
|---|---|---|---|
| `SL` | SEALog | Registro único da entrega, do pedido à cobrança | [`docs/01-sealog/`](docs/01-sealog/) |

| Módulo | O que resolve | HUs |
|---|---|---|
| Entrada de pedidos | Pedidos incompletos, formatos misturados, sem validação | `HU-SL-001` a `004` |
| Registro e planejamento | Planilhas divergentes, etiqueta à mão, rota sem ferramenta, roteiro por WhatsApp | `HU-SL-005` a `010` |
| Execução do motorista | Atualização em lote, foto solta no grupo, motorista sem sinal | `HU-SL-011` a `015` |
| Consulta de status | Cadeia de 5 saltos, de 20 min a mais de 2 h | `HU-SL-016`, `017` |
| Exceções e decisões | Retorno sem regra, cliente não avisado, sem visão por cliente | `HU-SL-018` a `021` |
| Financeiro | Cobrança sobre planilhas manuais | `HU-SL-022`, `023` |
| Acesso | Entrada por perfil | `HU-SL-024` |

24 histórias, 51 regras de negócio, 6 fluxogramas, 17 telas, 14 entidades e 3 integrações.

---

## Por onde começar

1. **[Panorama do projeto](docs/00-visao-geral/panorama-sistemas.md)** — a operação hoje, onde ela
   quebra e como a documentação está organizada.
2. **[Visão geral do SEALog](docs/01-sealog/00-visao-geral.md)** — escopo, módulos, os quatro casos
   do enunciado e as restrições.
3. **[Divergências e riscos](docs/00-visao-geral/divergencias-e-riscos.md)** — o que está em aberto
   e as perguntas que bloqueiam.
4. As páginas de produto em `docs/00-visao-geral/`: decisões, requisitos funcionais e não
   funcionais, backlog e priorização, arquitetura, infraestrutura e custos, adoção gradual e
   escalabilidade.
5. Os demais arquivos de `docs/01-sealog/`, na ordem.

> **Atenção ao ler:** a origem não é engenharia reversa de um sistema existente. É um resumo dos
> gargalos da operação, e os requisitos são a proposta de solução. Cada regra diz se é fato da
> origem ou proposta; o que só a SEALog pode decidir está como pergunta (`Q-SL-*`).

---

## Estrutura

```
docs/
├── 00-visao-geral/            visão do projeto e páginas de produto
├── 01-sealog/                 os dez arquivos do SEALog
└── _convencoes/
    ├── CONVENCOES.md          contrato de formato — leia antes de escrever
    └── VERSIONAMENTO.md       versão de cada HU

data/                          modelo canônico que alimenta o app (gerado de docs/)
fontes/                        inventário dos documentos de origem

src/                           aplicativo de requisitos (Vite + React + TypeScript)
scripts/
├── gerar-requisitos-json.mjs  docs/ → data/requisitos.json
├── conferir-md-vs-json.mjs    a página mostra tudo o que o Markdown declara
└── medir-placar.mjs           placar de estrutura e medição de jargão
```

Cada pasta de sistema contém os mesmos dez documentos:

| Arquivo | Conteúdo |
|---|---|
| `00-visao-geral.md` | Propósito, escopo, operação de hoje, módulos, casos, restrições |
| `01-atores-e-permissoes.md` | Atores, matriz de permissões, autenticação |
| `02-regras-de-negocio.md` | Catálogo de regras `RN-*`, cada uma fato ou proposta |
| `03-historias-de-usuario.md` | HUs com critérios de aceitação |
| `04-fluxogramas.md` | Fluxogramas em prancha desenhada (bloco ` ```board `) |
| `05-telas-e-campos.md` | Dicionário de dados por tela |
| `06-modelo-de-dados.md` | Entidades e domínios |
| `07-integracoes.md` | Integrações externas |
| `08-mensagens-e-erros.md` | Catálogo de mensagens |
| `09-divergencias-e-lacunas.md` | Divergências, riscos, perguntas e cobertura da fonte |

---

## Identificadores

| Artefato | Formato | Exemplo |
|---|---|---|
| História de usuário | `HU-<SIS>-<NNN>` | `HU-SL-014` |
| Regra de negócio | `RN-<SIS>-<NNN>` | `RN-SL-007` |
| Critério de aceitação | `CA<n>` (local à HU) | `CA2` |
| Fluxograma | `FLX-<SIS>-<NN>` | `FLX-SL-03` |
| Tela | `TL-<SIS>-<NNN>` | `TL-SL-012` |
| Integração externa | `INT-<NNN>` (global) | `INT-001` |
| Entidade | `ENT-<SIS>-<NNN>` | `ENT-SL-002` |
| Mensagem do sistema | `MSG-<SIS>-<NNN>` | `MSG-SL-018` |
| Divergência ou risco | `DIV-<SIS>-<NN>` | `DIV-SL-03` |
| Pergunta ao cliente | `Q-<SIS>-<NN>` | `Q-SL-07` |

---

## Origem da documentação

| Documento | Recebido em | Como se cita |
|---|---|---|
| `SEALog gargalos e problemas da operação.pdf` — resumo dos gargalos identificados no enunciado do Desafio Prático em Grupo (SEAL 2026.2) | 27/10/2026 | `Gargalos §N` |

Inventário com `sha256` em [`fontes/README.md`](fontes/README.md). O enunciado completo ainda não foi
recebido (`Q-GERAL-01`).

---

## O aplicativo de requisitos

A documentação alimenta um aplicativo navegável, no modelo do app de referência SIAL: cada história
com descrição, regras e critérios, ligada aos fluxogramas e às telas em que aparece, com download
em PDF.

```
docs/*.md  →  data/requisitos.json  →  app (React, estático)
   ↑ fonte      npm run data:gerar
     da verdade
```

```bash
npm install
npm run data:sync      # docs/ → data/requisitos.json, e confere Markdown × JSON
npm run dev
```

Não há banco nem login: o app é um site estático que lê o JSON. Detalhes de arquitetura e
convenções do app: [`CLAUDE.md`](CLAUDE.md).
