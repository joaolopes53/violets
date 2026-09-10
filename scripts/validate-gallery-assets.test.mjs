import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { images } from '../src/data/gallery.js'

const assetModule = await import('../src/utils/assetUrl.js').catch(() => ({}))
const { assetUrl, getDeploymentBasePath } = assetModule
const dimensionsModule = await import('../src/data/galleryDimensions.js').catch(() => ({}))
const { galleryDimensions } = dimensionsModule
const galleryImageModule = await import('../src/utils/galleryImage.js').catch(() => ({}))
const { galleryImageSources } = galleryImageModule

const projectRoot = path.resolve(import.meta.dirname, '..')
const sourceFiles = [
  'src/data/gallery.js',
  'src/pages/Home.jsx',
  'src/pages/Home.css',
]

const componentAssetSources = [
  'src/pages/Home.jsx',
  'src/components/Navbar.jsx',
  'src/components/Footer.jsx',
  'src/pages/Home.css',
  'index.html',
]

function sourceGalleryUrls() {
  return sourceFiles.flatMap(relativePath => {
    const source = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8')
    return [...source.matchAll(/\/gallery\/[^'")\r\n]+/g)].map(match => match[0])
  })
}

function publicGalleryAssets() {
  return fs.readdirSync(path.join(projectRoot, 'public', 'gallery'), { recursive: true })
    .filter(relativePath => !relativePath.startsWith('generated/') && /\.(?:jpe?g|png|webp)$/i.test(relativePath))
    .map(relativePath => `/gallery/${relativePath}`)
}

test('gallery image URLs use URL-safe asset names that exist in public', () => {
  for (const imageUrl of sourceGalleryUrls()) {
    const assetPath = path.join(projectRoot, 'public', imageUrl.slice(1))

    assert.equal(imageUrl, encodeURI(imageUrl), `Gallery URL contains unsafe characters: ${imageUrl}`)
    assert.equal(fs.existsSync(assetPath), true, `Gallery asset is missing: ${assetPath}`)
  }

  assert.equal(images.length > 0, true, 'Gallery data must contain at least one image')
})

test('every public gallery image is represented in the gallery catalog', () => {
  const cataloguedAssets = new Set(images.map(image => image.src))
  const uncataloguedAssets = publicGalleryAssets().filter(asset => !cataloguedAssets.has(asset))

  assert.deepEqual(uncataloguedAssets, [])
})

test('useReveal disconnects its IntersectionObserver during cleanup', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/hooks/useReveal.js'), 'utf8')
  const cleanup = source.match(/return \(\) => \{([\s\S]*?)\n\s*\}/)?.[1]

  assert.match(cleanup ?? '', /^\s*observer\.disconnect\(\)/m)
})

test('gallery category state is driven by validated URL search parameters', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Galeria.jsx'), 'utf8')

  assert.match(source, /useSearchParams/)
  assert.match(source, /searchParams\.get\('category'\)/)
  assert.match(source, /getValidCategory/)
})

test('gallery category menu follows the Vinil navigation pattern', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Galeria.jsx'), 'utf8')
  const css = fs.readFileSync(path.join(projectRoot, 'src/pages/Galeria.css'), 'utf8')

  assert.match(source, /filter-btn__count/)
  assert.match(css, /\.filter-btn\s*\{[\s\S]*font-size:\s*14px/)
  assert.match(css, /\.filter-btn\s*\{[\s\S]*letter-spacing:\s*0\.02em/)
  assert.match(css, /\.filter-btn__count\s*\{[\s\S]*border-radius:\s*20px/)
})

test('Gallery hero uses a themed background image with a readability overlay', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Galeria.jsx'), 'utf8')
  const css = fs.readFileSync(path.join(projectRoot, 'src/pages/Galeria.css'), 'utf8')

  assert.match(source, /className="galeria__hero-bg"/)
  assert.match(source, /assetUrl\('\/gallery\/cortinados\/cortinados10\.jpeg'\)/)
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'public', 'gallery', 'cortinados', 'cortinados10.jpeg')),
    true,
    'Gallery hero background asset must exist in public'
  )
  assert.match(css, /\.galeria__hero-bg\s*\{[\s\S]*background:/)
  assert.match(css, /rgba\(242,\s*235,\s*224,\s*0\.8/)
})

test('Vinil and Gallery share the home overlay navbar and hero height', () => {
  const navbarSource = fs.readFileSync(path.join(projectRoot, 'src/components/Navbar.jsx'), 'utf8')
  const navbarCss = fs.readFileSync(path.join(projectRoot, 'src/components/Navbar.css'), 'utf8')
  const rootCss = fs.readFileSync(path.join(projectRoot, 'src/index.css'), 'utf8')
  const vinilCss = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.css'), 'utf8')
  const galleryCss = fs.readFileSync(path.join(projectRoot, 'src/pages/Galeria.css'), 'utf8')

  assert.match(navbarSource, /\['\/vinil', '\/galeria'\]/)
  assert.match(navbarSource, /navbar--overlay/)
  assert.match(navbarCss, /\.navbar--overlay:not\(\.navbar--scrolled\):not\(\.navbar--open\)\s*\{[\s\S]*background:\s*transparent/)

  assert.match(rootCss, /--page-hero-min-height:\s*clamp\(/)
  assert.match(vinilCss, /\.vinil-hero\s*\{[\s\S]*min-height:\s*var\(--page-hero-min-height\)/)
  assert.match(galleryCss, /\.galeria__header\s*\{[\s\S]*min-height:\s*var\(--page-hero-min-height\)/)
  assert.doesNotMatch(vinilCss.match(/\.vinil-page\s*\{[\s\S]*?\n\}/)?.[0] ?? '', /padding-top:\s*var\(--nav-h\)/)
  assert.doesNotMatch(galleryCss.match(/\.galeria\s*\{[\s\S]*?\n\}/)?.[0] ?? '', /padding-top:\s*var\(--nav-h\)/)
})

test('gallery views use the shared responsive image source helper', () => {
  const gallerySource = fs.readFileSync(path.join(projectRoot, 'src/pages/Galeria.jsx'), 'utf8')
  const homeSource = fs.readFileSync(path.join(projectRoot, 'src/pages/Home.jsx'), 'utf8')

  for (const source of [gallerySource, homeSource]) {
    assert.match(source, /galleryImageSources/)
    assert.match(source, /sizes=/)
    assert.match(source, /decoding="async"/)
  }
})

test('gallery derivatives have a generator and dimensions manifest', () => {
  assert.equal(fs.existsSync(path.join(projectRoot, 'scripts/generate-gallery-variants.mjs')), true)
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/data/galleryDimensions.js')), true)
})

test('every catalogued image has dimensions and responsive WebP variants', () => {
  assert.equal(typeof galleryDimensions, 'object')
  assert.equal(typeof galleryImageSources, 'function')

  for (const image of images) {
    const dimensions = galleryDimensions[image.src]
    assert.equal(typeof dimensions?.width, 'number', `Missing width for ${image.src}`)
    assert.equal(typeof dimensions?.height, 'number', `Missing height for ${image.src}`)

    const [category, filename] = image.src.replace(/^\/gallery\//, '').split('/')
    const basename = filename.replace(/\.[^.]+$/, '')

    for (const width of [480, 960, 1440]) {
      const variantPath = path.join(
        projectRoot,
        'public',
        'gallery',
        'generated',
        category,
        `${basename}-${width}.webp`,
      )

      assert.equal(fs.existsSync(variantPath), true, `Missing responsive variant: ${variantPath}`)
    }
  }

  const source = galleryImageSources(images[0].src, '/violets/')
  assert.equal(source.src, `/violets${images[0].src}`)
  assert.match(source.srcSet, /cortinados1-480\.webp 480w/)
})

test('public asset URLs respect the configured deployment base', () => {
  assert.equal(typeof assetUrl, 'function')
  assert.equal(assetUrl(images[0].src, '/'), images[0].src)
  assert.equal(
    assetUrl(images[0].src, '/violets/'),
    `/violets${images[0].src}`
  )
  assert.equal(assetUrl('logo.svg', '/portfolio'), '/portfolio/logo.svg')
})

test('Vite emits relative entrypoint URLs for subpath deployments', () => {
  const viteConfig = fs.readFileSync(path.join(projectRoot, 'vite.config.js'), 'utf8')

  assert.match(viteConfig, /base:\s*['"]\.\/['"]/, 'Vite base must stay portable across deployment paths')
})

test('deployment base is inferred from the relative Vite module URL', () => {
  const documentRoot = {
    baseURI: 'https://example.test/violets/galeria',
    querySelector: () => ({ getAttribute: () => './assets/index.js' }),
  }

  assert.equal(getDeploymentBasePath(documentRoot), '/violets/')
  assert.equal(
    getDeploymentBasePath({
      baseURI: 'https://example.test/galeria',
      querySelector: () => ({ getAttribute: () => './assets/index.js' }),
    }),
    '/'
  )
})

test('components do not bypass the shared public asset URL helper', () => {
  const directRootAssetPattern = /(?:src|image|url\([^)]*)\s*[:=]\s*[`'"]\/(?:gallery|logo)/

  for (const relativePath of componentAssetSources) {
    const source = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8')
    assert.doesNotMatch(
      source,
      directRootAssetPattern,
      `${relativePath} contains a root-relative public asset URL`
    )
  }
})

test('services carousel implements gesture resilience, pointer cancel, and touch-action', () => {
  const homeJsx = fs.readFileSync(path.join(projectRoot, 'src/pages/Home.jsx'), 'utf8')
  const homeCss = fs.readFileSync(path.join(projectRoot, 'src/pages/Home.css'), 'utf8')

  assert.match(homeJsx, /onPointerDown=\{handlePointerDown\}/)
  assert.match(homeJsx, /onPointerCancel=\{handlePointerCancel\}/)
  assert.match(homeJsx, /onWheel=\{handleWheel\}/)
  assert.match(homeJsx, /onKeyDown=\{handleKeyDown\}/)
  assert.match(homeCss, /touch-action:\s*pan-y/)
})
