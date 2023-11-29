export default abstract class UWParser {
	private domParser = new DOMParser();

	protected async fetchTableRows(
		path: string,
		tableNumbers: number
	): Promise<HTMLTableRowElement[]>;
	protected async fetchTableRows(
		path: string,
		tableNumbers: number[]
	): Promise<HTMLTableRowElement[][]>;
	protected async fetchTableRows(
		path: string,
		tableNumbers: number | number[]
	) {
		const res = await fetch(
			`https://www.brandonfowler.me/wisp/uw-classes/?path=${encodeURIComponent(
				path
			)}`
		);

		if (!res.ok) throw new TypeError(res.statusText);

		if (!Array.isArray(tableNumbers)) tableNumbers = [tableNumbers];

		const doc = this.domParser.parseFromString(await res.text(), 'text/html');
		const tableCollection = doc.getElementsByTagName('table');

		const tables = tableNumbers.map(tableNumber => {
			const rows = tableCollection[tableNumber]?.rows;

			return rows ? [...rows] : [];
		});

		return tables.length === 1 ? tables[0] : tables;
	}

	protected getCellContents(row: HTMLTableRowElement, index: number) {
		return row.cells[index]?.innerText.trim().replace(/ +/g, ' ') ?? '';
	}
}
