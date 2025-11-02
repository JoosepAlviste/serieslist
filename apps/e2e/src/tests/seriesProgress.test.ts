import { test, expect } from '@playwright/test'

import { registerNewUser } from '../utils'

test('allows keeping track of series progress', async ({ page }) => {
  await registerNewUser(page)

  await page.goto('/series/list/in-progress')

  await page.getByPlaceholder('Search...').fill('futura')
  const detailsUrl = await page
    .getByRole('link', { name: 'Futurama' })
    .getAttribute('href')
  await page.getByText('Futurama').click()
  await page.waitForURL('/series/*')

  await page
    .getByRole('listitem')
    .filter({ has: page.getByText('S01E01') })
    .getByRole('button', { name: 'Mark as seen' })
    .click()

  await expect(
    page.getByText('Notification Episode marked as seen'),
  ).toBeVisible()

  await page.getByRole('combobox', { name: 'Change status' }).click()
  await page.getByRole('option', { name: 'In progress' }).click()

  // The series is in the list with the correct progress
  await page.goto('/series/list/all')
  await expect(
    page
      .getByRole('row')
      .filter({ has: page.getByText('Futurama') })
      .getByText('S01E01'),
  ).toBeVisible()

  // The next episode can be marked as seen
  await page
    .getByRole('row')
    .filter({ has: page.getByText('Futurama') })
    .getByRole('button', { name: 'Mark next episode as seen' })
    .click()
  await expect(
    page
      .getByRole('row')
      .filter({ has: page.getByText('Futurama') })
      .getByText('S01E02'),
  ).toBeVisible()

  // The episode is also marked as seen in the details page
  await page.goto(detailsUrl!)
  await expect(
    page
      .getByRole('listitem')
      .filter({ has: page.getByText('S01E02') })
      .filter({ has: page.getByRole('button', { name: 'Seen' }) }),
  ).toBeVisible()
})
