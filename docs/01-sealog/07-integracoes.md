# SEALog — Integrações

Quatro integrações, na faixa `INT-001` a `INT-009`, reservada ao SEALog. Nenhuma é com sistema
legado. São o WhatsApp, por onde a loja pede e é avisada; a API padrão, por onde as terceirizadas
recebem o despacho e devolvem o status; a planilha, que continua como entrada traduzida e como
saída; e o agente de ocorrências, que conversa com a loja e abre o chamado. A arquitetura é baseada
em APIs (`DEC-SL-12`).

## 1. Inventário

| ID | Sistema | Natureza | Direção | Uso |
|---|---|---|---|---|
| `INT-001` | WhatsApp (plataforma oficial da Meta) | Mensageria, com formulários | Entrada e saída | Menu, formulário de pedido, acompanhamento, edição, relato de problema e avisos à loja |
| `INT-002` | API padrão da terceirizada | API do SEALog, publicada para as terceirizadas | Entrada e saída | Despacho e alteração para a terceirizada; retorno de status e comprovante |
| `INT-003` | Planilhas (XLSX, CSV) | Arquivo | Entrada e saída | Pedidos de loja e retorno de terceirizada, traduzidos para o padrão; exportação das listas |
| `INT-004` | Agente de ocorrências (n8n com modelo de linguagem) | Automação com IA | Entrada | Conversa com a loja sobre o problema e abre o chamado com a sugestão |

---

## INT-001 — WhatsApp

| | |
|---|---|
| **Sistema externo** | Plataforma oficial de mensagens do WhatsApp (Meta Cloud API), no número que a SEALog já usa, com formulários do WhatsApp (WhatsApp Flows) que devolvem os campos estruturados |
| **Direção** | Entrada: menu, formulário de pedido, acompanhamento, edição, relato. Saída: avisos à loja |
| **HUs dependentes** | `HU-SL-001` a `HU-SL-005`, `HU-SL-017`, `HU-SL-018`, `HU-SL-020`, `HU-SL-021` |
| **Autenticação** | Credencial da conta comercial da SEALog na Meta; o número da loja é conferido contra o cadastro (`RN-SL-003`) |
| **Mensagens** | `MSG-SL-001` a `MSG-SL-011`, `MSG-SL-013`, `MSG-SL-022` a `MSG-SL-025` |

A loja continua no mesmo número de WhatsApp (Enunciado §2; Encontro 1 [07:35]). A mensagem dela
abre o menu de três opções (`RN-SL-004`); o novo pedido abre um formulário que não envia sem os
dados obrigatórios (`RN-SL-006`). Os avisos que a SEALog manda por iniciativa própria — pedido
recebido, problema na entrega, decisão, lote — usam modelos de mensagem aprovados pela Meta.

| Situação | Comportamento |
|---|---|
| Número não autorizado | `MSG-SL-002`; nada é registrado |
| Envio aceito | Aviso registrado como Enviado; depois Entregue e Lido, quando a plataforma informa (`RN-SL-045`) |
| Envio recusado ou número sem WhatsApp | Aviso registrado como Falhou e levado ao painel de chamados (`MSG-SL-027`) |
| Plataforma fora do ar | Os avisos esperam e são reenviados; os que falharem vão ao painel |

> **Resposta `Q-SL-12`:** a SEALog já tem conta comercial na plataforma oficial e paga as
> mensagens. Os modelos de aviso precisam de aprovação da Meta antes do uso.

**Referências** — Enunciado §2; Encontro 1 [07:35], [08:38], [14:33]; `DEC-SL-15`; `DIV-SL-05`.

---

## INT-002 — API padrão da terceirizada

| | |
|---|---|
| **Sistema externo** | Sistema de cada terceirizada que se integrar. A API é do SEALog e é a mesma para todas (`RN-SL-019`) |
| **Direção** | Saída: o SEALog envia o despacho e as alterações ao endereço cadastrado da terceirizada. Entrada: a terceirizada envia o retorno ao SEALog |
| **HUs dependentes** | `HU-SL-007`, `HU-SL-011`, `HU-SL-012`, `HU-SL-013` |
| **Autenticação** | Chave própria por terceirizada, gerada e trocada pelo coordenador; guardada só como hash; limite de chamadas por minuto (`RN-SL-053`) |
| **Mensagens** | `MSG-SL-016` a `MSG-SL-019`; respostas em `08-mensagens-e-erros.md` §3 |

Contrato proposto, em JSON:

| Operação | Sentido | Conteúdo |
|---|---|---|
| Despacho | SEALog → terceirizada | Código SEALog, endereço de coleta da loja, destinatário com telefone e endereço completo, tamanho e quantidade de volumes, data prevista, observações, quem mais pode receber (`RN-SL-024`) |
| Alteração | SEALog → terceirizada | Código SEALog, campos alterados com o valor anterior e o novo, ou o cancelamento (`RN-SL-026`) |
| Retorno | Terceirizada → SEALog | Código SEALog, situação, data e hora do fato; em Entregue, a foto, o nome de quem recebeu e a identificação do entregador; em Não entregue, o motivo (`RN-SL-028`, `RN-SL-030`, `RN-SL-032`) |
| Lista do dia | Terceirizada → SEALog | Consulta das entregas despachadas para ela que ainda não chegaram a um status final |

| Situação | Comportamento |
|---|---|
| Despacho sem resposta da terceirizada | Nova tentativa; persistindo, a entrega fica sinalizada na lista (`RN-SL-034`) |
| Retorno com código desconhecido | Recusado, `MSG-SL-016` |
| Comprovante incompleto | Recusado, `MSG-SL-017`; a entrega continua como estava |
| Retorno repetido | Gravado uma vez só (`RN-SL-033`) |

A terceirizada que não se integra usa o portal (`TL-SL-010`), que grava pelo mesmo contrato, ou
manda planilha (`INT-003`) (Encontro 1 [23:17]).

**Referências** — Encontro 1 [13:15], [15:19], [25:39], [27:54]; Planejamento da equipe
(arquitetura baseada em APIs); `DIV-SL-06`.

---

## INT-003 — Planilhas

| | |
|---|---|
| **Sistema externo** | Arquivos XLSX e CSV |
| **Direção** | Entrada: pedidos de loja e retorno de terceirizada. Saída: exportação das listas |
| **HUs dependentes** | `HU-SL-004`, `HU-SL-009`, `HU-SL-015`, `HU-SL-021` a `HU-SL-023` |
| **Mensagens** | `MSG-SL-020`, `MSG-SL-021`, `MSG-SL-033` |

Na entrada, a planilha não precisa vir num modelo fixo: na primeira vez, a equipe ou a terceirizada
diz a que campo do padrão cada coluna corresponde, e o sistema guarda essa associação para as
próximas (`TL-SL-011`). Cada linha passa pelas mesmas validações da API ou do formulário; linha que
não se traduz é recusada com o motivo, e as outras entram (`RN-SL-029`). Na saída, a planilha leva
as colunas e os filtros da tela, e nada exportado volta ao sistema (`RN-SL-050`).

| Situação | Comportamento |
|---|---|
| Coluna sem correspondência | Pede a associação (`MSG-SL-021`) |
| Linha inválida | Recusada com o motivo; as válidas entram (`MSG-SL-020`) |
| Exportação sem linhas | Não exporta (`MSG-SL-033`) |

**Referências** — Enunciado §2 (planilhas próprias de clientes); Encontro 1 [13:15]; `DIV-SL-03`.

---

## INT-004 — Agente de ocorrências

| | |
|---|---|
| **Sistema externo** | Fluxo no n8n Cloud com um modelo de linguagem (GPT-4o, da OpenAI), ligado ao mesmo número de WhatsApp |
| **Direção** | Entrada: o agente abre o chamado no SEALog por `POST /api/v1/bot/incidents` |
| **HUs dependentes** | `HU-SL-017`, `HU-SL-018` |
| **Autenticação** | Token fixo no cabeçalho de autorização (`Authorization: Bearer`), aceito só nessa rota; CORS restrito; limite de chamadas |
| **Mensagens** | `MSG-SL-025`, `MSG-SL-026` |

O agente começa quando a loja toca em "Relatar problema" no acompanhamento do pedido
(`RN-SL-004`). Ele classifica o tipo, colhe descrição e foto, compara com o protocolo de atendimento
da SEALog, que vai nas instruções do agente, e envia o chamado ao SEALog. O SEALog grava o chamado
e avisa o painel em tempo real. O agente não decide (`RN-SL-037`). O Não entregue que chega pela
API da terceirizada também é mandado ao agente, só para ganhar a sugestão (`RN-SL-039`).

Conteúdo enviado ao SEALog, adaptado do plano do agente (`DIV-SL-04`):

| Campo | Conteúdo |
|---|---|
| `order_id` | Código SEALog do pedido |
| `customer_phone` | Número da loja que relatou |
| `issue_type` | Um tipo do domínio de chamado (`06-modelo-de-dados.md` §3.4) |
| `description` | Relato colhido pelo agente |
| `chat_summary` | Resumo da conversa |
| `suggested_action` | Ação sugerida pelo protocolo |
| `attachments` | Endereços das fotos enviadas pela loja |

Diferente do plano original, o conteúdo **não leva nome, telefone nem e-mail do destinatário**: o
modelo recebe só o código, o tipo, o relato e as fotos, e o SEALog junta os dados de contato ao
gravar (`RN-SL-038`).

| Situação | Comportamento |
|---|---|
| Código do pedido de outra loja ou inexistente | O agente não abre chamado e responde `MSG-SL-009` |
| SEALog fora do ar | O n8n tenta de novo; a loja recebe `MSG-SL-025` só depois que o chamado foi gravado |
| Token inválido | Chamado recusado; o erro aparece no monitoramento |

> **Resposta `Q-SL-05`:** não há protocolo de atendimento por enquanto. O agente sugere com base
> nos dados do pedido, e o coordenador trata cada chamado manualmente.

**Referências** — Plano do agente; Planejamento da equipe (cuidado com dados sensíveis);
`DEC-SL-10`, `DEC-SL-14`; `DIV-SL-04`, `DIV-SL-08`.
