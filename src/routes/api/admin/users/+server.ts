import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listManageableUsers } from '$lib/server/adminUsers';
import { checkAdminRequest } from '$lib/server/requestAuth';

export const GET: RequestHandler = async (event) => {
	const authResult = await checkAdminRequest(event);
	if (!authResult.ok) {
		return json({ error: authResult.message }, { status: authResult.status });
	}

	const payload = await listManageableUsers();
	return json(payload, {
		headers: {
			'Cache-Control': 'private, max-age=0, must-revalidate'
		}
	});
};
