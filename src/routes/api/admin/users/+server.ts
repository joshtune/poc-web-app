import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listManageableUsers } from '$lib/server/adminUsers';

export const GET: RequestHandler = async () => {
	const payload = await listManageableUsers();
	return json(payload, {
		headers: {
			'Cache-Control': 'private, max-age=0, must-revalidate'
		}
	});
};
