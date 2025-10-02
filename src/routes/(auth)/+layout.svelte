<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import { ThemeToggle } from '$lib';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
	<header
		class="flex items-center justify-between border-b border-gray-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90"
	>
		<a
			href={resolve('/')}
			class="flex items-center gap-2 text-gray-900 hover:text-primary-600 dark:text-white"
		>
			<img src={favicon} alt="Logo" class="h-8 w-8" />
			<span class="text-lg font-semibold">Auth App</span>
		</a>
		<ThemeToggle />
	</header>

	<main class="flex-1">
		{@render children?.()}
	</main>
</div>
