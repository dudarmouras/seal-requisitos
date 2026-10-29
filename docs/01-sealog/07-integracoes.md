# SEALog — Integrações

Três integrações, na faixa `INT-001` a `INT-009`, reservada ao SEALog. Nenhuma é com sistema
legado: são os canais que a operação já usa — WhatsApp, Instagram e planilha —, agora ligados ao
registro único. O back end do SEALog não tem API definida, porque a stack não está definida
(`Q-SL-01`).

## 1. Inventário

| ID | Sistema | Natureza | Direção | Uso |
|---|---|---|---|---|
| `INT-001` | WhatsApp | Mensageria — envio automático | Saída | Confirmação com rastreio, links de pedido e de complemento, avisos de ocorrência, decisão e lote |
| `INT-002` | Instagram | Canal de atendimento, sem integração automática | Entrada, manual | O atendente lê o pedido e cola o link de pedido na conversa |
| `INT-003` | Planilhas (`.xlsx`, `.csv`) | Arquivo | Entrada e saída | Importação no modelo do SEALog e exportação das listas |

---

## INT-001 — WhatsApp

| | |
|---|---|
| **Sistema externo** | WhatsApp, por uma conta comercial da SEALog com envio automático |
| **Direção** | Saída: o sistema envia; as respostas do cliente continuam na conversa do atendimento |
| **HUs dependentes** | `HU-SL-001` a `HU-SL-004`, `HU-SL-014`, `HU-SL-016` a `HU-SL-021` |
| **Autenticação** | Não informado na documentação de origem |
| **Mensagens** | `MSG-SL-018` a `MSG-SL-020`, `MSG-SL-022` |

O resumo diz que os clientes pequenos pedem por WhatsApp (Gargalos §9). O sistema não lê as
conversas: o atendente continua conversando, e o sistema envia as mensagens que hoje ninguém envia
— o aviso de problema, sobretudo.

| Situação | Comportamento |
|---|---|
| Envio aceito | Aviso registrado como Enviado (`RN-SL-043`) |
| Número não recebe mensagens ou envio recusado | Aviso registrado como Falhou e levado ao painel de exceções para reenvio |
| Serviço fora do ar | Os avisos esperam e são reenviados; os que falharem vão ao painel |

> **Pergunta `Q-SL-12`:** o envio automático exige conta comercial e, em geral, modelos de
> mensagem aprovados e custo por mensagem. A SEALog já tem conta comercial? Quem paga o envio?

> **Risco:** se o envio automático não for viável, o aviso proativo — que resolve o caso "Buquê de
> sábado" — volta a depender de uma pessoa. Ver `DIV-SL-03`.

**Referências** — Gargalos §1, §5, §9.

---

## INT-002 — Instagram

| | |
|---|---|
| **Sistema externo** | Instagram, mensagens diretas da conta da SEALog |
| **Direção** | Entrada, manual |
| **HUs dependentes** | `HU-SL-001`, `HU-SL-002` |
| **Autenticação** | Não se aplica: não há integração automática |

O cliente que pede pelo Instagram recebe do atendente, na conversa, o link de pedido
(`TL-SL-003`), ou o atendente registra o pedido no formulário (`TL-SL-002`) com o canal Instagram.
Os avisos seguem pelo WhatsApp do cliente (`INT-001`).

| Situação | Comportamento |
|---|---|
| Cliente sem WhatsApp | Não informado na documentação de origem (`Q-SL-13`) |

**Referências** — Gargalos §9.

---

## INT-003 — Planilhas

| | |
|---|---|
| **Sistema externo** | Arquivos `.xlsx` e `.csv` |
| **Direção** | Entrada (importação de pedidos) e saída (exportação de listas) |
| **HUs dependentes** | `HU-SL-003`, `HU-SL-021`, `HU-SL-022`, `HU-SL-023` |

A entrada aceita só o modelo do SEALog, com as onze colunas de `TL-SL-004`. A saída leva as colunas
e os filtros da tela de onde se exporta. A planilha exportada não volta para o sistema
(`HU-SL-023`).

| Situação | Comportamento |
|---|---|
| Arquivo fora do modelo | Nada é importado (`MSG-SL-008`) |
| Linha incompleta | Importada como pendente (`RN-SL-008`) |
| Exportação sem linhas | Não exporta (`MSG-SL-027`) |

**Referências** — Gargalos §1, §6, §9.
