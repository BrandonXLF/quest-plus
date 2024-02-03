import './ClassToggle.css';
import AsyncContent from './AsyncContent';
import Class from '../data/Class';

export default function ClassToggle({
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
				{classes.map(classInfo => {
					const identifier = classInfo.identifier;
					const hidden = hiddenClasses[identifier] === true;

					return (
						<div key={identifier}>
							<label>
								<input
									type="checkbox"
									checked={!hidden}
									onInput={() =>
										onHiddenClassesChanged({
											[identifier]: !hidden
										})
									}
								/>
								{identifier}
								<AsyncContent
									load={async () => ` ${await classInfo.getType()}`}
									deps={[classInfo]}
								/>
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}
