import ClassSubCell from './ClassSubCell';
import './ColumnCell.css';
import ScheduleSlot, { SlotType } from '../data/ScheduleSlot';
import { useEffect, useState } from 'react';

export default function ColumnCell({ slot }: Readonly<{ slot: ScheduleSlot }>) {
	const [className, setClassName] = useState('');

	useEffect(() => {
		if (slot.type !== SlotType.Class) {
			setClassName(slot.type);
			return;
		}

		const classType = slot.classSlots.every(
			classSlot =>
				classSlot.classInfo.type &&
				classSlot.classInfo.type === slot.classSlots[0].classInfo.type
		)
			? `${slot.classSlots[0].classInfo.type}`
			: 'MULTI';

		(async () => {
			const types: string[] = [];

			for (const classSlot of slot.classSlots)
				types.push(await classSlot.classInfo.getType());

			const classType = types.every(type => type === types[0])
				? `${types[0]}`
				: 'MULTI';

			setClassName(`${slot.type} class-${classType}`);
		})();

		setClassName(`${slot.type} class-${classType}`);
	}, [slot]);

	if (slot.start === slot.end) return null;

	const height = ((slot.end - slot.start) / 10) * 1.75 + 'em';

	return (
		<div style={{ height }} className={`column-slot ${className}`}>
			<div className="cell-content">
				{'classSlots' in slot
					? slot.classSlots.map(classSlot => (
						<ClassSubCell
							key={classSlot.uniqueStr}
							classSlot={classSlot}
							siblings={slot.classSlots}
							expandable={slot.classSlots.length > 1}
						/>
					  ))
					: slot.content}
			</div>
		</div>
	);
}
