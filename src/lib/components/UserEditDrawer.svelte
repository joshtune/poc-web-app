<script lang="ts">
	import { Alert, Button, Drawer, Input, Label, Select, Modal } from 'flowbite-svelte';
	import { invalidate } from '$app/navigation';
	import { getAccessToken, authUser } from '$lib/auth/sessionStore';
	import { updateAdminUser } from '$lib/client/adminUsers';
	import { createManageUserForm, type DisplayUserSummary } from '$lib/components/useManageUserForm';
	import type { ManageableUser, UserStatus } from '$lib/types/admin';

	type Props = {
		isOpen: boolean;
		selectedUser: ManageableUser | null;
		selectedDisplayUser: DisplayUserSummary | null;
		formRoleOptions: readonly string[];
		onClose: () => void;
	};

	let {
		isOpen = $bindable(),
		selectedUser,
		selectedDisplayUser,
		formRoleOptions,
		onClose
	}: Props = $props();

	let formFullName = $state('');
	let formEmail = $state('');
	let formRole = $state('Member');
	let formStatus = $state<UserStatus>('Active');
	let isSaving = $state(false);
	let formMessage = $state<string | null>(null);
	let formMessageTone = $state<'success' | 'error' | 'info' | null>(null);
	let initialStatus = $state<UserStatus>('Active');
	let isSuspendConfirmOpen = $state(false);
	const currentUser = $derived($authUser);
	const isEditingSelf = $derived(
		selectedUser?.id && currentUser?.id ? selectedUser.id === currentUser.id : false
	);

	const formController = createManageUserForm(
		{
			getFullName: () => formFullName,
			setFullName: (value) => {
				formFullName = value;
			},
			setEmail: (value) => {
				formEmail = value;
			},
			getRole: () => formRole,
			setRole: (value) => {
				formRole = value;
			},
			getStatus: () => formStatus,
			setStatus: (value) => {
				formStatus = value;
			},
			setMessage: (tone, message) => {
				formMessageTone = tone;
				formMessage = message;
			},
			clearMessage: () => {
				formMessageTone = null;
				formMessage = null;
			},
			setSaving: (value) => {
				isSaving = value;
			}
		},
		{
			submit: async ({ userId, fullName, role, status }) => {
				const accessToken = await getAccessToken();

				if (!accessToken) {
					return {
						success: false,
						message: 'Your session expired. Please sign in again.'
					};
				}

				const payload = await updateAdminUser({
					fetchImpl: fetch,
					accessToken,
					userId,
					input: {
						fullName,
						role,
						status
					}
				});

				if (!payload.user) {
					return {
						success: false,
						message: payload.message ?? 'Unable to update user right now. Please try again later.'
					};
				}

				await invalidate('/api/admin/users');
				return {
					success: true,
					user: payload.user
				};
			}
		}
	);

	const { initialize, reset, submit } = formController;

	$effect(() => {
		if (!isOpen) {
			reset();
			initialStatus = 'Active';
			return;
		}

		if (selectedUser) {
			initialize(selectedUser, selectedDisplayUser);
			initialStatus = selectedUser.status === 'Suspended' ? 'Suspended' : selectedUser.status;
			return;
		}

		reset();
		initialStatus = 'Active';
	});

	function closeDrawer() {
		isOpen = false;
		onClose();
	}

	function shouldConfirmSuspension(): boolean {
		if (isEditingSelf && formStatus === 'Suspended') {
			formMessageTone = 'error';
			formMessage = 'You cannot suspend your own account.';
			formStatus = initialStatus;
			return false;
		}

		return initialStatus !== 'Suspended' && formStatus === 'Suspended';
	}

	async function runSubmit() {
		if (!selectedUser) {
			return;
		}

		if (isEditingSelf && formStatus === 'Suspended') {
			formMessageTone = 'error';
			formMessage = 'You cannot suspend your own account.';
			formStatus = initialStatus;
			return;
		}

		const result = await submit(selectedUser);
		if (result.success) {
			setTimeout(closeDrawer, 800);
		}
	}

	async function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!selectedUser) return;

		if (shouldConfirmSuspension()) {
			isSuspendConfirmOpen = true;
			return;
		}

		await runSubmit();
	}

	async function confirmSuspend() {
		isSuspendConfirmOpen = false;
		await runSubmit();
	}

	function cancelSuspend() {
		isSuspendConfirmOpen = false;
	}
</script>

<Drawer bind:open={isOpen} placement="right" outsideclose>
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
			<div
				class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
			>
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

		<form class="space-y-5" onsubmit={handleFormSubmit}>
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
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Label for="edit-email">Email</Label>
						<svg
							class="h-4 w-4 text-gray-400"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
					</div>
					<span class="text-xs text-gray-500 dark:text-gray-400">Contact support to change</span>
				</div>
				<Input
					id="edit-email"
					name="email"
					type="email"
					placeholder="Email address"
					autocomplete="email"
					bind:value={formEmail}
					readonly
					class="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
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
					<Select id="edit-status" disabled={isEditingSelf} bind:value={formStatus}>
						<option value="Active">Active</option>
						<option value="Suspended" disabled={isEditingSelf}>Suspended</option>
					</Select>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{#if isEditingSelf}
							<span class="block text-amber-600 dark:text-amber-400">
								You can’t suspend your own account.
							</span>
						{:else}
							Suspended users cannot sign in until you mark them Active again.
						{/if}
					</p>
				</div>
			</div>

			<div class="flex justify-end gap-2">
				<Button type="button" color="light" onclick={closeDrawer} disabled={isSaving}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSaving || !selectedUser}>
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

<Modal bind:open={isSuspendConfirmOpen} size="md" autoclose={false}>
	<div class="space-y-4 p-6">
		<div class="flex items-center gap-3">
			<svg
				class="h-6 w-6 text-amber-500"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01" />
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10.29 3.86 1.82 18A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L12.71 3.86a2 2 0 0 0-3.42 0Z"
				/>
			</svg>
			<div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Suspend this user?</h3>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Suspending {selectedDisplayUser?.name ?? selectedUser?.email ?? 'this user'} blocks their access
					until you reactivate them.
				</p>
			</div>
		</div>
		<div class="flex justify-end gap-3">
			<Button color="light" onclick={cancelSuspend}>Cancel</Button>
			<Button color="red" onclick={confirmSuspend}>Suspend user</Button>
		</div>
	</div>
</Modal>
