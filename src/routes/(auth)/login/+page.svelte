<script lang="ts">
	import { Button, Card, Label, Input, Checkbox, Alert } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	let email = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let errorMessage = '';

	async function handleLogin() {
		if (!email || !password) {
			errorMessage = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				errorMessage = error.message;
			} else if (data.user) {
				const redirectParam = get(page).url.searchParams.get('redirectTo');
				const destination = redirectParam ? decodeURIComponent(redirectParam) : '/';
				await goto(destination);
			}
		} catch (err) {
			errorMessage = 'An unexpected error occurred. Please try again.';
			console.error('Login error:', err);
		} finally {
			isLoading = false;
		}
	}

	async function handleGoogleLogin() {
		isLoading = true;
		errorMessage = '';

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/`
				}
			});

			if (error) {
				errorMessage = error.message;
			}
		} catch (err) {
			errorMessage = 'An unexpected error occurred. Please try again.';
			console.error('Google login error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Sign in to your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Or
				<a href="/register" class="font-medium text-primary-600 hover:text-primary-500">
					create a new account
				</a>
			</p>
		</div>

		<div class="flex justify-center">
			<Card class="p-6 w-full max-w-md">
				{#if errorMessage}
					<Alert color="red" class="mb-4">
						{errorMessage}
					</Alert>
				{/if}

				<form on:submit|preventDefault={handleLogin} class="space-y-6">
					<div>
						<Label for="email" class="block text-sm font-medium text-gray-700">Email address</Label>
						<Input
							id="email"
							type="email"
							bind:value={email}
							placeholder="Enter your email"
							required
							class="mt-1"
						/>
					</div>

					<div>
						<Label for="password" class="block text-sm font-medium text-gray-700">Password</Label>
						<Input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Enter your password"
							required
							class="mt-1"
						/>
					</div>

					<div class="flex items-center justify-between">
						<Checkbox bind:checked={rememberMe}>Remember me</Checkbox>
						<a href="/forgot-password" class="text-sm text-primary-600 hover:text-primary-500">
							Forgot your password?
						</a>
					</div>

					<Button type="submit" color="primary" size="lg" class="w-full" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>

				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-300"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-2 bg-white text-gray-500">Or continue with</span>
						</div>
					</div>

					<div class="mt-6 grid grid-cols-2 gap-3">
						<Button color="light" class="w-full" onclick={handleGoogleLogin} disabled={isLoading}>
							<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Google
						</Button>
						<Button color="light" class="w-full">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
								/>
							</svg>
							Facebook
						</Button>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>
