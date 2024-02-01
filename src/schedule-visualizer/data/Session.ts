export default class Session {
	static semesters = [
		{
			name: 'Winter',
			start: 1
		},
		{
			name: 'Spring',
			start: 5
		},
		{
			name: 'Fall',
			start: 9
		}
	];

	static getCurrent() {
		const now = new Date();
		const currentMonth = now.getMonth() + 1;

		let activeYear = now.getFullYear();
		let activeSemester = this.semesters.findIndex(
			semester => currentMonth <= semester.start
		);

		if (activeSemester == -1) {
			activeYear++;
			activeSemester = 0;
		}

		return new Session(activeYear, activeSemester);
	}

	constructor(
		public year: number,
		public semester: number
	) {}

	get code() {
		return `${this.year - 1900}${Session.semesters[this.semester].start}`;
	}

	get name() {
		return `${Session.semesters[this.semester].name} ${this.year}`;
	}

	get next() {
		let nextYear = this.year;
		let nextSemester = this.semester + 1;

		if (nextSemester == Session.semesters.length) {
			nextYear++;
			nextSemester = 0;
		}

		return new Session(nextYear, nextSemester);
	}

	get prev() {
		let nextYear = this.year;
		let nextSemester = this.semester - 1;

		if (nextSemester == -1) {
			nextYear--;
			nextSemester = Session.semesters.length - 1;
		}

		return new Session(nextYear, nextSemester);
	}

	toString() {
		return this.code;
	}
}
