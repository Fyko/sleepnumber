import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import { headers, Routes } from './constants';
import type { POSTSetSleepNumberJSONBody } from './types';
const { API_KEY } = process.env;

const isAuthorized = (event: APIGatewayProxyEvent) => {
	console.dir(event.queryStringParameters);
	const key = Reflect.get(event.queryStringParameters ?? { api_key: '' }, 'api_key');
	if (key === API_KEY) return true;
	return false;
};

const login = async () => {
	const res = await fetch('https://prod-api.sleepiq.sleepnumber.com/rest/login', {
		method: 'PUT',
		headers,
		body: JSON.stringify({ login: 'me@fyko.net', password: 'YX9GJrJL9mel%^Ln' }),
	});

	const body = (await res.json()) as {
		cognitoUser: true;
		userId: string;
		key: string;
		registrationState: number;
		edpLoginStatus: number;
		edpLoginMessage: 'not used';
	};

	return body;
};

export const setSleepNumber: APIGatewayProxyHandler = async (event) => {
	const authorized = isAuthorized(event);
	if (!authorized) return { statusCode: 401, body: '' };

	const body: POSTSetSleepNumberJSONBody = JSON.parse(event.body!);
	const loginRes = await login();
	console.dir(loginRes);
	const key = Reflect.get(loginRes, 'key');
	if (!key)
		return {
			statusCode: 500,
			body: 'Malformed login object.',
			headers: {
				'Content-Type': 'text/html',
			},
		};

	const url = `${Routes.setSleepNumber(body.bed_id)}?_k=${key}&side=${body.side}`;
	console.log(`Fetching ${url}`);
	const res = await fetch(url, {
		method: 'PUT',
		headers,
		body: JSON.stringify({
			side: body.side,
			sleepNumber: body.sleep_number,
		}),
	});

	try {
		const body = await res.json();
		console.log(`response status and body: ${res.statusText}`);
		console.dir(body);
	} catch {}

	if (res.ok)
		return {
			statusCode: 200,
			body: `Adjusting the ${body.side === 'L' ? 'left' : 'right'} side to ${body.sleep_number}.`,
			headers: {
				'Content-Type': 'text/html',
			},
		};

	return {
		statusCode: 500,
		body: `Failed to adjust the ${body.side === 'L' ? 'left' : 'right'} side to ${body.sleep_number}.`,
		headers: {
			'Content-Type': 'text/html',
		},
	};
};
