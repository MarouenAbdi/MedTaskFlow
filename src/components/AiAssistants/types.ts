export type AssistantCapability =
	| 'chat'
	| 'voice'
	| 'appointments'
	| 'medical'
	| 'administrative';

export interface Assistant {
	id: string;
	name: string;
	description: string;
	capabilities: AssistantCapability[];
	price: number;
	image: string;
	available: boolean;
	active?: boolean;
}

export interface UseAiAssistantsReturn {
	assistants: Assistant[];
	activeAssistants: string[];
	filteredAssistants: Assistant[];
	myActiveAssistants: Assistant[];
	availableAssistants: Assistant[];
	searchQuery: string;
	selectedAssistant: Assistant | null;
	dialogOpen: boolean;
	setSearchQuery: (query: string) => void;
	toggleAssistant: (assistantId: string) => void;
	handleConfigureAssistant: (assistant: Assistant) => void;
	setDialogOpen: (open: boolean) => void;
	switchToAvailableTab: () => void;
}
