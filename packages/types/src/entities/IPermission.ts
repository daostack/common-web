export interface IPermissionPayload {
	/**
	 * The common that we grant permission to
	 */
	commonId: string;
	
	/**
   * The roles we want to grant the user with userId
   */
	role: Role;

	/**
	 * The ID of the user that needs to get permission
	 */
	userId: string;

	/**
	 * The ID of the user who wants to grant permission to userId
	 */
	requestByUserId?: string;
}

export type Role = 'founder'| 'moderator' | 'other';