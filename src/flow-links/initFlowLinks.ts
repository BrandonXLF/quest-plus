import getInstructorUWFlow from '../common/getInstructorUWFlow';

const courseCodeRegex = /^([A-Z]+)\s+([A-Z0-9]+).*/;

function makeLinkModifier(func: (el: HTMLElement, text: string) => void) {
	return (el: HTMLElement) => {
		if (el.dataset.questPlusProcessed) return;

		if (!el.dataset.questPlusInnerText) {
			// Used by other Quest+ tools
			el.dataset.questPlusInnerText = el.innerText;
		}

		const text = el.dataset.questPlusInnerText.trim();

		func(el, text);

		el.dataset.questPlusProcessed = 'true';
	};
}

function createUWFlowLink(prefix: string, target: string, text: string) {
	const link = document.createElement('a');

	link.href = 'https://uwflow.com' + prefix + encodeURIComponent(target);
	link.textContent = '\u25C9 ' + text;
	link.className = 'PSHYPERLINK';
	link.target = 'quest-plus-uw-flow';
	link.style.color = 'rgb(0, 82, 204)';

	return link;
}

const insertCourseLink = makeLinkModifier((el: HTMLElement, text: string) => {
	const parts = courseCodeRegex.exec(text);

	el.replaceChildren(
		createUWFlowLink('/course/', (parts![1] + parts![2]).toLowerCase(), text)
	);
});

const prependCourseLink = makeLinkModifier((el: HTMLElement, text: string) => {
	const parts = courseCodeRegex.exec(text);

	el.replaceChildren(
		'(',
		createUWFlowLink(
			'/course/',
			(parts![1] + parts![2]).toLowerCase(),
			parts![1] + ' ' + parts![2]
		),
		') ',
		text
	);
});

const insertInstructorLink = makeLinkModifier(
	(el: HTMLElement, names: string) => {
		const links = names.split(',').flatMap((rawName, i) => {
			const name = rawName.trim();
			const url = getInstructorUWFlow(name);
			const show = url ? createUWFlowLink(url, '', name) : name;

			if (i > 0) return [', ', show];

			return [show];
		});

		el.replaceChildren(...links);

		el.dataset.questPlusProcessed = 'true';
	}
);

const onSelectChange = (el: HTMLSelectElement) => {
	el.parentElement
		?.querySelectorAll<HTMLElement>('.quest-plus-select-link')
		.forEach(el => el.remove());

	const text = el.selectedOptions[0]?.textContent?.trim();
	if (!text) return;

	const parts = courseCodeRegex.exec(text);

	const linkHolder = document.createElement('div');
	linkHolder.className = 'quest-plus-select-link';
	linkHolder.append(
		'(',
		createUWFlowLink(
			'/course/',
			(parts![1] + parts![2]).toLowerCase(),
			parts![1] + ' ' + parts![2]
		),
		')'
	);

	el.parentElement?.append(linkHolder);
};

const addLinkBelow = (el: HTMLSelectElement) => {
	el.addEventListener('change', () => onSelectChange(el));
	onSelectChange(el);
};

export default function initFlowLinks() {
	[
		...document.querySelectorAll<HTMLElement>(
			'[id*="SSR_CLSRSLT_WRK_GROUPBOX2GP"], [id*="DERIVED_REGFRM1_DESCR20"] .PAGROUPDIVIDER, [id*="DERIVED_CLS_DTL_DESCR50"]'
		)
	].forEach(insertCourseLink);

	[
		...document.querySelectorAll<HTMLElement>(
			'[id*="E_CLASS_NAME"], [id*="R_CLASS_NAME"]'
		)
	].forEach(prependCourseLink);

	[
		...document.querySelectorAll<HTMLElement>(
			'[id*="MTG_INSTR"], [id*="DERIVED_CLS_DTL_SSR_INSTR_LONG"], [id*="DERIVED_REGFRM1_SSR_INSTR_LONG"]'
		)
	].forEach(insertInstructorLink);

	[
		...document.querySelectorAll<HTMLSelectElement>(
			'select[id*="DERIVED_REGFRM1_SSR_CLASSNAME"], select[id*="DERIVED_REGFRM1_DESCR"]'
		)
	].forEach(addLinkBelow);
}
