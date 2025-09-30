import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '$lib/config';
import { env } from '$env/dynamic/private';

let cachedClient: SupabaseClient | null = null;
let cachedKey: string | null = null;
let loggedMissingKey = false;

export function getSupabaseAdminClient(): SupabaseClient | null {
	const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

	if (!serviceRoleKey) {
		if (!loggedMissingKey) {
			console.warn(
				'SUPABASE_SERVICE_ROLE_KEY is not set. Admin features that require elevated privileges will be disabled.'
			);
			loggedMissingKey = true;
		}
		return null;
	}

	if (!cachedClient || cachedKey !== serviceRoleKey) {
		cachedClient = createClient(SUPABASE_CONFIG.url, serviceRoleKey, {
			auth: {
				persistSession: false,
				autoRefreshToken: false
			}
		});
		cachedKey = serviceRoleKey;
	}

	return cachedClient;
}
