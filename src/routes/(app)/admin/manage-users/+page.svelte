<script lang="ts">
	import { Alert } from 'flowbite-svelte';
	import { UserEditDrawer, UsersUsersStatsGrid, PageHeader, UsersTable } from '$lib';
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

	const defaultRoleOptions = ['Owner', 'Admin', 'Member'];

	export let data: PageData;

	let serverUsers: readonly ManageableUser[] = [];
	let serverError: string | null = null;
	let roleOptions: readonly string[] = ['All'];
	let formRoleOptions: readonly string[] = [];
	let users: UserRecord[] = [];
	let stats: readonly StatCard[] = [];
	let isDrawerOpen = false;
	let selectedUserId: string | null = null;
	let selectedUser: ManageableUser | null = null;
	let selectedDisplayUser: UserRecord | null = null;

	$: serverUsers = (data.users ?? []) as readonly ManageableUser[];
	$: serverError = data.error ?? null;
	$: roleOptions = computeRoleOptions(serverUsers);
	$: formRoleOptions = computeFormRoleOptions(roleOptions);
	$: users = serverUsers.map(toDisplayUser);
	$: stats = computeStats(serverUsers);
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

	function handleEditClick(user: UserRecord) {
		const baseUser = serverUsers.find((candidate) => candidate.id === user.id);
		if (!baseUser) {
			console.warn('Unable to locate user in admin list for editing', user.id);
			return;
		}

		selectedUserId = baseUser.id;
		isDrawerOpen = true;
	}

	function handleDrawerClose() {
		selectedUserId = null;
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
				label: 'Admins & Owners',
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
	<PageHeader breadcrumb="Admin · Manage users" title="User directory" />

	{#if serverError}
		<Alert
			color="amber"
			class="border border-amber-200 bg-amber-50/60 text-amber-800 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200"
		>
			{serverError}
		</Alert>
	{/if}

	<UsersUsersStatsGrid {stats} />

	<UsersTable {users} {roleOptions} onEditUser={handleEditClick} />
</div>

<UserEditDrawer
	bind:isOpen={isDrawerOpen}
	{selectedUser}
	{selectedDisplayUser}
	{formRoleOptions}
	onClose={handleDrawerClose}
/>
