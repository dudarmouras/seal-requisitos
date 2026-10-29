# SEALog — Divergências e lacunas

Registro das decisões que contrariam ou interpretam a origem, dos riscos da solução e das
perguntas que só a SEALog pode responder. Divergências e riscos recebem `DIV-SL-NN`; perguntas,
`Q-SL-NN`. Uma entrada tem desfecho quando traz a linha `**Desfecho**`.

Como não há sistema legado, a divergência aqui não é entre legado e pedido: é entre o que a origem
descreve e o que a solução propõe, ou entre a solução e as restrições do enunciado (Gargalos §9).

---

## 1. Decisões que interpretam a origem

### `DIV-SL-01` — Rotas: ferramenta de apoio, não otimização

> **Divergência `DIV-SL-01`:** a origem aponta que as rotas são "montadas na experiência do
> coordenador, sem ferramenta" (Gargalos §2). Isso pode ser lido como pedido de roteirização
> automática ou como falta de um lugar para registrar e distribuir a rota.

**Desfecho** — a favor da segunda leitura: o sistema dá ao coordenador as entregas prontas
agrupadas por bairro, a montagem, a ordem e a publicação, e a decisão continua com ele
(`RN-SL-018`). Otimização automática fica fora do escopo (`00-visao-geral.md` §3): o problema
descrito é a informação espalhada, não a qualidade das rotas, e a equipe tem resistência a mudança
(Gargalos §9). Pode voltar como evolução se a SEALog pedir.

### `DIV-SL-02` — A planilha continua, mas só como saída

> **Divergência `DIV-SL-02`:** a equipe está acostumada com planilha e o risco principal é a
> adoção (Gargalos §9); ao mesmo tempo, as planilhas divergentes são causa de erro (Gargalos §2,
> §6, caso "Registro incorreto").

**Desfecho** — a planilha fica como saída, nunca como fonte: toda lista exporta (`HU-SL-023`), a
lista de entregas se usa como planilha filtrável (`HU-SL-005`), e a importação aceita só o modelo
do SEALog, linha a linha validada (`HU-SL-003`). Nada exportado volta ao sistema.

## 2. Riscos

### `DIV-SL-03` — Aviso automático por WhatsApp

> **Risco:** o aviso proativo ao cliente (`RN-SL-040`), a resposta ao caso "Buquê de sábado",
> depende de envio automático pelo WhatsApp (`INT-001`), que costuma exigir conta comercial,
> modelos de mensagem aprovados e custo por mensagem (`Q-SL-12`). Sem ele, o aviso volta a depender
> de uma pessoa, e uma pessoa só trabalha no horário do atendimento — sábado até 12h.

Mitigação proposta: se o envio automático não for viável no início, o painel de exceções
(`HU-SL-018`) mostra os avisos a enviar, com o texto pronto, para a equipe mandar à mão; a falta de
aviso continua visível em vez de sumir.

### `DIV-SL-04` — O motorista registrar na hora

> **Risco:** todo o ganho de status depende de o motorista registrar cada parada no momento
> (`RN-SL-026`). Hoje muitos avisam no almoço ou no fim do dia (Gargalos §3), e o motorista dirige a
> maior parte do tempo.

Mitigação na própria solução: registro sem digitar (`RN-SL-031`), sem sinal (`RN-SL-030`), e a
foto do comprovante como condição para concluir a entrega (`RN-SL-028`) — sem o registro, a entrega
não conta como feita. A rota parada fica sinalizada ao coordenador (`RN-SL-022`).

### `DIV-SL-05` — Adoção pela equipe

> **Risco:** o enunciado nomeia a adoção como risco principal (Gargalos §9). Se uma parte da equipe
> continuar na planilha, voltam as duas versões da verdade.

A solução reduz o atrito (exportação, lista com cara de planilha, link no WhatsApp para o
cliente), mas a transição — que etapa entra primeiro, quanto tempo a planilha convive com o
sistema — não está decidida (`Q-SL-14`).

### `DIV-SL-06` — Dados pessoais no rastreio e no comprovante

> **Segurança:** o link de rastreio é aberto sem login e mostra o nome do destinatário, o bairro e
> a foto do comprovante (`RN-SL-033`). Quem tiver o link vê esses dados. A foto pode mostrar o rosto
> de quem recebeu ou um documento.

O link usa uma chave impossível de adivinhar (`ENT-SL-002`, `token_rastreio`) e não mostra rua,
número nem telefone. Se a foto do comprovante deve aparecer ao cliente, e o que ela pode mostrar,
está em `Q-SL-05`.

### `DIV-SL-07` — A origem é um resumo

> **Risco:** a única fonte é o resumo dos gargalos, não o enunciado do desafio (`Q-GERAL-01`).
> Números e casos podem ter mais detalhe no enunciado — por exemplo, o que aconteceu de fato no
> caso "Buquê de sábado".

Quando o enunciado chegar, a passada `/conferir-origem` o confere contra esta documentação.

## 3. Perguntas à SEALog

| ID | Pergunta | Por que importa | Onde afeta |
|---|---|---|---|
| `Q-SL-01` | Há preferência de plataforma ou de stack? O sistema precisa ser construído, ou basta o desenho da solução? | A origem diz que não é obrigatório entregar sistema funcional (Gargalos §9) | `00-visao-geral.md` §4; `07`; `08` §3 |
| `Q-SL-02` | Quantas entregas por dia, quantos clientes ativos e quantos volumes por pedido, em média e no pico? | Dimensiona rotas, envio de avisos e custo | `00-visao-geral.md` §8 |
| `Q-SL-03` | Quais dados são obrigatórios no pedido? A origem cita número, telefone e rua; a proposta acrescenta destinatário, bairro, cidade e data. CEP é necessário? | Define a validação na entrada, que resolve o caso "Pedido incompleto" | `RN-SL-002`; `TL-SL-002`, `TL-SL-003` |
| `Q-SL-04` | Qual o horário de corte para o pedido sair no mesmo dia? O prazo padrão é no mesmo dia ou no seguinte? | Define a data prevista e, com ela, o que é atraso | `RN-SL-010`, `RN-SL-042` |
| `Q-SL-05` | O que vale como comprovante — foto do pacote entregue, assinatura, documento? A foto pode aparecer ao cliente no rastreio? | Define o comprovante e a exposição de dados pessoais | `RN-SL-028`, `RN-SL-033`; `DIV-SL-06` |
| `Q-SL-06` | Depois de quanto tempo sem registro uma rota deve ser sinalizada ao coordenador? | Define o alerta de rota parada | `RN-SL-022` |
| `Q-SL-07` | Quantas tentativas uma entrega pode ter? Por quanto tempo o pacote fica guardado no galpão aguardando o cliente? O que acontece depois? | É a "regra formal" de retorno que hoje não existe (Gargalos §5) | `RN-SL-037`, `RN-SL-038` |
| `Q-SL-08` | Tentativa sem sucesso, devolução e coleta são cobradas? Por quanto? | Define o que entra no fechamento | `RN-SL-045` |
| `Q-SL-09` | Qual é a tabela de preços — por entrega, por bairro, por volume, por cliente? | Sem ela o fechamento não tem valor | `RN-SL-045`; `ENT-SL-014` |
| `Q-SL-10` | Os perfis são estes cinco? Uma pessoa acumula papéis? Quem cadastra os usuários? | Define a matriz de permissões | `RN-SL-049`; `01-atores-e-permissoes.md` |
| `Q-SL-11` | Quais são os motivos de não entrega que a operação já usa? | A lista do aplicativo do motorista tem de ser a da rua | `06-modelo-de-dados.md` §3.3 |
| `Q-SL-12` | A SEALog tem conta comercial de WhatsApp? Quem paga o envio automático? | O aviso proativo depende dele | `INT-001`; `DIV-SL-03` |
| `Q-SL-13` | Há cliente que pede só pelo Instagram e não tem WhatsApp? Como ele recebe avisos? | Os avisos saem só pelo WhatsApp | `INT-002` |
| `Q-SL-14` | Como será a transição: que etapa entra primeiro, e por quanto tempo planilha e sistema convivem? | Adoção é o risco principal | `DIV-SL-05` |

## Cobertura da conferência com a fonte

Uma seção da fonte é **conferida** quando todos os itens dela foram percorridos contra `docs/` e
cada um tem resposta — uma regra, uma história, ou uma entrada neste arquivo. Fonte: `SEALog
gargalos e problemas da operação.pdf`, conferido em 29/10/2026.

| Seção da fonte | Módulo | Itens conferidos | Data | Achados |
|---|---|---|---|---|
| `Gargalos §1` Entrada de pedidos | `entrada-pedidos` | 3 de 3 | 2026-10-29 | `HU-SL-001` a `HU-SL-004`; `Q-SL-03` |
| `Gargalos §2` Registro e planejamento | `registro-planejamento` | 6 de 6 | 2026-10-29 | `HU-SL-005` a `HU-SL-009`; `DIV-SL-01`, `DIV-SL-02` |
| `Gargalos §3` Execução e comunicação do motorista | `execucao-motorista` | 4 de 4 | 2026-10-29 | `HU-SL-010` a `HU-SL-015`; `DIV-SL-04` |
| `Gargalos §4` Consulta de status | `consulta-status` | 3 de 3 | 2026-10-29 | `HU-SL-016`, `HU-SL-017` |
| `Gargalos §5` Exceções e decisões | `excecoes` | 3 de 3 | 2026-10-29 | `HU-SL-018` a `HU-SL-021`; `Q-SL-07` |
| `Gargalos §6` Financeiro | `financeiro` | 1 de 1 | 2026-10-29 | `HU-SL-022`; `Q-SL-08`, `Q-SL-09` |
| `Gargalos §7` Os quatro casos | transversal | 4 de 4 | 2026-10-29 | `00-visao-geral.md` §6 |
| `Gargalos §8` Causa comum | transversal | 1 de 1 | 2026-10-29 | `RN-SL-001`, `RN-SL-013` |
| `Gargalos §9` Restrições | transversal | 4 de 4 | 2026-10-29 | `00-visao-geral.md` §7; `HU-SL-023`; `DIV-SL-03`, `DIV-SL-05`; `Q-SL-01` |

### Item a item

| Gargalo (origem) | Resposta |
|---|---|
| Pedidos incompletos: cerca de 1 em 5 | `RN-SL-003`, `RN-SL-009`; `HU-SL-001`, `HU-SL-004` |
| Formatos misturados: texto, áudio e planilhas | `RN-SL-005`, `RN-SL-008`; `HU-SL-001`, `HU-SL-003` |
| Sem validação na origem: número, telefone, rua | `RN-SL-002`, `RN-SL-006`, `RN-SL-007`; `HU-SL-001`, `HU-SL-002` |
| Digitação manual do WhatsApp para a planilha | `RN-SL-001`, `RN-SL-004`; `HU-SL-002`, `HU-SL-005` |
| Planilhas divergentes por analista | `RN-SL-013`; `HU-SL-005`; `DIV-SL-02` |
| Etiquetas escritas à mão | `RN-SL-012`, `RN-SL-015`; `HU-SL-006` |
| Rotas montadas na experiência, sem ferramenta | `RN-SL-018`; `HU-SL-008`; `DIV-SL-01` |
| Roteiro por WhatsApp, motorista por motorista | `RN-SL-020`; `HU-SL-009`, `HU-SL-011` |
| Coleta em janela apertada: 14h–18h, ou galpão até 17h | `RN-SL-016`, `RN-SL-017`; `HU-SL-007` |
| Atualizações em lote ou só em problema | `RN-SL-022`, `RN-SL-026`; `HU-SL-010`, `HU-SL-012`; `DIV-SL-04` |
| Grupo com cerca de 18 motoristas: mensagens se perdem | `RN-SL-029`, `RN-SL-036`; `HU-SL-014`, `HU-SL-018` |
| Foto de comprovante solta no grupo | `RN-SL-027`, `RN-SL-028`; `HU-SL-013` |
| Motorista dirigindo ou sem sinal | `RN-SL-030`, `RN-SL-031`; `HU-SL-015` |
| Cadeia de 5 saltos na consulta de status | `RN-SL-033`, `RN-SL-034`; `HU-SL-016`, `HU-SL-017` |
| Resposta de 20 min a mais de 2 h | `RN-SL-032`, `RN-SL-033`; `HU-SL-016` |
| Planilha desatualizada, nada consultável | `RN-SL-035`; `HU-SL-005`, `HU-SL-017` |
| Retorno ao galpão sem regra formal | `RN-SL-037`, `RN-SL-039`; `HU-SL-019`; `Q-SL-07` |
| Sem aviso proativo ao cliente | `RN-SL-040`; `HU-SL-020`; `DIV-SL-03` |
| Sem visão de quem foi afetado, por cliente | `RN-SL-042`; `HU-SL-021` |
| Cobrança sobre planilhas manuais | `RN-SL-044`, `RN-SL-046`; `HU-SL-022` |
