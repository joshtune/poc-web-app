<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Button, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	import { page } from '$app/stores';
	
	let { children } = $props();
	
	let currentPath = $derived($page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SvelteKit Auth App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Navbar class="bg-white shadow-sm">
		<NavBrand href="/" class="flex items-center space-x-3">
			<img src={favicon} class="h-8 w-8" alt="Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Auth App</span>
		</NavBrand>
		
		<NavUl class="hidden md:flex md:space-x-8 md:mt-0 md:text-sm md:font-medium">
			<NavLi href="/" activeClass={currentPath === '/' ? 'text-primary-600' : ''}>Home</NavLi>
			<NavLi href="/login" activeClass={currentPath === '/login' ? 'text-primary-600' : ''}>Sign In</NavLi>
			<NavLi href="/register" activeClass={currentPath === '/register' ? 'text-primary-600' : ''}>Sign Up</NavLi>
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
	
	<main>
		{@render children?.()}
	</main>
</div>
