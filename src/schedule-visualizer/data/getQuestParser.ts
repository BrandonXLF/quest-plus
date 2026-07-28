import CartParser from './CartParser';
import QuestParser from './QuestParser';
import ScheduleParser from './ScheduleParser';

export default function getQuestParser(): QuestParser | undefined {
	if (document.getElementById('SSR_SSENRL_LIST')) return new ScheduleParser();
	if (document.querySelector('[id*="DERIVED_REGFRM1_GROUP6"]')) return new CartParser();
}
