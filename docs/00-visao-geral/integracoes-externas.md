# Integrações externas

Catálogo consolidado das integrações do projeto, sem colisão de identificadores. A numeração
`INT-NNN` é global; cada sistema tem uma faixa. O detalhe de cada integração — contrato, falhas e
histórias dependentes — está no `07-integracoes.md` do sistema.

| Faixa | Sistema |
|---|---|
| `INT-001` a `INT-009` | SEALog (`SL`) |

---

## 1. Visão geral

O SEALog não se integra a sistema legado nenhum: não há. As integrações ligam ao registro único
quem participa da entrega: a loja, pelo WhatsApp que ela já usa; a terceirizada, por uma API padrão
do SEALog, com portal e planilha para quem não se integra; e o agente de ocorrências, que conversa
com a loja e abre o chamado.

## 2. Catálogo consolidado

### SEALog

| ID | Nome | Direção | Natureza |
|---|---|---|---|
| `INT-001` | WhatsApp | Entrada e saída | Mensageria da plataforma oficial, com formulários |
| `INT-002` | API padrão da terceirizada | Entrada e saída | API do SEALog para despacho e retorno |
| `INT-003` | Planilhas (XLSX, CSV) | Entrada e saída | Arquivo traduzido para o padrão; exportação |
| `INT-004` | Agente de ocorrências | Entrada | Automação com IA que abre chamados |

## 3. Pontos em aberto

| Integração | Pergunta |
|---|---|
| `INT-001` | Conta comercial já existe e a SEALog paga as mensagens (`Q-SL-12`); modelos aprovados pela Meta a confirmar; risco em `DIV-SL-05` |
| `INT-002` | Terceirizada que não adota a API (`DIV-SL-06`) |
| `INT-004` | Protocolo de atendimento da SEALog (`Q-SL-05`); dados pessoais e modelo de IA (`DIV-SL-08`) |

**Referências** — [`docs/01-sealog/07-integracoes.md`](../01-sealog/07-integracoes.md); Enunciado §2;
Encontro 1; Plano do agente.
