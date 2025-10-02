<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authStatus, authUser } from '$lib/auth/sessionStore';
	const status = $derived($authStatus);
	const user = $derived($authUser);

	$effect(() => {
		if (status === 'ready' && !user) {
			void goto(resolve('/login'));
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
