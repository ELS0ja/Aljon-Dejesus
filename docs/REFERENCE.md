# Reference inventory

Inspected on 24 October 2026 (Asia/Manila).

- Editor: https://www.magicpatterns.com/c/5czw9gfzccev6j4nz6n6qc
- Public portfolio preview: https://d6bd3c87-19e4-45ce-afcb-bc5fae5356b4-render.magicpatterns.app/
- Original artifact: `d6bd3c87-19e4-45ce-afcb-bc5fae5356b4`, version 1.
- The embedded preview measured **862 × 902 CSS pixels**, at x=9, y=89, in a **1440 × 1000** Chrome browser viewport. It uses the narrow layout at this size.
- Source was read from the successful public artifact response used by the page's Code panel. It includes actual component and data contents, not just a file tree.
- The six shared component entries (`Badge`, `Button`, `Dialog`, `Input`, `Label`, `Textarea`) have empty source bodies. Their implementation was recovered from `sourcesContent` in the publicly served compiled source map under `_designSystem/.../library.js`. The original bundled library is retained with thin typed re-exports. No inaccessible private design-system endpoint was bypassed.
- The compiled reference CSS was downloaded from the public preview bundle. Only remote font imports were replaced with local font declarations. The original stylesheet input and Tailwind configuration are also retained.

## Typography and geometry

- Body and headings: **Plus Jakarta Sans**, weights 400–800, actual Google Fonts files preserved. The source also imports **Geist**; it remains available. Code and mono labels use **Geist Mono**.
- Content container: `max-w-6xl` (1152px); horizontal padding 20px, increasing to 32px at 640px.
- Header: fixed, 64px tall; desktop navigation begins at **1024px**. The mobile toggle closes on Escape, selection, and resizing to desktop.
- Hero: top padding 112px / 144px from 640px; bottom padding 80px / 112px. Two columns begin at 1024px; the code card stacks beneath the introduction below that width.
- Standard sections: 96px vertical padding, increasing to 112px at 640px. Alternating sections use `bg-surface/40` and a top border.
- Skills: two columns from 768px. Project cards: one column below 768px, two from 768px, three from 1024px; 24px grid gaps.
- Main breakpoints in the preserved CSS: 640, 768, 1024, 1280, and 1536px.
- The prompt's palette agrees with the source's RGB tokens: base `#0B0F19`, surface `#111827`, panel `#151C2C`, blue `#60A5FA`, violet `#A78BFA`, ink `#F8FAFC`, subtle `#94A3B8`, line `#273449`, success `#34D399`, danger `#F87171`.
- Dialog: original centered shared component, responsive width, `sm:max-w-2xl`, `max-height:90vh`, inner scrolling, original translucent blurred backdrop, and original close button.
- Illustrations are original CSS/JSX layouts; there are no stock-image replacements. Icon packages and dependency versions are retained from the original package manifest.
- Reveal duration: 500ms. Project filter transitions: 250ms. Mobile menu: 200ms. Grid drift: 14s. Glow: 9s. Original reduced-motion rules and Framer Motion preference handling are retained.

## Content and states

All seven sections were inspected in order: Home, About, Skills, Projects, Practical Experience, Education, Contact, followed by the footer. Certifications have no entries and are hidden. Placeholder notes remain visible.

Projects retain their exact order, problem statements, descriptions, feature lists, contribution placeholders, technology tags, illustrative thumbnails, repository placeholders, and example status:

1. Student Management System — Full-Stack.
2. Personal Task Management App — Full-Stack.
3. Online Portfolio & Project Showcase — Full-Stack.
4. Inventory REST API — Backend.
5. Responsive Landing Page — Frontend.

The All/Frontend/Backend/Full-Stack counts are 5/1/1/3. Searching matches titles, descriptions, and technologies and composes with category filtering. Result announcements, the empty state, reset control, project dialogs, contact validation, character counter, and mobile navigation were exercised.

`storage/app/visual-qa/reference/inventory.json` records observed section classes, computed fonts, stylesheets, preview dimensions, and complete rendered text. Reference captures include full pages, each section, footer, mobile menu, category selection, empty search, project dialog, contact validation, hover, and keyboard focus.

## Necessary migration changes

- Project values are serialized from Eloquent into the original gallery. Example data is seeded exactly and remains marked as example content.
- The contact hook uses Laravel rather than local storage. Its initial markup, error layout, labels, and controls are preserved. Success copy now confirms database storage instead of browser-only preview storage.
- CV activation checks the real Laravel download route and explains when no PDF is configured. The reference's placeholder text download is removed.
- The original shared dialog renders no dialog role and has no focus trap or Escape handler. A small wrapper supplies ARIA labeling, initial focus, keyboard focus containment, Escape closing, and focus restoration without changing the visual component.

No portfolio source, font, thumbnail, or public section remains inaccessible. The limitations in the verification report concern the extent of browser coverage and intentional backend differences.
