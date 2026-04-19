# Design System Philosophy: The Clinical Curator

This design system is not a template; it is a framework for precision. While the foundation is rooted in functional e-commerce and SaaS logic, the execution moves beyond the generic "blue-and-gray" box. We define this aesthetic as **"The Clinical Curator."** 

It is characterized by surgical cleanliness, high-contrast typographic rhythm, and depth achieved through tonal layering rather than structural lines. We are moving away from the "standard" 1px border approach to embrace a more sophisticated, editorial-inspired layout where space and surface shifts dictate the user’s journey.

---

## 1. Creative North Star: Precision & Transparency
The "Clinical Curator" approach treats every product and data point as an exhibit. 
- **Intentional Asymmetry:** Break the rigid 8px grid occasionally with oversized typography or offset images to prevent the "SaaS-template" feel.
- **Breathing Room:** Use aggressive whitespace. If a section feels "clean," add 16px more padding. Luxury is defined by the space you choose not to use.
- **Tonal Depth:** We do not use "gray." We use "neutrals with a soul"—utilizing the `surface` tokens to create a world that feels physical and layered.

---

## 2. Color & Surface Architecture
Our palette centers on a high-energy Blue (`#2563eb`) paired with a sophisticated hierarchy of neutral surfaces.

### The "No-Line" Rule
Standard UI relies on 1px borders to separate sections. This design system **prohibits** 1px solid borders for sectioning. Boundaries must be defined through background color shifts. 
- *Example:* A `surface-container-low` section sitting on a `surface` background provides a sophisticated, "borderless" separation.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. Use the following tiers to define depth:
- **Surface (Base):** The foundation of the page (`#f7f9fb`).
- **Surface-Container-Low:** Use for secondary content areas or sidebars.
- **Surface-Container-Lowest:** Specifically for cards or "hero" modules that need to pop against a darker section.
- **Surface-Container-Highest:** Reserved for interactive elements like input fields or hover states.

### The "Glass & Gradient" Rule
To elevate the primary CTA (`#2563eb`), use a subtle linear gradient transitioning to `#004ac6`. For floating navigation or modals, utilize **Glassmorphism**: 
- **Token:** Semi-transparent `surface` color.
- **Effect:** 20px–40px backdrop-blur. 
This integrates the component into the environment rather than making it look "pasted on."

---

## 3. Typography: Editorial Authority
We utilize **Inter** not just for legibility, but as a brand signature.

- **Display Scale (`display-lg` to `display-sm`):** Use these for high-impact marketing moments. Set letter-spacing to `-0.02em` to create a "tight," premium editorial look.
- **Headline & Title:** These are your structural anchors. Ensure a clear contrast; a `headline-lg` should feel significantly more authoritative than a `title-md`.
- **Labels:** Use `label-md` and `label-sm` sparingly for metadata. These should be in `on-surface-variant` to recede visually, allowing the `body` text to lead.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." This design system uses **Ambient Light** and **Tonal Layering**.

- **The Layering Principle:** Avoid shadows for static components. Instead, stack `surface-container-lowest` on `surface-container-low`. The 2% shift in value is enough for the human eye to perceive depth.
- **Ambient Shadows:** For floating elements (Modals/Popovers), use a "Long-Soft" shadow: `0 20px 50px rgba(25, 28, 30, 0.06)`. The shadow color should be a tinted version of `on-surface` (dark blue-gray), never pure black.
- **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the "Ghost" method: `outline-variant` at **15% opacity**. It provides a suggestion of a boundary without cluttering the visual field.

---

## 5. Component Logic

### Buttons (The Kinetic Point)
- **Primary:** Gradient from `primary_container` to `primary`. 0.25rem (sm) or 0.5rem (lg) corner radius.
- **Secondary:** Transparent background with a "Ghost Border" and `primary` text.
- **Tertiary:** No background or border. Use for low-priority actions like "Cancel" or "Learn More."

### Input Fields
Avoid the "white box with a gray border." Use `surface-container-highest` as the fill with a 1px "Ghost Border." On focus, transition the border to `primary` with a 2px outer "glow" using a 10% opacity version of the primary blue.

### Cards & Lists
**Strict Rule: No Divider Lines.** 
Separate list items using `8px` or `16px` of vertical whitespace. For cards, use the shift between `surface-container-lowest` and the background to define the container. 

### The "Checkout Summary" Veil (Custom Component)
For e-commerce contexts, use a sticky summary panel utilizing the **Glassmorphism** rule. This keeps the user’s total visible while allowing the product list to scroll "under" the frosted surface, maintaining a sense of transparency and trust.

---

## 6. Do’s and Don’ts

### Do
- **Do** align everything to the 8px grid, but feel free to use 128px+ margins for "hero" content to create an upscale editorial feel.
- **Do** use `primary_container` (#2563eb) for interactive elements to guide the eye surgically.
- **Do** ensure all text meets WCAG AA standards by checking `on-surface` against your chosen `surface` tier.

### Don’t
- **Don’t** use 100% black text. Use `on-surface` (#191c1e) for a softer, more professional "ink" feel.
- **Don’t** use "Drop Shadows" on buttons. Use a slight color darken on hover to indicate interactivity.
- **Don’t** use dividers or "HR" tags. If you need a break, use a background color change or increased whitespace.
