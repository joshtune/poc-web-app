<script lang="ts">
	import { Button, Card, Label, Input, Checkbox, Alert } from 'flowbite-svelte';
	import { supabase } from '$lib/supabase';
	import { resolve } from '$app/paths';
	import { AUTH_PROVIDER_CONFIG } from '$lib/config';
	import SocialAuthButtons from '$lib/components/SocialAuthButtons.svelte';

	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let agreeToTerms = false;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';
	const isGoogleAuthEnabled = AUTH_PROVIDER_CONFIG.google;
	const isFacebookAuthEnabled = AUTH_PROVIDER_CONFIG.facebook;
	const socialProviders = [
		{ type: 'google', enabled: isGoogleAuthEnabled, onClick: handleGoogleRegister },
		{ type: 'facebook', enabled: isFacebookAuthEnabled }
	] as const;

	async function handleRegister() {
		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		if (!agreeToTerms) {
			errorMessage = 'Please agree to the terms and conditions';
			return;
		}

		if (password.length < 8) {
			errorMessage = 'Password must be at least 8 characters long';
			return;
		}

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						first_name: firstName,
						last_name: lastName,
						full_name: `${firstName} ${lastName}`
					}
				}
			});

			if (error) {
				errorMessage = error.message;
			} else if (data.user) {
				successMessage =
					'Account created successfully! Please check your email to verify your account.';
				// Clear form
				firstName = '';
				lastName = '';
				email = '';
				password = '';
				confirmPassword = '';
				agreeToTerms = false;
			}
		} catch (err) {
			errorMessage = 'An unexpected error occurred. Please try again.';
			console.error('Registration error:', err);
		} finally {
			isLoading = false;
		}
	}

	async function handleGoogleRegister() {
		if (!isGoogleAuthEnabled) {
			return;
		}

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const redirectPath = resolve('/');
			const origin = globalThis.location?.origin ?? '';
			const redirectTo = origin ? new URL(redirectPath, origin).toString() : redirectPath;

			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo
				}
			});

			if (error) {
				errorMessage = error.message;
			}
		} catch (err) {
			errorMessage = 'An unexpected error occurred. Please try again.';
			console.error('Google registration error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
				Create your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
				Or
				<a
					href={resolve('/login')}
					class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
				>
					sign in to your existing account
				</a>
			</p>
		</div>

		<div class="flex justify-center">
			<Card class="p-6 w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
				{#if errorMessage}
					<Alert color="red" class="mb-4">
						{errorMessage}
					</Alert>
				{/if}

				{#if successMessage}
					<Alert color="green" class="mb-4">
						{successMessage}
					</Alert>
				{/if}

				<form on:submit|preventDefault={handleRegister} class="space-y-6">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label
								for="firstName"
								class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								First name
							</Label>
							<Input
								id="firstName"
								type="text"
								bind:value={firstName}
								placeholder="John"
								required
								class="mt-1"
							/>
						</div>
						<div>
							<Label
								for="lastName"
								class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Last name
							</Label>
							<Input
								id="lastName"
								type="text"
								bind:value={lastName}
								placeholder="Doe"
								required
								class="mt-1"
							/>
						</div>
					</div>

					<div>
						<Label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Email address
						</Label>
						<Input
							id="email"
							type="email"
							bind:value={email}
							placeholder="john.doe@example.com"
							required
							class="mt-1"
						/>
					</div>

					<div>
						<Label
							for="password"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Password
						</Label>
						<Input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Create a strong password"
							required
							class="mt-1"
						/>
					</div>

					<div>
						<Label
							for="confirmPassword"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Confirm password
						</Label>
						<Input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							placeholder="Confirm your password"
							required
							class="mt-1"
						/>
					</div>

					<div>
						<Checkbox bind:checked={agreeToTerms} required>
							I agree to the
							<a
								href={resolve('/terms')}
								class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 px-1"
							>
								Terms and Conditions
							</a>
							and
							<a
								href={resolve('/privacy')}
								class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 px-1"
							>
								Privacy Policy
							</a>
						</Checkbox>
					</div>

					<Button type="submit" color="primary" size="lg" class="w-full" disabled={isLoading}>
						{isLoading ? 'Creating account...' : 'Create account'}
					</Button>
				</form>

				<SocialAuthButtons {isLoading} providers={socialProviders} />
			</Card>
		</div>
	</div>
</div>
