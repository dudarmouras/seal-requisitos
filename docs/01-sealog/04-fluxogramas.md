# SEALog — Fluxogramas

Seis pranchas: o ciclo de vida da entrega, que amarra o resto, e uma prancha por trecho da
operação — a entrada do pedido, do galpão à rota, a parada do motorista, a exceção e a consulta de
status. Descrevem o sistema proposto; o caminho de hoje está no campo **Origem legada** de cada
história.

A prancha é **mapa, não manual**: cada nó cabe em poucas palavras e o detalhe fica nas regras
`RN-SL-*`, nas mensagens `MSG-SL-*` e nas histórias `HU-SL-*`. Grade da casa: espinha em `c 2.6`,
recusa e falha em `c 0.6`, desvio em `c 4.8` e `c 6.8`, passo de `1.3` (`CONVENCOES.md` §6.1).

---

## FLX-SL-01 — Ciclo de vida da entrega

**Escopo:** do registro do pedido ao status final — entregue, devolvida ou cancelada —, com a
pendência de dados e a volta ao galpão depois de uma ocorrência. Os status estão em
`06-modelo-de-dados.md` §3.1. **HUs:** `HU-SL-001`, `HU-SL-004`, `HU-SL-007`, `HU-SL-009`, `HU-SL-012` a `HU-SL-014`, `HU-SL-019`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Pedido registrado", "c": 2.6, "r": 0, "hu": ["HU-SL-001"], "huSide": "right" },
    { "id": "completo", "type": "decision", "label": "Dados obrigatórios completos?", "c": 2.6, "r": 1.3 },
    { "id": "pendente", "label": "Pendente de dados", "c": 0.6, "r": 1.3, "hu": ["HU-SL-004"], "huSide": "left" },
    { "id": "confirmado", "label": "Pedido confirmado", "c": 2.6, "r": 2.6 },
    { "id": "chegada", "type": "decision", "label": "Como chega ao galpão?", "c": 2.6, "r": 3.9 },
    { "id": "coleta", "label": "Coleta agendada", "c": 4.8, "r": 3.9, "hu": ["HU-SL-007"], "huSide": "right" },
    { "id": "galpao", "label": "No galpão", "c": 2.6, "r": 5.2, "hu": ["HU-SL-007"], "huSide": "left" },
    { "id": "emRota", "label": "Em rota", "c": 2.6, "r": 6.5, "hu": ["HU-SL-009"], "huSide": "left" },
    { "id": "resultado", "type": "decision", "label": "Resultado da parada?", "c": 2.6, "r": 7.8, "hu": ["HU-SL-012"], "huSide": "left" },
    { "id": "entregue", "type": "dim", "label": "Entregue", "c": 2.6, "r": 9.1, "hu": ["HU-SL-013"], "huSide": "left" },
    { "id": "naoEntregue", "label": "Não entregue (ocorrência)", "c": 4.8, "r": 7.8, "hu": ["HU-SL-014"], "huSide": "right" },
    { "id": "decisao", "type": "decision", "label": "Decisão do coordenador?", "c": 4.8, "r": 9.1, "hu": ["HU-SL-019"], "huSide": "right" },
    { "id": "devolucao", "label": "Em devolução", "c": 4.8, "r": 10.4 },
    { "id": "devolvida", "type": "dim", "label": "Devolvida ao cliente", "c": 4.8, "r": 11.7 },
    { "id": "guardada", "label": "Guardada no galpão", "c": 6.8, "r": 9.1 },
    { "id": "cancelada", "type": "dim", "label": "Cancelada", "c": 6.8, "r": 10.4 }
  ],
  "edges": [
    { "from": "inicio", "to": "completo" },
    { "from": "completo", "to": "pendente", "label": "Não" },
    { "from": "completo", "to": "confirmado", "label": "Sim" },
    { "from": "pendente", "to": "confirmado", "label": "Dados completados", "fromSide": "bottom", "toSide": "left" },
    { "from": "confirmado", "to": "chegada" },
    { "from": "chegada", "to": "coleta", "label": "Coleta 14h–18h" },
    { "from": "chegada", "to": "galpao", "label": "Cliente leva até 17h" },
    { "from": "coleta", "to": "galpao", "fromSide": "bottom", "toSide": "right" },
    { "from": "galpao", "to": "emRota", "label": "Rota publicada" },
    { "from": "emRota", "to": "resultado" },
    { "from": "resultado", "to": "entregue", "label": "Entregue" },
    { "from": "resultado", "to": "naoEntregue", "label": "Não entregue" },
    { "from": "naoEntregue", "to": "decisao" },
    { "from": "decisao", "to": "galpao", "label": "Nova tentativa", "fromSide": "left", "toSide": "right" },
    { "from": "decisao", "to": "devolucao", "label": "Devolver" },
    { "from": "devolucao", "to": "devolvida" },
    { "from": "decisao", "to": "guardada", "label": "Guardar" },
    { "from": "decisao", "to": "cancelada", "label": "Cancelar", "fromSide": "bottom", "toSide": "left" },
    { "from": "guardada", "to": "cancelada", "label": "Instrução do cliente" }
  ]
}
```

---

## FLX-SL-02 — Entrada do pedido

**Escopo:** do pedido do cliente, por qualquer canal, ao pedido confirmado com o link de rastreio
enviado, com a pendência de dados e o aviso de repetição. **HUs:** `HU-SL-001` a `HU-SL-004`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Cliente pede", "c": 2.6, "r": 0 },
    { "id": "canal", "type": "decision", "label": "Por qual caminho?", "c": 2.6, "r": 1.3 },
    { "id": "link", "label": "Cliente preenche o link", "c": 4.8, "r": 1.3, "hu": ["HU-SL-002"], "huSide": "right" },
    { "id": "planilha", "label": "Importa a planilha modelo", "c": 4.8, "r": 2.6, "hu": ["HU-SL-003"], "huSide": "right" },
    { "id": "atendente", "label": "Atendente registra no formulário", "c": 2.6, "r": 2.6, "hu": ["HU-SL-001"], "huSide": "left" },
    { "id": "validar", "type": "decision", "label": "Dados obrigatórios completos?", "c": 2.6, "r": 3.9 },
    { "id": "pendente", "label": "Fica pendente de dados", "c": 0.6, "r": 3.9, "hu": ["HU-SL-004"], "huSide": "left" },
    { "id": "reenvio", "label": "Reenvia o link de complemento", "c": 0.6, "r": 5.2, "hu": ["HU-SL-004"], "huSide": "left" },
    { "id": "repetido", "type": "decision", "label": "Pedido igual já existe?", "c": 2.6, "r": 5.2 },
    { "id": "avisoRep", "label": "Avisa possível repetição", "c": 4.8, "r": 5.2 },
    { "id": "confirma", "label": "Confirma e gera o código", "c": 2.6, "r": 6.5 },
    { "id": "rastreio", "label": "Envia o link de rastreio", "c": 2.6, "r": 7.8, "hu": ["HU-SL-016"], "huSide": "left" },
    { "id": "fim", "type": "dim", "label": "Pronto para o galpão", "c": 2.6, "r": 9.1 }
  ],
  "edges": [
    { "from": "inicio", "to": "canal" },
    { "from": "canal", "to": "link", "label": "Link" },
    { "from": "canal", "to": "atendente", "label": "Mensagem ou áudio" },
    { "from": "canal", "to": "planilha", "label": "Planilha", "fromSide": "right", "toSide": "top" },
    { "from": "link", "to": "validar", "fromSide": "bottom", "toSide": "right" },
    { "from": "planilha", "to": "validar", "fromSide": "bottom", "toSide": "right" },
    { "from": "atendente", "to": "validar" },
    { "from": "validar", "to": "pendente", "label": "Não" },
    { "from": "pendente", "to": "reenvio" },
    { "from": "reenvio", "to": "validar", "label": "Cliente completa", "fromSide": "right", "toSide": "bottom" },
    { "from": "validar", "to": "repetido", "label": "Sim" },
    { "from": "repetido", "to": "avisoRep", "label": "Sim" },
    { "from": "avisoRep", "to": "confirma", "label": "É outro pedido", "fromSide": "bottom", "toSide": "right" },
    { "from": "repetido", "to": "confirma", "label": "Não" },
    { "from": "confirma", "to": "rastreio" },
    { "from": "rastreio", "to": "fim" }
  ]
}
```

---

## FLX-SL-03 — Do galpão à rota

**Escopo:** do pedido confirmado ao roteiro no celular do motorista: coleta ou entrega no galpão,
recebimento, etiqueta, montagem, publicação e acompanhamento das rotas. **HUs:** `HU-SL-006` a
`HU-SL-011`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Pedido confirmado", "c": 2.6, "r": 0 },
    { "id": "chegada", "type": "decision", "label": "Coleta ou cliente leva?", "c": 2.6, "r": 1.3 },
    { "id": "coleta", "label": "Agenda a coleta (14h–18h)", "c": 4.8, "r": 1.3, "hu": ["HU-SL-007"], "huSide": "right" },
    { "id": "recebe", "label": "Registra a chegada no galpão", "c": 2.6, "r": 2.6, "hu": ["HU-SL-007"], "huSide": "left" },
    { "id": "hora", "type": "decision", "label": "Chegou até 17h?", "c": 2.6, "r": 3.9 },
    { "id": "amanha", "label": "Vai para o dia seguinte", "c": 0.6, "r": 3.9 },
    { "id": "volumes", "type": "decision", "label": "Todos os volumes chegaram?", "c": 2.6, "r": 5.2 },
    { "id": "aguarda", "label": "Aguarda os volumes", "c": 0.6, "r": 5.2 },
    { "id": "etiqueta", "label": "Imprime as etiquetas", "c": 2.6, "r": 6.5, "hu": ["HU-SL-006"], "huSide": "left" },
    { "id": "prontas", "label": "Entra nas prontas, por bairro", "c": 2.6, "r": 7.8 },
    { "id": "monta", "label": "Coordenador monta e ordena", "c": 2.6, "r": 9.1, "hu": ["HU-SL-008"], "huSide": "left" },
    { "id": "publica", "label": "Publica o roteiro", "c": 2.6, "r": 10.4, "hu": ["HU-SL-009"], "huSide": "left" },
    { "id": "remaneja", "label": "Remaneja com motivo", "c": 4.8, "r": 10.4, "hu": ["HU-SL-009"], "huSide": "right" },
    { "id": "celular", "type": "dim", "label": "Roteiro no celular do motorista", "c": 2.6, "r": 11.7, "hu": ["HU-SL-011"], "huSide": "left" },
    { "id": "andamento", "label": "Acompanha o andamento", "c": 4.8, "r": 11.7, "hu": ["HU-SL-010"], "huSide": "right" }
  ],
  "edges": [
    { "from": "inicio", "to": "chegada" },
    { "from": "chegada", "to": "coleta", "label": "Coleta" },
    { "from": "chegada", "to": "recebe", "label": "Cliente leva" },
    { "from": "coleta", "to": "recebe", "fromSide": "bottom", "toSide": "right" },
    { "from": "recebe", "to": "hora" },
    { "from": "hora", "to": "amanha", "label": "Não" },
    { "from": "hora", "to": "volumes", "label": "Sim" },
    { "from": "volumes", "to": "aguarda", "label": "Não" },
    { "from": "volumes", "to": "etiqueta", "label": "Sim" },
    { "from": "etiqueta", "to": "prontas" },
    { "from": "prontas", "to": "monta" },
    { "from": "monta", "to": "publica" },
    { "from": "publica", "to": "celular" },
    { "from": "publica", "to": "remaneja", "label": "Rota muda" },
    { "from": "remaneja", "to": "celular", "label": "Roteiro atualizado", "fromSide": "bottom", "toSide": "right" },
    { "from": "celular", "to": "andamento", "fromSide": "right", "toSide": "left" }
  ]
}
```

---

## FLX-SL-04 — A parada do motorista

**Escopo:** da chegada à parada ao status atualizado para a equipe e o cliente: leitura da
etiqueta, comprovante, ocorrência e registro sem sinal. **HUs:** `HU-SL-011` a `HU-SL-015`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Motorista chega à parada", "c": 2.6, "r": 0, "hu": ["HU-SL-011"], "huSide": "right" },
    { "id": "le", "label": "Lê a etiqueta do pacote", "c": 2.6, "r": 1.3, "hu": ["HU-SL-012"], "huSide": "right" },
    { "id": "daRota", "type": "decision", "label": "Etiqueta é desta rota?", "c": 2.6, "r": 2.6 },
    { "id": "recusa", "label": "Recusa e avisa", "c": 0.6, "r": 2.6 },
    { "id": "conseguiu", "type": "decision", "label": "Conseguiu entregar?", "c": 2.6, "r": 3.9 },
    { "id": "foto", "label": "Fotografa o comprovante", "c": 2.6, "r": 5.2, "hu": ["HU-SL-013"], "huSide": "left" },
    { "id": "quem", "label": "Informa quem recebeu", "c": 2.6, "r": 6.5 },
    { "id": "motivo", "label": "Escolhe o motivo", "c": 4.8, "r": 3.9, "hu": ["HU-SL-014"], "huSide": "right" },
    { "id": "ocorrencia", "label": "Abre ocorrência", "c": 4.8, "r": 5.2 },
    { "id": "sinal", "type": "decision", "label": "Tem sinal?", "c": 2.6, "r": 7.8 },
    { "id": "guarda", "label": "Guarda com a hora do fato", "c": 0.6, "r": 7.8, "hu": ["HU-SL-015"], "huSide": "left" },
    { "id": "envia", "label": "Envia quando o sinal volta", "c": 0.6, "r": 9.1 },
    { "id": "atualizado", "type": "dim", "label": "Status atualizado para equipe e cliente", "c": 2.6, "r": 9.1 }
  ],
  "edges": [
    { "from": "inicio", "to": "le" },
    { "from": "le", "to": "daRota" },
    { "from": "daRota", "to": "recusa", "label": "Não" },
    { "from": "recusa", "to": "le", "label": "Lê outro pacote", "fromSide": "top", "toSide": "left" },
    { "from": "daRota", "to": "conseguiu", "label": "Sim" },
    { "from": "conseguiu", "to": "foto", "label": "Sim" },
    { "from": "foto", "to": "quem" },
    { "from": "conseguiu", "to": "motivo", "label": "Não" },
    { "from": "motivo", "to": "ocorrencia" },
    { "from": "quem", "to": "sinal" },
    { "from": "ocorrencia", "to": "sinal", "fromSide": "bottom", "toSide": "right" },
    { "from": "sinal", "to": "guarda", "label": "Não" },
    { "from": "guarda", "to": "envia" },
    { "from": "envia", "to": "atualizado" },
    { "from": "sinal", "to": "atualizado", "label": "Sim" }
  ]
}
```

---

## FLX-SL-05 — Da ocorrência à decisão

**Escopo:** da ocorrência registrada pelo motorista à decisão do coordenador e aos dois avisos ao
cliente, com a falha de envio e a ocorrência sem decisão no fim do dia. **HUs:** `HU-SL-014`,
`HU-SL-018` a `HU-SL-020`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Ocorrência registrada", "c": 2.6, "r": 0, "hu": ["HU-SL-014"], "huSide": "left" },
    { "id": "aviso", "label": "Aviso automático ao cliente", "c": 4.8, "r": 0, "hu": ["HU-SL-020"], "huSide": "right" },
    { "id": "envioOk", "type": "decision", "label": "Aviso entregue?", "c": 4.8, "r": 1.3 },
    { "id": "falha", "label": "Falha vai ao painel", "c": 6.8, "r": 1.3 },
    { "id": "historico", "type": "dim", "label": "Aviso no histórico", "c": 4.8, "r": 2.6 },
    { "id": "retorno", "label": "Pacote volta ao galpão", "c": 0.6, "r": 0 },
    { "id": "painel", "label": "Entra no painel de exceções", "c": 2.6, "r": 1.3, "hu": ["HU-SL-018"], "huSide": "left" },
    { "id": "prazo", "type": "decision", "label": "Decidida até 19h?", "c": 2.6, "r": 2.6 },
    { "id": "destaque", "label": "Fica destacada", "c": 0.6, "r": 2.6 },
    { "id": "decide", "type": "decision", "label": "Qual decisão?", "c": 2.6, "r": 3.9, "hu": ["HU-SL-019"], "huSide": "right" },
    { "id": "nova", "label": "Nova tentativa na data", "c": 0.6, "r": 5.2 },
    { "id": "devolver", "label": "Devolve ao cliente", "c": 2.6, "r": 5.2 },
    { "id": "guardar", "label": "Guarda aguardando instrução", "c": 4.8, "r": 5.2 },
    { "id": "cancelar", "label": "Cancela a pedido do cliente", "c": 6.8, "r": 5.2 },
    { "id": "avisoDecisao", "label": "Avisa o cliente da decisão", "c": 2.6, "r": 6.5, "hu": ["HU-SL-020"], "huSide": "left" },
    { "id": "fim", "type": "dim", "label": "Sai do painel", "c": 2.6, "r": 7.8 }
  ],
  "edges": [
    { "from": "inicio", "to": "aviso" },
    { "from": "aviso", "to": "envioOk" },
    { "from": "envioOk", "to": "falha", "label": "Não" },
    { "from": "envioOk", "to": "historico", "label": "Sim" },
    { "from": "inicio", "to": "retorno" },
    { "from": "inicio", "to": "painel" },
    { "from": "painel", "to": "prazo" },
    { "from": "prazo", "to": "destaque", "label": "Não" },
    { "from": "destaque", "to": "decide", "fromSide": "bottom", "toSide": "left" },
    { "from": "prazo", "to": "decide", "label": "Sim" },
    { "from": "decide", "to": "nova", "label": "Nova tentativa" },
    { "from": "decide", "to": "devolver", "label": "Devolver" },
    { "from": "decide", "to": "guardar", "label": "Guardar" },
    { "from": "decide", "to": "cancelar", "label": "Cancelar", "fromSide": "right", "toSide": "top" },
    { "from": "nova", "to": "avisoDecisao", "fromSide": "bottom", "toSide": "left" },
    { "from": "devolver", "to": "avisoDecisao" },
    { "from": "guardar", "to": "avisoDecisao", "fromSide": "bottom", "toSide": "right" },
    { "from": "cancelar", "to": "avisoDecisao", "fromSide": "bottom", "toSide": "right" },
    { "from": "avisoDecisao", "to": "fim" }
  ]
}
```

---

## FLX-SL-06 — "Cadê minha entrega?"

**Escopo:** a consulta de status, pelo próprio cliente no link de rastreio ou pela atendente na
lista de entregas — um salto, no lugar da cadeia de cinco de hoje (Gargalos §4). **HUs:**
`HU-SL-016`, `HU-SL-017`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Cliente quer saber da entrega", "c": 2.6, "r": 0 },
    { "id": "temLink", "type": "decision", "label": "Tem o link de rastreio?", "c": 2.6, "r": 1.3 },
    { "id": "abre", "label": "Abre o rastreio", "c": 4.8, "r": 1.3, "hu": ["HU-SL-016"], "huSide": "right" },
    { "id": "valido", "type": "decision", "label": "Link válido?", "c": 4.8, "r": 2.6 },
    { "id": "naoEnc", "label": "Entrega não encontrada", "c": 6.8, "r": 2.6 },
    { "id": "mostra", "label": "Vê status, histórico e comprovante", "c": 4.8, "r": 3.9 },
    { "id": "pergunta", "label": "Pergunta ao atendente", "c": 2.6, "r": 2.6 },
    { "id": "aberto", "type": "decision", "label": "Atendimento aberto?", "c": 2.6, "r": 3.9 },
    { "id": "depois", "label": "Resposta no próximo horário", "c": 0.6, "r": 3.9 },
    { "id": "busca", "label": "Busca por código, cliente ou telefone", "c": 2.6, "r": 5.2, "hu": ["HU-SL-017"], "huSide": "left" },
    { "id": "detalhe", "label": "Vê status e último registro", "c": 2.6, "r": 6.5 },
    { "id": "reenvia", "label": "Reenvia o link de rastreio", "c": 2.6, "r": 7.8, "hu": ["HU-SL-017"], "huSide": "left" },
    { "id": "fim", "type": "dim", "label": "Cliente respondido", "c": 4.8, "r": 7.8 }
  ],
  "edges": [
    { "from": "inicio", "to": "temLink" },
    { "from": "temLink", "to": "abre", "label": "Sim" },
    { "from": "temLink", "to": "pergunta", "label": "Não" },
    { "from": "abre", "to": "valido" },
    { "from": "valido", "to": "naoEnc", "label": "Não" },
    { "from": "valido", "to": "mostra", "label": "Sim" },
    { "from": "naoEnc", "to": "pergunta", "fromSide": "top", "toSide": "top" },
    { "from": "pergunta", "to": "aberto" },
    { "from": "aberto", "to": "depois", "label": "Não" },
    { "from": "aberto", "to": "busca", "label": "Sim" },
    { "from": "busca", "to": "detalhe" },
    { "from": "detalhe", "to": "reenvia" },
    { "from": "reenvia", "to": "fim" },
    { "from": "mostra", "to": "fim" }
  ]
}
```
