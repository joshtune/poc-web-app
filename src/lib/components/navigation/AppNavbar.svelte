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

	let menuTrigger = $state<HTMLButtonElement | null>(null);
	let menuContent = $state<HTMLDivElement | null>(null);
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	$effect(() => {
		if (!isMenuOpen) {
			return;
		}

		function handleClick(event: MouseEvent) {
			const target = event.target as Node;
			if (menuContent?.contains(target) || menuTrigger?.contains(target)) {
				return;
			}
			closeMenu();
		}

		function handleKey(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				closeMenu();
			}
		}

		window.addEventListener('click', handleClick);
		window.addEventListener('keydown', handleKey);

		return () => {
			window.removeEventListener('click', handleClick);
			window.removeEventListener('keydown', handleKey);
		};
	});
</script>

<Navbar
	class="relative z-50 bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700"
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

	<div class="relative flex items-center">
		<button
			type="button"
			bind:this={menuTrigger}
			class={`rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
				isMenuOpen
					? 'bg-gray-100 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
					: 'text-gray-600 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
			}`}
			aria-haspopup="true"
			aria-expanded={isMenuOpen}
			onclick={toggleMenu}
		>
			<UserCircleOutline class="h-6 w-6" />
		</button>

		{#if isMenuOpen}
			<div
				bind:this={menuContent}
				class="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="border-b border-gray-100 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<span
							class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
						>
							Display
						</span>
						<ThemeToggle />
					</div>
				</div>
				<div class="flex flex-col gap-1 p-2">
					{#if isLoggedIn}
						<button
							type="button"
							class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-primary-400"
							onclick={() => {
								closeMenu();
								onProfileClick();
							}}
						>
							<UserCircleOutline class="h-5 w-5" />
							Profile
						</button>
						<button
							type="button"
							class={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
								isLoggingOut
									? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
									: 'text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-primary-400'
							}`}
							onclick={() => {
								if (isLoggingOut) return;
								closeMenu();
								onLogoutClick();
							}}
							disabled={isLoggingOut}
							aria-disabled={isLoggingOut}
						>
							<ArrowLeftToBracketOutline class="h-5 w-5" />
							Sign out
						</button>
					{:else}
						<button
							type="button"
							class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-primary-400"
							onclick={() => {
								closeMenu();
								onLoginClick();
							}}
						>
							<ArrowRightToBracketOutline class="h-5 w-5" />
							Sign in
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</Navbar>
