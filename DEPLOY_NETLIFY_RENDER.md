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

## Variaveis do Netlify

O frontend ja sai apontando por padrao para:

- `https://enquadra-pcd-saas.onrender.com`

Se quiser trocar o backend, voce pode:

- alterar a meta `davicore-app-origin`
- ou manter o proxy do Netlify com `NETLIFY_BACKEND_URL`

## Variaveis do Render

Crie no Render:

- `APP_BASE_URL=https://SEU-BACKEND.onrender.com`
- `ALLOWED_ORIGINS=https://SEU-SITE.netlify.app,https://SEU-DOMINIO.com`
- `MP_ACCESS_TOKEN=...`
- `MP_WEBHOOK_SECRET=...`

O `render.yaml` ja foi preparado para usar:

- `DATA_DIR=/opt/render/project/src/persisted-data`
- disco persistente montado nesse caminho
- `ALLOWED_ORIGINS` como variavel configuravel para o frontend publicado

## Observacao importante

Supabase pode ser uma evolucao muito boa para escalar usuarios, sessoes e auditoria.

Mas o que derrubou o deploy no Netlify nao foi a ausencia do Supabase.
Foi tentar rodar backend com sessao e arquivo local em uma hospedagem pensada primeiro para frontend estatico e funcoes serverless.
