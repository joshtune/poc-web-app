<script lang="ts">
	import { Button, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { children } = $props();

	let currentPath = $derived($page.url.pathname);
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<Navbar class="bg-white shadow-sm" fluid>
		<NavBrand href="/" class="flex items-center space-x-3">
			<img src={favicon} class="h-8 w-8" alt="Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold">Auth App</span>
		</NavBrand>

		<NavUl class="hidden md:flex md:space-x-8 md:mt-0 md:text-sm md:font-medium">
			<NavLi href="/" activeClass={currentPath === '/' ? 'text-primary-600' : ''}>Dashboard</NavLi>
		</NavUl>

		<div class="flex items-center space-x-3">
			{#if currentPath !== '/login'}
				<Button href="/login" color="light" size="sm">Sign In</Button>
			{/if}
			{#if currentPath !== '/register'}
				<Button href="/register" color="primary" size="sm">Sign Up</Button>
			{/if}
		</div>
	</Navbar>

	<main class="flex-1">
		{@render children?.()}
	</main>
</div>
