import { test, expect } from '@playwright/test'

test('home services carousel navigates via next/prev buttons and keyboard arrows', async ({ page }) => {
  await page.goto('/')
  const stage = page.locator('.services__stage')
  await expect(stage).toBeVisible()

  const firstActiveCard = stage.locator('.service-card--active')
  await expect(firstActiveCard).toBeVisible()
  const initialTitle = await firstActiveCard.locator('h3').textContent()

  // Click next button
  await page.locator('.services__carousel-btn').nth(1).click()
  await expect(stage.locator('.service-card--active h3')).not.toHaveText(initialTitle)

  // Navigate back using keyboard ArrowLeft
  await stage.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(stage.locator('.service-card--active h3')).toHaveText(initialTitle)
})

test('home services carousel supports pointer drag to advance cards', async ({ page }) => {
  await page.goto('/')
  const stage = page.locator('.services__stage')
  await expect(stage).toBeVisible()

  const initialTitle = await stage.locator('.service-card--active h3').textContent()
  const stageBox = await stage.boundingBox()
  expect(stageBox).not.toBeNull()

  // Drag from right to left across the stage
  const startX = stageBox.x + stageBox.width * 0.7
  const startY = stageBox.y + stageBox.height * 0.5
  const endX = stageBox.x + stageBox.width * 0.2

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(endX, startY, { steps: 10 })
  await page.mouse.up()

  await expect(stage.locator('.service-card--active h3')).not.toHaveText(initialTitle)
})

test('home services carousel advances on horizontal wheel gesture', async ({ page }) => {
  await page.goto('/')
  const stage = page.locator('.services__stage')
  await expect(stage).toBeVisible()

  const initialTitle = await stage.locator('.service-card--active h3').textContent()

  // Dispatch a horizontal wheel event (deltaX > 25)
  await stage.dispatchEvent('wheel', { deltaX: 50, deltaY: 0 })

  await expect(stage.locator('.service-card--active h3')).not.toHaveText(initialTitle)
})
