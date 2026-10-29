# SEALog — Modelo de dados

Modelo lógico proposto: quatorze entidades e os domínios fechados que elas usam. Não há banco
legado — hoje os dados estão em planilhas cujas colunas a origem não descreve —, e por isso as
entidades saem das histórias e das telas, não de um DDL. Tipos são lógicos (texto, inteiro, data);
o banco e a stack não estão definidos (`Q-SL-01`).

A entidade central é a **Entrega**: o registro único que o resumo dos gargalos diz faltar
(Gargalos §8). Um pedido é uma entrega (`RN-SL-012`); tudo o mais — volumes, histórico,
comprovante, ocorrências, avisos — pendura nela.

---

## 1. Catálogo de entidades

| ID | Entidade | Natureza | Observação |
|---|---|---|---|
| `ENT-SL-001` | Cliente | Cadastro | Quem contrata a entrega; identificado pelo telefone de WhatsApp |
| `ENT-SL-002` | Entrega | Movimento | O pedido; uma por pedido |
| `ENT-SL-003` | Volume | Movimento | Um por pacote da entrega; tem etiqueta própria |
| `ENT-SL-004` | Evento da entrega | Histórico | Toda mudança de status e de dado, com autor e hora |
| `ENT-SL-005` | Comprovante | Movimento | Foto e recebedor da entrega concluída |
| `ENT-SL-006` | Ocorrência | Movimento | Entrega não realizada, com motivo e decisão |
| `ENT-SL-007` | Coleta | Movimento | Coleta agendada na casa do cliente |
| `ENT-SL-008` | Rota | Movimento | Rota de um motorista num dia |
| `ENT-SL-009` | Parada | Movimento | Entrega dentro de uma rota, com a ordem |
| `ENT-SL-010` | Usuário | Cadastro | Pessoa da equipe, com o perfil |
| `ENT-SL-011` | Aviso | Histórico | Mensagem enviada ao cliente |
| `ENT-SL-012` | Importação | Histórico | Planilha importada e o resultado |
| `ENT-SL-013` | Fechamento | Movimento | Cobrança de um cliente num período |
| `ENT-SL-014` | Item do fechamento | Movimento | Entrega cobrada ou ajuste |

## 2. Dicionário de dados

### `ENT-SL-001` — Cliente

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | Identificador |
| `nome` | texto (120) | Sim | Nome da pessoa ou do estabelecimento |
| `telefone_whatsapp` | texto (11) | Sim | Para onde vão os avisos; único |
| `token_pedido` | texto | Sim | Chave do link de pedido do cliente (`TL-SL-003`) |
| `ativo` | booleano | Sim | Cliente inativo não recebe pedido novo |
| `criado_em` | data e hora | Sim | — |

### `ENT-SL-002` — Entrega

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | Identificador |
| `codigo` | texto (20) | Sim | Código da entrega, gerado no registro; único; vai na etiqueta |
| `cliente_id` | inteiro | Sim | Liga a `ENT-SL-001` |
| `canal_origem` | texto | Sim | Domínio §3.2 |
| `status` | texto | Sim | Domínio §3.1 |
| `nome_destinatario` | texto (120) | Para confirmar | — |
| `telefone_destinatario` | texto (11) | Para confirmar | Só dígitos, com DDD |
| `rua` | texto (150) | Para confirmar | — |
| `numero` | texto (10) | Para confirmar, salvo `sem_numero` | — |
| `sem_numero` | booleano | Sim | Torna `ponto_referencia` obrigatório |
| `complemento` | texto (80) | Não | — |
| `bairro` | texto (80) | Para confirmar | Agrupa as rotas |
| `cidade` | texto (80) | Para confirmar | — |
| `ponto_referencia` | texto (150) | Com `sem_numero` | — |
| `data_desejada` | data | Para confirmar | Pedida pelo cliente |
| `data_prevista` | data | Ao confirmar | Data de entrega planejada; base do atraso (`RN-SL-042`) |
| `qtd_volumes` | inteiro | Sim | 1 ou mais |
| `observacoes` | texto (500) | Não | Vão ao motorista |
| `campos_pendentes` | lista de texto | Não | O que falta, enquanto "Pendente de dados" |
| `forma_chegada` | texto | Ao confirmar | Coleta ou Cliente leva |
| `token_rastreio` | texto | Sim | Chave do link de rastreio; impossível de adivinhar |
| `criado_por` | inteiro | Não | Usuário; vazio quando veio pelo link do cliente |
| `criado_em` | data e hora | Sim | — |
| `confirmado_em` | data e hora | Não | — |
| `atualizado_em` | data e hora | Sim | Hora do último registro (`RN-SL-035`) |

"Para confirmar" quer dizer: pode estar vazio enquanto a entrega está "Pendente de dados", e é
obrigatório para sair desse status (`RN-SL-003`).

### `ENT-SL-003` — Volume

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | Liga a `ENT-SL-002` |
| `numero` | inteiro | Sim | 1 a `qtd_volumes` |
| `etiqueta_impressa_em` | data e hora | Não | Última impressão |
| `recebido_galpao_em` | data e hora | Não | — |
| `recebido_por` | inteiro | Não | Usuário |

### `ENT-SL-004` — Evento da entrega

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | — |
| `tipo` | texto | Sim | Status, Alteração de dado, Impressão, Remanejamento, Recebimento |
| `status_anterior` / `status_novo` | texto | Em mudança de status | Domínio §3.1 |
| `campo` / `valor_anterior` / `valor_novo` | texto | Em alteração de dado | — |
| `motivo` | texto (200) | Em remanejamento e cancelamento | — |
| `autor_id` | inteiro | Não | Usuário; vazio quando foi o cliente pelo link |
| `ocorrido_em` | data e hora | Sim | Hora do fato — a do celular, no registro sem sinal (`RN-SL-030`) |
| `registrado_em` | data e hora | Sim | Hora em que chegou ao sistema |

Nenhum evento é alterado nem apagado.

### `ENT-SL-005` — Comprovante

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | Um por entrega concluída |
| `foto` | imagem | Sim | Tirada pelo aplicativo |
| `recebedor_e_destinatario` | booleano | Sim | — |
| `recebedor_nome` | texto (120) | Quando não é o destinatário | — |
| `motorista_id` | inteiro | Sim | — |
| `ocorrido_em` | data e hora | Sim | — |

### `ENT-SL-006` — Ocorrência

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | Uma entrega pode ter várias, uma por tentativa |
| `motivo` | texto | Sim | Domínio §3.3 |
| `observacao` | texto (300) | Com motivo "Outro" | — |
| `foto` | imagem | Não | — |
| `motorista_id` | inteiro | Sim | — |
| `ocorrido_em` | data e hora | Sim | — |
| `situacao` | texto | Sim | Aberta ou Decidida |
| `decisao` | texto | Ao decidir | Domínio §3.4 |
| `data_nova_tentativa` | data | Em nova tentativa | — |
| `decisao_motivo` | texto (200) | Ao decidir | — |
| `decidido_por` / `decidido_em` | inteiro / data e hora | Ao decidir | — |

### `ENT-SL-007` — Coleta

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | — |
| `data` | data | Sim | — |
| `horario` | hora | Sim | Entre 14:00 e 18:00 (`RN-SL-016`) |
| `situacao` | texto | Sim | Agendada ou Realizada |

### `ENT-SL-008` — Rota

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `data` | data | Sim | — |
| `motorista_id` | inteiro | Sim | Uma rota por motorista por dia |
| `situacao` | texto | Sim | Rascunho, Publicada, Concluída |
| `publicada_em` / `publicada_por` | data e hora / inteiro | Ao publicar | — |

### `ENT-SL-009` — Parada

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `rota_id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | Em no máximo uma rota aberta (`RN-SL-019`) |
| `ordem_planejada` | inteiro | Sim | — |
| `ordem_realizada` | inteiro | Não | Ordem em que o motorista registrou |
| `situacao` | texto | Sim | Pendente, Entregue, Não entregue, Retirada |

### `ENT-SL-010` — Usuário

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `nome` | texto (120) | Sim | — |
| `usuario` | texto (60) | Sim | Único |
| `senha_hash` | texto | Sim | Nunca a senha em claro |
| `perfil` | texto | Sim | Domínio §3.5 |
| `telefone` | texto (11) | Não | — |
| `ativo` | booleano | Sim | — |

### `ENT-SL-011` — Aviso

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `cliente_id` | inteiro | Sim | — |
| `entregas` | lista de inteiros | Sim | Uma no aviso comum; várias no aviso em lote |
| `tipo` | texto | Sim | Domínio §3.6 |
| `texto` | texto | Sim | Como foi enviado |
| `canal` | texto | Sim | WhatsApp |
| `enviado_em` | data e hora | Sim | — |
| `resultado` | texto | Sim | Enviado ou Falhou |
| `enviado_por` | inteiro | Não | Vazio quando automático |

### `ENT-SL-012` — Importação

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `cliente_id` | inteiro | Sim | — |
| `arquivo_nome` | texto | Sim | — |
| `importado_por` / `importado_em` | inteiro / data e hora | Sim | — |
| `linhas_total` / `linhas_confirmadas` / `linhas_pendentes` | inteiro | Sim | — |

### `ENT-SL-013` — Fechamento

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `cliente_id` | inteiro | Sim | — |
| `periodo_inicio` / `periodo_fim` | data | Sim | — |
| `situacao` | texto | Sim | Domínio §3.7 |
| `total` | decimal (10,2) | Sim | Soma dos itens |
| `gerado_por` / `fechado_por` / `fechado_em` | inteiro / inteiro / data e hora | Conforme a situação | — |

### `ENT-SL-014` — Item do fechamento

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `fechamento_id` | inteiro | Sim | — |
| `tipo` | texto | Sim | Entrega ou Ajuste |
| `entrega_id` | inteiro | Em tipo Entrega | Cada entrega entra em um só fechamento |
| `valor` | decimal (10,2) | Sim | Pela tabela de preços (`Q-SL-09`) |
| `motivo_ajuste` | texto (200) | Em tipo Ajuste | — |

## 3. Domínios

### 3.1 Status da entrega

| Valor | Quando | Próximos |
|---|---|---|
| Pendente de dados | Registrada sem algum dado obrigatório | Pedido confirmado, Cancelada |
| Pedido confirmado | Todos os dados obrigatórios; código e rastreio enviados | Coleta agendada, No galpão, Cancelada |
| Coleta agendada | Coleta marcada entre 14h e 18h | No galpão, Cancelada |
| No galpão | Todos os volumes recebidos | Em rota, Cancelada |
| Em rota | Rota publicada com a entrega | Entregue, Não entregue, No galpão (retirada da rota) |
| Entregue | Parada registrada com comprovante | — (final) |
| Não entregue | Parada registrada com ocorrência | No galpão (nova tentativa ou guarda), Em devolução, Cancelada |
| Em devolução | Decisão de devolver ao cliente | Devolvida ao cliente |
| Devolvida ao cliente | Pacote devolvido | — (final) |
| Cancelada | A pedido do cliente | — (final) |

O ciclo está desenhado em `FLX-SL-01`. "Status final" (`RN-SL-045`) é Entregue, Devolvida ao
cliente ou Cancelada.

### 3.2 Canal de origem

| Valor | Origem |
|---|---|
| WhatsApp | Gargalos §1, §9 |
| Instagram | Gargalos §9 |
| Link | Proposta (`RN-SL-004`) |
| Planilha | Gargalos §1 |
| Presencial | Proposta — cliente que leva o pacote ao galpão sem pedido prévio |

### 3.3 Motivo de não entrega

| Valor | Observação |
|---|---|
| Destinatário ausente | — |
| Endereço não encontrado | — |
| Endereço incompleto | Liga ao gargalo de pedido incompleto (Gargalos §1) |
| Recusado pelo destinatário | — |
| Acesso impedido | Portaria, condomínio, rua fechada |
| Pacote avariado | — |
| Condição climática | Caso "Segunda-feira de chuva" (Gargalos §7) |
| Outro | Exige observação |

A lista é proposta; os motivos reais da operação estão para confirmação (`Q-SL-11`).

### 3.4 Decisão de exceção

| Valor | Efeito |
|---|---|
| Nova tentativa | Volta a No galpão, com nova data prevista |
| Devolver ao cliente | Em devolução |
| Guardar aguardando instrução | Fica No galpão, sem data, até a instrução |
| Cancelar a pedido do cliente | Cancelada |

### 3.5 Perfil

Atendente, Analista, Coordenador, Motorista, Financeiro (`RN-SL-049`; `Q-SL-10`).

### 3.6 Tipo de aviso

| Valor | Quando |
|---|---|
| Confirmação | Pedido confirmado, com o link de rastreio |
| Link de pedido | Envio do link de `TL-SL-003` |
| Link de complemento | Pedido pendente |
| Ocorrência | Automático, ao registrar a ocorrência |
| Decisão | Automático, ao decidir a ocorrência |
| Lote | Pela consulta de afetados |
| Reenvio de rastreio | Pela atendente |

### 3.7 Situação do fechamento

Rascunho, Em conferência, Fechado (`RN-SL-046`).

**Referências** — Gargalos §1 a §9; `RN-SL-001` a `RN-SL-051`.
