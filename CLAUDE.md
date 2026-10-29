# Requisitos SEAL — documentação e aplicativo

Repositório da documentação de requisitos do **SEALog**, o sistema proposto para a operação de
entregas da SEALog no Desafio Prático em Grupo do SEAL 2026.2, e do **aplicativo navegável** que a
apresenta — histórias de usuário, regras de negócio, critérios de aceitação, fluxogramas e telas.
O repositório foi refeito em 29/10/2026 a partir do `requisitos-FDE`
(`github.com/volund-ia/requisitos-FDE`), de onde vêm o app, os scripts e o contrato de formato;
o formato, por sua vez, segue o app de referência SIAL (`github.com/volund-ia/fluxograma-sial`).

## A origem não é engenharia reversa

No FDE, `docs/` descrevia sistemas em produção. Aqui não há sistema: a única fonte é o resumo
`SEALog gargalos e problemas da operação.pdf` (citado como `Gargalos §N`), e os requisitos são a
**proposta de solução**. Daí três regras que valem em todo `docs/`:

- Toda regra do catálogo (`02`) diz na coluna `Referência` se é **fato da origem** ou **proposta**,
  e a proposta cita o gargalo que resolve.
- O que só a SEALog decide — preço, prazo, horário de corte, política de tentativas — vira
  `Q-SL-*` no `09`, **nunca** um número plausível.
- `**Origem legada**` de cada HU descreve **como a operação faz aquilo hoje** (WhatsApp, planilha),
  e o `legacyStack` do sistema é "Operação manual: WhatsApp + planilhas".

O enunciado completo do desafio ainda não chegou (`Q-GERAL-01`). Quando chegar, passa por
`/conferir-origem`.

## A cadeia de dados

```
docs/*.md  →  data/requisitos.json  →  Postgres (Supabase)  →  app (React)
   ↑ fonte      scripts/gerar-        scripts/carregar-        src/lib/data.tsx
     da         requisitos-json.mjs   banco.mjs
     verdade
```

**O Markdown em `docs/` é sempre a fonte da verdade.** O JSON é derivado dele; o banco é uma
projeção do JSON. Nunca edite `data/requisitos.json` nem o banco à mão.

Depois de mexer em `docs/`, rode `npm run data:gerar` e `npm run data:conferir`; `npm run
data:sync` também recarrega o banco (trunca e reescreve as tabelas numa transação).

**O app leva o Markdown inteiro.** HU, fluxograma e tela são lidos campo a campo; os arquivos de
cada sistema e da visão geral também entram **integrais** na leitura integral
(`/doc/<sistema>/<arquivo>`), e um índice por id (`RN-*`, `ENT-*`, `INT-*`, `MSG-*`, `DIV-*`, `Q-*`,
e os da visão de produto, `DEC-*`, `RF-*`, `RNF-*`, `BL-*`) aponta para a seção ou a linha de tabela
que define cada um (`/id/<id>`). A leitura integral está em
[`scripts/lib/documentos.mjs`](scripts/lib/documentos.mjs).

## Comandos

| Ação | Comando |
|---|---|
| Desenvolvimento (modo local, lendo o JSON) | `VITE_LOCAL_DATA=1 npm run dev` |
| Desenvolvimento contra o banco | `npm run dev` |
| Build | `npm run build` |
| `docs/` → `data/requisitos.json` | `npm run data:gerar` |
| `data/requisitos.json` → banco | `npm run data:carregar` |
| Os dois acima em sequência | `npm run data:sync` |
| Placar de estrutura + medição de jargão | `npm run data:placar` |
| Conferir que a página mostra tudo o que o Markdown declara | `npm run data:conferir` |

## O sistema

Um sistema, `SL` (SEALog), em `docs/01-sealog/`, com os dez arquivos do contrato: 7 módulos, 24
HUs, 51 regras, 6 fluxogramas, 17 telas, 14 entidades, 3 integrações (`INT-001` a `INT-003`, faixa
`INT-001` a `INT-009`). Sistema novo entra em `SYSTEMS` de
[`scripts/gerar-requisitos-json.mjs`](scripts/gerar-requisitos-json.mjs), em `PASTAS` de
[`scripts/conferir-md-vs-json.mjs`](scripts/conferir-md-vs-json.mjs) e em `PASTA_DO_SISTEMA` de
[`src/lib/mdblock.tsx`](src/lib/mdblock.tsx). **A sigla tem de ter duas letras**: `RE_ID` e o app só
reconhecem `XX-NNN`.

A visão geral transversal fica em `docs/00-visao-geral/`: panorama, atores, glossário, catálogo
consolidado de integrações (o gerador lê a seção `## 2. Catálogo consolidado`) e divergências e
riscos do projeto. A mesma pasta tem as **páginas de produto**, com rota própria no app:
decisões (`/decisoes`, `DEC-SL-*`), requisitos funcionais e não funcionais (`/requisitos`,
`RF-SL-*`, `RNF-SL-*`), backlog e priorização (`/backlog`, `BL-SL-*`), arquitetura
(`/arquitetura`), infraestrutura e custos (`/infraestrutura`), adoção gradual (`/adocao`) e
escalabilidade (`/escalabilidade`).

## Banco

- Schema **`app_requisitos_seal`**, definido em [`supabase/schema.sql`](supabase/schema.sql)
  (reexecutável). Ainda não há projeto Supabase do SEAL: sem a chave, o app roda em modo local.
- Dez tabelas: `systems`, `modules`, `hus`, `boards`, `screens`, `integrations`, `documents`,
  `artifacts`, `endpoints` e `contracts`. O PostgREST devolve no máximo mil linhas por resposta; o
  app pagina (`selectAll` em `src/lib/data.tsx`).
- **RLS:** leitura liberada ao role `anon`. O app tem só uma **tela de login de conta única**
  ([`src/lib/auth.tsx`](src/lib/auth.tsx)), que barra a interface no navegador mas não a API.
  Escrita só por `service_role` / conexão direta.
- Para a API REST enxergar o schema, ele precisa estar exposto (`pgrst.db_schemas` no
  `schema.sql`, e Project Settings → Data API → **Exposed schemas**). `PGRST106` é schema não
  exposto; `PGRST205` é schema cache velho (`notify pgrst, 'reload schema'`).

## Configuração

`.env.local` (nunca versionado; modelo em `.env.example`): `DATABASE_URL` para os scripts de carga;
`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` para o app. Sem `VITE_SUPABASE_ANON_KEY` o app entra
em **modo local** automaticamente e lê `data/requisitos.json` — o mesmo que `VITE_LOCAL_DATA=1`
força. A conta única de acesso está em `src/lib/auth.tsx`.

## Convenções do app

- **Fluxogramas são pranchas desenhadas** (bloco ` ```board ` em `04-fluxogramas.md`, React Flow).
  A prancha declara **coluna e linha** de cada nó (`c`/`r`), não pixel; a conversão está só em
  [`src/lib/flow.ts`](src/lib/flow.ts). **Quem edita o fluxo edita o bloco `board`.** O gerador
  valida id repetido, aresta para nó inexistente, nó sem coordenada e HU ancorada que não existe, e
  falha alto. O bloco ` ```mermaid ` continua aceito.
- **Identificadores são a chave em tudo:** `HU-*`, `FLX-*`, `TL-*`, `INT-*`, `RN-*`. A UI mostra o
  id quando não consegue resolver o alvo — o vazio é informação.
- **Markdown inline no conteúdo:** renderize com `<Md text={…} />` (`src/lib/md.tsx`), nunca cru.
- **A UI não corrige a origem.** Campo ausente aparece como ausente.
- **Dois registros de escrita, e não se misturam.** Campo **publicado** — descrição, história,
  regras, critérios — em linguagem corrente, sem identificador de código. Campo de **rastreio** —
  `**Origem legada**`, `**Integrações e APIs**`, `**Referências**`, coluna `Catálogo`, e os arquivos
  `02`, `05`, `06`, `07`, `08` — com a grafia exata. A regra está em
  [`docs/_convencoes/CONVENCOES.md`](docs/_convencoes/CONVENCOES.md) §9. O placar
  (`npm run data:placar`) tem de dar zero jargão; `WhatsApp` e `SEALog` estão na lista de exceções
  de [`scripts/medir-placar.mjs`](scripts/medir-placar.mjs). [`HuPage.tsx`](src/pages/HuPage.tsx)
  reproduz a ordem da SIAL e **não exibe `**Atores**`, `**Origem legada**` nem `**Referências**`**.
- **`**Integrações e APIs**` é o rótulo canônico** e marcador de parser em três pontos de
  `gerar-requisitos-json.mjs`. Renomear só na documentação faz a HU receber `integrationsNote: null`
  **em silêncio**. Confira o placar: 24 HUs, 24 com nota de integração.
- **Ocultar do deploy sem tirar de `docs/`:** [`scripts/lib/ocultos.mjs`](scripts/lib/ocultos.mjs)
  continua disponível, vazio hoje.

## Versionamento das HUs

Versão, data e escopo de cada HU em `data/versoes.json`, mostrados na página da HU. O arquivo
começa vazio (todas as HUs v1.0, base de 29/10/2026); a regra está em
[`docs/_convencoes/VERSIONAMENTO.md`](docs/_convencoes/VERSIONAMENTO.md).

## Conferir a origem

A passada de conferência é a skill `/conferir-origem <caminho>`, em
[`.claude/skills/conferir-origem/`](.claude/skills/conferir-origem/SKILL.md): confere o `sha256`
contra [`fontes/README.md`](fontes/README.md), compara item a item com `docs/`, reescreve o texto
publicado, roda `data:gerar` e o placar, e **deixa tudo pendente na branch**. Decisão pendente e
pergunta à SEALog moram no `09`, como `Q-*` e `DIV-*`; a tabela `Cobertura da conferência com a
fonte` do `09` diz o que já foi conferido.

## Download em PDF

A página do sistema tem **Baixar requisitos** e **Baixar fluxogramas**, gerados no navegador com
`@react-pdf/renderer` ([`src/pdf/`](src/pdf/), import dinâmico). Capa e rodapé leem
[`src/version.json`](src/version.json): **atualize-o a cada versão publicada**. Armadilhas: não ponha
`lineHeight` na `<Page>`; use uma `<Page>` por HU em vez de `break` numa `View`.

## Git

- Branch padrão: `main`. Remote: `origin` (`github.com/dudarmouras/sial-requisitos`).
- Antes de commitar, confira que `.env.local` continua fora do versionado.
