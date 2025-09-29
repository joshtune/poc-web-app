<script lang="ts">
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import {
		ArrowLeftToBracketOutline,
		ArrowRightToBracketOutline,
		UserCircleOutline
	} from 'flowbite-svelte-icons';
	import favicon from '$lib/assets/favicon.svg';
	import { ThemeToggle } from '$lib';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';

	let { children, data } = $props();

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
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
	<Navbar class="bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700" fluid>
	<NavBrand href={resolve('/')} class="flex items-center space-x-3">
			<img src={favicon} class="h-8 w-8" alt="Logo" />
			<span
				class="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white"
			>
				Auth App
			</span>
		</NavBrand>

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

	<main class="flex-1">
		{@render children?.()}
	</main>
</div>
