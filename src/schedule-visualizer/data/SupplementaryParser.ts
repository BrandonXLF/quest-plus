import ClassDate from './ClassDate';
import ClassesParser from './ClassesParser';
import { SupplementaryInfo } from './SupplementryInfo';

export default class SupplementaryParser extends ClassesParser {
	private static classCache: Record<string, Record<string, SupplementaryInfo>> =
		{};
	private static nameCache: Record<string, string> = {};
	private static digitRegex = /^\d+$/;
	private static dateRegex = /[0-9:]+-[0-9:]+[A-Za-z]+([^-]*|)-?(.*|)/;

	private classes: Record<string, SupplementaryInfo> = {};
	private outerTableRows?: HTMLTableRowElement[];
	private scheduleRows?: HTMLTableRowElement[];
	private currentClass?: SupplementaryInfo;

	static async getSupplementaryInfo(
		session: string,
		subject: string,
		number: string,
		classNumber: string
	) {
		const parser = new SupplementaryParser(session, subject, number);

		return (await parser.getClasses())[classNumber];
	}

	constructor(
		public session: string,
		public subject: string,
		public number: string
	) {
		super();
	}

	get code() {
		return `${this.subject} ${this.number}`;
	}

	private datesFromRow(row: HTMLTableRowElement, colOffset: number = 0) {
		const dateText = this.getCellContents(row, 10 + colOffset);

		if (!this.currentClass || !SupplementaryParser.dateRegex.test(dateText))
			return false;

		const [, startDateStr, endDateStr] =
			SupplementaryParser.dateRegex.exec(dateText)!;

		this.currentClass.slotDates.push({
			start: new ClassDate(startDateStr),
			end: new ClassDate(endDateStr)
		});

		return true;
	}

	private async classFromRow(row: HTMLTableRowElement) {
		const number = this.getCellContents(row, 0);

		this.currentClass = new SupplementaryInfo(
			await this.getName(),
			this.getCellContents(row, 1).split(' ')[0],
			this.getCellContents(row, 2),
			+this.getCellContents(row, 7),
			+this.getCellContents(row, 6)
		);

		if (!this.datesFromRow(row)) {
			delete this.classes[number];
			return;
		}

		this.classes[number] = this.currentClass;
	}

	private async processRow(row: HTMLTableRowElement) {
		const firstCell = this.getCellContents(row, 0);
		const firstIsNumber = SupplementaryParser.digitRegex.test(firstCell);

		if (firstIsNumber) {
			await this.classFromRow(row);
			return;
		}

		this.datesFromRow(row, !firstCell ? 0 : -5);
	}

	private async populateTableRows() {
		[this.outerTableRows, this.scheduleRows] = await this.fetchTableRows(
			`/cgi-bin/cgiwrap/infocour/salook.pl?level=under&sess=${this.session}&subject=${this.subject}&cournum=${this.number}`,
			[0, 1]
		);
	}

	async getClasses() {
		if (this.code in SupplementaryParser.classCache)
			return SupplementaryParser.classCache[this.code];

		this.classes = {};

		if (!this.scheduleRows) await this.populateTableRows();

		for (const row of this.scheduleRows!.filter((_, i) => i)) {
			await this.processRow(row);
		}

		SupplementaryParser.classCache[this.code] = this.classes;
		return this.classes;
	}

	async getName() {
		if (this.code in SupplementaryParser.nameCache)
			return SupplementaryParser.nameCache[this.code];

		if (!this.outerTableRows) await this.populateTableRows();
		if (!this.outerTableRows![1]) return '';

		const name = this.getCellContents(this.outerTableRows![1], 3);
		SupplementaryParser.nameCache[this.code] = name;
		return name;
	}
}
