import ClassSlot from './ClassSlot';
import SupplementaryParser from './SupplementaryParser';
import { SupplementaryInfo } from './SupplementryInfo';

export default class Class {
	supplementaryInfo: Promise<SupplementaryInfo>;

	constructor(
		public subject: string,
		public courseNumber: string,
		public section: string,
		public classNumber: string,
		public type: string,
		public desc: string,
		public instructor: string,
		public cart: boolean = false,
		public slots: ClassSlot[] = []
	) {
		this.supplementaryInfo = SupplementaryParser.getSupplementaryInfo(
			'1241',
			subject,
			courseNumber,
			classNumber
		);
	}

	public get code() {
		return `${this.subject} ${this.courseNumber}`;
	}

	private get instructorParts() {
		return this.instructor.split(',', 2);
	}

	public get instructorLast() {
		return this.instructorParts[0] || '';
	}

	public get instructorFull() {
		return `${this.instructorParts[1] || ''} ${this.instructorParts[0] || ''}`;
	}

	public get instructorLink() {
		return `/explore?q=${encodeURIComponent(
			this.instructorFull.toLowerCase().replace(/[^a-z ]/g, '')
		)}`;
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
