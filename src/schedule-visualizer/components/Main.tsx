import { useMemo, useRef, useState } from 'react';
import './Main.css';
import ScheduleGrid from './ScheduleGrid';
import useConfigBoolean from '../helpers/UseConfigBoolean';
import ScheduleActions from './ScheduleActions';
import getQuestParser from '../data/getQuestParser';
import ClassToggleList from './ClassToggleList';

export default function Main() {
	const parser = useRef(getQuestParser());
	const classes = parser.current?.parse();

	const [shown, setShown] = useConfigBoolean('show-timetable', true);
	const [miniMode, setMiniMode] = useConfigBoolean('mini-timetable', false);
	const [hiddenClasses, setHiddenClasses] = useState<Record<string, boolean>>(
		{}
	);
	const [showFilter, setShowFilter] = useState(false);
	const filteredClasses = useMemo(
		() =>
			classes?.filter(
				classInfo => hiddenClasses[classInfo.identifier] !== true
			),
		[classes, hiddenClasses]
	);

	if (!classes) return;

	return (
		<article className="schedule-planner">
			<ScheduleActions
				shown={shown}
				onShownChanged={setShown}
				miniMode={miniMode}
				onMiniModeChanged={setMiniMode}
				onFilterToggleClicked={() => setShowFilter(showFilter => !showFilter)}
			/>
			{shown && showFilter && (
				<ClassToggleList
					classes={classes}
					hiddenClasses={hiddenClasses}
					onHiddenClassesChanged={changes => {
						setHiddenClasses(hiddenClasses => ({
							...hiddenClasses,
							...changes
						}));
					}}
				/>
			)}
			{shown && filteredClasses && (
				<ScheduleGrid classes={filteredClasses} isMini={miniMode} />
			)}
		</article>
	);
}
