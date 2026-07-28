# Violets Archive Materials UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current generic cream-and-gold presentation with a modern, responsive studio archive that foregrounds Violets' real project photography and makes contact actions immediate.

**Architecture:** Keep the existing React/Vite routes and direct-contact model. Introduce a small shared visual system in `index.css`, make gallery/services data use stable IDs, and let each route own only its composition-specific styles. Upgrade the shell, home, gallery, and contact surfaces without introducing a backend or speculative CMS.

**Tech Stack:** React 19, React Router, Vite, plain CSS, existing public photography and logo assets.

---

### Task 1: Establish stable content data and a small testable contract

**Files:**
- Create: `src/data/services.js`
- Modify: `src/data/gallery.js`
- Modify: `src/data/translations.js`
- Create: `tests/content-contract.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing content-contract test**

Create a Node built-in test that imports the gallery and service records and asserts stable IDs, existing assets, complete PT/EN labels, and a non-empty curated featured set.

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { galleryItems, featuredGalleryItems } from '../src/data/gallery.js'
import { services } from '../src/data/services.js'

test('content records have stable IDs and complete assets', () => {
  assert.equal(new Set(galleryItems.map(item => item.id)).size, galleryItems.length)
  assert.ok(featuredGalleryItems.length >= 4)
  assert.ok(galleryItems.every(item => fs.existsSync(`public${item.src}`)))
  assert.ok(services.every(service => service.id && service.titleKey && service.descriptionKey))
})
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run `node --test tests/content-contract.test.mjs`.

Expected: fail because the current module exports `images`, has no stable `id` contract, and has no service catalog.

- [ ] **Step 3: Implement the smallest data model**

Give every gallery item a stable ID and translation key, export `galleryItems` plus a curated `featuredGalleryItems` list, preserve `images` as a compatibility alias, and create `services.js` with stable service IDs and image paths. Keep all existing factual photo paths and translation copy.

- [ ] **Step 4: Add the test script and run the test**

Add `"test": "node --test tests/*.test.mjs"` to `package.json`, then run `npm test`. Expected: PASS.

- [ ] **Step 5: Commit the content contract**

Run `git add src/data/gallery.js src/data/services.js src/data/translations.js tests/content-contract.test.mjs package.json package-lock.json && git commit -m "refactor: make portfolio content data-driven"`.

### Task 2: Replace the global visual system and motion rules

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`
- Modify: `src/pages/Home.css`
- Modify: `src/pages/Galeria.css`
- Modify: `src/pages/Contacto.css`
- Modify: `src/components/Navbar.css`
- Modify: `src/components/Footer.css`

- [ ] **Step 1: Preserve a failing visual contract check**

Extend `tests/content-contract.test.mjs` with a filesystem assertion that `src/index.css` contains `prefers-reduced-motion`, a visible `:focus-visible` rule, and the archive tokens `--ink`, `--paper`, and `--violet`.

- [ ] **Step 2: Run `npm test` and verify the expected failure**

Expected: fail because the current token set uses only `--bg`, `--gold`, and no reduced-motion rule.

- [ ] **Step 3: Implement the shared system**

Replace the warm cream/gold token foundation with mineral paper, pine-black ink, violet marker, moss secondary, measured spacing, explicit focus rings, reduced-motion fallbacks, shared button states, and a responsive container. Remove duplicate global button definitions from route CSS and keep route styles scoped by page root.

- [ ] **Step 4: Run tests, build, and lint**

Run `npm test`, `npm run build`, and `npm run lint`. Expected: all pass.

### Task 3: Recompose the shell and homepage

**Files:**
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Navbar.css`
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.css`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Footer.css`

- [ ] **Step 1: Add semantic shell assertions**

Add component-level checks only if the existing environment is extended; otherwise use a manual checklist: mobile menu exposes `aria-expanded`, home has one `h1`, primary CTA remains visible at 390px, and the featured set contains multiple categories.

- [ ] **Step 2: Implement the archive homepage**

Build an asymmetric hero with the real kitchen photo, compact metadata, “Ver projetos” and “Fale connosco” actions, a restrained project index, a services strip driven by `services.js`, a curated mixed-category portfolio preview, and a dark closing CTA band. Keep the page responsive without relying on hover.

- [ ] **Step 3: Harden the mobile navigation**

Add `aria-expanded`/`aria-controls`, close on `Escape`, hide the closed drawer from tab order, use a dialog-like label, and preserve body scroll state instead of blindly writing an empty style on cleanup.

- [ ] **Step 4: Run `npm test`, `npm run build`, and `npm run lint`**

Expected: all pass with no missing asset paths.

### Task 4: Recompose gallery and contact surfaces

**Files:**
- Modify: `src/pages/Galeria.jsx`
- Modify: `src/pages/Galeria.css`
- Modify: `src/pages/Contacto.jsx`
- Modify: `src/pages/Contacto.css`

- [ ] **Step 1: Add semantic interaction checks**

Extend the content test to assert that every category has a stable ID and that every gallery item has an alt translation key in both languages.

- [ ] **Step 2: Implement the gallery index**

Use stable IDs for keys and captions, add `aria-pressed` to filters, preserve the current filter behavior, and give the lightbox dialog semantics, labelled close control, focus restoration, and reduced-motion-safe transitions.

- [ ] **Step 3: Implement the contact composition**

Keep the existing factual addresses and direct actions, but present them as studio/workshop information with clearer hierarchy, larger tap targets, and the same archive visual language.

- [ ] **Step 4: Run `npm test`, `npm run build`, and `npm run lint`**

Expected: all pass.

### Task 5: Inspect responsive output and finish

**Files:**
- Modify any changed UI file required by inspection.

- [ ] **Step 1: Start Vite on an unused local port and inspect `/`, `/galeria`, and `/contacto` at desktop and 390px widths**

If browser automation is unavailable, use the build output plus a manual browser pass. Check overflow, image cropping, button tap targets, focus visibility, menu close behavior, lightbox close behavior, and reduced-motion CSS.

- [ ] **Step 2: Run the Impeccable detector once over all changed UI files**

Run `node /Users/joaorodrigues/.agents/skills/impeccable/scripts/detect.mjs --json src/index.css src/App.css src/pages/Home.jsx src/pages/Home.css src/pages/Galeria.jsx src/pages/Galeria.css src/pages/Contacto.jsx src/pages/Contacto.css src/components/Navbar.jsx src/components/Navbar.css src/components/Footer.jsx src/components/Footer.css` and address material findings.

- [ ] **Step 3: Run final verification**

Run `npm test`, `npm run build`, `npm run lint`, `git diff --check`, and `git status --short`. Report any browser or SonarQube limitation explicitly.

- [ ] **Step 4: Commit the finished UI**

Run `git add DESIGN.md src tests package.json package-lock.json && git commit -m "feat: redesign Violets studio archive UI"`.
