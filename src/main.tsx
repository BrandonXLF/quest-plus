import initFlowLinks from './flow-links/initFlowLinks.ts';
import initScheduleVisualizer from './schedule-visualizer/initScheduleVisualizer.tsx';
import './index.css';

function onPageLoaded() {
	initFlowLinks();
	initScheduleVisualizer();
}

const observer = new MutationObserver(onPageLoaded);

observer.observe(document.getElementById('win0divPAGECONTAINER')!, {
	childList: true
});

onPageLoaded();
