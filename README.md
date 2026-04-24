# Enquadra PcD SaaS

Sistema SaaS para enquadramento ocupacional de PcD com:

- acesso de empresa e administrador na mesma tela
- painel administrativo de clientes
- controle de status, pagamento e uso
- geracao de laudo caracterizador em formato institucional
- integracao com Mercado Pago Checkout Pro

## Estrutura principal

- `index.html`: interface unica do produto
- `style.css`: identidade visual e layout
- `app.js`: triagem, laudo, PDF, login e painel admin
- `server.js`: backend HTTP, sessao, usuarios, Mercado Pago e webhooks
- `img/logo.png`: logo usada na landing e no sistema
- `data/users.json`: base local de usuarios
- `official_page1.png`: base grafica do laudo oficial

## Credencial administrativa padrao

No primeiro start do servidor o sistema cria automaticamente:

- usuario: `ANDERSONBIONDO`
- senha: `13090404`

## Variaveis de ambiente

Copie `.env.example` para um arquivo `.env` ou configure as variaveis diretamente no provedor:

- `APP_BASE_URL`: URL publica exata do sistema
- `MP_ACCESS_TOKEN`: token de producao ou teste do Mercado Pago
- `MP_WEBHOOK_SECRET`: reservado para endurecimento futuro do webhook
- `HOST`: host do servidor
- `PORT`: porta do servidor

## Rodando localmente

Requisitos:

- Node.js 18 ou superior

Passos:

1. Abra a pasta do projeto no terminal.
2. Configure as variaveis de ambiente.
3. Rode `npm start`.
4. Acesse `http://127.0.0.1:8080`.

## Publicacao recomendada

Para o modo SaaS completo, publique em um host com Node.js. `Netlify` sozinho nao atende este projeto porque o sistema depende de:

- backend HTTP
- sessao persistida por cookie
- webhook do Mercado Pago
- armazenamento de usuarios

### Opcao simples: Render

1. Suba esta pasta para um repositorio Git.
2. Crie um novo Web Service no Render.
3. Aponte para o repositorio.
4. Configure as variaveis:
   - `APP_BASE_URL`
   - `MP_ACCESS_TOKEN`
   - `MP_WEBHOOK_SECRET`
5. Publique o servico.

O arquivo `render.yaml` ja foi incluido para facilitar esse deploy.

## Fluxo comercial

### Empresa

1. Entrar na landing
2. Criar conta
3. Escolher plano
4. Ir para checkout Mercado Pago
5. Acesso liberado apos pagamento aprovado

### Administrador

1. Entrar como administrador
2. Gerenciar clientes
3. Bloquear ou ativar
4. Ajustar plano e vencimento
5. Gerar novo link Mercado Pago
6. Acompanhar quantidade de laudos por cliente

## Observacoes de producao

- Hoje a persistencia padrao usa `data/users.json`, suficiente para MVP e venda inicial assistida.
- Para escala maior, o caminho natural e migrar usuarios e pagamentos para banco gerenciado.
- O webhook do Mercado Pago ja esta preparado para ativar acesso automaticamente quando o pagamento for aprovado.
