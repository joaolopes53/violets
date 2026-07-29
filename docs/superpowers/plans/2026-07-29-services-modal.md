# Serviços especializados Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Make each “Serviços especializados” card open an accessible, restrained detail modal with existing project images and two real CTAs.

**Architecture:** Move the six service definitions into a small data module keyed by existing translation keys and gallery categories. Add a focused ServiceModal component that owns modal presentation, image navigation, keyboard handling, scroll locking, and focus restoration; keep Home responsible for opening it and Gallery responsible for interpreting the category query parameter.

**Tech Stack:** React 19, React Router, Vite, plain CSS, Node’s built-in test runner, Oxlint.

---

### Task 1: Define the service data contract and regression tests

**Files:**
- Create: src/data/services.js
- Create: scripts/validate-services-modal.test.mjs
- Modify: package.json

- [ ] Step 1: Write the failing data contract test.

Create a test that imports services and asserts six services, unique category IDs, existing translation keys, existing featured gallery assets, and category membership in images. Assert the modal source contract exists in the new component path so the test fails before the component is created.

- [ ] Step 2: Run the focused test to verify it fails for the missing contract.

Run: node --test scripts/validate-services-modal.test.mjs

Expected: FAIL because src/data/services.js and src/components/ServiceModal.jsx do not exist.

- [ ] Step 3: Implement the smallest service data module.

Export six entries with this shape:

    {
      id: 'cozinhas',
      category: 'cozinhas',
      titleKey: 'home.services.cozinhasTitle',
      descKey: 'home.services.cozinhasDesc',
      featuredImage: '/gallery/cozinhas/cozinha-1.jpeg',
    }

Use existing categories, existing translation keys, and existing image paths for all six services. Do not add generated images or invented marketing facts.

- [ ] Step 4: Add a package script for the focused test.

Add test:services with value node --test scripts/validate-services-modal.test.mjs beside test:gallery.

- [ ] Step 5: Run npm run test:services and verify the data contract passes.

### Task 2: Build the accessible modal component test-first

**Files:**
- Create: src/components/ServiceModal.jsx
- Create: src/components/ServiceModal.css
- Modify: scripts/validate-services-modal.test.mjs

- [ ] Step 1: Extend the failing contract test for modal behavior.

Assert that ServiceModal.jsx contains role dialog, aria-modal, Escape, Ver projetos, Pedir orçamento, and aria-label. Assert that its stylesheet contains mobile media-query rules and reduced-motion handling.

- [ ] Step 2: Run npm run test:services and verify the new assertions fail.

Expected: FAIL only because the modal component and stylesheet do not exist.

- [ ] Step 3: Implement ServiceModal.

Use props service, relatedImages, onClose, and triggerRef. Render nothing when service is null. Otherwise render a backdrop and dialog, category label, translated title and description, main image, previous/next controls when needed, counter, a Link to /galeria?category=service.category, a Link to /contacto, and an accessible close button.

Use one effect to add and remove the Escape listener, lock body scroll while open, focus the close button on open, restore the previous overflow value on cleanup, and return focus to triggerRef after closing. Keep all related images from relatedImages.

- [ ] Step 4: Add focused CSS without decorative excess.

Use existing color tokens, a dark translucent backdrop, a centered two-column panel on desktop, and a single-column layout below 700px. Keep transitions short and add prefers-reduced-motion to disable them. Do not add gradients, glassmorphism, fake badges, or extra copy.

- [ ] Step 5: Run npm run test:services and verify the modal contract passes.

### Task 3: Integrate modal opening into Home

**Files:**
- Modify: src/pages/Home.jsx
- Modify: src/pages/Home.css

- [ ] Step 1: Add failing integration assertions.

Extend the focused test to assert Home imports services and ServiceModal, renders six service cards as buttons, and includes a triggerRef/modal state path. Assert that existing direct root-relative asset usage is still absent.

- [ ] Step 2: Run npm run test:services and verify the integration assertions fail.

Expected: FAIL because Home still owns an inline service array and renders non-interactive div cards.

- [ ] Step 3: Replace the inline array with the service data module.

Import services and ServiceModal, add activeService state and activeTriggerRef, and render each card as a keyboard-accessible button. Use assetUrl(service.featuredImage) and translated service.titleKey and service.descKey. On click, store the button ref and set activeService.

- [ ] Step 4: Render the modal and preserve the existing carousel.

Pass activeService, images filtered by activeService.category, setActiveService(null), and activeTriggerRef to ServiceModal. Leave the existing carousel controls and gallery preview behavior intact.

- [ ] Step 5: Adjust card CSS for button semantics.

Keep the existing card layout and hover treatment, add text-align left and a visible focus state, and avoid changing the visual hierarchy of the section.

- [ ] Step 6: Run npm run test:services and npm run build.

Expected: all focused assertions pass and Vite builds without warnings.

### Task 4: Add translated labels and category-aware Gallery navigation

**Files:**
- Modify: src/data/translations.js
- Modify: src/pages/Galeria.jsx
- Modify: scripts/validate-services-modal.test.mjs

- [ ] Step 1: Add failing translation and query assertions.

Assert both PT and EN translations contain modal labels for project viewing and quote request. Assert Gallery reads a category query parameter and initializes only to a known category, otherwise falling back to todos.

- [ ] Step 2: Run npm run test:services and verify the assertions fail.

Expected: FAIL because the labels and query-aware initialization do not yet exist.

- [ ] Step 3: Add concise PT and EN translations.

Add only the required labels under the existing translation namespace. Use Portuguese copy equivalent to Ver projetos and Pedir orçamento; use View projects and Request a quote in English.

- [ ] Step 4: Initialize Gallery from category safely.

Use React Router’s useSearchParams, validate the value against categories, initialize the selected filter to that value when valid, and retain todos for missing or invalid values.

- [ ] Step 5: Run npm run test:services, npm run test:gallery, and npm run build.

Expected: all tests pass and the build remains clean.

### Task 5: Final verification and handoff

**Files:**
- Review all changed first-party files; no generated dist changes are committed.

- [ ] Step 1: Run npm run test:services, npm run test:gallery, npm run lint, npm run build, and git diff --check.

- [ ] Step 2: Review the diff against the approved spec.

Confirm that all six cards open the same modal component, both CTAs are real router links, only existing gallery assets are used, the modal closes via button, backdrop, and Escape, focus is restored, mobile layout is one column, reduced motion is respected, and no generic invented copy or decorative AI-style patterns were added.

- [ ] Step 3: Check SonarQube availability and report its actual status.

Use the configured SonarQube integration if available. If no SonarQube MCP or CLI is available, report that it was not run rather than implying a scan occurred.

- [ ] Step 4: Commit the implementation.

Commit only the focused implementation and tests with message feat: add service detail modals.
