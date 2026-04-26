# Deploy Netlify + Render

## Diagnostico

Este projeto nao falha no Netlify por "banco de dados quebrado".

O problema raiz e estrutural:

- o frontend pode ser publicado no Netlify
- o backend atual precisa de processo Node persistente
- as sessoes ficam em memoria
- os dados ficam em disco (`users.json` e `plans.json`)

So o frontend deve ficar no Netlify. O backend deve rodar separado.

## Arquitetura recomendada

- `Netlify`: frontend estatico
- `Render`: backend `server.js`
- `frontend`: pode usar proxy `/api` ou falar direto com o backend publicado
- `Render disk`: persistencia dos arquivos de dados

## Dominio proprio e frontend

Se voce usar o proprio `Render` como ambiente oficial, o frontend passa a preferir o dominio aberto no navegador. Isso facilita publicar em:

- `https://enquadra-pcd-saas.onrender.com`
- `https://app.seudominio.com.br`

Se quiser manter `frontend` e `backend` separados, voce pode:

- preencher a meta `davicore-api-origin` com a URL do backend publicado
- ou manter o proxy do Netlify com `NETLIFY_BACKEND_URL`

## Variaveis do Render

Crie no Render:

- `APP_BASE_URL=https://app.seudominio.com.br`
- `ALLOWED_ORIGINS=https://app.seudominio.com.br,https://enquadra-pcd-saas.onrender.com`
- `MP_ACCESS_TOKEN=...`
- `MP_WEBHOOK_SECRET=...`

## Valores para o dominio oficial atual

Quando `enquadrapcddigital.com.br` estiver apontando corretamente para o Render, use:

- `APP_BASE_URL=https://enquadrapcddigital.com.br`
- `ALLOWED_ORIGINS=https://enquadrapcddigital.com.br,https://enquadra-pcd-saas.onrender.com`

No Mercado Pago, o webhook deve ficar em:

- `https://enquadrapcddigital.com.br/api/webhooks/mercadopago`

No DNS do dominio:

- registro `A` para `@` apontando para `216.24.57.1`
- registro `CNAME` para `www` apontando para `enquadra-pcd-saas.onrender.com`

O `render.yaml` ja foi preparado para usar:

- `DATA_DIR=/opt/render/project/src/persisted-data`
- disco persistente montado nesse caminho
- `ALLOWED_ORIGINS` como variavel configuravel para o frontend publicado

## Mercado Pago em producao

Para operar em venda real:

- configure `MP_ACCESS_TOKEN` com a credencial de producao
- configure `MP_WEBHOOK_SECRET` com o segredo do webhook
- aponte o webhook do Mercado Pago para `https://SEU-DOMINIO/api/webhooks/mercadopago`
- habilite no painel do Mercado Pago eventos de pagamento e de assinatura recorrente

O backend agora valida a assinatura `x-signature` e trata tambem notificacoes de assinatura recorrente, incluindo cobrancas mensais autorizadas.

## Observacao importante

Supabase pode ser uma evolucao muito boa para escalar usuarios, sessoes e auditoria.

Mas o que derrubou o deploy no Netlify nao foi a ausencia do Supabase.
Foi tentar rodar backend com sessao e arquivo local em uma hospedagem pensada primeiro para frontend estatico e funcoes serverless.
