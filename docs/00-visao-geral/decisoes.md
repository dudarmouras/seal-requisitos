# SEALog — Principais decisões

O registro das decisões que dão forma ao SEALog: o que foi decidido, por quê, o que se descartou e
o que cada decisão custa. Cada uma tem um id `DEC-SL-NN` estável, citado pelos requisitos, pelo
backlog e pelas páginas de arquitetura, infraestrutura, adoção e escalabilidade.

Uma decisão está num de três estados:

| Status | O que significa |
|---|---|
| **Tomada** | Decidida pela equipe a partir dos gargalos da operação. Muda só com uma decisão nova, que cita a antiga |
| **Proposta** | Recomendação da equipe que depende de confirmação da SEALog. Aponta a pergunta `Q-SL-*` que a destrava |
| **Em aberto** | Ainda sem recomendação. Depende de informação que só a SEALog tem |

As decisões de produto valem para qualquer tecnologia. As de arquitetura e infraestrutura são
proposta: a stack não está definida na origem (`Q-SL-01`), e os requisitos continuam
independentes dela.

## Índice

| ID | Decisão | Tema | Status |
|---|---|---|---|
| `DEC-SL-01` | Um registro único por entrega, fonte da verdade da operação | Produto | Tomada |
| `DEC-SL-02` | Pedido incompleto vira pendência, não é recusado nem confirmado | Produto | Tomada |
| `DEC-SL-03` | O cliente não cria conta nem instala nada: usa links | Produto | Tomada |
| `DEC-SL-04` | A rota continua decidida pelo coordenador, sem otimização automática | Produto | Tomada |
| `DEC-SL-05` | O comprovante só existe preso à entrega, lida pela etiqueta | Produto | Tomada |
| `DEC-SL-06` | A entrega não realizada tem quatro destinos possíveis, e só quatro | Produto | Tomada |
| `DEC-SL-07` | O cliente é avisado sem depender do horário do atendimento | Produto | Tomada |
| `DEC-SL-08` | A planilha continua como saída, nunca como fonte | Produto | Tomada |
| `DEC-SL-09` | Fechamento fechado não muda; correção vira ajuste | Produto | Tomada |
| `DEC-SL-10` | Requisitos independentes de stack; arquitetura isolada como proposta | Método | Tomada |
| `DEC-SL-11` | Priorização em MoSCoW, com releases guiadas pelos quatro casos | Método | Tomada |
| `DEC-SL-12` | Um único sistema web, em módulos, sobre serviços gerenciados | Arquitetura | Proposta |
| `DEC-SL-13` | O motorista usa um aplicativo web instalável que funciona sem sinal | Arquitetura | Proposta |
| `DEC-SL-14` | Avisos pela plataforma oficial do WhatsApp Business | Infraestrutura | Proposta |
| `DEC-SL-15` | Banco relacional gerenciado e armazenamento de fotos em nuvem | Infraestrutura | Proposta |
| `DEC-SL-16` | Adoção gradual, com piloto e operação em paralelo | Adoção | Tomada |
| `DEC-SL-17` | Escalar por gatilho medido, não por antecipação | Escalabilidade | Proposta |
| `DEC-SL-18` | Política de tentativas, guarda no galpão e cobrança de exceções | Produto | Em aberto |

---

## Decisões de produto

### DEC-SL-01 — Um registro único por entrega, fonte da verdade da operação

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A informação nasce no WhatsApp, passa por pessoas e acaba copiada em várias planilhas, uma por analista. Quase todos os gargalos têm essa causa comum (Gargalos §8) |
| **Decisão** | Toda entrega tem um registro único, criado quando o pedido chega, e tudo o que acontece com ela — dados, status, rota, comprovante, ocorrência, aviso, cobrança — é escrito nesse registro, com autor e hora. Não existe cópia por pessoa |
| **Alternativas descartadas** | Padronizar a planilha compartilhada: reduz a divergência, mas não resolve a digitação dupla, a foto solta nem a consulta em cinco saltos. Organizar os grupos de WhatsApp: não gera registro consultável |
| **Consequências** | Quem registra na origem passa a ser o cliente, o atendente e o motorista, e não mais o analista copiando o grupo. O sistema precisa funcionar onde a operação acontece: no celular, na rua e sem sinal (`DEC-SL-13`) |
| **Referências** | `RN-SL-001`, `RN-SL-013`, `HU-SL-005` |

### DEC-SL-02 — Pedido incompleto vira pendência, não é recusado nem confirmado

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | Cerca de 1 em 5 pedidos chega sem número, telefone ou rua, e nada impede o envio (Gargalos §1, caso "Pedido incompleto") |
| **Decisão** | O pedido sem algum dado obrigatório é registrado como "Pendente de dados", com a lista do que falta. Não entra no planejamento até ser completado, e o cliente pode completá-lo sozinho pelo link |
| **Alternativas descartadas** | Recusar o pedido incompleto: perde a venda e devolve o trabalho à conversa. Aceitar e corrigir depois: é o que acontece hoje |
| **Consequências** | Surge uma fila de pendências com tempo de espera visível. A lista final de dados obrigatórios depende da SEALog (`Q-SL-03`) |
| **Referências** | `RN-SL-002`, `RN-SL-003`, `RN-SL-009`, `HU-SL-001`, `HU-SL-004` |

### DEC-SL-03 — O cliente não cria conta nem instala nada: usa links

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | Os clientes são pequenos e pedem por WhatsApp e Instagram. Exigir cadastro afasta justamente quem mais manda pedido incompleto (Gargalos §9) |
| **Decisão** | O cliente recebe na própria conversa um link para fazer ou completar o pedido e outro para acompanhar a entrega. Cada link dá acesso só à entrega a que pertence |
| **Alternativas descartadas** | Portal com login do cliente: barreira de adoção. Aplicativo do cliente: ninguém instala um aplicativo para uma entrega por semana. Robô de conversa: fora do escopo da origem |
| **Consequências** | O link precisa ser impossível de adivinhar e não pode mostrar dado de outra entrega nem o telefone do motorista (`RNF-SL-07`) |
| **Referências** | `RN-SL-004`, `RN-SL-050`, `HU-SL-002`, `HU-SL-016` |

### DEC-SL-04 — A rota continua decidida pelo coordenador, sem otimização automática

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A origem aponta a falta de ferramenta para montar e enviar rotas, não a qualidade das rotas que o coordenador monta (Gargalos §2) |
| **Decisão** | O coordenador escolhe motorista, entregas e ordem. O sistema apoia agrupando as entregas prontas por bairro e publica o roteiro no celular de cada motorista de uma vez |
| **Alternativas descartadas** | Roteirizador automático: custo e complexidade altos para resolver um problema que a origem não relata, e tira a decisão de quem conhece as ruas |
| **Consequências** | A otimização automática fica fora do backlog (`BL-SL-27`) e pode voltar como opção no patamar 3 de escalabilidade |
| **Referências** | `RN-SL-018`, `DIV-SL-01`, `HU-SL-008`, `HU-SL-009` |

### DEC-SL-05 — O comprovante só existe preso à entrega, lida pela etiqueta

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A foto do comprovante vai solta para o grupo, e no caso "Registro incorreto" a foto não tinha vínculo com a entrega (Gargalos §3, §7) |
| **Decisão** | A etiqueta é impressa pelo sistema com um código que a câmera lê. O motorista abre a parada lendo a etiqueta, e a foto é tirada pelo aplicativo naquele momento, dentro da entrega. Etiqueta de outra rota é recusada |
| **Alternativas descartadas** | Foto enviada por WhatsApp com o código na legenda: depende de digitação e volta ao grupo |
| **Consequências** | A etiqueta à mão acaba, e o galpão passa a precisar de uma impressora de etiquetas (custo único em `infraestrutura-e-custos`) |
| **Referências** | `RN-SL-015`, `RN-SL-027`, `RN-SL-028`, `HU-SL-006`, `HU-SL-013`, `Q-SL-05` |

### DEC-SL-06 — A entrega não realizada tem quatro destinos possíveis, e só quatro

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | O retorno ao galpão não tem regra formal, e o aviso de exceção se perde no grupo (Gargalos §5, caso "Buquê de sábado") |
| **Decisão** | Toda ocorrência entra no painel de exceções e só sai com uma decisão registrada: nova tentativa com data, devolução ao cliente, guarda no galpão aguardando instrução, ou cancelamento a pedido do cliente |
| **Alternativas descartadas** | Campo livre de "o que fazer": não permite contar, cobrar nem avisar o cliente de forma padronizada |
| **Consequências** | O número máximo de tentativas e o prazo de guarda dependem da SEALog (`DEC-SL-18`) |
| **Referências** | `RN-SL-036`, `RN-SL-037`, `HU-SL-018`, `HU-SL-019` |

### DEC-SL-07 — O cliente é avisado sem depender do horário do atendimento

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | O atendimento vai só até 12h no sábado, e a operação vai até 19h. No caso "Buquê de sábado" o problema aconteceu depois do horário e ninguém avisou (Gargalos §7, §9) |
| **Decisão** | A ocorrência e a decisão sobre ela geram aviso automático ao cliente por WhatsApp, com o motivo e o link de rastreio. O rastreio responde a qualquer hora |
| **Alternativas descartadas** | Escala de plantão no atendimento: custo de pessoal e continua dependendo de alguém ver o grupo |
| **Consequências** | Cada aviso tem custo por mensagem e depende de modelos de mensagem aprovados pela Meta (`DEC-SL-14`) |
| **Referências** | `RN-SL-032`, `RN-SL-040`, `HU-SL-020`, `DIV-SL-03`, `Q-SL-13` |

### DEC-SL-08 — A planilha continua como saída, nunca como fonte

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A equipe está acostumada com planilha, e o risco principal do projeto é a adoção (Gargalos §9) |
| **Decisão** | Toda lista pode ser exportada para `.xlsx` e `.csv` com as mesmas colunas da tela, e a lista de entregas se comporta como uma planilha filtrável. A planilha do cliente entra só pelo modelo do SEALog, e cada linha vira um pedido validado |
| **Alternativas descartadas** | Proibir planilhas: aumenta a resistência. Sincronizar com uma planilha editável: recria as cópias divergentes |
| **Consequências** | Análise na planilha continua possível; correção na planilha não volta para o sistema |
| **Referências** | `RN-SL-008`, `RN-SL-048`, `HU-SL-003`, `HU-SL-023`, `DIV-SL-02` |

### DEC-SL-09 — Fechamento fechado não muda; correção vira ajuste

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | A cobrança sai de planilhas manuais e herda os erros delas (Gargalos §6) |
| **Decisão** | A cobrança é calculada das entregas registradas, por cliente e período. Passa por conferência antes de ser fechada; depois de fechada, a correção entra como ajuste com motivo no fechamento seguinte |
| **Alternativas descartadas** | Reabrir o fechamento: apaga o que já foi cobrado do cliente |
| **Consequências** | O que se cobra por tentativa, devolução e coleta depende da tabela de preços da SEALog (`DEC-SL-18`) |
| **Referências** | `RN-SL-044`, `RN-SL-046`, `HU-SL-022` |

### DEC-SL-18 — Política de tentativas, guarda no galpão e cobrança de exceções

| | |
|---|---|
| **Status** | Em aberto |
| **Data** | 29/10/2026 |
| **Tema** | Produto |
| **Contexto** | O sistema já registra tentativa, devolução e guarda (`DEC-SL-06`), mas a origem não diz quantas tentativas a SEALog faz, por quanto tempo guarda o pacote, nem se cobra por isso |
| **Decisão** | Sem recomendação até a SEALog responder. Enquanto isso, o número de tentativas e o prazo de guarda são parâmetros, e o fechamento não cobra exceções |
| **Alternativas descartadas** | — |
| **Consequências** | Bloqueia a regra final do painel de exceções e do fechamento, não o desenvolvimento |
| **Referências** | `Q-SL-07`, `Q-SL-08`, `Q-SL-09`, `RN-SL-038`, `RN-SL-045` |

## Decisões de método

### DEC-SL-10 — Requisitos independentes de stack; arquitetura isolada como proposta

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Método |
| **Contexto** | O prazo é curto e o desafio não exige sistema funcional (Gargalos §9). A stack não foi definida (`Q-SL-01`) |
| **Decisão** | Histórias, regras, telas e fluxogramas descrevem comportamento, sem tecnologia. Arquitetura, infraestrutura e custos ficam em páginas próprias, como proposta, e podem mudar sem tocar nos requisitos |
| **Alternativas descartadas** | Escrever os requisitos já na tecnologia escolhida: amarra o documento a uma decisão que ainda não é da SEALog |
| **Consequências** | Trocar a stack proposta muda `DEC-SL-12` a `DEC-SL-15` e as páginas de arquitetura e custos, e nada mais |
| **Referências** | `Q-SL-01` |

### DEC-SL-11 — Priorização em MoSCoW, com releases guiadas pelos quatro casos

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Método |
| **Contexto** | São 24 histórias e o risco principal é a adoção. Entregar tudo de uma vez adia o primeiro uso real |
| **Decisão** | Cada item do backlog recebe uma classe MoSCoW (Must, Should, Could, Won't), um valor, um esforço e as dependências. As releases são cortadas para que cada uma resolva casos inteiros do enunciado: a R1 resolve "Pedido incompleto" e "Registro incorreto"; a R2, "Buquê de sábado" e "Segunda-feira de chuva"; a R3 fecha o financeiro |
| **Alternativas descartadas** | Ordenar só pela prioridade da HU (Alta, Média): ignora dependência — o recebimento no galpão tem prioridade Média, mas sem ele nenhuma entrega entra em rota |
| **Consequências** | A ordem do backlog pode divergir da prioridade da HU, e a página de backlog mostra essa diferença |
| **Referências** | `BL-SL-01` a `BL-SL-30` |

## Decisões de arquitetura e infraestrutura

### DEC-SL-12 — Um único sistema web, em módulos, sobre serviços gerenciados

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Arquitetura |
| **Contexto** | Equipe pequena, cerca de 18 motoristas, volume diário não informado (`Q-SL-02`). Não há equipe de infraestrutura na SEALog |
| **Decisão** | Uma aplicação web com os sete módulos de negócio separados por dentro, um banco relacional e serviços gerenciados para banco, arquivos, autenticação e hospedagem. Três portas de entrada sobre o mesmo núcleo: a tela da equipe, o aplicativo do motorista e as páginas públicas de pedido e rastreio |
| **Alternativas descartadas** | Microsserviços: custo de operação desproporcional ao volume. Servidor próprio: exige quem cuide dele |
| **Consequências** | Escala vertical simples no começo; os pontos de separação futura estão em `escalabilidade` |
| **Referências** | `Q-SL-01`, `RNF-SL-14`, `RNF-SL-16` |

### DEC-SL-13 — O motorista usa um aplicativo web instalável que funciona sem sinal

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Arquitetura |
| **Contexto** | O motorista dirige boa parte do tempo e às vezes fica sem sinal (Gargalos §3) |
| **Decisão** | Aplicativo web instalável na tela inicial do celular, que guarda o roteiro e os registros no aparelho e os envia sozinho quando a conexão volta, com a hora real do fato. Usa a câmera para ler a etiqueta e tirar a foto |
| **Alternativas descartadas** | Aplicativo nativo nas lojas: duas bases de código e publicação mais lenta. Registrar pelo WhatsApp: não estrutura o dado e não funciona sem sinal |
| **Consequências** | A sincronização sem sinal é o item de maior esforço da R1 (`BL-SL-13`). Precisa de teste nos celulares reais dos motoristas |
| **Referências** | `RN-SL-030`, `RN-SL-031`, `HU-SL-015`, `RNF-SL-03`, `DIV-SL-04` |

### DEC-SL-14 — Avisos pela plataforma oficial do WhatsApp Business

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Infraestrutura |
| **Contexto** | O cliente já está no WhatsApp, e o aviso precisa sair sem atendente (`DEC-SL-07`) |
| **Decisão** | Enviar os avisos pela plataforma oficial de mensagens da Meta, com modelos de mensagem de utilidade aprovados. O pedido de aprovação começa na R1, porque o prazo é da Meta |
| **Alternativas descartadas** | Automação não oficial do WhatsApp: risco de bloqueio do número. SMS: o cliente não está lá. E-mail: não é o canal da operação |
| **Consequências** | Custo por mensagem enviada fora da janela de atendimento, a maior parcela do custo variável (`infraestrutura-e-custos`) |
| **Referências** | `RN-SL-040`, `RN-SL-043`, `HU-SL-020`, `BL-SL-17`, `DIV-SL-03`, `Q-SL-12` |

### DEC-SL-15 — Banco relacional gerenciado e armazenamento de fotos em nuvem

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Infraestrutura |
| **Contexto** | O dado é relacional (cliente, entrega, volume, rota, parada, ocorrência, fechamento) e precisa de histórico auditável. As fotos são o dado que mais cresce |
| **Decisão** | PostgreSQL gerenciado, com cópia de segurança diária, e fotos em armazenamento de objetos, comprimidas no celular antes do envio. Proposta concreta: Supabase para banco, autenticação e arquivos, e Vercel para hospedar a aplicação — os mesmos serviços que a equipe já usa neste repositório |
| **Alternativas descartadas** | Banco de documentos: o ciclo de status e o fechamento pedem integridade relacional. Guardar a foto no banco: encarece a cópia de segurança |
| **Consequências** | Custo fixo baixo no começo; os limites de cada plano estão em `infraestrutura-e-custos` |
| **Referências** | `Q-SL-01`, `RNF-SL-09`, `RNF-SL-17` |

## Decisões de adoção e escala

### DEC-SL-16 — Adoção gradual, com piloto e operação em paralelo

| | |
|---|---|
| **Status** | Tomada |
| **Data** | 29/10/2026 |
| **Tema** | Adoção |
| **Contexto** | O risco principal é a adoção por uma equipe acostumada com planilha (Gargalos §9) |
| **Decisão** | Entrar em fases: preparação, piloto com poucos motoristas e a planilha em paralelo, virada da equipe inteira, abertura para o cliente e, por último, o financeiro. Cada fase tem critério de avanço medido e plano de volta |
| **Alternativas descartadas** | Virada de uma vez: um dia ruim no começo derruba a confiança no sistema |
| **Consequências** | Durante o piloto a equipe registra em dois lugares; a fase tem prazo para não virar o novo normal |
| **Referências** | `BL-SL-25`, `RNF-SL-18`, `DIV-SL-05`, `Q-SL-14` |

### DEC-SL-17 — Escalar por gatilho medido, não por antecipação

| | |
|---|---|
| **Status** | Proposta |
| **Data** | 29/10/2026 |
| **Tema** | Escalabilidade |
| **Contexto** | O volume de entregas por dia não é conhecido (`Q-SL-02`). Dimensionar para o pior caso paga por capacidade que talvez nunca se use |
| **Decisão** | Começar no menor patamar que atende a operação e subir quando um indicador cruzar o limite combinado: uso do banco, tempo de resposta da busca, atraso na fila de avisos, espaço das fotos |
| **Alternativas descartadas** | Arquitetura distribuída desde o início: custo e complexidade sem demanda que os justifique |
| **Consequências** | Os indicadores precisam ser medidos desde a R1 |
| **Referências** | `Q-SL-02`, `RNF-SL-14`, `RNF-SL-15` |
