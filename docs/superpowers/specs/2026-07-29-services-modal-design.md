# Serviços especializados — modal de detalhe

## Objetivo

Tornar os seis cards de “Serviços especializados” na Home realmente exploráveis. Cada card deve abrir um detalhe premium, mantendo a estética editorial, quente e contida do site Violets.

O detalhe não deve parecer conteúdo gerado automaticamente: não serão inventados testemunhos, números, materiais, promessas ou imagens. Serão usados apenas os textos traduzidos e as imagens já existentes no projeto.

## Direção aprovada

Ao clicar ou ativar um card por teclado, abrir um modal grande centrado:

- desktop: imagem principal à esquerda; conteúdo à direita;
- mobile: uma única coluna, com imagem antes do conteúdo;
- fundo escuro translúcido, sem efeitos decorativos excessivos;
- hierarquia simples: categoria, título, descrição curta e ações;
- fechar por botão, clique no fundo e tecla `Escape`;
- bloquear o scroll da página enquanto o modal estiver aberto.

O modal terá duas ações:

1. `Ver projetos` — abre a Galeria já filtrada pela categoria do serviço;
2. `Pedir orçamento` — abre a página de Contacto, com destaque visual maior.

## Conteúdo e dados

Cada serviço deve ter uma entrada de dados estática e traduzível com:

- categoria existente da galeria;
- título e descrição PT/EN já suportados pelo `LanguageProvider`;
- imagem principal proveniente dos assets existentes;
- conjunto de imagens relacionadas da mesma categoria para navegação no detalhe.

As imagens relacionadas devem reutilizar `src/data/gallery.js`. Não criar cópias, URLs paralelas ou novos assets só para o modal.

## Interação

- o card inteiro é acionável e mantém foco visível;
- `Enter` e `Space` abrem o detalhe;
- a imagem principal pode avançar/voltar pelas imagens relacionadas;
- o contador indica a posição atual quando existir mais de uma imagem;
- ao fechar, o foco regressa ao card que abriu o modal;
- `Ver projetos` e `Pedir orçamento` são links reais, compatíveis com o `BrowserRouter` e com deployment em subpastas.

## Acessibilidade e responsividade

- modal com `role="dialog"`, `aria-modal="true"` e título associado;
- botão de fechar com nome acessível;
- não depender apenas de hover para revelar informação;
- não permitir scroll horizontal no mobile;
- respeitar `prefers-reduced-motion` nas transições.

## Fora de escopo

- CMS ou gestão de conteúdos;
- upload de novas imagens;
- reescrita das descrições comerciais;
- redesign global da Home;
- integração de formulário dentro do modal.

## Verificação

Adicionar testes para:

- abrir e fechar o modal por clique e teclado;
- mostrar o serviço e categoria corretos;
- navegar entre imagens relacionadas;
- fechar com `Escape` e restaurar o foco;
- manter os dois CTAs corretos em PT e EN;
- garantir que nenhum asset usa URLs root-relative fora do helper existente.
