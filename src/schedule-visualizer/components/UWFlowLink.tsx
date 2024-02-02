import UWFlowIcon from '../icons/UWFlowIcon';
import IconLink from './IconLink';

export default function UWFlowLink({
	path,
	children
}: Readonly<{
	path?: string;
	children?: React.ReactNode;
}>) {
	if (!children) return;

	return (
		<IconLink
			target="quest-plus-uw-flow"
			href={`https://uwflow.com${path}`}
			onClick={e => e.stopPropagation()}
			icon={<UWFlowIcon />}
		>
			{children}
		</IconLink>
	);
}
