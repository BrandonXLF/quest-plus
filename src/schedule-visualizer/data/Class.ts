import ClassSlot from './ClassSlot';
import SupplementaryParser from './SupplementaryParser';
import { SupplementaryInfo } from './SupplementaryInfo';

export default class Class {
	readonly supplementaryInfo: Promise<SupplementaryInfo>;
	readonly instructors: string[];

	constructor(
		public cart: boolean = false,

		// Mandatory
		public readonly session: string,
		public readonly subject: string,
		public readonly courseNumber: string,
		public readonly section: string,
		public readonly classNumber: string,

		// Optional
		private readonly type?: string,
		public readonly desc?: string,
		private readonly instructorString?: string,
		public slots: ClassSlot[] = []
	) {
		this.supplementaryInfo = SupplementaryParser.getSupplementaryInfo(
			session,
			subject,
			courseNumber,
			classNumber
		);

		this.instructors = (this.instructorString ?? '?')
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

	get initialType() {
		return this.type;
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
