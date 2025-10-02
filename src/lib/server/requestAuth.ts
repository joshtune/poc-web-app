import type { RequestEvent } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from './supabaseAdmin';
import { deriveUserRole, isPrivilegedRole } from '$lib/auth/roles';

type SuccessResult = {
	ok: true;
	user: User;
	role: string;
};

type FailureResult = {
	ok: false;
	status: number;
	message: string;
};

export type AdminRequestCheckResult = SuccessResult | FailureResult;

const AUTH_HEADER_PREFIX = 'bearer ';

export async function checkAdminRequest(event: RequestEvent): Promise<AdminRequestCheckResult> {
	const authHeader = event.request.headers.get('authorization');

	if (!authHeader) {
		return {
			ok: false,
			status: 401,
			message: 'Missing Authorization header.'
		};
	}

	const normalized = authHeader.trim();
	if (!normalized.toLowerCase().startsWith(AUTH_HEADER_PREFIX)) {
		return {
			ok: false,
			status: 401,
			message: 'Invalid Authorization header format.'
		};
	}

	const token = normalized.slice(AUTH_HEADER_PREFIX.length).trim();

	if (!token) {
		return {
			ok: false,
			status: 401,
			message: 'Access token is required.'
		};
	}

	const supabaseAdmin = getSupabaseAdminClient();

	if (!supabaseAdmin) {
		return {
			ok: false,
			status: 500,
			message: 'Supabase service role client is not configured.'
		};
	}

	try {
		const { data, error } = await supabaseAdmin.auth.getUser(token);
		if (error) {
			console.warn('Failed to resolve Supabase user for admin request', error);
			return {
				ok: false,
				status: 401,
				message: 'Invalid access token.'
			};
		}

		const user = data.user;

		if (!user) {
			return {
				ok: false,
				status: 401,
				message: 'Supabase did not return a user for the provided token.'
			};
		}

		const role = deriveUserRole(user);

		if (!isPrivilegedRole(role)) {
			return {
				ok: false,
				status: 403,
				message: 'You do not have permission to perform this action.'
			};
		}

		return { ok: true, user, role };
	} catch (err) {
		console.error('Unexpected error while validating admin request', err);
		return {
			ok: false,
			status: 500,
			message: 'Unexpected error while validating request.'
		};
	}
}
