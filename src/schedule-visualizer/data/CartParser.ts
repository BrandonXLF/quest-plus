import Class from './Class';
import ClassSlot from './ClassSlot';
import QuestParser from './QuestParser';

export default class CartParser extends QuestParser {
	static readonly NAME_REGEX = /^([A-Z]+) (\d+[A-Z]?)-(\d+)\n\((\d+)\)/;
	static readonly DESC_REGEX = /^(.+) \(([A-Z]+)\)/;

	private seen: Record<string, Class> = {};

	getSession() {
		return new URLSearchParams(document.location.search).get('STRM') ?? '';
	}

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

	importRows(session: string, rows: HTMLTableRowElement[], cart: boolean) {
		return rows
			.map(row => {
				const classInfo = new Class(
					session,
					...this.parseName(this.getChildContents(row, 'CLASS_NAME')),
					...this.parseDesc(this.getChildContents(row, 'CLASS_DESCR')),
					this.getChildContents(row, 'INSTR'),
					cart
				);

				if (this.seen[classInfo.identifier]) {
					this.seen[classInfo.identifier].cart &&= cart;
					return null;
				}

				this.seen[classInfo.identifier] = classInfo;

				const sched = this.getChildContents(row, 'SCHED').split('\n');
				const loc = this.getChildContents(row, 'LOC').split('\n');

				for (let i = 0; i < sched.length; i++) {
					const slot = ClassSlot.fromString(classInfo, sched[i], loc[i]);
					if (slot) classInfo.slots.push(slot);
				}

				return classInfo;
			})
			.filter(classInfo => classInfo !== null);
	}

	parse() {
		const session = this.getSession();

		const result = [
			...this.importRows(
				session,
				[
					...document.querySelectorAll<HTMLTableRowElement>(
						'[id^="trSSR_REGFORM_VW$"]'
					)
				],
				true
			),
			...this.importRows(
				session,
				[
					...document.querySelectorAll<HTMLTableRowElement>(
						'[id^="trSTDNT_ENRL_SSVW$"]'
					)
				],
				false
			)
		];

		this.seen = {};

		return result;
	}
}
