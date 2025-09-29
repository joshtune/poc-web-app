<script lang="ts">
	import { Avatar, Button, Card, Tabs, TabItem } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabase';

	let user: User | null = null;
	let avatarUrl: string | null = null;
	let isLoading = true;
	let errorMessage = '';
	let displayName = '';

	onMount(async () => {
		const { data, error } = await supabase.auth.getUser();

		if (error) {
			errorMessage = error.message;
		}

		user = data.user ?? null;
		avatarUrl = user?.user_metadata?.avatar_url ?? null;
		displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? '';
		isLoading = false;

		if (!user && !error) {
			goto('/login');
		}
	});

	function handleEditProfile() {
		// TODO: connect to actual profile editing flow
	}

	function handleManageSecurity() {
		// TODO: connect to password/security settings
	}

	function formatDate(date: string | null | undefined) {
		if (!date) {
			return 'Unavailable';
		}
		return new Intl.DateTimeFormat('en', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date));
	}

	function getAvatarInitials() {
		if (!displayName) {
			return (user?.email ?? '?').charAt(0).toUpperCase() || '?';
		}

		const parts = displayName.split(/\s+/).filter(Boolean);
		if (!parts.length) {
			return displayName.charAt(0).toUpperCase() || '?';
		}

		return parts
			.slice(0, 2)
			.map((part) => part.charAt(0).toUpperCase())
			.join('')
			.trim();
	}

	const profileFields = [
		{ label: 'Email', value: () => user?.email ?? 'Unknown' },
		{ label: 'Full name', value: () => user?.user_metadata?.full_name ?? 'Add your name' },
		{ label: 'Display name', value: () => user?.user_metadata?.name ?? 'Add a display name' }
	];

	const accountFields = [
		{ label: 'User ID', value: () => user?.id ?? 'Unavailable' },
		{ label: 'Last sign in', value: () => formatDate(user?.last_sign_in_at) },
		{ label: 'Created at', value: () => formatDate(user?.created_at) }
	];
</script>

<div class="space-y-10 px-4 py-10 sm:px-8 xl:px-12">
	<section class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<p class="text-sm font-medium text-primary-600">Profile</p>
			<h1 class="mt-1 text-3xl font-semibold text-gray-900">Account overview</h1>
			<p class="mt-2 max-w-xl text-sm text-gray-500">
				Manage how your information appears across the application and keep your account up to date.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<Button color="light" onclick={handleManageSecurity}>Security settings</Button>
			<Button color="primary" onclick={handleEditProfile}>Edit profile</Button>
		</div>
	</section>

	{#if isLoading}
		<Card class="p-10 text-center text-gray-500">
			<span class="animate-pulse">Loading your profile…</span>
		</Card>
	{:else if errorMessage}
		<Card class="border border-rose-200 bg-rose-50 p-6 text-rose-600">
			<p class="font-semibold">Unable to load profile</p>
			<p class="mt-1 text-sm">{errorMessage}</p>
			<Button class="mt-4" color="primary" onclick={() => goto('/login')}>Return to login</Button>
		</Card>
	{:else if user}
		<div class="grid gap-6 lg:grid-cols-[320px,1fr]">
			<Card class="flex flex-col items-center gap-4 p-8">
				<Avatar size="lg" class="h-24 w-24">
					{#if avatarUrl}
						<img
							src={avatarUrl}
							alt="Profile avatar"
							class="h-full w-full rounded-full object-cover"
						/>
					{:else}
						<span class="text-xl font-semibold text-gray-600">{getAvatarInitials()}</span>
					{/if}
				</Avatar>
				<div class="text-center">
					<p class="text-lg font-semibold text-gray-900">{displayName || user.email}</p>
					<p class="mt-1 text-sm text-gray-500">{user.email}</p>
				</div>
				<div class="w-full space-y-3">
					<Button color="light" class="w-full" onclick={handleEditProfile}>Update details</Button>
					<Button
						color="primary"
						class="w-full"
						onclick={() => supabase.auth.signOut().then(() => goto('/login'))}
					>
						Sign out
					</Button>
				</div>
			</Card>

			<Card class="p-0">
				<Tabs class="px-6 pt-6" activeClass="border-b-2 border-primary-500 text-primary-600">
					<TabItem label="Profile">
						<div class="space-y-6 px-1 pb-6 pt-4">
							<div class="grid gap-5 sm:grid-cols-2">
								{#each profileFields as field}
									<div>
										<p class="text-xs font-medium uppercase tracking-wide text-gray-500">
											{field.label}
										</p>
										<p class="mt-1 text-sm font-semibold text-gray-900">{field.value()}</p>
									</div>
								{/each}
							</div>
							<div>
								<p class="text-xs font-medium uppercase tracking-wide text-gray-500">Bio</p>
								<p class="mt-1 text-sm text-gray-600">
									{user.user_metadata?.bio ?? 'Tell the team a little about yourself.'}
								</p>
							</div>
						</div>
					</TabItem>
					<TabItem label="Account">
						<div class="space-y-6 px-1 pb-6 pt-4">
							<div class="grid gap-5 sm:grid-cols-2">
								{#each accountFields as field}
									<div>
										<p class="text-xs font-medium uppercase tracking-wide text-gray-500">
											{field.label}
										</p>
										<p class="mt-1 text-sm font-semibold text-gray-900">{field.value()}</p>
									</div>
								{/each}
							</div>
							<div>
								<p class="text-xs font-medium uppercase tracking-wide text-gray-500">
									Authentication
								</p>
								<ul class="mt-3 space-y-2 text-sm text-gray-600">
									<li>Provider: {user.app_metadata?.provider ?? 'Email'}</li>
									<li>Multi-factor auth: {user.factors?.length ? 'Enabled' : 'Not configured'}</li>
								</ul>
							</div>
						</div>
					</TabItem>
					<TabItem label="Sessions">
						<div class="space-y-5 px-1 pb-6 pt-4 text-sm text-gray-600">
							<p>
								Session management tools will appear here. You can list active devices, revoke
								sessions or review login attempts once the backend endpoints are wired up.
							</p>
							<Button color="light" onclick={handleManageSecurity}>Manage devices</Button>
						</div>
					</TabItem>
				</Tabs>
			</Card>
		</div>
	{:else}
		<Card class="p-10 text-center text-gray-500">
			<p class="text-sm">No profile found. Redirecting to the login page…</p>
		</Card>
	{/if}
</div>
