import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Bot,
	MessageSquare,
	PhoneCall,
	Check,
	Plus,
	Brain,
	Sparkles,
	Mic,
	Filter,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Removed unused @ts-expect-error directive
import { AiAssistantDialog } from '@/components/modals/ai-assistant-dialog';

// Assistant types
type AssistantCapability =
	| 'chat'
	| 'voice'
	| 'appointments'
	| 'medical'
	| 'administrative';

interface Assistant {
	id: string;
	name: string;
	description: string;
	capabilities: AssistantCapability[];
	price: number;
	image: string;
	available: boolean;
	active?: boolean;
}

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

// Helper functions
const getCapabilityIcon = (capability: AssistantCapability) => {
	switch (capability) {
		case 'chat':
			return <MessageSquare className="h-4 w-4" />;
		case 'voice':
			return <Mic className="h-4 w-4" />;
		case 'appointments':
			return <PhoneCall className="h-4 w-4" />;
		case 'medical':
			return <Brain className="h-4 w-4" />;
		case 'administrative':
			return <Filter className="h-4 w-4" />;
	}
};

const getCapabilityLabel = (
	capability: AssistantCapability,
	t: ReturnType<typeof useTranslation>['t']
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

export function AiAssistants() {
	const { t } = useTranslation();
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
	const filteredAssistants = assistants.filter(
		(assistant) =>
			assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			assistant.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Separate active and available assistants
	const myActiveAssistants = filteredAssistants.filter((assistant) =>
		activeAssistants.includes(assistant.id)
	);

	const availableAssistants = filteredAssistants.filter(
		(assistant) =>
			assistant.available && !activeAssistants.includes(assistant.id)
	);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-start">
				<div className="flex items-start gap-4">
					<Avatar className="h-12 w-12 mt-1">
						<AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/20">
							<Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-3xl font-bold tracking-tight">
							{t('nav.aiAssistants')}
						</h2>
						<p className="text-muted-foreground">
							{t('aiAssistants.description')}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex w-full max-w-sm items-center space-x-2">
						<Input
							type="search"
							placeholder={t('common.search')}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Tabs defaultValue="active" className="space-y-4">
				<TabsList>
					<TabsTrigger value="active">
						<Bot className="h-4 w-4 mr-2" />
						{t('aiAssistants.myAssistants')}
					</TabsTrigger>
					<TabsTrigger value="available">
						<Sparkles className="h-4 w-4 mr-2" />
						{t('aiAssistants.availableAssistants')}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="active" className="space-y-4">
					{myActiveAssistants.length === 0 ? (
						<div className="text-center py-10">
							<Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium">
								{t('aiAssistants.noActiveAssistants')}
							</h3>
							<p className="text-muted-foreground mb-4">
								{t('aiAssistants.activateFromAvailable')}
							</p>
							<Button onClick={switchToAvailableTab}>
								{t('aiAssistants.browseAssistants')}
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{myActiveAssistants.map((assistant) => (
								<Card
									key={assistant.id}
									className="overflow-hidden border-2 border-primary/50"
								>
									<CardHeader className="pb-2">
										<div className="flex justify-between items-start">
											<div className="flex gap-3">
												<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
													<img
														src={t(
															`aiAssistants.assistants.${assistant.name}.avatar`
														)}
														alt={t(
															`aiAssistants.assistants.${assistant.name}.name`
														)}
														className="w-full h-full object-cover"
													/>
												</div>
												<div>
													<CardTitle>
														{t(
															`aiAssistants.assistants.${assistant.name}.name`
														)}
													</CardTitle>
													<CardDescription className="line-clamp-2 mt-1">
														{t(
															`aiAssistants.assistants.${assistant.name}.description`
														)}
													</CardDescription>
												</div>
											</div>
											<Switch
												checked={activeAssistants.includes(assistant.id)}
												onCheckedChange={() => toggleAssistant(assistant.id)}
											/>
										</div>
									</CardHeader>
									<CardContent className="pb-2">
										<div className="flex flex-wrap gap-2 mb-2">
											{assistant.capabilities.map((capability) => (
												<Badge
													key={capability}
													variant="outline"
													className="flex items-center gap-1"
												>
													{getCapabilityIcon(capability)}
													{getCapabilityLabel(capability, t)}
												</Badge>
											))}
										</div>
									</CardContent>
									<CardFooter className="flex justify-between items-center border-t pt-4">
										<span className="text-sm text-muted-foreground">
											{t('aiAssistants.pricingInfo', {
												price: assistant.price.toFixed(2),
											})}
										</span>
										<Button
											size="sm"
											onClick={() => handleConfigureAssistant(assistant)}
										>
											{t('aiAssistants.configure')}
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="available" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{availableAssistants.map((assistant) => (
							<Card key={assistant.id} className="overflow-hidden">
								<CardHeader className="pb-2">
									<div className="flex justify-between items-start">
										<div className="flex gap-3">
											<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
												<img
													src={t(
														`aiAssistants.assistants.${assistant.name}.avatar`
													)}
													alt={t(
														`aiAssistants.assistants.${assistant.name}.name`
													)}
													className="w-full h-full object-cover"
												/>
											</div>
											<div>
												<CardTitle>
													{t(`aiAssistants.assistants.${assistant.name}.name`)}
												</CardTitle>
												<CardDescription className="line-clamp-2 mt-1">
													{t(
														`aiAssistants.assistants.${assistant.name}.description`
													)}
												</CardDescription>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="flex flex-wrap gap-2 mb-2">
										{assistant.capabilities.map((capability) => (
											<Badge
												key={capability}
												variant="outline"
												className="flex items-center gap-1"
											>
												{getCapabilityIcon(capability)}
												{getCapabilityLabel(capability, t)}
											</Badge>
										))}
									</div>
								</CardContent>
								<CardFooter className="flex justify-between items-center border-t pt-4">
									<span className="text-sm text-muted-foreground">
										{t('aiAssistants.pricingInfo', {
											price: assistant.price.toFixed(2),
										})}
									</span>
									<Button
										size="sm"
										variant={
											activeAssistants.includes(assistant.id)
												? 'outline'
												: 'default'
										}
										onClick={() => toggleAssistant(assistant.id)}
									>
										{activeAssistants.includes(assistant.id) ? (
											<>
												<Check className="h-4 w-4 mr-2" />
												{t('aiAssistants.activated')}
											</>
										) : (
											<>
												<Plus className="h-4 w-4 mr-2" />
												{t('aiAssistants.activate')}
											</>
										)}
									</Button>
								</CardFooter>
							</Card>
						))}

						{!availableAssistants.length && (
							<div className="text-center py-10 col-span-3">
								<Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium">
									{t('aiAssistants.noAvailableAssistants')}
								</h3>
								<p className="text-muted-foreground">
									{t('aiAssistants.checkBackLater')}
								</p>
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>

			{selectedAssistant && (
				<AiAssistantDialog
					assistant={selectedAssistant}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
				/>
			)}
		</div>
	);
}
