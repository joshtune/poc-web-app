// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		readonly VITE_PUBLIC_SUPABASE_URL?: string;
		readonly VITE_PUBLIC_SUPABASE_ANON_KEY?: string;
		readonly VITE_PUBLIC_AUTH_GOOGLE_ENABLED?: string;
		readonly VITE_PUBLIC_AUTH_FACEBOOK_ENABLED?: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};
