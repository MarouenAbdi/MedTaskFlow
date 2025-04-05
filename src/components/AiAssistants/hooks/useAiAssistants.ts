import { useState, useMemo } from 'react';
import { Assistant, UseAiAssistantsReturn } from '../types';

// Sample data
const assistants: Assistant[] = [
	{
		id: 'medical-assistant',
		name: 'medicalAssistant',
		description: 'description',
		capabilities: ['chat', 'medical'],
		price: 29.99,
		image: '/assets/avatars/medical-assistant.svg',
		available: true,
	},
	{
		id: 'scheduling-assistant',
		name: 'schedulingAssistant',
		description: 'description',
		capabilities: ['chat', 'appointments', 'administrative'],
		price: 19.99,
		image: '/assets/avatars/scheduling-assistant.svg',
		available: true,
		active: true,
	},
	{
		id: 'administrative-assistant',
		name: 'administrativeAssistant',
		description: 'description',
		capabilities: ['chat', 'administrative'],
		price: 24.99,
		image: '/assets/avatars/administrative-assistant.svg',
		available: true,
	},
	{
		id: 'patient-support-assistant',
		name: 'patientSupportAssistant',
		description: 'description',
		capabilities: ['chat', 'voice', 'medical'],
		price: 34.99,
		image: '/assets/avatars/patient-support-assistant.svg',
		available: true,
	},
];

export function useAiAssistants(): UseAiAssistantsReturn {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
		null
	);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [activeAssistants, setActiveAssistants] = useState<string[]>(
		assistants.filter((a) => a.active).map((a) => a.id)
	);

	const toggleAssistant = (assistantId: string) => {
		setActiveAssistants((prev) =>
			prev.includes(assistantId)
				? prev.filter((id) => id !== assistantId)
				: [...prev, assistantId]
		);
	};

	const handleConfigureAssistant = (assistant: Assistant) => {
		setSelectedAssistant(assistant);
		setDialogOpen(true);
	};

	const switchToAvailableTab = () => {
		const availableTab = document.querySelector(
			'[data-value="available"]'
		) as HTMLElement;
		if (availableTab) {
			availableTab.click();
		}
	};

	// Filter assistants based on search query
	const filteredAssistants = useMemo(() => {
		return assistants.filter(
			(assistant) =>
				assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				assistant.description.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [searchQuery]);

	// Separate active and available assistants
	const myActiveAssistants = useMemo(() => {
		return filteredAssistants.filter((assistant) =>
			activeAssistants.includes(assistant.id)
		);
	}, [filteredAssistants, activeAssistants]);

	const availableAssistants = useMemo(() => {
		return filteredAssistants.filter(
			(assistant) =>
				assistant.available && !activeAssistants.includes(assistant.id)
		);
	}, [filteredAssistants, activeAssistants]);

	return {
		assistants,
		activeAssistants,
		filteredAssistants,
		myActiveAssistants,
		availableAssistants,
		searchQuery,
		selectedAssistant,
		dialogOpen,
		setSearchQuery,
		toggleAssistant,
		handleConfigureAssistant,
		setDialogOpen,
		switchToAvailableTab,
	};
}
