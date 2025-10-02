import { redirect } from '@sveltejs/kit';
import { deriveUserRole, isPrivilegedRole } from '$lib/auth/roles';
import type { PageLoad } from './$types';
import type { ManageUsersPayload } from '$lib/types/admin';

const MANAGE_USERS_PATH = '/admin/manage-users';
const GENERIC_ERROR_MESSAGE =
	'Unable to load users from Supabase right now. Please try again later.';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { session } = await parent();
	const user = session?.user ?? null;
	const role = deriveUserRole(user);

	if (!isPrivilegedRole(role)) {
		throw redirect(303, '/');
	}

	const accessToken = session?.access_token ?? null;

	if (!accessToken) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(MANAGE_USERS_PATH)}`);
	}

	try {
		const response = await fetch('/api/admin/users', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		if (!response.ok) {
			return {
				users: [],
				error: GENERIC_ERROR_MESSAGE
			} satisfies ManageUsersPayload;
		}

		const payload = (await response.json()) as ManageUsersPayload;
		return payload;
	} catch (err) {
		console.error('Failed to fetch admin users', err);
		return {
			users: [],
			error: GENERIC_ERROR_MESSAGE
		} satisfies ManageUsersPayload;
	}
};
