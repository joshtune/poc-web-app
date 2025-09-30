import type { User } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from './supabaseAdmin';
import type { ManageableUser, ManageUsersPayload, UserStatus } from '$lib/types/admin';

const DEFAULT_ROLE = 'Member';

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

function deriveRole(user: User): string {
	const maybeRoleFields = [
		user.user_metadata?.role,
		user.user_metadata?.user_role,
		user.app_metadata?.role,
		user.app_metadata?.user_role
	];

	const resolved = maybeRoleFields.find(
		(value): value is string => typeof value === 'string' && value.trim().length > 0
	);

	return resolved?.trim() ?? DEFAULT_ROLE;
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
		role: deriveRole(user),
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
