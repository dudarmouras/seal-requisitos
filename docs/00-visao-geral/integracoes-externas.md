# Integrações externas

Catálogo consolidado das integrações do projeto, sem colisão de identificadores. A numeração
`INT-NNN` é global; cada sistema tem uma faixa. O detalhe de cada integração — contrato, falhas e
histórias dependentes — está no `07-integracoes.md` do sistema.

| Faixa | Sistema |
|---|---|
| `INT-001` a `INT-009` | SEALog (`SL`) |

---

## 1. Visão geral

O SEALog não se integra a sistema legado nenhum: não há. As integrações são os canais que a
operação já usa, agora ligados ao registro único — o WhatsApp para falar com o cliente, o Instagram
como canal de chegada e a planilha como formato de troca.

## 2. Catálogo consolidado

### SEALog

| ID | Nome | Direção | Natureza |
|---|---|---|---|
| `INT-001` | WhatsApp | Saída | Mensageria com envio automático |
| `INT-002` | Instagram | Entrada, manual | Canal de atendimento, sem integração automática |
| `INT-003` | Planilhas (`.xlsx`, `.csv`) | Entrada e saída | Arquivo |

## 3. Pontos em aberto

| Integração | Pergunta |
|---|---|
| `INT-001` | Conta comercial e custo do envio automático (`Q-SL-12`); risco em `DIV-SL-03` |
| `INT-002` | Cliente sem WhatsApp (`Q-SL-13`) |

**Referências** — [`docs/01-sealog/07-integracoes.md`](../01-sealog/07-integracoes.md); Gargalos §1,
§9.
