# SEALog — Principais decisões

O registro das decisões que dão forma ao SEALog: o que foi decidido, por quê, o que se descartou e
o que cada decisão custa. Cada uma tem um id `DEC-SL-NN` estável, citado pelos requisitos, pelo
backlog e pelas páginas de arquitetura, infraestrutura, adoção e escalabilidade.

Uma decisão está num de três estados:

| Status | O que significa |
|---|---|
| **Tomada** | Decidida pela equipe a partir do enunciado, do Encontro 1 e do planejamento. Muda só com uma decisão nova, que cita a antiga |
| **Proposta** | Recomendação da equipe que depende de confirmação da SEALog ou de escolha técnica ainda aberta. Aponta o que a destrava |
| **Em aberto** | Ainda sem recomendação. Depende de informação que só a SEALog tem |

A virada do projeto foi o Encontro 1 (28/10/2026): a SEALog terceirizou as entregas para duas
empresas, uma por região. As decisões abaixo já partem desse cenário; o que valia antes, como o
aplicativo do motorista e a montagem de rotas, está nas alternativas descartadas.

## Índice

| ID | Decisão | Tema | Status |
|---|---|---|---|
| `DEC-SL-01` | Um registro único por entrega, fonte da verdade da operação | Produto | Tomada |
| `DEC-SL-02` | A loja continua no WhatsApp, com menu de duas opções e formulário obrigatório | Produto | Tomada |
| `DEC-SL-03` | A loja não tem cadastro nem senha: o número é confirmado no primeiro pedido | Produto | Tomada |
| `DEC-SL-04` | A entrega é das terceirizadas; o SEALog não constrói nada para o motorista | Produto | Tomada |
| `DEC-SL-05` | Distribuição por regra fixa de região | Produto | Tomada |
| `DEC-SL-06` | Retorno pela API padrão, com portal e planilha traduzida | Produto | Tomada |
| `DEC-SL-07` | Um padrão único de comprovante para toda terceirizada | Produto | Tomada |
| `DEC-SL-08` | O pacote é identificado só pelo código SEALog, sem etiqueta | Produto | Tomada |
| `DEC-SL-09` | O não entregue volta ao galpão, e uma pessoa decide entre quatro destinos | Produto | Tomada |
| `DEC-SL-10` | A IA é um agente de ocorrências que sugere; a decisão é humana | Produto | Tomada |
| `DEC-SL-11` | Avisos pelo WhatsApp, não por e-mail | Produto | Tomada |
| `DEC-SL-18` | Política de tentativas, guarda no galpão, preço e pagamento | Produto | Em aberto |
| `DEC-SL-19` | Requisitos independentes de stack; arquitetura isolada como proposta | Método | Tomada |
| `DEC-SL-20` | Priorização em MoSCoW, com releases guiadas pelos casos do enunciado | Método | Tomada |
| `DEC-SL-12` | Arquitetura baseada em APIs, sobre um banco relacional único | Arquitetura | Tomada |
| `DEC-SL-13` | Painel interno web responsivo, que abre no celular e no computador | Arquitetura | Proposta |
| `DEC-SL-14` | Agente de ocorrências em n8n, com GPT-4o | Infraestrutura | Proposta |
| `DEC-SL-15` | WhatsApp pela plataforma oficial da Meta | Infraestrutura | Proposta |
| `DEC-SL-21` | Back end em Python com FastAPI, banco no Supabase e painel em React | Infraestrutura | Tomada |
| `DEC-SL-16` | Adoção gradual, uma terceirizada e poucas lojas por vez | Adoção | Tomada |
| `DEC-SL-17` | Escalar por gatilho medido, não por antecipação | Escalabilidade | Tomada |

---

## Decisões de produto

### DEC-SL-01 — Um registro único por entrega, fonte da verdade da operação

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A informação nasce no WhatsApp, passa por pessoas e acaba copiada em várias planilhas, uma por analista (Enunciado §2; Gargalos §8). Depois da terceirização, cada terceirizada ainda devolve o status do seu jeito, por planilha, WhatsApp ou telefone (Encontro 1 [13:15], [19:03]) |
| **Decisão** | Toda entrega tem um registro único, criado quando o pedido chega, e tudo o que acontece com ela — dados, despacho, retornos da terceirizada, comprovante, chamados, avisos, cobrança e pagamento — é escrito nesse registro, com autor e hora. A planilha deixa de ser fonte |
| **Alternativas descartadas** | Padronizar a planilha compartilhada: reduz a divergência, mas não resolve a digitação dupla nem a consulta em cinco saltos. Deixar cada terceirizada com o seu controle: mantém as versões diferentes da mesma entrega |
| **Consequências** | Quem registra na origem passa a ser a loja, ao pedir, e a terceirizada, ao retornar. O sistema precisa aceitar o retorno do jeito que a terceirizada consegue mandar (`DEC-SL-06`) |
| **Referências** | `RN-SL-001`, `RN-SL-020`, `HU-SL-009`; Planejamento da equipe (substituir planilha por banco) |

### DEC-SL-02 — A loja continua no WhatsApp, com menu de duas opções e formulário obrigatório

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | As lojas são pequenas e pedem pelo número de WhatsApp da SEALog (Enunciado §2). Cerca de 1 em 5 pedidos chega incompleto, e nada impede o envio (caso "Pedido com informações incompletas", Enunciado §8) |
| **Decisão** | A loja continua no mesmo número. A mensagem abre um menu com duas opções — novo pedido e editar ou cancelar pedido — e o novo pedido é um formulário do próprio WhatsApp, que não envia sem os dados obrigatórios. A loja não acompanha o pedido pelo SEALog: acompanha pela terceirizada. O relato de problema não é opção do menu (`Q-SL-20`) |
| **Alternativas descartadas** | Link para um formulário na web: tira a loja da conversa. Aplicativo ou portal da loja: barreira de adoção para quem pede poucas vezes por semana. Continuar recebendo texto livre e validar depois: é o que acontece hoje |
| **Consequências** | O pedido incompleto deixa de existir no caminho principal; sobra o que a equipe registra à mão, que vira pendência (`RN-SL-012`). Depende da plataforma oficial do WhatsApp (`DEC-SL-15`) |
| **Referências** | `RN-SL-002` a `RN-SL-006`, `HU-SL-001`, `HU-SL-003`; Encontro 1 [07:35], [08:38], [14:33], [35:39] |

### DEC-SL-03 — A loja não tem cadastro nem senha: o número é confirmado no primeiro pedido

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A lista da equipe previa autenticação da loja por conta comercial (RF-02). No Encontro 1, a validação proposta foi a do número de origem. Em 29/10/2026 a equipe decidiu que a loja não se cadastra: quem se cadastra são as empresas terceirizadas |
| **Decisão** | A loja se identifica no formulário, pelo nome, e qualquer número abre o menu. O primeiro pedido de um número fica "A confirmar": a equipe confere que é cliente e o aprova ou cancela; depois disso, os pedidos desse número seguem direto |
| **Alternativas descartadas** | Cadastro da loja com números autorizados, a primeira versão desta decisão: a equipe decidiu que a loja não se cadastra. Usuário e senha da loja: mais uma coisa para lembrar. Aceitar qualquer número sem confirmação: qualquer pessoa faria pedido em nome de uma loja, e a SEALog pagaria a entrega |
| **Consequências** | A equipe confirma os números novos na lista de entregas (`HU-SL-009`). Sem dados comerciais, o endereço de coleta vem no pedido (`Q-SL-19`) e a cobrança usa o nome da loja informado nos pedidos (`Q-SL-21`). A senha fica só para a equipe e as terceirizadas, com bloqueio depois de cinco tentativas (`RNF-SL-10`) |
| **Referências** | `RN-SL-003`, `RN-SL-014`, `HU-SL-001`, `HU-SL-009`, `DIV-SL-10`, `Q-SL-18`; Encontro 1 [08:38] |

### DEC-SL-04 — A entrega é das terceirizadas; o SEALog não constrói nada para o motorista

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A SEALog terceirizou a entrega porque a frota própria estava cara (Encontro 1 [30:33]). As terceirizadas só executam a entrega, e a comunicação com o motorista é delas (Encontro 1 [13:15], [17:36]) |
| **Decisão** | O SEALog cuida do pedido, do despacho, do retorno e do que dá errado. Coleta, rota e motorista são da terceirizada. O sistema conversa com a empresa, não com o motorista |
| **Alternativas descartadas** | Aplicativo do motorista, que a equipe tinha desenhado antes da terceirização: o motorista não é da SEALog e a terceirizada tem o próprio controle. Cadastro e análise de motoristas (RF-05, RF-06 da lista da equipe): pelo mesmo motivo |
| **Consequências** | A qualidade do status passa a depender da terceirizada; por isso o padrão de retorno e de comprovante é obrigatório (`DEC-SL-06`, `DEC-SL-07`) e o pagamento só considera entrega comprovada (`RN-SL-048`) |
| **Referências** | `RN-SL-025`, `HU-SL-011`, `DIV-SL-01`, `DIV-SL-02` |

### DEC-SL-05 — Distribuição por regra fixa de região

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | São duas terceirizadas, cada uma numa região (Encontro 1 [15:19]). Hoje o coordenador e os analistas distribuem de cabeça (Enunciado §2) |
| **Decisão** | As regiões que cada terceirizada atende ficam no cadastro dela, cada uma um par bairro e cidade. O pedido recebido vai sozinho para a terceirizada do bairro de entrega. Bairro que nenhuma atende fica "Aguardando região" e vai ao coordenador, que escolhe e pode incluir o bairro nas regiões dela. Não há tabela de regiões à parte |
| **Alternativas descartadas** | Roteamento por IA, do planejamento inicial da equipe: era pensado para distribuir entre motoristas próprios; com duas empresas por região, uma regra fixa resolve, sem custo nem dado sensível enviado a um modelo. Distribuição manual pelo coordenador: é o gargalo de hoje |
| **Consequências** | O coordenador mantém as regiões no cadastro da terceirizada (`HU-SL-007`). Uma terceira terceirizada entra só com cadastro e regiões (`RNF-SL-15`) |
| **Referências** | `RN-SL-017`, `RN-SL-018`, `RN-SL-023`, `HU-SL-007`, `HU-SL-010` |

### DEC-SL-06 — Retorno pela API padrão, com portal e planilha traduzida

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | Cada terceirizada tem o seu padrão e hoje manda o status por planilha e WhatsApp (Encontro 1 [13:15], [26:53]). Os terceirizados têm pouca habilidade com tecnologia, e a SEALog quer adaptação gradual (Encontro 1 [23:17]) |
| **Decisão** | O SEALog publica uma API padrão: recebe o despacho e devolve cada situação da entrega com a hora do fato. Quem não integra usa um portal simples, com as mesmas situações. Quem ainda manda planilha tem a planilha traduzida para o padrão, linha a linha, e a linha que não se traduz é recusada com o motivo |
| **Alternativas descartadas** | Só API: exclui a terceirizada pequena, que hoje usa planilha. Só portal: obriga digitação a quem já tem sistema. Ler o WhatsApp da terceirizada: não estrutura o dado |
| **Consequências** | Três caminhos para o mesmo padrão; o caminho preferencial é a API, e a adoção leva a terceirizada da planilha ao portal ou à API (`DEC-SL-16`) |
| **Referências** | `RN-SL-028`, `RN-SL-029`, `HU-SL-013` a `HU-SL-015`, `DIV-SL-03`, `DIV-SL-06` |

### DEC-SL-07 — Um padrão único de comprovante para toda terceirizada

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A maior preocupação da SEALog é a terceirizada dizer que entregou e o destinatário dizer que não (Encontro 1 [26:53]). A SEALog pediu que a equipe proponha o padrão, que vale para as terceirizadas de hoje e de amanhã (Encontro 1 [27:54], [42:33]). A entrega a vizinho ou porteiro exige autorização prévia (Encontro 1 [43:19]) |
| **Decisão** | Entregue só é aceito com foto da entrega, data e hora, nome de quem recebeu e identificação do entregador. Se quem recebeu não é o destinatário nem pessoa autorizada no pedido, o Entregue é aceito mas abre chamado. A foto fica guardada pelo SEALog, presa à entrega |
| **Alternativas descartadas** | Aceitar o padrão de cada terceirizada: é o problema de hoje. Assinatura no celular do destinatário: exige que todo entregador tenha o mesmo aparelho e aplicativo |
| **Consequências** | O pagamento da terceirizada considera só entrega com comprovante aceito (`RN-SL-048`), o que dá à terceirizada motivo para seguir o padrão. O prazo de guarda das fotos está em `Q-SL-16` |
| **Referências** | `RN-SL-013`, `RN-SL-019`, `RN-SL-030`, `RN-SL-031`, `HU-SL-016`, `DIV-SL-07` |

### DEC-SL-08 — O pacote é identificado só pelo código SEALog, sem etiqueta

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | Hoje os pacotes têm etiqueta escrita à mão (Enunciado §2). A equipe decidiu por uma identificação própria, sem etiqueta à mão (Planejamento da equipe). Com a terceirização, quem coleta na loja é a terceirizada |
| **Decisão** | Todo pedido recebe um código SEALog no momento em que chega. A terceirizada recebe o código no despacho e o informa em todo retorno; retorno com código que não foi despachado para ela é recusado |
| **Alternativas descartadas** | Etiqueta impressa pela SEALog: o pacote nem passa pelo galpão no caminho normal, e a impressora vira custo sem uso |
| **Consequências** | Como o código vai junto do pacote fica a cargo da terceirizada e da loja; o SEALog garante só que nenhum retorno entra sem ele |
| **Referências** | `RN-SL-001`, `RN-SL-027`, `HU-SL-011` |

### DEC-SL-09 — O não entregue volta ao galpão, e uma pessoa decide entre quatro destinos

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | O coordenador decide caso a caso, sem regra formal (Enunciado §2). Depois da terceirização, o pacote não entregue volta para a SEALog (Encontro 1 [47:01]), e não há fluxo definido para quando dá errado (Encontro 1 [19:03]) |
| **Decisão** | Todo Não entregue abre um chamado, e o pacote volta ao galpão da SEALog, onde a chegada é registrada pelo código. O coordenador decide entre nova tentativa com data, devolver à loja, guardar aguardando instrução e cancelar a pedido da loja, e a loja é avisada |
| **Alternativas descartadas** | A terceirizada decidir sozinha: ela só executa a entrega (Encontro 1 [17:36]). Campo livre de "o que fazer": não permite contar, cobrar nem avisar de forma padronizada |
| **Consequências** | O número de tentativas e o prazo de guarda dependem da SEALog (`DEC-SL-18`) |
| **Referências** | `RN-SL-041`, `RN-SL-042`, `HU-SL-019` |

### DEC-SL-10 — A IA é um agente de ocorrências que sugere; a decisão é humana

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | O planejamento da equipe previa IA no roteamento e numa recomendação a partir do motivo da devolução, com cuidado com dados sensíveis. O plano do agente detalhou dois agentes: um de consulta de status e um de ocorrências |
| **Decisão** | Fica só o agente de ocorrências. A loja relata o problema pelo WhatsApp; o agente classifica o tipo, colhe o relato e as fotos, compara com o protocolo de atendimento da SEALog e abre um chamado no painel com uma ação sugerida. Uma pessoa aprova, muda ou recusa. O agente não recebe nome, telefone nem endereço |
| **Alternativas descartadas** | Agente de consulta de status: a loja acompanha pela terceirizada, e o SEALog não oferece consulta de status — fica fora. IA decidindo sozinha: a decisão envolve dinheiro e relação com a loja. Roteamento por IA: substituído pelas regiões cadastradas (`DEC-SL-05`) |
| **Consequências** | Não há protocolo de atendimento escrito por enquanto (`Q-SL-05`): o agente se apoia nos dados do pedido e do relato, e o coordenador, que é quem aprova (`Q-SL-06`), trata cada chamado |
| **Referências** | `RN-SL-036` a `RN-SL-040`, `HU-SL-017`, `HU-SL-018`, `DIV-SL-04`, `DIV-SL-08`; Plano do agente |

### DEC-SL-11 — Avisos pelo WhatsApp, não por e-mail

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A lista da equipe previa notificação por e-mail (RF-09). No caso "O buquê de sábado", a floricultura soube do problema pela consumidora, uma hora e meia depois do aviso do motorista (Enunciado §8). O atendimento vai só até 12h no sábado (Enunciado §2) |
| **Decisão** | Todo aviso à loja vai pela mesma conversa do WhatsApp em que ela pede: pedido recebido, problema na entrega, decisão e aviso em lote. O aviso sai sozinho, sem depender do horário do atendimento |
| **Alternativas descartadas** | E-mail: a loja pequena não acompanha e-mail ao longo do dia. Plantão no atendimento: custo de pessoal e continua dependendo de alguém ver o grupo |
| **Consequências** | Aviso iniciado pela empresa usa modelo de mensagem aprovado e tem custo por mensagem (`DEC-SL-15`). O destinatário recebe aviso só se algo der errado (`Q-SL-15`) |
| **Referências** | `RN-SL-043` a `RN-SL-045`, `HU-SL-020`, `HU-SL-021`, `DIV-SL-02`, `DIV-SL-05` |

### DEC-SL-18 — Política de tentativas, guarda no galpão, preço e pagamento

| | |
|---|---|
| **Status** | Em aberto |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | O sistema registra tentativa, devolução e guarda (`DEC-SL-09`) e calcula cobrança e pagamento (`RN-SL-047`, `RN-SL-048`), mas a origem não diz quantas tentativas a SEALog faz, por quanto tempo guarda o pacote, quanto cobra da loja nem quanto paga à terceirizada |
| **Decisão** | Sem recomendação até a SEALog responder. Enquanto isso, o número de tentativas e o prazo de guarda são parâmetros, e os fechamentos listam as entregas sem valor |
| **Alternativas descartadas** | — |
| **Consequências** | Bloqueia a regra final do galpão e o valor dos fechamentos, não o desenvolvimento |
| **Referências** | `Q-SL-07`, `Q-SL-08`, `Q-SL-09`, `RN-SL-042`, `RN-SL-047`, `RN-SL-048` |

## Decisões de método

### DEC-SL-19 — Requisitos independentes de stack; arquitetura isolada como proposta

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Método |
| **Contexto** | O prazo é curto e o desafio não exige sistema funcional (Enunciado §5). Parte da stack ainda está sendo escolhida pela equipe de back end e infraestrutura |
| **Decisão** | Histórias, regras, telas e fluxogramas descrevem comportamento, sem tecnologia. Arquitetura, infraestrutura e custos ficam em páginas próprias e podem mudar sem tocar nos requisitos |
| **Alternativas descartadas** | Escrever os requisitos já na tecnologia escolhida: amarra o documento a uma escolha que ainda pode mudar |
| **Consequências** | Trocar a stack muda `DEC-SL-13` a `DEC-SL-15` e as páginas de arquitetura e custos, e nada mais |
| **Referências** | `DEC-SL-12` |

### DEC-SL-20 — Priorização em MoSCoW, com releases guiadas pelos casos do enunciado

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Método |
| **Contexto** | São 24 histórias, o risco principal é a adoção e o volume deve chegar a 400 entregas por dia no mês que vem (Encontro 1 [23:40]). Entregar tudo de uma vez adia o primeiro uso real |
| **Decisão** | Cada item do backlog recebe uma classe MoSCoW (Must, Should, Could, Won't), um valor, um esforço e as dependências. As releases são cortadas para que cada uma resolva casos inteiros do enunciado |
| **Alternativas descartadas** | Ordenar só pela prioridade da HU (Alta, Média): ignora dependência |
| **Consequências** | A ordem do backlog pode divergir da prioridade da HU, e a página de backlog mostra essa diferença. O backlog atual é rascunho, para a equipe revisar |
| **Referências** | `BL-SL-01` a `BL-SL-43` |

## Decisões de arquitetura e infraestrutura

### DEC-SL-12 — Arquitetura baseada em APIs, sobre um banco relacional único

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Arquitetura |
| **Contexto** | O sistema tem quatro portas — WhatsApp, painel da equipe, portal e integração da terceirizada, agente de ocorrências — e todas tocam a mesma entrega. A equipe decidiu por arquitetura baseada em APIs e por substituir a planilha por banco (Planejamento da equipe) |
| **Decisão** | Um back end, organizado pelos sete módulos, expõe APIs que todas as portas usam. Um banco relacional guarda o registro único; as fotos ficam em armazenamento de arquivos |
| **Alternativas descartadas** | Microsserviços: custo de operação desproporcional a uma empresa pequena. Banco de documentos: o ciclo de status e os fechamentos pedem integridade relacional. Planilha online como banco: é o problema de hoje |
| **Consequências** | Os pontos de separação futura estão em `escalabilidade` |
| **Referências** | `RNF-SL-07`, `RNF-SL-19` |

### DEC-SL-13 — Painel interno web responsivo, que abre no celular e no computador

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Arquitetura |
| **Contexto** | A SEALog prefere uso no celular, mas pediu que a equipe justifique a escolha (Encontro 1 [45:49]). A equipe usa hoje planilha no computador; a terceirizada tem pouca habilidade com tecnologia (Encontro 1 [23:17]) |
| **Decisão** | O painel da equipe e o portal da terceirizada são uma aplicação web responsiva: abrem no navegador do celular e do computador, sem instalar nada. As telas de uso na rua — chamados, devoluções, portal — são desenhadas primeiro para o celular; a lista de entregas e os fechamentos, para a tela grande |
| **Alternativas descartadas** | Aplicativo nativo: duas lojas de aplicativo, publicação mais lenta e custo maior, para um público que já usa o navegador. Só computador: deixa o coordenador sem o painel fora da mesa |
| **Consequências** | Um código só para painel e portal (`RNF-SL-19`). O que o celular faz é limitado ao navegador, o que basta para foto e formulário |
| **Referências** | `RNF-SL-02`, `RNF-SL-03` |

### DEC-SL-14 — Agente de ocorrências em n8n, com GPT-4o

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Infraestrutura |
| **Contexto** | O agente precisa conversar no WhatsApp, ler o protocolo de atendimento, raciocinar sobre o caso e abrir o chamado no back end (Plano do agente) |
| **Decisão** | O agente roda no n8n Cloud, com o nó de agente de IA e o protocolo de atendimento nas instruções do modelo. O modelo proposto é o GPT-4o, escolhido pela capacidade de raciocínio sobre as regras. O agente abre o chamado chamando a rota de chamados do back end com uma chave fixa, e o painel recebe o chamado em tempo real |
| **Alternativas descartadas** | Modelo menor e mais barato: suficiente para extrair dados, fraco para comparar o caso com o protocolo. Construir o agente dentro do back end: mais tempo de desenvolvimento, sem ganho para o volume previsto |
| **Consequências** | Custo mensal de assinatura do n8n e de uso do modelo (`infraestrutura-e-custos`). Prazo estimado de 10 a 14 dias úteis, com o mapeamento do protocolo. O que o modelo recebe segue `RN-SL-038` |
| **Referências** | `RN-SL-036` a `RN-SL-038`, `RNF-SL-12`, `RNF-SL-13`, `INT-004`; Plano do agente |

### DEC-SL-15 — WhatsApp pela plataforma oficial da Meta

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Infraestrutura |
| **Contexto** | O menu, o formulário e os avisos automáticos dependem de envio e recebimento programados no número da SEALog (`DEC-SL-02`, `DEC-SL-11`) |
| **Decisão** | Usar a plataforma oficial de mensagens da Meta, com formulários do WhatsApp para o pedido e modelos de mensagem de utilidade aprovados para os avisos. O pedido de aprovação dos modelos começa na primeira release, porque o prazo é da Meta |
| **Alternativas descartadas** | Automação não oficial do WhatsApp: risco de bloqueio do número. SMS ou e-mail: a loja não está lá |
| **Consequências** | Custo por mensagem iniciada pela empresa; a resposta dentro da janela de atendimento aberta pela loja não é cobrada, a conferir na tabela vigente. A SEALog já tem conta comercial e paga as mensagens (`Q-SL-12`) |
| **Referências** | `INT-001`, `RN-SL-043`, `DIV-SL-05`, `Q-SL-12` |

### DEC-SL-21 — Back end em Python com FastAPI, banco no Supabase e painel em React

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Infraestrutura |
| **Contexto** | `DEC-SL-19` deixou a stack em aberto. O retorno da terceirizada chega também em planilha no formato modelo (`DEC-SL-06`), e o mesmo back end recebe o webhook do WhatsApp (`DEC-SL-15`). A SEALog pediu custo controlado (Encontro 1 [29:03]) |
| **Decisão** | O back end é um serviço em Python com FastAPI, que expõe as APIs de `DEC-SL-12`, recebe o WhatsApp e lê a planilha modelo. O banco PostgreSQL e os arquivos (fotos e planilhas) ficam no Supabase. O painel e o portal são uma aplicação React, ou Next.js, que chama só o FastAPI |
| **Alternativas descartadas** | Outra linguagem no back end: a vantagem do Python é a leitura de planilhas. Painel falando direto com o banco: a permissão deixaria de valer no servidor (`RNF-SL-11`). Servidor próprio com o banco instalado: backup e manutenção ficariam com a equipe, desproporcional a uma empresa pequena |
| **Consequências** | Onde cada parte roda e quanto custa está em `infraestrutura-e-custos`. A chave de serviço do Supabase fica só no back end. Trocar a stack muda esta decisão e as páginas de arquitetura e custos, e nenhum requisito (`DEC-SL-19`) |
| **Referências** | `DEC-SL-12`, `DEC-SL-13`, `DEC-SL-19`, `RNF-SL-11`, `RNF-SL-19` |

## Decisões de adoção e escala

### DEC-SL-16 — Adoção gradual, uma terceirizada e poucas lojas por vez

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Adoção |
| **Contexto** | A equipe está acostumada com planilha (Gargalos §9), os terceirizados têm pouca habilidade com tecnologia, e a SEALog quer adaptação gradual (Encontro 1 [23:17]) |
| **Decisão** | Entrar em fases: cadastros, piloto com uma terceirizada e poucas lojas, segunda terceirizada, todas as lojas e, por último, o financeiro. A terceirizada pode começar mandando planilha e migrar para o portal ou a integração. Cada fase tem critério de avanço medido |
| **Alternativas descartadas** | Virada de uma vez: um dia ruim no começo derruba a confiança das lojas e das terceirizadas |
| **Consequências** | Durante o piloto, parte das lojas pede pelo sistema e parte do jeito antigo; a fase tem prazo para não virar o novo normal (`Q-SL-14`) |
| **Referências** | `BL-SL-26`, `RNF-SL-02`, `DIV-SL-06`, `DIV-SL-09` |

### DEC-SL-17 — Escalar por gatilho medido, não por antecipação

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Escalabilidade |
| **Contexto** | A meta é 400 entregas por dia a partir do mês que vem (Encontro 1 [23:40]), e a SEALog é uma empresa pequena preocupada com custo (Encontro 1 [29:03]) |
| **Decisão** | Começar no menor patamar que atende 400 entregas por dia e subir quando um indicador cruzar o limite combinado: uso do banco, tempo de resposta, atraso na fila de avisos, volume de chamados, espaço das fotos |
| **Alternativas descartadas** | Dimensionar para o pior caso desde o início: paga por capacidade que talvez nunca se use |
| **Consequências** | Os indicadores precisam ser medidos desde a primeira release |
| **Referências** | `RNF-SL-07`, `RNF-SL-18` |
