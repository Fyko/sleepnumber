export interface POSTSetSleepNumberJSONBody {
	bed_id: string;
	side: 'R' | 'L';
	sleep_number: number;
}
