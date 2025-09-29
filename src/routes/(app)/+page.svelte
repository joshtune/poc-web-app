<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';

	const metrics = [
		{ title: 'Active Users', value: '1,245', change: '+12.4%', positive: true },
		{ title: 'New Signups', value: '320', change: '+5.1%', positive: true },
		{ title: 'Churn Rate', value: '2.1%', change: '-0.6%', positive: false },
		{ title: 'Avg. Session', value: '6m 42s', change: '+8.2%', positive: true }
	];

	const activity = [
		{
			team: 'Product',
			update: 'Refined onboarding milestones',
			status: 'In Review',
			time: '2h ago'
		},
		{
			team: 'Growth',
			update: 'Activated invite referral experiment',
			status: 'Live',
			time: '4h ago'
		},
		{
			team: 'Support',
			update: 'Resolved high-priority tickets',
			status: 'Completed',
			time: 'Today'
		},
		{
			team: 'Engineering',
			update: 'Deployed auth service patch',
			status: 'Completed',
			time: 'Yesterday'
		}
	];

	const tasks = [
		{ title: 'Finalize Q2 roadmap', owner: 'Product', due: 'Tomorrow', completed: false },
		{ title: 'Schedule customer advisory board', owner: 'Success', due: 'Friday', completed: true },
		{
			title: 'Draft billing migration guide',
			owner: 'Engineering',
			due: 'Next week',
			completed: false
		},
		{ title: 'Plan growth retrospective', owner: 'Growth', due: 'April 12', completed: false }
	];

	const performance = [
		{ label: 'User retention', value: '86%', progress: 86, color: 'bg-emerald-500' },
		{ label: 'NPS', value: '42', progress: 70, color: 'bg-blue-500' },
		{ label: 'Support SLA', value: '95%', progress: 95, color: 'bg-purple-500' }
	];

	const announcements = [
		{
			title: 'Quarterly planning offsite',
			body: 'Save the date for an in-person session focused on roadmap alignment.',
			time: '3 days ago'
		},
		{
			title: 'New dashboard filters',
			body: 'Drill into cohorts with the brand-new filtering experience.',
			time: '1 week ago'
		}
	];
</script>

<div class="space-y-10 px-4 py-10 sm:px-8 xl:px-12">
	<section class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<p class="text-sm font-medium text-primary-600">Welcome back</p>
			<h1 class="mt-1 text-3xl font-semibold text-gray-900">Dashboard overview</h1>
			<p class="mt-2 max-w-2xl text-sm text-gray-500">
				Monitor key product and growth signals across teams in real time.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<Button color="light">Generate report</Button>
			<Button color="primary">New project</Button>
		</div>
	</section>

	<section class="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
		{#each metrics as metric}
			<Card class="p-6">
				<div class="flex items-start justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500">{metric.title}</p>
						<p class="mt-2 text-3xl font-semibold text-gray-900">{metric.value}</p>
					</div>
					<span
						class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M5 12h14M5 12l6-6m-6 6l6 6"
							/>
						</svg>
					</span>
				</div>
				<p
					class={`mt-4 flex items-center text-sm font-medium ${metric.positive ? 'text-emerald-600' : 'text-rose-600'}`}
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if metric.positive}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M5 10l7-7 7 7"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M19 14l-7 7-7-7"
							/>
						{/if}
					</svg>
					{metric.change} vs last period
				</p>
			</Card>
		{/each}
	</section>

	<section class="grid gap-6 xl:grid-cols-3">
		<Card class="p-0 xl:col-span-2">
			<div class="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
				<div>
					<h2 class="text-lg font-semibold text-gray-900">Team activity</h2>
					<p class="mt-1 text-sm text-gray-500">
						Keep track of the latest updates across product areas.
					</p>
				</div>
				<Button color="light" size="sm">View all</Button>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr class="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
							<th class="px-6 py-3">Team</th>
							<th class="px-6 py-3">Update</th>
							<th class="px-6 py-3">Status</th>
							<th class="px-6 py-3 text-right">Updated</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100 bg-white text-sm text-gray-700">
						{#each activity as item}
							<tr>
								<td class="px-6 py-4 font-medium text-gray-900">{item.team}</td>
								<td class="px-6 py-4">{item.update}</td>
								<td class="px-6 py-4">
									<span
										class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Live' ? 'bg-emerald-50 text-emerald-600' : item.status === 'Completed' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}
									>
										{item.status}
									</span>
								</td>
								<td class="px-6 py-4 text-right text-gray-500">{item.time}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card>

		<Card class="p-0">
			<div class="border-b border-gray-100 px-6 py-5">
				<h2 class="text-lg font-semibold text-gray-900">Priority tasks</h2>
				<p class="mt-1 text-sm text-gray-500">Focus on the items that unblock the most users.</p>
			</div>
			<div class="px-6 py-5">
				<ul class="space-y-5">
					{#each tasks as task}
						<li class="flex items-start justify-between gap-4">
							<div class="flex flex-1 items-start gap-3">
								<input
									type="checkbox"
									class="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
									checked={task.completed}
									disabled
								/>
								<div>
									<p class="text-sm font-semibold text-gray-900">{task.title}</p>
									<p class="mt-1 text-xs text-gray-500">
										<span class="font-medium text-gray-700">{task.owner}</span> • {task.due}
									</p>
								</div>
							</div>
							<Button size="xs" color="light">Details</Button>
						</li>
					{/each}
				</ul>
			</div>
		</Card>
	</section>

	<section class="grid gap-6 lg:grid-cols-2">
		<Card class="p-6">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h2 class="text-lg font-semibold text-gray-900">Performance trends</h2>
					<p class="mt-1 text-sm text-gray-500">
						Week-over-week movement across core product metrics.
					</p>
				</div>
				<Button size="sm" color="light">Export data</Button>
			</div>
			<div class="mt-6 space-y-6">
				{#each performance as item}
					<div>
						<div class="flex items-center justify-between text-sm font-medium text-gray-700">
							<span>{item.label}</span>
							<span class="text-gray-900">{item.value}</span>
						</div>
						<div class="mt-2 h-2 rounded-full bg-gray-200">
							<div
								class={`h-2 rounded-full ${item.color}`}
								style={`width: ${item.progress}%`}
							></div>
						</div>
					</div>
				{/each}
			</div>
		</Card>

		<Card class="p-6">
			<h2 class="text-lg font-semibold text-gray-900">Announcements</h2>
			<ul class="mt-6 space-y-5">
				{#each announcements as note}
					<li class="rounded-lg border border-gray-100 p-4">
						<p class="text-sm font-semibold text-gray-900">{note.title}</p>
						<p class="mt-2 text-sm text-gray-500">{note.body}</p>
						<p class="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">
							{note.time}
						</p>
					</li>
				{/each}
			</ul>
		</Card>
	</section>
</div>
