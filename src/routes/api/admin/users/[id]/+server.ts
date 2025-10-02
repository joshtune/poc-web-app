import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateManageableUser } from '$lib/server/adminUsers';
import type { UpdateUserInput } from '$lib/types/admin';
import { DEFAULT_ROLE } from '$lib/auth/roles';
import { checkAdminRequest } from '$lib/server/requestAuth';

export const PUT: RequestHandler = async (event) => {
	const authResult = await checkAdminRequest(event);
	if (!authResult.ok) {
		return json({ error: authResult.message }, { status: authResult.status });
	}

	const id = event.params.id;

	if (!id) {
		return json({ error: 'User id is required.' }, { status: 400 });
	}

	let payload: Record<string, unknown>;

	try {
		payload = (await event.request.json()) as Partial<UpdateUserInput>;
	} catch {
		return json({ error: 'Invalid JSON payload.' }, { status: 400 });
	}

	if (!payload) {
		return json({ error: 'Missing request payload.' }, { status: 400 });
	}

	const emailCandidate = typeof payload.email === 'string' ? payload.email : '';
	if (emailCandidate.trim().length > 0) {
		return json({ error: 'Email address cannot be modified.' }, { status: 400 });
	}

	const updateInput: UpdateUserInput = {
		fullName: typeof payload.fullName === 'string' ? payload.fullName : '',
		role: typeof payload.role === 'string' ? payload.role : DEFAULT_ROLE,
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
