<script lang="ts">
	import { Button, Card, Label, Input, Checkbox, Alert } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { resolve } from '$app/paths';
	import { AUTH_PROVIDER_CONFIG } from '$lib/config';
	import SocialAuthButtons from '$lib/components/SocialAuthButtons.svelte';

	function parseDestination(raw: string): { pathname: string; search: string; hash: string } {
		try {
			const url = new URL(raw, 'http://localhost');
			return { pathname: url.pathname, search: url.search, hash: url.hash };
		} catch (error) {
			console.warn('Invalid redirect destination supplied, falling back to root', error);
			return { pathname: '/', search: '', hash: '' };
		}
	}

	let email = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let errorMessage = '';
	const isGoogleAuthEnabled = AUTH_PROVIDER_CONFIG.google;
	const isFacebookAuthEnabled = AUTH_PROVIDER_CONFIG.facebook;
	const socialProviders = [
		{ type: 'google', enabled: isGoogleAuthEnabled, onClick: handleGoogleLogin },
		{ type: 'facebook', enabled: isFacebookAuthEnabled }
	] as const;

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
				const decodedDestination = redirectParam ? decodeURIComponent(redirectParam) : '/';
				const destination = decodedDestination.startsWith('/') ? decodedDestination : '/';
				const { pathname, search, hash } = parseDestination(destination);
				let routeId: '/(app)/admin' | '/(app)/admin/manage-users' | '/(app)/profile' | '/' = '/';

				switch (pathname) {
					case '/admin':
						routeId = '/(app)/admin';
						break;
					case '/admin/manage-users':
						routeId = '/(app)/admin/manage-users';
						break;
					case '/profile':
						routeId = '/(app)/profile';
						break;
					case '/':
					default:
						routeId = '/';
				}

				const resolvedPath = resolve(routeId);
				await goto(resolvedPath);

				if ((search && search !== '?') || hash) {
					const finalHref = `${resolvedPath}${search}${hash}`;
					try {
						globalThis.history?.replaceState?.(null, '', finalHref);
					} catch (historyError) {
						console.warn('Unable to preserve redirect query parameters after login', historyError);
					}
				}
			}
		} catch (err) {
			errorMessage = 'An unexpected error occurred. Please try again.';
			console.error('Login error:', err);
		} finally {
			isLoading = false;
		}
	}

	async function handleGoogleLogin() {
		if (!isGoogleAuthEnabled) {
			return;
		}

		isLoading = true;
		errorMessage = '';

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
			console.error('Google login error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
				Sign in to your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
				Or
				<a
					href={resolve('/register')}
					class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
				>
					create a new account
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

				<form on:submit|preventDefault={handleLogin} class="space-y-6">
					<div>
						<Label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Email address</Label
						>
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
						<Label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Password</Label
						>
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
						<a
							href={resolve('/forgot-password')}
							class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
						>
							Forgot your password?
						</a>
					</div>

					<Button type="submit" color="primary" size="lg" class="w-full" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>

				<SocialAuthButtons {isLoading} providers={socialProviders} />
			</Card>
		</div>
	</div>
</div>
