# Documentação Técnica - Página do Founder

## Visão Geral da Arquitetura

A Página do Founder é uma aplicação web desenvolvida utilizando as seguintes tecnologias:

- **Frontend**: React.js com Next.js
- **UI/Componentes**: Material UI (@mui/material, @mui/icons-material)
- **Formulários**: Formik e Yup para validação
- **Requisições HTTP**: Axios
- **Upload de Arquivos**: Multer

A aplicação segue uma arquitetura baseada em componentes, com roteamento gerido pelo Next.js e estado local gerido pelos hooks do React.

## Estrutura de Diretórios

```
founder-page/
├── pages/                  # Páginas da aplicação (roteamento Next.js)
│   ├── _app.js             # Componente principal da aplicação
│   ├── index.js            # Página inicial
│   ├── beneficios/         # Páginas de benefícios
│   │   └── [categoria].js  # Página dinâmica para cada categoria de benefícios
│   ├── benchmark/          # Páginas de benchmark report
│   │   └── index.js        # Página principal de benchmark
│   ├── fundos-parceiros/   # Páginas de fundos parceiros
│   │   └── index.js        # Página principal de fundos parceiros
│   ├── mentores/           # Páginas de mentores
│   │   └── index.js        # Página principal de mentores
│   ├── admin/              # Páginas de administração
│   │   ├── index.js        # Página de login
│   │   ├── dashboard.js    # Painel principal de administração
│   │   ├── beneficios/     # Administração de benefícios
│   │   ├── benchmark/      # Administração de benchmark
│   │   ├── fundos-parceiros/ # Administração de fundos parceiros
│   │   └── mentores/       # Administração de mentores
│   ├── api/                # Endpoints da API (Next.js API Routes)
│   │   └── upload.js       # Endpoint para upload de imagens
│   ├── test-upload.js      # Página de teste para upload
│   └── placeholders.js     # Página com placeholders para imagens
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── ImageUploader.js # Componente para upload de imagens
│   ├── utils/              # Funções utilitárias
│   └── assets/             # Recursos estáticos (ícones, imagens)
├── public/                 # Arquivos públicos
│   └── uploads/            # Diretório para armazenar uploads
├── docs/                   # Documentação
│   ├── manual_utilizador.md # Manual do utilizador
│   └── documentacao_tecnica.md # Esta documentação
└── package.json            # Dependências e scripts
```

## Componentes Principais

### Páginas Principais

1. **pages/index.js**: Página inicial com navegação para as quatro categorias principais.
2. **pages/beneficios/[categoria].js**: Página dinâmica que exibe benefícios por categoria.
3. **pages/benchmark/index.js**: Página que exibe o benchmark report com dados por ano.
4. **pages/fundos-parceiros/index.js**: Página que exibe a tabela de fundos parceiros.
5. **pages/mentores/index.js**: Página que exibe a tabela de mentores.

### Sistema de Administração

1. **pages/admin/index.js**: Página de login para o painel de administração.
2. **pages/admin/dashboard.js**: Painel principal de administração com navegação para as categorias.
3. **pages/admin/beneficios/[categoria].js**: Interface para gerenciar benefícios por categoria.
4. **pages/admin/benchmark/index.js**: Interface para gerenciar dados do benchmark report.
5. **pages/admin/fundos-parceiros/index.js**: Interface para gerenciar fundos parceiros.
6. **pages/admin/mentores/index.js**: Interface para gerenciar mentores.

### Componentes Reutilizáveis

1. **src/components/ImageUploader.js**: Componente para upload e pré-visualização de imagens.

### API Endpoints

1. **pages/api/upload.js**: Endpoint para processar uploads de imagens usando Multer.

## Fluxo de Dados

1. **Carregamento Inicial**: Ao carregar a aplicação, os dados são carregados de arquivos JSON locais ou de uma API externa (se configurada).
2. **Navegação**: O utilizador navega entre as categorias através dos botões na barra de navegação.
3. **Administração**: O administrador acede ao painel através da página de login, onde pode editar o conteúdo.
4. **Upload de Imagens**: As imagens são enviadas para o servidor através do endpoint `/api/upload` e armazenadas no diretório `/public/uploads/`.

## Autenticação

A autenticação do painel de administração é simples, baseada em senha:

1. O utilizador acede à página `/admin`
2. Introduz a senha (padrão: "admin123")
3. A autenticação é verificada no cliente
4. Se bem-sucedida, o utilizador é redirecionado para o painel de administração

Nota: Esta implementação é básica e deve ser melhorada para um ambiente de produção com autenticação mais robusta.

## Upload de Imagens

O sistema de upload de imagens utiliza:

1. **Multer**: Para processar os uploads no servidor
2. **ImageUploader**: Componente React para a interface de upload

Formatos suportados:
- JPEG/JPG
- PNG
- PDF

Tamanho máximo: 5MB

## Responsividade

A aplicação é totalmente responsiva, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado com elementos redimensionados
- **Mobile**: Layout simplificado com menus colapsáveis

## Manutenção e Extensão

### Adicionar Nova Categoria

Para adicionar uma nova categoria principal:

1. Criar uma nova pasta em `/pages/` para a categoria
2. Criar um arquivo `index.js` na pasta com o componente da página
3. Adicionar um botão para a categoria na barra de navegação em `index.js`
4. Criar a página de administração correspondente em `/pages/admin/`
5. Adicionar a categoria ao painel de administração em `dashboard.js`

### Modificar Esquema de Dados

Para modificar o esquema de dados de uma categoria existente:

1. Atualizar o componente da página correspondente
2. Atualizar o formulário de edição na página de administração
3. Atualizar a validação de formulário (Yup)

### Personalização Visual

Para personalizar o aspeto visual:

1. Modificar o tema em `_app.js` (cores, tipografia, etc.)
2. Atualizar os componentes do Material UI conforme necessário

## Implantação

A aplicação pode ser implantada em qualquer ambiente que suporte Next.js:

1. **Desenvolvimento**:
   ```
   npm run dev
   ```

2. **Produção**:
   ```
   npm run build
   npm run start
   ```

3. **Exportação Estática** (opcional para partes que não requerem servidor):
   ```
   npm run build
   npm run export
   ```

## Considerações de Segurança

1. **Autenticação**: A implementação atual é básica. Para um ambiente de produção, considere:
   - Implementar JWT ou OAuth
   - Adicionar autenticação de dois fatores
   - Utilizar HTTPS

2. **Upload de Arquivos**:
   - Implementar verificação mais rigorosa de tipos de arquivo
   - Considerar o uso de serviços de armazenamento em nuvem (AWS S3, Google Cloud Storage)
   - Implementar limitação de taxa para evitar abusos

3. **API Endpoints**:
   - Adicionar autenticação a todos os endpoints de API
   - Implementar limitação de taxa
   - Validar todas as entradas do utilizador

## Melhorias Futuras

1. **Backend Robusto**: Substituir o armazenamento local por um banco de dados (MongoDB, PostgreSQL)
2. **Autenticação Avançada**: Implementar um sistema de autenticação mais seguro
3. **Análise de Dados**: Adicionar visualizações mais avançadas para o Benchmark Report
4. **Pesquisa**: Implementar funcionalidade de pesquisa em todas as categorias
5. **Notificações**: Adicionar sistema de notificações para novos benefícios ou atualizações
6. **Exportação de Dados**: Permitir exportação de dados em formatos como CSV ou PDF
7. **Internacionalização**: Adicionar suporte para múltiplos idiomas
