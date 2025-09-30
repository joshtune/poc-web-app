<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
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
			await goto(resolve('/login'));
		}
	});
</script>

<div class="space-y-10 px-4 py-10 sm:px-8 xl:px-12">
	<section class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<p class="text-sm font-medium text-primary-600">Profile</p>
			<h1 class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">Account overview</h1>
			<p class="mt-2 max-w-xl text-sm text-gray-500">
				Manage how your information appears across the application and keep your account up to date.
			</p>
		</div>
	</section>
</div>
