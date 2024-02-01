export default class ClassTime {
	public hours;
	public minutes;
	public index;

	constructor(
		hourStr: string,
		minStr: string,
		public period: 'AM' | 'PM'
	) {
		this.hours = parseInt(hourStr);
		this.minutes = parseInt(minStr);
		this.index =
			(period === 'PM' ? (this.hours % 12) + 12 : this.hours % 12) * 60 +
			this.minutes;
	}

	valueOf() {
		return this.index;
	}

	toString() {
		return `${this.hours % 12 || 12}:${this.minutes
			.toString()
			.padStart(2, '0')} ${this.period}`;
	}
}
