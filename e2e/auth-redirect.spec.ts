import { expect, test } from '@playwright/test';

test.describe('authentication gate', () => {
	test('redirects unauthenticated visitors from the dashboard to the login screen', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/login$/);
		await expect(
			page.getByRole('heading', { level: 2, name: 'Sign in to your account' })
		).toBeVisible();
	});

	test('preserves the intended destination when deep links require auth', async ({ page }) => {
		await page.goto('/profile');
		await expect(page).toHaveURL(/\/login\?redirectTo=%2Fprofile$/);
		await expect(
			page.getByRole('link', { name: 'create a new account' })
		).toBeVisible();
	});
});
