import './ScheduleActions.css';
import MaximizeIcon from '../icons/MaximizeIcon';
import MinimizeIcon from '../icons/MinimizeIcon';
import BorderlessButton from './BorderlessButton';
import IconLink from './IconLink';
import GitHubIcon from '../icons/GitHubIcon';
import CollapseIcon from '../icons/CollapseIcon';
import ExpandIcon from '../icons/ExpandIcon';
import Title from './Title';
import FilterIcon from '../icons/FilterIcon';

export default function ScheduleActions({
	shown,
	onShownChanged,
	miniMode,
	onMiniModeChanged,
	onFilterToggleClicked
}: Readonly<{
	shown: boolean;
	onShownChanged: (shown: boolean) => void;
	miniMode: boolean;
	onMiniModeChanged: (miniMode: boolean) => void;
	onFilterToggleClicked: () => void;
}>) {
	return (
		<header className="schedule-planner-header">
			<BorderlessButton onClick={() => onShownChanged(!shown)}>
				{shown ? <CollapseIcon /> : <ExpandIcon />}
			</BorderlessButton>
			<Title />
			{shown && (
				<>
					<BorderlessButton onClick={() => onFilterToggleClicked()}>
						<FilterIcon />
					</BorderlessButton>
					<BorderlessButton onClick={() => onMiniModeChanged(!miniMode)}>
						{miniMode ? <MaximizeIcon /> : <MinimizeIcon />}
					</BorderlessButton>
				</>
			)}
			<div className="header-external-links">
				{' '}
				<IconLink
					target="_blank"
					href="https://github.com/BrandonXLF/quest-plus"
					rel="noreferrer"
					icon={<GitHubIcon />}
				>
					GitHub
				</IconLink>
			</div>
		</header>
	);
}
