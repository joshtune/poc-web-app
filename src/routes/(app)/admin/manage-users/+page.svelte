<script lang="ts">
	import { Alert, Button, Drawer, Input, Label, Select } from 'flowbite-svelte';
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';
	import type { ManageableUser, UserStatus } from '$lib/types/admin';

	type StatCard = {
		label: string;
		value: number;
		helper: string;
	};

	type UserRecord = {
		id: string;
		name: string;
		email: string;
		role: string;
		status: UserStatus;
		lastActive: string;
		initials: string;
	};

	type RoleFilter = 'All' | string;

	const defaultRoleOptions = ['Owner', 'Admin', 'Member'];

	export let data: PageData;

	const statusStyles: Record<UserStatus, string> = {
		Active: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
		Invited: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
		Suspended: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
	};

	let searchQuery = '';
	let roleFilter: RoleFilter = 'All';
	let serverUsers: readonly ManageableUser[] = [];
	let serverError: string | null = null;
	let roleOptions: readonly string[] = ['All'];
	let formRoleOptions: readonly string[] = [];
	let users: UserRecord[] = [];
	let filteredUsers: UserRecord[] = [];
	let stats: readonly StatCard[] = [];
	let isDrawerOpen = false;
	let selectedUserId: string | null = null;
	let selectedUser: ManageableUser | null = null;
	let selectedDisplayUser: UserRecord | null = null;
	let formFullName = '';
	let formEmail = '';
	let formRole = 'Member';
	let formStatus: UserStatus = 'Active';
	let isSaving = false;
	let formMessage: string | null = null;
	let formMessageTone: 'success' | 'error' | 'info' | null = null;
	let drawerWasOpen = false;

	$: serverUsers = (data.users ?? []) as readonly ManageableUser[];
	$: serverError = data.error ?? null;
	$: roleOptions = computeRoleOptions(serverUsers);
	$: formRoleOptions = computeFormRoleOptions(roleOptions);
	$: users = serverUsers.map(toDisplayUser);
	$: filteredUsers = filterUsers(users, searchQuery, roleFilter);
	$: stats = computeStats(serverUsers);
	$: roleFilter = normalizeRoleFilter(roleFilter, roleOptions);
	$: selectedUser = selectedUserId
		? (serverUsers.find((candidate) => candidate.id === selectedUserId) ?? null)
		: null;
	$: selectedDisplayUser = selectedUserId
		? (users.find((user) => user.id === selectedUserId) ?? null)
		: null;
	$: if (isDrawerOpen && selectedUserId && !selectedUser) {
		console.warn('Selected user is no longer available. Closing editor.');
		isDrawerOpen = false;
	}
	$: if (!isDrawerOpen && drawerWasOpen) {
		resetDrawerState();
	}
	$: drawerWasOpen = isDrawerOpen;

	function resetDrawerState() {
		if (selectedUserId !== null) {
			selectedUserId = null;
		}
		if (isSaving) {
			isSaving = false;
		}
		if (formMessage !== null) {
			formMessage = null;
		}
		if (formMessageTone !== null) {
			formMessageTone = null;
		}
		formFullName = '';
		formEmail = '';
		formRole = 'Member';
		formStatus = 'Active';
	}

	function closeDrawer() {
		isDrawerOpen = false;
	}

	function handleEditClick(user: UserRecord) {
		const baseUser = serverUsers.find((candidate) => candidate.id === user.id);
		if (!baseUser) {
			console.warn('Unable to locate user in admin list for editing', user.id);
			return;
		}

		const fallbackName =
			baseUser.fullName && baseUser.fullName.trim().length > 0
				? baseUser.fullName
				: deriveDisplayName(baseUser);

		selectedUserId = baseUser.id;
		formFullName = fallbackName;
		formEmail = baseUser.email;
		formRole = baseUser.role;
		formStatus = baseUser.status === 'Suspended' ? 'Suspended' : 'Active';
		formMessage = null;
		formMessageTone = null;
		isSaving = false;
		isDrawerOpen = true;
	}

	async function handleFormSubmit() {
		if (!selectedUserId) {
			return;
		}

		const trimmedEmail = formEmail.trim();
		const trimmedFullName = formFullName.trim();
		const trimmedRole = formRole.trim() || 'Member';
		const nextStatus: UserStatus = formStatus === 'Suspended' ? 'Suspended' : 'Active';

		if (!trimmedEmail) {
			formMessageTone = 'error';
			formMessage = 'Email cannot be empty.';
			return;
		}

		isSaving = true;
		formMessage = null;
		formMessageTone = null;

		try {
			const response = await fetch(`/api/admin/users/${selectedUserId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fullName: trimmedFullName,
					email: trimmedEmail,
					role: trimmedRole,
					status: nextStatus
				})
			});

			if (!response.ok) {
				let message = 'Unable to update user right now. Please try again later.';
				try {
					const errorBody = (await response.json()) as { error?: string };
					if (errorBody?.error) {
						message = errorBody.error;
					}
				} catch (parseError) {
					console.warn('Failed to parse error payload while updating user', parseError);
				}
				formMessageTone = 'error';
				formMessage = message;
				return;
			}

			const data = (await response.json()) as { user?: ManageableUser };
			if (data.user) {
				formFullName = data.user.fullName ?? '';
				formEmail = data.user.email;
				formRole = data.user.role;
				formStatus = data.user.status === 'Suspended' ? 'Suspended' : 'Active';
			}

			await invalidate('/api/admin/users');
			formMessageTone = 'success';
			formMessage = 'User updated successfully.';
            setTimeout(closeDrawer, 800);
		} catch (error) {
			console.error('Failed to update user', error);
			formMessageTone = 'error';
			formMessage = 'Unable to update user right now. Please try again later.';
		} finally {
			isSaving = false;
		}
	}

	function computeRoleOptions(users: readonly ManageableUser[]): readonly string[] {
		const uniqueRoles = new Set(
			users.map((user) => user.role.trim()).filter((role) => role.length > 0)
		);
		const sortedRoles = Array.from(uniqueRoles).sort((a, b) => a.localeCompare(b));
		return ['All', ...sortedRoles];
	}

	function computeFormRoleOptions(navRoleOptions: readonly string[]): readonly string[] {
		const combinedRoles = [
			...defaultRoleOptions,
			...navRoleOptions.filter((role) => role !== 'All')
		]
			.map((role) => role.trim())
			.filter((role) => role.length > 0);

		const uniqueRoles: string[] = [];
		for (const role of combinedRoles) {
			if (!uniqueRoles.includes(role)) {
				uniqueRoles.push(role);
			}
		}

		return uniqueRoles.sort((a, b) => a.localeCompare(b));
	}

	function filterUsers(
		allUsers: readonly UserRecord[],
		queryRaw: string,
		role: RoleFilter
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

	function computeStats(users: readonly ManageableUser[]): readonly StatCard[] {
		const totalMembers = users.length;
		const activeMembers = users.filter((user) => user.status === 'Active').length;
		const adminSeats = users.filter((user) => {
			const role = user.role.toLowerCase();
			return role === 'owner' || role === 'admin';
		}).length;
		const pendingInvites = users.filter((user) => user.status === 'Invited').length;

		return [
			{
				label: 'Total members',
				value: totalMembers,
				helper: 'Including pending invites'
			},
			{
				label: 'Active members',
				value: activeMembers,
				helper: 'Currently able to sign in'
			},
			{
				label: 'Admins & owners',
				value: adminSeats,
				helper: 'Have elevated permissions'
			},
			{
				label: 'Pending invites',
				value: pendingInvites,
				helper: 'Waiting to join your team'
			}
		];
	}

	function normalizeRoleFilter(current: RoleFilter, options: readonly string[]): RoleFilter {
		if (current !== 'All' && !options.includes(current)) {
			return 'All';
		}
		return current;
	}

	function toDisplayUser(user: ManageableUser): UserRecord {
		const name = deriveDisplayName(user);
		return {
			id: user.id,
			name,
			email: user.email,
			role: user.role,
			status: user.status,
			lastActive: formatLastActive(user),
			initials: deriveInitials(name, user.email)
		};
	}

	function deriveDisplayName(user: ManageableUser): string {
		if (user.fullName && user.fullName.trim().length > 0) {
			return user.fullName.trim();
		}

		const email = user.email ?? '';
		const localPart = email.split('@')[0] ?? '';
		if (localPart.length === 0) {
			return 'Unnamed user';
		}

		return localPart
			.split(/[._-]+/)
			.filter(Boolean)
			.map((part) => part[0]?.toUpperCase() + part.slice(1))
			.join(' ');
	}

	function deriveInitials(name: string, email: string): string {
		const initialsFromName = name
			.split(/\s+/)
			.filter(Boolean)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
			.slice(0, 2);

		if (initialsFromName.length === 2) {
			return initialsFromName;
		}

		const emailInitials = email
			.split('@')[0]
			?.split(/[._-]+/)
			.filter(Boolean)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
			.slice(0, 2);

		return (initialsFromName + emailInitials).slice(0, 2) || 'NA';
	}

	function formatLastActive(user: ManageableUser): string {
		const sourceTimestamp = user.lastSignInAt ?? user.createdAt;
		if (!sourceTimestamp) {
			return 'Never signed in';
		}

		const activityDate = new Date(sourceTimestamp);
		if (Number.isNaN(activityDate.getTime())) {
			return 'Last activity unknown';
		}

		const now = Date.now();
		const diffMs = now - activityDate.getTime();

		if (diffMs < 0) {
			return 'Scheduled in future';
		}

		const minute = 60_000;
		const hour = 60 * minute;
		const day = 24 * hour;
		const week = 7 * day;

		if (diffMs < minute) {
			return 'Just now';
		}
		if (diffMs < hour) {
			const minutes = Math.round(diffMs / minute);
			return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
		}
		if (diffMs < day) {
			const hours = Math.round(diffMs / hour);
			return `${hours} hour${hours === 1 ? '' : 's'} ago`;
		}
		if (diffMs < week) {
			const days = Math.round(diffMs / day);
			return `${days} day${days === 1 ? '' : 's'} ago`;
		}
		if (diffMs < 5 * week) {
			const weeks = Math.round(diffMs / week);
			return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
		}

		return activityDate.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
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

	{#if serverError}
		<Alert
			color="amber"
			class="border border-amber-200 bg-amber-50/60 text-amber-800 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200"
		>
			{serverError}
		</Alert>
	{/if}

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
									{serverUsers.length === 0
										? 'No users found. Add teammates to see them listed here.'
										: 'No teammates match your filters yet.'}
								</td>
							</tr>
						{:else}
							{#each filteredUsers as user (user.id)}
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
												on:click={() => handleEditClick(user)}
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

</div>

<Drawer bind:open={isDrawerOpen} placement="right" width="half" outsideclose>
    <div class="flex items-center border-b border-gray-200 pb-6 dark:border-gray-700">
        <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Edit user
            </p>
            <h2 class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {formFullName || selectedDisplayUser?.name || 'User details'}
            </h2>
        </div>
    </div>

    <div class="flex flex-col gap-6 py-6">
        {#if selectedDisplayUser}
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p class="font-medium text-gray-900 dark:text-white">{selectedDisplayUser.name}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{selectedDisplayUser.email}</p>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Last active: {selectedDisplayUser.lastActive}
                </p>
                {#if selectedUser}
                    <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-500">
                        User ID: {selectedUser.id}
                    </p>
                {/if}
            </div>
        {/if}

        {#if formMessage}
            <Alert
                    color={formMessageTone === 'error'
						? 'red'
						: formMessageTone === 'success'
							? 'green'
							: 'cyan'}
                    class="text-sm"
            >
                {formMessage}
            </Alert>
        {/if}

        <form class="space-y-5" on:submit|preventDefault={handleFormSubmit}>
            <div class="space-y-2">
                <Label for="edit-full-name">Full name</Label>
                <Input
                        id="edit-full-name"
                        name="fullName"
                        placeholder="Full name"
                        autocomplete="name"
                        bind:value={formFullName}
                />
            </div>

            <div class="space-y-2">
                <Label for="edit-email">Email</Label>
                <Input
                        id="edit-email"
                        name="email"
                        type="email"
                        placeholder="Email address"
                        autocomplete="email"
                        bind:value={formEmail}
                />
            </div>

            <div class="space-y-2">
                <Label for="edit-role">Role</Label>
                <Select id="edit-role" bind:value={formRole}>
                    {#if formRoleOptions.length === 0}
                        <option value={formRole}>{formRole || 'Member'}</option>
                    {:else}
                        {#each formRoleOptions as option (option)}
                            <option value={option}>{option}</option>
                        {/each}
                    {/if}
                </Select>
            </div>

            <div class="flex flex-col gap-3 pt-2">
                <div class="space-y-2">
                    <Label for="edit-status">Status</Label>
                    <Select id="edit-status" bind:value={formStatus}>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </Select>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        Suspended users cannot sign in until you mark them Active again.
                    </p>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <Button
                    type="button"
                    color="light"
                    onclick={closeDrawer}
                    disabled={isSaving}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSaving || !selectedUser}
                >
                    {#if isSaving}
                        Saving…
                    {:else}
                        Save changes
                    {/if}
                </Button>
            </div>
        </form>
    </div>
</Drawer>
