<script lang="ts">
	let {
		initials,
		name,
		size = 'md'
	}: {
		initials: string;
		name: string;
		size?: 'sm' | 'md' | 'lg';
	} = $props();

	const sizeClasses = {
		sm: 'h-6 w-6 text-xs',
		md: 'h-9 w-9 text-sm',
		lg: 'h-12 w-12 text-base'
	};
</script>

<span
	class="flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-200 {sizeClasses[
		size
	]}"
	title={name}
>
	{initials}
</span>
