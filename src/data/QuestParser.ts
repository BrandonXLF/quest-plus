import Class from './Class';
import ClassSlot from './ClassSlot';

export default class QuestParser {
	static NAME_REGEX = /^([A-Z]+) (\d+[A-Z]?)-(\d+)\n\((\d+)\)/;
	static DESC_REGEX = /^(.+) \(([A-Z]+)\)/;

	getCellContents(row: HTMLTableRowElement, idPart: string) {
		const el = row.querySelector<HTMLElement>(`[id*="${idPart}"]`);

		if (!el) return '';

		const text =
			'wispInnerText' in el.dataset ? el.dataset.wispInnerText! : el.innerText;

		return text.trim().replace(/ +/g, ' ');
	}

	parseName(name: string) {
		const res = QuestParser.NAME_REGEX.exec(name);

		res?.splice(0, 1);

		return res as string[] as [string, string, string, string];
	}

	parseDesc(desc: string) {
		const res = QuestParser.DESC_REGEX.exec(desc);

		if (!res) return ['', 'UKN'] as const;

		return [res[2], res[1]] as const;
	}

	importRows(rows: HTMLTableRowElement[], cart: boolean) {
		return rows.map(row => {
			const classInfo = new Class(
				...this.parseName(this.getCellContents(row, 'CLASS_NAME')),
				...this.parseDesc(this.getCellContents(row, 'CLASS_DESCR')),
				this.getCellContents(row, 'INSTR'),
				cart
			);

			const slot = ClassSlot.fromString(
				classInfo,
				this.getCellContents(row, 'SCHED'),
				this.getCellContents(row, 'LOC')
			);

			if (slot) classInfo.slots.push(slot);

			return classInfo;
		});
	}

	import(cartRows: HTMLTableRowElement[], scheduleRows: HTMLTableRowElement[]) {
		return [
			...this.importRows(cartRows, true),
			...this.importRows(scheduleRows, false)
		];

		/*
		let insertIndex = 0;

		while (
			insertIndex < this.classes.length &&
			this.classes[insertIndex].slots[0].start <=
				this.currentClass.slots[0].start
		)
			insertIndex++;

		this.classes.splice(insertIndex, 0, this.currentClass);
		*/
	}
}
