export default class ClassDate {
	public month;
	public day;

	constructor(dateStr: string, end = false) {
		if (!dateStr) {
			this.month = end ? Infinity : -Infinity;
			this.day = 0;

			return;
		}

		const [monthStr, dayStr] = dateStr.split('/');

		this.month = parseInt(monthStr);
		this.day = parseInt(dayStr);
	}

	isDefined() {
		return this.month !== Infinity && this.month !== -Infinity;
	}

	valueOf() {
		return this.month * 100 + this.day;
	}

	toString() {
		return `${this.month}/${this.day.toString().padStart(2, '0')}`;
	}
}
