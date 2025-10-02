import type {
	ManageUsersPayload,
	ManageableUser,
	UpdateUserInput,
	UpdateUserResult
} from '$lib/types/admin';

const GENERIC_FETCH_ERROR = 'Unable to load users from Supabase right now. Please try again later.';
const GENERIC_UPDATE_ERROR = 'Unable to update user right now. Please try again later.';

type FetchUsersOptions = {
	fetchImpl?: typeof fetch;
	accessToken: string;
};

type UpdateUserOptions = {
	fetchImpl?: typeof fetch;
	accessToken: string;
	userId: string;
	input: UpdateUserInput;
};

function getFetcher(fetchImpl?: typeof fetch): typeof fetch {
	if (fetchImpl) {
		return fetchImpl;
	}

	if (typeof fetch !== 'undefined') {
		return fetch;
	}

	throw new Error('Fetch implementation is required in this environment.');
}

export async function fetchAdminUsers({
	fetchImpl,
	accessToken
}: FetchUsersOptions): Promise<ManageUsersPayload> {
	const runFetch = getFetcher(fetchImpl);

	try {
		const response = await runFetch('/api/admin/users', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
			return { users: [], error: GENERIC_FETCH_ERROR } satisfies ManageUsersPayload;
		}

		const payload = (await response.json()) as ManageUsersPayload;
		return payload;
	} catch (error) {
		console.error('Failed to fetch admin users', error);
		return { users: [], error: GENERIC_FETCH_ERROR } satisfies ManageUsersPayload;
	}
}

export async function updateAdminUser({
	fetchImpl,
	accessToken,
	userId,
	input
}: UpdateUserOptions): Promise<UpdateUserResult> {
	const runFetch = getFetcher(fetchImpl);

	try {
		const response = await runFetch(`/api/admin/users/${userId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify(input)
		});

		if (!response.ok) {
			let message = GENERIC_UPDATE_ERROR;
			try {
				const errorBody = (await response.json()) as { error?: string };
				if (errorBody?.error) {
					message = errorBody.error;
				}
			} catch (parseError) {
				console.warn('Failed to parse error payload while updating user', parseError);
			}
			return { user: null, message, status: response.status } satisfies UpdateUserResult;
		}

		const responseData = (await response.json()) as { user?: ManageableUser };
		return {
			user: responseData.user ?? null,
			message: null,
			status: 200
		};
	} catch (error) {
		console.error('Failed to update admin user', error);
		return {
			user: null,
			message: GENERIC_UPDATE_ERROR,
			status: 500
		} satisfies UpdateUserResult;
	}
}
