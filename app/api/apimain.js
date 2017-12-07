'use strict'

export default function ApiWeather(city,forecast) {
	let key = '2c97016ff95b48bb378e168f9c9f89ae',
		urlApi = 'http://api.openweathermap.org/data/2.5/',
		url;
	if(forecast == false) {
		url = urlApi + 'find?q=' + city + '&units=metric&appid=' + key;
	} else {
		url = urlApi + 'forecast?q=' + city + '&units=metric&appid=' + key;
	}
  	return fetch(url).then((response) => response.json());
} 
