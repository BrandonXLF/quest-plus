import AsyncContent from './AsyncContent';
import Class from '../data/Class';

export default function ClassToggle({
	hidden,
	classInfo,
	onHiddenChanged
}: Readonly<{
	hidden: boolean;
	classInfo: Class;
	onHiddenChanged: (hidden: boolean) => void;
}>) {
	return (
		<div>
			<label>
				<input
					type="checkbox"
					checked={!hidden}
					onInput={() => onHiddenChanged(!hidden)}
				/>
				{classInfo.identifier}
				<AsyncContent
					load={async () => ` ${await classInfo.getType()}`}
					deps={[classInfo]}
				/>
			</label>
		</div>
	);
}
