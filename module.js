// Mix of function that was built early in the project big TODO
const regression = require("regression");
Date.prototype.addDays = function (days) {
	const date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};
Date.prototype.getWeekNumber = function (date = this) {

	const d = new Date(Date.UTC(
		date.getFullYear(),
		this.getMonth(),
		this.getDate()
	)),
		dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(
		d.getUTCFullYear(),
		0,
		1
	));
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

};
Array.prototype.rotate = (function () {

	const {unshift} = Array.prototype,
		{splice} = Array.prototype;

	return function (count) {

		var len = this.length >>> 0,
			count = count >> 0;

		unshift.apply(
			this,
			splice.call(
				this,
				count % len,
				len
			)
		);
		return this;

	};

}());
const summerMonths = [
	"jun",
	"jul",
	"aug",
	"sep"
]
const winterMonths = [
	"oct",
	"nov",
	"dec",
	"jan",
	"feb",
	"mar",
	"apr",
	"may"
]
const monthName = (month) => ({
		"jan": "January",
		"feb": "February",
		"mar": "March",
		"apr": "April",
		"may": "May",
		"jun": "June",
		"jul": "July",
		"aug": "August",
		"sep": "September",
		"oct": "October",
		"nov": "November",
		"dec": "December"
	})[month]
const t = {
	"t05": [
		0,
		12.706,
		4.303,
		3.182,
		2.776,
		2.571,
		2.447,
		2.365,
		2.306,
		2.262,
		2.228,
		2.201,
		2.179,
		2.160,
		2.145,
		2.131,
		2.120,
		2.110,
		2.101,
		2.093,
		2.086
	]
};
const months = () => [
		"jan",
		"feb",
		"mar",
		"apr",
		"may",
		"jun",
		"jul",
		"aug",
		"sep",
		"oct",
		"nov",
		"dec"
	]
// const useWebWorker = true,
const average = (values) => {
		if (values.length === 0) {
			return 0;
		}
		return sum(values) / values.length;
	};

const seasons = {
		"spring": [
			"mar",
			"apr",
			"may"
		],
		"summer": [
			"jun",
			"jul",
			"aug"
		],
		"autumn": [
			"sep",
			"oct",
			"nov"
		],
		"winter": [
			"dec",
			"jan",
			"feb"
		]
	}
const monthByIndex = (index) => months()[index]
const movingAverage = (values, index, number) => average(values.slice(
		Math.max(
			index - number,
			0
		),
		index
	))
const sumSquareDistance = (values, mean) => values.reduce(
		(sum, value) => sum + (value - mean) ** 2,
		0
	)
const variance = (values) => sumSquareDistance(
		values,
		average(values)
	) / (values.length - 1)
const withinBaselinePeriod = (year) => year >= baselineLower && year <= baselineUpper
const sum = (values) => values.reduce(
		(sum, current) => sum + current,
		0
	)
module.exports = {
	isFirstHalfYear: function (month) {
		return month < 7;

	},
	months: months,
	monthByIndex: monthByIndex, 
	summerMonths: summerMonths,
	winterMonths: winterMonths,
	monthName: monthName,
	summerRange: `${monthName(summerMonths[0])} to ${monthName(summerMonths[summerMonths.length - 1])}`,
	winterRange: `${monthName(winterMonths[0])} to ${monthName(winterMonths[summerMonths.length - 1])}`,
	isSummerMonth: (month) => summerMonths.includes(month),
	isWinterMonth: (month) => winterMonths.includes(month),
	// Var isSummerMonthByIndex = month => isSummerMonth(monthByIndex(month));
	isSummerMonthByIndex: (month) => isSummerMonth(monthByIndex(month)),

	/*
	 * Exports.isSummerMonthByIndex = isSummerMonthByIndex;
	 * Var isWinterMonthByIndex = month => isWinterMonth(monthByIndex(month));
	 */
	isWinterMonthByIndex: (month) => isWinterMonth(monthByIndex(month)),
	// Exports.isWinterMonthByIndex = isWinterMonthByIndex;
	seasons: seasons,
	getSeasonByIndex: (month) => Object.keys(seasons).filter((key) => seasons[key].includes(monthByIndex(month)))[0],

	sum: sum,
	min: (values) => values.reduce(
		(min, current) => Math.min(
			min,
			current
		),
		Infinity
	),
	max: (values) => values.reduce(
		(max, current) => Math.max(
			max,
			current
		),
		-Infinity
	),
	average: average,
	mean: average,
	movingAverage: movingAverage,
	movingAverages: (values, number) => values.map((_, index) => movingAverage(
		values,
		index,
		number
	)),
	varianceMovAvg: (values, number) => values.map((_, index) => variance(values.slice(Math.max(
		index - number,
		0
	)).map((each) => each.y))),
	difference: (values, baseline) => values.map((value) => value - baseline),
	sumSquareDistance: sumSquareDistance,
	variance: variance, 
	confidenceInterval: (mean, variance, count, td = t.t05) => {
		const zs = [
			0,
			12.706,
			4.303,
			3.182,
			2.776,
			2.571,
			2.447,
			2.365,
			2.306,
			2.262,
			2.228,
			2.201,
			2.179,
			2.160,
			2.145,
			2.131,
			2.120,
			2.110,
			2.101,
			2.093,
			2.086
		],
			z = zs[count - 1] || zs[zs.length - 1],
			ci = z * Math.sqrt(variance / count);
		return {
			"low": mean - ci,
			"high": mean + ci
		};

	},
	// Equally weighted averages normal distribution
	confidenceInterval_EQ_ND: (values, count) => {
		const movAvg = movingAverages(
			values.map((each) => each.y),
			count
		).map((avg, i) => ({
			"x": values[i].x,
			"y": avg
		})),
			movAvgVar = varianceMovAvg(
				values,
				count
			),
			ciMovAvg = movAvg.map((_, index) => ({
				"x": movAvg[index].x,
				"y": confidenceInterval(
					movAvg[index].y,
					movAvgVar[index],
					count
				)
			})).map((each) => ({
				"x": each.x,
				"low": each.y.low,
				"high": each.y.high
			}));
		return {
			movAvg,
			movAvgVar,
			ciMovAvg
		};

	},

	/*
	 * Exports.baselineLower = 1961;
	 * Exports.baselineUpper = 1990;
	 */
	// TODO currying
	withinBaselinePeriod: withinBaselinePeriod,
	getDiff: function (values) {
		const result = values.filter((each) => withinBaselinePeriod(each.x)),
			count = result.length;
		console.log(result);
		const sum = result.map((each) => each.y).reduce(
			(a, b) => a + b,
			0
		);
		return sum / count;
	},
	validNumber: (string) => {

		const number = Number(string);
		return number
			? number
			: undefined;

	},
	parseDate: (string) => {

		const date = string.split("-");
		if (date.length < 3) {

			date[1] = date[2] = 0;

		}
		var day = Number(date[2]);
		var time;
		if(!day){
			var tmp = date[2].split('T');
			day = Number(tmp[0]);
			time = tmp[1].split(':');
			time[2] = time[2].split('.')[0]
		}
		return {
			"year": Number(date[0]),
			"month": Number(date[1]),
			"day": day, 
			"hour": time ? Number(time[0]) : undefined,
			"min": time ? Number(time[1]) : undefined,
		};

	},
	isLeapYear: (year) => year % 4 == 0 && year % 100 != 0 || year % 400 == 0,
	createDate: (date) => new Date(
		date.year,
		date.month - 1,
		date.day,
		date.hour,
		date.min
	),
	weekNumber: (date) => {
		const d = new Date(Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		));
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		const yearStart = new Date(Date.UTC(
			d.getUTCFullYear(),
			0,
			1
		));
		return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

	},
	dayOfYear: (date) => {

		const start = new Date(
			date.getFullYear(),
			0,
			0
		),
			diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000,
			oneDay = 1000 * 60 * 60 * 24;
		return Math.floor(diff / oneDay);

	},
	dateFromDayOfYear: (year, dayOfYear) => new Date(
		year,
		0,
		dayOfYear
	),
	parseNumber: (string) => parseFloat(string.replace(
		",",
		"."
	)) || undefined,

	linearRegression: (xs, ys) => {

		const data = xs.map((x, index) => [
			x,
			ys[index]
		]),
			result = regression.linear(data),
			gradient = result.equation[0],
			intercept = result.equation[1],
			linear = (x) => gradient * x + intercept;
		linear.toString = () => `${gradient} x ${intercept >= 0
				? "+"
				: "-"}${Math.abs(intercept)}`;
		linear.r2 = result.r2;
		return linear;

	},
}
