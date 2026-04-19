# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Exercise Overview

This is a full-stack candidate exercise for noissue. The task is to build an ecommerce checkout flow with two pages:

1. **Checkout Page** — displays `cart.json` contents (products grouped by supplier, prices in NZD), with a Submit button
2. **Confirmation Page** — displays generated purchase orders (one per supplier, with products and totals)

The backend should group cart items by `supplierId` and generate a purchase order per supplier on checkout. `cart.json` at the repo root is the data source — 6 products across 4 suppliers with per-supplier shipping fees.

## Stack

- **Runtime/bundler**: Bun
- **Backend framework**: Elysia (TypeScript, `src/index.ts`)
- **TypeScript**: strict mode, ES2022 modules, `bun-types`

## Commands

All commands run from the repo root:

```bash
bun run dev        # Start dev server with file watching on http://localhost:3000
bun run test       # (not yet configured)
```

## Architecture

The app lives at the repo root. `src/index.ts` is the Elysia server entry point. `public/` holds the frontend (React/TSX). The static plugin serves `public/` via an explicit path resolved relative to `src/index.ts`.

Key design constraint: checkout must produce **one purchase order per supplier**, not one global order. The `supplierId` field on each product in `cart.json` is the grouping key. Shipping fees in `cart.json` are also per-supplier (`shippingFees.supplierShippingFees`), matched by `supplierId`.

Note: there is a `supplierId` format inconsistency in `cart.json` — products use zero-padded 5-digit IDs (`"00001"`) while `shippingFees.supplierShippingFees` uses 4-digit IDs (`"0001"`). Normalise when joining.
