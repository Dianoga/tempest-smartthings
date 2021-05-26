import ws from 'ws';
import axios, { AxiosInstance } from 'axios';

import { TempestStationObservation } from './types';

export default class TempestAPI {
	private rest: AxiosInstance;

	constructor(private token: string) {
		this.rest = axios.create({
			baseURL: 'https://swd.weatherflow.com/swd/rest',
			params: { token },
		});
	}

	async getStations() {
		try {
			const resp = await this.rest.get('/stations');
			return resp.data?.stations;
		} catch (e) {
			console.error(e);
		}
	}

	async getStationObservation(stationId: string) {
		try {
			const resp = await this.rest.get<TempestStationObservation>(
				`/observations/station/${stationId}`
			);
			return resp.data;
		} catch (e) {
			console.error(e);
		}
	}

	async getDeviceObservation(deviceId: string) {
		try {
			const resp = await this.rest.get(
				`/observations/device/${deviceId}`
			);
			return resp.data;
		} catch (e) {
			console.error(e);
		}
	}
}
