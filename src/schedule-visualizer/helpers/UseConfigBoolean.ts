import { useEffect, useState } from 'react';

export default function useConfigBoolean(name: string, initial: boolean) {
	const [isEnabled, setIsEnabled] = useState<boolean>(initial);

	useEffect(() => {
		(async () => {
			const state = (await chrome.storage.local.get(name))[name] as
				| boolean
				| undefined;

			if (state === undefined) return;

			setIsEnabled(state);
		})();
	}, [name]);

	useEffect(() => {
		chrome.storage.local.set({
			[name]: isEnabled
		});
	}, [name, isEnabled]);

	return [isEnabled, setIsEnabled] as const;
}
