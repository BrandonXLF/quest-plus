import { Day } from './Schedule';
import Class from './Class';
import ClassTime from './ClassTime';

export default class ClassSlot {
	private static DATE_TIME_PATTERN =
		/([A-Za-z]+) (\d+):(\d+)(AM|PM) - (\d+):(\d+)(AM|PM)/;

	static fromString(classInfo: Class, dateTimeStr: string, room: string) {
		if (!ClassSlot.DATE_TIME_PATTERN.test(dateTimeStr)) return undefined;

		const [
			,
			daysStr,
			startHour,
			startMin,
			startPeriod,
			endHour,
			endMin,
			endPeriod
		] = ClassSlot.DATE_TIME_PATTERN.exec(dateTimeStr)!;

		const start = new ClassTime(
			startHour,
			startMin,
			startPeriod as 'AM' | 'PM'
		);
		const end = new ClassTime(endHour, endMin, endPeriod as 'AM' | 'PM');
		const days = daysStr.split(/(?=[A-Z])/) as Day[];

		return new ClassSlot(classInfo, start, end, days, room);
	}

	constructor(
		public classInfo: Class,
		public start: ClassTime,
		public end: ClassTime,
		public days: Day[],
		public room: string
	) {}

	get timeStr() {
		return `${this.start}\u2013${this.end}`;
	}

	get dayStr() {
		return this.days.join('');
	}

	async getDateStr() {
		const dates = await this.dates;

		if (!dates.start.isDefined()) return '';

		if (dates.start.valueOf() === dates.end.valueOf())
			return dates.start.toString();

		return `${dates.start}\u2013${dates.end}`;
	}

	get uniqueStr() {
		return `${this.timeStr}${this.dayStr}${this.room}`;
	}

	get dates() {
		return this.classInfo.getDatesForSlot(this);
	}
}
