# Historical Knowledge Graph

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Dashboard aplikasi untuk eksplorasi Historical Knowledge Graph dengan 3 fitur utama:

- **Cypher Query** (Available) - Query data menggunakan bahasa Cypher
- **Search** (Coming Soon) - Cari tokoh atau peristiwa sejarah
- **Infobox** (Coming Soon) - Tampilkan detail tokoh dan event sejarah

## Struktur Direktori

```
app/
├── data/           # Data statis untuk aplikasi
│   └── features.ts # Data fitur-fitur knowledge graph
├── pages/          # Halaman-halaman aplikasi
│   ├── index.vue   # Dashboard utama
│   └── cypher/     # Halaman Cypher Query
├── components/     # Komponen Vue reusable
├── types/          # Type definitions TypeScript
│   └── feature.ts  # Interface Feature
├── layouts/        # Layout aplikasi
│   └── default.vue # Layout default sederhana
└── assets/
    └── css/        # Global CSS
```

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
