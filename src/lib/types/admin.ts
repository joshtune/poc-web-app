export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export type ManageableUser = {
	id: string;
	email: string;
	fullName: string | null;
	role: string;
	status: UserStatus;
	lastSignInAt: string | null;
	createdAt: string | null;
	deactivatedUntil: string | null;
};

export type ManageUsersPayload = {
	users: ManageableUser[];
	error: string | null;
};
