import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { vinilData } from '../src/data/vinilData.js'
import { vinilImageSources } from '../src/utils/vinilImage.js'

const projectRoot = path.resolve(import.meta.dirname, '..')

test('routes are split into lazy-loaded page chunks', () => {
  const appSource = fs.readFileSync(path.join(projectRoot, 'src/App.jsx'), 'utf8')

  assert.match(appSource, /lazy\(\(\) => import\('\.\/pages\/Home'\)\)/)
  assert.match(appSource, /lazy\(\(\) => import\('\.\/pages\/Vinil'\)\)/)
  assert.match(appSource, /lazy\(\(\) => import\('\.\/pages\/Cozinhas'\)\)/)
  assert.match(appSource, /lazy\(\(\) => import\('\.\/pages\/Carpintaria'\)\)/)
  assert.match(appSource, /lazy\(\(\) => import\('\.\/pages\/Lacagem'\)\)/)
  assert.match(appSource, /lazy\(\(\) => import\('\.\/pages\/Decoracao'\)\)/)
  assert.match(appSource, /lazy\(\(\) => import\('\.\/pages\/Privacidade'\)\)/)
  assert.match(appSource, /<Suspense fallback=/)
  assert.match(appSource, /className="route-loading"/)
  assert.match(appSource, /class RouteErrorBoundary/)
  assert.match(appSource, /componentDidCatch/)
  assert.match(appSource, /Recarregar \/ Reload/)
  assert.match(appSource, /A carregar \/ Loading/)
  assert.doesNotMatch(appSource, /import Home from '\.\/pages\/Home'/)
})

test('Vinil image cards use generated responsive sources', () => {
  const vinilSource = fs.readFileSync(path.join(projectRoot, 'src/pages/Vinil.jsx'), 'utf8')
  const helperPath = path.join(projectRoot, 'src/utils/vinilImage.js')

  assert.equal(fs.existsSync(helperPath), true, 'Vinil image helper must exist')
  assert.match(vinilSource, /vinilImageSources/)
  assert.match(fs.readFileSync(helperPath, 'utf8'), /srcSet/)
  assert.match(fs.readFileSync(helperPath, 'utf8'), /vinil\/generated/)
})

test('Vinil responsive sources point to generated files', () => {
  const sourcePath = '/vinil/catalogo/5-5mm/classic-oak-5.5mm.webp'
  const sources = vinilImageSources(sourcePath)

  assert.equal(sources.src, sourcePath)
  for (const width of [320, 640, 960]) {
    const variantPath = path.join(projectRoot, 'public', sources.srcSet.match(new RegExp(`[^, ]+-${width}\\.webp`))[0])
    assert.equal(fs.existsSync(variantPath), true, `Missing ${width}px Vinil variant`)
  }
})

test('every Vinil card image has all generated responsive variants', () => {
  const imagePaths = [
    ...vinilData.catalogProducts,
    ...vinilData.completedWorks,
    ...vinilData.woodProducts
  ].map(item => item.image).filter(Boolean)

  for (const imagePath of imagePaths) {
    const sources = vinilImageSources(imagePath)
    for (const variant of sources.srcSet.split(', ')) {
      const variantPath = variant.split(' ')[0]
      assert.equal(
        fs.existsSync(path.join(projectRoot, 'public', variantPath)),
        true,
        `Missing responsive variant ${variantPath}`
      )
    }
  }
})

test('loading screen does not impose a fixed delay after the page is ready', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/components/LoadingScreen.jsx'), 'utf8')

  assert.match(source, /addEventListener\('load'/)
  assert.match(source, /loadingFallbackTimer/)
  assert.doesNotMatch(source, /setTimeout\(\(\) => \{\s*setFadingOut\(true\)/)
})
