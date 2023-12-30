import { test, expect } from '@playwright/test'
import { nanoid } from 'nanoid'

test('allows creating an acount and logging in', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Log in' }).click()
  await page.getByRole('link', { name: 'Register here' }).click()
  await expect(page).toHaveURL(/.*register/)

  const email = `test.dude${nanoid()}@test.com`
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Name').fill('Test Dude')
  await page.getByLabel('Password').fill('test123')

  await page.getByRole('button', { name: 'Register' }).click()

  await expect(page.getByText('Test Dude')).toBeVisible()

  // Log out
  await page.getByText('Test Dude').click()
  await page.getByText('Log out').click()

  // And log back in again
  await page.getByRole('link', { name: 'Log in' }).click()
  await expect(page).toHaveURL(/.*login/)

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('test123')

  await page.getByRole('button', { name: 'Log in' }).click()

  // And the user is logged in again
  await expect(page.getByText('Test Dude')).toBeVisible()
})
