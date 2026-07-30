# Gallery Quality Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the gallery's resource cleanup, keyboard accessibility, shareable category filters, and image loading performance without changing the visual identity or adding a backend.

**Architecture:** Keep the existing React/Vite structure and improve the owners of each concern in place. `useReveal` owns observer cleanup, `Galeria` owns lightbox and URL state, and a small asset helper plus a repeatable build script owns responsive image variants. Existing original images remain the fallback source and the gallery catalog remains the single source of truth.

**Tech Stack:** React 19, React Router 7, Vite, plain CSS, Node's built-in test runner, Playwright for browser behavior checks, and Sharp only for local derivative generation.

---

### Task 1: Make `useReveal` release its observer deterministically

**Files:**
- Modify: `website/src/hooks/useReveal.js`
- Modify: `website/scripts/validate-gallery-assets.test.mjs`

- [ ] **Step 1: Add the failing lifecycle contract test**

Add a source-level regression assertion for the hook cleanup. The test should read `src/hooks/useReveal.js` and require `observer.disconnect()` inside the returned cleanup function. This matches the repository's current Node contract-test style and prevents the empty `once` cleanup branch from returning.

```js
test('useReveal disconnects its IntersectionObserver during cleanup', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/hooks/useReveal.js'), 'utf8')

  assert.match(source, /return \(\) => \{[\s\S]*observer\.disconnect\(\)/)
})
```

- [ ] **Step 2: Run the focused test and verify the failure**

Run: `npm run test:gallery`

Expected: the new test fails because the `once` branch currently contains no disconnect call.

- [ ] **Step 3: Implement the minimal cleanup**

Replace the conditional cleanup with one deterministic cleanup path:

```js
return () => {
  observer.disconnect()
}
```

Keep the existing `observer.unobserve(el)` behavior when `once` is true; disconnecting during effect cleanup is a separate lifecycle responsibility.

- [ ] **Step 4: Run the focused test and lint**

Run: `npm run test:gallery && npm run lint`

Expected: all gallery contract tests pass and Oxlint reports no issues.

- [ ] **Step 5: Commit the isolated lifecycle fix**

```bash
git add src/hooks/useReveal.js scripts/validate-gallery-assets.test.mjs
git commit -m "fix: clean up reveal observers"
```

---

### Task 2: Make the gallery lightbox keyboard-accessible

**Files:**
- Modify: `website/src/pages/Galeria.jsx`
- Modify: `website/src/pages/Galeria.css`
- Create: `website/scripts/gallery-accessibility.e2e.mjs`
- Modify: `website/package.json`
- Modify: `website/package-lock.json`

- [ ] **Step 1: Add browser test dependencies and failing behavior tests**

Add `@playwright/test` as a development dependency and a script:

```json
"test:e2e:gallery": "playwright test scripts/gallery-accessibility.e2e.mjs"
```

The first browser tests must cover the current failures:

```js
test('returns focus to the gallery tile after closing the lightbox', async ({ page }) => {
  await page.goto('/galeria')
  const tile = page.locator('.masonry__item').first()
  await tile.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.lightbox')).toHaveAttribute('role', 'dialog')
  await page.keyboard.press('Escape')
  await expect(tile).toBeFocused()
})

test('keeps keyboard focus inside the open lightbox', async ({ page }) => {
  await page.goto('/galeria')
  await page.locator('.masonry__item').first().click()
  await expect(page.locator('.lightbox')).toHaveAttribute('aria-modal', 'true')
  await page.keyboard.press('Tab')
  await expect(page.locator('.lightbox')).toContainText('Fechar')
})
```

Add a separate test for Escape and a separate test for the close button. Run the tests before implementation and confirm they fail because the dialog attributes and focus behavior do not exist yet.

- [ ] **Step 2: Convert gallery tiles to semantic controls**

Replace each clickable `div.masonry__item` with a `<button type="button">`. Keep the existing class, image, `aria-label`, and index handler. Move `tabIndex`, `role="button"`, and the custom Space handling out of the tile because native buttons already support Enter and Space.

The resulting control must retain the visible focus rule:

```jsx
<button
  type="button"
  className="masonry__item"
  onClick={() => openLightbox(idx)}
  aria-label={...}
>
  <img ... />
</button>
```

- [ ] **Step 3: Add dialog semantics and focus ownership**

Add refs for the close button and the tile that opened the lightbox. When opening, store the triggering element. When the lightbox mounts, focus the close button. When it closes, focus the stored tile if it is still connected.

Use these semantics on the overlay and panel:

```jsx
<div className="lightbox" role="presentation" onClick={closeLightbox}>
  <div
    className="lightbox__dialog"
    role="dialog"
    aria-modal="true"
    aria-labelledby="lightbox-title"
    onClick={event => event.stopPropagation()}
  >
    <h2 id="lightbox-title" className="visually-hidden">{caption}</h2>
    ...
  </div>
</div>
```

Keep Escape, ArrowLeft, ArrowRight, backdrop close, swipe navigation, and body scroll locking. Add a small focus-trap effect that cycles Tab and Shift+Tab between the close, previous, and next controls that are currently visible. Do not trap focus when the lightbox is closed.

- [ ] **Step 4: Add reduced-motion and dialog focus styles**

Keep the existing visual treatment, add a visually-hidden utility for the dialog heading, and disable lightbox animation under reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .lightbox,
  .lightbox__img-wrap,
  .lightbox__info-panel {
    animation: none;
  }
}
```

Keep `.masonry__item:focus-visible` and add `border: 0;` plus `text-align: left;` only if the button reset changes the current card appearance.

- [ ] **Step 5: Run browser tests, gallery tests, and lint**

Run: `npx playwright install chromium`, then `npm run test:e2e:gallery`, `npm run test:gallery`, and `npm run lint`.

Expected: keyboard focus enters the dialog, remains within it, Escape/backdrop/close work, focus returns to the originating tile, and all existing asset tests remain green.

- [ ] **Step 6: Commit the accessibility change**

```bash
git add src/pages/Galeria.jsx src/pages/Galeria.css scripts/gallery-accessibility.e2e.mjs package.json package-lock.json
git commit -m "feat: improve gallery lightbox accessibility"
```

---

### Task 3: Make gallery categories addressable by URL

**Files:**
- Modify: `website/src/pages/Galeria.jsx`
- Modify: `website/scripts/validate-gallery-assets.test.mjs`
- Modify: `website/scripts/gallery-accessibility.e2e.mjs`

- [ ] **Step 1: Add the failing category-query contract**

Add a browser test for a valid query and an invalid query:

```js
test('opens the gallery on the category provided in the URL', async ({ page }) => {
  await page.goto('/galeria?category=design')
  await expect(page.locator('.filter-btn--active .filter-btn__text')).toHaveText('Design')
  await expect(page.locator('.masonry__item')).toHaveCount(33)
})

test('falls back to all images for an unknown category', async ({ page }) => {
  await page.goto('/galeria?category=unknown')
  await expect(page.locator('.filter-btn--active .filter-btn__text')).toHaveText('Todos')
  await expect(page.locator('.masonry__item')).toHaveCount(77)
})
```

Run the focused browser tests and confirm the valid query currently opens “Todos”.

- [ ] **Step 2: Add a validated category parser**

Use `useSearchParams` and keep validation in one helper:

```js
function getValidCategory(value) {
  return categories.some(category => category.id === value) ? value : 'todos'
}
```

Initialize the selected category from `searchParams.get('category')`, and update the state when the URL changes through browser navigation. Missing, `todos`, and invalid values must resolve to `todos`.

- [ ] **Step 3: Keep the URL synchronized when a filter is selected**

Centralize filter selection in a `selectCategory(categoryId)` handler. Set the React state and update the query string with `setSearchParams` using `{ replace: true }`. Remove the `category` key for `todos` so `/galeria` remains the canonical all-images URL.

The existing lightbox reset and scroll-to-top behavior must remain in this handler.

- [ ] **Step 4: Extend the static contract test**

Assert that `Galeria.jsx` imports `useSearchParams`, reads `category`, and contains the validation path. This protects the subpath behavior without duplicating the production category list inside the test.

- [ ] **Step 5: Run all gallery checks**

Run: `npm run test:e2e:gallery`, `npm run test:gallery`, `npm run lint`, and `npm run build`.

Expected: direct links, browser back/forward navigation, invalid queries, and normal filter clicks all resolve to a known category.

- [ ] **Step 6: Commit the URL behavior**

```bash
git add src/pages/Galeria.jsx scripts/validate-gallery-assets.test.mjs scripts/gallery-accessibility.e2e.mjs
git commit -m "feat: support gallery category URLs"
```

---

### Task 4: Add responsive image derivatives and stable loading dimensions

**Files:**
- Create: `website/scripts/generate-gallery-variants.mjs`
- Create: `website/src/utils/galleryImage.js`
- Create: `website/src/data/galleryDimensions.js` generated from the real source files
- Modify: `website/src/pages/Galeria.jsx`
- Modify: `website/src/pages/Home.jsx`
- Modify: `website/src/pages/Galeria.css`
- Modify: `website/src/pages/Home.css`
- Modify: `website/scripts/validate-gallery-assets.test.mjs`
- Modify: `website/package.json`
- Modify: `website/package-lock.json`
- Create: `website/public/gallery/generated/**` via the image-generation script

- [ ] **Step 1: Add the failing source and derivative contract**

Extend the asset tests to require the shared image helper, `loading="lazy"`, `decoding="async"`, and a responsive `sizes` attribute on gallery grid images. Add a test that every catalogued source has generated 480px, 960px, and 1440px WebP variants after the generation command runs.

- [ ] **Step 2: Add the derivative generator**

Add Sharp as a development dependency and a script:

```json
"images:gallery": "node scripts/generate-gallery-variants.mjs"
```

The generator must:

1. recursively read image files under `public/gallery`, including the 77 catalogued images;
2. create `public/gallery/generated/<category>/<basename>-480.webp`, `-960.webp`, and `-1440.webp`;
3. preserve the source aspect ratio;
4. skip regeneration when the output is newer than the source;
5. fail with the source path if conversion fails.

The original JPEG files remain in place as the lightbox-quality fallback.

- [ ] **Step 3: Add a single source-set helper**

Create `src/utils/galleryImage.js` with a small pure helper. The helper must import `assetUrl` and the generated dimensions map:

```js
import { assetUrl } from './assetUrl'
import { galleryDimensions } from '../data/galleryDimensions'

export function galleryImageSources(publicPath, basePath) {
  const pathParts = publicPath.replace(/^\/+/, '').split('/')
  const category = pathParts.at(-2)
  const basename = pathParts.at(-1).replace(/\.[^.]+$/, '')
  const variantPath = width => `/gallery/generated/${category}/${basename}-${width}.webp`
  const dimensions = galleryDimensions[publicPath]

  if (!dimensions) {
    throw new Error(`Missing gallery dimensions for ${publicPath}`)
  }

  return {
    src: assetUrl(publicPath, basePath),
    srcSet: [480, 960, 1440]
      .map(width => `${assetUrl(variantPath(width), basePath)} ${width}w`)
      .join(', '),
    width: dimensions.width,
    height: dimensions.height,
  }
}
```

Keep the helper limited to gallery images and use `assetUrl` for every emitted path so subpath deployments continue to work.

- [ ] **Step 4: Use responsive sources in the grid and Home preview**

For masonry and preview images, pass:

```jsx
const source = galleryImageSources(img.src)

<img
  src={source.src}
  srcSet={source.srcSet}
  sizes="(max-width: 600px) 50vw, (max-width: 860px) 50vw, (max-width: 1200px) 33vw, 25vw"
  width={img.width}
  height={img.height}
  loading="lazy"
  decoding="async"
  alt={...}
/>
```

Generate `src/data/galleryDimensions.js` from the actual files in the same script and validate that every `images[].src` has one entry; do not guess dimensions from filenames. Keep `gallery.js` as the catalog source of truth and the generated dimensions file as the derived image metadata required by the browser.

Use `loading="eager"` only for the hero image if it is converted from a CSS background to an actual image element; leave below-the-fold preview images lazy.

- [ ] **Step 5: Preserve layout and motion behavior**

Keep the existing `aspect-ratio` rules as a CSS fallback. Add `object-fit: cover` to the responsive image rules and verify that source-set changes do not alter card cropping. Respect `prefers-reduced-motion` for gallery zoom/fade transitions while keeping image loading unaffected.

- [ ] **Step 6: Generate assets and verify the performance contract**

Run: `npm run images:gallery`, `npm run test:gallery`, `npm run test:e2e:gallery`, `npm run lint`, and `npm run build`.

Expected: every catalogued image has valid WebP derivatives, grid images expose responsive sources and dimensions, the lightbox still opens the original-quality image, subpath asset tests pass, and the build completes without warnings.

- [ ] **Step 7: Commit the image optimization change**

```bash
git add src/utils/galleryImage.js src/pages/Galeria.jsx src/pages/Home.jsx src/pages/Galeria.css src/pages/Home.css scripts/generate-gallery-variants.mjs scripts/validate-gallery-assets.test.mjs package.json package-lock.json public/gallery/generated
git commit -m "perf: optimize gallery image loading"
```

---

### Task 5: Final verification and handoff

**Files:**
- Review all files changed by Tasks 1–4.

- [ ] **Step 1: Run the complete local verification**

Run: `npm run images:gallery`, `npm run test:gallery`, `npm run test:e2e:gallery`, `npm run lint`, and `npm run build`.

- [ ] **Step 2: Review the four acceptance areas**

Confirm that:

- `useReveal` disconnects every observer on effect cleanup;
- the lightbox has dialog semantics, visible focus, Escape/backdrop/close behavior, focus trapping, and focus restoration;
- valid category URLs open the intended filter and invalid URLs safely use “Todos”;
- gallery images use derivatives, dimensions, `sizes`, lazy loading, and the existing base-path helper.

- [ ] **Step 3: Run a responsive browser pass**

Check `/galeria` at desktop and mobile widths, `/galeria?category=design`, an invalid category, lightbox keyboard navigation, reduced-motion emulation, and Home's hero/preview images.

- [ ] **Step 4: Report known constraints**

Report the generated image footprint, whether Chromium was available for browser tests, and that no SonarQube scan was run unless a configured scanner is actually available.
