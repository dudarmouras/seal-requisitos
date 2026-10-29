# SEALog — Infraestrutura e custos

Quanto custa rodar o SEALog na arquitetura proposta em [`arquitetura.md`](arquitetura.md). A SEALog
é uma empresa pequena em expansão, não deu um número de orçamento e pediu custo controlado
(Encontro 1 [29:03]); foi o custo da frota própria que a levou a terceirizar (Encontro 1 [30:33]).

> **Sobre os valores.** As faixas vêm do plano do agente de ocorrências (29/10/2026), em reais, com
> a cotação do dia. Fornecedores mudam preço com frequência: **confira antes de contratar.** Não há
> estimativa de servidor e banco: a escolha é da equipe de infraestrutura.

---

## 1. Custos

Sem o agente de consulta de status, que ficou fora por enquanto (`DEC-SL-10`).

| Item | Fornecedor e plano | O que inclui | Custo estimado | Quando muda |
|---|---|---|---|---|
| WhatsApp | Plataforma oficial da Meta | Menu, formulário, acompanhamento, avisos e a conversa do agente | **R$ 150 a R$ 450 por mês**, pela estimativa de 3.000 conversas a R$ 0,05 a R$ 0,15 cada | A Meta cobra por mensagem de modelo enviada pela empresa — os avisos — e não cobra a resposta dentro da janela de atendimento aberta pela loja; a conferir na tabela vigente. Quem paga: `Q-SL-12` |
| Automação do agente | n8n Cloud | Assinatura da plataforma, sem servidor para manter | **R$ 120 a R$ 250 por mês** (20 a 40 euros) | Varia com o euro e com o limite de execuções do plano |
| Modelo de linguagem do agente | OpenAI, GPT-4o | Cerca de 1.000 atendimentos de ocorrência por mês, cerca de 4.000 trocas de mensagem | **R$ 90 a R$ 120 por mês** (16 a 22 dólares) | Cresce com o número de ocorrências, não de entregas |
| **Subtotal dos serviços** | | | **R$ 360 a R$ 820 por mês** | |
| Servidor do back end | — | — | **Não estimado** | Depende da escolha da equipe de infraestrutura |
| Banco e armazenamento de fotos | — | — | **Não estimado** | Depende da escolha da equipe de infraestrutura e do prazo de guarda das fotos (`Q-SL-16`) |
| Desenvolvimento | — | Agente de ocorrências: 10 a 14 dias úteis, com o mapeamento do protocolo | **Não estimado em reais** | O esforço relativo de cada item está no backlog |

**O que pesa.** O WhatsApp é a maior parcela e a única que cresce com as entregas. A forma mais
simples de reduzi-la é avisar por loja, não por entrega, nos dias de muitas ocorrências
(`RN-SL-044`). O modelo de linguagem cresce com as ocorrências: quanto melhor o pedido na entrada e
o padrão de comprovante, menos ocorrência e menos custo.

## 2. Operação

| Rotina | Como | Atende |
|---|---|---|
| Cópia de segurança | Diária e automática do banco e das fotos; restauração testada antes da virada | `RNF-SL-06` |
| Publicação de versão | Automática a cada versão aprovada, primeiro em homologação; nunca entre 7h e 19h de segunda a sábado | `RNF-SL-04` |
| Monitoramento | Número de WhatsApp e integração da terceirizada vigiados; avisos que falharam e entregas sem retorno no painel | `RNF-SL-04`, `RNF-SL-20` |
| Troca de chaves | O coordenador troca a chave de uma terceirizada sem afetar a outra; a chave do agente é trocada a cada saída de quem a conhecia | `RNF-SL-12` |
| Revisão de custo | Mensal: fatura de cada serviço dividida pelas entregas do mês | `RNF-SL-18` |
