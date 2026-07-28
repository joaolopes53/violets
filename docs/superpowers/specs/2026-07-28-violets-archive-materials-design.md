# Violets — Arquivo de materiais

## Decision

The website is redesigned as a living archive of Violets interiors and materials. It uses real project photography as the primary proof, with mineral paper, pine-black ink, a precise violet marker, thin rules, numbered indices, and compact metadata. The composition is editorial and asymmetric rather than a centered hero followed by generic cards.

## Visitor path

The first viewport establishes the studio, Madeira context, and direct actions. The intro explains the combined interior-design and bespoke-furniture offer. Services provide scanable scope. The selected-project index leads into the full gallery, and the closing violet band leads to direct contact.

## Surface decisions

- Home: asymmetric text/photo hero, dark studio statement, horizontally browsable services, curated mixed-category project index, direct closing CTA.
- Gallery: sticky category index, asymmetric project grid, stable content IDs, labelled lightbox, keyboard navigation, touch gestures, focus restoration.
- Contact: studio/workshop information, factual addresses and hours, two direct contact actions, phone and email visibility.
- Shell: compact metadata-led navigation, accessible mobile dialog, language switcher, dark archive footer.

## Constraints preserved

Existing logo assets, factual company copy, service categories, contact details, real photography, PT/EN support, and the static React/Vite/direct-contact architecture remain in place. No backend, CMS, checkout, testimonials, or fabricated claims were added.

## Acceptance criteria

- The interface has a deliberate visual language distinct from the previous cream/gold template.
- Home, gallery, and contact remain usable at narrow mobile widths without horizontal page overflow.
- Interactive controls expose focus and state; menu and lightbox support keyboard close and focus restoration.
- Reduced-motion users do not receive long animated transforms.
- Content tests validate stable IDs, existing image paths, services, and PT/EN alt translations.
