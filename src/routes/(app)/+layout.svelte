<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	import {
		ArrowLeftToBracketOutline,
		ArrowRightToBracketOutline,
		UserCircleOutline
	} from 'flowbite-svelte-icons';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';

	let { children, data } = $props();

	let currentPath = $derived($page.url.pathname);
	let user = $state<User | null>(data?.session?.user ?? null);
	let isLoggingOut = $state(false);
	let authSubscription: { unsubscribe: () => void } | null = null;
	let isLoggedIn = $derived(Boolean(user));

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
		goto(user ? '/profile' : '/login');
	}

	function handleLoginClick() {
		goto('/login');
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
			await goto('/login');
		} finally {
			isLoggingOut = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<Navbar class="bg-white shadow-sm" fluid>
		<NavBrand href="/" class="flex items-center space-x-3">
			<img src={favicon} class="h-8 w-8" alt="Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold">Auth App</span>
		</NavBrand>

		<div class="flex items-center gap-2">
			<button
				type="button"
				class="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
				aria-label={user ? 'Go to profile' : 'Sign in'}
				onclick={handleProfileClick}
			>
				<UserCircleOutline class="h-6 w-6" />
			</button>
			{#if !isLoggedIn}
				<button
					type="button"
					class="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
							? 'cursor-not-allowed text-gray-400'
							: 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
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

	<main class="flex-1">
		{@render children?.()}
	</main>
</div>
