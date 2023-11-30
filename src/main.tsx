import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import { addFlowLinks } from './addFlowLinks.ts';

function onPageLoaded() {
	addFlowLinks();

	document.getElementById('wisp-timetable-root')?.remove();

	const cnt = document.querySelector('[id*="STDNT_ENRL_SSV2"], [id*="DERIVED_REGFRM1_GROUP6"]');
	
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

const observer = new MutationObserver(onPageLoaded);

observer.observe(document.getElementById('win0divPAGECONTAINER')!, {
	childList: true
});

onPageLoaded();
