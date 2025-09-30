<script lang="ts">
	let {
		searchQuery = $bindable(),
		roleFilter = $bindable(),
		roleOptions,
		searchPlaceholder = 'Search...'
	}: {
		searchQuery: string;
		roleFilter: string;
		roleOptions: readonly string[];
		searchPlaceholder?: string;
	} = $props();
</script>

<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
	<div class="relative w-full lg:max-w-md">
		<input
			type="search"
			bind:value={searchQuery}
			placeholder={searchPlaceholder}
			class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
		/>
		<span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m21 21-4.35-4.35M11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7Z"
				/>
			</svg>
		</span>
	</div>
	<div
		class="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:items-center sm:gap-3"
	>
		<label class="font-medium" for="role-filter">Role</label>
		<select
			id="role-filter"
			bind:value={roleFilter}
			class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
		>
			{#each roleOptions as option (option)}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>
</div>
