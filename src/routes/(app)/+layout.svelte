<script lang="ts">
	import AppNavbar from '$lib/components/navigation/AppNavbar.svelte';
	import Sidebar from '$lib/components/navigation/Sidebar.svelte';
	import { filterNavItemsByRole } from '$lib/components/navigation/types.js';
	import { deriveUserRole } from '$lib/auth/roles';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authState, primeAuthState, getAuthStateSnapshot } from '$lib/auth/sessionStore';
	import type { AuthState } from '$lib/auth/sessionStore';

	let { children, data } = $props();

	let isLoggingOut = $state(false);
	let isSidebarOpen = $state(false);
	let auth = $state<AuthState>(getAuthStateSnapshot());

	$effect(() => {
		primeAuthState(data?.session ?? null);
	});

	$effect(() => {
		const unsubscribe = authState.subscribe((value) => {
			auth = value;
		});
		return () => unsubscribe();
	});

	const user = $derived(auth.user);
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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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
		<Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} items={sidebarItems} />

		<main class="flex-1 overflow-y-auto">
			<div class="min-h-full">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
