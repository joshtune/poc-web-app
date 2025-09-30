import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateManageableUser } from '$lib/server/adminUsers';
import type { UpdateUserInput } from '$lib/types/admin';

export const PUT: RequestHandler = async ({ params, request }) => {
	const id = params.id;

	if (!id) {
		return json({ error: 'User id is required.' }, { status: 400 });
	}

	let payload: Partial<UpdateUserInput>;

	try {
		payload = (await request.json()) as Partial<UpdateUserInput>;
	} catch {
		return json({ error: 'Invalid JSON payload.' }, { status: 400 });
	}

	if (!payload) {
		return json({ error: 'Missing request payload.' }, { status: 400 });
	}

	const updateInput: UpdateUserInput = {
		fullName: typeof payload.fullName === 'string' ? payload.fullName : '',
		email: typeof payload.email === 'string' ? payload.email : '',
		role: typeof payload.role === 'string' ? payload.role : 'Member',
		status:
			payload.status === 'Active' || payload.status === 'Invited' || payload.status === 'Suspended'
				? payload.status
				: 'Active'
	};

	const result = await updateManageableUser(id, updateInput);

	if (!result.user || result.message) {
		return json({ error: result.message ?? 'Unable to update user.' }, { status: result.status });
	}

	return json({ user: result.user }, { status: result.status });
};
