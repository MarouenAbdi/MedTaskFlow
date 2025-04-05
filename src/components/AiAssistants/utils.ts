import { AssistantCapability } from './types';
import { MessageSquare, Mic, PhoneCall, Brain, Filter } from 'lucide-react';

export const getCapabilityIcon = (capability: AssistantCapability) => {
	switch (capability) {
		case 'chat':
			return MessageSquare;
		case 'voice':
			return Mic;
		case 'appointments':
			return PhoneCall;
		case 'medical':
			return Brain;
		case 'administrative':
			return Filter;
	}
};

export const getCapabilityLabel = (
	capability: AssistantCapability,
	t: (key: string) => string
) => {
	switch (capability) {
		case 'chat':
			return t('aiAssistants.capabilities.chat');
		case 'voice':
			return t('aiAssistants.capabilities.voice');
		case 'appointments':
			return t('aiAssistants.capabilities.appointments');
		case 'medical':
			return t('aiAssistants.capabilities.medical');
		case 'administrative':
			return t('aiAssistants.capabilities.administrative');
	}
};
