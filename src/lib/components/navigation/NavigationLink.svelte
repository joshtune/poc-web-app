<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { SidebarItem, SidebarDropdownWrapper, SidebarDropdownItem } from 'flowbite-svelte';
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

{#if childLinks.length > 0}
	<SidebarDropdownWrapper label={item.label} isOpen={isChildActive}>
		{#each childLinks as child (child.path)}
			{@const isChildFocused = currentPath === resolve(child.path)}
			<SidebarDropdownItem
				label={child.label}
				href={resolve(child.path)}
				active={isChildFocused}
				onclick={handleClick}
			/>
		{/each}
	</SidebarDropdownWrapper>
{:else}
	<SidebarItem
		label={item.label}
		href={resolve(item.path)}
		active={isActive}
		onclick={handleClick}
	/>
{/if}
