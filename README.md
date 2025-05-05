# Página do Founder - README

## Visão Geral

A Página do Founder é uma aplicação web desenvolvida para fornecer informações importantes para fundadores de startups. A aplicação está organizada em quatro categorias principais:

1. **Benefícios** - Ofertas e descontos de parceiros organizados por áreas
2. **Benchmark Report** - Dados e estatísticas sobre o ecossistema de startups
3. **Fundos Parceiros** - Informações sobre fundos de investimento parceiros
4. **Mentores** - Lista de mentores disponíveis e suas especialidades

## Tecnologias Utilizadas

- **Frontend**: React.js com Next.js
- **UI/Componentes**: Material UI (@mui/material, @mui/icons-material)
- **Formulários**: Formik e Yup para validação
- **Requisições HTTP**: Axios
- **Upload de Arquivos**: Multer

## Funcionalidades Principais

- Navegação entre quatro categorias principais
- Visualização de benefícios por subcategoria
- Dashboard interativo com dados de benchmark
- Tabelas de fundos parceiros e mentores
- Sistema de administração para edição de conteúdo
- Upload de imagens (JPEG, PNG, PDF)

## Estrutura do Projeto

```
founder-page/
├── pages/                  # Páginas da aplicação (roteamento Next.js)
├── src/                    # Código fonte
│   ├── components/         # Componentes reutilizáveis
│   ├── utils/              # Funções utilitárias
│   └── assets/             # Recursos estáticos
├── public/                 # Arquivos públicos
│   └── uploads/            # Diretório para armazenar uploads
└── docs/                   # Documentação
```

## Instalação e Execução

### Requisitos

- Node.js 16.x ou superior
- NPM 7.x ou superior

### Instalação

```bash
# Clonar o repositório (se aplicável)
git clone [URL_DO_REPOSITÓRIO]
cd founder-page

# Instalar dependências
npm install
```

### Execução em Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Construção para Produção

```bash
# Construir a aplicação
npm run build

# Iniciar em modo de produção
npm run start
```

## Documentação

A documentação completa está disponível na pasta `docs/`:

- **Manual do Utilizador** (`manual_utilizador.md`) - Guia para utilização da aplicação
- **Documentação Técnica** (`documentacao_tecnica.md`) - Detalhes técnicos da implementação
- **Instruções de Implantação** (`instrucoes_implantacao.md`) - Guia para implantação em produção

## Acesso ao Sistema de Administração

- URL: `/admin`
- Senha padrão: `admin123`

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

## Contato

Para suporte ou mais informações, entre em contato através do email: suporte@exemplo.com
