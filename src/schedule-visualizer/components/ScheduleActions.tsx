import './ScheduleActions.css';
import MaximizeIcon from '../icons/MaximizeIcon';
import MinimizeIcon from '../icons/MinimizeIcon';
import BorderlessButton from './BorderlessButton';
import IconLink from './IconLink';
import GitHubIcon from '../icons/GitHubIcon';
import CollapseIcon from '../icons/CollapseIcon';
import ExpandIcon from '../icons/ExpandIcon';
import Title from './Title';

export default function ScheduleActions({
	shown,
	onShownChanged,
	miniMode,
	onMiniModeChanged
}: Readonly<{
	shown: boolean;
	onShownChanged: (shown: boolean) => void;
	miniMode: boolean;
	onMiniModeChanged: (miniMode: boolean) => void;
}>) {
	return (
		<header className="schedule-planner-header">
			<BorderlessButton onClick={() => onShownChanged(!shown)}>
				{shown ? <CollapseIcon /> : <ExpandIcon />}
			</BorderlessButton>
			<Title />
			{shown && (
				<BorderlessButton onClick={() => onMiniModeChanged(!miniMode)}>
					{miniMode ? <MaximizeIcon /> : <MinimizeIcon />}
				</BorderlessButton>
			)}
			<div>
				Created by{' '}
				<a
					target="_blank"
					href="https://www.brandonfowler.me/"
					rel="noreferrer"
				>
					Brandon Fowler
				</a>
			</div>
			<div>
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
