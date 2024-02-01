import './Title.css';

export default function Title() {
	const src = chrome.runtime.getURL('assets/logo.png');

	return (
		<hgroup className="top-area">
			<img src={src} />
			<h2>WISP</h2>
		</hgroup>
	);
}
