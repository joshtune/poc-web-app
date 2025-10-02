<script lang="ts">
	import { Alert, Button, Drawer, Input, Label, Select } from 'flowbite-svelte';
	import { invalidate } from '$app/navigation';
	import { getAccessToken } from '$lib/auth/sessionStore';
	import type { ManageableUser, UserStatus } from '$lib/types/admin';

	type Props = {
		isOpen: boolean;
		selectedUser: ManageableUser | null;
		selectedDisplayUser: {
			id: string;
			name: string;
			email: string;
			role: string;
			status: UserStatus;
			lastActive: string;
			initials: string;
		} | null;
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

	$effect(() => {
		if (!isOpen) {
			resetForm();
			return;
		}

		if (selectedUser) {
			initializeForm();
			return;
		}

		resetForm();
	});

	function initializeForm() {
		if (!selectedUser) return;

		const fallbackName =
			selectedUser.fullName && selectedUser.fullName.trim().length > 0
				? selectedUser.fullName
				: selectedDisplayUser?.name || '';

		formFullName = fallbackName;
		formEmail = selectedUser.email;
		formRole = selectedUser.role;
		formStatus = selectedUser.status === 'Suspended' ? 'Suspended' : 'Active';
		formMessage = null;
		formMessageTone = null;
		isSaving = false;
	}

	function resetForm() {
		formFullName = '';
		formEmail = '';
		formRole = 'Member';
		formStatus = 'Active';
		formMessage = null;
		formMessageTone = null;
		isSaving = false;
	}

	function closeDrawer() {
		isOpen = false;
		onClose();
	}

	async function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!selectedUser) return;

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
			const accessToken = await getAccessToken();

			if (!accessToken) {
				formMessageTone = 'error';
				formMessage = 'Your session expired. Please sign in again.';
				return;
			}

			const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
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

			const responseData = (await response.json()) as { user?: ManageableUser };
			if (responseData.user) {
				formFullName = responseData.user.fullName ?? '';
				formEmail = responseData.user.email;
				formRole = responseData.user.role;
				formStatus = responseData.user.status === 'Suspended' ? 'Suspended' : 'Active';
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
