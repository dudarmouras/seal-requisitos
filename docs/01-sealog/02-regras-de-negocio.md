# SEALog — Regras de negócio

Catálogo das regras do sistema, identificadas por `RN-SL-NNN`: 51 regras, em sete grupos, na
ordem das etapas da operação.

Não há sistema legado de onde extrair regra. Cada regra é de um de dois tipos, e a coluna
`Referência` diz qual:

- **Fato da origem** — números e condições que o resumo dos gargalos traz: a janela de coleta, o
  horário do atendimento, os dados que faltam nos pedidos. Citados como `Gargalos §N`.
- **Proposta** — o comportamento que esta documentação propõe para resolver um gargalo. Citada
  como `Proposta`, seguida do gargalo que resolve. Onde a proposta depende de um número ou de uma
  política que só o cliente pode dar, a regra aponta a pergunta `Q-SL-*` em
  [`09-divergencias-e-lacunas.md`](09-divergencias-e-lacunas.md).

| Grupo | Regras | Total |
|---|---|---|
| 1. Entrada de pedidos | `RN-SL-001` a `RN-SL-012` | 12 |
| 2. Registro e planejamento | `RN-SL-013` a `RN-SL-024` | 12 |
| 3. Execução do motorista | `RN-SL-025` a `RN-SL-031` | 7 |
| 4. Consulta de status | `RN-SL-032` a `RN-SL-035` | 4 |
| 5. Exceções e decisões | `RN-SL-036` a `RN-SL-043` | 8 |
| 6. Financeiro | `RN-SL-044` a `RN-SL-048` | 5 |
| 7. Acesso | `RN-SL-049` a `RN-SL-051` | 3 |

---

## 1. Entrada de pedidos

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-001` | Todo pedido tem um registro único no sistema, criado no momento em que é recebido, com um código de entrega gerado pelo sistema. Nenhum pedido é tratado fora dele: não há pedido que exista só numa conversa ou numa planilha. | Proposta — resolve Gargalos §2 (digitação manual, planilhas divergentes) e §8 (causa comum) |
| `RN-SL-002` | O pedido tem estes dados obrigatórios: cliente, nome do destinatário, telefone do destinatário, rua, número, bairro, cidade e data desejada de entrega. Complemento, ponto de referência e observações são opcionais. A origem cita número, telefone e rua como os que faltam; os demais e a lista final estão em `Q-SL-03`. | Gargalos §1 (sem validação na origem: número, telefone, rua); Proposta |
| `RN-SL-003` | Pedido sem algum dado obrigatório não é confirmado. Ele fica como "Pendente de dados", com a lista do que falta, e não entra no planejamento até ser completado. | Proposta — resolve Gargalos §1 (pedidos incompletos) e o caso "Pedido incompleto" (§7) |
| `RN-SL-004` | O cliente pode fazer o pedido sozinho por um link aberto no celular, sem instalar aplicativo e sem criar conta. O atendente envia o link pela conversa de WhatsApp ou Instagram em que o cliente já está. O link aplica as mesmas validações do formulário do atendente. | Proposta — atende Gargalos §9 (clientes pequenos pedem por WhatsApp e Instagram) |
| `RN-SL-005` | Pedido recebido em texto, áudio ou planilha fora do modelo é registrado pelo atendente no mesmo formulário, com as mesmas validações. O canal de origem fica registrado no pedido: WhatsApp, Instagram, link, planilha ou presencial. | Gargalos §1 (formatos misturados); Proposta |
| `RN-SL-006` | O telefone do destinatário tem DDD e número, com 10 ou 11 dígitos. | Proposta — resolve Gargalos §1 (pedido sem telefone) |
| `RN-SL-007` | O número do endereço é obrigatório. Endereço que não tem número só é aceito com a marca explícita "Sem número", e nesse caso o ponto de referência passa a ser obrigatório. | Gargalos §1 (pedido sem número); Proposta |
| `RN-SL-008` | A planilha de cliente é importada no modelo do SEALog, com colunas fixas. Cada linha vira um pedido. Linha com dado obrigatório faltando entra como pendente, não é descartada. O resultado da importação mostra, linha a linha, o que foi confirmado e o que ficou pendente, e por quê. | Gargalos §1 (planilhas próprias dos clientes); Proposta |
| `RN-SL-009` | O pedido pendente mostra há quanto tempo espera e o que falta. O atendente pode reenviar ao cliente o link de complemento; quando o cliente completa os dados pelo link, o pedido é confirmado sem trabalho do atendente. | Proposta — resolve Gargalos §1 (a atendente volta ao cliente e espera) |
| `RN-SL-010` | Pedido confirmado depois do horário de corte do dia não entra nas rotas do mesmo dia. O horário de corte não está na origem (`Q-SL-04`). | Proposta; `Q-SL-04` |
| `RN-SL-011` | Ao registrar, o sistema avisa se já existe pedido do mesmo cliente para o mesmo destinatário, endereço e data. O aviso não bloqueia: o atendente confirma se é outro pedido. | Proposta — resolve Gargalos §2 (registros diferentes da mesma entrega) |
| `RN-SL-012` | Um pedido é uma entrega, com um ou mais volumes. Cada volume tem etiqueta própria, com o código da entrega e o número do volume (1/3, 2/3, 3/3). | Proposta — resolve Gargalos §2 (etiquetas escritas à mão) |

## 2. Registro e planejamento

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-013` | Há uma única lista de entregas, a mesma para toda a equipe. Não existe cópia por analista. Toda alteração de dado ou de status fica no histórico da entrega, com quem alterou, quando e o valor anterior. | Proposta — resolve Gargalos §2 (planilhas divergentes) e o caso "Registro incorreto" (§7) |
| `RN-SL-014` | O status da entrega segue o ciclo de [`06-modelo-de-dados.md`](06-modelo-de-dados.md) §3.1 e o fluxograma `FLX-SL-01`. Mudança fora do ciclo é recusada. | Proposta — resolve Gargalos §8 |
| `RN-SL-015` | A etiqueta é impressa pelo sistema, com o código da entrega em texto e em código lido pela câmera do celular, o nome do destinatário, o bairro e o número do volume. Nenhuma entrega entra em rota sem etiqueta impressa. | Proposta — resolve Gargalos §2 (etiquetas escritas à mão) |
| `RN-SL-016` | A coleta na casa do cliente só pode ser agendada entre 14h e 18h. O cliente que prefere levar o pacote ao galpão entrega até 17h. | Gargalos §2 (coleta em janela apertada) |
| `RN-SL-017` | A chegada do pacote ao galpão é registrada lendo a etiqueta ou digitando o código. Só entrega com todos os volumes recebidos no galpão entra em rota. Pacote recebido depois das 17h vai para a programação do dia seguinte. | Gargalos §2 (galpão até 17h); Proposta |
| `RN-SL-018` | A rota é montada pelo coordenador: ele escolhe o motorista, as entregas e a ordem das paradas. O sistema apoia agrupando as entregas prontas por bairro, sem decidir por ele. | Proposta — resolve Gargalos §2 (rotas montadas sem ferramenta); `DIV-SL-01` |
| `RN-SL-019` | Uma entrega está em no máximo uma rota de cada vez. Depois de publicada a rota, a entrega só sai dela por remanejamento, que exige motivo e fica no histórico. | Proposta |
| `RN-SL-020` | Publicar a rota envia o roteiro ao celular do motorista, de uma vez, sem mensagem individual por WhatsApp. Alteração feita depois de publicada aparece ao motorista como roteiro atualizado, com o que mudou em destaque. | Proposta — resolve Gargalos §2 (roteiro enviado por WhatsApp, motorista por motorista) |
| `RN-SL-021` | O coordenador pode mudar a ordem das paradas antes e depois de publicar. O motorista pode atender fora da ordem; a ordem planejada e a realizada ficam registradas. | Proposta |
| `RN-SL-022` | O andamento de cada rota mostra paradas concluídas, pendentes e com ocorrência, e o horário do último registro do motorista. Rota sem registro há mais tempo que o limite combinado fica sinalizada (`Q-SL-06`). | Proposta — resolve Gargalos §3 (atualizações em lote ou só em problema) |
| `RN-SL-023` | As rotas são do dia e cabem no horário da Operação, das 7h às 19h. | Gargalos §9 |
| `RN-SL-024` | O coordenador pode remanejar uma entrega de uma rota para outra, ou devolvê-la à lista de prontas, informando o motivo. Os dois motoristas recebem o roteiro atualizado. | Proposta |

## 3. Execução do motorista

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-025` | O motorista vê só as próprias rotas do dia, com as paradas na ordem planejada e, em cada uma, destinatário, telefone, endereço completo, ponto de referência, volumes e observações. | Proposta — resolve Gargalos §2 (roteiro por WhatsApp) |
| `RN-SL-026` | Cada parada é registrada no momento em que acontece, como Entregue ou Não entregue. O registro grava o motorista, a data e a hora do fato. | Proposta — resolve Gargalos §3 (atualizações em lote) |
| `RN-SL-027` | A parada pode ser aberta lendo a etiqueta do pacote com a câmera. Etiqueta de entrega que não está naquela rota é recusada com aviso, para que o pacote errado não seja entregue nem fotografado como se fosse outro. | Proposta — resolve o caso "Registro incorreto" (Gargalos §7) |
| `RN-SL-028` | Entregue exige a foto do comprovante, tirada pelo aplicativo na hora, e o nome de quem recebeu. A foto fica presa à entrega e não existe solta. | Proposta — resolve Gargalos §3 (foto de comprovante solta no grupo) |
| `RN-SL-029` | Não entregue exige um motivo da lista de [`06-modelo-de-dados.md`](06-modelo-de-dados.md) §3.3. Foto e observação são opcionais. O registro abre uma ocorrência, que entra no painel de exceções. | Proposta — resolve Gargalos §5 e o caso "Buquê de sábado" (§7) |
| `RN-SL-030` | Sem sinal, o registro fica guardado no celular com a hora real do fato e é enviado sozinho quando a conexão volta. O motorista vê quantos registros esperam envio. O status da entrega considera a hora do fato, não a hora em que o registro chegou. | Proposta — resolve Gargalos §3 (motorista sem sinal) |
| `RN-SL-031` | Registrar uma parada não exige digitar: os registros são feitos por toque, leitura de etiqueta e foto. A observação em texto é opcional. | Proposta — atende Gargalos §3 (motorista dirigindo) |

## 4. Consulta de status

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-032` | O rastreio e os avisos ao cliente funcionam a qualquer hora, sem atendente. Não dependem do horário do atendimento, que no sábado vai só até 12h. | Gargalos §9 (horário limitado); Proposta |
| `RN-SL-033` | Cada entrega tem um link de rastreio, enviado ao cliente quando o pedido é confirmado. Ele mostra o status atual, o histórico de status com data e hora, a data prevista e, depois da entrega, o comprovante. Não mostra outras entregas nem o telefone do motorista. | Proposta — resolve Gargalos §4 (cadeia de 5 saltos) |
| `RN-SL-034` | A equipe localiza uma entrega pelo código, pelo nome do cliente, pelo nome ou telefone do destinatário ou pelo bairro, e vê o mesmo detalhe que o analista vê, sem perguntar a ninguém. | Proposta — resolve Gargalos §4 (cadeia de 5 saltos, planilha desatualizada) |
| `RN-SL-035` | Toda tela que mostra status mostra também a data e a hora do último registro, para que se saiba se a informação é atual. | Proposta — resolve Gargalos §4 (planilha desatualizada) |

## 5. Exceções e decisões

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-036` | Toda ocorrência aberta aparece no painel de exceções até receber uma decisão. Não existe exceção tratada fora do painel. | Proposta — resolve Gargalos §5 e o caso "Buquê de sábado" (§7) |
| `RN-SL-037` | A decisão sobre a entrega não realizada é uma de quatro: nova tentativa, com a data; devolver ao cliente; guardar no galpão aguardando instrução do cliente; cancelar a pedido do cliente. A decisão registra quem decidiu, quando e o motivo. | Proposta — resolve Gargalos §5 (retorno ao galpão sem regra formal) |
| `RN-SL-038` | Ocorrência sem decisão até o fim da Operação do dia (19h) fica destacada no painel. O número máximo de tentativas e o prazo de guarda no galpão dependem da política da SEALog (`Q-SL-07`). | Gargalos §9 (Operação até 19h); Proposta; `Q-SL-07` |
| `RN-SL-039` | O pacote que volta ao galpão é registrado pela leitura da etiqueta na chegada. A entrega passa a "No galpão", ligada à ocorrência que a fez voltar. | Proposta — resolve Gargalos §5 (retorno ao galpão) |
| `RN-SL-040` | Toda ocorrência gera um aviso automático ao cliente, por WhatsApp, com o motivo e o link de rastreio. A decisão sobre ela gera um segundo aviso, com o que vai acontecer. | Proposta — resolve Gargalos §5 (sem aviso proativo) e o caso "Buquê de sábado" (§7) |
| `RN-SL-041` | A partir da consulta de afetados, a equipe envia um aviso a vários clientes de uma vez: uma mensagem por cliente, com a lista das entregas dele que foram afetadas. | Proposta — resolve o caso "Segunda-feira de chuva" (Gargalos §7) |
| `RN-SL-042` | A consulta de afetados lista, num período, as entregas atrasadas ou com ocorrência, agrupadas por cliente, com a contagem de cada um. Atrasada é a entrega não concluída até o fim da data prevista. | Proposta — resolve Gargalos §5 (sem visão de quem foi afetado) e o caso "Segunda-feira de chuva" (§7) |
| `RN-SL-043` | Todo aviso enviado fica registrado na entrega: texto, data e hora, canal e resultado do envio. Aviso que falhou aparece no painel de exceções para reenvio. | Proposta |

## 6. Financeiro

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-044` | A cobrança é calculada a partir das entregas registradas no sistema, nunca de planilha. O fechamento é por cliente e por período. | Proposta — resolve Gargalos §6 (cobrança sobre planilhas manuais) |
| `RN-SL-045` | Entram no fechamento as entregas que chegaram a um status final no período. Se tentativa sem sucesso, devolução e coleta são cobradas, e por quanto, depende da tabela de preços da SEALog (`Q-SL-08`, `Q-SL-09`). | Proposta; `Q-SL-08`, `Q-SL-09` |
| `RN-SL-046` | O fechamento passa por conferência antes de ser fechado. Fechamento fechado não muda: correção posterior entra como ajuste, com motivo, no fechamento seguinte do mesmo cliente. | Proposta — resolve Gargalos §6 (risco de erro herdado) |
| `RN-SL-047` | O extrato do fechamento lista cada entrega cobrada, com código, data, destinatário, bairro, status final e valor. O total é a soma das linhas mais os ajustes. | Proposta |
| `RN-SL-048` | A lista de entregas, a consulta de afetados e o fechamento podem ser exportados para planilha, nos formatos `.xlsx` e `.csv`, com as mesmas colunas e os mesmos filtros da tela. | Proposta — atende Gargalos §9 (equipe acostumada com planilha) |

## 7. Acesso

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-049` | A equipe entra com usuário e senha, em um de cinco perfis: atendente, analista, coordenador, motorista e financeiro. A lista está para confirmação (`Q-SL-10`). | Gargalos §1 a §6 (papéis da operação); Proposta; `Q-SL-10` |
| `RN-SL-050` | O cliente não tem login. O link do pedido e o link de rastreio dão acesso só à entrega a que pertencem. | Proposta — atende Gargalos §9 (clientes pequenos) |
| `RN-SL-051` | Cada perfil vê e faz só o que a matriz de [`01-atores-e-permissoes.md`](01-atores-e-permissoes.md) §2 permite. Tela fora do perfil é recusada com aviso. | Proposta |
