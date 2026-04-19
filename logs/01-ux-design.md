User: Create a prompt to create a minimal but professional ux design for the practical exercise described here. This prompt should be highly specialised to be used on a ux designing agent and make a professional looking ecommerce flow, while avoiding common "ai" ui anti patterns

GitHub Copilot: Create a minimal but professional UX design for an ecommerce checkout flow based on the following requirements:

**Context:**
- This is a mockup for a web ecommerce checkout experience.
- The app displays a customer cart, allows submitting for checkout, and shows a confirmation page.
- Cart data includes 6 products from 4 suppliers, with prices and shipping in NZD.
- Checkout generates one purchase order per supplier.
- Focus on clean, user-friendly design that feels like a real ecommerce site (e.g., similar to Shopify or Amazon but simplified).

**Pages to Design:**
1. **Checkout Page:** Display cart contents (products, quantities, prices, shipping per supplier). Include a "Submit" button for checkout.
2. **Confirmation Page:** Display the generated purchase orders (one per supplier, showing products and totals).

**Design Guidelines:**
- **Minimalism:** Use whitespace effectively, limit to essential elements only. Avoid clutter, excessive animations, or decorative elements.
- **Professional Aesthetics:** Clean typography (sans-serif fonts like Inter or Roboto), consistent spacing (8px grid), subtle shadows/borders for depth, neutral color palette (grays, whites, accent for CTAs like blue or green).
- **Usability:** Clear hierarchy (headings, subheadings), scannable layout, intuitive navigation. Ensure mobile-responsive design.
- **Ecommerce Best Practices:** Show itemized pricing, totals, supplier groupings. Use standard icons (cart, checkmark) sparingly.
- **Avoid AI Anti-Patterns:** No generic stock photos, unrealistic layouts, over-styled buttons, or trendy gimmicks. Prioritize functionality over novelty. Ensure designs look human-crafted, not templated.

**Output Format:**
- Provide wireframes or mockups for each page (describe in detail or use simple sketches if possible).
- Include rationale for design choices, focusing on user experience and conversion optimization.
- Suggest any micro-interactions or states (loading, success) if relevant, but keep minimal.

Ensure the design supports the backend flow where checkout creates supplier-specific purchase orders.

User: Remove these overly specific details which aren't necessary for the UX and are more important for the backend: Cart data includes 6 products from 4 suppliers, with prices and shipping in NZD.
Checkout generates one purchase order per supplier.

Also remove the output format and assume the agent know what kind of output it should give

GitHub Copilot: Create a minimal but professional UX design for an ecommerce checkout flow based on the following requirements:

**Context:**
- This is a mockup for a web ecommerce checkout experience.
- The app displays a customer cart, allows submitting for checkout, and shows a confirmation page.
- Focus on clean, user-friendly design that feels like a real ecommerce site (e.g., similar to Shopify or Amazon but simplified).

**Pages to Design:**
1. **Checkout Page:** Display cart contents (products, quantities, prices, shipping per supplier). Include a "Submit" button for checkout.
2. **Confirmation Page:** Display the generated purchase orders (one per supplier, showing products and totals).

**Design Guidelines:**
- **Minimalism:** Use whitespace effectively, limit to essential elements only. Avoid clutter, excessive animations, or decorative elements.
- **Professional Aesthetics:** Clean typography (sans-serif fonts like Inter or Roboto), consistent spacing (8px grid), subtle shadows/borders for depth, neutral color palette (grays, whites, accent for CTAs like blue or green).
- **Usability:** Clear hierarchy (headings, subheadings), scannable layout, intuitive navigation. Ensure mobile-responsive design.
- **Ecommerce Best Practices:** Show itemized pricing, totals, supplier groupings. Use standard icons (cart, checkmark) sparingly.
- **Avoid AI Anti-Patterns:** No generic stock photos, unrealistic layouts, over-styled buttons, or trendy gimmicks. Prioritize functionality over novelty. Ensure designs look human-crafted, not templated.

Ensure the design supports the backend flow where checkout creates supplier-specific purchase orders.