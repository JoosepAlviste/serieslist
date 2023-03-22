import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Serieslist/)
})

test('makes a GraphQL request and shows the result', async ({ page }) => {
  await page.goto('/')

  page.getByText('{"hello":"world"}')
})
