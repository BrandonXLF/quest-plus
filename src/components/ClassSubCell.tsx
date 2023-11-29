import { useEffect, useState } from 'react';
import './ClassSubCell.css';
import ClassSlot from '../data/ClassSlot';
import CollapseIcon from '../icons/CollapseIcon';
import ExpandIcon from '../icons/ExpandIcon';
import BorderlessButton from './BorderlessButton';
import OverlapIcon from '../icons/OverlapIcon';
import UWFlowLink from './UWFlowLink';
import AsyncContent from './AsyncContent';
import CartIcon from '../icons/CartIcon';

export default function ClassSubCell({
	classSlot,
	expandable,
	siblings = []
}: Readonly<{
	classSlot: ClassSlot;
	expandable?: boolean;
	siblings?: ClassSlot[];
}>) {
	const [expanded, setExpanded] = useState(false);
	const [overlaps, setOverlaps] = useState(false);

	useEffect(() => {
		(async () => {
			const dates = [];

			for (const sibling of siblings) {
				if (sibling === classSlot) continue;

				dates.push(await sibling.dates);
			}

			const thisDates = await classSlot.dates;

			setOverlaps(
				dates.some(
					datePair =>
						thisDates.end >= datePair.start && thisDates.start <= datePair.end
				)
			);
		})();
	}, [classSlot, siblings]);

	return (
		<>
			<div className="slot-top">
				{overlaps && (
					<>
						<OverlapIcon />{' '}
					</>
				)}
				{classSlot.classInfo.cart && (
					<>
						<CartIcon />{' '}
					</>
				)}
				<UWFlowLink
					path={`/course/${classSlot.classInfo.code
						.toLowerCase()
						.replace(/ /g, '')}`}
				>
					{classSlot.classInfo.code}
				</UWFlowLink>{' '}
				<span>{classSlot.classInfo.section}</span>{' '}
				<span>
					{
						<AsyncContent
							load={() => classSlot.classInfo.getType()}
							deps={[classSlot.classInfo]}
						/>
					}
				</span>{' '}
				<span>({classSlot.classInfo.classNumber})</span>
				{expandable && (
					<>
						{' '}
						<BorderlessButton onClick={() => setExpanded(!expanded)}>
							{expanded ? <CollapseIcon /> : <ExpandIcon />}
						</BorderlessButton>
					</>
				)}
			</div>
			{(!expandable || expanded) && (
				<div className="expanded-content">
					<div>
						<span>{classSlot.room}</span>{' '}
						<UWFlowLink path={classSlot.classInfo.instructorLink}>
							{classSlot.classInfo.instructorLast}
						</UWFlowLink>{' '}
						<span>
							<AsyncContent
								load={() => classSlot.classInfo.getEnrolledString()}
								deps={[classSlot.classInfo]}
							/>
						</span>
					</div>
					<div>
						<span>{classSlot.timeStr}</span>{' '}
						<span>
							{' '}
							<AsyncContent
								load={() => classSlot.getDateStr()}
								deps={[classSlot]}
							/>
						</span>
					</div>
				</div>
			)}
		</>
	);
}
