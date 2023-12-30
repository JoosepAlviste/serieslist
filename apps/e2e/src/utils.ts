import { type Page, expect } from '@playwright/test'
import { nanoid } from 'nanoid'

import { config } from './config'

export const registerNewUser = async (page: Page) => {
  const email = `test.dude${nanoid()}@test.com`

  await page.goto(`http://localhost:${config.port}/register`)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Name').fill('Test Dude')
  await page.getByLabel('Password').fill('test123')

  await page.getByRole('button', { name: 'Register' }).click()

  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await expect(page.getByText('Test Dude')).toBeVisible()
}
