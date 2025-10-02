import { redirect } from '@sveltejs/kit';
import { deriveUserRole, isPrivilegedRole } from '$lib/auth/roles';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { session } = await parent();
	const role = deriveUserRole(session?.user ?? null);

	if (!isPrivilegedRole(role)) {
		throw redirect(303, '/');
	}

	return { role };
};
