# SEALog — Histórias de usuário

Vinte e quatro histórias, em sete módulos, na ordem das etapas da operação. As regras citam o
catálogo `RN-SL-*` de [`02-regras-de-negocio.md`](02-regras-de-negocio.md); o que ainda está em
aberto é `Q-SL-*`, em [`09-divergencias-e-lacunas.md`](09-divergencias-e-lacunas.md).

A origem é o resumo dos gargalos da operação (`SEALog gargalos e problemas da operação.pdf`,
recebido em 27/10/2026). Como não há sistema legado, o campo **Origem legada** de cada história
descreve **como a operação faz aquilo hoje**, com o gargalo que a história resolve.

## Índice

| Módulo | HUs | Total |
|---|---|---|
| Entrada de pedidos (`entrada-pedidos`) | `HU-SL-001` a `HU-SL-004` | 4 |
| Registro e planejamento (`registro-planejamento`) | `HU-SL-005` a `HU-SL-010` | 6 |
| Execução do motorista (`execucao-motorista`) | `HU-SL-011` a `HU-SL-015` | 5 |
| Consulta de status (`consulta-status`) | `HU-SL-016`, `HU-SL-017` | 2 |
| Exceções e decisões (`excecoes`) | `HU-SL-018` a `HU-SL-021` | 4 |
| Financeiro (`financeiro`) | `HU-SL-022`, `HU-SL-023` | 2 |
| Acesso (`acesso`) | `HU-SL-024` | 1 |

---

## Entrada de pedidos

### HU-SL-001 — Registrar pedido recebido por mensagem

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Analista, Coordenador |
| **Telas** | `TL-SL-002` Novo pedido |
| **Origem legada** | Hoje: o pedido chega por WhatsApp ou Instagram, em texto, áudio ou planilha própria do cliente, e o analista o copia do grupo de WhatsApp para a planilha. Cerca de 1 em 5 chega sem dados, e nada impede o envio sem número, telefone ou rua (Sr. Paulo, Cond. MarAzul) |
| **Prioridade** | Alta |

**Como** atendente
**Gostaria de** registrar no sistema o pedido que o cliente me mandou por mensagem, áudio ou planilha
**Para que** ele exista num só lugar desde o primeiro minuto, e eu saiba na hora se falta algum dado.

**Descrição**

O atendente transforma o que chegou pela conversa — texto, áudio ou uma planilha fora do modelo —
em um pedido no sistema, preenchendo um formulário único. O formulário aponta, campo a campo, o
que falta: endereço sem número, telefone sem DDD, rua em branco. É a validação que hoje não
existe em lugar nenhum da entrada.

Se todos os dados obrigatórios estiverem preenchidos, o pedido é confirmado, recebe o código de
entrega e o cliente recebe pelo WhatsApp a confirmação com o link de rastreio. Se faltar algo, o
atendente pode registrar mesmo assim: o pedido fica pendente de dados, com a lista do que falta, e
não entra no planejamento até ser completado (`HU-SL-004`). Assim o pedido incompleto não se perde
na conversa enquanto se espera a resposta do cliente.

O canal por onde o pedido chegou fica registrado. Se já houver um pedido do mesmo cliente para o
mesmo destinatário, endereço e data, o sistema avisa antes de gravar, para evitar a mesma entrega
registrada duas vezes.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Todo pedido ganha registro único e código de entrega no momento do registro. | `RN-SL-001` |
| RN2 | São obrigatórios: cliente, nome e telefone do destinatário, rua, número, bairro, cidade e data desejada. | `RN-SL-002` |
| RN3 | Pedido sem algum dado obrigatório fica "Pendente de dados" e não entra no planejamento. | `RN-SL-003` |
| RN4 | Texto, áudio e planilha fora do modelo passam pelo mesmo formulário e pelas mesmas validações; o canal de origem fica registrado. | `RN-SL-005` |
| RN5 | O telefone tem DDD e 10 ou 11 dígitos. | `RN-SL-006` |
| RN6 | Endereço sem número só é aceito com a marca "Sem número", e então o ponto de referência é obrigatório. | `RN-SL-007` |
| RN7 | Pedido igual a outro já registrado (mesmo cliente, destinatário, endereço e data) gera aviso, sem bloquear. | `RN-SL-011` |
| RN8 | O pedido tem um ou mais volumes, informados no registro. | `RN-SL-012` |
| RN9 | Pedido confirmado gera aviso ao cliente com o link de rastreio. | `RN-SL-033` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Pedido completo | que preenchi todos os dados obrigatórios | gravo o pedido | ele é confirmado, recebe o código de entrega e o cliente recebe a confirmação com o link de rastreio. |
| CA2 | Sem número | que deixei o número do endereço em branco e não marquei "Sem número" | tento confirmar | o sistema aponta o campo e explica que o número é obrigatório. |
| CA3 | Endereço sem número de verdade | que marquei "Sem número" | tento confirmar sem ponto de referência | o sistema exige o ponto de referência. |
| CA4 | Telefone inválido | que informei o telefone sem DDD | tento confirmar | o sistema aponta o telefone e pede DDD e número. |
| CA5 | Registrar incompleto | que falta a rua e o cliente ainda não respondeu | gravo como pendente | o pedido fica "Pendente de dados", com "rua" na lista do que falta, e não aparece entre as entregas prontas para rota. |
| CA6 | Pedido repetido | que já existe pedido do mesmo cliente para o mesmo destinatário, endereço e data | gravo o pedido | o sistema avisa e pergunta se é outro pedido; se eu confirmar, grava. |
| CA7 | Canal de origem | que o pedido chegou por áudio no WhatsApp | gravo o pedido | o canal "WhatsApp" fica registrado no pedido. |
| CA8 | Sem permissão | que entrei com o perfil de motorista | tento abrir o registro de pedido | o sistema recusa e informa que meu perfil não tem acesso. |

**Integrações e APIs** — `INT-001` WhatsApp, para a confirmação com o link de rastreio. Os canais de chegada (WhatsApp, `INT-002` Instagram) não são lidos pelo sistema: o atendente transcreve.

**Referências** — Gargalos §1 (pedidos incompletos, formatos misturados, sem validação na origem), §2 (digitação manual), §7 (caso "Pedido incompleto"), §8.

---

### HU-SL-002 — Fazer o pedido pelo link

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Cliente |
| **Telas** | `TL-SL-003` Pedido pelo link |
| **Origem legada** | Hoje: o cliente pequeno pede por WhatsApp ou Instagram, no formato que quiser, e a atendente precisa voltar a ele quando falta dado e esperar a resposta antes de seguir |
| **Prioridade** | Alta |

**Como** cliente da SEALog
**Gostaria de** preencher meu pedido num link que a atendente me manda na própria conversa
**Para que** eu informe tudo certo de primeira, sem instalar nada e sem esperar a atendente me perguntar o que faltou.

**Descrição**

O atendente envia ao cliente, na conversa de WhatsApp ou Instagram em que ele já está, um link
para o formulário de pedido. O formulário abre no navegador do celular, sem aplicativo e sem conta,
e já sabe de qual cliente é. Ele tem os mesmos campos e as mesmas validações do formulário do
atendente: o cliente não consegue enviar o pedido sem número, sem telefone ou sem rua.

Ao enviar, o pedido é confirmado na hora, sem passar pelo atendente, e o cliente recebe no
WhatsApp o código e o link de rastreio. O link funciona fora do horário do atendimento, inclusive
no sábado depois das 12h.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O link abre no celular, sem instalar aplicativo e sem criar conta, e dá acesso só aos pedidos daquele cliente. | `RN-SL-004`, `RN-SL-050` |
| RN2 | O formulário tem os mesmos dados obrigatórios do formulário do atendente. | `RN-SL-002` |
| RN3 | Sem algum dado obrigatório, o envio não é aceito e o campo que falta é apontado. | `RN-SL-003` |
| RN4 | O telefone tem DDD e 10 ou 11 dígitos; endereço sem número exige a marca "Sem número" e o ponto de referência. | `RN-SL-006`, `RN-SL-007` |
| RN5 | Pedido enviado pelo link é confirmado sem trabalho do atendente, com o canal "Link". | `RN-SL-005`, `RN-SL-009` |
| RN6 | O link funciona a qualquer hora, sem depender do horário do atendimento. | `RN-SL-032` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Pedido completo | que recebi o link e preenchi todos os campos obrigatórios | envio | o pedido é confirmado e recebo no WhatsApp o código e o link de rastreio. |
| CA2 | Campo faltando | que deixei o telefone do destinatário em branco | tento enviar | o formulário não envia e aponta o telefone como obrigatório. |
| CA3 | Fora do horário | que é sábado, 15h, e o atendimento já fechou | envio um pedido completo | o pedido é confirmado da mesma forma. |
| CA4 | Sem conta | que nunca usei o SEALog | abro o link no celular | o formulário abre sem pedir cadastro nem instalação. |
| CA5 | Só os meus pedidos | que tenho o link do meu cliente | tento usar o link para ver pedidos de outro cliente | não há como: o link só mostra e cria pedidos do meu cadastro. |

**Integrações e APIs** — `INT-001` WhatsApp, para enviar o link e a confirmação; `INT-002` Instagram, onde o atendente cola o link na conversa.

**Referências** — Gargalos §1 (pedidos incompletos, sem validação na origem), §9 (clientes pequenos pedem por WhatsApp e Instagram; atendimento com horário limitado).

---

### HU-SL-003 — Importar pedidos da planilha do cliente

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Analista, Coordenador |
| **Telas** | `TL-SL-004` Importação de planilha |
| **Origem legada** | Hoje: alguns clientes mandam planilhas próprias, cada uma num formato, e o analista as digita na planilha da operação |
| **Prioridade** | Média |

**Como** atendente
**Gostaria de** importar de uma vez a planilha com vários pedidos de um cliente
**Para que** eu não precise digitar linha por linha, e os pedidos incompletos fiquem marcados em vez de passarem despercebidos.

**Descrição**

O cliente que manda muitos pedidos usa a planilha modelo do SEALog, que o atendente envia a ele. O
atendente escolhe o cliente, carrega o arquivo e vê uma prévia: cada linha vira um pedido, e cada
pedido passa pelas mesmas validações do formulário.

As linhas completas são confirmadas; as que têm dado faltando entram como pendentes, com o que
falta — nenhuma é descartada em silêncio. O resultado mostra, linha a linha, o que aconteceu. Se o
arquivo não segue o modelo, nada é importado e o atendente é avisado. A planilha num formato
próprio do cliente continua possível: o atendente registra os pedidos pelo formulário
(`HU-SL-001`).

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A importação aceita o modelo do SEALog, com colunas fixas; cada linha vira um pedido do cliente escolhido. | `RN-SL-008` |
| RN2 | Cada linha passa pelas mesmas validações do formulário. | `RN-SL-002`, `RN-SL-006`, `RN-SL-007` |
| RN3 | Linha com dado faltando entra como pendente, não é descartada. | `RN-SL-003`, `RN-SL-008` |
| RN4 | O resultado mostra, linha a linha, o que foi confirmado e o que ficou pendente, e por quê. | `RN-SL-008` |
| RN5 | Arquivo fora do modelo não é importado. | `RN-SL-008` |
| RN6 | Linha igual a pedido já registrado é sinalizada na prévia. | `RN-SL-011` |
| RN7 | Cada pedido confirmado gera aviso ao cliente com o link de rastreio. | `RN-SL-033` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Planilha completa | que a planilha modelo tem 10 linhas completas | importo | vejo 10 pedidos confirmados, cada um com seu código. |
| CA2 | Linhas incompletas | que 2 das 10 linhas estão sem número no endereço | importo | 8 são confirmados e 2 ficam pendentes, com "número" na lista do que falta. |
| CA3 | Fora do modelo | que o arquivo tem colunas diferentes das do modelo | tento importar | nada é importado e sou avisado de que o arquivo não segue o modelo. |
| CA4 | Prévia | que carreguei o arquivo | ainda não confirmei | vejo a prévia linha a linha, com os problemas apontados, antes de gravar. |
| CA5 | Repetido | que uma linha repete um pedido já registrado | vejo a prévia | a linha aparece sinalizada como possível repetição. |

**Integrações e APIs** — `INT-003` Planilhas, para ler o arquivo no modelo do SEALog; `INT-001` WhatsApp, para a confirmação de cada pedido.

**Referências** — Gargalos §1 (formatos misturados: planilhas próprias dos clientes), §2 (digitação manual).

---

### HU-SL-004 — Resolver pedido com dados pendentes

| | |
|---|---|
| **Módulo** | `entrada-pedidos` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Analista, Coordenador, Cliente |
| **Telas** | `TL-SL-005` Pendências de dados · `TL-SL-003` Pedido pelo link |
| **Origem legada** | Hoje: quando o pedido chega incompleto, a atendente volta ao cliente e espera a resposta antes de seguir, e o pedido fica parado na conversa, sem registro |
| **Prioridade** | Alta |

**Como** atendente
**Gostaria de** ver todos os pedidos que esperam dados, há quanto tempo e o que falta em cada um
**Para que** nenhum pedido incompleto fique esquecido, e o cliente possa completar sozinho.

**Descrição**

Os pedidos pendentes de dados ficam numa lista própria, do mais antigo para o mais recente, com o
cliente, o que falta e há quanto tempo esperam. Daqui o atendente reenvia ao cliente o link de
complemento, que abre o formulário já preenchido com o que foi informado e pede só o que falta.

Quando o cliente completa pelo link, o pedido é confirmado sozinho e sai da lista. O atendente
também pode completar com o que o cliente respondeu na conversa. Pedido que só se completa depois do
horário de corte do dia fica para as rotas do dia seguinte.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A lista mostra todo pedido pendente, com o que falta e há quanto tempo espera. | `RN-SL-009` |
| RN2 | O link de complemento pede só o que falta e confirma o pedido sem trabalho do atendente. | `RN-SL-009` |
| RN3 | Pedido pendente não entra no planejamento. | `RN-SL-003` |
| RN4 | Pedido confirmado depois do horário de corte vai para o dia seguinte. | `RN-SL-010` |
| RN5 | O complemento passa pelas mesmas validações do formulário. | `RN-SL-002`, `RN-SL-006`, `RN-SL-007` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Ver pendências | que há 3 pedidos sem número no endereço | abro as pendências | vejo os 3, com "número" na coluna do que falta e o tempo de espera de cada um. |
| CA2 | Cliente completa | que reenviei o link de complemento | o cliente informa o número e envia | o pedido é confirmado, sai da lista e o cliente recebe o link de rastreio. |
| CA3 | Atendente completa | que o cliente respondeu o número na conversa | preencho o número no pedido | o pedido é confirmado e sai da lista. |
| CA4 | Depois do corte | que o pedido foi completado depois do horário de corte | ele é confirmado | ele entra entre as entregas prontas do dia seguinte. |
| CA5 | Complemento inválido | que o cliente informou telefone sem DDD no complemento | tenta enviar | o link aponta o telefone e não envia. |

**Integrações e APIs** — `INT-001` WhatsApp, para reenviar o link de complemento e a confirmação.

**Referências** — Gargalos §1 (pedidos incompletos: a atendente volta ao cliente e espera), §7 (caso "Pedido incompleto").

---

## Registro e planejamento

### HU-SL-005 — Consultar e manter a lista única de entregas

| | |
|---|---|
| **Módulo** | `registro-planejamento` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Analista, Coordenador, Financeiro |
| **Telas** | `TL-SL-006` Lista de entregas · `TL-SL-007` Detalhe da entrega |
| **Origem legada** | Hoje: o analista copia do grupo de WhatsApp para a planilha, e as cópias por analista geram registros diferentes da mesma entrega. No caso "Registro incorreto", a linha errada na planilha fez a informação se perder |
| **Prioridade** | Alta |

**Como** analista
**Gostaria de** trabalhar numa só lista de entregas, a mesma para toda a equipe
**Para que** não existam duas versões da mesma entrega, e qualquer correção fique registrada.

**Descrição**

A lista de entregas substitui as planilhas da operação. Cada linha é uma entrega, com código,
cliente, destinatário, bairro, data prevista, status, motorista e a hora do último registro. Ela se
usa como uma planilha: filtra por status, data, cliente, bairro e motorista, ordena por qualquer
coluna e exporta (`HU-SL-023`). A diferença é que não há cópia: todos olham a mesma lista, e o que o
motorista registra na rua aparece nela.

Abrir uma linha mostra o detalhe da entrega: os dados do pedido, os volumes, o histórico de status
e de alterações, o comprovante, as ocorrências e os avisos enviados ao cliente. O analista e o
coordenador podem corrigir dados; cada correção fica no histórico com quem alterou, quando e o
valor anterior. O status não se altera à mão: muda pelos caminhos do ciclo da entrega.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Há uma única lista de entregas para toda a equipe, sem cópias. | `RN-SL-013` |
| RN2 | Toda alteração fica no histórico da entrega, com autor, data e hora e valor anterior. | `RN-SL-013` |
| RN3 | O status só muda pelos caminhos do ciclo da entrega. | `RN-SL-014` |
| RN4 | A lista mostra a data e a hora do último registro de cada entrega. | `RN-SL-035` |
| RN5 | O atendente só corrige pedido antes de confirmado; depois, a correção é do analista ou do coordenador. | `RN-SL-051` |
| RN6 | A lista filtrada pode ser exportada para planilha. | `RN-SL-048` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Mesma lista | que dois analistas abrem a lista ao mesmo tempo | um deles corrige o bairro de uma entrega | o outro vê o bairro corrigido ao atualizar a lista. |
| CA2 | Histórico | que corrigi o telefone do destinatário | abro o detalhe da entrega | o histórico mostra o telefone anterior, o novo, meu nome e a hora. |
| CA3 | Filtro | que há entregas de vários dias | filtro por "Em rota" e pela data de hoje | vejo só as entregas de hoje que estão em rota. |
| CA4 | Status à mão | que a entrega está "No galpão" | procuro mudar o status para "Entregue" no detalhe | não há como: o status só muda pelo registro da parada. |
| CA5 | Atendente depois de confirmado | que sou atendente e a entrega já está confirmada | tento corrigir o endereço | o sistema recusa e informa que a correção é do analista ou do coordenador. |
| CA6 | Sem resultado | que filtrei por um cliente sem entregas no período | aplico o filtro | a lista informa que nenhuma entrega foi encontrada. |

**Integrações e APIs** — Nenhuma. A exportação está em `HU-SL-023` (`INT-003`).

**Referências** — Gargalos §2 (digitação manual, planilhas divergentes), §4 (planilha desatualizada), §7 (caso "Registro incorreto"), §8.

---

### HU-SL-006 — Gerar a etiqueta do pacote

| | |
|---|---|
| **Módulo** | `registro-planejamento` |
| **Sistema** | SEALog |
| **Atores** | Analista, Coordenador |
| **Telas** | `TL-SL-008` Etiqueta do pacote · `TL-SL-007` Detalhe da entrega |
| **Origem legada** | Hoje: as etiquetas são escritas à mão nos pacotes |
| **Prioridade** | Alta |

**Como** analista
**Gostaria de** imprimir a etiqueta de cada volume da entrega
**Para que** todo pacote carregue o código da entrega de forma legível, e o motorista possa lê-lo com a câmera.

**Descrição**

A etiqueta sai do próprio sistema, uma por volume: código da entrega em texto e em código lido
pela câmera do celular, nome do destinatário, bairro e o número do volume ("2/3"). Pode ser impressa
para uma entrega ou em lote, para todas as entregas prontas do dia.

A etiqueta é o que liga o pacote físico à entrega no sistema: é por ela que o galpão registra a
chegada, que o motorista abre a parada e que o comprovante fica preso à entrega certa. Por isso
nenhuma entrega entra em rota sem etiqueta impressa. Reimprimir é possível, e fica no histórico.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A etiqueta traz o código em texto e em código lido pela câmera, o destinatário, o bairro e o número do volume. | `RN-SL-015` |
| RN2 | Cada volume tem etiqueta própria, com o mesmo código de entrega. | `RN-SL-012` |
| RN3 | Nenhuma entrega entra em rota sem etiqueta impressa. | `RN-SL-015` |
| RN4 | Impressão e reimpressão ficam no histórico da entrega. | `RN-SL-013` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Três volumes | que a entrega tem 3 volumes | imprimo as etiquetas | saem 3 etiquetas, "1/3", "2/3" e "3/3", com o mesmo código. |
| CA2 | Em lote | que há 25 entregas confirmadas para hoje sem etiqueta | imprimo em lote | saem as etiquetas de todos os volumes das 25. |
| CA3 | Leitura | que a etiqueta foi impressa | leio o código com a câmera do celular | abre a entrega correspondente. |
| CA4 | Sem etiqueta | que a entrega não tem etiqueta impressa | tento incluí-la numa rota | o sistema recusa e informa que falta a etiqueta. |
| CA5 | Reimpressão | que reimprimi a etiqueta de um volume | abro o histórico | a reimpressão aparece com meu nome e a hora. |

**Integrações e APIs** — Nenhuma. A impressão usa a impressora do galpão, sem integração própria.

**Referências** — Gargalos §2 (etiquetas escritas à mão), §3 (foto sem vínculo com a entrega), §7 (caso "Registro incorreto").

---

### HU-SL-007 — Agendar a coleta e receber o pacote no galpão

| | |
|---|---|
| **Módulo** | `registro-planejamento` |
| **Sistema** | SEALog |
| **Atores** | Analista, Coordenador |
| **Telas** | `TL-SL-009` Coletas e recebimento no galpão |
| **Origem legada** | Hoje: a coleta acontece numa janela apertada, entre 14h e 18h, ou o cliente leva ao galpão até 17h, e a chegada do pacote não é registrada em lugar consultável |
| **Prioridade** | Média |

**Como** analista
**Gostaria de** agendar a coleta de cada pedido dentro da janela e registrar a chegada dos pacotes ao galpão
**Para que** se saiba o que já está no galpão e pode sair em rota, e o que ainda falta chegar.

**Descrição**

Para cada pedido confirmado, o analista registra como o pacote chega ao galpão: coleta na casa do
cliente, agendada entre 14h e 18h, ou entrega pelo próprio cliente no galpão, até 17h. As coletas
agendadas aparecem por horário, para que o coordenador as encaixe nas rotas.

Quando o pacote chega, o analista lê a etiqueta (ou digita o código) e o volume passa a constar no
galpão. A entrega só fica pronta para rota quando todos os volumes dela chegaram. Pacote recebido
depois das 17h vai para a programação do dia seguinte.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A coleta só pode ser agendada entre 14h e 18h. | `RN-SL-016` |
| RN2 | O cliente que leva ao galpão entrega até 17h; depois disso, o pacote vai para o dia seguinte. | `RN-SL-016`, `RN-SL-017` |
| RN3 | A chegada ao galpão é registrada pela leitura da etiqueta ou pelo código. | `RN-SL-017` |
| RN4 | Só entrega com todos os volumes no galpão fica pronta para rota. | `RN-SL-017` |
| RN5 | A chegada muda o status da entrega para "No galpão", com o registro no histórico. | `RN-SL-013`, `RN-SL-014` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Coleta na janela | que o pedido está confirmado | agendo a coleta para 15h | a coleta fica agendada e aparece na lista de coletas do dia. |
| CA2 | Coleta fora da janela | que o pedido está confirmado | tento agendar a coleta para 12h | o sistema recusa e informa que a coleta é entre 14h e 18h. |
| CA3 | Recebimento | que o pacote chegou ao galpão | leio a etiqueta | o volume fica registrado no galpão e a entrega passa a "No galpão". |
| CA4 | Volume faltando | que a entrega tem 2 volumes e só 1 chegou | olho as entregas prontas para rota | a entrega não aparece entre as prontas. |
| CA5 | Depois das 17h | que o cliente trouxe o pacote às 17h30 | registro o recebimento | o pacote é recebido e a entrega fica para a programação do dia seguinte. |

**Integrações e APIs** — Nenhuma.

**Referências** — Gargalos §2 (coleta em janela apertada: entre 14h e 18h, ou o cliente leva ao galpão até 17h).

---

### HU-SL-008 — Montar as rotas do dia

| | |
|---|---|
| **Módulo** | `registro-planejamento` |
| **Sistema** | SEALog |
| **Atores** | Coordenador |
| **Telas** | `TL-SL-010` Rotas do dia |
| **Origem legada** | Hoje: as rotas são montadas na experiência do coordenador, sem ferramenta, a partir da planilha |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** distribuir as entregas prontas entre os motoristas e definir a ordem das paradas
**Para que** cada motorista saia com a rota que eu planejei, e essa rota fique registrada.

**Descrição**

A tela de rotas mostra as entregas prontas para sair — confirmadas, etiquetadas e com todos os
volumes no galpão — agrupadas por bairro, e os motoristas disponíveis no dia. O coordenador monta
cada rota escolhendo o motorista e as entregas, e ordena as paradas. O agrupamento por bairro é
só apoio: quem decide a rota continua sendo o coordenador, com a experiência que já usa hoje.

Uma entrega fica em no máximo uma rota. Enquanto não é publicada, a rota pode ser alterada à
vontade; depois de publicada, mudanças seguem `HU-SL-009`.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O coordenador escolhe motorista, entregas e ordem; o sistema agrupa as entregas prontas por bairro, sem decidir. | `RN-SL-018` |
| RN2 | Só entrega confirmada, etiquetada e com todos os volumes no galpão pode entrar em rota. | `RN-SL-015`, `RN-SL-017` |
| RN3 | Uma entrega está em no máximo uma rota de cada vez. | `RN-SL-019` |
| RN4 | A ordem das paradas pode ser mudada antes da publicação. | `RN-SL-021` |
| RN5 | As rotas são do dia e cabem no horário da Operação, das 7h às 19h. | `RN-SL-023` |
| RN6 | Montar rota é exclusivo do coordenador. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Montar rota | que há 12 entregas prontas no bairro Centro | incluo 8 delas na rota de um motorista | a rota fica com 8 paradas e as 8 saem da lista de prontas. |
| CA2 | Ordenar | que a rota tem 8 paradas | mudo a parada 5 para a posição 1 | a ordem fica registrada como eu deixei. |
| CA3 | Entrega já em rota | que a entrega já está na rota de outro motorista | tento incluí-la em mais uma rota | o sistema recusa e informa em que rota ela está. |
| CA4 | Entrega não pronta | que a entrega ainda está "Pendente de dados" | procuro a entrega entre as prontas | ela não aparece. |
| CA5 | Sem permissão | que entrei como analista | tento montar uma rota | posso ver as rotas, mas não montar nem alterar. |

**Integrações e APIs** — Nenhuma.

**Referências** — Gargalos §2 (rotas montadas na experiência do coordenador, sem ferramenta); `DIV-SL-01`.

---

### HU-SL-009 — Publicar o roteiro para o motorista

| | |
|---|---|
| **Módulo** | `registro-planejamento` |
| **Sistema** | SEALog |
| **Atores** | Coordenador, Motorista |
| **Telas** | `TL-SL-010` Rotas do dia · `TL-SL-011` Roteiro do motorista |
| **Origem legada** | Hoje: o roteiro é enviado por WhatsApp, motorista por motorista, e alterações durante o dia viram mais mensagens no grupo |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** publicar as rotas montadas e, se preciso, alterá-las durante o dia
**Para que** cada motorista receba o roteiro no celular de uma vez, sem que eu mande mensagem a um por um.

**Descrição**

Publicar uma rota envia o roteiro ao celular do motorista e muda as entregas para "Em rota". Pode-se
publicar uma rota ou todas as do dia de uma vez. A publicação substitui o envio por WhatsApp.

Depois de publicada, a rota ainda pode mudar: o coordenador pode trocar a ordem, retirar uma
entrega ou remanejá-la para outro motorista, sempre com o motivo. O motorista vê o roteiro
atualizado, com o que mudou em destaque, e o histórico de cada entrega registra a mudança.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Publicar envia o roteiro ao celular do motorista, sem mensagem individual por WhatsApp. | `RN-SL-020` |
| RN2 | Alteração depois de publicada aparece ao motorista como roteiro atualizado, com o que mudou em destaque. | `RN-SL-020` |
| RN3 | Retirar ou remanejar entrega de rota publicada exige motivo e fica no histórico. | `RN-SL-019`, `RN-SL-024` |
| RN4 | A ordem planejada fica registrada mesmo que o motorista atenda em outra ordem. | `RN-SL-021` |
| RN5 | Publicar é exclusivo do coordenador. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Publicar | que montei a rota de um motorista | publico | o motorista vê o roteiro no celular e as entregas passam a "Em rota". |
| CA2 | Publicar todas | que montei as rotas de 18 motoristas | publico todas | cada motorista recebe a própria rota, sem nenhuma mensagem de WhatsApp. |
| CA3 | Remanejar | que a rota está publicada | remanejo uma entrega para outro motorista, informando o motivo | os dois motoristas veem o roteiro atualizado e a entrega registra o remanejamento. |
| CA4 | Sem motivo | que a rota está publicada | tento retirar uma entrega sem informar o motivo | o sistema exige o motivo. |
| CA5 | Mudança em destaque | que o coordenador mudou minha rota | abro o roteiro | vejo o aviso de roteiro atualizado, com a parada nova ou retirada em destaque. |

**Integrações e APIs** — Nenhuma. O roteiro chega pelo próprio aplicativo do motorista, não pelo `INT-001` WhatsApp.

**Referências** — Gargalos §2 (roteiro enviado por WhatsApp, motorista por motorista), §3 (grupo com cerca de 18 motoristas).

---

### HU-SL-010 — Acompanhar o andamento das rotas

| | |
|---|---|
| **Módulo** | `registro-planejamento` |
| **Sistema** | SEALog |
| **Atores** | Analista, Coordenador |
| **Telas** | `TL-SL-010` Rotas do dia |
| **Origem legada** | Hoje: muitos motoristas só avisam no almoço, no fim do dia ou quando algo dá errado, e o andamento só se descobre perguntando no grupo |
| **Prioridade** | Média |

**Como** coordenador de operação
**Gostaria de** ver, para cada rota, quantas paradas foram feitas, quantas faltam e quando foi o último registro do motorista
**Para que** eu perceba cedo a rota parada ou o motorista que não está registrando, sem precisar perguntar.

**Descrição**

A tela de rotas, durante o dia, mostra o andamento de cada uma: paradas entregues, não entregues e
pendentes, e a hora do último registro do motorista. Rota sem nenhum registro há mais tempo que o
limite combinado fica sinalizada, para que o coordenador entre em contato. Esse limite não está na
origem (`Q-SL-06`).

Abrir uma rota mostra as paradas na ordem planejada, com o status e a hora do registro de cada uma.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Cada rota mostra paradas concluídas, pendentes e com ocorrência, e a hora do último registro do motorista. | `RN-SL-022` |
| RN2 | Rota sem registro há mais que o limite combinado fica sinalizada. | `RN-SL-022` |
| RN3 | O registro feito sem sinal conta pela hora do fato, não pela hora em que chegou. | `RN-SL-030` |
| RN4 | Toda tela de status mostra a hora do último registro. | `RN-SL-035` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Andamento | que um motorista já registrou 5 das 10 paradas | abro as rotas do dia | vejo "5 de 10" na rota dele e a hora do último registro. |
| CA2 | Rota parada | que a rota está sem registro há mais que o limite combinado | abro as rotas do dia | a rota aparece sinalizada. |
| CA3 | Registro atrasado pelo sinal | que o motorista entregou às 10h sem sinal e o registro só chegou às 11h | olho a parada | a entrega aparece como feita às 10h. |
| CA4 | Ocorrência visível | que uma parada foi registrada como não entregue | abro a rota | a parada aparece com a ocorrência em destaque. |

**Integrações e APIs** — Nenhuma.

**Referências** — Gargalos §3 (atualizações em lote ou só em problema; motorista dirigindo ou sem sinal); `Q-SL-06`.

---

## Execução do motorista

### HU-SL-011 — Ver o roteiro do dia no celular

| | |
|---|---|
| **Módulo** | `execucao-motorista` |
| **Sistema** | SEALog |
| **Atores** | Motorista |
| **Telas** | `TL-SL-011` Roteiro do motorista |
| **Origem legada** | Hoje: o roteiro chega por WhatsApp, numa mensagem do coordenador, e o motorista o acompanha entre as cerca de 18 conversas do grupo |
| **Prioridade** | Alta |

**Como** motorista
**Gostaria de** abrir no celular a minha rota do dia, parada por parada
**Para que** eu tenha endereço, contato e volumes de cada entrega sem procurar mensagem no grupo.

**Descrição**

O motorista entra no aplicativo e vê só as próprias rotas do dia, com as paradas na ordem
planejada. Cada parada traz o destinatário, o telefone, o endereço completo, o ponto de referência,
os volumes e as observações do pedido, e o status: pendente, entregue ou não entregue. O endereço
abre no aplicativo de mapas do celular, e o telefone, na discagem.

Quando o coordenador altera a rota, o roteiro mostra o aviso de atualização e destaca o que mudou.
O roteiro continua disponível sem sinal, com o que foi carregado da última vez.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | O motorista vê só as próprias rotas do dia, com as paradas na ordem planejada. | `RN-SL-025` |
| RN2 | Cada parada mostra destinatário, telefone, endereço completo, ponto de referência, volumes e observações. | `RN-SL-025` |
| RN3 | Alteração da rota aparece como roteiro atualizado, com o que mudou em destaque. | `RN-SL-020` |
| RN4 | O roteiro fica disponível sem sinal. | `RN-SL-030` |
| RN5 | O motorista pode atender fora da ordem planejada. | `RN-SL-021` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Minha rota | que o coordenador publicou minha rota com 10 paradas | abro o aplicativo | vejo as 10 paradas na ordem planejada. |
| CA2 | Rota de outro | que outro motorista tem rota publicada | abro o aplicativo | não vejo a rota dele. |
| CA3 | Sem rota | que nenhuma rota minha foi publicada hoje | abro o aplicativo | vejo que não há rota para mim no dia. |
| CA4 | Sem sinal | que perdi o sinal depois de abrir o roteiro | abro uma parada | vejo os dados dela normalmente. |
| CA5 | Atualização | que o coordenador retirou uma parada da minha rota | abro o roteiro | vejo o aviso de atualização e a parada retirada em destaque. |

**Integrações e APIs** — Nenhuma. O aplicativo de mapas e a discagem são os do próprio celular.

**Referências** — Gargalos §2 (roteiro enviado por WhatsApp), §3 (grupo com cerca de 18 motoristas; motorista sem sinal).

---

### HU-SL-012 — Registrar a parada

| | |
|---|---|
| **Módulo** | `execucao-motorista` |
| **Sistema** | SEALog |
| **Atores** | Motorista |
| **Telas** | `TL-SL-012` Registro da parada |
| **Origem legada** | Hoje: as atualizações vêm em lote ou só quando há problema — muitos motoristas avisam no almoço, no fim do dia ou só quando algo dá errado — e o motorista dirigindo atrasa qualquer resposta |
| **Prioridade** | Alta |

**Como** motorista
**Gostaria de** registrar cada parada na hora, com poucos toques
**Para que** a SEALog e o cliente saibam o que aconteceu sem me ligar e sem eu ter de escrever no grupo.

**Descrição**

Ao chegar a uma parada, o motorista a abre — tocando nela no roteiro ou lendo a etiqueta do pacote
com a câmera — e escolhe Entregue ou Não entregue. Entregue segue para o comprovante
(`HU-SL-013`); Não entregue segue para o motivo (`HU-SL-014`). Não há texto a digitar.

Ler a etiqueta confere que o pacote é daquela rota: etiqueta de outra entrega é recusada com aviso,
antes que o pacote errado seja entregue. Cada registro grava o motorista e a hora do fato, e a
entrega muda de status na lista da equipe e no rastreio do cliente.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Cada parada é registrada no momento, como Entregue ou Não entregue, com motorista e hora do fato. | `RN-SL-026` |
| RN2 | Abrir a parada pela etiqueta confere que o pacote é daquela rota; etiqueta de outra entrega é recusada. | `RN-SL-027` |
| RN3 | O registro é feito por toque, leitura e foto, sem texto obrigatório. | `RN-SL-031` |
| RN4 | O registro muda o status da entrega pelos caminhos do ciclo. | `RN-SL-014` |
| RN5 | O motorista só registra paradas das próprias rotas. | `RN-SL-025` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Abrir pela etiqueta | que estou na parada 3 | leio a etiqueta do pacote | abre a parada 3, pronta para registrar. |
| CA2 | Pacote errado | que estou na parada 3 | leio a etiqueta de um pacote de outra rota | o aplicativo recusa e avisa que aquela etiqueta não é desta rota. |
| CA3 | Registro na hora | que entreguei às 10h12 | registro a entrega | a lista da equipe e o rastreio do cliente mostram a entrega às 10h12. |
| CA4 | Sem digitar | que estou registrando uma parada | concluo o registro | não precisei escrever nenhum texto. |
| CA5 | Parada já registrada | que a parada 3 já foi registrada como entregue | tento registrá-la de novo | o aplicativo mostra o registro feito e não grava outro. |

**Integrações e APIs** — Nenhuma. A mudança de status alimenta o rastreio (`HU-SL-016`) e, na ocorrência, o aviso ao cliente pelo `INT-001` WhatsApp (`HU-SL-020`).

**Referências** — Gargalos §3 (atualizações em lote ou só em problema; motorista dirigindo), §7 (caso "Registro incorreto").

---

### HU-SL-013 — Registrar o comprovante de entrega

| | |
|---|---|
| **Módulo** | `execucao-motorista` |
| **Sistema** | SEALog |
| **Atores** | Motorista |
| **Telas** | `TL-SL-012` Registro da parada |
| **Origem legada** | Hoje: a foto de comprovante é enviada solta no grupo, sem vínculo com a entrega. No caso "Registro incorreto", a foto sem vínculo e a linha errada na planilha impediram provar a entrega |
| **Prioridade** | Alta |

**Como** motorista
**Gostaria de** fotografar o comprovante pelo próprio aplicativo ao concluir a entrega
**Para que** a prova da entrega fique presa a ela, e ninguém precise procurar a foto no grupo.

**Descrição**

Ao escolher Entregue, o aplicativo abre a câmera. O motorista fotografa o comprovante — o pacote
entregue, a assinatura ou o documento combinado — e informa o nome de quem recebeu, escolhendo
"o próprio destinatário" ou digitando outro nome. A foto é tirada na hora, pelo aplicativo, e não
escolhida da galeria, para que não se troque a foto de uma entrega pela de outra.

Sem a foto, a entrega não se conclui. A foto fica no detalhe da entrega, à vista da equipe, e no
rastreio do cliente.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Entregue exige a foto do comprovante, tirada na hora pelo aplicativo, e o nome de quem recebeu. | `RN-SL-028` |
| RN2 | A foto fica presa à entrega; não existe comprovante solto. | `RN-SL-028` |
| RN3 | O comprovante aparece no rastreio do cliente depois da entrega. | `RN-SL-033` |
| RN4 | Sem sinal, a foto fica guardada no celular e é enviada quando a conexão volta. | `RN-SL-030` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Comprovante | que escolhi Entregue | fotografo o comprovante e confirmo "o próprio destinatário" | a entrega fica "Entregue", com a foto e o nome no detalhe. |
| CA2 | Sem foto | que escolhi Entregue | tento concluir sem foto | o aplicativo pede a foto e não conclui. |
| CA3 | Outra pessoa recebeu | que o porteiro recebeu o pacote | informo o nome dele | o nome do porteiro fica registrado como quem recebeu. |
| CA4 | Foto da galeria | que estou no comprovante | procuro escolher uma foto da galeria | não há essa opção: só a câmera. |
| CA5 | Cliente vê | que a entrega foi concluída | o cliente abre o rastreio | vê o status "Entregue" e a foto do comprovante. |

**Integrações e APIs** — Nenhuma. A câmera é a do celular.

**Referências** — Gargalos §3 (foto de comprovante solta no grupo, sem vínculo com a entrega), §7 (caso "Registro incorreto").

---

### HU-SL-014 — Registrar ocorrência de entrega não realizada

| | |
|---|---|
| **Módulo** | `execucao-motorista` |
| **Sistema** | SEALog |
| **Atores** | Motorista |
| **Telas** | `TL-SL-012` Registro da parada |
| **Origem legada** | Hoje: o problema é avisado no grupo de WhatsApp, onde a mensagem se perde entre as dos cerca de 18 motoristas. No caso "Buquê de sábado", o aviso de exceção se perdeu no grupo e o cliente não foi avisado |
| **Prioridade** | Alta |

**Como** motorista
**Gostaria de** registrar, na própria parada, que não consegui entregar e por quê
**Para que** o problema chegue a quem decide e ao cliente, em vez de se perder no grupo.

**Descrição**

Ao escolher Não entregue, o motorista toca no motivo, numa lista curta: destinatário ausente,
endereço não encontrado, endereço incompleto, recusado pelo destinatário, acesso impedido, pacote
avariado, condição climática e outro. Pode juntar uma foto e uma observação, mas não precisa.

O registro abre uma ocorrência na entrega. Ela aparece no painel de exceções do coordenador
(`HU-SL-018`) e dispara o aviso automático ao cliente (`HU-SL-020`), a qualquer hora. O pacote
volta com o motorista e é registrado na chegada ao galpão.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Não entregue exige um motivo da lista; foto e observação são opcionais. | `RN-SL-029` |
| RN2 | O registro abre uma ocorrência, que entra no painel de exceções. | `RN-SL-029`, `RN-SL-036` |
| RN3 | A ocorrência dispara aviso automático ao cliente, com o motivo e o link de rastreio. | `RN-SL-040` |
| RN4 | O aviso não depende do horário do atendimento. | `RN-SL-032` |
| RN5 | O pacote que volta é registrado na chegada ao galpão. | `RN-SL-039` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Ocorrência | que o destinatário não estava | escolho Não entregue e "Destinatário ausente" | a entrega fica "Não entregue", a ocorrência aparece no painel de exceções e o cliente recebe o aviso. |
| CA2 | Sem motivo | que escolhi Não entregue | tento concluir sem motivo | o aplicativo pede o motivo e não conclui. |
| CA3 | Sábado à tarde | que é sábado, 15h, e o atendimento fechou às 12h | registro a ocorrência | o cliente recebe o aviso da mesma forma. |
| CA4 | Foto opcional | que o portão estava fechado | registro "Acesso impedido" com uma foto | a foto fica presa à ocorrência. |
| CA5 | Outro motivo | que o motivo não está na lista | escolho "Outro" | o aplicativo pede uma observação curta. |

**Integrações e APIs** — `INT-001` WhatsApp, para o aviso automático ao cliente.

**Referências** — Gargalos §3 (grupo com cerca de 18 motoristas: mensagens se perdem), §5 (sem aviso proativo), §7 (caso "Buquê de sábado").

---

### HU-SL-015 — Registrar sem sinal

| | |
|---|---|
| **Módulo** | `execucao-motorista` |
| **Sistema** | SEALog |
| **Atores** | Motorista |
| **Telas** | `TL-SL-011` Roteiro do motorista · `TL-SL-012` Registro da parada |
| **Origem legada** | Hoje: o motorista sem sinal não consegue mandar nada, e a notícia só chega quando ele volta a ter conexão e se lembra de escrever |
| **Prioridade** | Alta |

**Como** motorista
**Gostaria de** registrar as paradas mesmo sem sinal
**Para que** eu não precise lembrar depois, e o registro chegue sozinho com a hora certa.

**Descrição**

Sem conexão, o aplicativo continua funcionando: o motorista registra a parada, a foto e a
ocorrência normalmente. Os registros ficam guardados no celular, com a hora em que aconteceram, e o
roteiro mostra quantos esperam envio. Quando o sinal volta, eles são enviados sozinhos, na ordem
em que foram feitos.

A entrega considera a hora do fato, não a hora em que o registro chegou: o cliente e a equipe veem
que a entrega foi feita às 10h, mesmo que a informação só tenha chegado às 11h.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Sem sinal, o registro fica guardado no celular com a hora real do fato. | `RN-SL-030` |
| RN2 | O envio acontece sozinho quando a conexão volta. | `RN-SL-030` |
| RN3 | O motorista vê quantos registros esperam envio. | `RN-SL-030` |
| RN4 | O status da entrega considera a hora do fato. | `RN-SL-030` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Registro guardado | que estou sem sinal | registro uma entrega com foto | o aplicativo aceita e mostra "1 registro aguardando envio". |
| CA2 | Envio automático | que tenho 3 registros aguardando envio | o sinal volta | os 3 são enviados sem eu fazer nada, e o contador zera. |
| CA3 | Hora do fato | que registrei sem sinal às 10h e o envio foi às 11h | a equipe abre a entrega | vê "Entregue às 10h". |
| CA4 | Celular desligado | que tenho registros aguardando envio | desligo e religo o celular | os registros continuam lá e são enviados quando houver sinal. |

**Integrações e APIs** — Nenhuma.

**Referências** — Gargalos §3 (motorista dirigindo ou sem sinal, o que atrasa qualquer resposta).

---

## Consulta de status

### HU-SL-016 — Acompanhar a entrega pelo link de rastreio

| | |
|---|---|
| **Módulo** | `consulta-status` |
| **Sistema** | SEALog |
| **Atores** | Cliente |
| **Telas** | `TL-SL-013` Rastreio da entrega |
| **Origem legada** | Hoje: "cadê minha entrega?" percorre uma cadeia de 5 saltos — cliente, atendente, analista, motorista e volta —, a resposta leva de 20 minutos a mais de 2 horas, e em dias cheios algumas ficam para o dia seguinte |
| **Prioridade** | Alta |

**Como** cliente da SEALog
**Gostaria de** abrir um link e ver onde está a minha entrega
**Para que** eu tenha a resposta na hora, sem precisar perguntar à atendente.

**Descrição**

Quando o pedido é confirmado, o cliente recebe no WhatsApp o link de rastreio daquela entrega. O
link abre no celular, sem login, e mostra o status atual, a data e a hora do último registro, a
data prevista e o histórico de status. Depois da entrega, mostra o comprovante e o nome de quem
recebeu; se houve ocorrência, mostra o motivo e o que foi decidido.

O link vale só para aquela entrega: não mostra outras entregas, a rota nem o telefone do
motorista. Funciona a qualquer hora, inclusive quando o atendimento está fechado.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Cada entrega tem um link de rastreio, enviado ao cliente na confirmação do pedido. | `RN-SL-033` |
| RN2 | O rastreio mostra status atual, histórico, data prevista e, depois da entrega, o comprovante. | `RN-SL-033` |
| RN3 | O rastreio mostra a data e a hora do último registro. | `RN-SL-035` |
| RN4 | O link dá acesso só àquela entrega e não mostra a rota nem o telefone do motorista. | `RN-SL-033`, `RN-SL-050` |
| RN5 | O rastreio funciona a qualquer hora, sem atendente. | `RN-SL-032` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Em rota | que minha entrega saiu para entrega às 9h | abro o link | vejo "Em rota", com a hora 9h. |
| CA2 | Entregue | que a entrega foi concluída | abro o link | vejo "Entregue", a hora, o nome de quem recebeu e a foto do comprovante. |
| CA3 | Ocorrência | que o motorista registrou "Destinatário ausente" | abro o link | vejo o motivo e, quando houver, a decisão tomada. |
| CA4 | Link inválido | que o endereço do link foi alterado | abro o link | vejo a mensagem de entrega não encontrada, sem nenhum dado de outra entrega. |
| CA5 | Fora do horário | que é domingo | abro o link | o rastreio funciona normalmente. |

**Integrações e APIs** — `INT-001` WhatsApp, para enviar o link na confirmação do pedido.

**Referências** — Gargalos §4 (cadeia de 5 saltos; resposta de 20 min a mais de 2 h; planilha desatualizada), §9 (atendimento com horário limitado).

---

### HU-SL-017 — Localizar uma entrega para responder ao cliente

| | |
|---|---|
| **Módulo** | `consulta-status` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Analista, Coordenador, Financeiro |
| **Telas** | `TL-SL-006` Lista de entregas · `TL-SL-007` Detalhe da entrega |
| **Origem legada** | Hoje: a atendente pergunta ao analista, que pergunta ao motorista, e a resposta volta pelo mesmo caminho; a planilha está desatualizada e a informação não está em lugar consultável |
| **Prioridade** | Alta |

**Como** atendente
**Gostaria de** achar a entrega do cliente que me escreveu e ver o status na hora
**Para que** eu responda na mesma conversa, sem perguntar ao analista nem ao motorista.

**Descrição**

A busca da lista de entregas acha uma entrega pelo código, pelo nome do cliente, pelo nome ou
telefone do destinatário ou pelo bairro. O detalhe da entrega mostra o status com a hora do último
registro, o motorista, a posição na rota, o comprovante e as ocorrências. A atendente responde com
base nisso, ou reenvia ao cliente o link de rastreio.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A busca acha a entrega por código, cliente, nome ou telefone do destinatário, ou bairro. | `RN-SL-034` |
| RN2 | O detalhe é o mesmo para toda a equipe, sem precisar perguntar a ninguém. | `RN-SL-013`, `RN-SL-034` |
| RN3 | O status vem com a data e a hora do último registro. | `RN-SL-035` |
| RN4 | A atendente pode reenviar ao cliente o link de rastreio. | `RN-SL-033` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Pelo telefone | que o cliente informou o telefone do destinatário | busco pelo telefone | vejo as entregas para aquele telefone, com o status e a hora do último registro. |
| CA2 | Pelo código | que o cliente informou o código | busco pelo código | abre direto o detalhe da entrega. |
| CA3 | Reenviar rastreio | que estou no detalhe da entrega | reenvio o link de rastreio | o cliente recebe o link no WhatsApp e o envio fica no histórico. |
| CA4 | Não encontrada | que busquei por um telefone sem entregas | faço a busca | a lista informa que nenhuma entrega foi encontrada. |

**Integrações e APIs** — `INT-001` WhatsApp, para reenviar o link de rastreio.

**Referências** — Gargalos §4 (cadeia de 5 saltos; planilha desatualizada).

---

## Exceções e decisões

### HU-SL-018 — Acompanhar o painel de exceções

| | |
|---|---|
| **Módulo** | `excecoes` |
| **Sistema** | SEALog |
| **Atores** | Coordenador, Atendente, Analista |
| **Telas** | `TL-SL-014` Painel de exceções |
| **Origem legada** | Hoje: as exceções aparecem como mensagens no grupo dos motoristas, misturadas às demais, e algumas se perdem — como no caso "Buquê de sábado" |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** ver num só lugar todas as entregas com problema que ainda esperam decisão
**Para que** nenhuma exceção se perca, e eu saiba o que decidir primeiro.

**Descrição**

O painel lista as ocorrências abertas do dia e as que sobraram de dias anteriores, da mais antiga
para a mais recente: entrega, cliente, motivo, motorista, hora do registro e o status do aviso ao
cliente. Ocorrência sem decisão no fim da Operação (19h) fica destacada. Também entram no painel os
avisos ao cliente que falharam, para reenvio.

O atendente e o analista veem o painel para responder ao cliente; só o coordenador decide
(`HU-SL-019`). A ocorrência sai do painel quando recebe decisão.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Toda ocorrência aberta aparece no painel até receber decisão. | `RN-SL-036` |
| RN2 | Ocorrência sem decisão até as 19h fica destacada. | `RN-SL-038` |
| RN3 | Aviso ao cliente que falhou aparece no painel para reenvio. | `RN-SL-043` |
| RN4 | Atendente e analista veem o painel; só o coordenador decide. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Ocorrência nova | que um motorista registrou "Endereço não encontrado" | abro o painel | a ocorrência aparece com entrega, cliente, motivo, motorista e hora. |
| CA2 | Fim do dia | que são 19h e a ocorrência não tem decisão | abro o painel | ela aparece destacada. |
| CA3 | Dia anterior | que uma ocorrência de ontem não teve decisão | abro o painel hoje | ela continua no painel, antes das de hoje. |
| CA4 | Aviso que falhou | que o aviso ao cliente não foi entregue pelo WhatsApp | abro o painel | vejo o aviso com falha e a opção de reenviar. |
| CA5 | Atendente | que sou atendente | abro o painel | vejo as ocorrências, mas não a ação de decidir. |

**Integrações e APIs** — `INT-001` WhatsApp, para o status dos avisos ao cliente.

**Referências** — Gargalos §3 (mensagens se perdem no grupo), §5 (exceções e decisões), §7 (caso "Buquê de sábado").

---

### HU-SL-019 — Decidir o destino da entrega não realizada

| | |
|---|---|
| **Módulo** | `excecoes` |
| **Sistema** | SEALog |
| **Atores** | Coordenador |
| **Telas** | `TL-SL-014` Painel de exceções · `TL-SL-007` Detalhe da entrega |
| **Origem legada** | Hoje: não há regra formal para o retorno ao galpão; o coordenador decide caso a caso o que fazer com o que não foi entregue, e a decisão não fica registrada |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** registrar, para cada entrega não realizada, o que vai acontecer com ela
**Para que** a decisão siga uma regra conhecida, fique registrada e seja comunicada ao cliente.

**Descrição**

A partir do painel, o coordenador decide cada ocorrência escolhendo uma de quatro saídas: nova
tentativa, com a data; devolver ao cliente; guardar no galpão aguardando instrução do cliente; ou
cancelar a pedido do cliente. A decisão registra quem decidiu, quando e o motivo, e o cliente
recebe um aviso com o que vai acontecer.

A nova tentativa devolve a entrega às prontas para rota na data escolhida. A devolução cria a volta
do pacote ao cliente. A guarda deixa a entrega no galpão até a instrução. O número máximo de
tentativas e o prazo de guarda dependem da política da SEALog, que a origem não traz (`Q-SL-07`).

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A decisão é uma de quatro: nova tentativa com data, devolver ao cliente, guardar no galpão aguardando instrução, cancelar a pedido do cliente. | `RN-SL-037` |
| RN2 | A decisão registra quem decidiu, quando e o motivo. | `RN-SL-037` |
| RN3 | A decisão gera aviso ao cliente com o que vai acontecer. | `RN-SL-040` |
| RN4 | O pacote que volta ao galpão é registrado pela etiqueta, ligado à ocorrência. | `RN-SL-039` |
| RN5 | Limite de tentativas e prazo de guarda seguem a política da SEALog. | `RN-SL-038` |
| RN6 | Decidir é exclusivo do coordenador. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Nova tentativa | que a ocorrência é "Destinatário ausente" | decido nova tentativa para amanhã | a entrega volta às prontas para amanhã e o cliente recebe o aviso com a nova data. |
| CA2 | Devolver | que o destinatário recusou o pacote | decido devolver ao cliente | a entrega passa a "Em devolução" e o cliente é avisado. |
| CA3 | Sem motivo | que estou decidindo uma ocorrência | tento gravar sem motivo | o sistema exige o motivo. |
| CA4 | Registro | que decidi uma ocorrência | abro o detalhe da entrega | vejo a decisão, meu nome, a hora e o motivo. |
| CA5 | Sem permissão | que sou analista | abro uma ocorrência | não vejo a ação de decidir. |

**Integrações e APIs** — `INT-001` WhatsApp, para o aviso da decisão ao cliente.

**Referências** — Gargalos §5 (retorno ao galpão sem regra formal; sem aviso proativo); `Q-SL-07`.

---

### HU-SL-020 — Avisar o cliente de problema na entrega

| | |
|---|---|
| **Módulo** | `excecoes` |
| **Sistema** | SEALog |
| **Atores** | Coordenador, Atendente, Analista, Cliente |
| **Telas** | `TL-SL-014` Painel de exceções · `TL-SL-015` Entregas afetadas por cliente |
| **Origem legada** | Hoje: não há aviso proativo ao cliente quando há problema; ele descobre quando pergunta. No caso "Buquê de sábado", o cliente não foi avisado; no caso "Segunda-feira de chuva", foram mais de 120 mensagens para 40 entregas |
| **Prioridade** | Alta |

**Como** cliente da SEALog
**Gostaria de** ser avisado assim que houver problema na minha entrega
**Para que** eu não descubra o atraso só quando o destinatário reclamar.

**Descrição**

Toda ocorrência gera um aviso automático ao cliente, por WhatsApp, com o motivo e o link de
rastreio, sem que ninguém da equipe precise escrever. A decisão sobre a ocorrência gera um segundo
aviso. Os avisos saem a qualquer hora, sem depender do horário do atendimento.

Quando o problema atinge muitas entregas de uma vez — a chuva de segunda-feira —, a equipe usa a
consulta de afetados (`HU-SL-021`) e envia um aviso em lote: uma mensagem por cliente, com a lista
das entregas dele. Todo aviso fica registrado na entrega, com o resultado do envio; o que falha
aparece no painel para reenvio.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Toda ocorrência gera aviso automático ao cliente, com motivo e link de rastreio; a decisão gera um segundo aviso. | `RN-SL-040` |
| RN2 | Os avisos não dependem do horário do atendimento. | `RN-SL-032` |
| RN3 | O aviso em lote manda uma mensagem por cliente, com a lista das entregas dele. | `RN-SL-041` |
| RN4 | Todo aviso fica registrado na entrega; o que falha vai para o painel. | `RN-SL-043` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Aviso automático | que o motorista registrou uma ocorrência | o registro chega ao sistema | o cliente recebe pelo WhatsApp o motivo e o link de rastreio, sem ação da equipe. |
| CA2 | Aviso da decisão | que o coordenador decidiu nova tentativa | grava a decisão | o cliente recebe o segundo aviso, com a nova data. |
| CA3 | Lote | que 40 entregas de 12 clientes atrasaram pela chuva | envio o aviso em lote aos 12 | cada cliente recebe uma só mensagem, com as entregas dele. |
| CA4 | Falha | que o número do cliente não recebe mensagens | o envio falha | o aviso aparece no painel com a falha e a opção de reenviar. |
| CA5 | Registro | que o cliente recebeu dois avisos | abro o detalhe da entrega | vejo os dois, com texto, hora e resultado do envio. |

**Integrações e APIs** — `INT-001` WhatsApp, para os avisos automáticos e em lote.

**Referências** — Gargalos §5 (sem aviso proativo ao cliente), §7 (casos "Buquê de sábado" e "Segunda-feira de chuva"), §9 (atendimento com horário limitado).

---

### HU-SL-021 — Consultar entregas afetadas por cliente

| | |
|---|---|
| **Módulo** | `excecoes` |
| **Sistema** | SEALog |
| **Atores** | Coordenador, Atendente, Analista, Financeiro |
| **Telas** | `TL-SL-015` Entregas afetadas por cliente |
| **Origem legada** | Hoje: não há visão de quem foi afetado e não dá para filtrar atrasos por cliente. No caso "Segunda-feira de chuva", 40 entregas atrasadas geraram mais de 120 mensagens |
| **Prioridade** | Alta |

**Como** coordenador de operação
**Gostaria de** ver, num dia ruim, quais clientes tiveram entregas atrasadas ou com problema, e quantas cada um
**Para que** eu avise cada cliente uma vez, em vez de responder dezenas de mensagens.

**Descrição**

A consulta lista as entregas atrasadas ou com ocorrência num período, agrupadas por cliente, com a
contagem de cada grupo. Atrasada é a entrega não concluída até o fim da data prevista. Filtra por
período, motivo da ocorrência, bairro e motorista.

Daqui a equipe seleciona os clientes e envia o aviso em lote (`HU-SL-020`), e pode exportar a
consulta para planilha (`HU-SL-023`).

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A consulta lista as entregas atrasadas ou com ocorrência, agrupadas por cliente, com a contagem. | `RN-SL-042` |
| RN2 | Atrasada é a entrega não concluída até o fim da data prevista. | `RN-SL-042` |
| RN3 | A partir da consulta, envia-se o aviso em lote aos clientes selecionados. | `RN-SL-041` |
| RN4 | A consulta pode ser exportada para planilha. | `RN-SL-048` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Dia de chuva | que 40 entregas de 12 clientes atrasaram na segunda-feira | consulto a segunda-feira | vejo 12 clientes, cada um com a contagem e as entregas dele. |
| CA2 | Filtro por motivo | que houve ocorrências de vários motivos | filtro por "Condição climática" | vejo só as entregas com esse motivo. |
| CA3 | Atraso sem ocorrência | que uma entrega não foi registrada até o fim da data prevista | consulto o dia | ela aparece como atrasada. |
| CA4 | Nenhum afetado | que não houve atraso nem ocorrência no período | consulto | a consulta informa que nenhuma entrega foi encontrada. |

**Integrações e APIs** — `INT-001` WhatsApp, pelo aviso em lote; `INT-003` Planilhas, pela exportação.

**Referências** — Gargalos §5 (sem visão de quem foi afetado), §7 (caso "Segunda-feira de chuva": 40 entregas, mais de 120 mensagens).

---

## Financeiro

### HU-SL-022 — Fechar a cobrança do período por cliente

| | |
|---|---|
| **Módulo** | `financeiro` |
| **Sistema** | SEALog |
| **Atores** | Financeiro |
| **Telas** | `TL-SL-016` Fechamento de cobrança |
| **Origem legada** | Hoje: a cobrança é calculada sobre planilhas manuais, e qualquer erro de registro na planilha passa para a cobrança |
| **Prioridade** | Média |

**Como** financeiro
**Gostaria de** gerar o fechamento de cada cliente a partir das entregas registradas no sistema
**Para que** a cobrança saia do mesmo registro que a operação usa, sem recontar planilhas.

**Descrição**

O financeiro escolhe o período e gera os fechamentos: um por cliente, com as entregas que chegaram
a um status final no período e o valor de cada uma, segundo a tabela de preços da SEALog. O extrato
lista cada entrega com código, data, destinatário, bairro, status final e valor, e o total.

O fechamento passa por conferência e depois é fechado. Fechado, não muda: uma correção descoberta
depois entra como ajuste, com motivo, no fechamento seguinte do mesmo cliente. A tabela de preços e
a forma de cobrar tentativa sem sucesso, devolução e coleta não estão na origem (`Q-SL-08`,
`Q-SL-09`).

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A cobrança vem das entregas registradas no sistema, por cliente e período. | `RN-SL-044` |
| RN2 | Entram as entregas que chegaram a um status final no período, valoradas pela tabela de preços. | `RN-SL-045` |
| RN3 | O fechamento passa por conferência; fechado, não muda, e a correção entra como ajuste no seguinte. | `RN-SL-046` |
| RN4 | O extrato lista cada entrega com código, data, destinatário, bairro, status e valor; o total é a soma das linhas mais os ajustes. | `RN-SL-047` |
| RN5 | Fechar a cobrança é exclusivo do financeiro. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Gerar | que um cliente teve 30 entregas concluídas em outubro | gero o fechamento de outubro | o extrato dele tem as 30 entregas, cada uma com valor, e o total. |
| CA2 | Entrega em aberto | que uma entrega do cliente ainda está "Em rota" no fim do período | gero o fechamento | ela não entra neste fechamento. |
| CA3 | Fechado não muda | que o fechamento de outubro foi fechado | tento alterar uma linha | o sistema recusa e oferece lançar ajuste no fechamento seguinte. |
| CA4 | Ajuste | que lancei um ajuste com motivo | gero o fechamento seguinte | o ajuste aparece nele, com o motivo, e entra no total. |
| CA5 | Sem permissão | que sou coordenador | tento abrir o fechamento | o sistema recusa e informa que meu perfil não tem acesso. |

**Integrações e APIs** — `INT-003` Planilhas, pela exportação do extrato (`HU-SL-023`). Emissão de nota e cobrança bancária estão fora do escopo.

**Referências** — Gargalos §6 (cobrança calculada sobre planilhas manuais, com risco de erro herdado); `Q-SL-08`, `Q-SL-09`.

---

### HU-SL-023 — Exportar listas para planilha

| | |
|---|---|
| **Módulo** | `financeiro` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Analista, Coordenador, Financeiro |
| **Telas** | `TL-SL-017` Exportação para planilha · `TL-SL-006` Lista de entregas · `TL-SL-015` Entregas afetadas por cliente · `TL-SL-016` Fechamento de cobrança |
| **Origem legada** | Hoje: a equipe trabalha em planilhas e está acostumada com elas; o enunciado aponta a adoção como o risco principal da solução |
| **Prioridade** | Média |

**Como** pessoa da equipe acostumada com planilha
**Gostaria de** levar para uma planilha o que estou vendo na tela
**Para que** eu continue fazendo minhas análises do jeito que sei, sem que a planilha volte a ser a fonte dos dados.

**Descrição**

A lista de entregas, a consulta de afetados e o fechamento de cobrança têm a ação Exportar. A
planilha sai com as mesmas colunas e os mesmos filtros da tela, em XLSX ou CSV, com a data e a
hora da exportação no nome do arquivo.

A planilha exportada é uma fotografia daquele momento: ela não volta para o sistema. Quem precisa
corrigir um dado corrige no sistema. É isso que impede que voltem a existir planilhas divergentes.

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | Lista de entregas, consulta de afetados e fechamento exportam para XLSX e CSV, com as colunas e os filtros da tela. | `RN-SL-048` |
| RN2 | A planilha exportada não é importada de volta: a fonte continua sendo o sistema. | `RN-SL-013` |
| RN3 | Cada perfil exporta só o que pode ver. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Com filtro | que filtrei a lista de entregas por "Entregue" e pela semana | exporto em XLSX | a planilha traz só as entregas filtradas, com as colunas da tela. |
| CA2 | CSV | que estou no fechamento de um cliente | exporto em CSV | recebo o arquivo com as linhas do extrato e o total. |
| CA3 | Nome do arquivo | que exportei às 14h05 de 29/10/2026 | abro a pasta de downloads | o nome do arquivo traz a data e a hora da exportação. |
| CA4 | Lista vazia | que o filtro não trouxe nenhuma entrega | tento exportar | o sistema avisa que não há o que exportar. |

**Integrações e APIs** — `INT-003` Planilhas.

**Referências** — Gargalos §9 (equipe acostumada com planilha; risco principal é adoção), §2 (planilhas divergentes).

---

## Acesso

### HU-SL-024 — Entrar no sistema com o perfil

| | |
|---|---|
| **Módulo** | `acesso` |
| **Sistema** | SEALog |
| **Atores** | Atendente, Analista, Coordenador, Motorista, Financeiro |
| **Telas** | `TL-SL-001` Entrada no sistema |
| **Origem legada** | Hoje: não há sistema; o acesso à informação é estar no grupo de WhatsApp ou ter a planilha |
| **Prioridade** | Alta |

**Como** pessoa da equipe da SEALog
**Gostaria de** entrar no sistema com meu usuário e ver só o que meu papel usa
**Para que** cada um trabalhe na sua parte, e cada registro tenha um autor.

**Descrição**

A equipe entra com usuário e senha. O perfil — atendente, analista, coordenador, motorista ou
financeiro — define o menu e as ações. O motorista entra pelo celular e continua conectado durante o
dia. Usuário ou senha errados são recusados sem dizer qual dos dois errou. Tela fora do perfil é
recusada com aviso.

O coordenador cadastra os usuários da equipe e define o perfil de cada um. O cliente não entra: usa
o link do pedido e o link de rastreio. Quem administra o acesso está para confirmação (`Q-SL-10`).

**Regras de negócio**

| # | Regra | Catálogo |
|---|---|---|
| RN1 | A equipe entra com usuário e senha, em um de cinco perfis. | `RN-SL-049` |
| RN2 | O cliente não tem login: usa os links. | `RN-SL-050` |
| RN3 | Cada perfil vê e faz só o que a matriz de permissões permite; tela fora do perfil é recusada. | `RN-SL-051` |

**Critérios de aceitação**

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA1 | Entrada | que tenho usuário de analista | entro com usuário e senha corretos | vejo o menu do analista. |
| CA2 | Senha errada | que errei a senha | tento entrar | o sistema recusa e informa que usuário ou senha estão incorretos, sem dizer qual. |
| CA3 | Fora do perfil | que sou motorista | abro o endereço do fechamento de cobrança | o sistema recusa e informa que meu perfil não tem acesso. |
| CA4 | Motorista conectado | que entrei no celular de manhã | abro o aplicativo à tarde | continuo conectado, sem digitar a senha. |
| CA5 | Cadastro | que sou coordenador | cadastro um motorista novo | ele consegue entrar e vê só o próprio roteiro. |

**Integrações e APIs** — Nenhuma.

**Referências** — Gargalos §1 a §6 (papéis da operação); `Q-SL-10`.
