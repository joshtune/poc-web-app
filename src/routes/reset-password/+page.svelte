<script lang="ts">
	import { Button, Card, Label, Input } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	let password = '';
	let confirmPassword = '';
	let isLoading = false;
	let passwordReset = false;
	
	// In a real app, you'd get the token from the URL params
	let token = $page.url.searchParams.get('token') || 'sample-token';
	
	async function handleResetPassword() {
		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}
		
		if (password.length < 8) {
			alert('Password must be at least 8 characters long');
			return;
		}
		
		isLoading = true;
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		isLoading = false;
		passwordReset = true;
	}
	
	function goToLogin() {
		goto('/login');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				{passwordReset ? 'Password reset successful' : 'Reset your password'}
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				{#if passwordReset}
					Your password has been successfully reset. You can now sign in with your new password.
				{:else}
					Enter your new password below.
				{/if}
			</p>
		</div>
		
		<Card class="p-6">
			{#if passwordReset}
				<div class="text-center space-y-4">
					<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
						<svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-medium text-gray-900">Password updated!</h3>
						<p class="text-sm text-gray-600 mt-2">
							Your password has been successfully updated. You can now sign in with your new password.
						</p>
					</div>
					<Button color="primary" class="w-full" onclick={goToLogin}>
						Sign In
					</Button>
				</div>
			{:else}
				<form on:submit|preventDefault={handleResetPassword} class="space-y-6">
					<div>
						<Label for="password" class="block text-sm font-medium text-gray-700">
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
						<p class="mt-1 text-xs text-gray-500">
							Password must be at least 8 characters long
						</p>
					</div>
					
					<div>
						<Label for="confirmPassword" class="block text-sm font-medium text-gray-700">
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
					
					<Button
						type="submit"
						color="primary"
						size="lg"
						class="w-full"
						disabled={isLoading}
					>
						{isLoading ? 'Updating password...' : 'Update password'}
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
</div>
