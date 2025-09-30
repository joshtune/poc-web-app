<script lang="ts">
	type StatCard = {
		label: string;
		value: number;
		helper: string;
	};

	let { stats }: { stats: readonly StatCard[] } = $props();
</script>

<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	{#each stats as stat (stat.label)}
		<div
			class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
			<p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
			<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.helper}</p>
		</div>
	{/each}
</section>
