<script lang="ts">
	import { Button } from 'flowbite-svelte';

	let {
		breadcrumb,
		title,
		description,
		actionText,
		onAction
	}: {
		breadcrumb?: string;
		title: string;
		description?: string;
		actionText?: string;
		onAction?: () => void;
	} = $props();
</script>

<section class="flex flex-wrap items-start justify-between gap-4">
	<div class="space-y-2">
		{#if breadcrumb}
			<p class="text-sm font-medium text-primary-600">{breadcrumb}</p>
		{/if}
		<h1 class="text-3xl font-semibold text-gray-900 dark:text-white">{title}</h1>
		{#if description}
			<p class="max-w-2xl text-sm text-gray-500 dark:text-gray-300">{description}</p>
		{/if}
	</div>
	{#if actionText && onAction}
		<Button color="primary" class="h-10 whitespace-nowrap" onclick={onAction}>
			{actionText}
		</Button>
	{/if}
</section>
