import ClassSlot from './ClassSlot';
import SupplementaryParser from './SupplementaryParser';
import { SupplementaryInfo } from './SupplementaryInfo';

export default class Class {
	readonly supplementaryInfo: Promise<SupplementaryInfo>;
	readonly instructors: string[];

	constructor(
		public subject: string,
		public courseNumber: string,
		public section: string,
		public classNumber: string,
		public type: string,
		public desc: string,
		public instructorString: string,
		public cart: boolean = false,
		public slots: ClassSlot[] = []
	) {
		this.supplementaryInfo = SupplementaryParser.getSupplementaryInfo(
			'1241',
			subject,
			courseNumber,
			classNumber
		);

		this.instructors = this.instructorString
			.split(',')
			.map(rawName => rawName.trim());
	}

	public get code() {
		return `${this.subject} ${this.courseNumber}`;
	}

	public get identifier() {
		return `${this.subject} ${this.courseNumber} ${this.section}`;
	}

	async getEnrolledString() {
		const info = await this.supplementaryInfo;

		return `${info.enrolled}/${info.capacity}`;
	}

	async getType() {
		if (this.type) return this.type;

		const info = await this.supplementaryInfo;

		return info.type;
	}

	async getDatesForSlot(slot: ClassSlot) {
		const index = this.slots.indexOf(slot);

		return (await this.supplementaryInfo).slotDates[index];
	}
}
