<script lang="ts" generics="T extends Record<string, unknown>">
	type Column<T> = {
		key: keyof T;
		label: string;
		align?: 'left' | 'center' | 'right';
		render?: (item: T) => unknown;
		class?: string;
	};

	type Action<T> = {
		label: string;
		onClick: (item: T) => void;
		class?: string;
	};

	let {
		data,
		columns,
		actions,
		emptyMessage = 'No data available',
		keyField = 'id' as keyof T
	}: {
		data: readonly T[];
		columns: Column<T>[];
		actions?: Action<T>[];
		emptyMessage?: string;
		keyField?: keyof T;
	} = $props();

	function getAlignClass(align?: string): string {
		switch (align) {
			case 'center':
				return 'text-center';
			case 'right':
				return 'text-right';
			default:
				return 'text-left';
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
		<thead class="bg-gray-50 dark:bg-gray-900">
			<tr>
				{#each columns as column (column.key)}
					<th
						scope="col"
						class="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 {getAlignClass(
							column.align
						)} {column.class || ''}"
					>
						{column.label}
					</th>
				{/each}
				{#if actions && actions.length > 0}
					<th
						scope="col"
						class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
					>
						Actions
					</th>
				{/if}
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
			{#if data.length === 0}
				<tr>
					<td
						colspan={columns.length + (actions?.length ? 1 : 0)}
						class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
					>
						{emptyMessage}
					</td>
				</tr>
			{:else}
				{#each data as item (item[keyField])}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-900">
						{#each columns as column (column.key)}
							<td class="px-4 py-4 text-sm {getAlignClass(column.align)} {column.class || ''}">
								{#if column.render}
									{column.render(item)}
								{:else}
									{item[column.key]}
								{/if}
							</td>
						{/each}
						{#if actions && actions.length > 0}
							<td class="px-4 py-4 text-right text-sm">
								<div class="flex justify-end gap-3 text-sm">
									{#each actions as action (action.label)}
										<button
											type="button"
											class={action.class ||
												'font-medium text-primary-600 transition hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'}
											onclick={() => action.onClick(item)}
										>
											{action.label}
										</button>
									{/each}
								</div>
							</td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
