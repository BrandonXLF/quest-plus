import './ClassToggle.css';
import AsyncContent from './AsyncContent';
import Class from '../data/Class';
import CartIcon from '../icons/CartIcon';

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
			<label className="schedule-class-toggle">
				<input
					type="checkbox"
					checked={!hidden}
					onInput={() => onHiddenChanged(!hidden)}
				/>
				{classInfo.cart && (
					<>
						<CartIcon />{' '}
					</>
				)}
				<span>{classInfo.identifier}</span>
				<span>
					<AsyncContent
						load={async () => ` ${await classInfo.getType()}`}
						deps={[classInfo]}
					/>
				</span>
			</label>
		</div>
	);
}
