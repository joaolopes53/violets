import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { galleryItems, featuredGalleryItems } from '../src/data/gallery.js'
import { services } from '../src/data/services.js'
import { translations } from '../src/data/translations.js'

test('content records have stable IDs and complete assets', () => {
  assert.equal(new Set(galleryItems.map(item => item.id)).size, galleryItems.length)
  assert.ok(featuredGalleryItems.length >= 4)
  assert.ok(galleryItems.every(item => fs.existsSync(`public${item.src}`)))
  assert.ok(services.every(service => service.id && service.titleKey && service.descriptionKey))
  assert.ok(services.every(service => fs.existsSync(`public${service.image}`)))
  assert.ok(galleryItems.every(item => translations.pt.gallery.alts[item.alt] && translations.en.gallery.alts[item.alt]))
})
