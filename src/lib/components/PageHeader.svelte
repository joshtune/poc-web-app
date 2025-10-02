<script lang="ts">
	let {
		breadcrumb,
		title
	}: {
		breadcrumb?: string;
		title: string;
	} = $props();
</script>

<section class="flex flex-wrap items-start justify-between gap-4">
	<div class="space-y-2">
		{#if breadcrumb}
			<p class="text-sm font-medium text-primary-600">{breadcrumb}</p>
		{/if}
		<h1 class="text-3xl font-semibold text-gray-900 dark:text-white">{title}</h1>
		<p class="max-w-2xl text-sm text-gray-500 dark:text-gray-300">
			Keep your workspace organized by reviewing roles, invitations, and recent activity. Filter and
			find teammates quickly across every device size.
		</p>
	</div>
</section>
