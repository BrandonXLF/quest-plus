import Class from '../data/Class';
import './ScheduleGrid.css';
import ColumnCell from './ColumnCell';
import { useMemo } from 'react';
import Schedule from '../data/Schedule';

function gridOnScroll(e: React.UIEvent) {
	const el = e.target as HTMLDivElement;

	el.classList.toggle('scrolled-x', !!el.scrollLeft);
	el.classList.toggle('scrolled-y', !!el.scrollTop);
}

export default function ScheduleGrid({
	classes,
	isMini
}: Readonly<{
	classes: Class[];
	isMini?: boolean;
}>) {
	const [columns, timeColumn] = useMemo(() => {
		const schedule = new Schedule(classes);

		return [schedule.prepareColumns(), schedule.prepareTimeColumn()];
	}, [classes]);

	return (
		<div className="schedule-container">
			<div
				className={`schedule${isMini ? ' mini' : ''}`}
				onScroll={gridOnScroll}
			>
				<div className="columns">
					<div className="header" />
					{Schedule.days.map((day, i) => (
						<div
							key={day}
							className={`header${
								columns[i].length > 1 ? '' : ' header-empty-col'
							}`}
						>
							{Schedule.dayLabels[day]}
						</div>
					))}
					<div className="column time-column">
						{timeColumn.map(slot => (
							<ColumnCell key={slot.start} slot={slot} />
						))}
					</div>
					{columns.map((slots, i) => (
						<div key={i} className="column">
							{slots.map(slot => (
								<ColumnCell key={slot.key} slot={slot} />
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
