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
  await page.goto('/galeria?category=design')

  await expect(page.locator('.filter-btn--active .filter-btn__text')).toHaveText('Design')
  await expect(page.locator('.masonry__item')).toHaveCount(33)
})

test('falls back to all images for an unknown category', async ({ page }) => {
  await page.goto('/galeria?category=unknown')

  await expect(page.locator('.filter-btn--active .filter-btn__text')).toHaveText(/^(Todos|All)$/)
  await expect(page.locator('.masonry__item')).toHaveCount(77)
})

test('keeps the selected gallery category in the URL', async ({ page }) => {
  await page.goto('/galeria')

  await page.getByRole('button', { name: /Design\s+\d+/ }).click()
  await expect(page).toHaveURL(/\/galeria\?category=design$/)
  await expect(page.locator('.masonry__item')).toHaveCount(33)
})
