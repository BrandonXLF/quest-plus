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
