<script lang="ts">
	import { Button, Card, Label, Input, Alert } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	let email = '';
	let isLoading = false;
	let emailSent = false;
	let errorMessage = '';

	async function handleForgotPassword() {
		if (!email) {
			errorMessage = 'Please enter your email address';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`
			});

			if (error) {
				errorMessage = error.message;
			} else {
				emailSent = true;
			}
		} catch (err) {
			errorMessage = 'An unexpected error occurred. Please try again.';
			console.error('Password reset error:', err);
		} finally {
			isLoading = false;
		}
	}

	function goToLogin() {
		goto('/login');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				{emailSent ? 'Check your email' : 'Forgot your password?'}
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				{#if emailSent}
					We've sent a password reset link to your email address.
				{:else}
					Enter your email address and we'll send you a link to reset your password.
				{/if}
			</p>
		</div>

		<div class="flex justify-center">
			<Card class="p-6 w-full max-w-md">
				{#if errorMessage}
					<Alert color="red" class="mb-4">
						{errorMessage}
					</Alert>
				{/if}

				{#if emailSent}
					<div class="text-center space-y-4">
						<div
							class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
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
							<h3 class="text-lg font-medium text-gray-900">Email sent successfully!</h3>
							<p class="text-sm text-gray-600 mt-2">
								We've sent a password reset link to <strong>{email}</strong>. Please check your
								email and follow the instructions to reset your password.
							</p>
						</div>
						<div class="space-y-3">
							<Button color="primary" class="w-full" onclick={goToLogin}>Back to Sign In</Button>
							<Button color="light" class="w-full" onclick={() => (emailSent = false)}>
								Send another email
							</Button>
						</div>
					</div>
				{:else}
					<form on:submit|preventDefault={handleForgotPassword} class="space-y-6">
						<div>
							<Label for="email" class="block text-sm font-medium text-gray-700"
								>Email address</Label
							>
							<Input
								id="email"
								type="email"
								bind:value={email}
								placeholder="Enter your email address"
								required
								class="mt-1"
							/>
						</div>

						<Button type="submit" color="primary" size="lg" class="w-full" disabled={isLoading}>
							{isLoading ? 'Sending...' : 'Send reset link'}
						</Button>
					</form>

					<div class="mt-6 text-center">
						<p class="text-sm text-gray-600">
							Remember your password?
							<a href="/login" class="font-medium text-primary-600 hover:text-primary-500">
								Sign in here
							</a>
						</p>
					</div>
				{/if}
			</Card>
		</div>

		{#if !emailSent}
			<div class="text-center">
				<p class="text-xs text-gray-500">
					If you don't receive an email within a few minutes, check your spam folder or
					<a href="/contact" class="text-primary-600 hover:text-primary-500">contact support</a>.
				</p>
			</div>
		{/if}
	</div>
</div>
