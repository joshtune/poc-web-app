import { isPrivilegedRole } from '$lib/auth/roles';

export type RoutePath = '/' | '/admin' | '/admin/manage-users';

export type NavChild = {
	label: string;
	path: RoutePath;
};

export type NavLink = {
	label: string;
	path: RoutePath;
	children?: readonly NavChild[];
	requiresPrivilege?: boolean;
};

export const navItems = [
	{ label: 'Dashboard', path: '/' },
	{
		label: 'Admin',
		path: '/admin',
		requiresPrivilege: true,
		children: [{ label: 'Manage Users', path: '/admin/manage-users' }]
	}
] satisfies readonly NavLink[];

export function filterNavItemsByRole(role: string): readonly NavLink[] {
	const allowPrivilegedLinks = isPrivilegedRole(role);
	return navItems.filter((item) => {
		if (!item.requiresPrivilege) {
			return true;
		}
		return allowPrivilegedLinks;
	}) as readonly NavLink[];
}
