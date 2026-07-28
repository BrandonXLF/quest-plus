{
	const old_showhide = (
		window as unknown as {
			showhide: () => void;
		}
	).showhide;

	(
		window as unknown as {
			showhide: () => void;
		}
	).showhide = function (...args) {
		old_showhide(...args);
		window.dispatchEvent(new Event('quest-plus-page-nav'));
	};
}

{
	const scheduleToggle = document.querySelector<HTMLAnchorElement>('a[id*="DERIVED_REGFRM1_GROUP6"]');

	if (scheduleToggle?.getAttribute('aria-expanded') === 'false') {
		scheduleToggle.click();
	}
}
