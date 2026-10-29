# SEALog — Regras de negócio

Catálogo das regras do sistema, identificadas por `RN-SL-NNN`: 54 regras, em sete grupos, na
ordem do caminho de um pedido.

Não há sistema legado de onde extrair regra. Cada regra é de um de dois tipos, e a coluna
`Referência` diz qual:

- **Fato da origem** — o que o enunciado, a reunião com o cliente ou o planejamento da equipe
  afirmam: os horários, os dados do pedido, a terceirização, o padrão de comprovação. Citados como
  `Enunciado §N`, `Encontro 1 [mm:ss]`, `Planejamento da equipe` ou `Plano do agente`.
- **Proposta** — o comportamento que esta documentação propõe para resolver um gargalo. Citada
  como `Proposta`, seguida do gargalo que resolve. Onde a proposta depende de um número ou de uma
  política que só a SEALog pode dar, a regra aponta a pergunta `Q-SL-*` em
  [`09-divergencias-e-lacunas.md`](09-divergencias-e-lacunas.md).

Desde o Encontro 1 (28/10/2026), **a entrega é feita por empresas terceirizadas**, uma por
região. A SEALog recebe o pedido, despacha para a terceirizada, recebe o retorno e trata o que dá
errado. O motorista é da terceirizada, e o SEALog não constrói nada para ele (`DIV-SL-01`).

| Grupo | Regras | Total |
|---|---|---|
| 1. Entrada de pedidos | `RN-SL-001` a `RN-SL-013` | 13 |
| 2. Cadastros | `RN-SL-014` a `RN-SL-019` | 6 |
| 3. Despacho | `RN-SL-020` a `RN-SL-027` | 8 |
| 4. Retorno da terceirizada | `RN-SL-028` a `RN-SL-035` | 8 |
| 5. Ocorrências e devoluções | `RN-SL-036` a `RN-SL-046` | 11 |
| 6. Financeiro | `RN-SL-047` a `RN-SL-050` | 4 |
| 7. Acesso | `RN-SL-051` a `RN-SL-054` | 4 |

---

## 1. Entrada de pedidos

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-001` | Todo pedido tem um registro único no sistema, criado no momento em que é recebido, com um código SEALog gerado pelo sistema. Nenhum pedido existe só numa conversa ou numa planilha. | Proposta — resolve Gargalos §2 (digitação manual, planilhas divergentes) e §8 (causa comum); Planejamento da equipe (substituir planilha por banco) |
| `RN-SL-002` | O pedido chega pelo número de WhatsApp da SEALog, o mesmo de hoje. A loja não instala aplicativo nem cria conta. | Enunciado §2 (pedidos por um número de WhatsApp); Encontro 1 [07:35]; Planejamento da equipe (cliente continua no WhatsApp) |
| `RN-SL-003` | Só um número de WhatsApp autorizado de uma loja ativa abre o menu de pedidos. Número desconhecido recebe a orientação de procurar o atendimento, com o horário dele, e nada é registrado. | Encontro 1 [08:38] (validação do número de origem); Proposta |
| `RN-SL-004` | O menu do WhatsApp tem três opções: novo pedido, acompanhar pedido e editar pedido. O relato de problema sai do acompanhamento do pedido, para manter os três botões. | Encontro 1 [08:38], [14:33]; Proposta |
| `RN-SL-005` | O pedido tem estes dados obrigatórios: nome e telefone do destinatário; rua, número, bairro e cidade; complemento, ou a marca de que não há; tamanho aproximado do volume; e data desejada. Ponto de referência e observações são opcionais, salvo no caso de `RN-SL-008`. | Enunciado §2 (dados que a equipe confere); Proposta |
| `RN-SL-006` | O formulário do WhatsApp não envia o pedido sem os dados obrigatórios. Cada campo que falta é apontado antes do envio. | Encontro 1 [07:35], [35:39] (formulário que impede registro incompleto); resolve Gargalos §1 e o caso "Pedido com informações incompletas" (Enunciado §8) |
| `RN-SL-007` | O telefone do destinatário tem DDD e número, com 10 ou 11 dígitos. | Proposta — resolve Gargalos §1 (pedido sem telefone) |
| `RN-SL-008` | O número do endereço é obrigatório. Endereço sem número só é aceito com a marca "Sem número", e nesse caso o ponto de referência passa a ser obrigatório. | Enunciado §8 (Sr. Paulo: sem número, "perto da farmácia"); Proposta |
| `RN-SL-009` | O prazo padrão é o dia útil seguinte ao pedido; a loja pode agendar outra data. Pedido feito depois das 18h conta como feito no dia útil seguinte. A data prevista da entrega sai dessa regra. | Enunciado §2 (prazo padrão); resposta da SEALog a `Q-SL-01` (corte às 18h) |
| `RN-SL-010` | Ao receber o pedido, o sistema avisa se já existe pedido da mesma loja para o mesmo destinatário, endereço e data. O aviso não bloqueia: a loja confirma se é outro pedido. | Proposta — resolve Gargalos §2 (registros diferentes da mesma entrega) |
| `RN-SL-011` | A loja edita ou cancela o pedido pelo WhatsApp até a terceirizada registrar a coleta. Depois disso, a mudança só se faz pelo atendimento. Na edição, a loja altera só os itens que ainda não saíram para entrega. Pedir a alteração por código do produto ainda está em debate (`Q-SL-04`). | Encontro 1 [08:38] (editar pedido); Proposta; `Q-SL-04` |
| `RN-SL-012` | O pedido que chega fora do formulário — áudio, mensagem livre, ligação ou planilha da loja — é registrado pela equipe com as mesmas validações. O que faltar deixa o pedido "Pendente de dados", e a loja recebe no WhatsApp o formulário para completar só o que falta. O canal de origem fica registrado. | Enunciado §2 (texto, áudio e planilhas próprias); Proposta |
| `RN-SL-013` | Entrega a vizinho, porteiro ou outra pessoa que não o destinatário só vale com autorização prévia da loja, registrada no pedido com o nome de quem pode receber. A loja autoriza no formulário do pedido ou depois, pela edição. | Encontro 1 [43:19]; Enunciado §8 (Cond. MarAzul, "deixar com Dona Lúcia") |

## 2. Cadastros

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-014` | A loja é cadastrada pela equipe, com um ou mais números de WhatsApp autorizados. Loja inativa não faz pedido novo. Incluir ou tirar um número fica no histórico, com quem fez. | Encontro 1 [08:38]; Planejamento da equipe (RF-01, RF-02); Proposta |
| `RN-SL-015` | Os dados comerciais da loja — nome, documento, endereço de coleta, contato e condição de cobrança — ficam no cadastro e são usados em todo pedido novo. A alteração vale a partir do pedido seguinte e fica no histórico. | Planejamento da equipe (RF-03, RF-04); Proposta |
| `RN-SL-016` | A terceirizada é cadastrada com as regiões que atende, a forma de retorno que usa (API, portal ou planilha) e o contato para despacho. Cada terceirizada tem credencial própria. | Encontro 1 [15:19], [27:54]; Proposta |
| `RN-SL-017` | A tabela de regiões liga cada par bairro e cidade a uma terceirizada. Um bairro tem uma só terceirizada ativa de cada vez. Só o coordenador mantém a tabela. | Encontro 1 [15:19] (duas empresas, uma por região); Proposta |
| `RN-SL-018` | O pedido para um bairro que não está na tabela fica "Aguardando região" e aparece ao coordenador, que escolhe a terceirizada. Ele pode, no mesmo passo, incluir o bairro na tabela. | Proposta |
| `RN-SL-019` | Toda terceirizada, atual ou futura, segue o mesmo padrão de retorno e de comprovação do SEALog. O padrão não muda por terceirizada. | Encontro 1 [27:54], [40:16] |

## 3. Despacho

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-020` | Há uma única lista de entregas, a mesma para toda a equipe. Não existe cópia por analista. Toda alteração de dado ou de status fica no histórico da entrega, com quem alterou, quando e o valor anterior. | Proposta — resolve Gargalos §2 (planilhas divergentes) e o caso "O registro incorreto" (Enunciado §8) |
| `RN-SL-021` | O status da entrega segue o ciclo de [`06-modelo-de-dados.md`](06-modelo-de-dados.md) §3.1 e o fluxograma `FLX-SL-01`. Mudança fora do ciclo é recusada, venha da equipe ou da terceirizada. | Proposta — resolve Gargalos §8 |
| `RN-SL-022` | A lista se organiza pela data prevista de entrega e mostra, em cada linha, a data e a hora do último registro, para que se saiba se a informação é atual. | Planejamento da equipe (RF-08); Proposta — resolve Gargalos §4 (planilha desatualizada) |
| `RN-SL-023` | O pedido recebido vai sozinho para a terceirizada da região do endereço de entrega, pela tabela de regiões. Ninguém distribui à mão. | Encontro 1 [15:19]; Proposta |
| `RN-SL-024` | O despacho envia à terceirizada o código SEALog, o endereço de coleta da loja, o destinatário com telefone e endereço completo, o tamanho do volume, a data prevista, as observações e quem pode receber além do destinatário. Sai pela API, quando a terceirizada a usa, ou entra na lista do dia do portal. | Encontro 1 [15:19]; Proposta |
| `RN-SL-025` | A coleta na loja é feita só pela terceirizada, hoje entre 14h e 18h. A loja não leva o volume ao galpão da SEALog. | Encontro 1 [15:19], [17:36]; Enunciado §2 (janelas de hoje); resposta da SEALog a `Q-SL-02` |
| `RN-SL-026` | Alteração ou cancelamento depois do despacho vai para a terceirizada na hora, pelo mesmo caminho do despacho, com o que mudou em destaque. A terceirizada confirma que recebeu. | Planejamento da equipe (RF-20); Proposta |
| `RN-SL-027` | O pacote é identificado só pelo código SEALog, sem etiqueta impressa pela SEALog. A terceirizada informa esse código em todo retorno, e retorno com código que não foi despachado para ela é recusado. | Planejamento da equipe (identificação própria, sem etiqueta à mão); Proposta |

## 4. Retorno da terceirizada

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-028` | A terceirizada informa cinco situações: Coletado, Em rota, Entregue, Não entregue e Devolvido ao galpão. Cada retorno traz a data e a hora do fato. | Encontro 1 [25:39] (status com horário); Proposta |
| `RN-SL-029` | O retorno chega pela API padrão do SEALog, que é o caminho preferencial; pelo portal, para a terceirizada sem integração; ou por planilha, que a plataforma traduz para o mesmo padrão, linha a linha. Linha que não se traduz é recusada com o motivo, e as outras entram. | Encontro 1 [13:15], [23:17]; Proposta |
| `RN-SL-030` | Entregue só é aceito com o comprovante padrão: foto da entrega, data e hora, nome de quem recebeu e identificação do entregador. Sem algum desses itens, o retorno é recusado e a entrega continua como estava. | Encontro 1 [26:53], [40:16], [42:33] (padrão de comprovação a propor); Proposta |
| `RN-SL-031` | Se quem recebeu não é o destinatário nem uma pessoa autorizada no pedido (`RN-SL-013`), o Entregue é aceito, mas abre um chamado de recebedor não autorizado para o atendimento. | Encontro 1 [43:19]; Proposta |
| `RN-SL-032` | Não entregue exige um motivo da lista de [`06-modelo-de-dados.md`](06-modelo-de-dados.md) §3.3 e abre um chamado. | Enunciado §2 (atraso, endereço, ausência, recusa); Planejamento da equipe (RF-14); Proposta |
| `RN-SL-033` | O mesmo retorno recebido duas vezes — mesmo código, mesma situação e mesma hora do fato — é gravado uma vez só. | Proposta |
| `RN-SL-034` | Entrega despachada sem retorno fica sinalizada na lista quando passa do prazo estimado pela terceirizada. Enquanto estiver dentro do prazo, não há alerta. | Proposta — resolve Gargalos §3 (atualizações em lote ou só no problema); resposta da SEALog a `Q-SL-13` |
| `RN-SL-035` | O status considera a hora do fato informada pela terceirizada, não a hora em que o retorno chegou. As duas ficam registradas. | Proposta — resolve Gargalos §3 (motorista que avisa no fim do dia) |

## 5. Ocorrências e devoluções

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-036` | A loja relata um problema pelo WhatsApp, a partir do acompanhamento do pedido. O agente de ocorrências identifica o pedido pelo código, classifica o tipo pela lista de [`06-modelo-de-dados.md`](06-modelo-de-dados.md) §3.4, pede uma descrição e, se houver avaria, uma foto. | Plano do agente (triagem e coleta de evidências); Planejamento da equipe (RF-18) |
| `RN-SL-037` | O agente compara o relato com o protocolo de atendimento da SEALog e escreve uma ação sugerida. Ele não decide e não responde a decisão à loja. Por enquanto não há protocolo escrito: a sugestão se apoia nos dados do pedido e do relato (`Q-SL-05`). | Plano do agente (análise de regras, atendente aprova); Proposta; `Q-SL-05` |
| `RN-SL-038` | O agente recebe só o código do pedido, o tipo, o relato e as fotos. Nome, telefone e endereço do destinatário não vão ao modelo de linguagem: o sistema junta esses dados ao gravar o chamado. | Planejamento da equipe (cuidado com dados sensíveis); Proposta — Lei 13.709/2018 |
| `RN-SL-039` | Toda ocorrência vira um chamado no painel: a relatada pela loja, o Não entregue da terceirizada e o recebedor não autorizado. O chamado tem a sugestão do agente e fica Pendente, Em atendimento ou Concluído. Não existe ocorrência tratada fora do painel. | Plano do agente (status do chamado); Proposta — resolve Gargalos §5 e o caso "O buquê de sábado" (Enunciado §8) |
| `RN-SL-040` | Uma pessoa da equipe aprova, muda ou recusa a ação sugerida. O chamado registra quem decidiu, quando, a ação final e o motivo, e a loja recebe a resposta pelo WhatsApp. Quem aprova é o coordenador, que é o administrador. | Plano do agente; Proposta; resposta da SEALog a `Q-SL-06` |
| `RN-SL-041` | O pacote não entregue volta ao galpão da SEALog, e a chegada é registrada pelo código. A terceirizada devolve o pacote ao galpão no dia útil seguinte. | Encontro 1 [47:01]; Enunciado §2; Planejamento da equipe (RN-02); resposta da SEALog a `Q-SL-03` |
| `RN-SL-042` | No galpão, o coordenador decide o destino do pacote: nova tentativa, com a data; devolver à loja; guardar aguardando instrução da loja; ou cancelar a pedido da loja. A decisão registra quem decidiu, quando e o motivo. Cada entrega tem duas tentativas; esgotadas, o pacote volta ao galpão e o coordenador decide. O prazo de guarda no galpão ainda está em `Q-SL-07`. | Enunciado §2 (o coordenador decide sem regra formal); Planejamento da equipe (RF-17); Proposta; `Q-SL-07` |
| `RN-SL-043` | Todo Não entregue e todo chamado aberto geram aviso automático à loja pelo WhatsApp, com o motivo, sem depender do horário do atendimento. A decisão gera um segundo aviso. O destinatário recebe aviso da SEALog só se algo der errado. | Proposta — resolve o caso "O buquê de sábado" (Enunciado §8) e Gargalos §5 (sem aviso proativo); resposta da SEALog a `Q-SL-15` |
| `RN-SL-044` | A consulta de afetados lista, num período, as entregas atrasadas ou com chamado, agrupadas por loja, com a contagem de cada uma. Daí a equipe envia um aviso por loja, com a lista das entregas dela. Atrasada é a entrega não concluída até o fim da data prevista. | Proposta — resolve o caso "A segunda-feira de chuva" (Enunciado §8) |
| `RN-SL-045` | Todo aviso enviado fica registrado na entrega: texto, data e hora e resultado do envio. Aviso que falhou aparece no painel de chamados para reenvio. | Proposta |
| `RN-SL-046` | Chamado sem conclusão até o fim da operação do dia (19h) fica destacado no painel. | Enunciado §2 (operação até 19h); Proposta |

## 6. Financeiro

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-047` | A cobrança das lojas é calculada a partir das entregas registradas no sistema, por loja e por período, nunca de planilha. O valor depende da tabela de preços da SEALog (`Q-SL-08`). | Enunciado §2 (o financeiro calcula a cobrança pelos registros); Proposta; `Q-SL-08` |
| `RN-SL-048` | O pagamento de cada terceirizada é calculado pelas entregas que ela fez com comprovante aceito, por período. Entrega sem comprovante aceito não entra. O valor, e o que acontece com tentativa e devolução, está em `Q-SL-09`. | Encontro 1 [38:44] (pagamento pelas entregas realizadas); Proposta; `Q-SL-09` |
| `RN-SL-049` | O fechamento, de cobrança ou de pagamento, passa por conferência antes de ser fechado. Fechamento fechado não muda: correção posterior entra como ajuste, com motivo, no fechamento seguinte. | Proposta — resolve Gargalos §6 (erro herdado das planilhas) |
| `RN-SL-050` | A lista de entregas, a consulta de afetados e os fechamentos podem ser exportados para planilha, nos formatos XLSX e CSV, com as mesmas colunas e os mesmos filtros da tela. Nada exportado volta ao sistema. | Proposta — atende Gargalos §9 (equipe acostumada com planilha) |

## 7. Acesso

| ID | Regra | Referência |
|---|---|---|
| `RN-SL-051` | A equipe entra no painel com usuário e senha, num de três perfis: atendente, coordenador e financeiro. A permissão é conferida no servidor, não só escondida na tela. O coordenador é o administrador e cadastra os usuários. Os perfis atendente e financeiro ainda estão em confirmação (`Q-SL-10`). | Planejamento da equipe (RBAC e autenticação); Proposta; `Q-SL-10` |
| `RN-SL-052` | Depois de cinco tentativas seguidas sem sucesso, a entrada fica bloqueada por um tempo. A duração e o desbloqueio estão em `Q-SL-17`. | Planejamento da equipe (RNF-01); `Q-SL-17` |
| `RN-SL-053` | A terceirizada entra no portal com usuário próprio e chama a API com chave própria. Pelos dois caminhos, ela vê e altera só as entregas despachadas para ela. | Proposta |
| `RN-SL-054` | A loja não tem senha: é identificada pelo número de WhatsApp autorizado (`RN-SL-003`) e vê só os pedidos dela. | Encontro 1 [08:38]; Proposta |
