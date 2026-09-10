import { test, expect } from '@playwright/test'

const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE (375x667)', width: 375, height: 667 },
  { name: 'iPhone 12/13/14 (390x844)', width: 390, height: 844 },
  { name: 'iPhone XR/11 (414x896)', width: 414, height: 896 },
  { name: 'Small Phone (320x568)', width: 320, height: 568 },
]

test.describe('Vinil Page Mobile Responsiveness', () => {
  for (const vp of MOBILE_VIEWPORTS) {
    test(`has zero horizontal overflow on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/vinil')
      await page.waitForLoadState('networkidle')

      // Validate zero horizontal scroll leakage on the entire page
      const hasHorizontalOverflow = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth
        const scrollWidth = document.documentElement.scrollWidth
        const bodyScrollWidth = document.body.scrollWidth
        return scrollWidth > docWidth || bodyScrollWidth > docWidth
      })

      expect(hasHorizontalOverflow).toBe(false)
    })
  }

  test('keeps the mobile hero clear of the overlay navbar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil')
    await page.waitForLoadState('networkidle')

    const navbarBox = await page.locator('.navbar').boundingBox()
    const tagBox = await page.locator('.vinil-hero__tag').boundingBox()

    expect(navbarBox).not.toBeNull()
    expect(tagBox).not.toBeNull()
    expect(tagBox.y).toBeGreaterThan(navbarBox.y + navbarBox.height + 16)
    await expect(page.locator('.vinil-hero__desc')).toHaveText(
      'Conforto, resistência e design para transformar cada espaço. Pavimentos Trevo Vinyl que combinam estética, durabilidade e desempenho acústico.'
    )
  })

  test('allows horizontal scrolling of tabs and selecting all 4 tabs on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/vinil')
    await page.waitForLoadState('networkidle')

    const tabs = [
      { id: 'vinil-tab-vinil', panel: 'vinil-panel-vinil' },
      { id: 'vinil-tab-obras', panel: 'vinil-panel-obras' },
      { id: 'vinil-tab-madeiras', panel: 'vinil-panel-madeiras' },
      { id: 'vinil-tab-deck', panel: 'vinil-panel-deck' },
    ]

    for (const tab of tabs) {
      const tabButton = page.locator(`#${tab.id}`)
      await expect(tabButton).toBeAttached()
      await tabButton.click()
      await expect(page.locator(`#${tab.panel}`)).toBeVisible()
      await expect(tabButton).toHaveAttribute('aria-selected', 'true')
    }
  })

  test('filters SPC thickness pills on mobile without layout break', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/vinil')
    await page.waitForLoadState('networkidle')

    const pill65 = page.getByRole('radio', { name: /6\.5mm/ })
    await pill65.click()
    await expect(pill65).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('.vinil-thickness-banner')).toContainText('6.5mm')

    // Verify products grid is visible and has cards
    const cards = page.locator('.vinil-product-card')
    await expect(cards.first()).toBeVisible()
  })

  test('opens and closes lightbox on mobile with touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/vinil?tab=obras')
    await page.waitForLoadState('networkidle')

    const firstWork = page.locator('.vinil-work-card').first()
    await expect(firstWork).toBeVisible()
    await firstWork.click()

    const lightbox = page.locator('.vinil-lightbox')
    await expect(lightbox).toBeVisible()

    const closeBtn = page.locator('.vinil-lightbox__close')
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()

    await expect(lightbox).toHaveCount(0)
  })

  test('toggles FAQ items smoothly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/vinil')
    await page.waitForLoadState('networkidle')

    const firstFaqBtn = page.locator('.vinil-faq-question').first()
    await expect(firstFaqBtn).toBeVisible()
    await firstFaqBtn.click()

    const firstFaqItem = page.locator('.vinil-faq-item').first()
    await expect(firstFaqItem).toHaveClass(/open/)
  })
})
