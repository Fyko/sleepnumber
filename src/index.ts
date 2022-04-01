import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { logger } from 'hono/logger';
import { Cookie, parse, splitCookiesString } from 'set-cookie-parser';
import { Routes } from './constants';
import type { LoginResponse, POSTSetSleepNumberJSONBody } from './types';

declare const API_USERNAME: string;
declare const API_PASSWORD: string;
declare const SLEEPNUMBER_EMAIL: string;
declare const SLEEPNUMBER_PASSWORD: string;

export const app = new Hono();

app.use(
	'*',
	basicAuth({
		username: API_USERNAME,
		password: API_PASSWORD,
	}),
);
app.use('*', logger());

const login = async (): Promise<[LoginResponse, Cookie[]]> => {
	const body = JSON.stringify({ login: SLEEPNUMBER_EMAIL, password: SLEEPNUMBER_PASSWORD });
	const res = await fetch('https://prod-api.sleepiq.sleepnumber.com/rest/login', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	});

	const header = res.headers.get('Set-Cookie') ?? '';
	// we have to split the Set-Cookie header into multiple
	// strings because they get joined
	const split = splitCookiesString(header)
	const parsed = parse(split);

	const data: LoginResponse = (await res.json());

	return [data, parsed];
};

// Routing
app.post('/api/sleepnumber', async (c) => {
	const body: POSTSetSleepNumberJSONBody = await c.req.json();
	const [loginRes, cookies] = await login();
	console.dir(loginRes);
	const key = loginRes.key;

	if (!key) {
		c.status(500);
		return c.text('Malformed login object');
	}

	const query = new URLSearchParams();
	query.set('_k', key);
	query.set('side', body.side);

	const res = await fetch(`${Routes.sleepNumber(body.bed_id)}?${query}`, {
		method: 'PUT',
		headers: {
			Cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			side: body.side,
			sleepNumber: body.sleep_number,
		}),
	});

	try {
		const body = await res.json();
		console.log(`response status and body: ${res.statusText}`);
		console.dir(body);
	} catch { }

	if (res.ok) {
		c.status(200);
		return c.text(`Adjusting the ${body.side === 'L' ? 'left' : 'right'} side to ${body.sleep_number}.`);
	}

	c.status(500);
	return c.text(`Failed to adjust the ${body.side === 'L' ? 'left' : 'right'} side to ${body.sleep_number}.`);
});

app.fire();
