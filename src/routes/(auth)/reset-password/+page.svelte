<script lang="ts">
	import { Button, Card, Label, Input, Alert } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let password = '';
	let confirmPassword = '';
	let isLoading = false;
	let passwordReset = false;
	let errorMessage = '';
	let isValidSession = false;

	// Get the access token and refresh token from URL hash
	let accessToken = '';
	let refreshToken = '';

	onMount(() => {
		const hash = globalThis.location?.hash ?? '';
		const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
		accessToken = hashParams.get('access_token') || '';
		refreshToken = hashParams.get('refresh_token') || '';

		if (accessToken && refreshToken) {
			// Set the session
		supabase.auth
			.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			})
			.then(({ error }) => {
					if (error) {
						errorMessage = 'Invalid or expired reset link. Please request a new password reset.';
					} else {
						isValidSession = true;
					}
				});
		} else {
			errorMessage = 'Invalid reset link. Please request a new password reset.';
		}
	});

	async function handleResetPassword() {
		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		if (password.length < 8) {
			errorMessage = 'Password must be at least 8 characters long';
			return;
		}

		if (!isValidSession) {
			errorMessage = 'Invalid session. Please request a new password reset.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const { error } = await supabase.auth.updateUser({
				password: password
			});

			if (error) {
				errorMessage = error.message;
			} else {
				passwordReset = true;
			}
		} catch (err) {
			errorMessage = 'An unexpected error occurred. Please try again.';
			console.error('Password reset error:', err);
		} finally {
			isLoading = false;
		}
	}

	function goToLogin() {
		goto(resolve('/login'));
	}
</script>

<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
				{passwordReset ? 'Password reset successful' : 'Reset your password'}
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
				{#if passwordReset}
					Your password has been successfully reset. You can now sign in with your new password.
				{:else}
					Enter your new password below.
				{/if}
			</p>
		</div>

		<div class="flex justify-center">
			<Card class="p-6 w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
				{#if errorMessage}
					<Alert color="red" class="mb-4">
						{errorMessage}
					</Alert>
				{/if}

				{#if passwordReset}
					<div class="text-center space-y-4">
						<div
							class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40"
						>
							<svg
								class="h-6 w-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white">Password updated!</h3>
							<p class="text-sm text-gray-600 mt-2 dark:text-gray-300">
								Your password has been successfully updated. You can now sign in with your new
								password.
							</p>
						</div>
						<Button color="primary" class="w-full" onclick={goToLogin}>Sign In</Button>
					</div>
				{:else if isValidSession}
					<form on:submit|preventDefault={handleResetPassword} class="space-y-6">
						<div>
							<Label
								for="password"
								class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								New password
							</Label>
							<Input
								id="password"
								type="password"
								bind:value={password}
								placeholder="Enter your new password"
								required
								class="mt-1"
							/>
							<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Password must be at least 8 characters long
							</p>
						</div>

						<div>
							<Label
								for="confirmPassword"
								class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Confirm new password
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								bind:value={confirmPassword}
								placeholder="Confirm your new password"
								required
								class="mt-1"
							/>
						</div>

						<Button type="submit" color="primary" size="lg" class="w-full" disabled={isLoading}>
							{isLoading ? 'Updating password...' : 'Update password'}
						</Button>
					</form>

					<div class="mt-6 text-center">
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Remember your password?
							<a
								href={resolve('/login')}
								class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
							>
								Sign in here
							</a>
						</p>
					</div>
				{:else}
					<div class="text-center space-y-4">
						<div
							class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/40"
						>
							<svg
								class="h-6 w-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white">Invalid Reset Link</h3>
							<p class="text-sm text-gray-600 mt-2 dark:text-gray-300">
								This password reset link is invalid or has expired. Please request a new password
								reset.
							</p>
						</div>
						<div class="space-y-3">
						<Button
							color="primary"
							class="w-full"
							onclick={() => goto(resolve('/forgot-password'))}
						>
								Request New Reset Link
							</Button>
							<Button color="light" class="w-full" onclick={goToLogin}>Back to Sign In</Button>
						</div>
					</div>
				{/if}
			</Card>
		</div>
	</div>
</div>
