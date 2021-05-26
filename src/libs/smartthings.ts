import axios from 'axios';

export type SmartThingsData = {
	humidity: number;
	indoortempf: number;
	indoorhumidity: number;
	tempf: number;
	winddir: number;
	windspeedmph: number;
	windgustmph: number;
	solarradiation: number;
	UV: number;
	rainin: number;
	baromin: number;
};

export async function updateSmartThings(data: SmartThingsData, url: string) {
	try {
		const resp = await axios.post(url, data);
	} catch (e) {
		console.error(`ST Update failed`, e);
	}
}
