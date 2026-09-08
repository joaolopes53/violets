import { test, expect } from '@playwright/test'

test('returns focus to the gallery tile after closing the lightbox', async ({ page }) => {
  await page.goto('/galeria')
  const tile = page.locator('.masonry__item').first()

  await tile.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.lightbox')).toHaveAttribute('role', 'dialog')
  await page.keyboard.press('Escape')
  await expect(tile).toBeFocused()
})

test('keeps keyboard focus inside the open lightbox', async ({ page }) => {
  await page.goto('/galeria')
  await page.locator('.masonry__item').first().click()

  await expect(page.locator('.lightbox')).toHaveAttribute('aria-modal', 'true')
  await expect(page.locator('.lightbox__close')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.lightbox__prev')).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('.lightbox__close')).toBeFocused()
})

test('closes the lightbox with Escape and the close button', async ({ page }) => {
  await page.goto('/galeria')
  const tile = page.locator('.masonry__item').first()

  await tile.click()
  await page.keyboard.press('Escape')
  await expect(page.locator('.lightbox')).toHaveCount(0)

  await tile.click()
  await page.locator('.lightbox__close').click()
  await expect(page.locator('.lightbox')).toHaveCount(0)
})

test('opens the gallery on the category provided in the URL', async ({ page }) => {
  await page.goto('/galeria?category=cortinados')

  await expect(page.locator('.filter-btn--active .filter-btn__text')).toHaveText(/^(Cortinados|Curtains & Drapes)$/)
  await expect(page.locator('.masonry__item')).toHaveCount(17)
})

test('falls back to all images for an unknown category', async ({ page }) => {
  await page.goto('/galeria?category=unknown')

  await expect(page.locator('.filter-btn--active .filter-btn__text')).toHaveText(/^(Todos|All)$/)
  await expect(page.locator('.masonry__item')).toHaveCount(111)
})

test('keeps the selected gallery category in the URL', async ({ page }) => {
  await page.goto('/galeria')

  await page.getByRole('button', { name: /(Cortinados|Curtains & Drapes)\s+\d+/ }).click()
  await expect(page).toHaveURL(/\/galeria\?category=cortinados$/)
  await expect(page.locator('.masonry__item')).toHaveCount(17)
})

test('renders gallery images with responsive loading attributes', async ({ page }) => {
  await page.goto('/galeria')
  const image = page.locator('.masonry__item img').first()

  await expect(image).toHaveAttribute('loading', 'lazy')
  await expect(image).toHaveAttribute('decoding', 'async')
  await expect(image).toHaveAttribute('sizes', /50vw|33vw|25vw/)
  await expect(image).toHaveAttribute('srcset', /480w/)
  await expect(image).toHaveAttribute('width', /\d+/)
  await expect(image).toHaveAttribute('height', /\d+/)
  await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true)
})
