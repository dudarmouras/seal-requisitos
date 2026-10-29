# SEALog — Requisitos funcionais e não funcionais

A visão de produto dos requisitos do SEALog, em duas listas:

- **Funcionais** (`RF-SL-NN`) — o que o sistema faz. Cada um resume uma capacidade e aponta as
  histórias de usuário que a detalham, com critérios de aceitação, e as regras do catálogo que a
  governam. A história é o requisito em detalhe; esta lista é o mapa.
- **Não funcionais** (`RNF-SL-NN`) — como o sistema precisa se comportar: uso, disponibilidade,
  desempenho, segurança, privacidade, custo. Agrupados pelas características de qualidade da norma
  ISO/IEC 25010, cada um com uma meta que se possa verificar.

Onde a meta é um número que a origem não traz, ela é **proposta** da equipe, marcada assim na
coluna `Origem`, e vale até a SEALog confirmar.

---

## 1. Requisitos funcionais

### 1.1 Entrada de pedidos

| ID | Requisito | Módulo | HUs | Regras |
|---|---|---|---|---|
| `RF-SL-01` | Registrar o pedido recebido por mensagem, áudio ou planilha, validando os dados obrigatórios e o canal de origem | Entrada de pedidos | `HU-SL-001` | `RN-SL-001`, `RN-SL-002`, `RN-SL-005`, `RN-SL-006`, `RN-SL-007` |
| `RF-SL-02` | Permitir que o próprio cliente faça o pedido por um link aberto no celular, sem conta, com as mesmas validações | Entrada de pedidos | `HU-SL-002` | `RN-SL-004`, `RN-SL-050` |
| `RF-SL-03` | Importar a planilha do cliente no modelo do SEALog, mostrando linha a linha o que foi confirmado e o que ficou pendente | Entrada de pedidos | `HU-SL-003` | `RN-SL-008` |
| `RF-SL-04` | Manter a fila de pedidos pendentes de dados, com o que falta e há quanto tempo, e reenviar ao cliente o link de complemento | Entrada de pedidos | `HU-SL-004` | `RN-SL-003`, `RN-SL-009` |
| `RF-SL-05` | Avisar, sem bloquear, quando já existe pedido do mesmo cliente para o mesmo destinatário, endereço e data | Entrada de pedidos | `HU-SL-001` | `RN-SL-011` |
| `RF-SL-06` | Não levar ao planejamento do dia o pedido confirmado depois do horário de corte | Entrada de pedidos | `HU-SL-001` | `RN-SL-010` |

### 1.2 Registro e planejamento

| ID | Requisito | Módulo | HUs | Regras |
|---|---|---|---|---|
| `RF-SL-07` | Manter uma lista única de entregas, filtrável como planilha, com o histórico de cada alteração | Registro e planejamento | `HU-SL-005` | `RN-SL-013`, `RN-SL-014` |
| `RF-SL-08` | Imprimir uma etiqueta por volume, com o código da entrega em texto e em código lido pela câmera | Registro e planejamento | `HU-SL-006` | `RN-SL-012`, `RN-SL-015` |
| `RF-SL-09` | Agendar a coleta na janela permitida e registrar a chegada de cada volume ao galpão pela leitura da etiqueta | Registro e planejamento | `HU-SL-007` | `RN-SL-016`, `RN-SL-017` |
| `RF-SL-10` | Montar as rotas do dia escolhendo motorista, entregas e ordem, com as entregas prontas agrupadas por bairro | Registro e planejamento | `HU-SL-008` | `RN-SL-018`, `RN-SL-019`, `RN-SL-021`, `RN-SL-023` |
| `RF-SL-11` | Publicar o roteiro no celular de cada motorista de uma vez e enviar o roteiro atualizado quando a rota mudar | Registro e planejamento | `HU-SL-009` | `RN-SL-020`, `RN-SL-024` |
| `RF-SL-12` | Mostrar o andamento de cada rota e sinalizar a rota sem registro há mais tempo que o limite | Registro e planejamento | `HU-SL-010` | `RN-SL-022` |

### 1.3 Execução do motorista

| ID | Requisito | Módulo | HUs | Regras |
|---|---|---|---|---|
| `RF-SL-13` | Mostrar ao motorista só as próprias rotas do dia, com tudo o que cada parada precisa | Execução do motorista | `HU-SL-011` | `RN-SL-025` |
| `RF-SL-14` | Registrar cada parada como Entregue ou Não entregue no momento do fato, abrindo-a pela leitura da etiqueta | Execução do motorista | `HU-SL-012` | `RN-SL-026`, `RN-SL-027`, `RN-SL-031` |
| `RF-SL-15` | Exigir, na entrega, a foto tirada pelo aplicativo e o nome de quem recebeu | Execução do motorista | `HU-SL-013` | `RN-SL-028` |
| `RF-SL-16` | Exigir, na não entrega, um motivo da lista e abrir a ocorrência | Execução do motorista | `HU-SL-014` | `RN-SL-029` |
| `RF-SL-17` | Guardar no celular o registro feito sem sinal e enviá-lo sozinho, com a hora real, quando a conexão voltar | Execução do motorista | `HU-SL-015` | `RN-SL-030` |

### 1.4 Consulta de status

| ID | Requisito | Módulo | HUs | Regras |
|---|---|---|---|---|
| `RF-SL-18` | Dar a cada entrega um link de rastreio com status, histórico, data prevista e, depois, o comprovante | Consulta de status | `HU-SL-016` | `RN-SL-032`, `RN-SL-033` |
| `RF-SL-19` | Localizar uma entrega por código, cliente, destinatário, telefone ou bairro, com a hora do último registro | Consulta de status | `HU-SL-017` | `RN-SL-034`, `RN-SL-035` |

### 1.5 Exceções e decisões

| ID | Requisito | Módulo | HUs | Regras |
|---|---|---|---|---|
| `RF-SL-20` | Manter o painel de exceções com toda ocorrência aberta e todo aviso que falhou, destacando o que passou do fim da operação | Exceções e decisões | `HU-SL-018` | `RN-SL-036`, `RN-SL-038`, `RN-SL-043` |
| `RF-SL-21` | Registrar a decisão sobre a entrega não realizada, entre os quatro destinos, e a volta do pacote ao galpão | Exceções e decisões | `HU-SL-019` | `RN-SL-037`, `RN-SL-039` |
| `RF-SL-22` | Avisar o cliente por WhatsApp, sem atendente, na ocorrência e na decisão, e guardar o resultado de cada envio | Exceções e decisões | `HU-SL-020` | `RN-SL-040`, `RN-SL-043` |
| `RF-SL-23` | Listar as entregas atrasadas ou com ocorrência num período, agrupadas por cliente, e avisar todos de uma vez | Exceções e decisões | `HU-SL-021`, `HU-SL-020` | `RN-SL-041`, `RN-SL-042` |

### 1.6 Financeiro

| ID | Requisito | Módulo | HUs | Regras |
|---|---|---|---|---|
| `RF-SL-24` | Calcular o fechamento de cobrança por cliente e período a partir das entregas registradas, com conferência e ajustes | Financeiro | `HU-SL-022` | `RN-SL-044`, `RN-SL-045`, `RN-SL-046`, `RN-SL-047` |
| `RF-SL-25` | Exportar a lista de entregas, a consulta de afetados e o fechamento para `.xlsx` e `.csv` | Financeiro | `HU-SL-023` | `RN-SL-048` |

### 1.7 Acesso

| ID | Requisito | Módulo | HUs | Regras |
|---|---|---|---|---|
| `RF-SL-26` | Dar entrada à equipe com usuário e senha, num dos cinco perfis, e mostrar a cada perfil só o que ele pode fazer | Acesso | `HU-SL-024` | `RN-SL-049`, `RN-SL-051` |

## 2. Requisitos não funcionais

### 2.1 Usabilidade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-01` | O cliente faz o pedido no navegador do celular, sem instalar nada e sem criar conta | Usabilidade | Pedido completo em até 3 minutos por quem nunca usou | Teste com cinco clientes reais durante o piloto | Gargalos §9; `RN-SL-004`; meta proposta |
| `RNF-SL-02` | O motorista registra a parada sem digitar | Usabilidade | Entrega registrada em até 3 toques mais a foto, com uma mão | Cronometragem na rota do piloto | Gargalos §3; `RN-SL-031`; meta proposta |
| `RNF-SL-18` | A equipe trabalha num ambiente que lembra a planilha que já conhece | Usabilidade | Lista com filtro, ordenação e escolha de colunas; treino de até 1 hora por perfil | Avaliação com a equipe no fim da preparação | Gargalos §9; `HU-SL-005`; meta proposta |

### 2.2 Confiabilidade e disponibilidade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-03` | O registro feito sem sinal não se perde | Confiabilidade | Um dia inteiro de rota guardado no celular; nenhum registro perdido; envio automático em até 1 minuto depois que o sinal volta | Teste em modo avião numa rota completa | Gargalos §3; `RN-SL-030` |
| `RNF-SL-04` | Rastreio e avisos funcionam a qualquer hora | Disponibilidade | 99,5% no mês; manutenção só fora do horário da operação (7h às 19h) | Monitor externo do link de rastreio | Gargalos §9; `RN-SL-032`; meta proposta |
| `RNF-SL-17` | Os dados se recuperam de uma falha | Recuperabilidade | Perda máxima de 24 horas de dados e volta em até 4 horas; fotos com cópia | Restauração de teste antes da virada | Meta proposta |

### 2.3 Desempenho

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-05` | "Cadê minha entrega?" responde-se em segundos | Desempenho | Localizar e ver o status em menos de 1 minuto, contra 20 minutos a 2 horas hoje; busca em até 2 segundos | Medição no piloto e no painel de adoção | Gargalos §4; meta proposta |
| `RNF-SL-06` | O que o motorista registra aparece logo para a equipe e no rastreio | Desempenho | Em até 1 minuto, com sinal | Teste ponta a ponta | Gargalos §4; `RN-SL-035`; meta proposta |

### 2.4 Segurança e privacidade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-07` | O link do cliente dá acesso só à própria entrega | Segurança | Código do link impossível de adivinhar; nenhum dado de outra entrega nem telefone do motorista | Teste de troca de código no link | `RN-SL-033`, `RN-SL-050` |
| `RNF-SL-08` | Cada perfil faz só o que pode, e a regra vale no servidor | Segurança | Ação fora do perfil recusada mesmo chamada diretamente; senhas guardadas só em forma irreversível | Teste por perfil da matriz de permissões | `RN-SL-049`, `RN-SL-051` |
| `RNF-SL-09` | Toda alteração deixa rastro | Rastreabilidade | Autor, data, hora e valor anterior em toda alteração; histórico que ninguém edita | Conferência do histórico depois de correções | `RN-SL-013` |
| `RNF-SL-10` | Os dados pessoais do destinatário seguem a LGPD | Privacidade | Nome, telefone, endereço e foto usados só para a entrega; acesso por perfil; prazo de guarda definido com a SEALog | Revisão antes da abertura para clientes | Lei 13.709/2018; `DIV-SL-06`; prazo a definir com a SEALog |

### 2.5 Compatibilidade e integridade

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-11` | Roda nos aparelhos que a operação já tem | Compatibilidade | Celulares Android e iPhone dos últimos cinco anos, pelo navegador; impressora de etiqueta comum | Teste nos celulares dos motoristas do piloto | Gargalos §3; meta proposta |
| `RNF-SL-12` | A planilha exportada abre sem ajuste | Interoperabilidade | Abre no Excel e no Google Planilhas com acentos e datas corretos e as mesmas colunas da tela | Exportação conferida pela equipe | `RN-SL-048` |
| `RNF-SL-13` | O dado não sai do ciclo previsto | Integridade | Mudança de status fora do ciclo recusada; fechamento fechado imutável | Testes automáticos do ciclo de status | `RN-SL-014`, `RN-SL-046` |

### 2.6 Escala, custo e manutenção

| ID | Requisito | Categoria | Meta | Como verificar | Origem |
|---|---|---|---|---|---|
| `RNF-SL-14` | O sistema cresce com a operação sem ser refeito | Escalabilidade | Até 10 vezes o volume inicial só mudando o plano dos serviços | Indicadores e gatilhos da página de escalabilidade | `Q-SL-02`; meta proposta |
| `RNF-SL-15` | O custo cabe numa transportadora pequena | Custo | Custo mensal de infraestrutura proporcional ao volume, abaixo de R$ 0,25 por entrega no patamar inicial | Fatura mensal dividida pelas entregas do mês | Meta proposta; ver `infraestrutura-e-custos` |
| `RNF-SL-16` | Uma equipe pequena consegue manter | Manutenibilidade | Um código só para a tela da equipe, o aplicativo do motorista e as páginas públicas; publicação automática | Revisão da arquitetura | Meta proposta |
| `RNF-SL-19` | Falhas aparecem antes de o cliente reclamar | Observabilidade | Aviso que falhou vai para o painel de exceções; erros do aplicativo do motorista registrados | Conferência do painel durante o piloto | `RN-SL-043` |
