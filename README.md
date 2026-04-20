# noissue checkout exercise

A full-stack ecommerce checkout flow built with Elysia (Bun) and React.

The app renders a two-page checkout: a checkout form that groups cart items by supplier, and a confirmation page that displays the generated purchase orders (one per supplier). On submit the backend groups cart items by `supplierId`, records a purchase order per supplier, clears the cart, and returns the orders to the frontend.

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.0

## Install

```bash
bun install
```

## Development

```bash
bun run dev
```

Opens at http://localhost:3000

## Tests

```bash
# Unit + integration tests (Bun test runner)
bun run test

# E2E tests (Playwright — install browsers first if needed)
bunx playwright install
bun run test:e2e
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | HTTP port the server binds to |

Copy `.env.example` to `.env` and adjust as needed.

## Architecture

```
src/
  index.ts          # Elysia server entry — mounts routes and lifecycle hooks
  db/               # Drizzle schema, in-memory SQLite, seed data
  routes/           # Thin HTTP handlers (cart, checkout)
  services/         # Business logic (cart seeding, checkout processing)
  tests/            # Unit and route-level integration tests

public/
  index.tsx         # React entry — React Router setup
  pages/
    checkout/       # Checkout page split into focused modules
      Checkout.tsx      # Layout + composition
      CheckoutForm.tsx  # Left-column form sections
      OrderSummary.tsx  # Sticky right-column cart display
      useCart.ts        # Cart data fetching hook
      useCheckoutForm.ts # Form state, validation, submit logic
    OrderConfirmation.tsx
    Store.tsx
  types/api.ts      # Shared request/response types
  lib/sessionOrders.ts

e2e/
  checkout.pw.ts    # Playwright end-to-end tests
```

**Backend**: Elysia + Drizzle ORM + SQLite (in-memory via `bun:sqlite`). All data resets on server restart — no persistence layer.

**Frontend**: React 19 + React Router 7, bundled by Bun's built-in bundler with Tailwind CSS 4.

## Known limitations

- In-memory SQLite resets on every server restart; there is no persistent database.
- Card validation (Luhn check, expiry) is frontend-only — the backend does not re-validate payment details.
- The discount code field in the order summary is UI-only and has no backend implementation.
