<script lang="ts">
	import { Input, Select, Label } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';

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
		<SearchOutline
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
			aria-hidden="true"
		/>
		<Input type="search" bind:value={searchQuery} placeholder={searchPlaceholder} class="pl-10" />
	</div>
	<div class="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
		<Label for="role-filter" class="font-medium text-gray-600 dark:text-gray-300">Role</Label>
		<Select id="role-filter" bind:value={roleFilter} class="min-w-[120px]">
			{#each roleOptions as option (option)}
				<option value={option}>{option}</option>
			{/each}
		</Select>
	</div>
</div>
