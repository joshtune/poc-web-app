import { expect, test } from '@playwright/test';

test('shows a helpful error when the password confirmation does not match', async ({ page }) => {
	await page.goto('/register');
	await page.getByLabel('First name').fill('Ada');
	await page.getByLabel('Last name').fill('Lovelace');
	await page.getByLabel('Email address').fill('ada@example.com');
	await page.getByLabel('Password', { exact: true }).fill('correct-horse-battery');
	await page.getByLabel('Confirm password').fill('staple-battery-horse');
	await page.getByRole('checkbox', { name: /I agree to the/i }).check();
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(
		page.getByTestId('register-error').getByText('Passwords do not match')
	).toBeVisible();
});
