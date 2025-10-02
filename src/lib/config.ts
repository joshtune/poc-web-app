// Supabase Configuration
// For local development: Run `pnpm supabase:start` and copy the values from terminal output
// For production: Set these environment variables in your deployment platform

export const SUPABASE_CONFIG = {
	url: import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
	anonKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || ''
};

const truthyEnvValues = new Set(['1', 'true', 'yes', 'y', 'on']);
const falsyEnvValues = new Set(['0', 'false', 'no', 'n', 'off']);

function parseBooleanEnv(rawValue: string | undefined, fallback: boolean, flagName: string) {
	if (rawValue === undefined) {
		return fallback;
	}

	const normalized = rawValue.trim().toLowerCase();

	if (truthyEnvValues.has(normalized)) {
		return true;
	}

	if (falsyEnvValues.has(normalized)) {
		return false;
	}

	console.warn(
		`Invalid boolean value "${rawValue}" supplied for ${flagName}; falling back to ${fallback}.`
	);
	return fallback;
}

export const AUTH_PROVIDER_CONFIG = {
	google: parseBooleanEnv(
		import.meta.env.VITE_PUBLIC_AUTH_GOOGLE_ENABLED,
		true,
		'VITE_PUBLIC_AUTH_GOOGLE_ENABLED'
	),
	facebook: parseBooleanEnv(
		import.meta.env.VITE_PUBLIC_AUTH_FACEBOOK_ENABLED,
		true,
		'VITE_PUBLIC_AUTH_FACEBOOK_ENABLED'
	)
};

// Validate configuration
if (!SUPABASE_CONFIG.anonKey) {
	console.warn(
		'Supabase anon key is missing. Please set VITE_PUBLIC_SUPABASE_ANON_KEY environment variable.'
	);
	console.log(
		'For local development: Run `pnpm supabase:start` and copy the anon key from the output.'
	);
}
