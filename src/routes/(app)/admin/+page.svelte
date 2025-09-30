<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { resolve } from '$app/paths';
</script>

<div class="space-y-10 px-4 py-10 sm:px-8 xl:px-12">
	<section class="flex flex-wrap items-start justify-between gap-6">
		<div class="space-y-3">
			<p class="text-sm font-medium text-primary-600">Administration</p>
			<h1 class="text-4xl font-semibold text-gray-900 dark:text-white">Admin overview</h1>
			<p class="max-w-2xl text-sm text-gray-500 dark:text-gray-300">
				Monitor platform health, keep access secure, and guide teammates through onboarding.
				Everything you need to run operations stays easy to reach on any screen size.
			</p>
		</div>
		<div class="flex flex-col gap-3 sm:flex-row">
			<Button color="primary" href={resolve('/admin/manage-users')} class="whitespace-nowrap">
				Manage users
			</Button>
		</div>
	</section>
</div>
