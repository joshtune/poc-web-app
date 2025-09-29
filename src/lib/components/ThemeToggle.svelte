<script lang="ts">
	import { MoonOutline, SunOutline } from 'flowbite-svelte-icons';
	import { theme, toggleTheme } from '$lib/stores/theme';

	function handleToggle() {
		toggleTheme();
	}
</script>

<button
	type="button"
	class="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
	aria-label={$theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	aria-pressed={$theme === 'dark'}
	title={$theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	on:click={handleToggle}
>
	{#if $theme === 'dark'}
		<SunOutline class="h-5 w-5" />
	{:else}
		<MoonOutline class="h-5 w-5" />
	{/if}
</button>
