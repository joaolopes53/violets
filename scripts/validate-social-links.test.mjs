import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const projectRoot = path.resolve(import.meta.dirname, '..')
const instagramProfile = 'https://www.instagram.com/violets_carpintaria'

test('all Instagram links point to the Violets carpentry profile', () => {
  const sourceFiles = [
    path.join(projectRoot, 'src/components/Footer.jsx'),
    path.join(projectRoot, 'src/components/Navbar.jsx'),
  ]

  for (const sourceFile of sourceFiles) {
    const source = fs.readFileSync(sourceFile, 'utf8')

    assert.match(source, new RegExp(`href="${instagramProfile}"`), `Missing Instagram profile in ${sourceFile}`)
    assert.doesNotMatch(source, /instagram\.com\/violets_decor/, `Old Instagram profile remains in ${sourceFile}`)
  }
})
