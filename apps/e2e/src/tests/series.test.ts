import { test, expect } from '../fixtures'

test('allows searching for series and viewing their details', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByPlaceholder('Search...').fill('futura')

  const url = await page
    .getByRole('link', { name: 'Futurama' })
    .getAttribute('href')
  const id = url!.split('/').at(-1)

  await page.getByText('Futurama').click()

  await expect(page).toHaveURL(`/series/${id!}`)

  // The data is shown to the user
  await expect(
    page.getByText(/The adventures of a late-20th-century New York City.*/i),
  ).toBeVisible()
  await expect(page.getByText('2013 – …')).toBeVisible()

  // The seasons are shown as tabs and the first one is selected
  await expect(page.getByRole('tab', { name: '1' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.getByRole('tab', { name: '2' }).click()
  await expect(page.getByText('Season 2')).toBeVisible()
  await expect(page.getByText('S02E01')).toBeVisible()
})

test('allows setting a status for a series', async ({ page }) => {
  await page.goto('/')

  await page.getByPlaceholder('Search...').fill('futura')
  await page.getByText('Futurama').click()
  await page.waitForURL('/series/*')

  await page.getByRole('combobox', { name: 'Change status' }).click()
  await page.getByRole('option', { name: 'In progress' }).click()
  await expect(
    page.getByRole('combobox', { name: 'Change status' }),
  ).toHaveText('In progress')

  // The series is now visible in the list view
  await page.goto('/series/list/in-progress')
  await expect(page.getByText('Futurama')).toBeVisible()
})
