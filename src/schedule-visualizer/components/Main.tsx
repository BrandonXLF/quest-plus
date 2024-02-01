import { useRef } from 'react';
import './Main.css';
import ScheduleGrid from './ScheduleGrid';
import useConfigBoolean from '../helpers/UseConfigBoolean';
import ScheduleActions from './ScheduleActions';
import getQuestParser from '../data/getQuestParser';

export default function Main() {
	const parser = useRef(getQuestParser());
	const classes = parser.current?.parse();

	const [shown, setShown] = useConfigBoolean('wisp-show-timetable', true);
	const [miniMode, setMiniMode] = useConfigBoolean('wisp-mini', false);

	if (!classes) return;

	return (
		<article className="wisp-main">
			<ScheduleActions
				shown={shown}
				onShownChanged={setShown}
				miniMode={miniMode}
				onMiniModeChanged={setMiniMode}
			/>
			{shown && <ScheduleGrid classes={classes} isMini={miniMode} />}
		</article>
	);
}
