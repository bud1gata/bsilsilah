---
name: Heritage & Lineage
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#725c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba829'
  on-tertiary-container: '#4e3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffe081'
  tertiary-fixed-dim: '#e8c344'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#564500'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  h1:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  h2:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  tree-node-gap: 32px
  container-max: 1280px
---

## Brand & Style
The design system is anchored in the concepts of **Continuity, Trust, and Growth**. It is designed to feel like a modern digital archive—merging the gravitas of a historical library with the efficiency of a high-end SaaS platform. 

The aesthetic follows a **Modern Minimalist** movement with a focus on high-quality typography and intentional whitespace. It avoids unnecessary ornamentation to ensure that the user’s family data and photography remain the focal point. The interface should evoke a sense of calm and permanence, reassuring users that their family legacy is being preserved with care and precision.

## Colors
The palette is built on a foundation of **Deep Navy (#0F172A)** to establish authority and trust. This is complemented by **Slate Blues** which handle the majority of the UI's secondary information and borders.

To breathe life into the "heritage and growth" narrative, two specific accents are employed:
- **Heritage Gold (#B59410):** Used sparingly for significant historical milestones, premium features, or "ancestor" highlights.
- **Growth Green (#4D7C0F):** Used for adding new family members, active life events, and success states.

The background is a very light cool-grey to reduce eye strain during long research sessions, while white surfaces represent individual "record" cards.

## Typography
This design system utilizes a sophisticated typographic pairing to bridge the gap between history and technology.

- **Noto Serif** is used for all major headings. Its classic proportions evoke the feel of traditional printed genealogies and historical documents.
- **Manrope** is used for all functional UI elements, body text, and data entry. Its geometric yet humanist qualities ensure high readability on small screens and within dense family tree nodes.

Type hierarchy should be strictly maintained to guide the user through complex data structures. Use sentence case for most labels to maintain a friendly, approachable tone.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Navigation and sidebars are fixed, while the primary canvas—the Family Tree—is a fluid, pannable space. 

A 12-column grid is used for dashboard and profile views, while the tree itself utilizes a structured "logic-flow" layout. Spacing follows an 8px rhythmic scale. Generous margins (48px+) are encouraged around major card groupings to prevent the interface from feeling cluttered, emphasizing the "Minimalist" brand pillar. For mobile responsiveness, gutters collapse to 16px and cards stack vertically.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layers** and **Ambient Shadows**. 

- **Level 0 (Canvas):** The base background layer (#F8FAFC).
- **Level 1 (Cards):** Standard nodes and content blocks use a white surface with a very soft, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
- **Level 2 (Interaction):** Hovered cards or active modals increase shadow spread and slightly lift (0px 8px 24px rgba(15, 23, 42, 0.1)).

The "Connecting Lines" for the tree should be placed on Level 0, using a 2px solid stroke in `secondary_color` to appear as if they are etched into the background, beneath the family member cards.

## Shapes
The shape language is **Soft and Precise**. A 0.25rem (4px) base radius is applied to standard buttons and input fields to maintain a professional, slightly formal appearance. 

For **Family Member Cards**, a larger `rounded-lg` (8px) radius is used to make the people-centric data feel more approachable. Avatars within these cards should be strictly circular to contrast against the rectangular grid of the tree, signifying the "organic" nature of the family members versus the "structural" nature of the data.

## Components
- **Family Node Cards:** The core component. Minimalist white containers with a circular avatar on the left, Name (Serif H3), and Lifespan (Sans-Serif Caption). No heavy borders; use the Level 1 shadow for definition.
- **Action Buttons:** Primary buttons use the Deep Navy background with white text. Secondary buttons use a ghost style with a Slate Blue border.
- **Tree Connectors:** 2px strokes with rounded corners. Use "Heritage Gold" to highlight a direct bloodline and "Slate Blue" for collateral branches.
- **Data Chips:** Small, low-contrast pills (Soft Blue background) used for tags like "Verified Record" or "Military Service."
- **Input Fields:** Clean, underlined or lightly bordered fields that focus into a Deep Navy state.
- **Relationship Indicators:** Subtle icons (e.g., rings for marriage, leaf for children) placed on the connecting lines rather than inside the cards to keep the nodes clean.