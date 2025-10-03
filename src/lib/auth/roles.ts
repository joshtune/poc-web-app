import type { User } from '@supabase/supabase-js';

export const DEFAULT_ROLE = 'Basic';

const ROLE_FIELD_CANDIDATES = ['role', 'user_role'] as const;
type RoleField = (typeof ROLE_FIELD_CANDIDATES)[number];

export function deriveUserRole(user: User | null | undefined): string {
	if (!user) {
		return DEFAULT_ROLE;
	}

	const sources = [user.app_metadata, user.user_metadata] as const;

	for (const source of sources) {
		if (!source) {
			continue;
		}

		for (const key of ROLE_FIELD_CANDIDATES) {
			const value = source[key as RoleField];
			if (typeof value === 'string' && value.trim().length > 0) {
				return value.trim();
			}
		}
	}

	return DEFAULT_ROLE;
}

export function isPrivilegedRole(role: string | null | undefined): boolean {
	if (typeof role !== 'string') {
		return false;
	}

	switch (role.trim().toLowerCase()) {
		case 'owner':
		case 'admin':
			return true;
		default:
			return false;
	}
}
