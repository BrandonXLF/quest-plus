import './ClassToggleList.css';
import Class from '../data/Class';
import ClassToggle from './ClassToggle';

export default function ClassToggleList({
	classes,
	hiddenClasses,
	onHiddenClassesChanged
}: Readonly<{
	classes: Class[];
	hiddenClasses: Record<string, boolean>;
	onHiddenClassesChanged: (changes: Record<string, boolean>) => void;
}>) {
	return (
		<div className="planner-toggles-container">
			<div className="planner-toggles">
				{classes.map(classInfo => (
					<ClassToggle
						key={classInfo.identifier}
						classInfo={classInfo}
						hidden={hiddenClasses[classInfo.identifier] === true}
						onHiddenChanged={hidden =>
							onHiddenClassesChanged({
								[classInfo.identifier]: hidden
							})
						}
					/>
				))}
			</div>
		</div>
	);
}
