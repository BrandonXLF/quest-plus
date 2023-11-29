import { ReactElement, useEffect, useState } from 'react';

export default function AsyncContent({
	load,
	deps = [],
	indicator = '...'
}: {
	load: () => Promise<ReactElement | string>;
	deps?: React.DependencyList;
	indicator?: string;
}) {
	const [output, setOutput] = useState<ReactElement | string>();

	useEffect(() => {
		(async () => setOutput(await load()))();
	}, deps);

	return output ?? indicator;
}
