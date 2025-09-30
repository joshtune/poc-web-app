<script lang="ts">
	import { UserAvatar, SearchAndFilter } from '$lib';
	import type { UserStatus } from '$lib/types/admin';

	type UserRecord = {
		id: string;
		name: string;
		email: string;
		role: string;
		status: UserStatus;
		lastActive: string;
		initials: string;
	};

	let {
		users,
		roleOptions,
		onEditUser,
		searchPlaceholder = 'Search by name, email, or role'
	}: {
		users: readonly UserRecord[];
		roleOptions: readonly string[];
		onEditUser: (user: UserRecord) => void;
		searchPlaceholder?: string;
	} = $props();

	const statusStyles: Record<UserStatus, string> = {
		Active: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
		Invited: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
		Suspended: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
	};

	let searchQuery = $state('');
	let roleFilter = $state('All');
	const filteredUsers = $derived(filterUsers(users, searchQuery, roleFilter));

	function filterUsers(
		allUsers: readonly UserRecord[],
		queryRaw: string,
		role: string
	): UserRecord[] {
		const query = queryRaw.trim().toLowerCase();
		return allUsers.filter((user) => {
			const matchesSearch =
				query.length === 0 ||
				[user.name, user.email, user.role].some((field) => field.toLowerCase().includes(query));
			const matchesRole = role === 'All' || user.role === role;
			return matchesSearch && matchesRole;
		});
	}
</script>

<section class="space-y-4">
	<div
		class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<SearchAndFilter bind:searchQuery bind:roleFilter {roleOptions} {searchPlaceholder} />

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
								{users.length === 0
									? 'No users found. Add teammates to see them listed here.'
									: 'No teammates match your filters yet.'}
							</td>
						</tr>
					{:else}
						{#each filteredUsers as user (user.id)}
							<tr class="hover:bg-gray-50 dark:hover:bg-gray-900">
								<td class="px-4 py-4 text-sm">
									<div class="flex items-center gap-3">
										<UserAvatar initials={user.initials} name={user.name} />
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
								<td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{user.lastActive}</td
								>
								<td class="px-4 py-4 text-right text-sm">
									<div class="flex justify-end gap-3 text-sm">
										<button
											type="button"
											class="font-medium text-primary-600 transition hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
											onclick={() => onEditUser(user)}
										>
											Edit
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
