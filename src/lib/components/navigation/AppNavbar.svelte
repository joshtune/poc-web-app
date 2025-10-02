<script lang="ts">
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import {
		ArrowLeftToBracketOutline,
		ArrowRightToBracketOutline,
		UserCircleOutline,
		BarsOutline
	} from 'flowbite-svelte-icons';
	import favicon from '$lib/assets/favicon.png';
	import { ThemeToggle } from '$lib';
	import { resolve } from '$app/paths';
	import type { User } from '@supabase/supabase-js';

	type Props = {
		user: User | null;
		isLoggingOut: boolean;
		onToggleSidebar: () => void;
		onProfileClick: () => void;
		onLoginClick: () => void;
		onLogoutClick: () => void;
	};

	let { user, isLoggingOut, onToggleSidebar, onProfileClick, onLoginClick, onLogoutClick }: Props =
		$props();

	const isLoggedIn = $derived(Boolean(user));
</script>

<Navbar
	class="relative z-30 bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700"
	fluid
>
	<div class="flex items-center gap-3">
		<button
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400 lg:hidden"
			aria-label="Toggle navigation"
			onclick={onToggleSidebar}
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
			onclick={onProfileClick}
		>
			<UserCircleOutline class="h-6 w-6" />
		</button>
		{#if !isLoggedIn}
			<button
				type="button"
				class="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400"
				aria-label="Go to login"
				onclick={onLoginClick}
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
				onclick={onLogoutClick}
				disabled={isLoggingOut}
				aria-disabled={isLoggingOut}
			>
				<ArrowLeftToBracketOutline class="h-6 w-6" />
			</button>
		{/if}
	</div>
</Navbar>
