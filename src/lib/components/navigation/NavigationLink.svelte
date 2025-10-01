<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import type { NavLink } from './types.js';

	type Props = {
		item: NavLink;
		onNavigate?: () => void;
	};

	let { item, onNavigate }: Props = $props();

	const currentPath = $derived($page.url.pathname);
	const childLinks = $derived(item.children ?? []);
	const isChildActive = $derived(childLinks.some((child) => currentPath === resolve(child.path)));
	const isActive = $derived(currentPath === resolve(item.path) || isChildActive);

	function handleClick() {
		onNavigate?.();
	}
</script>

<a
	href={resolve(item.path)}
	class={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
		isActive
			? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300'
			: 'text-gray-600 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-200'
	}`}
	aria-current={currentPath === resolve(item.path) ? 'page' : undefined}
	onclick={handleClick}
>
	<span
		class={`mr-2 h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 transition group-hover:opacity-100 ${
			isActive ? 'opacity-100' : ''
		}`}
	></span>
	<span>{item.label}</span>
</a>

{#if childLinks.length}
	<div class="mt-1 space-y-1 border-l border-gray-200 pl-4 dark:border-gray-700">
		{#each childLinks as child (child.path)}
			{@const childDestination = resolve(child.path)}
			{@const isChildFocused = currentPath === childDestination}
			<a
				href={resolve(child.path)}
				class={`flex items-center rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
					isChildFocused
						? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300'
						: 'text-gray-500 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-primary-200'
				}`}
				onclick={handleClick}
				aria-current={isChildFocused ? 'page' : undefined}
			>
				<span
					class={`mr-2 h-1 w-1 rounded-full bg-primary-500 ${isChildFocused ? '' : 'opacity-60'}`}
				></span>
				<span>{child.label}</span>
			</a>
		{/each}
	</div>
{/if}
