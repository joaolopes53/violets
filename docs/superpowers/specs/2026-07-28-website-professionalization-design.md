# Violets Website Professionalization Design

**Date:** 2026-07-28  
**Status:** Approved conversational direction; implementation not started

## Context

The Violets website is a React/Vite application with three public pages: Home, Gallery, and Contact. It already supports Portuguese and English, has a gallery organized by service categories, and exposes phone, email, WhatsApp, and social links.

The current gallery and translated copy are static assets in the repository. The site should first become more professional as a public-facing portfolio and lead-generation website. A future administration area may manage images, categories, and text, but that backend is intentionally outside this design.

## Goals

- Communicate Violets' positioning quickly and clearly.
- Present the work as a premium, curated interior-design portfolio.
- Increase trust using real company information and approved customer proof.
- Make requesting an estimate easy on desktop and mobile.
- Preserve Portuguese/English support.
- Improve discoverability, performance, accessibility, and maintainability.
- Keep the initial work compatible with the current Vercel-friendly static frontend.

## Non-goals

- Building the administration area or selecting a backend provider.
- Inventing testimonials, statistics, certifications, client logos, or project claims.
- Adding a CRM, booking system, or automated lead-management workflow.
- Replacing the current visual identity without brand approval.

## Proposed experience

### 1. Home and first impression

The Home should establish three facts immediately: what Violets does, where it operates, and how a visitor can start a conversation.

The page structure should be:

1. **Hero:** a clear headline about interiors and bespoke furniture, a short Madeira/Caniço positioning line, a primary “Pedir orçamento” CTA, and a secondary “Ver projetos” CTA.
2. **Trust strip:** founding year, location, and specialities, using only confirmed facts.
3. **Services:** cards for kitchens, wardrobes, doors, staircases, vinyl, and design. Each card should link to its corresponding gallery category.
4. **Featured projects:** a curated six-image grid with category labels and links to the full gallery.
5. **Process:** three steps—understand the space, develop the solution, produce/install.
6. **Final CTA:** a clear invitation to discuss the visitor's space, with WhatsApp, phone, and email actions.

The existing Home sections can be retained where useful, but the narrative should avoid repeating the same service and gallery message several times.

### 2. Gallery and project presentation

The Gallery should feel like a curated portfolio rather than a raw image folder.

- Keep category filters, with readable labels in both languages.
- Use a consistent editorial grid and deliberate image cropping.
- Give each item a real category and descriptive caption.
- Keep the lightbox, adding the category, caption, and a “Pedir orçamento” action.
- Place a curated set of six featured items before the complete archive.
- Reserve a future path for project detail pages containing several images, a description, and materials.
- Optimize images for mobile and avoid loading all full-resolution assets at once.

Gallery metadata should be shaped so a future admin area can manage it without redesigning the public UI. The conceptual fields are: `id`, `image`, `category`, `title`, `description`, `alt`, `featured`, `order`, and `published`, with localized text for PT and EN.

### 3. Trust and conversion

The site should make Violets feel established, local, and easy to contact.

- Add approved testimonials with customer permission.
- Add before/after presentations only where authentic material exists.
- Explain the working process in plain language.
- Show the office/warehouse location and service area with a map where appropriate.
- Keep phone and WhatsApp highly visible on mobile.
- Use one consistent primary CTA: “Pedir orçamento”.
- Add a professional contact form in a later stage, once a secure destination for submissions is selected.
- Keep email and WhatsApp available as direct fallback channels.
- Add privacy and legal information to the footer.
- Keep Instagram and Facebook links visible but secondary to contact actions.

All figures, testimonials, certifications, and claims require confirmation from the company before publication.

### 4. Technical finish

- Add page-specific titles, descriptions, canonical URLs, Open Graph metadata, sitemap, and `robots.txt`.
- Add structured data for a local business after company details are confirmed.
- Convert or generate WebP/AVIF derivatives and use responsive image sizes.
- Preload only the main hero image; lazy-load below-the-fold images.
- Reserve image dimensions to reduce layout shift.
- Use meaningful localized alt text rather than generic labels.
- Verify heading hierarchy, contrast, focus states, keyboard lightbox navigation, and reduced-motion behavior.
- Add a branded 404 page.
- Test links, missing images, mobile layouts, language switching, and the contact actions.
- Confirm that social preview cards show the intended image and copy.

## Content and dependency requirements

Before implementation, collect:

- Confirmed company facts and statistics.
- Approved Portuguese and English positioning copy.
- Real testimonials and permissions.
- Preferred six featured projects.
- Better project titles, captions, and alt text.
- Legal/privacy copy and the correct company details.
- A decision on the future contact-form destination.

The first implementation pass should not require a backend. Static content can remain in the existing React data files while the components and metadata are improved. The content shape should be kept compatible with a later API or CMS migration.

## Rollout order

1. Establish content inventory and confirm facts.
2. Improve Home hierarchy, CTAs, and featured work.
3. Refine gallery metadata, layout, and lightbox actions.
4. Add trust/process content and mobile contact emphasis.
5. Apply SEO, image optimization, accessibility, and 404 improvements.
6. Verify on desktop/mobile and in both languages.

## Acceptance criteria

- A first-time visitor can identify the services, location, and main contact action without searching.
- Every service card leads to the correct gallery category.
- Featured projects are curated and have meaningful localized captions.
- WhatsApp, phone, and email work from desktop and mobile.
- No unverified claims appear in the published content.
- Gallery images load without broken paths and do not cause avoidable layout shifts.
- Core pages have correct PT/EN titles, descriptions, and accessible image text.
- The site remains deployable as a Vite frontend on Vercel.
