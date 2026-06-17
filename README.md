# Celeste_Connectors_KHs_Spaces_Selector_Exploration

A Next.js project using the App Router and the [Intapp Design System (IDS)](https://zeroheight.com/2f4c431de/v/latest/p/5796af-developer-guidance).

## Getting started

**1. Install dependencies**

```bash
npm install
```

**2. Start the dev server**

```bash
npm run dev
```

## Project structure

```
app/
├── layout.jsx    # Root layout — wraps all pages
├── page.jsx      # Home page
└── globals.css   # Global styles
next.config.js    # Next.js configuration
```

## IDS packages

| Package | Purpose |
|---|---|
| `@ids/react-next` | IDS React components optimised for Next.js |

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## CI/CD

`azure-pipelines.yml` is pre-configured to build and deploy to Azure Static Web Apps. Link the `npm-artifactory` variable group in Azure DevOps with your `NPM_AUTH_TOKEN` and `AZURE_SWA_TOKEN` before running the pipeline.

## Deployment

This template deploys to **Azure App Service** as a Next.js SSR app (Node 22, Linux). Pushes to `main` trigger a build + deploy via the Azure DevOps pipeline (`azure-pipelines.yml`). The pipeline:

1. Builds with `output: 'standalone'`, packages `.next/standalone` + `.next/static` + `public`
2. Idempotently ensures a Web App named `<author-handle>-<project-name>` exists in the `product-design` resource group, under the shared `asp-product-design-prototypes` plan
3. Applies the Intapp VPN access restriction (`10.126.0.0/16`)
4. Deploys the zip via `AzureWebApp@1`

The resulting URL is `https://<author-handle>-<project-name>.azurewebsites.net` — reachable only from the Intapp VPN.

### One-time prerequisites (per team, not per project)

These are set up once for the team and are **not** automated by this template:

1. **Shared App Service Plan exists in `product-design` resource group**:
   ```bash
   az appservice plan create \
     -g product-design \
     -n asp-product-design-prototypes \
     --sku B1 \
     --is-linux \
     --location eastus
   ```
2. **The `Playground 1` Azure DevOps service connection has `Contributor` on the `product-design` resource group.** Ask the devx team to grant this if it's not already in place. The pipeline will fail with a permissions error on first deploy if it isn't.

If either prereq is missing, builds still succeed but the Deploy stage fails with a clear error from `az webapp create` or `AzureWebApp@1`.
