export const Routes = {
	setSleepNumber: (bed: string) => `https://prod-api.sleepiq.sleepnumber.com/rest/bed/${bed}/sleepNumber`,
};

export const headers = {
	'Accept-Encoding': 'gzip, deflate, br',
	'User-Agent': 'SleepIQ/1631791936 CFNetwork/1312 Darwin/21.0.0',
	'X-App-Platform': 'ios',
	Accept: '/',
	'Accept-Version': '4.6.10',
	'X-App-Version': '4.6.10',
	'Accept-Language': 'en-us',
	'X-App-Platform-Version': '15.0',
};
