// Supabase Configuration
// Create a .env file in your project root with the following variables:
// PUBLIC_SUPABASE_URL=your_supabase_project_url
// PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

export const SUPABASE_CONFIG = {
	url: import.meta.env.VITE_PUBLIC_SUPABASE_URL || '',
	anonKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || ''
};

// Validate configuration
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
	console.warn('Supabase configuration is missing. Please set VITE_PUBLIC_SUPABASE_URL and VITE_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}
