import { supabase } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load = (async ({ url }) => {
	const { data } = await supabase.auth.getSession();
	const session = data.session ?? null;

	if (!session) {
		const destination = `${url.pathname}${url.search}` || '/';
		const redirectTarget =
			destination === '/' ? '/login' : `/login?redirectTo=${encodeURIComponent(destination)}`;
		throw redirect(303, redirectTarget);
	}

	return { session };
}) satisfies LayoutLoad;
