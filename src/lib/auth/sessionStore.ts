import { get, writable } from 'svelte/store';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase';

type AuthStatus = 'loading' | 'ready' | 'error';

export type AuthState = {
	status: AuthStatus;
	session: Session | null;
	user: User | null;
	accessToken: string | null;
	errorMessage: string | null;
};

const initialState: AuthState = {
	status: 'loading',
	session: null,
	user: null,
	accessToken: null,
	errorMessage: null
};

const authStore = writable<AuthState>(initialState);

let hasPrimedFromLoader = false;

function applySession(session: Session | null): void {
	authStore.set({
		status: 'ready',
		session,
		user: session?.user ?? null,
		accessToken: session?.access_token ?? null,
		errorMessage: null
	});
}

async function syncSession(options: { showLoading?: boolean } = {}): Promise<Session | null> {
	if (typeof window === 'undefined') {
		return null;
	}

	const showLoading = options.showLoading ?? true;

	if (showLoading) {
		authStore.update((state) => ({
			...state,
			status: 'loading',
			errorMessage: null
		}));
	}

	try {
		const { data, error } = await supabase.auth.getSession();
		if (error) {
			authStore.set({
				status: 'error',
				session: null,
				user: null,
				accessToken: null,
				errorMessage: error.message || 'Unable to load session.'
			});
			return null;
		}

		const session = data.session ?? null;
		applySession(session);
		return session;
	} catch (error) {
		authStore.set({
			status: 'error',
			session: null,
			user: null,
			accessToken: null,
			errorMessage:
				error instanceof Error ? error.message : 'Unexpected error while loading session.'
		});
		return null;
	}
}

if (typeof window !== 'undefined') {
	void syncSession({ showLoading: false });
	supabase.auth.onAuthStateChange((_event, session) => {
		applySession(session ?? null);
	});
}

export const authState = {
	subscribe: authStore.subscribe
};

export function primeAuthState(session: Session | null): void {
	if (typeof window === 'undefined') {
		return;
	}

	if (hasPrimedFromLoader) {
		return;
	}

	hasPrimedFromLoader = true;
	applySession(session ?? null);
}

export async function refreshSession(): Promise<Session | null> {
	return await syncSession();
}

export function getSessionSnapshot(): Session | null {
	return get(authStore).session;
}

export async function getAccessToken(): Promise<string | null> {
	const current = get(authStore);
	if (current.accessToken) {
		return current.accessToken;
	}

	const session = await syncSession();
	return session?.access_token ?? null;
}

export function getAuthStateSnapshot(): AuthState {
	return get(authStore);
}
