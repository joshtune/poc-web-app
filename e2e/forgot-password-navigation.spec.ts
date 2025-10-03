import { expect, test } from '@playwright/test';

test('login page links to the password reset flow', async ({ page }) => {
	await page.goto('/login');
	await page.getByRole('link', { name: 'Forgot your password?' }).click();
	await expect(page).toHaveURL('/forgot-password');
	await expect(page.getByRole('heading', { name: 'Forgot your password?' })).toBeVisible();
});
