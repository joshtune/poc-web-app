<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.png';
	import ThemeToggle from './ThemeToggle.svelte';

	export let brandLabel = 'Auth App';
	export let homePath = '/';
	export let contentClass = 'min-h-screen bg-transparent';

	const homeHref = resolve(homePath);
</script>

<div
	class="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900"
>
	<header
		class="flex items-center justify-between border-b border-gray-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90"
	>
		<a
			href={homeHref}
			class="flex items-center gap-2 text-gray-900 hover:text-primary-600 dark:text-white"
		>
			<img src={favicon} alt="Logo" class="h-8 w-8" />
			<span class="text-lg font-semibold">{brandLabel}</span>
		</a>
		<ThemeToggle />
	</header>

	<main class="flex-1">
		<div class={contentClass}>
			<slot />
		</div>
	</main>
</div>
