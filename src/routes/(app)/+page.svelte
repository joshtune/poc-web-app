<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
</script>

<div class="space-y-10 px-4 py-10 sm:px-8 xl:px-12">
	<section class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<p class="text-sm font-medium text-primary-600">Welcome back</p>
			<h1 class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">Dashboard overview</h1>
			<p class="mt-2 max-w-2xl text-sm text-gray-500">
				Monitor key product and growth signals across teams in real time.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<Button color="light">Generate report</Button>
			<Button color="primary">New project</Button>
		</div>
	</section>
</div>
