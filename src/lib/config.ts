// Supabase Configuration
// For local development: Run `pnpm supabase:start` and copy the values from terminal output
// For production: Set these environment variables in your deployment platform

export const SUPABASE_CONFIG = {
	url: import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
	anonKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || ''
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
