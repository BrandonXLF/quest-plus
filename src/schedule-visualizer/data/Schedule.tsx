import Class from './Class';
import ScheduleSlot, { SlotType } from './ScheduleSlot';

type ScheduleSlotWithKey = ScheduleSlot & { key: string };

export type Day = (typeof Schedule.days)[number];

export default class Schedule {
	static readonly days = ['M', 'T', 'W', 'Th', 'F'] as const;

	static readonly dayLabels: Record<Day, string> = {
		M: 'Mon',
		T: 'Tue',
		W: 'Wed',
		Th: 'Thu',
		F: 'Fri'
	};

	columns: ScheduleSlotWithKey[][] = [];
	start = Infinity;
	end = 0;
	hasClassSlots = false;

	constructor(private classes: Class[]) {}

	createColumns() {
		this.columns = Schedule.days.map(() => []);

		this.classes.forEach(classInfo => {
			classInfo.slots.forEach(classSlot => {
				classSlot.days.forEach(day => {
					this.hasClassSlots = true;

					this.columns[Schedule.days.indexOf(day)].push({
						type: SlotType.Class,
						start: classSlot.start.index,
						end: classSlot.end.index,
						classSlots: [classSlot],
						key: `${classInfo.courseNumber}/${classSlot.uniqueStr}/${day}`
					});
				});
			});
		});
	}

	processClassOverlap(
		slots: ScheduleSlotWithKey[],
		i: number,
		slot: ScheduleSlotWithKey,
		prevSlot: ScheduleSlotWithKey
	) {
		if (!('classSlots' in prevSlot) || !('classSlots' in slot))
			throw new Error('Slots must have classSlots');

		const prevSlotEnd = prevSlot.end;
		const overlapStart = slot.start;
		const overlapEnd = Math.min(prevSlot.end, slot.end);

		prevSlot.end = overlapStart;
		slot.start = overlapEnd;

		const newSlots = [...prevSlot.classSlots, ...slot.classSlots];

		slots.splice(i, 0, {
			type: SlotType.Class,
			start: overlapStart,
			end: overlapEnd,
			classSlots: newSlots,
			key: `${prevSlot.key}+${slot.key}`
		});

		i++;

		if (slot.end === overlapEnd) {
			slots.splice(i, 1);
			i--;
		}

		if (prevSlotEnd > overlapEnd) {
			let insertIndex = i + 1;

			while (slots[insertIndex]?.start < overlapEnd) insertIndex++;

			slots.splice(insertIndex, 0, {
				...prevSlot,
				start: overlapEnd,
				end: prevSlotEnd,
				key: `${prevSlot.key}/split`
			});

			if (insertIndex == i + 1) i++;
		}

		return i;
	}

	processSlots(slots: ScheduleSlotWithKey[]) {
		slots.sort((a, b) => a.start - b.start);

		if (slots.length && slots[0].start < this.start)
			this.start = slots[0].start;

		for (let i = 0; i < slots.length; i++) {
			const prevSlot = slots[i - 1] as (typeof slots)[0] | undefined;
			const slot = slots[i];

			if (slot.end > this.end) this.end = slot.end;

			if (!prevSlot) continue;

			if (prevSlot.end > slot.start) {
				i = this.processClassOverlap(slots, i, slot, prevSlot);
				continue;
			}

			slots.splice(i, 0, {
				type: SlotType.Gap,
				start: prevSlot.end,
				end: slot.start,
				content: (
					<div>
						{Math.floor((slot.start - prevSlot.end) / 60)}:
						{Math.floor((slot.start - prevSlot.end) % 60)}
					</div>
				),
				key: `${prevSlot.key}+${slot.key}`
			});

			i++;
		}
	}

	addPaddingSlots(slots: ScheduleSlotWithKey[]) {
		if (!slots.length) {
			slots.push({
				type: SlotType.Blank,
				content: undefined,
				start: this.start,
				end: this.end,
				key: 'START'
			});

			return;
		}

		slots.unshift({
			type: SlotType.Blank,
			content: undefined,
			start: this.start,
			end: slots[0].start,
			key: 'START'
		});

		slots.push({
			type: SlotType.Blank,
			content: undefined,
			start: slots[slots.length - 1].end,
			end: this.end,
			key: 'END'
		});
	}

	prepareColumns() {
		this.createColumns();

		this.columns.forEach(this.processSlots, this);
		this.columns.forEach(this.addPaddingSlots, this);

		return this.columns;
	}

	prepareTimeColumn() {
		const timeColumn: ScheduleSlot[] = [];

		for (let i = this.start, nextI = 0; i < this.end; i = nextI) {
			let hour = Math.floor(i / 60);
			const minutes = i % 60;

			if (hour > 12) hour -= 12;

			nextI = Math.ceil((i + 1) / 60) * 60;

			timeColumn.push({
				type: SlotType.Time,
				start: i,
				end: Math.min(nextI, this.end),
				content: <div>{`${hour}:${minutes.toString().padStart(2, '0')}`}</div>
			});
		}

		return timeColumn;
	}
}
