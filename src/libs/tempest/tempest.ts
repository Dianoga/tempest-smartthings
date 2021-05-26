import axios, { AxiosInstance } from 'axios';
import Debug from 'debug';
import WebSocket, { MessageEvent } from 'ws';

import {
	TempestDeviceEventParsed,
	TempestDeviceListener,
	TempestSocketEvent,
	TempestStationObservation,
} from './types';

const debug = Debug('tempest');

const rapidWindKeys = ['time', 'wind_avg', 'wind_direction'];

const obsStKeys = [
	'time',
	'wind_lull',
	'wind_avg',
	'wind_gust',
	'wind_direction',
	'wind_interval',
	'pressure',
	'air_temperature',
	'relative_humidity',
	'illuminance',
	'uv',
	'solar_radiation',
	'rain',
	'precipitation_type',
	'strike_distance',
	'strike_count',
	'battery',
	'interval',
	'rain_daily',
	'rain_final',
	'rain_daily_final',
	'precipitation_analysis_type',
];

export default class TempestAPI {
	private rest: AxiosInstance;
	private ws?: WebSocket;
	private messageId = 1;

	private deviceListeners: { [deviceId: string]: TempestDeviceListener[] } = {};

	constructor(private token: string) {
		this.rest = axios.create({
			baseURL: 'https://swd.weatherflow.com/swd/rest',
			params: { token },
		});
	}

	private createWebSocket() {
		return new Promise<void>((resolve) => {
			debug('creating websocket');

			this.ws = new WebSocket(
				`wss://ws.weatherflow.com/swd/data?token=${this.token}`
			)
				.on('message', this.handleMessage)
				.on('error', (e) => {
					console.error('Tempest socket error', e);
				})
				.on('close', () => {
					this.ws = undefined;
				})
				.on('open', () => {
					console.info('socket connected');
					resolve();
				});
		});
	}

	private callDeviceListeners = (
		deviceId: string,
		data: TempestDeviceEventParsed
	) => {
		if (deviceId && this.deviceListeners[deviceId]) {
			for (const listener of this.deviceListeners[deviceId]) {
				listener.call(null, data);
			}
		}
	};

	private handleMessage = (message: MessageEvent) => {
		debug('socket received', message);
		const data: TempestSocketEvent = JSON.parse(message as unknown as string);

		if (data.type === 'obs_st') {
			const parsed: any = {};
			obsStKeys.forEach((key, i) => {
				parsed[key] = data.obs[0][i];
			});

			this.callDeviceListeners(data.device_id, { ...data, parsed });
		} else if (data.type === 'rapid_wind') {
			const parsed: any = {};
			rapidWindKeys.forEach((key, i) => {
				parsed[key] = data.ob[i];
			});

			this.callDeviceListeners(data.device_id, { ...data, parsed });
		}
	};

	private sendSocketMessage(params: Record<string, unknown>) {
		const data = { ...params, id: this.messageId++ };
		debug('sending', data);
		this.ws?.send(JSON.stringify(data));
	}

	async getStations() {
		const resp = await this.rest.get('/stations');
		return resp.data?.stations;
	}

	async getStationObservation(
		stationId: string
	): Promise<TempestStationObservation> {
		debug('getting station observation', stationId);
		const resp = await this.rest.get<TempestStationObservation>(
			`/observations/station/${stationId}`
		);
		return resp.data;
	}

	async getDeviceObservation(deviceId: string) {
		debug('getting device observeration', deviceId);
		const resp = await this.rest.get(`/observations/device/${deviceId}`);
		return resp.data;
	}

	async addDeviceListener(
		deviceId: string,
		listener: TempestDeviceListener,
		{ includeRapid = true } = {}
	): Promise<void> {
		if (!this.deviceListeners[deviceId]) this.deviceListeners[deviceId] = [];

		const startListener = this.deviceListeners[deviceId].length === 0;

		this.deviceListeners[deviceId].push(listener);

		if (!this.ws) await this.createWebSocket();

		if (startListener) {
			this.sendSocketMessage({
				type: 'listen_start',
				device_id: deviceId,
			});

			if (includeRapid) {
				this.sendSocketMessage({
					type: 'listen_rapid_start',
					device_id: deviceId,
				});
			}
		}
	}

	removeDeviceListener(
		deviceId: string,
		listener: TempestDeviceListener
	): void {
		if (!this.deviceListeners[deviceId]) return;

		const index = this.deviceListeners[deviceId].indexOf(listener);
		if (index > -1) {
			this.deviceListeners[deviceId].splice(index, 1);
		}

		// TODO: Stop the socket if no more listeners
		if (this.deviceListeners[deviceId].length === 0) {
			this.sendSocketMessage({
				type: 'listen_stop',
				device_id: deviceId,
			});
		}
	}

	shutdown(): void {
		debug('shutting down');
		const deviceIds = Object.keys(this.deviceListeners);

		if (this.ws) {
			for (const id of deviceIds) {
				this.sendSocketMessage({
					type: 'listen_stop',
					device_id: id,
				});
				this.sendSocketMessage({
					type: 'listen_rapid_stop',
					device_id: id,
				});

				this.deviceListeners[id] = [];
			}

			this.ws.close();
		}
	}
}
