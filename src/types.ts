export interface POSTSetSleepNumberJSONBody {
	bed_id: string;
	side: 'R' | 'L';
	sleep_number: number;
}

export interface LoginResponse {
	cognitoUser: true;
	userId: string;
	key: string;
	registrationState: number;
	edpLoginStatus: number;
	edpLoginMessage: 'not used';
}