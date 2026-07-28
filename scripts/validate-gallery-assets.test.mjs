import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { images } from '../src/data/gallery.js'

const projectRoot = path.resolve(import.meta.dirname, '..')
const sourceFiles = [
  'src/data/gallery.js',
  'src/pages/Home.jsx',
  'src/pages/Home.css',
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
