'use strict'

export default function timeNow(unixTime) {
	var daysMonth = {
		days: {
			"0":"Sun",
			"1":"Mon",
			"2":"Tue",
			"3":"Wed",
			"4":"Thu",
			"5":"Fri",
			"6":"Sat"
		},
		months: {
			"0":"Jan",
			"1":"Feb",
			"2":"Mar",
			"3":"Apr",
			"4":"May",
			"5":"Jun",
			"6":"Jul",
			"7":"Aug",
			"8":"Sep",
			"9":"Oct",
			"10":"Nov",
			"11":"Dec"
		}
	};
	var currentDate = new Date(unixTime*1000);
	return daysMonth.days[currentDate.getDay()].toUpperCase() + ", " + 
		   daysMonth.months[currentDate.getMonth()] + " " + 
		   currentDate.getDate();
}
