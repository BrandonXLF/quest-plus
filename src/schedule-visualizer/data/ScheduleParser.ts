import Class from './Class';
import ClassSlot from './ClassSlot';
import QuestParser from './QuestParser';

export default class ScheduleParser extends QuestParser {
	static DIVIDER_PARSER = /^([A-Z]+) (\d+[A-Z]?) - ([A-Za-z ]+)/;

	parseDivider(divider: string) {
		const res = ScheduleParser.DIVIDER_PARSER.exec(divider);

		if (!res) return ['UKN', 'UKN', 'UKN'] as const;

		res.splice(0, 1);

		return res as string[] as [string, string, string];
	}

	parse() {
		const rows = [
			...document.querySelectorAll<HTMLTableRowElement>(
				'[id^="trCLASS_MTG_VW$"]'
			)
		];

		return rows.map(row => {
			const divider = this.parseDivider(
				this.getElementContents(row.closest('[id*="win0divDERIVED_REGFRM1_DESCR20"]')?.querySelector<HTMLDivElement>('.PAGROUPDIVIDER'))
			);

			// TODO: Use start/end dates?
			const classInfo = new Class(
				divider[0],
				divider[1],
				this.getChildContents(row, 'MTG_SECTION'),
				this.getChildContents(row, 'CLASS_NBR'),
				this.getChildContents(row, 'MTG_COMP'),
				divider[2],
				this.getChildContents(row, 'INSTR_LONG')
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
}
