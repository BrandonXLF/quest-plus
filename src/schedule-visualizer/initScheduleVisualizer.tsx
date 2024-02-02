import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

export default function initScheduleVisualizer() {
	if (document.getElementById('wisp-timetable-root')) return;

	const cnt = document.querySelector(
		'[id*="STDNT_ENRL_SSV2"], [id*="DERIVED_REGFRM1_GROUP6"]'
	);

	if (!cnt) return;

	const root = document.createElement('div');
	root.id = 'wisp-timetable-root';

	cnt?.prepend(root);
	cnt.closest('td')!.style.width = '100%';

	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
