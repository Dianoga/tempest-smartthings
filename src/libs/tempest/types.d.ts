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
