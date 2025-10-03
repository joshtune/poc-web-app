<script lang="ts">
	import AppNavbar from '$lib/components/navigation/AppNavbar.svelte';
	import Sidebar from '$lib/components/navigation/Sidebar.svelte';
	import { filterNavItemsByRole } from '$lib/components/navigation/types.js';
	import { deriveUserRole } from '$lib/auth/roles';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authUser, primeAuthState } from '$lib/auth/sessionStore';

	let { children, data } = $props();

	let isLoggingOut = $state(false);
	let isSidebarOpen = $state(false);

	$effect(() => {
		primeAuthState(data?.session ?? null);
	});

	const user = $derived($authUser);
	const userRole = $derived(deriveUserRole(user));
	const sidebarItems = $derived(filterNavItemsByRole(userRole));

	function handleProfileClick() {
		goto(resolve(user ? '/profile' : '/login'));
	}

	function handleLoginClick() {
		goto(resolve('/login'));
	}

	async function handleLogoutClick() {
		if (isLoggingOut) {
			return;
		}
		isLoggingOut = true;
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error('Logout error:', error);
				return;
			}
			await goto(resolve('/login'));
		} finally {
			isLoggingOut = false;
		}
	}

	function closeSidebar() {
		isSidebarOpen = false;
	}

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
</script>

<div
	class="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900"
>
	<AppNavbar
		{user}
		{isLoggingOut}
		onToggleSidebar={toggleSidebar}
		onProfileClick={handleProfileClick}
		onLoginClick={handleLoginClick}
		onLogoutClick={handleLogoutClick}
	/>

	{#if isSidebarOpen}
		<div
			class="fixed inset-0 z-20 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
			aria-hidden="true"
			onclick={closeSidebar}
		></div>
	{/if}

	<div class="relative flex flex-1 overflow-hidden">
		<div class="relative flex-shrink-0 w-0 lg:w-64">
			<div class="absolute inset-0 hidden lg:block" aria-hidden="true"></div>
			<div
				class="relative z-10 h-full bg-gray-50 border-r border-gray-200 dark:border-gray-700 dark:bg-gray-800"
			>
				<Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} items={sidebarItems} />
			</div>
		</div>

		<main class="flex-1 overflow-y-auto">
			<div class="min-h-full">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
