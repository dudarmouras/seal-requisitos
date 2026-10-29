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

| Item | Custo estimado | Fornecedor e observação |
|---|---|---|
| Banco, autenticação e arquivos | **R$ 138 por mês** | Supabase Pro (US$ 25): menor instância, 8 GB de banco, 100 GB de arquivos, cópia diária por 7 dias. Instância pequena: R$ 165; média: R$ 413 |
| Hospedagem da aplicação | **R$ 110 por mês** | Vercel Pro (US$ 20), um assento de quem publica. Cada assento a mais: R$ 110 |
| Avisos ao cliente | **R$ 0,05 por entrega** | WhatsApp Business (Meta): R$ 0,04 por mensagem de utilidade, cobrada também dentro da conversa aberta pelo cliente desde 01/10/2026. Média de 1,16 mensagem por entrega (`RN-SL-033`, `RN-SL-040`). Quem paga: `Q-SL-12` |
| Monitoramento de erros | **R$ 0** | Sentry gratuito no começo. Plano Team (US$ 26, R$ 143 por mês) quando o volume passar do gratuito |
| Domínio | **R$ 3 por mês** | Registro.br (`.com.br`), R$ 40 por ano |
| Homologação | **R$ 0** | Supabase gratuito e prévia da Vercel, para testar cada versão e treinar a equipe |
| Etiquetas | **R$ 0,03 a R$ 0,05 cada** | Rolo de etiqueta térmica, uma por volume (`DEC-SL-05`) |
| Impressora de etiquetas | **R$ 650 a R$ 1.600, uma vez** | Térmica, por exemplo Zebra ZD220; uma por ponto de impressão |
| Celulares dos motoristas | **Não estimado** | A origem não diz se o aparelho é do motorista nem quem paga o plano de dados |
| Desenvolvimento e implantação | **Não estimado** | Depende da equipe que vai construir; o esforço relativo está no backlog |
| **Total mensal** | **R$ 250 + R$ 0,05 por entrega** | Fixo mais variável, fora as etiquetas |

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
