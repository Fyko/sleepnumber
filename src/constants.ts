export const API_BASE = 'https://prod-api.sleepiq.sleepnumber.com/rest';

export const Routes = {
	bed: `${API_BASE}/bed`,
	login: `${API_BASE}/login`,
	sleepNumber: (bed: string) => `${API_BASE}/bed/${bed}/sleepNumber`,
} as const;