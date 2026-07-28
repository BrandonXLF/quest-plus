import Class from './Class';
import ClassSlot from './ClassSlot';
import QuestParser from './QuestParser';

export default class ScheduleParser extends QuestParser {
	static readonly DIVIDER_PARSER = /^([A-Z]+) (\d+[A-Z]?) - ([A-Za-z ]+)/;

	getSession() {
		const link = document.querySelector<HTMLAnchorElement>(
			'#win0divDERIVED_SSTSNAV_SSTS_NAV_SUBTABS > div > table > tbody > tr > td:nth-child(2) > a'
		);
		if (!link) return '';
		return new URL(link.href).searchParams.get('STRM') ?? '';
	}

	parseDivider(divider: string) {
		const res = ScheduleParser.DIVIDER_PARSER.exec(divider);

		if (!res) return ['UKN', 'UKN', 'UKN'] as const;

		res.splice(0, 1);

		return res as string[] as [string, string, string];
	}

	parse() {
		const session = this.getSession();

		const rows = [
			...document.querySelectorAll<HTMLTableRowElement>(
				'[id^="trCLASS_MTG_VW$"]'
			)
		];

		let lastClassInfo: Class | undefined;

		return rows
			.map(row => {
				const divider = this.parseDivider(
					this.getElementContents(
						row
							.closest('[id*="win0divDERIVED_REGFRM1_DESCR20"]')
							?.querySelector<HTMLDivElement>('.PAGROUPDIVIDER')
					)
				);

				if (!this.getChildContents(row, 'CLASS_NBR')) {
					lastClassInfo?.slots.push(
						ClassSlot.fromString(
							lastClassInfo,
							this.getChildContents(row, 'SCHED'),
							this.getChildContents(row, 'LOC')
						)!
					);

					return null;
				}

				// TODO: Use start/end dates from here instead of supplementary info
				const classInfo = new Class(
					session,
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

				lastClassInfo = classInfo;
				return classInfo;
			})
			.filter((classInfo): classInfo is Class => classInfo !== null);
	}
}
