import ClassDate from './ClassDate';

export class SupplementaryInfo {
	constructor(
		public desc: string,
		public type: string,
		public campus: string,
		public enrolled: number,
		public capacity: number,
		public slotDates: {
			start: ClassDate;
			end: ClassDate;
		}[] = []
	) {}
}
