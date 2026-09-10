import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { vinilData } from '../src/data/vinilData.js'
import { translations } from '../src/data/translations.js'

const projectRoot = path.resolve(import.meta.dirname, '..')

test('all vinil assets in public have strictly URL-safe names (cross-platform)', () => {
  const publicVinil = path.join(projectRoot, 'public', 'vinil')
  const files = fs.readdirSync(publicVinil, { recursive: true })
    .filter(rel => fs.statSync(path.join(publicVinil, rel)).isFile())

  const urlSafePattern = /^[a-z0-9_./-]+$/
  for (const rel of files) {
    const normalized = rel.replace(/\\/g, '/')
    assert.equal(
      urlSafePattern.test(normalized),
      true,
      `Vinil asset path contains non-URL-safe characters: ${normalized}`
    )
  }
})

test('every catalog product, work, and wood in vinilData exists on disk in public with valid formats', () => {
  const { completedWorks, catalogProducts, woodProducts } = vinilData

  assert.equal(completedWorks.length > 0, true, 'Must have completed works')
  assert.equal(catalogProducts.length > 0, true, 'Must have catalog products')
  assert.equal(woodProducts.length > 0, true, 'Must have wood products')

  for (const work of completedWorks) {
    const assetPath = path.join(projectRoot, 'public', work.image.slice(1))
    assert.equal(fs.existsSync(assetPath), true, `Missing completed work image: ${assetPath}`)
  }

  for (const prod of catalogProducts) {
    assert.ok(prod.image, `Product must have an image: ${prod.id}`)
    const assetPath = path.join(projectRoot, 'public', prod.image.slice(1))
    assert.equal(fs.existsSync(assetPath), true, `Missing product image: ${assetPath}`)

    if (prod.pdfUrl) {
      const pdfPath = path.join(projectRoot, 'public', prod.pdfUrl.slice(1))
      assert.equal(fs.existsSync(pdfPath), true, `Missing product PDF: ${pdfPath}`)

      // Verify PDF header magic bytes
      const fd = fs.openSync(pdfPath, 'r')
      const buffer = Buffer.alloc(5)
      fs.readSync(fd, buffer, 0, 5, 0)
      fs.closeSync(fd)
      assert.equal(buffer.toString('utf8'), '%PDF-', `Invalid PDF header for ${pdfPath}`)
    }
  }

  for (const wood of woodProducts) {
    const assetPath = path.join(projectRoot, 'public', wood.image.slice(1))
    assert.equal(fs.existsSync(assetPath), true, `Missing wood image: ${assetPath}`)
  }
})

test('catalog products cover all required thicknesses from client brief', () => {
  const { catalogProducts } = vinilData
  const thicknessesPresent = new Set(catalogProducts.map(p => p.thickness))

  const required = ['5.5mm', '6.5mm', '8mm', '9mm', '12mm']
  for (const th of required) {
    assert.equal(
      thicknessesPresent.has(th),
      true,
      `Missing products for requested thickness: ${th}`
    )
  }
})

test('Vinil component does not bypass shared public assetUrl helper', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.jsx'), 'utf8')
  const directRootAssetPattern = /(?:src|image|url\([^)]*)\s*[:=]\s*[`'"]\/(?:vinil|gallery|logo)/

  assert.doesNotMatch(
    source,
    directRootAssetPattern,
    'Vinil.jsx contains a root-relative public asset URL without assetUrl()'
  )
})

test('Vinil hero uses a themed background image with a readability overlay', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.jsx'), 'utf8')
  const css = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.css'), 'utf8')

  assert.match(source, /className="vinil-hero__bg"/)
  assert.match(source, /assetUrl\('\/vinil\/trabalhos\/trabalho-07\.webp'\)/)
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'public', 'vinil', 'trabalhos', 'trabalho-07.webp')),
    true,
    'Vinil hero background asset must exist in public'
  )
  assert.match(css, /\.vinil-hero__bg\s*\{[\s\S]*background:/)
  assert.match(css, /rgba\(242,\s*235,\s*224,\s*0\.8/)
})

test('Vinil price callout uses the official Euro symbol', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.jsx'), 'utf8')

  assert.match(
    source,
    /<span className="vinil-price-callout__icon" aria-hidden="true">€<\/span>/,
    'Price callout must display the Euro symbol'
  )
})

test('Vinil FAQ uses the editorial two-column layout', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.jsx'), 'utf8')

  assert.match(source, /className="vinil-faq-layout"/)
  assert.match(source, /className="vinil-faq-intro"/)
})

test('Deck availability badge has deliberate spacing before its title', () => {
  const css = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.css'), 'utf8')

  assert.match(
    css,
    /\.vinil-deck-header\s*>\s*\.vinil-badge\s*\{[\s\S]*margin-bottom:\s*24px;/,
    'Deck availability badge must be separated from the title'
  )
})

test('Vinil page does not render the standalone final CTA banner', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.jsx'), 'utf8')

  assert.doesNotMatch(source, /vinil-cta-banner/)
})

test('Vinil content ends without trailing page padding after the FAQ', () => {
  const css = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.css'), 'utf8')
  const containerBlock = css.match(/\.vinil-content-container\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(containerBlock, /padding:\s*0 clamp\(16px, 4vw, 32px\) 0;/)
})

test('vinil translations have 100% key parity between PT and EN and include all consumed schema keys', () => {
  const ptVinil = translations.pt.vinil
  const enVinil = translations.en.vinil

  assert.ok(ptVinil, 'PT vinil translations must exist')
  assert.ok(enVinil, 'EN vinil translations must exist')

  // Explicit schema presence check for all keys consumed across Vinil.jsx and vinil.js
  const requiredKeys = [
    'heroTag',
    'heroTitlePre',
    'heroTitleEm',
    'heroDesc',
    'priceOnDemand',
    'priceCustomNote',
    'askQuote',
    'exploreCatalog',
    'partnerBadge',
    'tabsAriaLabel',
    'tabs',
    'spcTitle',
    'spcSubtitle',
    'spcDesc1',
    'spcDesc2',
    'advantagesTitle',
    'advWaterTitle',
    'advWaterDesc',
    'advDurableTitle',
    'advDurableDesc',
    'advAcousticTitle',
    'advAcousticDesc',
    'advClickTitle',
    'advClickDesc',
    'advMaintenanceTitle',
    'advMaintenanceDesc',
    'advDesignTitle',
    'advDesignDesc',
    'spcVsWpcTitle',
    'spcVsWpcSubtitle',
    'spcVsWpcDesc1',
    'spcVsWpcDesc2',
    'spcVsWpcConsult',
    'catalogTitlePre',
    'catalogTitleEm',
    'catalogSubtitle',
    'thicknessFilter',
    'allThicknesses',
    'technicalSheet',
    'downloadPdf',
    'modelCode',
    'thicknessPrefix',
    'requestQuote',
    'sheetOnDemand',
    'emptyFilter',
    'thicknessDescriptions',
    'worksTag',
    'worksTitlePre',
    'worksTitleEm',
    'worksSubtitle',
    'worksZoom',
    'woodsSectionTag',
    'woodsTitlePre',
    'woodsTitleEm',
    'woodsSubtitle',
    'woodsBadge',
    'woodsCta',
    'woodsCustomTitle',
    'woodsCustomDesc',
    'deckTag',
    'deckTitlePre',
    'deckTitleEm',
    'deckSubtitle',
    'deckBadge',
    'deckCta',
    'deckItemTitle',
    'deckItemDesc',
    'deckFeatures',
    'faqTag',
    'faqTitlePre',
    'faqTitleEm',
    'faqIntro',
    'faqItems',
    'ctaBannerTitle',
    'ctaBannerText',
    'ctaBannerBtn',
    'whatsappDirect',
    'lightbox',
  ]

  for (const k of requiredKeys) {
    assert.ok(ptVinil[k] !== undefined, `Missing key in pt.vinil: ${k}`)
    assert.ok(enVinil[k] !== undefined, `Missing key in en.vinil: ${k}`)
  }

  // Verify deckFeatures is an array of non-empty strings
  assert.equal(Array.isArray(ptVinil.deckFeatures), true, 'pt.vinil.deckFeatures must be an array')
  assert.equal(Array.isArray(enVinil.deckFeatures), true, 'en.vinil.deckFeatures must be an array')
  assert.ok(ptVinil.deckFeatures.length >= 4, 'pt.vinil.deckFeatures must have at least 4 items')
  assert.ok(enVinil.deckFeatures.length >= 4, 'en.vinil.deckFeatures must have at least 4 items')

  // Verify lightbox subkeys
  for (const subKey of ['dialogLabel', 'close', 'prev', 'next']) {
    assert.equal(typeof ptVinil.lightbox[subKey], 'string', `pt.vinil.lightbox.${subKey} must be string`)
    assert.equal(typeof enVinil.lightbox[subKey], 'string', `en.vinil.lightbox.${subKey} must be string`)
  }

  // Recursive symmetry check
  function assertParity(ptObj, enObj, prefix = 'vinil') {
    const ptKeys = Object.keys(ptObj).sort()
    const enKeys = Object.keys(enObj).sort()

    assert.deepEqual(
      ptKeys,
      enKeys,
      `Translation keys drift under ${prefix}: PT has [${ptKeys.join(', ')}], EN has [${enKeys.join(', ')}]`
    )

    for (const key of ptKeys) {
      const ptVal = ptObj[key]
      const enVal = enObj[key]

      if (typeof ptVal === 'object' && ptVal !== null && !Array.isArray(ptVal)) {
        assertParity(ptVal, enVal, `${prefix}.${key}`)
      } else if (Array.isArray(ptVal)) {
        assert.equal(
          ptVal.length,
          enVal.length,
          `Array length mismatch at ${prefix}.${key}`
        )
      } else {
        assert.equal(typeof ptVal, 'string', `PT value at ${prefix}.${key} must be string`)
        assert.equal(typeof enVal, 'string', `EN value at ${prefix}.${key} must be string`)
        assert.ok(ptVal.length > 0, `Empty PT string at ${prefix}.${key}`)
        assert.ok(enVal.length > 0, `Empty EN string at ${prefix}.${key}`)
      }
    }
  }

  assertParity(ptVinil, enVinil)
})
