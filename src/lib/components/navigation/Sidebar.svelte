<script lang="ts">
	import { Sidebar, SidebarWrapper, SidebarGroup } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import NavigationLink from './NavigationLink.svelte';
	import { navItems } from './types.js';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
	};

	let { isOpen, onClose }: Props = $props();
</script>

<Sidebar
	class={`fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
		isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
	}`}
	aria-label="Main navigation"
>
	<SidebarWrapper>
		<div class="mb-6 flex items-center justify-between lg:hidden">
			<span class="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
				Navigation
			</span>
			<button
				type="button"
				class="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
				aria-label="Close navigation"
				onclick={onClose}
			>
				<CloseOutline class="h-5 w-5" />
			</button>
		</div>

		<SidebarGroup>
			{#each navItems as item (item.path)}
				<NavigationLink {item} onNavigate={onClose} />
			{/each}
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
