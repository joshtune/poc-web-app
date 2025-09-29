<script lang="ts">
	import { Button, Card, Badge } from 'flowbite-svelte';
	import { resolve } from '$app/paths';

	type Insight = {
		title: string;
		description: string;
		updatedAt: string;
	};

	const insights: readonly Insight[] = [
		{
			title: 'Security review due',
			description: 'Review 2 flagged login attempts from unfamiliar devices this week.',
			updatedAt: 'Updated 3 hours ago'
		},
		{
			title: 'Access policy refresh',
			description:
				'Roles and permission templates were edited yesterday. Confirm team access levels.',
			updatedAt: 'Updated 14 hours ago'
		},
		{
			title: 'Team onboarding',
			description: '4 pending invites are still waiting on acceptance. Send a reminder?',
			updatedAt: 'Updated 1 day ago'
		}
	];

	const kpis = [
		{ label: 'Active members', value: 42, delta: '+6.1% vs last month' },
		{ label: 'Admin seats', value: 5, delta: 'Stable past 30 days' },
		{ label: 'Pending invites', value: 4, delta: '2 expiring this week' },
		{ label: 'MFA adoption', value: '86%', delta: '+9% vs last month' }
	] as const;

	const recentActivity = [
		{
			actor: 'Priya Patel',
			action: 'granted owner access to "Payments" workspace',
			time: '5 minutes ago'
		},
		{
			actor: 'System',
			action: 'rotated Supabase service key automatically',
			time: '22 minutes ago'
		},
		{
			actor: 'Alex Johnson',
			action: 'invited 3 teammates to Analytics project',
			time: '1 hour ago'
		},
		{
			actor: 'Automations',
			action: 'paused 1 failing nightly sync job',
			time: 'Yesterday'
		}
	] as const;
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
			<Button color="light" class="whitespace-nowrap">Run access audit</Button>
		</div>
	</section>

	<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each kpis as stat (stat.label)}
			<Card
				class="h-full rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<p class="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
				<p class="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
				<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.delta}</p>
			</Card>
		{/each}
	</section>

	<section class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
		<Card
			class="space-y-6 rounded-xl border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<header class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Key insights</h2>
					<p class="text-sm text-gray-500 dark:text-gray-300">
						Stay ahead of tasks that keep your workspace secure.
					</p>
				</div>
				<Button color="light" size="sm" class="whitespace-nowrap">Export summary</Button>
			</header>

			<div class="space-y-4">
				{#each insights as insight (insight.title)}
					<div
						class="rounded-lg border border-gray-200 p-4 transition hover:border-primary-200 hover:bg-primary-50/40 dark:border-gray-700 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
					>
						<div class="flex items-center justify-between gap-3">
							<h3 class="text-sm font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
							<Badge
								color="cyan"
								class="bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-200"
							>
								Follow up
							</Badge>
						</div>
						<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{insight.description}</p>
						<p class="mt-3 text-xs text-gray-500 dark:text-gray-400">{insight.updatedAt}</p>
					</div>
				{/each}
			</div>
		</Card>

		<Card
			class="space-y-5 rounded-xl border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<header>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent activity</h2>
				<p class="text-sm text-gray-500 dark:text-gray-300">
					Latest admin events across your workspace.
				</p>
			</header>
			<ul class="space-y-4">
				{#each recentActivity as item (`${item.actor}-${item.time}`)}
					<li
						class="rounded-lg border border-transparent p-3 transition hover:border-primary-200 hover:bg-primary-50/40 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
					>
						<p class="text-sm text-gray-900 dark:text-white">
							<span class="font-semibold">{item.actor}</span>
							{item.action}
						</p>
						<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
					</li>
				{/each}
			</ul>
			<Button color="light" size="sm" class="w-full">View audit log</Button>
		</Card>
	</section>

	<section class="grid gap-6 lg:grid-cols-2">
		<Card
			class="space-y-4 rounded-xl border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<header class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Quick actions</h2>
				<Button color="light" size="xs">View all</Button>
			</header>
			<ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
				<li
					class="flex items-start justify-between gap-3 rounded-lg border border-transparent p-3 hover:border-primary-200 hover:bg-primary-50/40 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
				>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">Review access roles</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							Check who can deploy to production environments.
						</p>
					</div>
					<Button color="light" size="xs">Open</Button>
				</li>
				<li
					class="flex items-start justify-between gap-3 rounded-lg border border-transparent p-3 hover:border-primary-200 hover:bg-primary-50/40 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
				>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">Schedule maintenance</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							Notify teams about upcoming downtime windows.
						</p>
					</div>
					<Button color="light" size="xs">Plan</Button>
				</li>
				<li
					class="flex items-start justify-between gap-3 rounded-lg border border-transparent p-3 hover:border-primary-200 hover:bg-primary-50/40 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
				>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">Update billing contacts</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							Ensure invoices reach the right inbox.
						</p>
					</div>
					<Button color="light" size="xs">Edit</Button>
				</li>
			</ul>
		</Card>

		<Card
			class="space-y-4 rounded-xl border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<header class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Upcoming reviews</h2>
				<Button color="light" size="xs">Reschedule</Button>
			</header>
			<ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
				<li
					class="flex items-center justify-between gap-3 rounded-lg border border-transparent p-3 hover:border-primary-200 hover:bg-primary-50/40 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
				>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">Quarterly compliance audit</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							In 6 days · Assigned to Security team
						</p>
					</div>
					<Badge color="orange">High</Badge>
				</li>
				<li
					class="flex items-center justify-between gap-3 rounded-lg border border-transparent p-3 hover:border-primary-200 hover:bg-primary-50/40 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
				>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">Data retention policy review</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">In 14 days · Legal & Security</p>
					</div>
					<Badge color="cyan">Medium</Badge>
				</li>
				<li
					class="flex items-center justify-between gap-3 rounded-lg border border-transparent p-3 hover:border-primary-200 hover:bg-primary-50/40 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
				>
					<div>
						<p class="font-medium text-gray-900 dark:text-white">Billing plan check-in</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Next month · Finance</p>
					</div>
					<Badge color="gray">Low</Badge>
				</li>
			</ul>
		</Card>
	</section>
</div>
