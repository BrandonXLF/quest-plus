import { ReactNode } from 'react';
import ClassSlot from './ClassSlot';

export enum SlotType {
	Class = 'class',
	Time = 'time',
	Gap = 'gap',
	Blank = 'blank'
}

type ScheduleSlot = {
	start: number;
	end: number;
} & (
	| {
			type: Exclude<SlotType, SlotType.Class>;
			content: ReactNode;
	  }
	| {
			type: SlotType.Class;
			classSlots: ClassSlot[];
	  }
);

export default ScheduleSlot;
