# Convenções da documentação de requisitos — SEAL

Contrato único de formato. Todo documento de sistema segue estas regras, para que a documentação
possa ser lida de forma uniforme e convertida em dados estruturados (`data/requisitos.json`) que
alimentam o aplicativo de requisitos. O formato veio do projeto de requisitos do FDE, que por sua
vez segue o app de referência SIAL; o que muda aqui é a natureza da origem (§1).

---

## 1. Princípio fundamental: não inventar, e dizer de onde vem

No SEALog não há sistema legado a reverter. A origem é o resumo dos gargalos da operação, e os
requisitos são a **proposta de solução** para eles. Isso torna mais importante, não menos, saber
de onde vem cada afirmação.

**Regras:**

1. **Fato da origem ou proposta, sempre explícito.** Toda regra do catálogo diz na coluna
   `Referência` se é fato da origem (`Gargalos §N`) ou proposta (`Proposta — resolve Gargalos
   §N`). Proposta sem gargalo que a justifique não entra.
2. **Nunca inventar o que só o cliente decide.** Preço, prazo, política de tentativas, horário de
   corte: se a origem não diz, o documento abre `Q-<SIS>-NN` e escreve a regra sem o número — nunca
   um número plausível apresentado como fato. Campo sem informação recebe `Não informado na
   documentação de origem`.
3. **Rastreabilidade obrigatória.** Toda história cita os gargalos que resolve em
   `**Referências**`. Ver §7.
4. **Separar como é hoje do que o sistema faz.** Como a operação faz aquilo hoje vai no campo
   `**Origem legada**` da história; o comportamento do sistema, na descrição e nas regras.
5. **Nunca resumir para caber.** Se uma tela tem 12 campos, os 12 estão no dicionário. Não existe
   "entre outros" nem "etc.".

---

## 2. Identificadores

Códigos estáveis. Uma vez atribuído, um ID nunca é reaproveitado nem renumerado.

| Sigla | Sistema |
|---|---|
| `SL` | SEALog |

A sigla tem **duas letras**: o gerador, o índice por id e o app só reconhecem `XX-NNN`. Siglas de
projeto inteiro (`GERAL`) ficam fora do índice.

| Artefato | Formato | Exemplo | Escopo da numeração |
|---|---|---|---|
| História de usuário | `HU-<SIS>-<NNN>` | `HU-SL-014` | Sequencial dentro do sistema |
| Regra de negócio (catálogo) | `RN-<SIS>-<NNN>` | `RN-SL-007` | Sequencial dentro do sistema |
| Regra de negócio (dentro da HU) | `RN<n>` | `RN3` | Local à HU, começa em 1 |
| Critério de aceitação | `CA<n>` | `CA2` | Local à HU, começa em 1 |
| Fluxograma | `FLX-<SIS>-<NN>` | `FLX-SL-03` | Sequencial dentro do sistema |
| Tela | `TL-<SIS>-<NNN>` | `TL-SL-012` | Sequencial dentro do sistema |
| Integração externa | `INT-<NNN>` | `INT-001` | **Global**, em faixas por sistema |
| Entidade de dados | `ENT-<SIS>-<NNN>` | `ENT-SL-002` | Sequencial dentro do sistema |
| Mensagem do sistema | `MSG-<SIS>-<NNN>` | `MSG-SL-018` | Sequencial dentro do sistema |
| Divergência / risco | `DIV-<SIS>-<NN>` | `DIV-SL-03` | Sequencial dentro do sistema |
| Pergunta ao cliente | `Q-<SIS>-<NN>` | `Q-SL-07` | Sequencial dentro do sistema |

Módulos usam slug em minúsculas com hífen: `entrada-pedidos`, `execucao-motorista`. O slug é
estável e vira `module.id` no JSON.

---

## 3. Estrutura de arquivos por sistema

Cada sistema ocupa uma pasta `docs/<NN>-<slug-sistema>/` com exatamente estes arquivos:

| Arquivo | Conteúdo |
|---|---|
| `00-visao-geral.md` | Propósito, escopo, como a operação é hoje, módulos, casos, restrições, volumetria, origem |
| `01-atores-e-permissoes.md` | Atores, matriz de permissões por funcionalidade, autenticação |
| `02-regras-de-negocio.md` | Catálogo completo `RN-<SIS>-<NNN>`, cada regra marcada como fato ou proposta |
| `03-historias-de-usuario.md` | HUs com regras, critérios de aceitação e referências |
| `04-fluxogramas.md` | Fluxogramas em prancha desenhada (bloco ` ```board `) |
| `05-telas-e-campos.md` | Dicionário de dados de cada tela: campo a campo |
| `06-modelo-de-dados.md` | Entidades, atributos, domínios |
| `07-integracoes.md` | Sistemas externos, direção, falhas |
| `08-mensagens-e-erros.md` | Catálogo de mensagens |
| `09-divergencias-e-lacunas.md` | `DIV-*` e `Q-*`, e a cobertura da conferência com a fonte |

Arquivo grande é aceitável. Arquivo incompleto não é.

---

## 4. Formato da história de usuário

Toda HU segue exatamente este gabarito. Campos sem conteúdo recebem
`Não informado na documentação de origem` — nunca são omitidos.

```markdown
### HU-SL-014 — Registrar ocorrência de entrega não realizada

| | |
|---|---|
| **Módulo** | `execucao-motorista` |
| **Sistema** | SEALog |
| **Atores** | Motorista |
| **Telas** | `TL-SL-012` Registro da parada |
| **Origem legada** | Hoje: o problema é avisado no grupo de WhatsApp, onde a mensagem se perde |
| **Prioridade** | Alta |

**Como** motorista
**Gostaria de** registrar, na própria parada, que não consegui entregar e por quê
**Para que** o problema chegue a quem decide e ao cliente, em vez de se perder no grupo.

**Descrição**

Parágrafo objetivo do que a funcionalidade faz, incluindo pré-condições e efeitos
(avisos, mudanças de status, o que aparece em outra tela).

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Não entregue exige um motivo da lista; foto e observação são opcionais. | `RN-SL-029` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Ocorrência | que o destinatário não estava | escolho Não entregue e "Destinatário ausente" | a ocorrência aparece no painel e o cliente recebe o aviso. |
| CA2 | Sem motivo | que escolhi Não entregue | tento concluir sem motivo | o aplicativo pede o motivo e não conclui. |

**Integrações e APIs** — `INT-001` WhatsApp, para o aviso automático ao cliente.

**Referências** — Gargalos §3, §5, §7 (caso "Buquê de sábado").
```

No SEALog, `**Origem legada**` descreve **como a operação faz aquilo hoje** — não há sistema
legado. Quando houver implementação, `**Implementação**` é o último campo da HU, depois de
`**Referências**`, e aponta tela, endpoint e arquivo (§12). É rastreio: não aparece na página.

Critérios de aceitação cobrem, no mínimo: caminho feliz, cada validação que bloqueia, cada regra
de permissão e o comportamento de erro.

---

## 5. Formato do dicionário de campos

Em `05-telas-e-campos.md`, cada tela tem cabeçalho com identificação e uma tabela por seção.

```markdown
### TL-SL-009 — Coletas e recebimento no galpão

| | |
|---|---|
| **Rota legada** | Hoje: combinado por mensagem; chegada ao galpão sem registro |
| **Rota proposta** | `/galpao` |
| **Perfis** | Analista, Coordenador |
| **HUs** | `HU-SL-007` |

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `horario` | Horário | time | hora | — | Sim | `hh:mm` | entre 14:00 e 18:00 | `Coleta.horario` | Fora da janela, `MSG-SL-009` |
```

Colunas nunca são suprimidas. Valor ausente é `—`. Campo com domínio fechado remete à tabela de
domínio em `06-modelo-de-dados.md`. `Rota legada` diz onde aquilo é feito hoje; `Rota proposta`
é sugestão de endereço.

A tabela de campos aceita `Campo` ou `Coluna` como primeiro cabeçalho; as dez colunas são as
mesmas. Além dela, a tela tem as seções que se aplicarem, com cabeçalho `####`:

| Seção | Cabeçalho da tabela | Quando |
|---|---|---|
| `#### Ações da tela` | `Ação \| Controle \| Quem pode \| Observações` | Toda tela que tem botão, link ou comando |
| `#### Colunas do resultado` | `Coluna \| Rótulo \| Origem \| Observações` | Tela com lista ou grade |
| `#### Conteúdo` | `Bloco \| Texto \| Links e contatos` | Página só de leitura: o que ela mostra, bloco a bloco |

---

## 6. Formato dos fluxogramas

Todo fluxograma é uma **prancha desenhada**, num bloco ` ```board ` (§6.1). Cada fluxograma tem
ID, título, escopo e as HUs que cobre.

```markdown
### FLX-SL-04 — A parada do motorista

**Escopo:** da chegada à parada ao status atualizado. **HUs:** `HU-SL-011` a `HU-SL-015`.

```board
{ "nodes": [ … ], "edges": [ … ], "groups": [ … ] }
```
```

Nó de decisão sempre do tipo `decision`, com todas as saídas rotuladas. Fluxo de exceção nunca é
omitido: se existe caminho de erro, ele aparece na prancha.

O gerador e o app ainda aceitam um diagrama em texto, num bloco ` ```mermaid `, no lugar da
prancha — um fluxograma tem um **ou** outro. Nenhum fluxograma o usa hoje.

### 6.1 Prancha desenhada (bloco ` ```board `)

Um bloco ` ```board ` com JSON que declara **coluna e linha** de cada nó. É o que permite ancorar
o código da HU ao lado do nó, agrupar região da prancha e destacar um requisito.

```jsonc
{
  "nodes": [
    // c e r são o CENTRO do nó, em unidades de grade — nunca pixel.
    { "id": "le", "label": "Lê a etiqueta do pacote", "c": 2.6, "r": 1.3,
      "hu": ["HU-SL-012"], "huSide": "right" },
    { "id": "daRota", "type": "decision", "label": "Etiqueta é desta rota?", "c": 2.6, "r": 2.6 }
  ],
  "edges": [
    // Sem fromSide/toSide, o lado é inferido pela posição relativa.
    { "from": "le", "to": "daRota" },
    { "from": "daRota", "to": "recusa", "label": "Não" }
  ],
  "groups": [
    { "id": "gMot", "title": "Motorista", "x1": -0.6, "y1": 0.2, "x2": 6.7, "y2": 1.8 }
  ]
}
```

| `type` | Uso |
|---|---|
| `action` (padrão) | passo que o sistema ou o ator executa |
| `dim` | início, fim e sistema externo |
| `decision` | ramificação; toda aresta que sai leva `label` |
| `label` | rótulo de raia, sem caixa |

Grade da casa: espinha do fluxo em `c 2.6`; recusa e falha à esquerda, em `c 0.6`; desvio, ramo
alternativo e chamada externa à direita, em `c 4.8` e `c 6.8`; passo de linha de `1.3`. Tamanho de
nó é derivado do texto — só use `w` quando o automático errar, e `wrap` para forçar a quebra.

**Rótulo não se repete no feixe.** Quando várias arestas chegam ao mesmo nó pelo mesmo motivo, o
rótulo fica em uma delas. A exceção é a saída de losango: cada decisão rotula **todas** as suas
saídas.

O gerador valida id repetido, aresta apontando para nó inexistente, nó sem coordenada e HU
ancorada que não existe — e falha a carga inteira, em vez de gerar prancha muda.

---

## 7. Rastreabilidade

Toda afirmação não trivial aponta para a origem, no fim da seção ou da HU:

```
**Referências** — Gargalos §3 (foto de comprovante solta no grupo), §7 (caso "Registro incorreto").
```

`Gargalos §N` é a seção N do resumo dos gargalos; a numeração está em
`docs/01-sealog/00-visao-geral.md` §9. Quando chegar uma fonte nova — o enunciado completo, uma
reunião com a SEALog —, ela entra em `fontes/README.md` com um nome de citação próprio.

Quando duas fontes se contradizem, documente as duas versões e abra `DIV-<SIS>-<NN>` em
`09-divergencias-e-lacunas.md`. Nunca escolha silenciosamente uma das versões.

---

## 8. Marcações padronizadas

Use exatamente estes prefixos, para que sejam localizáveis por busca:

```markdown
> **Divergência `DIV-SL-01`:** a proposta interpreta ou contraria a origem.

> **Pergunta `Q-SL-07`:** o que precisa ser confirmado com o cliente, e por que importa.

> **Risco:** o que pode dar errado na solução, com impacto.

> **Segurança:** exposição de dados ou prática insegura.

> **Decisão de projeto:** escolha da solução que não decorre direto de um gargalo.
```

---

## 9. Escrita

### 9.1 Os dois registros

Cada campo pertence a um de dois registros, e a escrita muda entre eles.

| Registro | Onde | Como escreve |
|---|---|---|
| **Publicado** — o que o leitor de negócio lê no app | `**Descrição**`, `**Como**` / `**Gostaria de**` / `**Para que**`, `**Regras de negócio**`, `**Critérios de aceitação**` | Linguagem corrente. **Nenhum identificador de código** (nome de atributo, tabela, rota, extensão de arquivo em crase). Nomeie a função, não o artefato. Explique o porquê quando ele não for óbvio. |
| **Rastreio** — a âncora técnica | `**Origem legada**`, `**Integrações e APIs**`, `**Referências**`, `**Implementação**`, coluna `Catálogo`, `02`, `05`, `06`, `07`, `08` | Grafia exata, em `code`: `Entrega.telefone_destinatario`, `/r/{token_rastreio}`. |

Nada se perde na tradução: o identificador que um campo publicado não pode trazer tem de estar em
algum campo de rastreio da mesma HU. `**Origem legada**`, `**Atores**` e `**Referências**` não
aparecem na página da HU; leem-se em `docs/` e na leitura integral do `03`.

### 9.2 Calibração

O alvo do registro publicado é a descrição de `HU-SL-013`, "Registrar o comprovante de entrega":

> Ao escolher Entregue, o aplicativo abre a câmera. O motorista fotografa o comprovante e informa
> o nome de quem recebeu. A foto é tirada na hora, pelo aplicativo, e não escolhida da galeria,
> para que não se troque a foto de uma entrega pela de outra.

O texto diz o que acontece e por quê, sem nome de campo, de tela ou de tabela. O equivalente em
rastreio — `Comprovante.foto`, `TL-SL-012`, `RN-SL-028` — está no `05`, no `06` e na coluna
`Catálogo`.

### 9.3 Demais regras

- Português do Brasil, voz ativa, presente do indicativo para descrever comportamento.
- Tabelas para fatos enumeráveis; prosa para explicar o porquê. Não escreva parágrafos dentro de
  células.
- Sem emoji. Sem linguagem de marketing. Sem "robusto", "poderoso", "simplesmente".
- Números e limites sempre explícitos: "entre 14h e 18h", não "à tarde".

O registro se mede com `npm run data:placar` — que aceita `--sistema=`, `--modulo=` e
`--detalhe` —, que tem de dar zero jargão. Nome de produto que é vocabulário do negócio
(`WhatsApp`, `SEALog`) está na lista de exceções do placar. A calibração de escrita completa está
em [`.claude/skills/conferir-origem/registro-publicado.md`](../../.claude/skills/conferir-origem/registro-publicado.md).

---

## 10. Modelo de dados alvo (`data/requisitos.json`)

A documentação em Markdown é a fonte para humanos; o JSON é a fonte para o aplicativo. Os tipos
exatos estão em `src/lib/types.ts`; o gerador, em `scripts/gerar-requisitos-json.mjs` e
`scripts/lib/documentos.mjs`.

| Coleção | Uma entrada por | Sai de | Campos principais |
|---|---|---|---|
| `systems` | sistema | o próprio gerador | `id`, `label`, `short`, `legacyStack` |
| `modules` | módulo | campo `Módulo` das HUs | `id`, `system`, `label` |
| `hus` | HU | `03` | `docId`, `title`, `description`, `como`/`gostaria`/`para`, `rules[]`, `criteria[]`, `screensRefs[]`, `integrations[]`, `integrationsNote`, `refs[]`, `implementation` |
| `boards` | fluxograma | `04` | `docId`, `title`, `scope`, `hus[]`, `nodes`/`edges`/`groups` ou `mermaid` |
| `screens` | tela | `05` | `docId`, `name`, `legacyRoute`, `targetRoute`, `profiles`, `hus[]`, `groups[]`, `actions[]`, `markdown` |
| `integrations` | `INT-*` | catálogo consolidado e `07` de cada sistema | `id`, `name`, `direction`, `nature` |
| `documents` | arquivo | os arquivos de cada sistema e os da visão geral | `system`, `file`, `title`, `intro`, `sections[]` |
| `artifacts` | id de catálogo | `02`, `06`, `07`, `08`, `09` e a visão geral | `id`, `kind`, `file`, `anchor`, `title`, `text`, `cites[]` |
| `endpoints` | linha "Método e rota" | `07` | `int`, `method`, `route`, `purpose`, `input`, `output`, `hus[]` |
| `contracts` | DTO | `### Contratos` do `07` | `int`, `name`, `fields[]` |

Um id do índice é definido pelo título de seção que começa com ele (`### DIV-SL-01 — …`) ou, sem
título, pela linha de tabela cuja primeira célula é ele. Uma `DIV` ou `Q` tem desfecho quando o
texto traz `**Desfecho**`.

O JSON é **gerado a partir do Markdown**, nunca editado à mão. Divergência entre os dois
resolve-se sempre a favor do Markdown.

---

## 11. Definição de pronto

Um sistema só está documentado quando:

- [ ] Todo gargalo da origem tem resposta: regra, história ou entrada no `09`.
- [ ] Todo módulo tem ao menos uma HU.
- [ ] Toda HU tem critérios de aceitação cobrindo sucesso, validação e permissão.
- [ ] Toda tela citada por uma HU está no `05`, com campos, ações e colunas.
- [ ] Toda entidade usada pelas telas está no `06`, com os domínios fechados.
- [ ] Toda integração externa tem entrada `INT-*`.
- [ ] Toda mensagem citada está no `08`.
- [ ] Toda regra diz se é fato da origem ou proposta.
- [ ] O que só o cliente decide está como `Q-*`, sem número inventado.
- [ ] A tabela `Cobertura da conferência com a fonte` do `09` lista todas as seções da fonte.

---

## 12. Amarração com a implementação

O SEALog ainda não tem implementação (`Q-SL-01`). Quando tiver, ela passa a ser a referência do
que existe, e a amarração segue o modelo do projeto FDE:

- `**Implementação**` no fim da HU e linha `Implementação` no cabeçalho da tela, com o arquivo e a
  rota reais; `Rota proposta` passa a ser a rota real.
- Cada endpoint vira uma linha da tabela `### Endpoints` de um `INT-*` de back end, com as colunas
  `Método e rota | Uso | Entrada | Saída | Tabelas | Histórias | Implementação`, e cada DTO, uma
  tabela `#### \`Nome\`` em `### Contratos`, com `Campo | Tipo | Obrig. | Observações`. O app já
  lê as duas e as mostra na página de API do sistema.
- Onde a implementação e o requisito discordarem, a divergência entra no `09` com `**Desfecho**`,
  dizendo a favor de quem. Defeito da implementação não vira requisito.
