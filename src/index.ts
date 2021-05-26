import { SmartThingsData, updateSmartThings } from './libs/smartthings';
import { TempestObservationValues } from './libs/tempest';
import TempestAPI from './libs/tempest/tempest';

const requiredEnvVars = ['TEMPEST_TOKEN', 'TEMPEST_STATION_ID', 'ST_URL'];

for (const ev of requiredEnvVars) {
	if (typeof process.env[ev] === 'undefined') {
		throw new Error(`Missing environement variable: ${ev}`);
	}
}

const tempest = new TempestAPI(process.env.TEMPEST_TOKEN as string);
const tempestStationId = process.env.TEMPEST_STATION_ID as string;

const stUrl = process.env.ST_URL as string;

function cToF(temp: number) {
	return temp * 1.8 + 32;
}

function observationToST(obs: TempestObservationValues): SmartThingsData {
	return {
		humidity: obs.relative_humidity,
		indoortempf: obs.air_temperature_indoor,
		indoorhumidity: obs.relative_humidity_indoor,
		tempf: cToF(obs.air_temperature),
		winddir: obs.wind_direction,
		windspeedmph: obs.wind_avg,
		windgustmph: obs.wind_gust,
		solarradiation: obs.solar_radiation,
		UV: obs.uv,
		rainin: obs.precip,
		baromin: obs.barometric_pressure,
	};
}

async function run() {
	const observation = await tempest.getStationObservation(tempestStationId);

	if (!observation) {
		throw new Error('Problem fetching observation');
		process.exit(1);
		return;
	}

	const stData = observationToST(observation.obs[0]);
	await updateSmartThings(stData, stUrl);
}

run();
