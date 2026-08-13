# Portfolio — Oseas Rodrigues

Portfólio pessoal de [Oseas Rodrigues](https://github.com/Rodriguesoseas) — desenvolvedor full-stack com foco em Ruby on Rails, Flutter e PostgreSQL.

## Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks)
- Fontes: Inter + Fira Code (Google Fonts)
- Ícones de habilidades em SVG inline (sem CDNs)

## Recursos

- Layout responsivo (mobile-first)
- Carrosséis customizados (Oficina, Clima App, Sorteio Time) com autoplay, swipe, clones infinitos e navegação por teclado
- Animações de scroll reveal com suporte a `prefers-reduced-motion`
- Acessibilidade: skip-link, `:focus-visible`, ARIA nos controles, menu mobile com teclado (`Escape`)
- SEO: Open Graph, Twitter Cards, JSON-LD (`Person`), canonical
- Imagens otimizadas em WebP (7 MB → ~1 MB)
- Botão "voltar ao topo" e copiar e-mail

## Executar localmente

Abra o `index.html` no navegador ou sirva com um servidor local:

```bash
# Python
python -m http.server 8000

# ou Node
npx serve .
```

## Deploy

O site é estático e publicado no GitHub Pages pelo workflow em `.github/workflows/deploy.yml` (push na branch `main`).

## Estrutura

```
├── index.html        # Página principal
├── style.css         # Estilos (tema dark, responsivo)
├── script.js         # Menu, carrosséis, reveal, extras
├── 404.html          # Página de erro temática
├── imagem/           # Fotos e capturas dos projetos (WebP/PNG)
├── arquivos/         # Currículo (curriculo.pdf)
└── .github/workflows # Deploy GitHub Pages
```

## Contato

- GitHub: [Rodriguesoseas](https://github.com/Rodriguesoseas)
- LinkedIn: [oseasrodrigues-dev](https://www.linkedin.com/in/oseasrodrigues-dev/)