import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

const DEFAULT_THEME: Theme = 'dark';

function resolveInitialTheme(): Theme {
	if (!browser) {
		return DEFAULT_THEME;
	}

	const stored = localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	return DEFAULT_THEME;
}

export const theme = writable<Theme>(DEFAULT_THEME);

function applyTheme(value: Theme) {
	if (!browser) {
		return;
	}

	document.documentElement.classList.toggle('dark', value === 'dark');
}

if (browser) {
	const initial = resolveInitialTheme();
	theme.set(initial);
	applyTheme(initial);

	theme.subscribe((value) => {
		applyTheme(value);
		localStorage.setItem('theme', value);
	});
}

export function toggleTheme() {
	theme.update((value) => (value === 'dark' ? 'light' : 'dark'));
}
