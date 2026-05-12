# Savoria Restaurant — Project Report

## 1. Domain Selected
**Restaurant Management System** — A fine-dining restaurant website for "Savoria", a fictional upscale Kerala-cuisine restaurant located in Fort Kochi, India.

---

## 2. Page Structure Overview

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Landing page with hero, chef specials, menu preview, testimonial slider, CTA |
| Menu | `menu.html` | Full menu with category filter, search, cart, bill calculator, nutrition popup |
| Reservation | `reservation.html` | Table booking form, package selector, star rating, history table |
| About | `about.html` | Story timeline, team cards, values, awards, gallery |
| Contact | `contact.html` | Contact form, FAQ accordion, subject chip selector, map placeholder |

---

## 3. Features Implemented

### Core HTML Features
- Semantic elements: `<nav>`, `<header>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- HTML5 form controls: `text`, `email`, `tel`, `number`, `date`, `time`, `select`, `textarea`, `radio`, `checkbox`, `search`, `range`, `hidden`
- `<table>` for reservation history display
- Responsive `<meta viewport>` tag
- Proper page `<title>` and document structure on all 5 pages

### CSS — All Three Types Used
**Inline CSS** (in HTML files):
- Hero `text-shadow` on `index.html`
- Grid column overrides on `about.html`
- Dynamic styles set via JavaScript (cart sidebar, mobile nav)

**Internal CSS** (`<style>` blocks in each page):
- `index.html` — About split layout, specials grid, testimonial slider styles
- `menu.html` — Dietary badges, filter tabs, nutrition popup
- `reservation.html` — Hours table, package cards, policy list
- `about.html` — Timeline, values grid, awards list, gallery
- `contact.html` — Contact info cards, FAQ accordion, subject chips

**External CSS** (`css/style.css` — 780 lines):
- CSS custom properties (variables) for full theming
- Complete component library: navbar, hero, cards, buttons, forms, table, footer, cart
- Animations: `fadeUp`, scroll reveal via IntersectionObserver
- Responsive breakpoints at 900px and 680px
- Google Fonts import (Cormorant Garamond + Josefin Sans)

### JavaScript Features (`js/main.js` — 496 lines)

**Form Validation:**
- `Validator` utility object with reusable rules: `required`, `email`, `phone`, `minLen`, `maxLen`, `future`, `min`, `max`
- Live inline validation on blur + on input
- Full submission validation with error highlighting
- Reservation form: 6 fields validated
- Contact form: 4 fields validated

**Event Handling:**
- Navbar scroll effect (`scroll` event)
- Mobile hamburger toggle (`click`)
- Cart open/close (`click`, with overlay)
- Menu filter tabs (`click`)
- Menu search (`input` event — real-time filtering)
- FAQ accordion (`click` — toggle with animation)
- Subject chip selector (`click`)
- Star rating hover & click (`mouseenter`, `mouseleave`, `click`)
- Package card selector on reservation page
- Testimonial auto-slider (`setInterval`) with manual prev/next/dot controls

**Interactive Features:**
1. **Shopping Cart** — Add items, adjust quantity (+/−), remove, persist to `localStorage`, live total calculation, slide-in sidebar
2. **Bill Estimator / Calculator** — Real-time calculation of subtotal + service tax (5%) + GST (12%) + tip
3. **Menu Filter + Search** — Category tabs filter by `data-category`; search input filters by dish name and description simultaneously
4. **Testimonial Slider** — Auto-advancing with manual navigation and dot indicators
5. **FAQ Accordion** — Smooth max-height animation, one open at a time
6. **Nutrition Info Popup** — Modal popup per dish showing calorie and macro data
7. **Reservation History Table** — Reads from `localStorage` and displays all past bookings
8. **Toast Notifications** — Non-blocking success/error toasts for all form submissions
9. **Scroll Reveal** — `IntersectionObserver` reveals `.reveal` elements as they scroll into view
10. **Star Rating Widget** — Interactive 5-star rater with hover preview

---

## 4. Technologies Used

| Technology | Usage |
|------------|-------|
| HTML5 | Structure, semantic elements, form controls |
| CSS3 | Flexbox, Grid, custom properties, animations, media queries |
| Vanilla JavaScript (ES6+) | DOM manipulation, events, validation, localStorage, IntersectionObserver |
| Google Fonts API | Cormorant Garamond (serif) + Josefin Sans (sans-serif) |
| localStorage | Cart persistence, reservation history |
| CSS IntersectionObserver | Scroll-reveal animations |

---

## 5. File Organisation

```
restaurant/
├── index.html          ← Home page
├── menu.html           ← Menu with cart & calculator
├── reservation.html    ← Booking form & history
├── about.html          ← Team, story, gallery
├── contact.html        ← Contact form & FAQ
├── css/
│   └── style.css       ← External stylesheet (780 lines)
├── js/
│   └── main.js         ← All JavaScript (496 lines)
└── PROJECT_REPORT.md   ← This document
```

---

## 6. Track

**Track A — Static Website** with advanced interactivity including a functional shopping cart, real-time bill calculator, menu filter system, and complete form validation.

---

## 7. CSS Variable Theming (from `style.css`)

```css
:root {
  --cream:      #F5F0E8;
  --ivory:      #FDFAF4;
  --charcoal:   #1C1C1C;
  --espresso:   #2C1810;
  --gold:       #C9A84C;
  --gold-light: #E8C96A;
  --rust:       #8B3A2A;
  --sage:       #5A6B4E;
  --muted:      #7A7060;
  --border:     #D4C9B0;
}
```

---

*Project developed as part of Web Technologies coursework. All code is original. UI design inspired by fine-dining aesthetics with a Kerala cultural theme.*
