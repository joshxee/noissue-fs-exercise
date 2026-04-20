# System Design — noissue Checkout Exercise

## Overview

A full-stack ecommerce checkout flow that reads a static cart fixture, lets a user submit for checkout, and displays one purchase order per supplier on a confirmation page.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Bun |
| Backend framework | Elysia (TypeScript) |
| ORM | Drizzle ORM |
| Database | SQLite (in-memory) |
| Frontend | React 19, React Router v7 |
| Styling | Tailwind CSS v4 |
| Testing | Playwright (e2e) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│                                                     │
│  ┌──────────────┐    router state   ┌─────────────┐ │
│  │ /checkout    │ ────────────────▶ │/confirmation│ │
│  │              │  {purchaseOrders, │             │ │
│  │ fetch cart   │   shippingAddr}   │ display POs │ │
│  │ on mount     │                   │ from state  │ │
│  └──────┬───────┘                   └─────────────┘ │
│         │ fetch / POST                              │
└─────────┼─────────────────────────────────────────--┘
          │
┌─────────▼───────────────────────────────────────────┐
│                Elysia Server (:3000)                │
│                                                     │
│  GET  /api/cart      ──▶ cartRoute                  │
│  POST /api/checkout  ──▶ checkoutRoute              │
│  GET  /dist/*        ──▶ static file plugin         │
│  GET  /*             ──▶ index.html (SPA fallback)  │
│                                                     │
│  startup: seedDatabase() reads cart.json → SQLite   │
└─────────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────┐
│              In-Memory SQLite                       │
│                                                     │
│  suppliers · products · cart_items                  │
│  shipping_fees · purchase_orders                    │
│  purchase_order_items                               │
└─────────────────────────────────────────────────────┘
```

The server serves the compiled frontend bundle from `public/dist/` via `@elysiajs/static`. React Router handles client-side routing; unknown paths fall through to `index.html`.

---

## Data Model

### `suppliers`
| Column | Type | Notes |
|---|---|---|
| id | TEXT (PK) | Normalised from cart.json — leading zeros stripped |
| name | TEXT | e.g. "ACME Printing Co." |

### `products`
| Column | Type | Notes |
|---|---|---|
| sku | TEXT (PK) | e.g. "SKU001" |
| type | TEXT | "Custom" or "Stocked" |
| name | TEXT | |
| description | TEXT | Nullable |

### `cart_items`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER (PK, auto) | |
| product_sku | TEXT (FK → products) | |
| supplier_id | TEXT (FK → suppliers) | |
| quantity | INTEGER | |
| currency | TEXT | "NZD" |
| symbol | TEXT | "$" |
| total | REAL | Line item price in NZD |

### `shipping_fees`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER (PK, auto) | |
| supplier_id | TEXT (FK → suppliers) | One row per supplier |
| currency | TEXT | |
| symbol | TEXT | |
| total | REAL | Per-supplier shipping cost in NZD |

### `purchase_orders`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER (PK, auto) | Used to generate the order reference shown to the user |
| supplier_id | TEXT (FK → suppliers) | One PO per supplier |
| item_total | REAL | Sum of all item totals for this supplier |
| shipping_fee | REAL | Supplier-specific shipping fee |
| order_total | REAL | item_total + shipping_fee |
| currency | TEXT | |
| symbol | TEXT | |

### `purchase_order_items`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER (PK, auto) | |
| po_id | INTEGER (FK → purchase_orders) | |
| product_sku | TEXT | |
| quantity | INTEGER | |
| total | REAL | |

---

## API Endpoints

### `GET /api/cart`

Returns cart contents grouped by supplier, with product and supplier names joined in application code.

**Response**
```json
{
  "success": true,
  "data": {
    "suppliers": [
      {
        "supplierId": "1",
        "supplierName": "ACME Printing Co.",
        "products": [
          {
            "sku": "SKU001",
            "name": "Custom Tissue",
            "description": "1000 pieces, standard size...",
            "type": "Custom",
            "quantity": 1000,
            "currency": "NZD",
            "symbol": "$",
            "total": 300.00
          }
        ],
        "subtotal": 840.00,
        "currency": "NZD",
        "symbol": "$"
      }
    ],
    "grandTotal": 1834.00,
    "shippingTotal": 50.00,
    "currency": "NZD",
    "symbol": "$"
  }
}
```

---

### `POST /api/checkout`

Processes the checkout: groups cart items by supplier, creates one purchase order per supplier, and returns the generated orders. Takes no request body — the cart is the authoritative source of truth in the database.

**Response**
```json
{
  "success": true,
  "data": {
    "purchaseOrders": [
      {
        "poId": 1,
        "supplierId": "1",
        "supplierName": "ACME Printing Co.",
        "items": [
          {
            "poId": 1,
            "productSku": "SKU001",
            "quantity": 1000,
            "total": 300.00,
            "productName": "Custom Tissue",
            "productType": "Custom"
          }
        ],
        "itemTotal": 840.00,
        "shippingFee": 20.00,
        "orderTotal": 860.00,
        "currency": "NZD",
        "symbol": "$"
      }
    ]
  }
}
```

**Processing steps (in `processCheckout`)**

1. Load all cart items, shipping fees, products, and suppliers from SQLite
2. Build `Map<supplierId, cartItems[]>` by iterating cart items once
3. For each supplier group:
   - Sum item totals
   - Look up per-supplier shipping fee
   - Compute `orderTotal = itemTotal + shippingFee`
   - Insert row into `purchase_orders`, capture auto-incremented `poId`
   - Insert rows into `purchase_order_items`
4. Return enriched PO objects (with `supplierName`, `productName`, `productType` joined from lookup maps)

**Error response**
```json
{ "success": false, "error": "Failed to process checkout" }
```

---

## Frontend Data Flow

```
Checkout page mounts
  → GET /api/cart
  → renders 6 real products across 4 suppliers in Order Archive sidebar
  → shows NZD subtotal, shipping, and total calculated from API response

User fills delivery/payment form → clicks "Pay now"
  → POST /api/checkout
  → on success: navigate('/confirmation', { state: { purchaseOrders, shippingAddress } })

Confirmation page reads location.state
  → renders purchase orders grouped by supplier with real totals
  → renders shipping address entered in the form
  → displays order reference derived from first PO id: e.g. #NI-0001-ECO
  → if location.state is absent (direct navigation or page refresh) → redirect to /
```

Form data (name, address) is captured as controlled React state and passed via React Router's `location.state`. It is never sent to the backend.

---

## Key Architectural Decisions

### In-memory SQLite, seeded on startup
The database initialises fresh from `cart.json` on every server start. This eliminates migration complexity for the exercise scope while still using a proper relational schema through Drizzle ORM. The trade-off is that no data is persisted across restarts.

### Supplier ID normalisation
`cart.json` has a format inconsistency: product `supplierId` values use zero-padded 5-digit strings (`"00001"`) while `shippingFees.supplierShippingFees` uses 4-digit strings (`"0001"`). Both are normalised to bare integer strings (`"1"`) by stripping leading zeros at seed time, so joins work uniformly throughout the system.

### One purchase order per supplier
Cart items are grouped by `supplierId` into a `Map` before any database writes. Each supplier group produces exactly one `purchase_orders` row and N `purchase_order_items` rows. The shipping fee is applied at the supplier level, not globally.

### No request body on `POST /api/checkout`
The checkout endpoint reads the cart entirely from the database rather than accepting item lists in the request body. This prevents client-side cart manipulation and keeps the backend as the single authoritative source of what is being purchased.

### Router state for confirmation data
Purchase orders and the shipping address are passed to the confirmation page via React Router's `navigate(path, { state })`. This avoids a second API call and the need to persist order data server-side between requests. The trade-off is that refreshing `/confirmation` loses the state — the page handles this gracefully by redirecting to `/`.

### Application-level joins
Both `GET /api/cart` and `processCheckout` join tables in application code using `Map` lookups rather than SQL `JOIN` clauses. Given the dataset is small and fully in-memory, this performs equivalently to SQL joins and is simpler to read. A persistent database with large datasets would warrant SQL joins instead.

---

## Cart Data Summary

| Supplier | Products | Items Total | Shipping | Order Total |
|---|---|---|---|---|
| ACME Printing Co. | Custom Tissue ×2 | $840 | $20 | $860 |
| European Printing Co. | Custom Stamp Creator ×1 | $44 | $10 | $54 |
| AU 3PL Co. | Recycled Mailer, Compostable Mailer | $600 | $10 | $610 |
| US 3PL Co. | Compostable Shipping Labels | $350 | $10 | $360 |
| **Total** | **6 products** | **$1,834** | **$50** | **$1,884 NZD** |

---

## Known Limitations (exercise scope)

- **No idempotency on checkout** — calling `POST /api/checkout` twice creates duplicate purchase orders. The submit button is disabled client-side during the in-flight request but there is no server-side guard.
- **State lost on refresh** — the confirmation page redirects to `/` if `location.state` is absent. A production implementation would persist orders by ID and expose `GET /api/orders/:id`.
- **Single global cart** — there is no user session concept; the cart is fixed at server startup.
- **No payment processing** — the payment method selection (Credit Card / PayPal) is UI-only.
