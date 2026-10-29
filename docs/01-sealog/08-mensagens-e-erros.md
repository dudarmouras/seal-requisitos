# SEALog — Mensagens e erros

Os textos que o cliente e a equipe veem. Todos são **texto proposto**: a origem não traz mensagens,
e a redação final é da SEALog. Entre chaves, o que o sistema preenche.

## 1. Mecanismo de exibição

Validação de campo aparece junto ao campo, e o envio não acontece. Aviso de resultado (gravado,
importado) aparece no topo da tela. No aplicativo do motorista, as mensagens são curtas e não pedem
leitura longa. As mensagens ao cliente vão pelo WhatsApp (`INT-001`) e ficam registradas na entrega
(`RN-SL-043`).

## 2. Catálogo de mensagens

| ID | Texto exato | Tipo | Tela | Condição | História |
|---|---|---|---|---|---|
| `MSG-SL-001` | "Informe o número do endereço ou marque Sem número." | Validação | `TL-SL-002`, `TL-SL-003` | Número vazio sem a marca | `HU-SL-001`, `HU-SL-002` |
| `MSG-SL-002` | "Informe o telefone com DDD." | Validação | `TL-SL-002`, `TL-SL-003` | Telefone sem 10 ou 11 dígitos | `HU-SL-001`, `HU-SL-002` |
| `MSG-SL-003` | "Informe a rua." | Validação | `TL-SL-002`, `TL-SL-003` | Rua vazia | `HU-SL-001`, `HU-SL-002` |
| `MSG-SL-004` | "Preencha {campo}." | Validação | `TL-SL-002`, `TL-SL-003` | Outro campo obrigatório vazio; inclui o ponto de referência com "Sem número" | `HU-SL-001`, `HU-SL-002` |
| `MSG-SL-005` | "Pedido {código} gravado como pendente. Falta: {campos}." | Informativa | `TL-SL-002` | Gravar como pendente | `HU-SL-001` |
| `MSG-SL-006` | "Já existe um pedido de {cliente} para {destinatário} neste endereço em {data}. É outro pedido?" | Confirmação | `TL-SL-002`, `TL-SL-004` | Pedido igual já registrado | `HU-SL-001`, `HU-SL-003` |
| `MSG-SL-007` | "{n} pedidos confirmados e {m} pendentes." | Informativa | `TL-SL-004` | Fim da importação | `HU-SL-003` |
| `MSG-SL-008` | "Esta planilha não segue o modelo do SEALog. Baixe o modelo e tente de novo." | Erro | `TL-SL-004` | Arquivo fora do modelo | `HU-SL-003` |
| `MSG-SL-009` | "A coleta só pode ser agendada entre 14h e 18h." | Validação | `TL-SL-009` | Horário fora da janela | `HU-SL-007` |
| `MSG-SL-010` | "Recebido depois das 17h: a entrega vai para a programação de amanhã." | Informativa | `TL-SL-009` | Recebimento depois das 17h | `HU-SL-007` |
| `MSG-SL-011` | "Esta etiqueta é da entrega {código}, que não está na sua rota." | Erro | `TL-SL-011`, `TL-SL-012` | Etiqueta de outra rota | `HU-SL-012` |
| `MSG-SL-012` | "A entrega {código} não tem etiqueta impressa." | Validação | `TL-SL-010` | Incluir em rota sem etiqueta | `HU-SL-006`, `HU-SL-008` |
| `MSG-SL-013` | "A entrega {código} ainda não está pronta: {motivo}." | Validação | `TL-SL-010` | Incluir em rota entrega pendente, sem todos os volumes ou já em outra rota | `HU-SL-008` |
| `MSG-SL-014` | "Tire a foto do comprovante para concluir." | Validação | `TL-SL-012` | Entregue sem foto | `HU-SL-013` |
| `MSG-SL-015` | "Escolha o motivo." | Validação | `TL-SL-012` | Não entregue sem motivo | `HU-SL-014` |
| `MSG-SL-016` | "Sem sinal. {n} registros serão enviados quando a conexão voltar." | Informativa | `TL-SL-011`, `TL-SL-012` | Registro guardado no celular | `HU-SL-015` |
| `MSG-SL-017` | "Sua rota foi atualizada: {mudança}." | Informativa | `TL-SL-011` | Alteração em rota publicada | `HU-SL-009`, `HU-SL-011` |
| `MSG-SL-018` | "SEALog: não conseguimos entregar o pedido {código} para {destinatário} hoje. Motivo: {motivo}. Acompanhe: {link}" | Aviso ao cliente | WhatsApp | Ocorrência registrada | `HU-SL-014`, `HU-SL-020` |
| `MSG-SL-019` | "SEALog: sobre o pedido {código}, {decisão}. Acompanhe: {link}" | Aviso ao cliente | WhatsApp | Decisão sobre a ocorrência | `HU-SL-019`, `HU-SL-020` |
| `MSG-SL-020` | "SEALog: {n} entregas suas foram afetadas hoje ({motivo}): {lista com código, destinatário e situação}." | Aviso ao cliente | WhatsApp | Aviso em lote | `HU-SL-020`, `HU-SL-021` |
| `MSG-SL-021` | "Entrega não encontrada. Confira o link que você recebeu." | Erro | `TL-SL-013` | Link de rastreio inválido | `HU-SL-016` |
| `MSG-SL-022` | "SEALog: recebemos seu pedido {código} para {destinatário}. Acompanhe: {link}" | Aviso ao cliente | WhatsApp | Pedido confirmado | `HU-SL-001` a `HU-SL-004` |
| `MSG-SL-023` | "O aviso a {cliente} não foi entregue: {motivo da falha}." | Erro | `TL-SL-014` | Falha de envio | `HU-SL-018`, `HU-SL-020` |
| `MSG-SL-024` | "Usuário ou senha incorretos." | Erro | `TL-SL-001` | Entrada recusada | `HU-SL-024` |
| `MSG-SL-025` | "Seu perfil não tem acesso a esta tela." | Erro | Qualquer | Tela fora do perfil | `HU-SL-001`, `HU-SL-022`, `HU-SL-024` |
| `MSG-SL-026` | "Este fechamento já foi fechado. Lance um ajuste no próximo." | Validação | `TL-SL-016` | Alterar fechamento fechado | `HU-SL-022` |
| `MSG-SL-027` | "Nenhuma entrega encontrada para os filtros escolhidos." | Informativa | `TL-SL-006`, `TL-SL-015`, `TL-SL-017` | Lista vazia; exportar sem linhas | `HU-SL-005`, `HU-SL-021`, `HU-SL-023` |

## 3. Códigos HTTP

Não definidos: a stack não está definida (`Q-SL-01`). O comportamento esperado é o da coluna
Condição acima.

**Referências** — Gargalos §1 a §9.
