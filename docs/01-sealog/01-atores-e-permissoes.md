# SEALog — Atores e permissões

Seis atores: o cliente, que não entra no sistema e usa só links, e cinco perfis da equipe da
SEALog. Os papéis vêm de quem aparece na operação descrita pela origem (Gargalos §1 a §6); o que
cada perfil pode fazer no sistema é proposta desta documentação, e a lista de perfis está para
confirmação (`Q-SL-10`).

---

## 1. Atores

### 1.1 Cliente

| | |
|---|---|
| **Descrição** | Quem contrata a entrega: na maioria clientes pequenos, que pedem por WhatsApp e Instagram; alguns mandam planilhas próprias. Os exemplos da origem são o Sr. Paulo e o Cond. MarAzul |
| **Como é identificado** | Pelo telefone de WhatsApp cadastrado. Não tem login (`RN-SL-050`) |
| **Pode fazer** | Fazer o pedido pelo link, completar dados pendentes pelo link, acompanhar a entrega pelo link de rastreio, receber avisos |
| **Não pode fazer** | Ver entregas de outros clientes, alterar o pedido depois de confirmado, ver a rota ou o telefone do motorista |
| **Origem** | Gargalos §1, §4, §9 |

### 1.2 Atendente

| | |
|---|---|
| **Descrição** | Recebe os pedidos pelos canais e responde aos clientes. Trabalha em horário limitado: sábado só até 12h |
| **Como é identificado** | Login, perfil Atendente |
| **Pode fazer** | Registrar pedidos, importar planilhas de clientes, resolver pendências, consultar qualquer entrega, enviar aviso em lote |
| **Não pode fazer** | Montar ou publicar rotas, decidir exceções, fechar cobrança |
| **Origem** | Gargalos §1, §4, §9 |

### 1.3 Analista

| | |
|---|---|
| **Descrição** | Hoje copia o grupo de WhatsApp para a planilha e é um dos saltos da consulta de status. No sistema, mantém a lista de entregas e cuida do galpão |
| **Como é identificado** | Login, perfil Analista |
| **Pode fazer** | Tudo o que o atendente faz; corrigir dados da entrega; imprimir etiquetas; agendar coletas e registrar recebimento no galpão; acompanhar o andamento das rotas |
| **Não pode fazer** | Publicar rotas, decidir exceções, fechar cobrança |
| **Origem** | Gargalos §2, §4 |

### 1.4 Coordenador de operação

| | |
|---|---|
| **Descrição** | Monta as rotas e decide o que fazer com o que não foi entregue. A operação vai das 7h às 19h |
| **Como é identificado** | Login, perfil Coordenador |
| **Pode fazer** | Tudo o que o analista faz; montar, publicar e alterar rotas; remanejar entregas; decidir exceções; cadastrar usuários da equipe |
| **Não pode fazer** | Fechar cobrança |
| **Origem** | Gargalos §2, §5, §9 |

### 1.5 Motorista

| | |
|---|---|
| **Descrição** | Cerca de 18. Dirige boa parte do tempo e às vezes fica sem sinal |
| **Como é identificado** | Login no celular, perfil Motorista |
| **Pode fazer** | Ver as próprias rotas do dia; registrar cada parada, o comprovante e as ocorrências |
| **Não pode fazer** | Ver rotas de outros motoristas, alterar dados da entrega, decidir exceções |
| **Origem** | Gargalos §2, §3 |

### 1.6 Financeiro

| | |
|---|---|
| **Descrição** | Calcula a cobrança dos clientes, hoje sobre planilhas manuais |
| **Como é identificado** | Login, perfil Financeiro |
| **Pode fazer** | Consultar entregas; gerar, conferir e fechar o fechamento de cobrança; exportar |
| **Não pode fazer** | Registrar pedidos, alterar entregas, rotas ou exceções |
| **Origem** | Gargalos §6 |

## 2. Matriz de permissões

| Funcionalidade | Cliente | Atendente | Analista | Coordenador | Motorista | Financeiro | HUs |
|---|---|---|---|---|---|---|---|
| Registrar pedido | — | Sim | Sim | Sim | — | — | `HU-SL-001` |
| Fazer o pedido pelo link | Sim | — | — | — | — | — | `HU-SL-002` |
| Importar planilha de cliente | — | Sim | Sim | Sim | — | — | `HU-SL-003` |
| Resolver pendência de dados | Sim, pelo link | Sim | Sim | Sim | — | — | `HU-SL-004` |
| Consultar a lista de entregas | — | Sim | Sim | Sim | — | Sim | `HU-SL-005`, `HU-SL-017` |
| Corrigir dados da entrega | — | Só antes de confirmada | Sim | Sim | — | — | `HU-SL-005` |
| Imprimir etiqueta | — | — | Sim | Sim | — | — | `HU-SL-006` |
| Agendar coleta e registrar recebimento no galpão | — | — | Sim | Sim | — | — | `HU-SL-007` |
| Montar e publicar rotas | — | — | — | Sim | — | — | `HU-SL-008`, `HU-SL-009` |
| Acompanhar o andamento das rotas | — | — | Sim | Sim | — | — | `HU-SL-010` |
| Ver o próprio roteiro e registrar paradas | — | — | — | — | Sim | — | `HU-SL-011` a `HU-SL-015` |
| Acompanhar a entrega pelo rastreio | Sim | — | — | — | — | — | `HU-SL-016` |
| Ver o painel de exceções | — | Sim, só leitura | Sim, só leitura | Sim | — | — | `HU-SL-018` |
| Decidir o destino da entrega não realizada | — | — | — | Sim | — | — | `HU-SL-019` |
| Enviar aviso em lote | — | Sim | Sim | Sim | — | — | `HU-SL-020` |
| Consultar afetados por cliente | — | Sim | Sim | Sim | — | Sim | `HU-SL-021` |
| Fechar a cobrança | — | — | — | — | — | Sim | `HU-SL-022` |
| Exportar para planilha | — | Sim | Sim | Sim | — | Sim | `HU-SL-023` |
| Cadastrar usuários da equipe | — | — | — | Sim | — | — | `HU-SL-024` |

## 3. Autenticação

A equipe entra com usuário e senha, e o perfil define o menu e as ações (`RN-SL-049`, `RN-SL-051`).
O motorista entra pelo celular e continua conectado durante o dia, para não digitar senha entre
uma parada e outra. O cliente não entra: o link do pedido e o link de rastreio identificam a
entrega a que dão acesso (`RN-SL-050`).

> **Pergunta `Q-SL-10`:** confirmar os perfis e quem cadastra os usuários da equipe. A origem
> nomeia atendente, analista, coordenador, motoristas e o financeiro, mas não diz se uma mesma
> pessoa acumula papéis nem quem administra o acesso.

**Referências** — Gargalos §1 a §6, §9.
