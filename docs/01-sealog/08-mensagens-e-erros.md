# SEALog — Mensagens e erros

Os textos que a loja, a terceirizada e a equipe veem. Todos são **texto proposto**: a origem não
traz mensagens, e a redação final é da SEALog. Entre chaves, o que o sistema preenche.

## 1. Mecanismo de exibição

No formulário do WhatsApp, a validação aparece junto ao campo e o envio não acontece. As mensagens à
loja vão pela conversa do WhatsApp (`INT-001`) e ficam registradas na entrega (`RN-SL-045`). No
painel e no portal, a validação aparece junto ao campo e o aviso de resultado, no topo da tela. A API
da terceirizada devolve a mensagem no corpo da resposta, junto do código de erro (`07-integracoes.md`
§2). As falas do agente de ocorrências são geradas pelo modelo de linguagem; só as de abertura e de
encerramento são fixas.

## 2. Catálogo de mensagens

| ID | Texto exato | Tipo | Tela | Condição | História |
|---|---|---|---|---|---|
| `MSG-SL-001` | "Olá! O que você quer fazer? [Novo pedido] [Editar ou cancelar pedido]" | Menu | `TL-SL-002` | Mensagem de qualquer número | `HU-SL-001`, `HU-SL-003` |
| `MSG-SL-002` | "SEALog: recebemos o pedido {código} para {destinatário}. Como é o primeiro pedido feito deste número, a equipe vai confirmar a loja, e avisamos aqui quando ele seguir para a entrega." | Aviso à loja | WhatsApp | Pedido de número ainda não confirmado | `HU-SL-001`, `HU-SL-009` |
| `MSG-SL-003` | "Informe o número do endereço ou marque Sem número." | Validação | `TL-SL-003`, `TL-SL-004` | Número vazio sem a marca | `HU-SL-001`, `HU-SL-004` |
| `MSG-SL-004` | "Informe o telefone com DDD." | Validação | `TL-SL-003`, `TL-SL-004` | Telefone sem 10 ou 11 dígitos | `HU-SL-001`, `HU-SL-004` |
| `MSG-SL-005` | "Preencha {campo}." | Validação | `TL-SL-003`, `TL-SL-004` | Outro campo obrigatório vazio, inclusive o ponto de referência com "Sem número" e o complemento sem a marca "Sem complemento" | `HU-SL-001`, `HU-SL-004` |
| `MSG-SL-006` | "Já existe um pedido para {destinatário} neste endereço em {data}. É outro pedido? [Sim, é outro] [Não, cancelar]" | Confirmação | `TL-SL-003`, `TL-SL-004` | Pedido igual já registrado | `HU-SL-001`, `HU-SL-004` |
| `MSG-SL-007` | "SEALog: recebemos o pedido {código} para {destinatário}, com entrega prevista para {data}. Para alterar ou cancelar, mande uma mensagem e escolha Editar ou cancelar pedido." | Aviso à loja | WhatsApp | Pedido recebido, ou número confirmado pela equipe | `HU-SL-001`, `HU-SL-004`, `HU-SL-009` |
| `MSG-SL-009` | "Não encontramos o pedido {código} entre os pedidos feitos por este número." | Erro | `TL-SL-002` | Código inexistente ou de pedido feito por outro número | `HU-SL-003`, `HU-SL-017` |
| `MSG-SL-010` | "O pedido {código} já foi coletado e não pode mais ser alterado por aqui. Fale com o atendimento." | Erro | `TL-SL-002` | Edição depois da coleta | `HU-SL-003` |
| `MSG-SL-011` | "SEALog: o pedido {código} foi alterado: {mudança}." | Aviso à loja | WhatsApp | Edição ou cancelamento confirmados | `HU-SL-003`, `HU-SL-012` |
| `MSG-SL-012` | "Pedido {código} gravado como pendente. Falta: {campos}." | Informativa | `TL-SL-004` | Gravar como pendente | `HU-SL-004` |
| `MSG-SL-013` | "SEALog: o pedido {código} para {destinatário} está quase pronto. Falta: {campos}. [Completar pedido]" | Aviso à loja | WhatsApp | Pedido pendente de dados | `HU-SL-004` |
| `MSG-SL-014` | "Nenhuma terceirizada atende o bairro {bairro} ({cidade}). Escolha a terceirizada." | Validação | `TL-SL-006`, `TL-SL-009` | Pedido "Aguardando região" | `HU-SL-007`, `HU-SL-010` |
| `MSG-SL-015` | "Já existe uma terceirizada ativa para {bairro} ({cidade}): {terceirizada}." | Validação | `TL-SL-006` | Segundo vínculo ativo para o mesmo bairro | `HU-SL-007` |
| `MSG-SL-016` | "O código {código} não foi despachado para {terceirizada}." | Erro | API, `TL-SL-010`, `TL-SL-011` | Retorno com código desconhecido ou de outra terceirizada | `HU-SL-013`, `HU-SL-014`, `HU-SL-015` |
| `MSG-SL-017` | "Entregue exige foto, data e hora, nome de quem recebeu e identificação do entregador. Falta: {campos}." | Erro | API, `TL-SL-010`, `TL-SL-011` | Comprovante incompleto | `HU-SL-013`, `HU-SL-014`, `HU-SL-016` |
| `MSG-SL-018` | "A entrega {código} está {status atual} e não pode passar para {situação}." | Erro | API, `TL-SL-010`, `TL-SL-011` | Situação fora do ciclo | `HU-SL-013`, `HU-SL-014`, `HU-SL-015` |
| `MSG-SL-019` | "Escolha o motivo da não entrega." | Validação | API, `TL-SL-010`, `TL-SL-011` | Não entregue sem motivo | `HU-SL-013`, `HU-SL-014` |
| `MSG-SL-020` | "{n} linhas aceitas e {m} recusadas. Veja o motivo de cada recusa." | Informativa | `TL-SL-011` | Fim da importação | `HU-SL-004`, `HU-SL-015` |
| `MSG-SL-021` | "Não reconhecemos as colunas {colunas}. Diga a que campo do padrão cada uma corresponde." | Validação | `TL-SL-011` | Coluna sem correspondência | `HU-SL-015` |
| `MSG-SL-022` | "SEALog: tivemos um problema com o pedido {código} para {destinatário}: {motivo}. Já estamos cuidando e avisamos aqui o próximo passo." | Aviso à loja | WhatsApp | Não entregue ou chamado aberto | `HU-SL-020` |
| `MSG-SL-023` | "SEALog: sobre o pedido {código}, {decisão}." | Aviso à loja | WhatsApp | Chamado concluído ou decisão no galpão | `HU-SL-018`, `HU-SL-019`, `HU-SL-020` |
| `MSG-SL-024` | "SEALog: {n} pedidos seus foram afetados hoje ({motivo}): {lista com código, destinatário e situação}." | Aviso à loja | WhatsApp | Aviso em lote | `HU-SL-021` |
| `MSG-SL-025` | "Recebemos seu relato sobre o pedido {código}. Uma pessoa da nossa equipe vai analisar e responder por aqui." | Informativa | `TL-SL-002` | Fim da conversa com o agente | `HU-SL-017` |
| `MSG-SL-026` | "Novo chamado: {tipo} no pedido {código}, de {loja}." | Informativa | `TL-SL-012` | Chamado aberto | `HU-SL-017`, `HU-SL-018` |
| `MSG-SL-027` | "O aviso a {destino} não foi entregue: {motivo da falha}." | Erro | `TL-SL-012` | Falha de envio | `HU-SL-011`, `HU-SL-020` |
| `MSG-SL-028` | "Pacote {código} recebido no galpão. Escolha o destino." | Informativa | `TL-SL-014` | Chegada registrada | `HU-SL-019` |
| `MSG-SL-029` | "Usuário ou senha incorretos." | Erro | `TL-SL-001`, `TL-SL-010` | Entrada recusada | `HU-SL-024` |
| `MSG-SL-030` | "Acesso bloqueado depois de 5 tentativas sem sucesso. Tente de novo em {tempo} ou fale com o coordenador." | Erro | `TL-SL-001`, `TL-SL-010` | Quinta tentativa seguida sem sucesso | `HU-SL-024` |
| `MSG-SL-031` | "Seu perfil não tem acesso a esta tela." | Erro | Qualquer | Tela fora do perfil | `HU-SL-024` |
| `MSG-SL-032` | "Este fechamento já foi fechado. Lance um ajuste no próximo." | Validação | `TL-SL-016` | Alterar fechamento fechado | `HU-SL-022`, `HU-SL-023` |
| `MSG-SL-033` | "Nenhuma entrega encontrada para os filtros escolhidos." | Informativa | `TL-SL-008`, `TL-SL-015`, `TL-SL-017` | Lista vazia; exportar sem linhas | `HU-SL-009`, `HU-SL-021` |

## 3. Respostas da API da terceirizada

A API padrão (`INT-002`) responde com um código e uma das mensagens acima.

| Situação | Código | Mensagem |
|---|---|---|
| Retorno aceito | 200 | — |
| Retorno repetido (`RN-SL-033`) | 200 | — (indica que já estava gravado) |
| Chave ausente ou inválida | 401 | — |
| Código não despachado para a terceirizada | 404 | `MSG-SL-016` |
| Comprovante incompleto, situação fora do ciclo, motivo ausente | 422 | `MSG-SL-017`, `MSG-SL-018`, `MSG-SL-019` |
| Excesso de chamadas | 429 | — |

**Referências** — Enunciado §2, §8; Encontro 1; Plano do agente; `RN-SL-001` a `RN-SL-053`.
