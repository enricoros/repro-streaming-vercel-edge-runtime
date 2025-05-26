# Repro instructions
This 

1. Deploy on Vercel
  - Log in to Vercel and go to the [Vercel Dashboard](https://vercel.com/dashboard).
  - `New Project`
  - Import this git repository, or a a clone of it.
  - Click on `Deploy`.
  - Wait for the deployment to finish and click on the link.

# Next.js Edge Runtime + tRPC

This example is the same as [next-minimal-starter](../next-minimal-starter/), excepts that it uses the [Next.js Edge Runtime](https://nextjs.org/docs/api-reference/edge-runtime) using tRPC's fetch adapter.

## Setup

```bash
npx create-next-app --example https://github.com/trpc/trpc --example-path examples/next-edge-runtime trpc-next-edge-runtime
cd trpc-next-edge-runtime
npm i
npm run dev
```

## Development

### Start project

```bash
npm run dev        # starts next.js
```
