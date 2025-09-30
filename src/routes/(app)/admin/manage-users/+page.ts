import type { PageLoad } from './$types';
import type { ManageUsersPayload } from '$lib/types/admin';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/admin/users');
		if (!response.ok) {
			return {
				users: [],
				error: 'Unable to load users from Supabase right now. Please try again later.'
			} satisfies ManageUsersPayload;
		}

		const payload = (await response.json()) as ManageUsersPayload;
		return payload;
	} catch (err) {
		console.error('Failed to fetch admin users', err);
		return {
			users: [],
			error: 'Unable to load users from Supabase right now. Please try again later.'
		} satisfies ManageUsersPayload;
	}
};
