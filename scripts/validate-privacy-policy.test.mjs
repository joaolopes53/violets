import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const projectRoot = path.resolve(import.meta.dirname, '..')

test('privacy policy page is routed and linked from the footer', () => {
  const appSource = fs.readFileSync(path.join(projectRoot, 'src/App.jsx'), 'utf8')
  const footerSource = fs.readFileSync(path.join(projectRoot, 'src/components/Footer.jsx'), 'utf8')
  const footerStyles = fs.readFileSync(path.join(projectRoot, 'src/components/Footer.css'), 'utf8')
  const sitemapSource = fs.readFileSync(path.join(projectRoot, 'public/sitemap.xml'), 'utf8')
  const homeSource = fs.readFileSync(path.join(projectRoot, 'src/pages/Home.jsx'), 'utf8')
  const privacyPath = path.join(projectRoot, 'src/pages/Privacidade.jsx')

  assert.equal(fs.existsSync(privacyPath), true, 'Privacy policy page must exist')
  assert.match(appSource, /<Route path="\/privacidade" element={<Privacidade \/>} \/>/)
  assert.match(footerSource, /<Link to="\/privacidade">.*t\('footer\.privacy'\).*<\/Link>/s)
  assert.match(footerSource, /className="footer__mobile-privacy"/)
  assert.match(footerStyles, /\.footer__mobile-privacy/)
  assert.match(sitemapSource, /<loc>https:\/\/violetsdesign\.com\/privacidade<\/loc>/)
  assert.match(homeSource, /title="Violets Showroom - Sede Caniço"/)
})

test('privacy policy explains current storage and external services', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/pages/Privacidade.jsx'), 'utf8')

  assert.match(source, /title: 'Política de Privacidade'/)
  assert.doesNotMatch(source, /title: 'Política de Privacidade e Cookies'/)
  assert.match(source, /localStorage|armazenamento local/)
  assert.match(source, /Google Maps/)
  assert.match(source, /Instagram/)
  assert.match(source, /CNPD/)
})

test('privacy policy navigation uses the policy name', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'src/data/translations.js'), 'utf8')

  assert.match(source, /privacy: 'Política de Privacidade'/)
  assert.match(source, /privacy: 'Privacy Policy'/)
})
