# SEALog — Infraestrutura e custos

Quanto custa rodar o SEALog na stack proposta em [`arquitetura.md`](arquitetura.md). Como a
arquitetura, é **proposta** (`Q-SL-01`).

> **Sobre os valores.** Preços de tabela públicos consultados em 29/10/2026, sem impostos, com o
> dólar a **R$ 5,50**. Fornecedores mudam preço com frequência: **confira antes de contratar.**

---

## 1. Custos

O custo tem uma parte fixa, que quase não muda com o volume, e uma parte que cresce com cada
entrega. Como o volume diário não está na origem (`Q-SL-02`), a tabela dá o preço de cada item, e
o total vem como fórmula.

| Item | Fornecedor e plano | O que inclui | Custo estimado | Quando muda |
|---|---|---|---|---|
| Banco, autenticação e arquivos | Supabase, plano Pro | Menor instância de processamento, 8 GB de banco, 100 GB de arquivos, cópia de segurança diária guardada por 7 dias | **R$ 138 por mês** (US$ 25) | Instância pequena: R$ 165 por mês. Instância média: R$ 413 por mês. Arquivos acima de 100 GB: cerca de R$ 0,12 por GB |
| Hospedagem da aplicação | Vercel, plano Pro | Um assento de quem publica, com crédito de uso incluso | **R$ 110 por mês** (US$ 20) | Cada assento a mais: R$ 110 por mês |
| Avisos ao cliente | WhatsApp Business, plataforma oficial da Meta | Mensagem de utilidade no Brasil, US$ 0,0068 cada, cobrada também dentro da conversa aberta pelo cliente desde 01/10/2026 | **R$ 0,04 por mensagem**, cerca de **R$ 0,05 por entrega** | Cresce com as entregas: 1,16 mensagem por entrega (`RN-SL-033`, `RN-SL-040`). Quem paga: `Q-SL-12` |
| Monitoramento de erros | Sentry | Plano gratuito no começo; plano Team com 50 mil erros por mês | **R$ 0** | Plano Team: R$ 143 por mês (US$ 26), quando o volume passar do gratuito |
| Domínio | Registro.br (`.com.br`) | Registro anual | **R$ 3 por mês** (R$ 40 por ano) | — |
| Homologação | Supabase gratuito e prévia da Vercel | Ambiente para testar cada versão e treinar a equipe | **R$ 0** | — |
| Etiquetas | Rolo de etiqueta térmica adesiva | Uma etiqueta por volume (`DEC-SL-05`) | **R$ 0,03 a R$ 0,05 por etiqueta** | Cresce com os volumes |
| Impressora de etiquetas | Impressora térmica, por exemplo Zebra ZD220 | Uma por ponto de impressão no galpão | **R$ 650 a R$ 1.600, uma vez** | Uma a mais por ponto de impressão |
| Celulares dos motoristas | — | — | **Não estimado** | A origem não diz se o aparelho é do motorista nem quem paga o plano de dados |
| Desenvolvimento e implantação | — | — | **Não estimado** | Depende da equipe que vai construir; o esforço relativo está no backlog |
| **Total mensal** | | | **Cerca de R$ 250 fixos + R$ 0,05 por entrega + as etiquetas** | |

**Exemplo.** Com 300 entregas por dia, o patamar 1 da [`escalabilidade.md`](escalabilidade.md),
são 7.800 entregas em 26 dias de operação: R$ 250 + R$ 390 = **cerca de R$ 640 por mês, R$ 0,08
por entrega**, abaixo da meta de R$ 0,25 (`RNF-SL-15`). O WhatsApp é a maior parcela e a única que
cresce com o volume; a forma mais simples de reduzi-la é avisar por cliente, não por entrega, nos
dias de muitas ocorrências (`RN-SL-041`).

## 2. Operação

| Rotina | Como | Atende |
|---|---|---|
| Cópia de segurança | Diária e automática, guardada por 7 dias; restauração testada antes da virada | `RNF-SL-17` (perda máxima de 24 horas) |
| Publicação de versão | Automática a cada versão aprovada, primeiro em homologação; nunca entre 7h e 19h | `RNF-SL-04` |
| Monitoramento | Monitor externo do link de rastreio a cada minuto; erros do aplicativo do motorista registrados | `RNF-SL-04`, `RNF-SL-19` |
| Revisão de custo | Mensal: fatura dividida pelas entregas do mês, conferida contra o patamar | `RNF-SL-15` |
