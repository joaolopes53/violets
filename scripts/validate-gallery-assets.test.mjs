import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { images } from '../src/data/gallery.js'

const assetModule = await import('../src/utils/assetUrl.js').catch(() => ({}))
const { assetUrl, getDeploymentBasePath } = assetModule

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

test('gallery image URLs use URL-safe asset names that exist in public', () => {
  for (const imageUrl of sourceGalleryUrls()) {
    const assetPath = path.join(projectRoot, 'public', imageUrl.slice(1))

    assert.equal(imageUrl, encodeURI(imageUrl), `Gallery URL contains unsafe characters: ${imageUrl}`)
    assert.equal(fs.existsSync(assetPath), true, `Gallery asset is missing: ${assetPath}`)
  }

  assert.equal(images.length > 0, true, 'Gallery data must contain at least one image')
})

test('public asset URLs respect the configured deployment base', () => {
  assert.equal(typeof assetUrl, 'function')
  assert.equal(assetUrl('/gallery/cozinhas/cozinha-1.jpeg', '/'), '/gallery/cozinhas/cozinha-1.jpeg')
  assert.equal(
    assetUrl('/gallery/cozinhas/cozinha-1.jpeg', '/violets/'),
    '/violets/gallery/cozinhas/cozinha-1.jpeg'
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
