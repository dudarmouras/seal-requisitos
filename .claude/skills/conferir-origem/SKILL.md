---
name: conferir-origem
description: Confere um documento de origem do projeto SEAL (o resumo dos gargalos da SEALog, o enunciado do Desafio Prático em Grupo, atas ou respostas da SEALog às perguntas Q-SL-*) contra a documentação de requisitos deste repositório e deixa as correções pendentes na branch. Use quando o usuário der o caminho de um documento de origem, ou pedir para conferir, auditar, comparar com a origem, padronizar a linguagem, tirar o jargão técnico das histórias, ou deixar uma HU no padrão de tela do app. Recebe só o caminho; o resto é autônomo.
---

# Conferir origem

Uma passada completa: lê o documento de origem no caminho dado, confere item a item contra
`docs/`, reescreve o que está tecnicamente cru para o registro publicado, verifica os padrões do
repositório e **deixa tudo pendente na branch**. Não commita.

A entrada é **um caminho**. Se o usuário não deu, pergunte só isso e nada mais. Formas aceitas:

| Caminho | O que fazer |
|---|---|
| Um `.pdf`, `.md`, `.docx` ou `.html` | Conferir o recorte que aquele documento cobre |
| Pasta | Percorrer todos os documentos que houver |
| `.zip` | Extrair no scratchpad da sessão, nunca dentro do repositório, e tratar como pasta |
| Um recorte de `docs/` (`docs/01-sealog/`) | Sem origem nova: só as etapas 4 a 6 (registro publicado, padrões, verificação) |

**Nunca copie o material de origem para dentro do repositório.** Os originais não são
versionados: `fontes/README.md` os inventaria por `sha256`, e é só isso que entra.

---

## 1. Inventariar e conferir integridade

Calcule o `sha256` de cada arquivo e compare os 12 primeiros caracteres com a tabela de
[`fontes/README.md`](../../../fontes/README.md). Três desfechos:

- **Igual ao inventário** — a documentação está em cima da versão certa. Segue para a conferência.
- **`sha256` diferente** — a origem mudou. **É a prioridade da passada:** o que mudou é candidato a
  divergência em `docs/`. Atualize a linha do inventário só depois de conferir.
- **Fora do inventário** — material novo. Inventarie-o em `fontes/README.md`, com um nome de
  citação próprio (como `Gargalos §N` é para o resumo), e registre a numeração das seções dele em
  `docs/01-sealog/00-visao-geral.md` §9.

O enunciado completo do desafio é o material novo mais provável (`Q-GERAL-01`). Ele manda sobre o
resumo dos gargalos, que é derivado dele.

## 2. Anotar o placar de partida

Leia os dez arquivos do sistema em `docs/` e anote o placar **antes** de mexer em nada:

```bash
npm run data:gerar && node scripts/medir-placar.mjs --sistema=sl
```

## 3. Conferir item a item

> **Esta etapa é a única que acha o que falta.** A etapa 4 reescreve o texto que já existe; esta
> lê a origem e pergunta, item por item, onde `docs/` responde a ele.

### 3.1 Percorrer

Percorra a origem seção por seção, item por item. **Toda afirmação sua carrega evidência**:
`arquivo.md:linha`, ou a busca que voltou vazia. Quatro achados possíveis:

| Achado | Como tratar |
|---|---|
| **Na origem, sem resposta em `docs/`** | Lacuna: regra, história, ou `Q-SL-*`, com `**Referências**` para a seção da origem |
| **Em `docs/` como fato, mas a origem não diz** | Pode ser invenção. Ou a regra passa a dizer `Proposta` na coluna `Referência` do `02`, ou vira `Q-SL-*` |
| **Divergente** | Número, horário, quantidade, nome de papel. A origem ganha; se duas origens se contradizem, `DIV-SL-*` |
| **Pergunta respondida** | A resposta da SEALog fecha uma `Q-SL-*`: a regra recebe o valor, a pergunta recebe `**Desfecho**`, e a HU afetada sobe de versão (`VERSIONAMENTO.md`) |

O que só a SEALog decide — preço, prazo, horário de corte, número de tentativas — nunca recebe
número plausível: ou vem da origem, ou é `Q-SL-*`.

### 3.2 Registrar o que foi conferido

O resultado fica na tabela **`Cobertura da conferência com a fonte`**, em
`docs/01-sealog/09-divergencias-e-lacunas.md`: uma linha por seção da fonte, com módulo, itens
conferidos (`3 de 3`), data e achados. A subtabela "Item a item" liga cada gargalo à resposta.

- **Toda seção da fonte tem linha**, conferida ou não. Parcial se escreve parcial: `2 de 6`.
- **`Achados` prova a conferência.** "nenhum" é resposta válida; `—` significa que não percorreu.

## 4. Corrigir o que está tecnicamente cru

O alvo é o registro publicado de
[`docs/_convencoes/CONVENCOES.md`](../../../docs/_convencoes/CONVENCOES.md) §9, e a calibração
está em [`registro-publicado.md`](registro-publicado.md). **Leia esse arquivo antes de reescrever a
primeira linha.**

```bash
node scripts/medir-placar.mjs --sistema=sl --detalhe
```

1. **Antes de retirar um identificador, garanta o rastreio.** Se ele não está em
   `**Origem legada**`, `**Integrações e APIs**`, `**Referências**` ou na coluna `Catálogo` da
   mesma HU, acrescente-o lá primeiro.
2. **Reescreva os campos publicados** — descrição, as três linhas da história, coluna `Regra`, e
   `Cenário` / `Dado` / `Quando` / `Então`. Nomeie a função, não o artefato.
3. **Não invente comportamento.** Uma regra honestamente incompleta, com `Q-SL-*`, é melhor que uma
   regra inventada que soa bem.
4. **Nada de estrutura muda.** Mesma quantidade de `RN<n>` e `CA<n>`, mesma ordem, mesmos ids.

## 5. Conferir os padrões do repositório

- **`**Integrações e APIs**` é literal de parser** em três pontos de
  `scripts/gerar-requisitos-json.mjs`. Renomear faz a HU receber `integrationsNote: null` em
  silêncio. Toda HU tem essa seção preenchida.
- **Id nunca é renumerado.** Acréscimo vai no fim da faixa.
- **Índice e total de `02-regras-de-negocio.md`** acompanham qualquer `RN-*` acrescentada.
- **Fluxograma é bloco ` ```board `**, com coordenada em coluna e linha (`c`/`r`), não pixel.
- **`data/requisitos.json` e o banco nunca são editados à mão.**
- **A página da HU tem a estrutura da SIAL e nada além:** não mostra Atores, Origem legada nem
  Referências, que continuam no Markdown.
- Sem emoji, sem linguagem de marketing, número e limite sempre explícitos.

## 6. Verificar

```bash
npm run data:gerar                                    # falha alto: âncora órfã, id repetido, aresta solta
node scripts/medir-placar.mjs --sistema=sl --falhar-se-jargao
npm run data:conferir                                 # a página mostra tudo o que o Markdown declara
npm run build                                         # só se tocou em src/
```

- `data:gerar` sem exceção e sem aviso de id órfão.
- Placar de estrutura não regride, e HUs com nota de integração continua igual ao total de HUs.
- Jargão a zero.
- A tabela de cobertura lista todas as seções da fonte.

**Não rode `npm run data:carregar` nem `data:sync`** por conta própria: eles truncam e reescrevem
o banco. A recarga é decisão do usuário.

## 7. Entregar pendente

- **Não commite, não faça `git add`, não crie branch, não faça push.**
- **Não crie arquivo de plano nem de task.** Decisão pendente mora no `09`, como `Q-*` e `DIV-*`.
  Fora de `docs/`, a passada só pode tocar `fontes/README.md`.

Feche com um relatório: **Problema** (o que a conferência achou, com evidência), **Cobertura**
(seções conferidas e módulos com linguagem reescrita, separadamente), **Solução** (o que mudou,
arquivo por arquivo; o que ficou fora; o que precisa de decisão), **Invariantes** (placar antes e
depois) e **Aceite** (de 3 a 7 itens verificáveis, um deles a tabela de cobertura atualizada).

Não chame de "coberto" o módulo que só passou pela etapa 4. Diga "linguagem limpa, conferência
pendente".
