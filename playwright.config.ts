import { defineConfig } from '@playwright/test';

const PORT = process.env.PORT ?? '4173';
const HOST = process.env.HOST ?? '127.0.0.1';
const baseURL = `http://${HOST}:${PORT}`;

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	reporter: [['list']],
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: process.env.CI ? 'retain-on-failure' : 'off'
	},
	webServer: {
		command: `pnpm exec vite dev --host ${HOST} --port ${PORT}`,
		url: baseURL,
		timeout: 2 * 60 * 1000,
		reuseExistingServer: !process.env.CI,
		env: {
			VITE_PUBLIC_SUPABASE_URL: process.env.VITE_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321',
			VITE_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_PUBLIC_SUPABASE_ANON_KEY ?? 'test-anon-key'
		}
	}
});
