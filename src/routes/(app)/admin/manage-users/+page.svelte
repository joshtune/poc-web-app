<script lang="ts">
	import { Button } from 'flowbite-svelte';

	type Role = 'Owner' | 'Admin' | 'Member';
	type Status = 'Active' | 'Invited' | 'Suspended';

	type UserRecord = {
		name: string;
		email: string;
		role: Role;
		status: Status;
		lastActive: string;
		initials: string;
	};

	const users: readonly UserRecord[] = [
		{
			name: 'Alex Johnson',
			email: 'alex.johnson@example.com',
			role: 'Owner',
			status: 'Active',
			lastActive: '2 minutes ago',
			initials: 'AJ'
		},
		{
			name: 'Priya Patel',
			email: 'priya.patel@example.com',
			role: 'Admin',
			status: 'Active',
			lastActive: '12 minutes ago',
			initials: 'PP'
		},
		{
			name: 'Morgan Lee',
			email: 'morgan.lee@example.com',
			role: 'Admin',
			status: 'Invited',
			lastActive: 'Awaiting acceptance',
			initials: 'ML'
		},
		{
			name: 'Diego Alvarez',
			email: 'diego.alvarez@example.com',
			role: 'Member',
			status: 'Active',
			lastActive: '1 hour ago',
			initials: 'DA'
		},
		{
			name: 'Sofia Martins',
			email: 'sofia.martins@example.com',
			role: 'Member',
			status: 'Active',
			lastActive: 'Yesterday',
			initials: 'SM'
		},
		{
			name: 'Evan Brooks',
			email: 'evan.brooks@example.com',
			role: 'Member',
			status: 'Invited',
			lastActive: 'Awaiting acceptance',
			initials: 'EB'
		}
	];

	type RoleFilter = 'All' | Role;

	const roleOptions: readonly RoleFilter[] = ['All', 'Owner', 'Admin', 'Member'];
	const statusStyles: Record<Status, string> = {
		Active: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
		Invited: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
		Suspended: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
	};

	const stats = [
		{
			label: 'Total members',
			value: users.length,
			helper: 'Including pending invites'
		},
		{
			label: 'Active members',
			value: users.filter((user) => user.status === 'Active').length,
			helper: 'Currently able to sign in'
		},
		{
			label: 'Admins & owners',
			value: users.filter((user) => user.role === 'Owner' || user.role === 'Admin').length,
			helper: 'Have elevated permissions'
		},
		{
			label: 'Pending invites',
			value: users.filter((user) => user.status === 'Invited').length,
			helper: 'Waiting to join your team'
		}
	] as const;

	let searchQuery = $state('');
	let roleFilter = $state<RoleFilter>('All');
	let filteredUsers = $state<UserRecord[]>(users.slice());

	$effect(() => {
		const query = searchQuery.trim().toLowerCase();
		filteredUsers = users.filter((user) => {
			const matchesSearch =
				!query ||
				[user.name, user.email, user.role].some((field) => field.toLowerCase().includes(query));
			const matchesRole = roleFilter === 'All' || user.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	});
</script>

<div class="space-y-10 px-4 py-10 sm:px-8 xl:px-12">
	<section class="flex flex-wrap items-start justify-between gap-4">
		<div class="space-y-2">
			<p class="text-sm font-medium text-primary-600">Admin · Manage users</p>
			<h1 class="text-3xl font-semibold text-gray-900 dark:text-white">User directory</h1>
			<p class="max-w-2xl text-sm text-gray-500 dark:text-gray-300">
				Keep your workspace organized by reviewing roles, invitations, and recent activity. Filter
				and find teammates quickly across every device size.
			</p>
		</div>
		<Button color="primary" class="h-10 whitespace-nowrap">Invite member</Button>
	</section>

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

	<section class="space-y-4">
		<div
			class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div class="relative w-full lg:max-w-md">
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search by name, email, or role"
						class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
					/>
					<span
						class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
					>
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

			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-900">
						<tr>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
							>
								Member
							</th>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
							>
								Role
							</th>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
							>
								Status
							</th>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
							>
								Last active
							</th>
							<th
								scope="col"
								class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
						{#if filteredUsers.length === 0}
							<tr>
								<td
									colspan="5"
									class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
								>
									No teammates match your filters yet.
								</td>
							</tr>
						{:else}
							{#each filteredUsers as user (user.email)}
								<tr class="hover:bg-gray-50 dark:hover:bg-gray-900">
									<td class="px-4 py-4 text-sm">
										<div class="flex items-center gap-3">
											<span
												class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-200"
											>
												{user.initials}
											</span>
											<div>
												<p class="font-medium text-gray-900 dark:text-white">{user.name}</p>
												<p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
											</div>
										</div>
									</td>
									<td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{user.role}</td>
									<td class="px-4 py-4 text-sm">
										<span
											class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[user.status]}`}
										>
											{user.status}
										</span>
									</td>
									<td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400"
										>{user.lastActive}</td
									>
									<td class="px-4 py-4 text-right text-sm">
										<div class="flex justify-end gap-3 text-sm">
											<button
												type="button"
												class="font-medium text-primary-600 transition hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
											>
												Edit
											</button>
											<button
												type="button"
												class="text-gray-500 transition hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-200"
											>
												More
											</button>
										</div>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</section>
</div>
