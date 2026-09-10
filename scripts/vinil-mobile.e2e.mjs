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

  test('presents SPC advantages as a horizontal snap rail on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil')
    await page.waitForLoadState('networkidle')

    const rail = page.locator('.vinil-advantages-grid')
    const metrics = await rail.evaluate((element) => ({
      clientWidth: element.clientWidth,
      cardWidth: element.querySelector('.vinil-adv-card').getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
      scrollSnapType: getComputedStyle(element).scrollSnapType,
    }))

    expect(metrics.overflowX).toBe('auto')
    expect(metrics.scrollSnapType).toContain('x')
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth)
    expect(metrics.cardWidth).toBeLessThan(metrics.clientWidth)
  })

  test('presents the Trevo Vinyl collection as a horizontal snap rail on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil')
    await page.waitForLoadState('networkidle')

    const rail = page.locator('.vinil-products-grid')
    const metrics = await rail.evaluate((element) => ({
      clientWidth: element.clientWidth,
      cardWidth: element.querySelector('.vinil-product-card').getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
      scrollSnapType: getComputedStyle(element).scrollSnapType,
    }))

    expect(metrics.overflowX).toBe('auto')
    expect(metrics.scrollSnapType).toContain('x')
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth)
    expect(metrics.cardWidth).toBeLessThan(metrics.clientWidth)
  })

  test('shows the full collection without pagination on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.vinil-products-meta:not(.vinil-woods-meta)')).toBeVisible()
    await expect(page.locator('.vinil-product-pagination')).toBeHidden()
    expect(await page.locator('.vinil-product-card:visible').count()).toBeGreaterThan(8)

    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.vinil-products-meta:not(.vinil-woods-meta)')).toBeHidden()
    await expect(page.locator('.vinil-product-pagination .vinil-pagination')).toBeVisible()
    expect(await page.locator('.vinil-product-card:visible').count()).toBe(8)
  })

  test('presents the natural wood collection as a horizontal snap rail on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil?tab=madeiras')
    await page.waitForLoadState('networkidle')

    const rail = page.locator('.vinil-woods-grid')
    const metrics = await rail.evaluate((element) => ({
      clientWidth: element.clientWidth,
      cardWidth: element.querySelector('.vinil-wood-card').getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
      scrollSnapType: getComputedStyle(element).scrollSnapType,
    }))

    expect(metrics.overflowX).toBe('auto')
    expect(metrics.scrollSnapType).toContain('x')
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth)
    expect(metrics.cardWidth).toBeLessThan(metrics.clientWidth)
  })

  test('presents completed projects as a horizontal snap rail on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil?tab=obras')
    await page.waitForLoadState('networkidle')

    const rail = page.locator('.vinil-works-grid')
    const metrics = await rail.evaluate((element) => ({
      clientWidth: element.clientWidth,
      cardWidth: element.querySelector('.vinil-work-card').getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
      scrollSnapType: getComputedStyle(element).scrollSnapType,
    }))

    expect(metrics.overflowX).toBe('auto')
    expect(metrics.scrollSnapType).toContain('x')
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth)
    expect(metrics.cardWidth).toBeLessThan(metrics.clientWidth)
  })

  test('shows the full natural wood collection without pagination on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil?tab=madeiras')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.vinil-woods-meta')).toBeVisible()
    await expect(page.locator('.vinil-woods-pagination')).toBeHidden()
    expect(await page.locator('.vinil-wood-card:visible').count()).toBeGreaterThan(8)

    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.vinil-woods-meta')).toBeHidden()
    await expect(page.locator('.vinil-woods-pagination .vinil-pagination')).toBeVisible()
    expect(await page.locator('.vinil-wood-card:visible').count()).toBe(8)
  })

  test('presents the natural wood CTA as an editorial responsive close', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil?tab=madeiras')
    await page.waitForLoadState('networkidle')

    const cta = page.locator('.vinil-woods-cta')
    await expect(cta).toContainText('Encontre o acabamento certo para o seu projeto')
    await expect(cta).toContainText('Fale connosco para conhecer acabamentos, vernizes e amostras disponíveis.')
    await expect(cta).toContainText('Pedir orçamento')

    const mobileStyles = await cta.evaluate((element) => {
      const styles = getComputedStyle(element)
      return {
        display: styles.display,
        backgroundColor: styles.backgroundColor,
        textAlign: styles.textAlign,
        borderTopStyle: styles.borderTopStyle,
      }
    })

    expect(mobileStyles.display).toBe('grid')
    expect(mobileStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(mobileStyles.textAlign).toBe('left')
    expect(mobileStyles.borderTopStyle).toBe('solid')

    const mobileCtaWidth = (await cta.boundingBox()).width
    const mobileActionWidth = (await cta.locator('.vinil-woods-cta__action').boundingBox()).width
    expect(mobileActionWidth).toBeGreaterThan(mobileCtaWidth * 0.8)

    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const desktopStyles = await cta.evaluate((element) => {
      const styles = getComputedStyle(element)
      return {
        display: styles.display,
        textAlign: styles.textAlign,
      }
    })

    expect(desktopStyles.display).toBe('grid')
    expect(desktopStyles.textAlign).toBe('left')

    const desktopCtaWidth = (await cta.boundingBox()).width
    const desktopActionWidth = (await cta.locator('.vinil-woods-cta__action').boundingBox()).width
    expect(desktopActionWidth).toBeLessThan(desktopCtaWidth * 0.5)
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

  test('uses the gallery lightbox pattern for completed projects', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil?tab=obras')
    await page.waitForLoadState('networkidle')

    await page.locator('.vinil-work-card').first().click()

    const lightbox = page.locator('.vinil-lightbox')
    await expect(lightbox).toBeVisible()
    await expect(lightbox.locator('.vinil-lightbox__ambient-glow')).toBeAttached()
    await expect(lightbox.locator('.vinil-lightbox__header')).toBeVisible()
    await expect(lightbox.locator('.vinil-lightbox__counter')).toHaveText('01 / 12')
    await expect(lightbox.locator('.vinil-lightbox__footer')).toBeVisible()

    const thumbnails = lightbox.locator('.vinil-lightbox__thumb-btn')
    await expect(thumbnails).toHaveCount(12)
    await thumbnails.nth(1).click()
    await expect(lightbox.locator('.vinil-lightbox__counter')).toHaveText('02 / 12')
    await expect(lightbox.locator('.vinil-lightbox__img-wrap img')).toHaveAttribute('alt', 'Projeto Concluído 2')

    const thumbnailsStyles = await lightbox.locator('.vinil-lightbox__thumbs-strip').evaluate((element) => {
      const styles = getComputedStyle(element)
      return {
        overflowX: styles.overflowX,
        display: styles.display,
      }
    })

    expect(thumbnailsStyles.display).toBe('flex')
    expect(thumbnailsStyles.overflowX).toBe('auto')

    await page.keyboard.press('Escape')
    await expect(lightbox).toHaveCount(0)
  })

  test('keeps completed projects visual-only in cards and lightbox', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.addInitScript(() => localStorage.setItem('lang', 'pt'))
    await page.goto('/vinil?tab=obras')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.vinil-work-card__title')).toHaveCount(0)

    await page.locator('.vinil-work-card').first().click()

    const lightbox = page.locator('.vinil-lightbox')
    await expect(lightbox).toBeVisible()
    await expect(lightbox.locator('.vinil-lightbox__cat-title')).toHaveCount(0)
    await expect(lightbox.locator('.vinil-lightbox__caption-text')).toHaveCount(0)
    await expect(lightbox.locator('.vinil-lightbox__counter')).toHaveText('01 / 12')
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
