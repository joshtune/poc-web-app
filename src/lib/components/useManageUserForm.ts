import type { ManageableUser, UserStatus } from '$lib/types/admin';

type MessageTone = 'success' | 'error' | 'info' | null;

export type ManageUserFormSubmitPayload = {
	userId: string;
	fullName: string;
	email: string;
	role: string;
	status: UserStatus;
};

export type ManageUserFormSubmitResult = {
	success: boolean;
	user?: ManageableUser | null;
	message?: string | null;
};

export type DisplayUserSummary = {
	id: string;
	name: string;
	email: string;
	role: string;
	status: UserStatus;
	lastActive: string;
	initials: string;
};

type FormBindings = {
	getFullName(): string;
	setFullName(value: string): void;
	getEmail(): string;
	setEmail(value: string): void;
	getRole(): string;
	setRole(value: string): void;
	getStatus(): UserStatus;
	setStatus(value: UserStatus): void;
	setMessage(tone: MessageTone, message: string | null): void;
	clearMessage(): void;
	setSaving(value: boolean): void;
};

type FormOptions = {
	submit: (payload: ManageUserFormSubmitPayload) => Promise<ManageUserFormSubmitResult>;
};

export function createManageUserForm(bindings: FormBindings, options: FormOptions) {
	function initialize(selectedUser: ManageableUser | null, displayUser: DisplayUserSummary | null) {
		if (!selectedUser) {
			reset();
			return;
		}

		const fallbackName =
			selectedUser.fullName && selectedUser.fullName.trim().length > 0
				? selectedUser.fullName
				: displayUser?.name || '';

		bindings.setFullName(fallbackName);
		bindings.setEmail(selectedUser.email);
		bindings.setRole(selectedUser.role);
		bindings.setStatus(selectedUser.status === 'Suspended' ? 'Suspended' : 'Active');
		bindings.clearMessage();
		bindings.setSaving(false);
	}

	function reset() {
		bindings.setFullName('');
		bindings.setEmail('');
		bindings.setRole('Member');
		bindings.setStatus('Active');
		bindings.clearMessage();
		bindings.setSaving(false);
	}

	async function submit(selectedUser: ManageableUser | null): Promise<ManageUserFormSubmitResult> {
		if (!selectedUser) {
			return { success: false, message: 'No user selected.' };
		}

		const trimmedEmail = bindings.getEmail().trim();
		const trimmedFullName = bindings.getFullName().trim();
		const trimmedRole = bindings.getRole().trim() || 'Member';
		const nextStatus: UserStatus = bindings.getStatus() === 'Suspended' ? 'Suspended' : 'Active';

		if (!trimmedEmail) {
			bindings.setMessage('error', 'Email cannot be empty.');
			return { success: false, message: 'Email cannot be empty.' };
		}

		bindings.setSaving(true);
		bindings.clearMessage();

		try {
			const result = await options.submit({
				userId: selectedUser.id,
				fullName: trimmedFullName,
				email: trimmedEmail,
				role: trimmedRole,
				status: nextStatus
			});

			if (!result.success) {
				bindings.setMessage(
					'error',
					result.message ?? 'Unable to update user right now. Please try again later.'
				);
				return {
					success: false,
					user: result.user ?? null,
					message: result.message
				};
			}

			const updatedUser = result.user ?? null;
			if (updatedUser) {
				bindings.setFullName(updatedUser.fullName ?? '');
				bindings.setEmail(updatedUser.email);
				bindings.setRole(updatedUser.role);
				bindings.setStatus(updatedUser.status === 'Suspended' ? 'Suspended' : 'Active');
			}

			bindings.setMessage('success', result.message ?? 'User updated successfully.');

			return {
				success: true,
				user: updatedUser,
				message: result.message ?? 'User updated successfully.'
			};
		} catch (error) {
			console.error('Failed to submit manage user form', error);
			const fallback: ManageUserFormSubmitResult = {
				success: false,
				message: 'Unable to update user right now. Please try again later.'
			};
			bindings.setMessage('error', fallback.message ?? null);
			return fallback;
		} finally {
			bindings.setSaving(false);
		}
	}

	return {
		initialize,
		reset,
		submit
	};
}
