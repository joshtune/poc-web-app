<script lang="ts">
	import AppNavbar from '$lib/components/navigation/AppNavbar.svelte';
	import Sidebar from '$lib/components/navigation/Sidebar.svelte';
	import { filterNavItemsByRole } from '$lib/components/navigation/types.js';
	import { deriveUserRole } from '$lib/auth/roles';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';

	let { children, data } = $props();

	let user = $state<User | null>(data?.session?.user ?? null);
	let isLoggingOut = $state(false);
	let authSubscription: { unsubscribe: () => void } | null = null;
	let isSidebarOpen = $state(false);
	const userRole = $derived(deriveUserRole(user));
	const sidebarItems = $derived(filterNavItemsByRole(userRole));

	function updateUserState(sessionUser: User | null) {
		user = sessionUser;
	}

	$effect(() => {
		if (data?.session?.user) {
			updateUserState(data.session.user);
		}
	});

	onMount(() => {
		let mounted = true;

		async function loadUser() {
			const { data } = await supabase.auth.getUser();
			if (!mounted) {
				return;
			}
			updateUserState(data.user ?? null);
		}

		loadUser();

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			updateUserState(session?.user ?? null);
		});

		authSubscription = listener?.subscription ?? null;

		return () => {
			mounted = false;
			authSubscription?.unsubscribe();
		};
	});

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
			updateUserState(null);
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
