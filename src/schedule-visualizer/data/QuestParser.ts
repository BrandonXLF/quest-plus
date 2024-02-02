import Class from './Class';

export default abstract class QuestParser {
	protected getElementContents(el?: HTMLElement | null) {
		if (!el) return '';

		const text =
			'questPlusInnerText' in el.dataset
				? el.dataset.questPlusInnerText!
				: el.innerText;

		return text.trim().replace(/ +/g, ' ');
	}

	protected getChildContents(row: HTMLTableRowElement, idPart: string) {
		return this.getElementContents(
			row.querySelector<HTMLElement>(`[id*="${idPart}"]`)
		);
	}

	public abstract parse(): Class[];
}
