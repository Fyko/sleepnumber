export const API_BASE = 'https://prod-api.sleepiq.sleepnumber.com/rest';

export const Routes = {
	login: `${API_BASE}/login`,
	sleepNumber: (bed: string) => `${API_BASE}/bed/${bed}/sleepNumber`,

};