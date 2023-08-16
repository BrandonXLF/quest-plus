import UWFlowIcon from '../icons/UWFlowIcon';
import IconLink from './IconLink';

export default function UWFlowLink({
	path,
	children
}: {
	path?: string;
	children?: React.ReactNode;
}) {
	if (!children) return;

	return (
		<IconLink
			target="uw-flow"
			href={`https://uwflow.com${path}`}
			onClick={e => e.stopPropagation()}
			icon={<UWFlowIcon />}
		>
			{children}
		</IconLink>
	);
}
