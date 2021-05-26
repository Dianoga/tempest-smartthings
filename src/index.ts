import { SmartThingsData, updateSmartThings } from './libs/smartthings';
import {
	TempestDeviceEventParsed,
	TempestObservationValues,
} from './libs/tempest';
import TempestAPI from './libs/tempest/tempest';

const requiredEnvVars = [
	'TEMPEST_TOKEN',
	'TEMPEST_DEVICE_ID',
	'TEMPEST_STATION_ID',
	'ST_URL',
];

for (const ev of requiredEnvVars) {
	if (typeof process.env[ev] === 'undefined') {
		throw new Error(`Missing environement variable: ${ev}`);
	}
}

const tempest = new TempestAPI(process.env.TEMPEST_TOKEN as string);
const tempestStationId = process.env.TEMPEST_STATION_ID as string;
const tempestDeviceId = process.env.TEMPEST_DEVICE_ID as string;

const stUrl = process.env.ST_URL as string;

let currentData: SmartThingsData;

function cToF(temp: number) {
	return temp * 1.8 + 32;
}

function mpsToMPH(speed: number) {
	return speed * 2.236936;
}

function observationToST(
	obs: Partial<TempestObservationValues>
): SmartThingsData {
	const data = { ...currentData };

	if (obs.relative_humidity) data.humidity = obs.relative_humidity;
	if (obs.air_temperature) data.tempf = cToF(obs.air_temperature);
	if (obs.wind_direction) data.winddir = obs.wind_direction;

	if (obs.wind_avg) {
		if (mpsToMPH(obs.wind_avg) < data.windgustmph)
			data.windspeedmph = mpsToMPH(obs.wind_avg);
		else data.windgustmph = mpsToMPH(obs.wind_avg);
	}

	if (obs.wind_gust) data.windgustmph = mpsToMPH(obs.wind_gust);
	if (obs.solar_radiation) data.solarradiation = obs.solar_radiation;
	if (obs.uv) data.UV = obs.uv;
	if (obs.precip) data.rainin = obs.precip;
	if (obs.barometric_pressure) data.baromin = obs.barometric_pressure;

	return data;
}

async function run() {
	try {
		const observation = await tempest.getStationObservation(tempestStationId);
		currentData = observationToST(observation.obs[0]);
		await updateSmartThings(currentData, stUrl);

		function deviceEventHandler(event: TempestDeviceEventParsed) {
			currentData = observationToST(event.parsed);
			updateSmartThings(currentData, stUrl);
		}

		tempest.addDeviceListener(tempestDeviceId, deviceEventHandler);
	} catch (e) {
		tempest.shutdown();
		console.error(e);
	}
}

function shutdown() {
	console.log('Shutting down gracefully');
	tempest.shutdown();
	process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGHUP', shutdown);

run();
