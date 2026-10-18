# Signal Journal

A responsive AI and technology editorial website built with React, TypeScript, Vite, and Express. The included articles are AI-generated sample content, clearly labeled in the interface; they are not live reporting. Set a GNews API key to replace the sample feed with links to current publisher stories.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```powershell
cd web
npm install
Copy-Item .env.example .env
# Optional: add your GNews API key to .env as GNEWS_API_KEY=...
npm run dev
```

Vite serves the site at `http://localhost:5173`. Its `/api` requests are proxied to the Express API at port `8787`. Without an API key, the interface stays in sample-edition mode. Get a key from [GNews](https://gnews.io/); the key is read only by the server and is never bundled into client code.

## Production build

```powershell
npm run build
npm run preview
```

The Vite build outputs static client assets to `dist/`. To use live news in production, deploy the Express endpoint (`server/index.mjs`) alongside the client and configure `GNEWS_API_KEY` and `API_PORT`; point `/api` requests to that service. Do not expose the provider key in a `VITE_` variable.

## Features

- Home, latest, trending, categories, topic, article, search, bookmarks, about, and contact routes
- Search across article titles, summaries, tags, and categories
- Persistent theme and bookmark preferences in local storage
- Newsletter UI with local browser persistence and a contact form with a local confirmation state
- Share sheet on supported browsers, clipboard fallback, related stories, pagination, loading skeletons, empty states, and reduced-motion support
- Responsive dark and light themes, keyboard-visible focus, semantic forms and navigation, page titles, and social metadata

## News data and forms

The included sample stories are fictional, AI-generated examples and never presented as real-time news. When configured, the server calls GNews and returns provider-sourced headlines with their original publisher links. Newsletter addresses and contact submissions are only handled locally in this demo; connect a mailing-list provider and form backend before collecting real submissions.
