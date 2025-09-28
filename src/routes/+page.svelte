<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="text-center">
			<h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
				Welcome to <span class="text-primary-600">SvelteKit</span>
			</h1>
			<p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
				A modern web application built with SvelteKit and Flowbite components
			</p>
		</div>
		
		<div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			<Card class="p-6 text-center">
				<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Sign In</h3>
				<p class="text-gray-500 mb-4">Access your account with your credentials</p>
				<Button href="/login" color="primary" class="w-full">Sign In</Button>
			</Card>
			
			<Card class="p-6 text-center">
				<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Create Account</h3>
				<p class="text-gray-500 mb-4">Join us and create your new account</p>
				<Button href="/register" color="primary" class="w-full">Sign Up</Button>
			</Card>
			
			<Card class="p-6 text-center">
				<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Forgot Password</h3>
				<p class="text-gray-500 mb-4">Reset your password if you forgot it</p>
				<Button href="/forgot-password" color="light" class="w-full">Reset Password</Button>
			</Card>
		</div>
		
		<div class="mt-12 text-center">
			<p class="text-gray-500">
				Visit <a href="https://svelte.dev/docs/kit" class="text-primary-600 hover:text-primary-500">svelte.dev/docs/kit</a> to read the documentation
			</p>
		</div>
	</div>
</div>
