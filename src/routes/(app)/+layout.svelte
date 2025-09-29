<script lang="ts">
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import {
		ArrowLeftToBracketOutline,
		ArrowRightToBracketOutline,
		UserCircleOutline,
		BarsOutline,
		CloseOutline
	} from 'flowbite-svelte-icons';
	import favicon from '$lib/assets/favicon.svg';
	import { ThemeToggle } from '$lib';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';
	import { page } from '$app/stores';

	type RoutePath = '/' | '/admin' | '/admin/manage-users';

	type NavLink = {
		label: string;
		path: RoutePath;
		children?: readonly NavChild[];
	};

	type NavChild = {
		label: string;
		path: RoutePath;
	};

	let { children, data } = $props();

	let user = $state<User | null>(data?.session?.user ?? null);
	let isLoggingOut = $state(false);
	let authSubscription: { unsubscribe: () => void } | null = null;
	let isLoggedIn = $derived(Boolean(user));
	let isSidebarOpen = $state(false);
	const currentPath = $derived($page.url.pathname);

	const navItems = [
		{ label: 'Dashboard', path: '/' },
		{
			label: 'Admin',
			path: '/admin',
			children: [{ label: 'Manage Users', path: '/admin/manage-users' }]
		}
	] satisfies readonly NavLink[];

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
	<Navbar
		class="relative z-30 bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700"
		fluid
	>
		<div class="flex items-center gap-3">
			<button
				type="button"
				class="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400 lg:hidden"
				aria-label="Toggle navigation"
				onclick={toggleSidebar}
			>
				<BarsOutline class="h-5 w-5" />
			</button>
			<NavBrand href={resolve('/')} class="flex items-center space-x-3">
				<img src={favicon} class="h-8 w-8" alt="Logo" />
				<span
					class="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white"
				>
					Auth App
				</span>
			</NavBrand>
		</div>

		<div class="flex items-center gap-2">
			<ThemeToggle />
			<button
				type="button"
				class="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
				aria-label={user ? 'Go to profile' : 'Sign in'}
				onclick={handleProfileClick}
			>
				<UserCircleOutline class="h-6 w-6" />
			</button>
			{#if !isLoggedIn}
				<button
					type="button"
					class="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
					aria-label="Go to login"
					onclick={handleLoginClick}
				>
					<ArrowRightToBracketOutline class="h-6 w-6" />
				</button>
			{/if}
			{#if isLoggedIn}
				<button
					type="button"
					class={`rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
						isLoggingOut
							? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
							: 'text-gray-600 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
					}`}
					aria-label="Sign out"
					onclick={handleLogoutClick}
					disabled={isLoggingOut}
					aria-disabled={isLoggingOut}
				>
					<ArrowLeftToBracketOutline class="h-6 w-6" />
				</button>
			{/if}
		</div>
	</Navbar>

	{#if isSidebarOpen}
		<div
			class="fixed inset-0 z-20 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
			aria-hidden="true"
			onclick={closeSidebar}
		></div>
	{/if}

	<div class="relative flex flex-1 overflow-hidden">
		<aside
			class={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white px-4 py-6 shadow-lg transition-transform duration-200 ease-in-out dark:border-gray-700 dark:bg-gray-800 lg:static lg:translate-x-0 lg:shadow-none ${
				isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
			}`}
			aria-label="Main navigation"
		>
			<div class="mb-6 flex items-center justify-between lg:hidden">
				<span class="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
					Navigation
				</span>
				<button
					type="button"
					class="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
					aria-label="Close navigation"
					onclick={closeSidebar}
				>
					<CloseOutline class="h-5 w-5" />
				</button>
			</div>
			<nav class="space-y-1">
				{#each navItems as item (item.path)}
					{@const destination = resolve(item.path)}
					{@const childLinks = item.children ?? []}
					{@const isChildActive = childLinks.some((child) => currentPath === resolve(child.path))}
					{@const isActive = currentPath === destination || isChildActive}
					<a
						href={destination}
						class={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
							isActive
								? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300'
								: 'text-gray-600 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-200'
						}`}
						aria-current={currentPath === destination ? 'page' : undefined}
						onclick={closeSidebar}
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
									href={childDestination}
									class={`flex items-center rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
										isChildFocused
											? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300'
											: 'text-gray-500 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-primary-200'
									}`}
									onclick={closeSidebar}
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
				{/each}
			</nav>
		</aside>

		<main class="flex-1 overflow-y-auto">
			<div class="min-h-full">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
