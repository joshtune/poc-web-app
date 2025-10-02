import { redirect } from '@sveltejs/kit';
import { deriveUserRole, isPrivilegedRole } from '$lib/auth/roles';
import type { PageLoad } from './$types';
import { fetchAdminUsers } from '$lib/client/adminUsers';
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

	const payload = await fetchAdminUsers({ fetchImpl: fetch, accessToken });

	if (payload.error) {
		return {
			users: payload.users,
			error: payload.error ?? GENERIC_ERROR_MESSAGE
		} satisfies ManageUsersPayload;
	}

	return payload;
};
