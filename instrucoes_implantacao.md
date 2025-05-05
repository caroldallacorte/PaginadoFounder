# Página do Founder - Instruções de Implantação

Este documento contém as instruções para implantar a "Página do Founder" em um ambiente de produção.

## Requisitos do Sistema

- Node.js 16.x ou superior
- NPM 7.x ou superior
- Servidor web com suporte a Node.js (Nginx, Apache, etc.)
- Pelo menos 1GB de RAM e 10GB de espaço em disco

## Passos para Implantação

### 1. Preparação do Ambiente

```bash
# Instalar dependências globais necessárias
npm install -g pm2
```

### 2. Configuração do Projeto

```bash
# Clonar o repositório (se aplicável)
git clone [URL_DO_REPOSITÓRIO]
cd founder-page

# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
```

Edite o arquivo `.env` para configurar:
- Porta do servidor
- Senha de administração
- Diretório de uploads
- Outras configurações específicas do ambiente

### 3. Construção para Produção

```bash
# Construir a aplicação para produção
npm run build
```

### 4. Iniciar a Aplicação

```bash
# Iniciar com PM2 para garantir que a aplicação permaneça em execução
pm2 start npm --name "founder-page" -- start
```

### 5. Configuração do Servidor Web (Nginx)

Exemplo de configuração para Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuração para arquivos estáticos
    location /uploads {
        alias /caminho/para/founder-page/public/uploads;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

### 6. Configuração HTTPS (Recomendado)

Para configurar HTTPS com Let's Encrypt:

```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com
```

### 7. Backup e Manutenção

Configurar backup regular dos dados:

```bash
# Criar script de backup
mkdir -p /backups/founder-page
crontab -e
```

Adicionar ao crontab:
```
0 2 * * * tar -czf /backups/founder-page/backup-$(date +\%Y\%m\%d).tar.gz /caminho/para/founder-page/public/uploads
```

### 8. Monitoramento

Monitorar a aplicação com PM2:

```bash
# Verificar status
pm2 status

# Monitorar logs
pm2 logs founder-page

# Configurar reinicialização automática
pm2 startup
pm2 save
```

## Atualização da Aplicação

Para atualizar a aplicação para uma nova versão:

```bash
# Parar a aplicação
pm2 stop founder-page

# Atualizar o código (git pull ou substituir arquivos)
git pull

# Instalar dependências e reconstruir
npm install
npm run build

# Reiniciar a aplicação
pm2 restart founder-page
```

## Solução de Problemas

### Problemas de Permissão

Se houver problemas de permissão para uploads:

```bash
# Verificar permissões
sudo chown -R www-data:www-data /caminho/para/founder-page/public/uploads
sudo chmod -R 755 /caminho/para/founder-page/public/uploads
```

### Aplicação Não Inicia

Verificar logs:

```bash
pm2 logs founder-page
```

### Problemas de Memória

Se a aplicação estiver consumindo muita memória:

```bash
# Ajustar configurações de memória no PM2
pm2 stop founder-page
pm2 start npm --name "founder-page" --max-memory-restart 500M -- start
```

## Contato para Suporte

Para suporte técnico, entre em contato com:
- Email: suporte@exemplo.com
- Telefone: (00) 1234-5678
