import { useRef } from 'react';
import './Main.css';
import ScheduleGrid from './ScheduleGrid';
import useConfigBoolean from '../helpers/UseConfigBoolean';
import QuestParser from '../data/QuestParser';
import ScheduleActions from './ScheduleActions';

export default function Main() {
	const importer = useRef(new QuestParser());

	const classes = importer.current.import(
		[
			...document.querySelectorAll<HTMLTableRowElement>(
				'[id^="trSSR_REGFORM_VW$"]'
			)
		],
		[
			...document.querySelectorAll<HTMLTableRowElement>(
				'[id^="trSTDNT_ENRL_SSVW$"]'
			)
		]
	);

	const [shown, setShown] = useConfigBoolean('wisp-show-timetable', true);
	const [miniMode, setMiniMode] = useConfigBoolean('wisp-mini', false);

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
