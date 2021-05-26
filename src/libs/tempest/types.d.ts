export type TempestStatus = {
	status_code: number;
	status_message: string;
};

export type TempestStationUnits = {
	units_temp: 'f';
	units_wind: 'mph';
	units_precip: 'in';
	units_pressure: 'mb';
	units_distance: 'mi';
	units_direction: 'cardinal';
	units_other: 'imperial';
};

export type TempestObservationValues = {
	timestamp: number;
	air_temperature: number;
	barometric_pressure: number;
	sea_level_pressure: number;
	relative_humidity: number;
	precip: number;
	precip_accum_last_1hr: number;
	wind_avg: number;
	wind_direction: number;
	wind_gust: number;
	wind_lull: number;
	solar_radiation: number;
	uv: number;
	brightness: number;
	lightning_strike_last_epoch: number;
	lightning_strike_last_distance: number;
	lightning_strike_count_last_3hr: number;
	feels_like: number;
	heat_index: number;
	wind_chill: number;
	dew_point: number;
	wet_bulb_temperature: number;
	delta_t: number;
	air_density: number;
	air_temperature_indoor: number;
	barometric_pressure_indoor: number;
	sea_level_pressure_indoor: number;
	relative_humidity_indoor: number;
	precip_indoor: number;
	precip_accum_last_1hr_indoor: number;
	wind_avg_indoor: number;
	wind_direction_indoor: number;
	wind_gust_indoor: number;
	wind_lull_indoor: number;
	solar_radiation_indoor: number;
	uv_indoor: number;
	brightness_indoor: number;
	lightning_strike_last_epoch_indoor: number;
	lightning_strike_last_distance_indoor: number;
	lightning_strike_count_last_3hr_indoor: number;
	feels_like_indoor: number;
	heat_index_indoor: number;
	wind_chill_indoor: number;
	dew_point_indoor: number;
	wet_bulb_temperature_indoor: number;
	delta_t_indoor: number;
	air_density_indoor: number;
};

export type TempestStationObservation = {
	status: TempestStatus;
	station_units: TempestStationUnits;
	station_id: number;
	station_name: string;
	public_name: string;
	latitude: number;
	longitude: number;
	timezone: string;
	elevation: number;
	obs: TempestObservationValues[];
};

export type TempestEventAck = {
	type: 'ack';
	id: number;
};

export type TempestEventRainStart = {
	type: 'evt_precip';
	device_id: string;
};

export type TempestEventLightningStrike = {
	type: 'evt_strike';
	device_id: string;
	evt: [time: number, distance: number, energy: number];
};

export type TempestEventDeviceOnline = {
	type: 'evt_online';
	device_id: string;
};

export type TempestEventDeviceOffline = {
	type: 'evt_offline';
	device_id: string;
};

export type TempestEventRapidWind = {
	type: 'rapid_wind';
	device_id: string;
	ob: [time: number, speed: number, direction: number];
};

export type TempestEventRapidWindParsed = TempestEventRapidWind & {
	parsed: {
		time: number;
		wind_avg: number;
		wind_direction: number;
	};
};

export type TempestEventObservationAir = {
	type: 'obs_air';
	device_id: string;
	obs: [
		time: number,
		pressure: number,
		temperature: number,
		humidity: number,
		strike_count: number,
		strike_distance: number,
		battery: number,
		interval: number
	][];
};

export type TempestEventObservationSky = {
	type: 'obs_air';
	device_id: string;
	obs: [
		time: number,
		illuminance: number,
		uv: number,
		rain: number,
		wind_lull: number,
		wind_avg: number,
		wind_gust: number,
		battery: number,
		interval: number,
		solar_radiation: number,
		rain_daily: number,
		precipitation_type: number,
		wind_interval: number,
		rain_final: number,
		rain_daily_final: number,
		precipitation_analysis_type: number
	][];
};

export type TempestEventObservationTempest = {
	type: 'obs_st';
	device_id: string;
	obs: [
		time: number,
		wind_lull: number,
		wind_avg: number,
		wind_gust: number,
		wind_direction: number,
		wind_interval: number,
		pressure: number,
		temperature: number,
		humidity: number,
		illuminance: number,
		uv: number,
		solar_radiation: number,
		rain: number,
		precipitation_type: number,
		strike_distance: number,
		strike_count: number,
		battery: number,
		interval: number,
		rain_daily: number,
		rain_final: number,
		rain_daily_final: number,
		precipitation_analysis_type: number
	][];
};

export type TempestEventObservationTempestParsed =
	TempestEventObservationTempest & {
		parsed: {
			time: number;
			wind_lull: number;
			wind_avg: number;
			wind_gust: number;
			wind_direction: number;
			wind_interval: number;
			barometric_pressure: number;
			air_temperature: number;
			relative_humidity: number;
			illuminance: number;
			uv: number;
			solar_radiation: number;
			precip: number;
			precipitation_type: number;
			strike_distance: number;
			strike_count: number;
			battery: number;
			interval: number;
			rain_daily: number;
			rain_final: number;
			rain_daily_final: number;
			precipitation_analysis_type: number;
		};
	};

export type TempestEventStationOnline = {
	type: 'evt_station_online';
	station_id: string;
};

export type TempestEventStationOffline = {
	type: 'evt_station_offline';
	station_id: string;
};

export type TempestDeviceEvent =
	| TempestEventRainStart
	| TempestEventLightningStrike
	| TempestEventRapidWind
	| TempestEventObservationAir
	| TempestEventObservationSky
	| TempestEventObservationTempest
	| TempestEventDeviceOnline
	| TempestEventDeviceOffline;

export type TempestDeviceEventParsed =
	| TempestEventObservationTempestParsed
	| TempestEventRapidWindParsed;

export type TempestSocketEvent = TempestDeviceEvent;

export type TempestDeviceListener = (evt: TempestDeviceEventParsed) => any;
