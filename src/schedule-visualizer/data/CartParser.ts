import Class from './Class';
import ClassSlot from './ClassSlot';
import QuestParser from './QuestParser';

export default class CartParser extends QuestParser {
	static readonly NAME_REGEX = /^([A-Z]+) (\d+[A-Z]?)-(\d+)\n\((\d+)\)/;
	static readonly DESC_REGEX = /^(.+) \(([A-Z]+)\)/;

	parseName(name: string) {
		const res = CartParser.NAME_REGEX.exec(name);

		if (!res) return ['', '', '', ''] as [string, string, string, string];

		res.splice(0, 1);

		return res as string[] as [string, string, string, string];
	}

	parseDesc(desc: string) {
		const res = CartParser.DESC_REGEX.exec(desc);

		if (!res) return ['', 'UKN'] as const;

		return [res[2], res[1]] as const;
	}

	importRows(rows: HTMLTableRowElement[], cart: boolean) {
		return rows.map(row => {
			const classInfo = new Class(
				...this.parseName(this.getChildContents(row, 'CLASS_NAME')),
				...this.parseDesc(this.getChildContents(row, 'CLASS_DESCR')),
				this.getChildContents(row, 'INSTR'),
				cart
			);

			const slot = ClassSlot.fromString(
				classInfo,
				this.getChildContents(row, 'SCHED'),
				this.getChildContents(row, 'LOC')
			);

			if (slot) classInfo.slots.push(slot);

			return classInfo;
		});
	}

	parse() {
		return [
			...this.importRows(
				[
					...document.querySelectorAll<HTMLTableRowElement>(
						'[id^="trSSR_REGFORM_VW$"]'
					)
				],
				true
			),
			...this.importRows(
				[
					...document.querySelectorAll<HTMLTableRowElement>(
						'[id^="trSTDNT_ENRL_SSVW$"]'
					)
				],
				false
			)
		];
	}
}
