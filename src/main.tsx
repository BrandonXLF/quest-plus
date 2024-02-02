import initFlowLinks from './flow-links/initFlowLinks.ts';
import initScheduleVisualizer from './schedule-visualizer/initScheduleVisualizer.tsx';
import './index.css';

function onPageLoaded() {
	initFlowLinks();
	initScheduleVisualizer();
}

onPageLoaded();
window.addEventListener('quest-plus-page-nav', () => onPageLoaded());

const s = document.createElement('script');
s.defer = true;
s.src = chrome.runtime.getURL('assets/inject.js');

document.head.append(s);
