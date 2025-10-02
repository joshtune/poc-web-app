import type { User } from '@supabase/supabase-js';
import { deriveUserRole, DEFAULT_ROLE } from '$lib/auth/roles';
import { getSupabaseAdminClient } from './supabaseAdmin';
import type {
	ManageableUser,
	ManageUsersPayload,
	UpdateUserInput,
	UpdateUserResult,
	UserStatus
} from '$lib/types/admin';

function toUserStatus(user: User): UserStatus {
	const bannedUntil = getBannedUntil(user);
	if (bannedUntil) {
		const bannedDate = new Date(bannedUntil);
		if (!Number.isNaN(bannedDate.getTime()) && bannedDate.getTime() > Date.now()) {
			return 'Suspended';
		}
	}

	return user.email_confirmed_at ? 'Active' : 'Invited';
}

function deriveFullName(user: User): string | null {
	const names = [
		typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null,
		typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : null,
		user.user_metadata?.first_name && user.user_metadata?.last_name
			? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
			: null
	].filter(Boolean) as string[];

	return names[0] ?? null;
}

function getBannedUntil(user: User): string | null {
	const value = (user as { banned_until?: string | null }).banned_until;
	return value ?? null;
}

function transformUser(user: User): ManageableUser {
	return {
		id: user.id,
		email: user.email ?? 'unknown@example.com',
		fullName: deriveFullName(user),
		role: deriveUserRole(user),
		status: toUserStatus(user),
		lastSignInAt: user.last_sign_in_at ?? null,
		createdAt: user.created_at ?? null,
		deactivatedUntil: getBannedUntil(user)
	};
}

export async function listManageableUsers(): Promise<ManageUsersPayload> {
	const supabaseAdmin = getSupabaseAdminClient();

	if (!supabaseAdmin) {
		return {
			users: [],
			error:
				'Supabase service key missing. Set SUPABASE_SERVICE_ROLE_KEY to enable user management.'
		};
	}

	const { data, error } = await supabaseAdmin.auth.admin.listUsers({
		page: 1,
		perPage: 200
	});

	if (error) {
		console.error('Failed to list Supabase users', error);
		return {
			users: [],
			error: 'Unable to load users from Supabase right now. Please try again later.'
		};
	}

	return {
		users: (data?.users ?? []).map(transformUser),
		error: null
	};
}

export async function updateManageableUser(
	id: string,
	input: UpdateUserInput
): Promise<UpdateUserResult> {
	const supabaseAdmin = getSupabaseAdminClient();

	if (!supabaseAdmin) {
		return {
			user: null,
			message:
				'Supabase service key missing. Set SUPABASE_SERVICE_ROLE_KEY to enable user management.',
			status: 500
		};
	}

	const fullName = input.fullName.trim();
	const role = input.role.trim() || DEFAULT_ROLE;
	const status = input.status;

	const attributes: {
		user_metadata?: Record<string, unknown>;
		app_metadata?: Record<string, unknown>;
		ban_duration?: string;
	} = {
		user_metadata: {
			full_name: fullName,
			name: fullName
		},
		app_metadata: {
			role
		}
	};

	if (status === 'Suspended') {
		attributes.ban_duration = '87600h';
	} else if (status === 'Active') {
		attributes.ban_duration = 'none';
	}

	try {
		const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, attributes);
		if (error) {
			console.error('Failed to update Supabase user', error);
			return {
				user: null,
				message: error.message ?? 'Unable to update user right now.',
				status: 400
			};
		}

		const updatedUser = data?.user ?? null;
		if (!updatedUser) {
			return {
				user: null,
				message: 'Supabase did not return the updated user.',
				status: 500
			};
		}

		return {
			user: transformUser(updatedUser),
			message: null,
			status: 200
		};
	} catch (error) {
		console.error('Unexpected error updating Supabase user', error);
		return {
			user: null,
			message: 'Unexpected error updating user.',
			status: 500
		};
	}
}
