# Ambiental IA

MVP SaaS para apoiar a criacao, organizacao e geracao de documentos tecnicos ambientais, com foco inicial em PRAD.

## Stack

- Next.js com TypeScript
- Tailwind CSS
- Supabase preparado para banco de dados e autenticacao
- Geracao real de DOCX no navegador e estrutura para PDF oficial
- Estrutura preparada para integracao futura com OpenAI API

## Como rodar

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Banco de Dados Supabase

O schema inicial esta em `supabase/schema.sql`.

Para aplicar em um projeto Supabase:

Copie o conteudo de `supabase/schema.sql` e execute no SQL Editor do Supabase.

Tabelas principais:

- `profiles`: perfis vinculados a `auth.users`.
- `plans`: planos Basico, Intermediario e Premium.
- `document_templates`: modelos administraveis para documentos ambientais.
- `documents`: documentos gerados ou em rascunho.
- `subscriptions`: assinaturas dos usuarios por plano.

## O que ja existe no MVP

- Landing operacional com acesso rapido ao produto
- Login e cadastro com autenticacao simulada no navegador
- Dashboard do usuario
- Pagina de planos: Basico, Intermediario e Premium
- Formulario tecnico para PRAD
- Gerador dinamico em `/documentos/novo` para PRAD, PTRF, RAP, RCA, PCA, PGRS, PMGRCC, Parecer Tecnico e Laudo Ambiental
- Tela de pre-visualizacao e geracao real de DOCX a partir do formulario PRAD
- Painel administrativo para cadastrar, editar, visualizar e excluir modelos de documentos ambientais
- Cliente Supabase isolado para troca futura da autenticacao simulada
- Cliente OpenAI placeholder, sem chamada real

## Modelos dinamicos

Os modelos ambientais ficam definidos em `src/lib/mock-data.ts` e podem ser alterados pelo Admin durante a sessao do navegador. Cada modelo possui:

- `id`
- `tipo_documento`
- `nome`
- `descricao`
- `categoria`
- `subcategoria`
- `orgao_ambiental`
- `versao`
- `plano_minimo`
- `status`
- `secoes`
- `campos_obrigatorios`
- `texto_base` com variaveis como `{titulo}` e `{responsavel_tecnico}`

A rota `/documentos/novo` usa esses metadados para filtrar modelos por tipo, categoria, subcategoria e orgao ambiental, montar o formulario automaticamente, gerar previa e exportar DOCX/PDF.

Subcategorias iniciais:

- PRAD: APP, Reserva Legal, Mineracao, Area Urbana.
- Parecer Tecnico: Arborizacao, Supressao Vegetal, Recursos Hidricos.
- Laudo Ambiental: Nascente, APP, Erosao.

## Proximos passos sugeridos

1. Conectar Supabase Auth nas telas de login/cadastro.
2. Conectar telas e modelos as tabelas `profiles`, `plans`, `document_templates`, `documents` e `subscriptions`.
3. Implementar rotas server-side para gerar PDF e padronizar DOCX com templates reais.
4. Adicionar controle de acesso por plano.
5. Integrar OpenAI API em uma rota protegida para auxiliar na redacao tecnica.
