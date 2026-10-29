# SEALog — Fluxogramas

Seis pranchas: o ciclo de vida da entrega, que amarra o resto, e uma prancha por trecho do caminho
do pedido — a entrada pelo WhatsApp, o despacho para a terceirizada, o retorno com o comprovante, a
ocorrência com o agente e a devolução no galpão. Descrevem o sistema proposto, já com a
terceirização; o caminho de hoje está no campo **Origem legada** de cada história.

A prancha é **mapa, não manual**: cada nó cabe em poucas palavras e o detalhe fica nas regras
`RN-SL-*`, nas mensagens `MSG-SL-*` e nas histórias `HU-SL-*`. Grade da casa: espinha em `c 2.6`,
recusa e falha em `c 0.6`, desvio em `c 4.8` e `c 6.8`, passo de `1.3` (`CONVENCOES.md` §6.1).

---

## FLX-SL-01 — Ciclo de vida da entrega

**Escopo:** do pedido recebido ao status final — entregue, devolvido à loja ou cancelado —, com a
pendência de dados, o número de loja a confirmar, o bairro que nenhuma terceirizada atende e a volta
ao galpão. Os status estão em `06-modelo-de-dados.md` §3.1. **HUs:** `HU-SL-001`, `HU-SL-004`, `HU-SL-007`, `HU-SL-009`, `HU-SL-010`, `HU-SL-011`, `HU-SL-013`, `HU-SL-016`, `HU-SL-018`, `HU-SL-019`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Pedido chega", "c": 2.6, "r": 0, "hu": ["HU-SL-001"], "huSide": "right" },
    { "id": "completo", "type": "decision", "label": "Dados obrigatórios completos?", "c": 2.6, "r": 1.3 },
    { "id": "pendente", "label": "Pendente de dados", "c": 0.6, "r": 1.3, "hu": ["HU-SL-004"], "huSide": "left" },
    { "id": "numero", "type": "decision", "label": "Número da loja já confirmado?", "c": 2.6, "r": 2.6 },
    { "id": "aConfirmar", "label": "A confirmar", "c": 4.8, "r": 2.6, "hu": ["HU-SL-009"], "huSide": "right" },
    { "id": "recusado", "type": "dim", "label": "Cancelado: número não confirmado", "c": 6.8, "r": 2.6 },
    { "id": "recebido", "label": "Recebido", "c": 2.6, "r": 3.9 },
    { "id": "regiao", "type": "decision", "label": "Bairro atendido por alguma terceirizada?", "c": 2.6, "r": 5.2, "hu": ["HU-SL-010"], "huSide": "left" },
    { "id": "aguardando", "label": "Aguardando região", "c": 4.8, "r": 5.2, "hu": ["HU-SL-007"], "huSide": "right" },
    { "id": "despachado", "label": "Despachado", "c": 2.6, "r": 6.5, "hu": ["HU-SL-011"], "huSide": "left" },
    { "id": "canceladoLoja", "type": "dim", "label": "Cancelado pela loja", "c": 0.6, "r": 6.5 },
    { "id": "coletado", "label": "Coletado", "c": 2.6, "r": 7.8, "hu": ["HU-SL-013"], "huSide": "left" },
    { "id": "emRota", "label": "Em rota", "c": 2.6, "r": 9.1 },
    { "id": "resultado", "type": "decision", "label": "Resultado da entrega?", "c": 2.6, "r": 10.4 },
    { "id": "entregue", "type": "dim", "label": "Entregue", "c": 2.6, "r": 11.7, "hu": ["HU-SL-016"], "huSide": "left" },
    { "id": "naoEntregue", "label": "Não entregue, com chamado", "c": 4.8, "r": 10.4, "hu": ["HU-SL-018"], "huSide": "right" },
    { "id": "devolucao", "label": "Em devolução", "c": 4.8, "r": 11.7 },
    { "id": "galpao", "label": "No galpão", "c": 4.8, "r": 13, "hu": ["HU-SL-019"], "huSide": "right" },
    { "id": "decisao", "type": "decision", "label": "Decisão do coordenador?", "c": 4.8, "r": 14.3 },
    { "id": "devolvido", "type": "dim", "label": "Devolvido à loja", "c": 4.8, "r": 15.6 },
    { "id": "cancelado", "type": "dim", "label": "Cancelado", "c": 6.8, "r": 14.3 }
  ],
  "edges": [
    { "from": "inicio", "to": "completo" },
    { "from": "completo", "to": "pendente", "label": "Não" },
    { "from": "completo", "to": "numero", "label": "Sim" },
    { "from": "pendente", "to": "recebido", "label": "Loja completa", "fromSide": "bottom", "toSide": "left" },
    { "from": "numero", "to": "recebido", "label": "Sim" },
    { "from": "numero", "to": "aConfirmar", "label": "Não" },
    { "from": "aConfirmar", "to": "recebido", "label": "Equipe confirma", "fromSide": "bottom", "toSide": "right" },
    { "from": "aConfirmar", "to": "recusado", "label": "Equipe recusa" },
    { "from": "recebido", "to": "regiao" },
    { "from": "regiao", "to": "despachado", "label": "Sim" },
    { "from": "regiao", "to": "aguardando", "label": "Não" },
    { "from": "aguardando", "to": "despachado", "label": "Coordenador escolhe", "fromSide": "bottom", "toSide": "right" },
    { "from": "despachado", "to": "canceladoLoja", "label": "Loja cancela antes da coleta" },
    { "from": "despachado", "to": "coletado", "label": "Terceirizada coleta" },
    { "from": "coletado", "to": "emRota" },
    { "from": "emRota", "to": "resultado" },
    { "from": "resultado", "to": "entregue", "label": "Com comprovante" },
    { "from": "resultado", "to": "naoEntregue", "label": "Não entregue" },
    { "from": "naoEntregue", "to": "devolucao" },
    { "from": "devolucao", "to": "galpao", "label": "Chegada registrada" },
    { "from": "galpao", "to": "decisao" },
    { "from": "decisao", "to": "despachado", "label": "Nova tentativa", "fromSide": "left", "toSide": "right" },
    { "from": "decisao", "to": "galpao", "label": "Guardar", "fromSide": "right", "toSide": "right" },
    { "from": "decisao", "to": "devolvido", "label": "Devolver" },
    { "from": "decisao", "to": "cancelado", "label": "Cancelar" }
  ]
}
```

---

## FLX-SL-02 — Pedido pelo WhatsApp

**Escopo:** da mensagem da loja ao pedido gravado e avisado, com o menu de duas opções, a validação
do formulário, o aviso de repetição, o número de loja a confirmar e o pedido que a equipe registra.
**HUs:** `HU-SL-001`, `HU-SL-003`, `HU-SL-004`, `HU-SL-009`, `HU-SL-010`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Loja manda mensagem", "c": 2.6, "r": 0 },
    { "id": "menu", "label": "Menu: novo pedido ou editar", "c": 2.6, "r": 1.3, "hu": ["HU-SL-001"], "huSide": "left" },
    { "id": "opcao", "type": "decision", "label": "Qual opção?", "c": 2.6, "r": 2.6 },
    { "id": "editar", "label": "Edita ou cancela até a coleta", "c": 4.8, "r": 2.6, "hu": ["HU-SL-003"], "huSide": "right" },
    { "id": "form", "label": "Preenche o formulário, com o nome da loja", "c": 2.6, "r": 3.9, "hu": ["HU-SL-001"], "huSide": "left" },
    { "id": "equipe", "label": "Equipe registra o pedido fora do formulário", "c": 0.6, "r": 3.9, "hu": ["HU-SL-004"], "huSide": "left" },
    { "id": "valida", "type": "decision", "label": "Dados obrigatórios completos?", "c": 2.6, "r": 5.2 },
    { "id": "aponta", "label": "Aponta o que falta", "c": 4.8, "r": 5.2 },
    { "id": "repetido", "type": "decision", "label": "Pedido igual já existe?", "c": 2.6, "r": 6.5 },
    { "id": "confirmaRep", "label": "Pergunta se é outro pedido", "c": 4.8, "r": 6.5 },
    { "id": "numero", "type": "decision", "label": "Número da loja já confirmado?", "c": 2.6, "r": 7.8 },
    { "id": "aConfirmar", "label": "Fica a confirmar até a equipe aprovar", "c": 4.8, "r": 7.8, "hu": ["HU-SL-009"], "huSide": "right" },
    { "id": "grava", "label": "Grava, gera o código e avisa a loja", "c": 2.6, "r": 9.1 },
    { "id": "fim", "type": "dim", "label": "Vai para o despacho", "c": 2.6, "r": 10.4, "hu": ["HU-SL-010"], "huSide": "left" }
  ],
  "edges": [
    { "from": "inicio", "to": "menu" },
    { "from": "menu", "to": "opcao" },
    { "from": "opcao", "to": "form", "label": "Novo pedido" },
    { "from": "opcao", "to": "editar", "label": "Editar ou cancelar" },
    { "from": "equipe", "to": "valida", "label": "Mesmas validações", "fromSide": "bottom", "toSide": "left" },
    { "from": "form", "to": "valida" },
    { "from": "valida", "to": "aponta", "label": "Não" },
    { "from": "aponta", "to": "form", "label": "Loja corrige", "fromSide": "top", "toSide": "right" },
    { "from": "valida", "to": "repetido", "label": "Sim" },
    { "from": "repetido", "to": "confirmaRep", "label": "Sim" },
    { "from": "confirmaRep", "to": "numero", "label": "É outro pedido", "fromSide": "bottom", "toSide": "right" },
    { "from": "repetido", "to": "numero", "label": "Não" },
    { "from": "numero", "to": "aConfirmar", "label": "Não" },
    { "from": "aConfirmar", "to": "grava", "label": "Equipe aprova", "fromSide": "bottom", "toSide": "right" },
    { "from": "numero", "to": "grava", "label": "Sim, ou pedido da equipe" },
    { "from": "grava", "to": "fim" }
  ]
}
```

---

## FLX-SL-03 — Despacho para a terceirizada

**Escopo:** do pedido recebido à coleta pela terceirizada: a região, o bairro que nenhuma
terceirizada atende, o envio pela integração, pelo portal ou pela exportação, e a alteração depois
do despacho. **HUs:** `HU-SL-007`, `HU-SL-009` a `HU-SL-012`, `HU-SL-014`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Pedido recebido", "c": 2.6, "r": 0 },
    { "id": "regiao", "type": "decision", "label": "Bairro atendido por alguma terceirizada?", "c": 2.6, "r": 1.3, "hu": ["HU-SL-010"], "huSide": "left" },
    { "id": "aguardando", "label": "Aguardando região", "c": 4.8, "r": 1.3, "hu": ["HU-SL-007"], "huSide": "right" },
    { "id": "escolhe", "label": "Coordenador escolhe e pode incluir o bairro nas regiões dela", "c": 4.8, "r": 2.6 },
    { "id": "terc", "label": "Define a terceirizada", "c": 2.6, "r": 2.6 },
    { "id": "forma", "type": "decision", "label": "Como a terceirizada recebe?", "c": 2.6, "r": 3.9, "hu": ["HU-SL-011"], "huSide": "left" },
    { "id": "api", "label": "Envia pela integração", "c": 4.8, "r": 3.9 },
    { "id": "portal", "label": "Lista do dia no portal, ou exportação enviada pela equipe", "c": 0.6, "r": 3.9, "hu": ["HU-SL-014"], "huSide": "left" },
    { "id": "despachado", "label": "Despachado", "c": 2.6, "r": 5.2, "hu": ["HU-SL-009"], "huSide": "left" },
    { "id": "alteracao", "type": "decision", "label": "Loja ou equipe alterou?", "c": 2.6, "r": 6.5 },
    { "id": "avisa", "label": "Envia a alteração em destaque", "c": 4.8, "r": 6.5, "hu": ["HU-SL-012"], "huSide": "right" },
    { "id": "coleta", "type": "dim", "label": "Terceirizada coleta na loja", "c": 2.6, "r": 7.8 }
  ],
  "edges": [
    { "from": "inicio", "to": "regiao" },
    { "from": "regiao", "to": "aguardando", "label": "Não" },
    { "from": "aguardando", "to": "escolhe" },
    { "from": "escolhe", "to": "terc", "label": "Escolhida" },
    { "from": "regiao", "to": "terc", "label": "Sim" },
    { "from": "terc", "to": "forma" },
    { "from": "forma", "to": "api", "label": "Integração" },
    { "from": "forma", "to": "portal", "label": "Portal ou exportação" },
    { "from": "api", "to": "despachado", "fromSide": "bottom", "toSide": "right" },
    { "from": "portal", "to": "despachado", "fromSide": "bottom", "toSide": "left" },
    { "from": "despachado", "to": "alteracao" },
    { "from": "alteracao", "to": "avisa", "label": "Sim" },
    { "from": "avisa", "to": "coleta", "label": "Terceirizada confirma", "fromSide": "bottom", "toSide": "right" },
    { "from": "alteracao", "to": "coleta", "label": "Não" }
  ]
}
```

---

## FLX-SL-04 — Retorno da terceirizada e comprovante

**Escopo:** da situação informada pela terceirizada — pela integração, pelo portal ou por planilha —
ao status gravado, com as recusas, o comprovante padrão e o recebedor não autorizado. **HUs:**
`HU-SL-013` a `HU-SL-016`, `HU-SL-018`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Terceirizada informa a situação", "c": 2.6, "r": 0 },
    { "id": "canal", "type": "decision", "label": "Por onde?", "c": 2.6, "r": 1.3 },
    { "id": "planilha", "label": "Planilha traduzida para o padrão", "c": 4.8, "r": 1.3, "hu": ["HU-SL-015"], "huSide": "right" },
    { "id": "api", "label": "Integração", "c": 6.8, "r": 1.3, "hu": ["HU-SL-013"], "huSide": "right" },
    { "id": "portal", "label": "Portal", "c": 2.6, "r": 2.6, "hu": ["HU-SL-014"], "huSide": "left" },
    { "id": "codigo", "type": "decision", "label": "Código despachado para ela?", "c": 2.6, "r": 3.9 },
    { "id": "recusaCod", "label": "Recusa com o motivo", "c": 0.6, "r": 3.9 },
    { "id": "ciclo", "type": "decision", "label": "A situação segue o ciclo?", "c": 2.6, "r": 5.2 },
    { "id": "recusaCiclo", "label": "Recusa com o motivo", "c": 0.6, "r": 5.2 },
    { "id": "situacao", "type": "decision", "label": "Qual situação?", "c": 2.6, "r": 6.5 },
    { "id": "atualiza", "label": "Coleta, saída ou devolução: atualiza o status", "c": 0.6, "r": 6.5 },
    { "id": "naoEntregue", "label": "Não entregue: motivo e chamado", "c": 4.8, "r": 6.5, "hu": ["HU-SL-018"], "huSide": "right" },
    { "id": "comprovante", "type": "decision", "label": "Comprovante completo?", "c": 2.6, "r": 7.8, "hu": ["HU-SL-016"], "huSide": "right" },
    { "id": "recusaComp", "label": "Recusa: falta foto, hora, recebedor ou entregador", "c": 0.6, "r": 7.8 },
    { "id": "recebedor", "type": "decision", "label": "Destinatário ou pessoa autorizada?", "c": 2.6, "r": 9.1 },
    { "id": "chamadoRec", "label": "Entregue, com chamado de recebedor não autorizado", "c": 4.8, "r": 9.1 },
    { "id": "entregue", "type": "dim", "label": "Entregue", "c": 2.6, "r": 10.4 }
  ],
  "edges": [
    { "from": "inicio", "to": "canal" },
    { "from": "canal", "to": "portal", "label": "Portal" },
    { "from": "canal", "to": "planilha", "label": "Planilha" },
    { "from": "canal", "to": "api", "label": "Integração", "fromSide": "top", "toSide": "top" },
    { "from": "planilha", "to": "codigo", "fromSide": "bottom", "toSide": "right" },
    { "from": "api", "to": "codigo", "fromSide": "bottom", "toSide": "right" },
    { "from": "portal", "to": "codigo" },
    { "from": "codigo", "to": "recusaCod", "label": "Não" },
    { "from": "codigo", "to": "ciclo", "label": "Sim" },
    { "from": "ciclo", "to": "recusaCiclo", "label": "Não" },
    { "from": "ciclo", "to": "situacao", "label": "Sim" },
    { "from": "situacao", "to": "atualiza", "label": "Outras" },
    { "from": "situacao", "to": "naoEntregue", "label": "Não entregue" },
    { "from": "situacao", "to": "comprovante", "label": "Entregue" },
    { "from": "comprovante", "to": "recusaComp", "label": "Não" },
    { "from": "comprovante", "to": "recebedor", "label": "Sim" },
    { "from": "recebedor", "to": "chamadoRec", "label": "Não" },
    { "from": "recebedor", "to": "entregue", "label": "Sim" }
  ]
}
```

---

## FLX-SL-05 — Ocorrência com o agente

**Escopo:** do relato da loja no WhatsApp, ou do Não entregue da terceirizada, ao chamado
concluído e respondido: a triagem do agente, a foto da avaria, a sugestão pelo protocolo e a
decisão da equipe. **HUs:** `HU-SL-013`, `HU-SL-017`, `HU-SL-018`, `HU-SL-020`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Loja escolhe Relatar problema", "c": 2.6, "r": 0, "hu": ["HU-SL-017"], "huSide": "left" },
    { "id": "pedido", "label": "Agente identifica o pedido pelo código", "c": 2.6, "r": 1.3 },
    { "id": "tipo", "label": "Classifica o tipo e pede a descrição", "c": 2.6, "r": 2.6 },
    { "id": "avaria", "type": "decision", "label": "É avaria?", "c": 2.6, "r": 3.9 },
    { "id": "foto", "label": "Pede foto", "c": 4.8, "r": 3.9 },
    { "id": "protocolo", "label": "Compara com o protocolo e sugere a ação", "c": 2.6, "r": 5.2 },
    { "id": "terc", "type": "dim", "label": "Não entregue da terceirizada", "c": 4.8, "r": 6.5, "hu": ["HU-SL-013"], "huSide": "right" },
    { "id": "chamado", "label": "Abre o chamado no painel", "c": 2.6, "r": 6.5, "hu": ["HU-SL-018"], "huSide": "left" },
    { "id": "avisaLoja", "label": "Avisa a loja que o problema está com a equipe", "c": 0.6, "r": 6.5, "hu": ["HU-SL-020"], "huSide": "left" },
    { "id": "pessoa", "type": "decision", "label": "A equipe aprova a sugestão?", "c": 2.6, "r": 7.8 },
    { "id": "destacado", "label": "Sem conclusão às 19h: destacado", "c": 0.6, "r": 7.8 },
    { "id": "muda", "label": "Registra outra ação e o motivo", "c": 4.8, "r": 7.8 },
    { "id": "aprova", "label": "Aplica a ação sugerida", "c": 2.6, "r": 9.1 },
    { "id": "resposta", "label": "Responde à loja pelo WhatsApp", "c": 2.6, "r": 10.4 },
    { "id": "fim", "type": "dim", "label": "Chamado concluído", "c": 2.6, "r": 11.7 }
  ],
  "edges": [
    { "from": "inicio", "to": "pedido" },
    { "from": "pedido", "to": "tipo" },
    { "from": "tipo", "to": "avaria" },
    { "from": "avaria", "to": "foto", "label": "Sim" },
    { "from": "avaria", "to": "protocolo", "label": "Não" },
    { "from": "foto", "to": "protocolo", "fromSide": "bottom", "toSide": "right" },
    { "from": "terc", "to": "protocolo", "label": "Também ganha sugestão", "fromSide": "top", "toSide": "right" },
    { "from": "protocolo", "to": "chamado" },
    { "from": "chamado", "to": "avisaLoja" },
    { "from": "chamado", "to": "pessoa" },
    { "from": "pessoa", "to": "destacado", "label": "Ainda não" },
    { "from": "pessoa", "to": "muda", "label": "Não" },
    { "from": "pessoa", "to": "aprova", "label": "Sim" },
    { "from": "muda", "to": "resposta", "fromSide": "bottom", "toSide": "right" },
    { "from": "aprova", "to": "resposta" },
    { "from": "resposta", "to": "fim" }
  ]
}
```

---

## FLX-SL-06 — Devolução no galpão

**Escopo:** do Não entregue ao destino do pacote, decidido por uma pessoa: o chamado e o aviso à
loja, a volta ao galpão, a chegada registrada e os quatro destinos. **HUs:** `HU-SL-011`,
`HU-SL-013`, `HU-SL-019`, `HU-SL-020`.

```board
{
  "nodes": [
    { "id": "inicio", "type": "dim", "label": "Não entregue", "c": 2.6, "r": 0, "hu": ["HU-SL-013"], "huSide": "right" },
    { "id": "chamado", "label": "Chamado aberto e loja avisada", "c": 2.6, "r": 1.3, "hu": ["HU-SL-020"], "huSide": "left" },
    { "id": "leva", "label": "Terceirizada devolve ao galpão", "c": 2.6, "r": 2.6 },
    { "id": "chega", "label": "Equipe registra a chegada pelo código", "c": 2.6, "r": 3.9, "hu": ["HU-SL-019"], "huSide": "left" },
    { "id": "decisao", "type": "decision", "label": "Destino decidido pelo coordenador?", "c": 2.6, "r": 5.2 },
    { "id": "guardar", "label": "Guarda aguardando a loja", "c": 0.6, "r": 5.2 },
    { "id": "nova", "label": "Nova tentativa, com data", "c": 4.8, "r": 5.2 },
    { "id": "cancelado", "type": "dim", "label": "Cancelado", "c": 6.8, "r": 5.2 },
    { "id": "redespacha", "type": "dim", "label": "Despachado de novo", "c": 4.8, "r": 6.5, "hu": ["HU-SL-011"], "huSide": "right" },
    { "id": "devolver", "label": "Devolve à loja", "c": 2.6, "r": 6.5 },
    { "id": "devolvido", "type": "dim", "label": "Devolvido à loja", "c": 2.6, "r": 7.8 }
  ],
  "edges": [
    { "from": "inicio", "to": "chamado" },
    { "from": "chamado", "to": "leva" },
    { "from": "leva", "to": "chega" },
    { "from": "chega", "to": "decisao" },
    { "from": "decisao", "to": "guardar", "label": "Guardar" },
    { "from": "decisao", "to": "nova", "label": "Nova tentativa" },
    { "from": "decisao", "to": "cancelado", "label": "Cancelar", "fromSide": "top", "toSide": "top" },
    { "from": "decisao", "to": "devolver", "label": "Devolver" },
    { "from": "nova", "to": "redespacha" },
    { "from": "guardar", "to": "devolver", "label": "Instrução da loja", "fromSide": "bottom", "toSide": "left" },
    { "from": "devolver", "to": "devolvido" }
  ]
}
```
