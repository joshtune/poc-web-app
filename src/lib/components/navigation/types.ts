export type RoutePath = '/' | '/admin' | '/admin/manage-users';

export type NavChild = {
	label: string;
	path: RoutePath;
};

export type NavLink = {
	label: string;
	path: RoutePath;
	children?: readonly NavChild[];
};

export const navItems = [
	{ label: 'Dashboard', path: '/' },
	{
		label: 'Admin',
		path: '/admin',
		children: [{ label: 'Manage Users', path: '/admin/manage-users' }]
	}
] satisfies readonly NavLink[];
