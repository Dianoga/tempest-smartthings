import axios from 'axios';
import Debug from 'debug';

const debug = Debug('smartthings');

export type SmartThingsData = {
	humidity: number;
	tempf: number;
	winddir: number;
	windspeedmph: number;
	windgustmph: number;
	solarradiation: number;
	UV: number;
	rainin: number;
	baromin: number;
};

export async function updateSmartThings(
	data: SmartThingsData,
	url: string
): Promise<void> {
	try {
		debug('sending data', data);
		await axios.post(url, data);
	} catch (e) {
		console.error(`ST Update failed`, e);
	}
}
