# SEALog — Requisitos funcionais e não funcionais

A visão de produto dos requisitos do SEALog, em duas listas:

- **Funcionais** (`RF-SL-NN`) — o que o sistema faz. Cada um resume uma capacidade e aponta as
  histórias de usuário que a detalham, com critérios de aceitação, e as regras do catálogo que a
  governam. A história é o requisito em detalhe; esta lista é o mapa.
- **Não funcionais** (`RNF-SL-NN`) — como o sistema precisa se comportar: uso, disponibilidade,
  desempenho, segurança, privacidade, custo. Agrupados pelas características de qualidade da norma
  ISO/IEC 25010, cada um com uma meta que se possa verificar.

A base é a lista RF-01 a RF-20 do planejamento da equipe, revista depois do Encontro 1
(28/10/2026), em que a SEALog contou que terceirizou as entregas. A coluna **Lista da equipe** diz
de que item da lista original cada requisito vem; "—" é requisito novo. Onde a meta é um número que
a origem não traz, ela é **meta proposta** da equipe e vale até a SEALog confirmar.

---

## 1. Requisitos funcionais

### 1.1 Entrada de pedidos

| ID | Requisito | Módulo | Lista da equipe | HUs | Regras |
|---|---|---|---|---|---|
| `RF-SL-01` | Receber o pedido da loja pelo WhatsApp, num formulário que não envia sem os dados obrigatórios, a partir de um menu com novo pedido, acompanhar e editar | Entrada de pedidos | RF-07 | `HU-SL-001` | `RN-SL-001` a `RN-SL-010`, `RN-SL-013` |
| `RF-SL-02` | Responder à loja, pelo WhatsApp e a qualquer hora, o status do pedido e a hora do último registro | Entrada de pedidos | RF-07 | `HU-SL-002` | `RN-SL-004`, `RN-SL-022`, `RN-SL-035`, `RN-SL-054` |
| `RF-SL-03` | Deixar a loja editar ou cancelar o pedido pelo WhatsApp até a coleta, inclusive para autorizar quem pode receber | Entrada de pedidos | RF-19 | `HU-SL-003` | `RN-SL-011`, `RN-SL-013`, `RN-SL-026` |
| `RF-SL-04` | Registrar pela equipe o pedido que chegou fora do formulário — áudio, mensagem livre, ligação ou planilha da loja —, com as mesmas validações, e mandar à loja o formulário para completar o que faltar | Entrada de pedidos | RF-07 | `HU-SL-004` | `RN-SL-005`, `RN-SL-007`, `RN-SL-008`, `RN-SL-010`, `RN-SL-012` |

### 1.2 Cadastros

| ID | Requisito | Módulo | Lista da equipe | HUs | Regras |
|---|---|---|---|---|---|
| `RF-SL-05` | Cadastrar a loja e os números de WhatsApp autorizados a pedir em nome dela | Cadastros | RF-01, RF-02 | `HU-SL-005` | `RN-SL-003`, `RN-SL-014`, `RN-SL-054` |
| `RF-SL-06` | Manter os dados comerciais da loja, usados em todo pedido novo, com histórico de alteração | Cadastros | RF-03, RF-04 | `HU-SL-006` | `RN-SL-015` |
| `RF-SL-07` | Cadastrar a terceirizada, as regiões que atende, a forma de retorno e a credencial própria | Cadastros | — | `HU-SL-007` | `RN-SL-016`, `RN-SL-019`, `RN-SL-053` |
| `RF-SL-08` | Manter a tabela de regiões, que liga cada bairro e cidade a uma terceirizada | Cadastros | — | `HU-SL-007` | `RN-SL-017`, `RN-SL-018` |

### 1.3 Despacho

| ID | Requisito | Módulo | Lista da equipe | HUs | Regras |
|---|---|---|---|---|---|
| `RF-SL-09` | Manter uma lista única de entregas, organizada pela data prevista, filtrável como planilha, com o histórico de cada alteração e a entrega sem retorno sinalizada | Despacho | RF-08 | `HU-SL-009` | `RN-SL-020`, `RN-SL-021`, `RN-SL-022`, `RN-SL-034` |
| `RF-SL-10` | Distribuir sozinho o pedido à terceirizada da região, e levar ao coordenador o bairro que não está na tabela | Despacho | RF-12 | `HU-SL-010` | `RN-SL-017`, `RN-SL-018`, `RN-SL-023` |
| `RF-SL-11` | Enviar à terceirizada a solicitação de coleta e entrega, com o código SEALog, pela integração, pela lista do dia no portal ou pela exportação do `RF-SL-25` | Despacho | RF-10, RF-11, RF-13 | `HU-SL-011` | `RN-SL-024`, `RN-SL-025`, `RN-SL-027` |
| `RF-SL-12` | Avisar a terceirizada, na hora, de toda alteração ou cancelamento depois do despacho | Despacho | RF-20 | `HU-SL-012` | `RN-SL-011`, `RN-SL-026` |
| `RF-SL-25` | Exportar os pedidos de uma terceirizada, ou todos, em PDF ou planilha, para a equipe mandar pelo WhatsApp; o sistema gera o arquivo e não envia sozinho | Despacho | — | — | `RN-SL-024` |

### 1.4 Retorno da terceirizada

| ID | Requisito | Módulo | Lista da equipe | HUs | Regras |
|---|---|---|---|---|---|
| `RF-SL-13` | Receber da terceirizada, pela integração padrão, cada situação da entrega com a hora do fato | Retorno da terceirizada | RF-14 | `HU-SL-013` | `RN-SL-028`, `RN-SL-030` a `RN-SL-033`, `RN-SL-035` |
| `RF-SL-14` | Oferecer à terceirizada sem integração um portal simples para informar as mesmas situações | Retorno da terceirizada | RF-14 | `HU-SL-014` | `RN-SL-028`, `RN-SL-030`, `RN-SL-032`, `RN-SL-053` |
| `RF-SL-15` | Aceitar o retorno por planilha e traduzi-lo para o padrão, linha a linha, recusando com motivo o que não se traduz | Retorno da terceirizada | — | `HU-SL-015` | `RN-SL-029`, `RN-SL-033` |
| `RF-SL-16` | Exigir o comprovante padrão na entrega — foto, data e hora, quem recebeu e quem entregou — e abrir chamado quando quem recebeu não estava autorizado | Retorno da terceirizada | RF-15 | `HU-SL-016` | `RN-SL-013`, `RN-SL-030`, `RN-SL-031` |

### 1.5 Ocorrências e devoluções

| ID | Requisito | Módulo | Lista da equipe | HUs | Regras |
|---|---|---|---|---|---|
| `RF-SL-17` | Deixar a loja relatar um problema pelo WhatsApp a um agente que classifica, colhe o relato e as fotos e sugere uma ação pelo protocolo de atendimento | Ocorrências e devoluções | RF-18 | `HU-SL-017` | `RN-SL-036`, `RN-SL-037`, `RN-SL-038` |
| `RF-SL-18` | Reunir toda ocorrência num painel de chamados, com a sugestão do agente, para uma pessoa aprovar, mudar ou recusar | Ocorrências e devoluções | RF-14, RF-18 | `HU-SL-018` | `RN-SL-039`, `RN-SL-040`, `RN-SL-046` |
| `RF-SL-19` | Registrar a volta ao galpão do pacote não entregue, avisar o coordenador e registrar a decisão entre os quatro destinos | Ocorrências e devoluções | RF-16, RF-17 | `HU-SL-019` | `RN-SL-041`, `RN-SL-042` |
| `RF-SL-20` | Avisar a loja pelo WhatsApp, sem depender do atendimento, quando a entrega tem problema e quando há decisão, e guardar o resultado de cada envio | Ocorrências e devoluções | RF-09 | `HU-SL-020` | `RN-SL-043`, `RN-SL-045` |
| `RF-SL-21` | Listar as entregas atrasadas ou com chamado num período, agrupadas por loja, e avisar todas as lojas de uma vez | Ocorrências e devoluções | — | `HU-SL-021` | `RN-SL-044`, `RN-SL-045`, `RN-SL-050` |

### 1.6 Financeiro

| ID | Requisito | Módulo | Lista da equipe | HUs | Regras |
|---|---|---|---|---|---|
| `RF-SL-22` | Calcular a cobrança de cada loja por período a partir das entregas registradas, com conferência, ajustes e exportação | Financeiro | — | `HU-SL-022` | `RN-SL-047`, `RN-SL-049`, `RN-SL-050` |
| `RF-SL-23` | Calcular o pagamento de cada terceirizada pelas entregas com comprovante aceito, com conferência, ajustes e exportação | Financeiro | — | `HU-SL-023` | `RN-SL-048`, `RN-SL-049`, `RN-SL-050` |

### 1.7 Acesso

| ID | Requisito | Módulo | Lista da equipe | HUs | Regras |
|---|---|---|---|---|---|
| `RF-SL-24` | Dar entrada à equipe e às terceirizadas com usuário e senha, mostrar a cada perfil só o que ele pode fazer e bloquear a entrada depois de cinco tentativas erradas | Acesso | RF-02 | `HU-SL-024` | `RN-SL-051`, `RN-SL-052`, `RN-SL-053` |

### 1.8 O que mudou na lista da equipe

| Item da lista | O que aconteceu | Por quê |
|---|---|---|
| RF-01, RF-03 | Mantidos, como `RF-SL-05` e `RF-SL-06`. O cadastro da loja é feito pela equipe | A loja continua no WhatsApp e não acessa painel |
| RF-02 Autenticação de clientes | Mudou: a loja é identificada pelo número de WhatsApp autorizado, sem senha (`RF-SL-05`). A senha ficou para a equipe e as terceirizadas (`RF-SL-24`) | Encontro 1 [08:38]: validação do número de origem |
| RF-04 Sincronização de dados comerciais | Absorvido pelo `RF-SL-06`: com um banco único, não há o que sincronizar | Decisão da equipe de substituir a planilha por banco |
| RF-05, RF-06 Cadastro e análise de motoristas | Saíram. No lugar, o cadastro de terceirizadas (`RF-SL-07`) | Encontro 1 [13:15], [17:36]: o motorista é da terceirizada |
| RF-09 Notificação por e-mail | Mudou: o aviso vai pelo WhatsApp (`RF-SL-20`) | A loja já está no WhatsApp; e-mail não é o canal da operação |
| RF-10 Forma de coleta | Mudou: quem coleta é só a terceirizada (`RF-SL-11`); a loja não leva mais ao galpão (`Q-SL-02`) | Encontro 1 [15:19] |
| RF-11 Identificação dos pacotes | Mantido, como código SEALog sem etiqueta impressa (`RF-SL-11`) | Decisão da equipe |
| RF-12 Distribuição por motorista | Substituído pela distribuição por região à terceirizada (`RF-SL-10`) | O motorista é da terceirizada |
| RF-13 Visualização pelo motorista | Substituído pelo despacho à terceirizada (`RF-SL-11`) | O SEALog não constrói nada para o motorista |
| RF-14, RF-15 | Mantidos, agora vindos da terceirizada (`RF-SL-13` a `RF-SL-16`) | Encontro 1 [25:39], [40:16] |
| RF-16, RF-17, RF-18, RF-19, RF-20 | Mantidos (`RF-SL-19`, `RF-SL-17`, `RF-SL-03`, `RF-SL-12`); o RF-20 avisa a terceirizada, não o motorista | — |
| Novos | `RF-SL-02` (acompanhar pelo WhatsApp), `RF-SL-08` (regiões), `RF-SL-15` (planilha traduzida), `RF-SL-21` (afetados por loja), `RF-SL-22`, `RF-SL-23` (financeiro), `RF-SL-25` (exportação para a terceirizada) | Os casos do enunciado e o Encontro 1 |

## 2. Requisitos não funcionais

### 2.1 Usabilidade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-01` | A loja faz o pedido sem sair do WhatsApp, sem instalar nada e sem criar conta | Usabilidade | Pedido completo em até 3 minutos por quem nunca usou | Teste com cinco lojas reais durante o piloto | Encontro 1 [07:35]; `RN-SL-002`; meta proposta |
| `RNF-SL-02` | A comunicação com a terceirizada é simples: o portal pede só o necessário para cada situação | Usabilidade | Uma situação informada em até 3 toques mais a foto; portal usável no celular, sem treino além de uma demonstração | Teste com a equipe de cada terceirizada no piloto | Planejamento da equipe (RNF-02); Encontro 1 [23:17]; meta proposta |
| `RNF-SL-03` | A equipe trabalha num ambiente que lembra a planilha que já conhece | Usabilidade | Lista com filtro, ordenação e exportação; treino de até 1 hora por perfil | Avaliação com a equipe no fim da preparação | Gargalos §9; `RN-SL-050`; meta proposta |

### 2.2 Confiabilidade e disponibilidade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-04` | O pedido, o acompanhamento e o aviso à loja funcionam fora do horário do atendimento | Disponibilidade | 99,5% no mês; manutenção só fora da operação (seg a sáb, 7h às 19h) | Monitor externo do número de WhatsApp e da integração | Enunciado §2 (atendimento até 12h no sábado); `RN-SL-043`; meta proposta |
| `RNF-SL-05` | Nenhum retorno da terceirizada se perde nem se duplica | Confiabilidade | Todo retorno gravado uma vez; o repetido não duplica; a planilha recusada diz o motivo de cada linha | Teste de reenvio na integração e de planilha com erros | `RN-SL-029`, `RN-SL-033` |
| `RNF-SL-06` | Os dados se recuperam de uma falha | Recuperabilidade | Perda máxima de 24 horas de dados e volta em até 4 horas; fotos com cópia | Restauração de teste antes da virada | Meta proposta |

### 2.3 Desempenho e capacidade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-07` | O sistema aguenta a operação do mês que vem | Capacidade | 400 entregas por dia, com folga para o dobro no pico, sem mudar de arquitetura | Teste de carga com o volume de um dia de pico | Encontro 1 [23:40] (cerca de 400 entregas por dia); folga é meta proposta |
| `RNF-SL-08` | "Cadê minha entrega?" responde-se em segundos | Desempenho | Status no WhatsApp em até 10 segundos; busca no painel em até 2 segundos; contra 20 minutos a 2 horas hoje | Medição no piloto | Enunciado §2; meta proposta |
| `RNF-SL-09` | O chamado aparece no painel assim que é aberto | Desempenho | Em até 5 segundos, sem recarregar a página | Teste ponta a ponta do agente ao painel | Plano do agente (atualização em tempo real); meta proposta |

### 2.4 Segurança e privacidade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-10` | A entrada no painel e no portal resiste a tentativa repetida | Segurança | Bloqueio depois de 5 tentativas seguidas sem sucesso; senhas guardadas só em forma irreversível; duração do bloqueio em `Q-SL-17` | Teste de entrada errada repetida | Planejamento da equipe (RNF-01); `RN-SL-052` |
| `RNF-SL-11` | Cada perfil faz só o que pode, e a regra vale no servidor | Segurança | Ação fora do perfil recusada mesmo chamada diretamente; terceirizada vê só o que foi despachado para ela | Teste por perfil da matriz de permissões | Planejamento da equipe (RBAC); `RN-SL-051`, `RN-SL-053` |
| `RNF-SL-12` | As integrações só aceitam quem deve chamar | Segurança | Chave própria por terceirizada; o agente chama a abertura de chamado com chave fixa; limite de chamadas por minuto em toda integração | Teste com chave errada e com excesso de chamadas | Plano do agente (chave e limite de chamadas); meta proposta |
| `RNF-SL-13` | Os dados pessoais do destinatário seguem a LGPD | Privacidade | O agente de IA não recebe nome, telefone nem endereço; fotos e dados acessados por perfil; prazo de guarda das fotos em `Q-SL-16` | Revisão do que o agente recebe e da política de guarda | Lei 13.709/2018; Planejamento da equipe (cuidado com dados sensíveis); `RN-SL-038` |
| `RNF-SL-14` | Toda alteração deixa rastro | Rastreabilidade | Autor, data, hora e valor anterior em toda alteração; hora do fato e hora de chegada de todo retorno; histórico que ninguém edita | Conferência do histórico depois de correções | `RN-SL-020`, `RN-SL-035` |

### 2.5 Compatibilidade e integridade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-15` | Um padrão único serve às terceirizadas de hoje e às de amanhã | Interoperabilidade | Uma nova terceirizada entra só com cadastro e credencial, sem mudança no sistema; o padrão da integração é publicado | Simulação de uma terceira terceirizada no ambiente de testes | Encontro 1 [27:54]; `RN-SL-019` |
| `RNF-SL-16` | A planilha exportada abre sem ajuste | Interoperabilidade | Abre no Excel e no Google Planilhas com acentos e datas corretos e as mesmas colunas da tela | Exportação conferida pela equipe | `RN-SL-050` |
| `RNF-SL-17` | O dado não sai do ciclo previsto | Integridade | Mudança de status fora do ciclo recusada, venha de quem vier; fechamento fechado imutável | Testes automáticos do ciclo de status | `RN-SL-021`, `RN-SL-049` |

### 2.6 Custo e manutenção

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-18` | O custo cabe numa empresa pequena em expansão | Custo | Custo mensal dos serviços de mensagem, automação e IA entre R$ 360 e R$ 820 no patamar inicial, mais R$ 315 a R$ 450 de servidor, banco e painel (total de R$ 675 a R$ 1.270, cerca de R$ 0,06 a R$ 0,12 por entrega); revisão mensal contra o volume | Fatura mensal dividida pelas entregas do mês | Encontro 1 [29:03], [30:33]; Plano do agente; ver `infraestrutura-e-custos` |
| `RNF-SL-19` | Uma equipe pequena consegue manter | Manutenibilidade | Um back end só, por APIs, servindo WhatsApp, painel, portal e agente; publicação automática | Revisão da arquitetura | Planejamento da equipe (arquitetura baseada em APIs); meta proposta |
| `RNF-SL-20` | Falhas aparecem antes de a loja reclamar | Observabilidade | Aviso que falhou e entrega sem retorno vão para o painel; erros das integrações registrados | Conferência do painel durante o piloto | `RN-SL-034`, `RN-SL-045` |
