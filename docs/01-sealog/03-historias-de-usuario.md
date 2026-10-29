# SEALog — Histórias de usuário

Vinte e quatro histórias, em sete módulos, na ordem do caminho de um pedido: a loja pede pelo
WhatsApp, o pedido vai sozinho para a terceirizada da região, a terceirizada devolve o status e o
comprovante, e o que dá errado vira um chamado que uma pessoa da equipe decide. As regras citam o
catálogo `RN-SL-*` de [`02-regras-de-negocio.md`](02-regras-de-negocio.md); o que ainda está em
aberto é `Q-SL-*`, em [`09-divergencias-e-lacunas.md`](09-divergencias-e-lacunas.md).

As fontes são o enunciado do desafio, o resumo dos gargalos, o Encontro 1 com o cliente
(28/10/2026), em que a SEALog contou que terceirizou as entregas, o planejamento da equipe e o plano
do agente de ocorrências. Como não há sistema legado, o campo **Origem legada** de cada história
descreve **como a operação faz aquilo hoje**, com o gargalo que a história resolve, e aponta o item
da lista RF-01 a RF-20 da equipe que ela cobre ou substitui.

## Índice

| Módulo | HUs | Total |
|---|---|---|
| Entrada de pedidos (`entrada-pedidos`) | `HU-SL-001` a `HU-SL-004` | 4 |
| Cadastros (`cadastros`) | `HU-SL-005` a `HU-SL-008` | 4 |
| Despacho (`despacho`) | `HU-SL-009` a `HU-SL-012` | 4 |
| Retorno da terceirizada (`retorno-terceirizada`) | `HU-SL-013` a `HU-SL-016` | 4 |
| Ocorrências e devoluções (`ocorrencias`) | `HU-SL-017` a `HU-SL-021` | 5 |
| Financeiro (`financeiro`) | `HU-SL-022`, `HU-SL-023` | 2 |
| Acesso (`acesso`) | `HU-SL-024` | 1 |

---

## Entrada de pedidos

### HU-SL-001 — Fazer o pedido pelo WhatsApp

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Loja |
| **Telas** | `TL-SL-002` Conversa do WhatsApp, `TL-SL-003` Formulário de pedido no WhatsApp |
| **Origem legada** | Hoje: a loja manda o pedido ao número de WhatsApp do Atendimento em texto, áudio ou planilha própria; a atendente confere os dados à mão, e cerca de 1 em 5 chega incompleto (Sr. Paulo sem número e telefone, Cond. MarAzul sem rua e telefone). Na lista da equipe: RF-07 |
| **Prioridade** | Alta |

**Como** loja cliente da SEALog
**Gostaria de** fazer o pedido num formulário dentro da própria conversa do WhatsApp
**Para que** eu informe tudo certo de primeira, sem instalar nada e sem esperar a atendente me perguntar o que faltou.

**Descrição**

A loja manda uma mensagem ao número de WhatsApp da SEALog, o mesmo que já usa. Se o número estiver
autorizado para uma loja ativa, ela recebe o menu com três opções e escolhe "Novo pedido". Abre-se
um formulário dentro do próprio WhatsApp, que já sabe de qual loja é o pedido.

O formulário pede os dados que hoje a atendente confere à mão: nome e telefone do destinatário,
endereço com número, complemento e bairro e cidade, tamanho aproximado do volume e a data desejada.
Ele não envia enquanto faltar algum dado obrigatório e aponta cada campo que falta. Endereço sem
número precisa da marca "Sem número" e de um ponto de referência. Se alguém além do destinatário
puder receber — um vizinho, o porteiro —, a loja diz quem no próprio pedido.

Ao enviar, o pedido ganha o código SEALog, recebe a data prevista e a loja recebe a confirmação na
conversa. Se já houver pedido igual, a loja é avisada antes e confirma se é outro.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Só um número autorizado de loja ativa recebe o menu; número desconhecido recebe a orientação de procurar o atendimento, e nada é registrado. | `RN-SL-003` |
| RN2 | O menu tem três opções: novo pedido, acompanhar pedido e editar pedido. | `RN-SL-004` |
| RN3 | São obrigatórios: nome e telefone do destinatário, rua, número, bairro, cidade, complemento ou a marca de que não há, tamanho aproximado do volume e data desejada; o formulário não envia sem eles. | `RN-SL-005`, `RN-SL-006` |
| RN4 | O telefone tem DDD e 10 ou 11 dígitos; endereço sem número exige a marca "Sem número" e o ponto de referência. | `RN-SL-007`, `RN-SL-008` |
| RN5 | A data prevista é o dia útil seguinte ou a data agendada pela loja. | `RN-SL-009` |
| RN6 | Pedido igual a outro da mesma loja (mesmo destinatário, endereço e data) gera aviso, sem bloquear. | `RN-SL-010` |
| RN7 | Quem pode receber além do destinatário é informado no pedido; sem isso, só o destinatário recebe. | `RN-SL-013` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Pedido completo | que meu número está autorizado e preenchi todos os campos obrigatórios | envio o formulário | o pedido recebe o código SEALog e eu recebo na conversa a confirmação com a data prevista. |
| CA2 | Pedido incompleto | que estou pedindo para o Sr. Paulo e não sei o número da casa nem o telefone | tento enviar | o formulário não envia e aponta o número e o telefone como obrigatórios. |
| CA3 | Endereço sem número de verdade | que marquei "Sem número" | tento enviar sem ponto de referência | o formulário pede o ponto de referência. |
| CA4 | Número não autorizado | que escrevo de um número que não está cadastrado em nenhuma loja | mando a mensagem | recebo a orientação de falar com o atendimento, com o horário dele, e nenhum pedido é criado. |
| CA5 | Pessoa autorizada a receber | que o pedido é para o condomínio Mar Azul e pode ser deixado com Dona Lúcia | informo o nome dela no campo de quem pode receber | o pedido guarda a autorização e ela vai junto para a terceirizada. |
| CA6 | Pedido repetido | que já pedi hoje uma entrega para o mesmo destinatário, endereço e data | envio de novo | sou avisada da repetição e só vira outro pedido se eu confirmar. |
| CA7 | Fora do horário | que é sábado, 15h, e o atendimento já fechou | envio um pedido completo | o pedido é recebido da mesma forma. |

**Integrações e APIs** — `INT-001` WhatsApp: menu, formulário dentro da conversa (resposta estruturada que o sistema lê) e confirmação ao fim.

**Referências** — Enunciado §2 (pedido por um número de WhatsApp, dados conferidos), §8 (caso "Pedido com informações incompletas"); Encontro 1 [07:35], [08:38], [14:33], [35:39], [43:19]; Planejamento da equipe (RF-07; cliente continua no WhatsApp); Gargalos §1.

---

### HU-SL-002 — Acompanhar o pedido pelo WhatsApp

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Loja |
| **Telas** | `TL-SL-002` Conversa do WhatsApp |
| **Origem legada** | Hoje: a loja pergunta "cadê minha entrega?" ao Atendimento, que pergunta no grupo interno, o analista procura na planilha e, se ela está desatualizada, tenta falar com o motorista; a resposta leva de 20 minutos a mais de 2 horas. Depois da terceirização, a SEALog ainda depende de a terceirizada responder por WhatsApp ou planilha. Na lista da equipe: RF-07 |
| **Prioridade** | Alta |

**Como** loja cliente da SEALog
**Gostaria de** ver na conversa do WhatsApp em que pé está o meu pedido
**Para que** eu responda ao meu cliente na hora, sem esperar a atendente perguntar a ninguém.

**Descrição**

A loja escolhe "Acompanhar pedido" no menu e informa o código SEALog do pedido, ou escolhe entre os
seus pedidos mais recentes. O sistema responde na hora com o status atual, a data e a hora do último
registro e o detalhe que faz sentido para o status: a data prevista, a terceirizada que está com o
pacote, o nome de quem recebeu depois da entrega, ou o motivo da não entrega.

A resposta vem do registro único, alimentado pelo retorno da terceirizada, e funciona a qualquer
hora, inclusive fora do horário do atendimento. A loja só vê os pedidos dela. Da mesma resposta, a
loja pode relatar um problema com aquele pedido (`HU-SL-017`).

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Acompanhar é uma das três opções do menu, e o pedido é identificado pelo código SEALog. | `RN-SL-004` |
| RN2 | A loja vê só os pedidos dela; código de outra loja recebe a mesma resposta de código não encontrado. | `RN-SL-054` |
| RN3 | A resposta mostra o status e a data e a hora do último registro, para que se saiba se a informação é atual. | `RN-SL-022` |
| RN4 | O status considera a hora do fato informada pela terceirizada, não a hora em que o retorno chegou. | `RN-SL-035` |
| RN5 | O relato de problema sai do acompanhamento do pedido, sem um quarto botão no menu. | `RN-SL-004`, `RN-SL-036` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Pedido em rota | que a terceirizada informou que o pacote saiu para entrega às 10h15 | consulto o código | vejo "Em rota desde 10h15" e a data prevista. |
| CA2 | Pedido entregue | que o pedido foi entregue com comprovante | consulto o código | vejo "Entregue", a data e a hora e o nome de quem recebeu. |
| CA3 | Não entregue | que a terceirizada informou que não achou o endereço | consulto o código | vejo "Não entregue", o motivo e o botão para relatar problema. |
| CA4 | Código de outra loja | que informo o código de um pedido de outra loja | peço o acompanhamento | recebo a mensagem de pedido não encontrado, sem nenhum dado do pedido. |
| CA5 | Código inexistente | que digito um código errado | peço o acompanhamento | recebo a mensagem de pedido não encontrado e posso tentar de novo. |
| CA6 | Fora do horário | que é sábado, 16h | consulto o código | recebo a resposta na hora, sem atendente. |

**Integrações e APIs** — `INT-001` WhatsApp: opção do menu, pergunta do código e resposta com o status (`MSG-SL-008`, `MSG-SL-009`).

**Referências** — Enunciado §2 (o caminho de "cadê minha entrega?"); Encontro 1 [08:38] (acompanhar pelo ID do pedido), [25:39]; Planejamento da equipe (RF-07); Gargalos §4.

---

### HU-SL-003 — Editar ou cancelar o pedido pelo WhatsApp

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Loja |
| **Telas** | `TL-SL-002` Conversa do WhatsApp, `TL-SL-003` Formulário de pedido no WhatsApp |
| **Origem legada** | Hoje: a loja manda a correção por mensagem, a atendente repassa no grupo interno e o analista corrige a planilha, se achar a linha certa; a mudança pode não chegar a quem vai entregar. Na lista da equipe: RF-19 e RF-20 |
| **Prioridade** | Média |

**Como** loja cliente da SEALog
**Gostaria de** corrigir ou cancelar um pedido pela mesma conversa em que pedi
**Para que** a correção chegue a quem vai entregar sem passar por três pessoas.

**Descrição**

A loja escolhe "Editar pedido" no menu e informa o código. Enquanto a terceirizada não registrou a
coleta, abre-se o mesmo formulário do pedido, com os dados já preenchidos, e a loja muda o que
precisar — endereço, telefone, data, quem pode receber — ou cancela o pedido. As validações são as
mesmas do pedido novo.

Se o pedido já foi despachado, a mudança vai na hora para a terceirizada, com o que mudou em
destaque (`HU-SL-012`). Depois da coleta, a edição pelo WhatsApp é recusada e a loja é orientada a
falar com o atendimento. A loja recebe a confirmação de toda mudança, e tudo fica no histórico do
pedido.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A loja edita ou cancela pelo WhatsApp até a terceirizada registrar a coleta; o limite está para confirmação. | `RN-SL-011`, `Q-SL-04` |
| RN2 | A edição passa pelas mesmas validações do pedido novo. | `RN-SL-005`, `RN-SL-006` |
| RN3 | A autorização de entrega a outra pessoa pode ser incluída ou retirada na edição. | `RN-SL-013` |
| RN4 | Mudança depois do despacho vai na hora para a terceirizada, com o que mudou em destaque. | `RN-SL-026` |
| RN5 | Toda mudança fica no histórico do pedido, com a loja como autora e o valor anterior. | `RN-SL-020` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Corrigir antes da coleta | que o pedido está despachado e ainda não foi coletado | mudo o número do apartamento | o pedido é atualizado, a terceirizada recebe a alteração e eu recebo a confirmação. |
| CA2 | Depois da coleta | que a terceirizada já registrou a coleta | tento editar | recebo a mensagem de que o pedido já foi coletado e devo falar com o atendimento. |
| CA3 | Cancelar | que o pedido ainda não foi coletado | cancelo | o pedido fica Cancelado, a terceirizada é avisada e eu recebo a confirmação. |
| CA4 | Edição inválida | que apaguei o telefone do destinatário | tento salvar | o formulário não salva e aponta o telefone como obrigatório. |
| CA5 | Autorizar o porteiro | que o destinatário vai viajar | incluo o porteiro entre quem pode receber | a autorização fica no pedido e chega à terceirizada. |

**Integrações e APIs** — `INT-001` WhatsApp, para o menu, o formulário e a confirmação (`MSG-SL-010`, `MSG-SL-011`); `INT-002` API padrão da terceirizada, para levar a alteração quando o pedido já foi despachado.

**Referências** — Encontro 1 [08:38] (editar pedido), [43:19]; Planejamento da equipe (RF-19, RF-20); Gargalos §2.

---

### HU-SL-004 — Registrar o pedido que chegou fora do formulário

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Coordenador |
| **Telas** | `TL-SL-004` Novo pedido pela equipe, `TL-SL-011` Importação de planilha |
| **Origem legada** | Hoje: pedidos em áudio, texto livre ou planilha própria da loja são copiados à mão do WhatsApp para a planilha do dia; quando falta dado, a atendente volta à loja e espera. Na lista da equipe: RF-07 e RF-19 |
| **Prioridade** | Alta |

**Como** atendente
**Gostaria de** registrar no sistema o pedido que a loja mandou por áudio, mensagem livre, ligação ou planilha
**Para que** nenhum pedido fique só na conversa, e o que faltar seja completado pela própria loja.

**Descrição**

Nem toda loja vai usar o formulário desde o primeiro dia. Quando o pedido chega de outro jeito, o
atendente o registra no painel, num formulário com os mesmos campos e as mesmas validações do
WhatsApp, ou importa a planilha da loja: cada linha vira um pedido.

Se faltar algum dado obrigatório, o pedido pode ser gravado assim mesmo, como "Pendente de dados",
com a lista do que falta. A loja recebe no WhatsApp um aviso com um botão para completar só o que
falta; quando ela completa, o pedido passa a "Recebido" e segue sozinho para a terceirizada. O canal
de origem fica registrado, e pedido igual a outro gera o mesmo aviso de repetição.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O pedido registrado pela equipe passa pelas mesmas validações do formulário do WhatsApp, e o canal de origem fica registrado. | `RN-SL-012` |
| RN2 | São obrigatórios os mesmos dados do pedido pelo WhatsApp. | `RN-SL-005` |
| RN3 | O telefone tem DDD e 10 ou 11 dígitos; endereço sem número exige a marca "Sem número" e o ponto de referência. | `RN-SL-007`, `RN-SL-008` |
| RN4 | O que faltar deixa o pedido "Pendente de dados", fora do despacho, e a loja recebe o formulário para completar só o que falta. | `RN-SL-012` |
| RN5 | Na planilha da loja, cada linha vira um pedido; linha incompleta entra como pendente, não é descartada. | `RN-SL-012` |
| RN6 | Pedido igual a outro da mesma loja gera aviso, sem bloquear. | `RN-SL-010` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Pedido por áudio, completo | que transcrevi um áudio com todos os dados | confirmo o pedido | ele recebe o código, o canal "Equipe" e a loja recebe a confirmação no WhatsApp. |
| CA2 | Falta a rua | que o pedido para o condomínio Mar Azul chegou sem rua e sem telefone | gravo como pendente | o pedido fica "Pendente de dados" com rua e telefone na lista do que falta, e a loja recebe o aviso para completar. |
| CA3 | Loja completa | que a loja recebeu o aviso de pedido pendente | completa os dados no WhatsApp | o pedido passa a "Recebido" e segue para a terceirizada, sem trabalho do atendente. |
| CA4 | Planilha da loja | que importei uma planilha com 3 linhas, uma sem número | a importação termina | vejo 2 pedidos recebidos e 1 pendente, com o motivo, e a loja é avisada do pendente. |
| CA5 | Telefone inválido | que digitei o telefone sem DDD | tento confirmar | o sistema aponta o telefone e pede DDD e número. |
| CA6 | Sem permissão | que entrei com o perfil Financeiro | tento abrir o registro de pedido | o sistema recusa e informa que meu perfil não tem acesso. |

**Integrações e APIs** — `INT-001` WhatsApp, para a confirmação e o aviso de pedido pendente com o formulário de complemento (`MSG-SL-007`, `MSG-SL-013`); `INT-003` Planilhas, para importar a planilha da loja.

**Referências** — Enunciado §2 (texto, áudio e planilhas próprias; cerca de 1 em 5 incompleto), §8 (caso "Pedido com informações incompletas"); Planejamento da equipe (RF-07, RF-19); Gargalos §1, §2.

---

## Cadastros

### HU-SL-005 — Cadastrar a loja e os números autorizados

| | |
|---|---|
| **Módulo** | `cadastros` |
| **Sistema** | SEALog |
| **Atores** | Coordenador |
| **Telas** | `TL-SL-005` Lojas e números autorizados |
| **Origem legada** | Hoje: não há cadastro; a loja é reconhecida pelo nome na conversa, e qualquer número que escreva ao Atendimento pode pedir uma entrega. Na lista da equipe: RF-01 e RF-02 (a autenticação da loja passa a ser o número autorizado, sem senha) |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** cadastrar cada loja com os números de WhatsApp que podem pedir por ela
**Para que** só quem é cliente faça pedido, e cada pedido saiba de que loja é sem perguntar.

**Descrição**

O coordenador cadastra a loja com os dados comerciais e um ou mais números de WhatsApp autorizados —
o do dono, o do balcão. A partir daí, mensagem de um desses números abre o menu de pedidos já
identificada; a loja não tem senha nem conta.

Um número pode ser incluído ou retirado a qualquer momento, e a loja pode ser desativada; loja
inativa não faz pedido novo. Cada inclusão e retirada fica no histórico, com quem fez e quando.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A loja é cadastrada pela equipe, com um ou mais números de WhatsApp autorizados. | `RN-SL-014` |
| RN2 | Só número autorizado de loja ativa abre o menu de pedidos. | `RN-SL-003` |
| RN3 | A loja não tem senha: é identificada pelo número e vê só os pedidos dela. | `RN-SL-054` |
| RN4 | Um número autorizado pertence a uma só loja ativa. | `RN-SL-014` |
| RN5 | Incluir ou tirar um número, e ativar ou desativar a loja, fica no histórico com quem fez. | `RN-SL-014` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Loja nova | que a floricultura assinou com a SEALog | cadastro a loja com dois números | os dois números passam a receber o menu de pedidos, já com o nome da floricultura. |
| CA2 | Número retirado | que um funcionário saiu da loja | retiro o número dele | a próxima mensagem desse número recebe a orientação de procurar o atendimento. |
| CA3 | Número de outra loja | que o número já está autorizado para outra loja ativa | tento incluí-lo | o sistema recusa e diz a qual loja ele pertence. |
| CA4 | Loja desativada | que desativei a loja | um número dela pede um pedido novo | recebe a orientação de procurar o atendimento, e nada é registrado. |
| CA5 | Sem permissão | que entrei com o perfil Atendente | tento incluir um número | o sistema recusa. |

**Integrações e APIs** — `INT-001` WhatsApp: o número de quem escreve é conferido contra os números autorizados (`MSG-SL-002`).

**Referências** — Encontro 1 [08:38] (validação do número de origem); Planejamento da equipe (RF-01, RF-02; RBAC e Auth).

---

### HU-SL-006 — Manter os dados comerciais da loja

| | |
|---|---|
| **Módulo** | `cadastros` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Coordenador |
| **Telas** | `TL-SL-005` Lojas e números autorizados |
| **Origem legada** | Hoje: endereço de coleta, contato e condição de cobrança de cada loja ficam na memória da equipe ou em planilhas soltas, e a mudança chega por mensagem. Na lista da equipe: RF-03 e RF-04 (com banco único, a sincronização deixa de ser um passo separado) |
| **Prioridade** | Média |

**Como** atendente
**Gostaria de** manter atualizados os dados comerciais de cada loja
**Para que** todo pedido novo saia com o endereço de coleta e o contato certos, sem eu repetir a informação.

**Descrição**

Os dados comerciais da loja — nome, documento, endereço de coleta, contato e condição de cobrança —
ficam no cadastro e entram em todo pedido novo: o endereço de coleta vai no despacho para a
terceirizada, e a condição de cobrança é usada no fechamento.

Quando a loja muda de endereço ou de contato, a equipe atualiza o cadastro. A mudança vale a partir
do pedido seguinte; pedidos já despachados continuam com o endereço que tinham. Tudo fica no
histórico, com o valor anterior.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Os dados comerciais da loja ficam no cadastro e são usados em todo pedido novo. | `RN-SL-015` |
| RN2 | A alteração vale a partir do pedido seguinte e fica no histórico, com o valor anterior. | `RN-SL-015` |
| RN3 | O endereço de coleta vai no despacho para a terceirizada. | `RN-SL-024` |
| RN4 | O valor cobrado da loja depende da tabela de preços da SEALog. | `RN-SL-047`, `Q-SL-08` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Endereço de coleta novo | que a papelaria mudou de endereço | atualizo o cadastro | os pedidos seguintes saem com o endereço novo no despacho. |
| CA2 | Pedido já despachado | que havia um pedido despachado antes da mudança | atualizo o endereço | o pedido despachado mantém o endereço antigo, e o histórico mostra a mudança no cadastro. |
| CA3 | Campo obrigatório vazio | que apaguei o endereço de coleta | tento salvar | o sistema aponta o campo e não salva. |
| CA4 | Histórico | que o contato da loja foi trocado | abro o histórico da loja | vejo quem trocou, quando e o contato anterior. |

**Integrações e APIs** — Nenhuma. Cadastro interno; o endereço chega à terceirizada pelo despacho de `HU-SL-011`.

**Referências** — Planejamento da equipe (RF-03, RF-04).

---

### HU-SL-007 — Cadastrar a terceirizada

| | |
|---|---|
| **Módulo** | `cadastros` |
| **Sistema** | SEALog |
| **Atores** | Coordenador |
| **Telas** | `TL-SL-006` Terceirizadas |
| **Origem legada** | Hoje: a SEALog terceirizou as entregas para duas empresas, uma por região; cada uma manda notícia do seu jeito, por planilha ou WhatsApp, e não há registro de quem atende o quê. Substitui, na lista da equipe, RF-05 e RF-06 (cadastro e análise de motoristas): o motorista agora é da terceirizada |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** cadastrar cada terceirizada com as regiões que atende e o jeito que ela devolve o status
**Para que** o pedido chegue à empresa certa e o retorno dela entre no mesmo padrão, hoje e com qualquer empresa nova.

**Descrição**

O coordenador cadastra a terceirizada com o nome, o documento, o contato para o despacho e a forma de
retorno que ela vai usar: pela integração com o SEALog, pelo portal ou por planilha. A terceirizada
recebe uma credencial própria — chave de integração ou usuário do portal — que só dá acesso às
entregas despachadas para ela.

O padrão de retorno e de comprovação é o mesmo para todas, as duas de hoje e as que vierem. As
regiões que cada uma atende são mantidas na tabela de regiões (`HU-SL-008`). Terceirizada inativa
não recebe despacho novo.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A terceirizada é cadastrada com as regiões que atende, a forma de retorno e o contato para despacho, e tem credencial própria. | `RN-SL-016` |
| RN2 | Toda terceirizada, atual ou futura, segue o mesmo padrão de retorno e de comprovação. | `RN-SL-019` |
| RN3 | Pela integração ou pelo portal, a terceirizada vê e altera só as entregas despachadas para ela. | `RN-SL-053` |
| RN4 | Terceirizada inativa não recebe despacho novo. | `RN-SL-016` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Terceirizada com integração | que a empresa da zona sul tem sistema próprio | cadastro com retorno pela integração | ela recebe uma chave própria e passa a receber os despachos por ali. |
| CA2 | Terceirizada sem integração | que a empresa da zona norte usa só planilha e WhatsApp | cadastro com retorno pelo portal | ela recebe usuário do portal e vê lá a lista do dia. |
| CA3 | Empresa nova | que a SEALog contratou uma terceira empresa | cadastro e ligo os bairros dela | os pedidos desses bairros passam a ir para ela, com o mesmo padrão de retorno das outras. |
| CA4 | Chave trocada | que a chave de uma terceirizada vazou | gero uma chave nova | a chave antiga deixa de funcionar na hora. |
| CA5 | Inativar com região ativa | que a terceirizada ainda é a única de alguns bairros | tento inativá-la | o sistema avisa quais bairros ficariam sem terceirizada e pede que eu os passe a outra. |

**Integrações e APIs** — `INT-002` API padrão da terceirizada: o cadastro guarda o endereço da integração e a chave, só em forma irreversível.

**Referências** — Encontro 1 [13:15], [15:19], [17:36], [27:54]; Planejamento da equipe (RF-05, RF-06, substituídos).

---

### HU-SL-008 — Manter a tabela de regiões

| | |
|---|---|
| **Módulo** | `cadastros` |
| **Sistema** | SEALog |
| **Atores** | Coordenador |
| **Telas** | `TL-SL-007` Tabela de regiões |
| **Origem legada** | Hoje: o coordenador e os analistas distribuem os pedidos de cabeça, pelo conhecimento das regiões; depois da terceirização, decidem para qual das duas empresas cada pedido vai. Substitui, na lista da equipe, RF-12 (distribuição por motorista) |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** manter a tabela que diz qual terceirizada atende cada bairro
**Para que** o pedido vá sozinho para a empresa certa, sem eu distribuir à mão.

**Descrição**

A tabela de regiões liga cada par de bairro e cidade a uma terceirizada. É o que o sistema usa para
despachar cada pedido sem ninguém no meio (`HU-SL-010`). O coordenador inclui, muda ou desativa
linhas; um bairro tem uma só terceirizada ativa de cada vez.

Quando chega pedido para um bairro que não está na tabela, ele fica "Aguardando região" e aparece ao
coordenador, que escolhe a terceirizada e pode, no mesmo passo, incluir o bairro na tabela para os
próximos pedidos.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Cada par de bairro e cidade aponta para uma terceirizada, e só o coordenador mantém a tabela. | `RN-SL-017` |
| RN2 | Um bairro tem uma só terceirizada ativa de cada vez. | `RN-SL-017` |
| RN3 | Pedido para bairro fora da tabela fica "Aguardando região" e aparece ao coordenador. | `RN-SL-018` |
| RN4 | Ao escolher a terceirizada de um pedido aguardando região, o coordenador pode incluir o bairro na tabela. | `RN-SL-018` |
| RN5 | Toda mudança na tabela fica registrada, com quem fez e quando. | `RN-SL-017` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Bairro novo | que Piedade não está na tabela | incluo Piedade, Jaboatão, para a empresa da zona sul | os pedidos seguintes para Piedade vão para ela. |
| CA2 | Bairro repetido | que Boa Viagem já aponta para uma terceirizada | tento ligar Boa Viagem a outra | o sistema recusa e diz qual terceirizada já atende o bairro. |
| CA3 | Grafia diferente | que a loja escreveu "Gracas", sem acento | o pedido chega | o sistema reconhece o bairro Graças da tabela. |
| CA4 | Pedido sem região | que chegou pedido para um bairro fora da tabela | abro a tabela | vejo o pedido aguardando, escolho a terceirizada e marco para incluir o bairro. |
| CA5 | Troca de terceirizada | que um bairro passou de uma empresa para a outra | mudo a linha | só os pedidos novos vão para a nova; os já despachados continuam com a anterior. |

**Integrações e APIs** — Nenhuma. A tabela é interna; o despacho que a usa está em `HU-SL-010` e `HU-SL-011`.

**Referências** — Encontro 1 [15:19] (duas empresas, uma por região); Enunciado §2 (distribuição pelo conhecimento das regiões); Planejamento da equipe (RF-12, substituído).

---

## Despacho

### HU-SL-009 — Consultar a lista única de entregas

| | |
|---|---|
| **Módulo** | `despacho` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Coordenador, Financeiro |
| **Telas** | `TL-SL-008` Lista de entregas, `TL-SL-009` Detalhe da entrega, `TL-SL-017` Exportação para planilha |
| **Origem legada** | Hoje: cada analista registra as entregas dos seus clientes numa planilha online do dia, e as cópias divergem; num caso, um "ok" foi marcado na linha errada e a equipe levou um dia para descobrir o que houve. Na lista da equipe: RF-08 |
| **Prioridade** | Alta |

**Como** atendente
**Gostaria de** ver todas as entregas numa lista só, a mesma para a equipe toda
**Para que** eu responda "cadê minha entrega?" em segundos e ninguém trabalhe numa cópia desatualizada.

**Descrição**

A lista de entregas substitui as planilhas do dia. Ela se organiza pela data prevista e se usa como
uma planilha: filtro por data, loja, bairro, terceirizada e status, busca pelo código, pelo nome ou
pelo telefone do destinatário. Cada linha mostra a data e a hora do último registro, para que se
saiba se a informação é atual, e a entrega despachada sem retorno há mais tempo que o combinado fica
sinalizada.

Ao abrir uma entrega, a equipe vê os dados do pedido, a terceirizada, o comprovante, os chamados, os
avisos enviados e o histórico de tudo o que mudou, com quem mudou e quando. A lista pode ser
exportada para planilha com as mesmas colunas e filtros, mas nada exportado volta ao sistema.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Há uma única lista de entregas, sem cópia por pessoa; toda alteração fica no histórico com autor, hora e valor anterior. | `RN-SL-020` |
| RN2 | O status segue o ciclo da entrega; mudança fora do ciclo é recusada. | `RN-SL-021` |
| RN3 | A lista se organiza pela data prevista e mostra a data e a hora do último registro. | `RN-SL-022` |
| RN4 | Entrega despachada sem retorno há mais tempo que o limite combinado fica sinalizada. | `RN-SL-034`, `Q-SL-13` |
| RN5 | A lista pode ser exportada para planilha com as mesmas colunas e filtros; nada exportado volta. | `RN-SL-050` |
| RN6 | O perfil Financeiro vê a lista sem poder alterá-la. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | "Cadê minha entrega?" | que a loja me liga perguntando por um pedido | busco pelo nome do destinatário | encontro a entrega, vejo o status, a terceirizada e a hora do último registro, sem perguntar a ninguém. |
| CA2 | Registro incorreto | que um destinatário diz, três dias depois, que não recebeu | abro a entrega | vejo o comprovante com a foto, quem recebeu, o entregador e a hora, presos àquela entrega. |
| CA3 | Sem retorno | que uma entrega foi despachada e a terceirizada não deu notícia além do limite | abro a lista | a entrega aparece sinalizada. |
| CA4 | Filtro do dia | que quero as entregas de amanhã de uma terceirizada | filtro por data prevista e terceirizada | vejo só essas, e posso exportá-las. |
| CA5 | Lista vazia | que filtrei uma combinação sem entregas | peço a exportação | o sistema informa que não há entregas e não gera arquivo. |
| CA6 | Financeiro só lê | que entrei com o perfil Financeiro | abro uma entrega | vejo tudo, mas não há ação de alterar. |

**Integrações e APIs** — `INT-003` Planilhas, para a exportação.

**Referências** — Enunciado §2 (planilha por analista, cópias divergentes), §8 (caso "O registro incorreto"); Planejamento da equipe (RF-08; substituir planilha por banco); Gargalos §2, §4, §8.

---

### HU-SL-010 — Distribuir o pedido pela região

| | |
|---|---|
| **Módulo** | `despacho` |
| **Sistema** | SEALog |
| **Atores** | Sistema, Coordenador |
| **Telas** | `TL-SL-007` Tabela de regiões, `TL-SL-009` Detalhe da entrega |
| **Origem legada** | Hoje: o coordenador e os analistas decidem, pedido a pedido, para quem cada entrega vai, pelo conhecimento das regiões, sem ferramenta. Na lista da equipe: RF-12, agora por terceirizada e não por motorista |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** que cada pedido recebido vá sozinho para a terceirizada da região do destinatário
**Para que** a distribuição não dependa de alguém olhar pedido por pedido, e eu só cuide do que foge da regra.

**Descrição**

Assim que o pedido fica "Recebido", o sistema procura o bairro e a cidade do destinatário na tabela
de regiões e o despacha para a terceirizada correspondente. Ninguém distribui à mão.

Se o bairro não está na tabela, o pedido fica "Aguardando região" e aparece ao coordenador. Ele
escolhe a terceirizada, e o pedido segue; se quiser, inclui o bairro na tabela no mesmo passo. Se a
terceirizada da região estiver inativa, o pedido também cai para o coordenador.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O pedido recebido vai sozinho para a terceirizada da região, pela tabela de regiões. | `RN-SL-023` |
| RN2 | Cada bairro tem uma só terceirizada ativa. | `RN-SL-017` |
| RN3 | Bairro fora da tabela deixa o pedido "Aguardando região", para o coordenador escolher. | `RN-SL-018` |
| RN4 | Pedido "Pendente de dados" não é distribuído. | `RN-SL-012` |
| RN5 | A distribuição fica no histórico da entrega, com a terceirizada e se foi pela tabela ou pelo coordenador. | `RN-SL-020` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Bairro na tabela | que Graças aponta para a empresa da zona norte | chega um pedido para Graças | ele é despachado para essa empresa sem ninguém intervir. |
| CA2 | Bairro fora da tabela | que um pedido chegou para um bairro novo | o sistema tenta distribuir | o pedido fica "Aguardando região" e aparece ao coordenador. |
| CA3 | Coordenador escolhe | que há um pedido aguardando região | escolho a terceirizada e marco para incluir o bairro | o pedido é despachado e o bairro entra na tabela. |
| CA4 | Pedido pendente | que um pedido está pendente de dados | o sistema procura pedidos a distribuir | o pedido não é despachado até ser completado. |
| CA5 | Terceirizada inativa | que a terceirizada do bairro foi inativada | chega um pedido para esse bairro | o pedido fica aguardando o coordenador. |

**Integrações e APIs** — Nenhuma. A distribuição é interna; o envio à terceirizada está em `HU-SL-011`.

**Referências** — Encontro 1 [15:19]; Enunciado §2 (distribuição manual pelas regiões); Planejamento da equipe (RF-12).

---

### HU-SL-011 — Enviar a solicitação à terceirizada

| | |
|---|---|
| **Módulo** | `despacho` |
| **Sistema** | SEALog |
| **Atores** | Sistema, Terceirizada |
| **Telas** | `TL-SL-010` Portal da terceirizada |
| **Origem legada** | Hoje: cada motorista recebia o roteiro individualmente pelo WhatsApp; depois da terceirização, a SEALog manda os pedidos às empresas por WhatsApp e planilha, e os pacotes são identificados com etiquetas escritas à mão. Na lista da equipe: RF-10 (forma de coleta) e RF-13 (visualização das entregas, agora pela terceirizada) |
| **Prioridade** | Alta |

**Como** terceirizada que entrega para a SEALog
**Gostaria de** receber cada solicitação de coleta e entrega com tudo o que preciso, no mesmo formato
**Para que** eu colete na loja e entregue sem ligar para a SEALog para perguntar o que falta.

**Descrição**

Despachado o pedido, a terceirizada recebe a solicitação com o código SEALog, o endereço de coleta da
loja, o destinatário com telefone e endereço completo, o tamanho do volume, a data prevista, as
observações e quem pode receber além do destinatário. A terceirizada com integração recebe pelo
sistema dela; a outra vê a solicitação na lista do dia do portal.

A coleta na loja é feita pela terceirizada. O pacote não leva etiqueta da SEALog: o código SEALog é a
identificação, e a terceirizada o informa em todo retorno. A terceirizada confirma o recebimento da
solicitação; se a entrega falhar, o pedido fica sinalizado para a equipe.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O despacho leva o código, a coleta, o destinatário, o volume, a data prevista, as observações e quem pode receber. | `RN-SL-024` |
| RN2 | Sai pela integração da terceirizada ou entra na lista do dia do portal. | `RN-SL-024` |
| RN3 | A coleta é feita pela terceirizada na loja; as janelas de hoje estão para confirmação. | `RN-SL-025`, `Q-SL-02` |
| RN4 | O pacote é identificado só pelo código SEALog, sem etiqueta da SEALog. | `RN-SL-027` |
| RN5 | Retorno com código que não foi despachado para a terceirizada é recusado. | `RN-SL-027` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Despacho pela integração | que a terceirizada usa a integração | um pedido para a região dela é recebido | ela recebe a solicitação com todos os dados e o status passa a "Despachado". |
| CA2 | Despacho pelo portal | que a terceirizada usa o portal | entro no portal de manhã | vejo a lista do dia com cada solicitação, o endereço de coleta e o destinatário. |
| CA3 | Autorização vai junto | que a loja autorizou o porteiro a receber | a solicitação é enviada | o nome do porteiro aparece na solicitação. |
| CA4 | Falha no envio | que a integração da terceirizada está fora do ar | o despacho é tentado | o sistema tenta de novo e, se continuar falhando, sinaliza o pedido para a equipe. |
| CA5 | Só as minhas | que sou da empresa da zona norte | abro o portal | não vejo nenhuma solicitação da empresa da zona sul. |

**Integrações e APIs** — `INT-002` API padrão da terceirizada, para o despacho a quem tem integração; quem não tem recebe pelo portal (`TL-SL-010`).

**Referências** — Encontro 1 [13:15], [15:19], [17:36]; Enunciado §2 (roteiro por WhatsApp, etiquetas à mão, coleta de 14h a 18h); Planejamento da equipe (RF-10, RF-11, RF-13; identificação própria sem etiqueta).

---

### HU-SL-012 — Avisar a terceirizada de alteração no pedido

| | |
|---|---|
| **Módulo** | `despacho` |
| **Sistema** | SEALog |
| **Atores** | Sistema, Atendente |
| **Telas** | `TL-SL-009` Detalhe da entrega, `TL-SL-010` Portal da terceirizada |
| **Origem legada** | Hoje: a correção de endereço ou telefone chega por mensagem ao Atendimento, passa pelo grupo interno e, se alguém lembrar, ao motorista; com a terceirização, vai por WhatsApp à empresa. Na lista da equipe: RF-19 e RF-20 (o aviso é à terceirizada, não ao motorista) |
| **Prioridade** | Média |

**Como** atendente
**Gostaria de** que toda alteração num pedido já despachado chegue na hora à terceirizada
**Para que** a entrega não saia com o endereço velho.

**Descrição**

Quando o pedido muda depois do despacho — pela loja no WhatsApp (`HU-SL-003`) ou pela equipe no
painel —, o sistema envia a alteração à terceirizada pelo mesmo caminho do despacho, com o que mudou
em destaque. Cancelamento também é enviado.

A terceirizada confirma que recebeu a alteração. Enquanto não confirma, o pedido mostra a alteração
como pendente de confirmação, e a equipe vê isso no detalhe da entrega. Depois da coleta, a equipe
ainda pode alterar dados do destinatário, mas a alteração fica marcada para atenção.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Alteração ou cancelamento depois do despacho vai na hora para a terceirizada, com o que mudou em destaque. | `RN-SL-026` |
| RN2 | A terceirizada confirma que recebeu a alteração. | `RN-SL-026` |
| RN3 | Pela loja, a alteração só vale até a coleta; depois, só pelo atendimento. | `RN-SL-011` |
| RN4 | A alteração fica no histórico, com autor, hora e valor anterior. | `RN-SL-020` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Telefone corrigido | que o pedido está despachado | corrijo o telefone do destinatário no painel | a terceirizada recebe a alteração com o telefone novo em destaque. |
| CA2 | Confirmação | que a terceirizada recebeu a alteração | ela confirma | o detalhe da entrega mostra a alteração como confirmada, com a hora. |
| CA3 | Sem confirmação | que a terceirizada não confirmou a alteração | abro a entrega | vejo a alteração pendente de confirmação. |
| CA4 | Cancelamento | que a loja cancelou antes da coleta | o cancelamento é gravado | a terceirizada recebe o aviso de cancelamento e a solicitação some da lista do dia dela. |
| CA5 | Falha no envio | que a integração da terceirizada não respondeu | a alteração é enviada | o sistema tenta de novo e, se falhar, mostra a falha no painel de chamados. |

**Integrações e APIs** — `INT-002` API padrão da terceirizada, para a alteração a quem tem integração; quem não tem vê a alteração destacada no portal (`TL-SL-010`).

**Referências** — Planejamento da equipe (RF-19, RF-20); Encontro 1 [13:15]; Gargalos §2.

---

## Retorno da terceirizada

### HU-SL-013 — Informar o status pela API

| | |
|---|---|
| **Módulo** | `retorno-terceirizada` |
| **Sistema** | SEALog |
| **Atores** | Terceirizada |
| **Telas** | — (integração direta, sem tela) |
| **Origem legada** | Hoje: o motorista da terceirizada avisa a empresa dele, que repassa à SEALog por planilha, WhatsApp ou ligação, cada uma no seu padrão; muitas notícias chegam em lote ou só quando há problema. Na lista da equipe: RF-14 (ocorrências durante a entrega, agora informadas pela terceirizada) |
| **Prioridade** | Alta |

**Como** terceirizada com sistema próprio
**Gostaria de** mandar cada mudança de status direto para o SEALog, no padrão dele
**Para que** a SEALog saiba na hora o que aconteceu, sem planilha nem mensagem.

**Descrição**

A terceirizada com integração informa, para cada pacote, cinco situações: coletado, em rota,
entregue, não entregue e devolvido ao galpão, sempre com o código SEALog e a data e a hora do fato.
É o caminho preferencial, e o padrão é o mesmo para qualquer terceirizada.

Entregue só é aceito com o comprovante completo: foto, data e hora, nome de quem recebeu e
identificação do entregador. Não entregue exige um motivo da lista padrão e abre um chamado. O
sistema recusa o retorno que não fecha — código de outra empresa, comprovante incompleto, salto no
ciclo — e diz por quê; o mesmo retorno mandado duas vezes é gravado uma vez só.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A terceirizada informa coletado, em rota, entregue, não entregue e devolvido ao galpão, com a data e a hora do fato. | `RN-SL-028` |
| RN2 | Entregue só é aceito com foto, data e hora, nome de quem recebeu e identificação do entregador. | `RN-SL-030` |
| RN3 | Quem recebeu sem ser o destinatário nem pessoa autorizada abre um chamado de recebedor não autorizado. | `RN-SL-031` |
| RN4 | Não entregue exige motivo da lista padrão e abre um chamado. | `RN-SL-032` |
| RN5 | O mesmo retorno recebido duas vezes é gravado uma vez só. | `RN-SL-033` |
| RN6 | O status considera a hora do fato, e as duas horas ficam registradas. | `RN-SL-035` |
| RN7 | Retorno de código não despachado para a terceirizada, ou fora do ciclo, é recusado com o motivo. | `RN-SL-021`, `RN-SL-027` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Entregue completo | que mando entregue com foto, hora, nome de quem recebeu e entregador | o retorno chega | a entrega fica "Entregue" com o comprovante, e a loja vê isso no acompanhamento. |
| CA2 | Sem foto | que mando entregue sem a foto | o retorno chega | ele é recusado com a lista do que falta, e a entrega continua como estava. |
| CA3 | Não achou o endereço | que o entregador não achou o endereço às 9h40 | mando não entregue com o motivo | a entrega fica "Não entregue", abre-se um chamado e a loja é avisada na hora, como devia ter sido no caso do buquê de sábado. |
| CA4 | Código de outra empresa | que mando um código despachado para outra terceirizada | o retorno chega | ele é recusado com a mensagem de que o código não foi despachado para mim. |
| CA5 | Retorno repetido | que meu sistema reenviou o mesmo entregue por falha de conexão | o retorno chega de novo | ele não duplica o registro. |
| CA6 | Notícia atrasada | que mando às 18h um entregue que aconteceu às 11h | o retorno chega | o status mostra a entrega às 11h, e o histórico guarda as duas horas. |

**Integrações e APIs** — `INT-002` API padrão da terceirizada: retorno de status com o comprovante; respostas de erro em `08-mensagens-e-erros.md` §3 (`MSG-SL-016` a `MSG-SL-019`).

**Referências** — Encontro 1 [13:15], [25:39], [26:53], [27:54], [40:16]; Enunciado §2 (atualização em lote ou só no problema), §8 (caso "O buquê de sábado"); Planejamento da equipe (RF-14; arquitetura baseada em APIs); Gargalos §3.

---

### HU-SL-014 — Informar o status pelo portal

| | |
|---|---|
| **Módulo** | `retorno-terceirizada` |
| **Sistema** | SEALog |
| **Atores** | Terceirizada |
| **Telas** | `TL-SL-010` Portal da terceirizada |
| **Origem legada** | Hoje: a terceirizada sem sistema avisa a SEALog por WhatsApp e atualiza uma planilha que a SEALog já usa; o cliente contou que os terceirizados têm pouca familiaridade com tecnologia. Na lista da equipe: RF-14 e RNF-02 (comunicação simples) |
| **Prioridade** | Alta |

**Como** terceirizada sem sistema próprio
**Gostaria de** marcar o status de cada entrega numa tela simples, no celular ou no computador
**Para que** eu cumpra o padrão da SEALog sem precisar de integração nem de planilha.

**Descrição**

O portal mostra à terceirizada a lista do dia com as solicitações despachadas para ela. Para cada
uma, a pessoa marca coletado, em rota, entregue ou não entregue, ou devolvido ao galpão. A tela pede
só o que a situação exige: no entregue, a foto, o nome de quem recebeu e a identificação do
entregador; no não entregue, o motivo, numa lista.

As regras são as mesmas da integração: o portal não aceita entregue sem comprovante completo, e a
terceirizada só vê as entregas dela. Alterações e cancelamentos aparecem em destaque na lista, para
serem confirmados.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A terceirizada informa as cinco situações, com a data e a hora do fato. | `RN-SL-028` |
| RN2 | O portal é um dos três caminhos de retorno, com as mesmas regras da integração. | `RN-SL-029` |
| RN3 | Entregue exige foto, data e hora, nome de quem recebeu e identificação do entregador. | `RN-SL-030` |
| RN4 | Não entregue exige um motivo da lista padrão e abre um chamado. | `RN-SL-032` |
| RN5 | A terceirizada entra com usuário próprio e vê só as entregas despachadas para ela. | `RN-SL-053` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Marcar entregue | que estou com a entrega aberta no portal | anexo a foto, o nome de quem recebeu e o entregador e marco entregue | a entrega fica "Entregue" na SEALog na hora. |
| CA2 | Faltou o nome | que anexei a foto mas não o nome de quem recebeu | tento marcar entregue | o portal aponta o nome como obrigatório e não grava. |
| CA3 | Não entregue | que o destinatário estava ausente | marco não entregue e escolho o motivo | a entrega fica "Não entregue" e abre-se um chamado na SEALog. |
| CA4 | Sem motivo | que marquei não entregue sem escolher o motivo | tento gravar | o portal pede o motivo. |
| CA5 | Alteração em destaque | que a loja mudou o endereço depois do despacho | abro a lista do dia | vejo a entrega com a alteração em destaque e confirmo que li. |

**Integrações e APIs** — Nenhuma. O portal é uma tela do próprio SEALog (`TL-SL-010`), sem integração com o sistema da terceirizada.

**Referências** — Encontro 1 [13:15], [23:17], [40:16]; Planejamento da equipe (RF-14, RNF-02).

---

### HU-SL-015 — Enviar o retorno por planilha

| | |
|---|---|
| **Módulo** | `retorno-terceirizada` |
| **Sistema** | SEALog |
| **Atores** | Terceirizada, Atendente |
| **Telas** | `TL-SL-011` Importação de planilha |
| **Origem legada** | Hoje: a terceirizada atualiza uma planilha com os status e manda à SEALog, cada uma com as suas colunas; um analista copia para a planilha do dia. Não está na lista da equipe; vem do Encontro 1 |
| **Prioridade** | Média |

**Como** terceirizada que já trabalha com planilha
**Gostaria de** mandar os status na minha planilha e ver a SEALog entendê-la
**Para que** eu comece a trabalhar com a SEALog sem mudar meu jeito de uma vez.

**Descrição**

A terceirizada que ainda não usa a integração nem o portal envia a planilha pelo portal, ou a equipe
a envia por ela. Na primeira vez, cada coluna da planilha é associada a um campo do padrão SEALog —
código, situação, data e hora, motivo, quem recebeu, entregador, foto —, e a associação fica guardada
para as próximas.

Cada linha é traduzida para o padrão e passa pelas mesmas regras da integração. A linha que não se
traduz ou não fecha é recusada com o motivo, e as outras entram. A planilha original fica guardada,
ligada aos retornos que gerou.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A planilha é traduzida para o mesmo padrão, linha a linha; linha que não se traduz é recusada com o motivo, e as outras entram. | `RN-SL-029` |
| RN2 | Cada linha passa pelas mesmas regras de comprovante e de ciclo da integração. | `RN-SL-021`, `RN-SL-030` |
| RN3 | Linha repetida de um retorno já recebido é gravada uma vez só. | `RN-SL-033` |
| RN4 | O status considera a data e a hora do fato que a linha informa. | `RN-SL-035` |
| RN5 | A planilha original fica guardada, com a associação de colunas usada. | `RN-SL-029` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Primeira planilha | que mando uma planilha com colunas "Pedido", "Status" e "Hora" | o sistema lê a planilha | ele pede que eu associe cada coluna a um campo do padrão e guarda a associação. |
| CA2 | Planilha conhecida | que já associei as colunas antes | mando a planilha do dia | ela é traduzida sem perguntar de novo. |
| CA3 | Linha sem comprovante | que uma linha diz entregue mas não tem o nome de quem recebeu | a importação termina | essa linha é recusada com o motivo, e as demais entram. |
| CA4 | Resultado | que a planilha tinha 40 linhas e 2 com problema | a importação termina | vejo 38 aceitas e 2 recusadas, cada uma com o motivo. |
| CA5 | Coluna desconhecida | que a planilha tem uma coluna que não corresponde a nenhum campo | o sistema lê a planilha | pede que eu diga a que campo ela corresponde, ou que a ignore. |

**Integrações e APIs** — `INT-003` Planilhas: entrada de planilha da terceirizada, em XLSX ou CSV, traduzida para o padrão de `INT-002`.

**Referências** — Encontro 1 [13:15], [13:51], [23:17]; Planejamento da equipe (substituir planilha por banco).

---

### HU-SL-016 — Conferir o comprovante de entrega

| | |
|---|---|
| **Módulo** | `retorno-terceirizada` |
| **Sistema** | SEALog |
| **Atores** | Coordenador, Atendente |
| **Telas** | `TL-SL-009` Detalhe da entrega |
| **Origem legada** | Hoje: a foto do comprovante vai solta para o grupo, e no caso do registro incorreto a equipe levou um dia para achá-la e descobrir que o pacote foi deixado no apartamento errado; depois da terceirização, a SEALog pode nem receber foto. Na lista da equipe: RF-15 |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** ter, em cada entrega concluída, um comprovante completo e no mesmo padrão
**Para que** eu prove a entrega quando o destinatário disser que não recebeu, e pague a terceirizada só pelo que foi comprovado.

**Descrição**

Todo "Entregue" traz o comprovante padrão: foto, data e hora, nome de quem recebeu e identificação
do entregador. O comprovante fica preso à entrega, no detalhe dela, e não existe solto.

O sistema compara quem recebeu com o destinatário e com as pessoas que a loja autorizou. Se quem
recebeu não é nenhum deles — o vizinho que ninguém autorizou —, a entrega conta como feita, mas
abre-se um chamado de recebedor não autorizado para a equipe tratar. É também o comprovante aceito
que conta no pagamento da terceirizada.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Entregue só é aceito com foto, data e hora, nome de quem recebeu e identificação do entregador. | `RN-SL-030` |
| RN2 | Entrega a vizinho, porteiro ou outra pessoa só vale com autorização prévia da loja. | `RN-SL-013` |
| RN3 | Recebedor fora do destinatário e dos autorizados abre um chamado de recebedor não autorizado. | `RN-SL-031` |
| RN4 | O comprovante é o mesmo para toda terceirizada. | `RN-SL-019` |
| RN5 | Só a entrega com comprovante aceito entra no pagamento da terceirizada. | `RN-SL-048` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Destinatário recebeu | que a entrega foi recebida pela própria destinatária | abro a entrega | vejo a foto, a hora, o nome dela e o entregador, marcados como recebimento pelo destinatário. |
| CA2 | Porteiro autorizado | que a loja autorizou Dona Lúcia a receber | a terceirizada informa que Dona Lúcia recebeu | a entrega fica "Entregue" sem chamado. |
| CA3 | Vizinho sem autorização | que ninguém autorizou outra pessoa | a terceirizada informa que um vizinho recebeu | a entrega fica "Entregue" e abre-se um chamado de recebedor não autorizado. |
| CA4 | Destinatário nega | que o destinatário diz, três dias depois, que não recebeu | abro a entrega | encontro o comprovante na hora, sem procurar foto em grupo. |
| CA5 | Comprovante incompleto | que a terceirizada mandou entregue sem a identificação do entregador | o retorno chega | ele é recusado e a entrega não conta como feita. |

**Integrações e APIs** — `INT-002` API padrão da terceirizada, por onde chega a maior parte dos comprovantes; a foto é guardada pelo SEALog, não só referenciada.

**Referências** — Encontro 1 [26:53], [38:44], [40:16], [42:33], [43:19]; Enunciado §8 (caso "O registro incorreto"); Planejamento da equipe (RF-15); Gargalos §3.

---

## Ocorrências e devoluções

### HU-SL-017 — Relatar um problema pelo WhatsApp

| | |
|---|---|
| **Módulo** | `ocorrencias` |
| **Sistema** | SEALog |
| **Atores** | Loja, Agente de ocorrências |
| **Telas** | `TL-SL-002` Conversa do WhatsApp |
| **Origem legada** | Hoje: a loja reclama por mensagem ao Atendimento, que repassa no grupo interno; não há formato nem registro, e fora do horário a reclamação espera. Na lista da equipe: RF-18 (comunicação com o Atendimento quando destinatários relatam problemas) |
| **Prioridade** | Alta |

**Como** loja cliente da SEALog
**Gostaria de** contar pelo WhatsApp o que deu errado num pedido
**Para que** meu relato chegue organizado a quem resolve, a qualquer hora, sem eu repetir a história.

**Descrição**

No acompanhamento de um pedido, a loja toca em "Relatar problema". Quem conversa com ela é o agente
de ocorrências: ele confirma o pedido pelo código, entende o tipo de problema — atraso, não entregue,
avaria, entregue no endereço errado ou outro —, pede uma descrição e, se houver avaria, uma foto.

Com o relato, o agente consulta o protocolo de atendimento da SEALog e escreve uma ação sugerida.
Ele não decide nem promete nada à loja: encerra dizendo que uma pessoa da equipe vai analisar e
responder ali mesmo, e o chamado aparece no painel da equipe. O agente recebe só o código, o tipo, o
relato e as fotos; os dados pessoais do destinatário não passam por ele.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A loja relata o problema a partir do acompanhamento do pedido. | `RN-SL-004`, `RN-SL-036` |
| RN2 | O agente identifica o pedido pelo código, classifica o tipo, pede descrição e, se houver avaria, foto. | `RN-SL-036` |
| RN3 | O agente compara o relato com o protocolo de atendimento da SEALog e escreve uma ação sugerida; o protocolo é da SEALog. | `RN-SL-037`, `Q-SL-05` |
| RN4 | O agente não decide nem responde a decisão à loja. | `RN-SL-037` |
| RN5 | Nome, telefone e endereço do destinatário não vão ao agente; o sistema os junta ao gravar o chamado. | `RN-SL-038` |
| RN6 | O relato vira um chamado no painel, com a sugestão. | `RN-SL-039` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Avaria | que a caixa chegou amassada | relato o problema e mando a foto | recebo a confirmação de que uma pessoa vai analisar, e o chamado aparece no painel com a foto e a sugestão. |
| CA2 | Avaria sem foto | que relatei avaria | o agente pede a foto e eu não mando | o chamado é aberto mesmo assim, marcado sem foto. |
| CA3 | Atraso | que a entrega era para hoje às 10h e não chegou | relato atraso | o chamado é aberto com o tipo atraso e a situação atual do pedido. |
| CA4 | Pedido de outra loja | que informo o código de um pedido que não é meu | tento relatar | recebo a mensagem de pedido não encontrado, e nenhum chamado é aberto. |
| CA5 | Sem promessa | que pergunto ao agente se vou receber reembolso | ele responde | ele diz que a equipe vai analisar e responder, sem prometer nada. |
| CA6 | Fora do horário | que é domingo | relato um problema | o chamado é aberto e fica Pendente para a equipe no próximo turno. |

**Integrações e APIs** — `INT-001` WhatsApp, para a conversa (`MSG-SL-025`); `INT-004` Agente de ocorrências (n8n com modelo de linguagem GPT-4o), que conduz a triagem e grava o chamado em `POST /api/v1/bot/incidents`.

**Referências** — Plano do agente (triagem, coleta de evidências, análise de regras); Planejamento da equipe (RF-18; cuidado com dados sensíveis); Enunciado §2 (atendimento com horário limitado); Gargalos §5.

---

### HU-SL-018 — Tratar o chamado com a sugestão do agente

| | |
|---|---|
| **Módulo** | `ocorrencias` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Coordenador |
| **Telas** | `TL-SL-012` Painel de chamados, `TL-SL-013` Detalhe do chamado |
| **Origem legada** | Hoje: o aviso de problema se perde no grupo de cerca de 18 motoristas — no caso do buquê, o aviso das 9h40 só foi visto às 11h — e o coordenador decide caso a caso, sem regra formal. Na lista da equipe: RF-14 e RF-18 |
| **Prioridade** | Alta |

**Como** atendente
**Gostaria de** ver todo problema num painel, com o resumo e uma sugestão do que fazer
**Para que** nenhum problema se perca e eu decida rápido, com o protocolo à mão.

**Descrição**

O painel de chamados reúne toda ocorrência: a relatada pela loja, o não entregue da terceirizada, o
recebedor não autorizado e a entrega sem retorno. Chamado novo aparece na hora, sem recarregar a
tela. Cada um mostra a entrega, a loja, o tipo, o relato, o resumo da conversa, as fotos e a ação
sugerida pelo agente de ocorrências.

A pessoa da equipe aprova a sugestão, muda ou recusa, e registra a ação final. Se a ação final difere
da sugerida, informa o motivo. A loja recebe a resposta pelo WhatsApp. O chamado passa de Pendente a
Em atendimento quando alguém o assume, e a Concluído com a decisão; o que não foi concluído até 19h
fica destacado.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Toda ocorrência vira chamado no painel, com a sugestão do agente; não existe ocorrência tratada fora dele. | `RN-SL-039` |
| RN2 | O chamado fica Pendente, Em atendimento ou Concluído. | `RN-SL-039` |
| RN3 | Uma pessoa aprova, muda ou recusa a sugestão; o chamado registra quem, quando, a ação final e o motivo. | `RN-SL-040` |
| RN4 | Quem aprova — atendente ou coordenador — está para confirmação. | `RN-SL-040`, `Q-SL-06` |
| RN5 | A loja recebe a resposta pelo WhatsApp. | `RN-SL-040`, `RN-SL-043` |
| RN6 | Chamado sem conclusão até 19h fica destacado. | `RN-SL-046` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Chamado novo | que estou com o painel aberto | a terceirizada informa um não entregue | o chamado aparece na hora, com a sugestão. |
| CA2 | Aprovar a sugestão | que a sugestão é nova tentativa amanhã | aprovo | o chamado fica Concluído com a ação aprovada, e a loja recebe a resposta. |
| CA3 | Mudar a sugestão | que discordo da sugestão | escolho outra ação sem informar o motivo | o sistema pede o motivo antes de concluir. |
| CA4 | Buquê de sábado | que um não entregue chegou às 9h40 de sábado | o chamado é aberto | ele aparece no painel na hora e a floricultura já foi avisada, sem depender de alguém ler um grupo. |
| CA5 | Passou das 19h | que um chamado ainda está Pendente às 19h | abro o painel | ele aparece destacado. |
| CA6 | Assumir | que vou cuidar de um chamado | o assumo | ele passa a Em atendimento, com o meu nome, e os colegas veem isso. |

**Integrações e APIs** — `INT-004` Agente de ocorrências, que produz a sugestão; `INT-001` WhatsApp, para a resposta à loja (`MSG-SL-023`). O painel é atualizado em tempo real por conexão contínua (websocket), conforme o plano do agente.

**Referências** — Plano do agente (painel admin, atendente aprova, status do chamado); Enunciado §2 (o coordenador decide sem regra), §8 (caso "O buquê de sábado"); Planejamento da equipe (RF-14, RF-18); Gargalos §5.

---

### HU-SL-019 — Receber a devolução no galpão e decidir o destino

| | |
|---|---|
| **Módulo** | `ocorrencias` |
| **Sistema** | SEALog |
| **Atores** | Coordenador |
| **Telas** | `TL-SL-014` Devoluções no galpão |
| **Origem legada** | Hoje: entre 17h e 18h os volumes não entregues voltam ao galpão, e o coordenador avalia cada caso sem regras formalizadas; depois da terceirização, a devolução também volta à SEALog. Na lista da equipe: RF-16 e RF-17 |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** registrar a chegada de cada pacote devolvido e decidir o destino dele no sistema
**Para que** nenhum pacote fique esquecido no galpão e a loja saiba o que vai acontecer.

**Descrição**

A terceirizada informa que devolveu o pacote ao galpão, e a entrega fica "Em devolução". Quando o
pacote chega, a equipe registra a chegada pelo código, e a entrega passa a "No galpão", ligada ao
chamado que a fez voltar.

O coordenador decide o destino: nova tentativa, com a data, que despacha de novo; devolver à loja;
guardar aguardando instrução da loja; ou cancelar a pedido da loja. A decisão registra quem decidiu,
quando e o motivo, e gera aviso à loja. Quantas tentativas cabem e por quanto tempo o pacote fica
guardado são decisões da SEALog.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O pacote não entregue volta ao galpão da SEALog, e a chegada é registrada pelo código. | `RN-SL-041` |
| RN2 | A janela de devolução de hoje (17h a 18h) está para confirmação com as terceirizadas. | `RN-SL-041`, `Q-SL-03` |
| RN3 | O coordenador decide entre nova tentativa, devolver à loja, guardar aguardando instrução ou cancelar, com motivo. | `RN-SL-042` |
| RN4 | O número de tentativas e o prazo de guarda dependem da política da SEALog. | `RN-SL-042`, `Q-SL-07` |
| RN5 | A decisão gera aviso à loja. | `RN-SL-043` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Chegada | que a terceirizada informou a devolução | o pacote chega e eu informo o código | a entrega passa a "No galpão" e aparece para decisão. |
| CA2 | Nova tentativa | que o destinatário estava ausente | decido nova tentativa para amanhã | a entrega é despachada de novo com a nova data prevista, e a loja é avisada. |
| CA3 | Devolver à loja | que a loja pediu o pacote de volta | decido devolver | a entrega passa a "Devolvido à loja" e a loja recebe o aviso. |
| CA4 | Código desconhecido | que informo um código que não está em devolução | registro a chegada | o sistema avisa que não há devolução esperada para esse código e pede confirmação. |
| CA5 | Sem motivo | que escolhi cancelar | tento gravar sem motivo | o sistema pede o motivo. |

**Integrações e APIs** — `INT-002` API padrão da terceirizada, por onde chega o aviso de devolução; `INT-001` WhatsApp, para o aviso da decisão à loja (`MSG-SL-023`).

**Referências** — Enunciado §2 (volta ao galpão de 17h a 18h, decisão sem regra); Encontro 1 [47:01]; Planejamento da equipe (RF-16, RF-17, RN-02); Gargalos §5.

---

### HU-SL-020 — Avisar a loja de problema na entrega

| | |
|---|---|
| **Módulo** | `ocorrencias` |
| **Sistema** | SEALog |
| **Atores** | Sistema |
| **Telas** | `TL-SL-012` Painel de chamados |
| **Origem legada** | Hoje: ninguém avisa a loja; no caso do buquê de sábado, a floricultura soube do problema pela consumidora às 11h30, quase duas horas depois do aviso do motorista. Na lista da equipe: RF-09 (notificação, por WhatsApp em vez de e-mail) |
| **Prioridade** | Alta |

**Como** loja cliente da SEALog
**Gostaria de** ser avisada pelo WhatsApp assim que algo der errado com meu pedido
**Para que** eu saiba antes do meu cliente e possa avisá-lo.

**Descrição**

Todo não entregue e todo chamado aberto geram, na hora, um aviso à loja pelo WhatsApp, com o pedido,
o destinatário e o motivo, dizendo que a SEALog já está cuidando. Não depende de atendente nem do
horário do atendimento. Quando a equipe decide o que fazer, a loja recebe um segundo aviso, com a
decisão.

Todo aviso fica registrado na entrega, com o texto, a hora e o resultado do envio. Aviso que não
chegou aparece no painel de chamados para reenvio.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Todo não entregue e todo chamado aberto geram aviso automático à loja, com o motivo, sem depender do horário do atendimento. | `RN-SL-043` |
| RN2 | A decisão gera um segundo aviso. | `RN-SL-043` |
| RN3 | Todo aviso fica registrado na entrega, com texto, hora e resultado. | `RN-SL-045` |
| RN4 | Aviso que falhou aparece no painel para reenvio. | `RN-SL-045` |
| RN5 | Se o destinatário também recebe aviso da SEALog está para confirmação. | `Q-SL-15` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Buquê de sábado | que a floricultura pediu entrega até 10h e às 9h40 a terceirizada informou que não acha o endereço | o retorno chega | a floricultura recebe o aviso às 9h40, e não às 11h30 pela consumidora. |
| CA2 | Decisão | que a equipe decidiu nova tentativa às 14h | conclui o chamado | a loja recebe o segundo aviso com a decisão. |
| CA3 | Sábado à tarde | que o atendimento fecha às 12h no sábado | um não entregue chega às 15h | o aviso sai na hora, sem atendente. |
| CA4 | Falha no envio | que o número da loja não recebeu a mensagem | o envio falha | o aviso aparece no painel de chamados para reenvio, com o motivo. |
| CA5 | Registro | que um aviso foi enviado | abro a entrega | vejo o texto, a hora e se a mensagem foi entregue. |

**Integrações e APIs** — `INT-001` WhatsApp: mensagem iniciada pela SEALog, com modelo de mensagem aprovado (`MSG-SL-022`, `MSG-SL-023`, `MSG-SL-027`).

**Referências** — Enunciado §2 (atendimento até 12h no sábado), §8 (caso "O buquê de sábado"); Planejamento da equipe (RF-09); Gargalos §5.

---

### HU-SL-021 — Consultar entregas afetadas por loja e avisar em lote

| | |
|---|---|
| **Módulo** | `ocorrencias` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Coordenador |
| **Telas** | `TL-SL-015` Entregas afetadas por loja |
| **Origem legada** | Hoje: numa segunda-feira de chuva, cerca de 40 entregas atrasaram, o Atendimento recebeu mais de 120 mensagens e a equipe não conseguia saber quais clientes foram afetados para priorizar os avisos. Não está na lista da equipe; vem do caso do enunciado |
| **Prioridade** | Alta |

**Como** atendente
**Gostaria de** ver, num dia ruim, quais lojas têm entregas atrasadas ou com problema, e avisar todas de uma vez
**Para que** eu avise antes de as mensagens chegarem, em vez de responder uma a uma.

**Descrição**

A consulta de afetados lista, num período, as entregas atrasadas ou com chamado, agrupadas por loja,
com a contagem de cada uma. Atrasada é a entrega não concluída até o fim da data prevista. A equipe
filtra por terceirizada, bairro ou motivo e ordena pelas lojas com mais entregas afetadas.

Daí a equipe envia o aviso em lote: uma mensagem por loja, com a lista das entregas dela que foram
afetadas e a situação de cada uma. A lista também pode ser exportada para planilha.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A consulta lista as entregas atrasadas ou com chamado no período, agrupadas por loja, com a contagem. | `RN-SL-044` |
| RN2 | Atrasada é a entrega não concluída até o fim da data prevista. | `RN-SL-044` |
| RN3 | O aviso em lote é uma mensagem por loja, com a lista das entregas dela. | `RN-SL-044` |
| RN4 | Todo aviso fica registrado, e o que falhou aparece no painel. | `RN-SL-045` |
| RN5 | A consulta pode ser exportada para planilha. | `RN-SL-050` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Segunda-feira de chuva | que cerca de 40 entregas atrasaram hoje | abro a consulta de afetados | vejo as lojas afetadas, cada uma com quantas entregas e quais. |
| CA2 | Aviso em lote | que selecionei as lojas afetadas | envio o aviso | cada loja recebe uma mensagem só, com a lista das entregas dela. |
| CA3 | Priorizar | que quero começar pelas lojas mais afetadas | ordeno pela contagem | as lojas com mais entregas afetadas aparecem primeiro. |
| CA4 | Nada afetado | que não houve atraso no período | abro a consulta | o sistema informa que não há entregas para os filtros. |
| CA5 | Falha em uma loja | que o aviso a uma das lojas falhou | o lote termina | as outras recebem, e a falha aparece no painel para reenvio. |

**Integrações e APIs** — `INT-001` WhatsApp, para o aviso em lote (`MSG-SL-024`); `INT-003` Planilhas, para a exportação.

**Referências** — Enunciado §8 (caso "A segunda-feira de chuva"); Gargalos §5, §7.

---

## Financeiro

### HU-SL-022 — Fechar a cobrança das lojas

| | |
|---|---|
| **Módulo** | `financeiro` |
| **Sistema** | SEALog |
| **Atores** | Financeiro |
| **Telas** | `TL-SL-016` Fechamentos, `TL-SL-017` Exportação para planilha |
| **Origem legada** | Hoje: às 19h a planilha do dia é considerada fechada, e o financeiro usa esses registros, com os erros que eles têm, para calcular o que cobrar de cada loja. Não está na lista da equipe |
| **Prioridade** | Média |

**Como** financeiro
**Gostaria de** gerar a cobrança de cada loja a partir das entregas registradas
**Para que** eu não cobre a mais nem a menos por causa de uma linha errada na planilha.

**Descrição**

O financeiro escolhe a loja e o período, e o sistema monta o fechamento com as entregas que chegaram
a um status final, cada uma com código, data, destinatário, bairro, status e valor. O valor vem da
tabela de preços da SEALog.

O fechamento passa por conferência antes de ser fechado. Depois de fechado, não muda: correção
posterior entra como ajuste, com motivo, no fechamento seguinte da mesma loja. O fechamento pode ser
exportado para planilha.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A cobrança é calculada das entregas registradas, por loja e período, nunca de planilha. | `RN-SL-047` |
| RN2 | O valor depende da tabela de preços da SEALog. | `RN-SL-047`, `Q-SL-08` |
| RN3 | O fechamento é conferido antes de fechado; fechado não muda, e correção vira ajuste no seguinte. | `RN-SL-049` |
| RN4 | O fechamento pode ser exportado para planilha. | `RN-SL-050` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Gerar | que a farmácia teve 60 entregas finalizadas no mês | gero o fechamento do mês | vejo as 60 entregas, cada uma com o valor, e o total. |
| CA2 | Conferir e fechar | que conferi o fechamento | fecho | ele fica Fechado, com quem fechou e quando. |
| CA3 | Alterar fechado | que o fechamento já está fechado | tento mudar um valor | o sistema recusa e orienta lançar um ajuste no próximo. |
| CA4 | Ajuste | que uma entrega foi cobrada errado no mês passado | lanço o ajuste com motivo no fechamento deste mês | o ajuste entra no total, com o motivo. |
| CA5 | Exportar | que o fechamento está conferido | exporto | a planilha sai com as mesmas colunas da tela. |

**Integrações e APIs** — `INT-003` Planilhas, para a exportação do fechamento.

**Referências** — Enunciado §2 (o financeiro calcula a cobrança pelos registros do dia); Gargalos §6.

---

### HU-SL-023 — Fechar o pagamento das terceirizadas

| | |
|---|---|
| **Módulo** | `financeiro` |
| **Sistema** | SEALog |
| **Atores** | Financeiro |
| **Telas** | `TL-SL-016` Fechamentos, `TL-SL-017` Exportação para planilha |
| **Origem legada** | Hoje: a SEALog paga as terceirizadas pelas entregas realizadas, mas cada empresa informa do seu jeito, e quando a terceirizada diz que entregou e o destinatário diz que não, não há prova. Não está na lista da equipe; vem do Encontro 1 |
| **Prioridade** | Média |

**Como** financeiro
**Gostaria de** calcular o pagamento de cada terceirizada pelas entregas que ela comprovou
**Para que** a SEALog pague só pelo que foi entregue e provado.

**Descrição**

O financeiro escolhe a terceirizada e o período, e o sistema monta o fechamento com as entregas que
ela concluiu com comprovante aceito. Entrega sem comprovante aceito não entra. O valor por entrega, e
o que acontece com tentativa sem sucesso e devolução, depende do contrato da SEALog com cada
terceirizada.

Como na cobrança das lojas, o fechamento é conferido antes de ser fechado, e correção posterior vira
ajuste no fechamento seguinte. O fechamento pode ser exportado para planilha.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O pagamento é calculado pelas entregas com comprovante aceito, por terceirizada e período. | `RN-SL-048` |
| RN2 | Entrega sem comprovante aceito não entra no pagamento. | `RN-SL-030`, `RN-SL-048` |
| RN3 | O valor, e o tratamento de tentativa e devolução, dependem do contrato. | `RN-SL-048`, `Q-SL-09` |
| RN4 | O fechamento é conferido antes de fechado; correção vira ajuste no seguinte. | `RN-SL-049` |
| RN5 | O fechamento pode ser exportado para planilha. | `RN-SL-050` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Gerar | que a empresa da zona sul fez 900 entregas comprovadas na quinzena | gero o fechamento | vejo as 900 entregas e o total. |
| CA2 | Sem comprovante | que uma entrega foi informada como feita mas o comprovante foi recusado | gero o fechamento | essa entrega não entra. |
| CA3 | Recebedor não autorizado | que uma entrega teve chamado de recebedor não autorizado ainda aberto | gero o fechamento | a entrega aparece destacada para conferência. |
| CA4 | Alterar fechado | que o fechamento já foi fechado | tento tirar uma entrega | o sistema recusa e orienta lançar um ajuste no próximo. |
| CA5 | Exportar | que o fechamento está fechado | exporto | a planilha sai com as entregas, o comprovante de cada uma e o total. |

**Integrações e APIs** — `INT-003` Planilhas, para a exportação do fechamento.

**Referências** — Encontro 1 [26:53], [38:44]; Enunciado §2 (o financeiro calcula a partir dos registros).

---

## Acesso

### HU-SL-024 — Entrar no painel com o perfil

| | |
|---|---|
| **Módulo** | `acesso` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Coordenador, Financeiro, Terceirizada |
| **Telas** | `TL-SL-001` Entrada no painel |
| **Origem legada** | Hoje: não há sistema; todos veem tudo no grupo de WhatsApp e nas planilhas compartilhadas, inclusive as conversas de todos os motoristas. Na lista da equipe: RF-02 e RNF-01 (bloqueio depois de cinco tentativas) |
| **Prioridade** | Alta |

**Como** pessoa da equipe da SEALog
**Gostaria de** entrar no painel com meu usuário e ver só o que meu perfil permite
**Para que** cada um faça a sua parte, e ninguém altere o que não é seu.

**Descrição**

A equipe entra no painel com usuário e senha, num de três perfis: atendente, coordenador e
financeiro. A terceirizada entra no portal com usuário próprio. O perfil define o menu e as ações, e
a permissão vale no servidor: o que a tela não mostra também não pode ser feito por outro caminho.

Depois de cinco tentativas seguidas sem sucesso, a entrada fica bloqueada por um tempo. A loja não
entra no painel: ela é reconhecida pelo número de WhatsApp autorizado.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A equipe entra com usuário e senha, num de três perfis; a lista de perfis está para confirmação. | `RN-SL-051`, `Q-SL-10` |
| RN2 | A permissão é conferida no servidor, não só escondida na tela. | `RN-SL-051` |
| RN3 | Depois de cinco tentativas seguidas sem sucesso, a entrada fica bloqueada por um tempo; a duração e o desbloqueio estão para confirmação. | `RN-SL-052`, `Q-SL-17` |
| RN4 | A terceirizada entra com usuário próprio e vê só as entregas despachadas para ela. | `RN-SL-053` |
| RN5 | A loja não tem senha: é identificada pelo número de WhatsApp autorizado. | `RN-SL-054` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Entrada certa | que sou atendente | entro com usuário e senha certos | vejo o menu do atendente. |
| CA2 | Senha errada | que errei a senha | tento entrar | vejo a mensagem de usuário ou senha incorretos, sem dizer qual dos dois errou. |
| CA3 | Bloqueio | que errei a senha cinco vezes seguidas | tento a sexta | a entrada está bloqueada e a mensagem diz por quanto tempo e a quem recorrer. |
| CA4 | Tela fora do perfil | que sou do financeiro | tento abrir a tabela de regiões | o sistema recusa e informa que meu perfil não tem acesso. |
| CA5 | Terceirizada | que entro no portal como terceirizada | abro a lista | vejo só as entregas despachadas para a minha empresa. |

**Integrações e APIs** — Nenhuma. Acesso interno do painel e do portal; a identificação da loja pelo número está em `HU-SL-005`.

**Referências** — Planejamento da equipe (RBAC e Auth; RF-02; RNF-01); Encontro 1 [24:38] (todos veem tudo no grupo).
