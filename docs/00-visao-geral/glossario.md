# Glossário

Termos da operação da SEALog e desta documentação, com o sentido em que são usados aqui.

---

## 1. Termos da operação

| Termo | Significado |
|---|---|
| Loja | Cliente da SEALog: loja de bairro, farmácia, floricultura, papelaria, pequeno e-commerce. Pede as entregas |
| Destinatário | O consumidor que recebe o pacote. Fala com a loja, não com a SEALog |
| Terceirizada | Empresa que coleta na loja e entrega numa região. Hoje são duas |
| Pedido | O que a loja pede: levar um ou mais volumes a um destinatário. No sistema, um pedido é uma entrega |
| Entrega | O registro único de um pedido, do recebimento ao status final. É a "fonte única da verdade" que falta hoje |
| Código SEALog | Identificador gerado no registro. Identifica o pacote, sem etiqueta, e vai em todo retorno da terceirizada |
| Número confirmado | Número de WhatsApp cujo primeiro pedido a equipe aprovou; os pedidos seguintes dele seguem direto. A loja não tem cadastro |
| A confirmar | Pedido completo de um número novo, que espera a equipe aprovar antes de seguir para a terceirizada |
| Menu | As duas opções que a loja vê no WhatsApp: novo pedido e editar ou cancelar pedido |
| Formulário do WhatsApp | Tela dentro da conversa que não envia o pedido sem os dados obrigatórios |
| Pendente de dados | Pedido registrado pela equipe sem algum dado obrigatório; a loja completa pelo WhatsApp |
| Regiões | Pares de bairro e cidade que cada terceirizada atende, no cadastro dela |
| Aguardando região | Pedido para um bairro que nenhuma terceirizada atende; o coordenador escolhe a terceirizada |
| Despacho | Envio do pedido à terceirizada da região, pela API ou pelo portal |
| Retorno | O que a terceirizada informa: coleta, saída, entrega, não entrega ou devolução, com data e hora |
| API padrão | O caminho de integração que o SEALog publica, igual para toda terceirizada |
| Portal | Tela simples para a terceirizada que não se integra ver as entregas e informar o retorno |
| Comprovante padrão | Foto da entrega, data e hora, nome de quem recebeu e identificação do entregador. Sem ele, o Entregue não vale |
| Pessoa autorizada | Vizinho, porteiro ou outra pessoa que a loja autorizou a receber no lugar do destinatário |
| Chamado | Ocorrência registrada no painel, com a sugestão do agente, até a equipe decidir |
| Agente de ocorrências | Assistente de IA que conversa com a loja sobre o problema e sugere a ação, sem decidir |
| Protocolo de atendimento | O que a SEALog faz em cada tipo de ocorrência; base da sugestão do agente |
| Galpão | Onde volta o pacote não entregue; ali o coordenador decide o destino |
| Destino | Nova tentativa, devolver à loja, guardar aguardando instrução ou cancelar |
| Aviso proativo | Mensagem à loja enviada pelo sistema, sem que ela pergunte |
| Aviso em lote | Uma mensagem por loja com todas as entregas dela afetadas |
| Afetados | Entregas atrasadas ou com chamado num período, agrupadas por loja |
| Atrasada | Entrega não concluída até o fim da data prevista |
| Data prevista | Dia útil seguinte ao pedido, ou a data agendada pela loja |
| Fechamento | Cobrança de uma loja, ou pagamento de uma terceirizada, num período |
| Ajuste | Correção lançada num fechamento seguinte por erro descoberto depois de fechado |
| Cadeia de 5 saltos | Hoje, o caminho da pergunta "cadê minha entrega?": loja, atendente, analista, motorista e volta |

## 2. Os quatro casos do enunciado

| Caso | Em uma linha |
|---|---|
| Pedido com informações incompletas | Pedidos sem número, rua ou telefone; nada valida na entrada |
| O buquê de sábado | Aviso de que o endereço não foi achado ficou no grupo por mais de uma hora; a floricultura soube pela consumidora |
| O registro incorreto | "Ok" na linha errada; um dia para achar a foto; pacote no apartamento errado |
| A segunda-feira de chuva | Cerca de 40 entregas atrasadas, mais de 120 mensagens, sem saber que clientes avisar |

## 3. Termos desta documentação

| Termo | Significado |
|---|---|
| Enunciado §N | Seção N do `Projeto da Dinâmica.pdf` |
| Encontro 1 [mm:ss] | Minuto da transcrição da reunião com o cliente de 28/10/2026 |
| Gargalos §N | Seção N do resumo `SEALog gargalos e problemas da operação.pdf`; a numeração está em `docs/01-sealog/00-visao-geral.md` §9 |
| Planejamento da equipe | Papéis, decisões e a lista RF-01 a RF-20 da Equipe 11 |
| Plano do agente | O plano do agente de ocorrências, com custos, de 29/10/2026 |
| Origem legada | Campo de rastreio da HU. No SEALog descreve como a operação faz aquilo hoje, já que não há sistema legado |
| Proposta | Regra que esta documentação propõe para resolver um gargalo, em oposição a fato da origem |
| `SL` | Sigla do sistema SEALog nos identificadores (`HU-SL-001`, `RN-SL-001`) |

## 4. Siglas

| Sigla | Significado |
|---|---|
| SEAL | Liga Acadêmica de Engenharia de Software do CIn-UFPE, que promove o desafio |
| SEALog | A empresa de entregas do caso, e o sistema proposto para ela |
| HU | História de usuário |
| RN | Regra de negócio |
| CA | Critério de aceitação |
| RF / RNF | Requisito funcional / não funcional |
| DEC | Decisão |
| BL | Item do backlog |
| FLX | Fluxograma |
| TL | Tela |
| ENT | Entidade de dados |
| INT | Integração externa |
| MSG | Mensagem do sistema |
| DIV | Divergência ou risco |
| Q | Pergunta ao cliente |
| IA | Inteligência artificial |
| LGPD | Lei Geral de Proteção de Dados (Lei 13.709/2018) |
