# Divergências e riscos

Visão consolidada do que está em aberto no projeto SEAL. O detalhe de cada sistema está no `09`
dele; aqui ficam o que é do projeto inteiro (`*-GERAL-*`) e o resumo dos riscos do SEALog.

---

## 1. Do projeto

### `DIV-GERAL-01` — Fonte única e secundária

> **Risco:** a primeira versão desta documentação saiu de um resumo de duas páginas dos gargalos,
> não do enunciado do desafio.

> **Pergunta `Q-GERAL-01`:** obter o enunciado do Desafio Prático em Grupo e conferi-lo contra esta
> documentação.

**Desfecho** — o enunciado chegou em 29/10/2026 e foi conferido junto com o Encontro 1 e o
planejamento da equipe. As correções entraram em `docs/01-sealog/`: os horários exatos do
atendimento, o prazo padrão, os dados do pedido, o canal único de WhatsApp e os detalhes dos quatro
casos. A cobertura está na tabela do `09`.

### `DIV-GERAL-02` — Requisito sem sistema por trás

> **Divergência `DIV-GERAL-02`:** o formato desta documentação veio do projeto FDE, em que a
> origem é engenharia reversa e a regra é "não inventar". Aqui a solução **é** a proposta: não há
> o que reverter.

**Desfecho** — a regra continua, adaptada: toda regra diz se é fato da origem ou proposta
(`docs/01-sealog/02-regras-de-negocio.md`), e o que só o cliente pode decidir — preço, prazo,
política de tentativas, protocolo de atendimento — fica como `Q-SL-*`, nunca como número inventado.

### `DIV-GERAL-03` — A reunião mudou o problema no meio do desafio

> **Divergência `DIV-GERAL-03`:** o enunciado descreve uma frota própria; no Encontro 1 o cliente
> contou que terceirizou as entregas. O critério "capacidade de adaptação às mudanças" vale 5 dos
> 35 pontos (Enunciado §7).

**Desfecho** — vale a reunião, e a mudança fica visível em vez de apagada: `DIV-SL-01` diz o que
saiu do escopo, `DIV-SL-02` diz o que mudou na lista da equipe, e as decisões estão em
[`decisoes`](decisoes.md).

> **Pergunta `Q-GERAL-02`:** a equipe recebeu da SEALog um e-mail com mudanças nos requisitos,
> citado no canal da equipe em 28/10/2026. Se ele traz algo além do Encontro 1, precisa ser
> conferido contra esta documentação.

## 2. Riscos do SEALog

| ID | Risco | Mitigação |
|---|---|---|
| `DIV-SL-05` | Conta e custo do WhatsApp | Pedir a conta e os modelos cedo; avisos com texto pronto no painel enquanto isso |
| `DIV-SL-06` | Terceirizada não adotar a integração | API, portal e planilha com o mesmo padrão; entrega sem retorno sinalizada; pagamento só com comprovante |
| `DIV-SL-07` | "A parceira diz que entregou" | Comprovante padrão obrigatório; recebedor não autorizado abre chamado |
| `DIV-SL-08` | Dados pessoais no modelo de IA e nas fotos | O modelo não recebe dados do destinatário; guarda sem prazo, a rever pela LGPD (`Q-SL-16`) |
| `DIV-SL-09` | Adoção e custo, com a meta de 400 entregas por dia | Serviços pagos por uso; entrada gradual (`Q-SL-14`) |

## 3. Perguntas que bloqueiam

As perguntas sem as quais uma parte do sistema não fecha:

| Pergunta | O que bloqueia |
|---|---|
| `Q-SL-04` | Como a loja pede a alteração por código do produto, em lojas grandes |
| `Q-SL-07` | O prazo de guarda do pacote no galpão |
| `Q-SL-08`, `Q-SL-09` | O valor da cobrança das lojas e do pagamento das terceirizadas (fora da apresentação) |

A lista completa está em
[`docs/01-sealog/09-divergencias-e-lacunas.md`](../01-sealog/09-divergencias-e-lacunas.md) §3.
