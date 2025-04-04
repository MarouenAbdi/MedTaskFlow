import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import {
	Settings,
	MessageSquare,
	Mic,
	Send,
	Phone,
	Workflow,
	Bot,
	ArrowRight,
	Globe,
	Calendar,
	SquareCode,
} from 'lucide-react';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// Types
interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

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

interface AssistantSettings {
	greeting: string;
	responseTime: number;
	voiceEnabled: boolean;
	notificationsEnabled: boolean;
	autoReply: boolean;
	escalateThreshold: number;
	// New scheduling assistant specific fields
	receptionist: 'none' | 'voiceflow' | 'vapi';
	voiceflowConfig?: {
		projectId: string;
		version: string;
		accessToken: string;
		welcomeMessage: string;
	};
	vapiConfig?: {
		apiKey: string;
		voiceId: string;
		language: string;
		callPreferredTime: string;
		callDuration: number;
		webhook: string;
	};
}

interface AiAssistantDialogProps {
	assistant: Assistant;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AiAssistantDialog({
	assistant,
	open,
	onOpenChange,
}: AiAssistantDialogProps) {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<string>('chat');
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			content: `Hello! I'm ${t(
				`aiAssistants.assistants.${assistant.name}.name`
			)}. How can I help you today?`,
			timestamp: new Date(),
		},
	]);
	const [inputMessage, setInputMessage] = useState('');
	const [isProcessing, setIsProcessing] = useState(false);

	// Form for settings
	const form = useForm<AssistantSettings>({
		defaultValues: {
			greeting: `Hello! I'm ${t(
				`aiAssistants.assistants.${assistant.name}.name`
			)}. How can I help you today?`,
			responseTime: 3,
			voiceEnabled: assistant.capabilities.includes('voice'),
			notificationsEnabled: true,
			autoReply: true,
			escalateThreshold: 7,
			receptionist: 'none',
			voiceflowConfig: {
				projectId: 'vf2342343',
				version: '1.0.0',
				accessToken: 'vf.pt.dXVXVIII9923498FJJJADFSdd',
				welcomeMessage:
					"Hello! I'm your appointment scheduler. How can I help you today?",
			},
			vapiConfig: {
				apiKey: 'vapi_7Gs9JJdsSFjgkl',
				voiceId: 'alloy',
				language: 'en-US',
				callPreferredTime: '09:00-17:00',
				callDuration: 10,
				webhook: 'https://api.medtaskflow.com/webhooks/vapi',
			},
		},
	});

	const sendMessage = () => {
		if (!inputMessage.trim()) return;

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: inputMessage,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputMessage('');
		setIsProcessing(true);

		// Simulate AI response after a short delay
		setTimeout(() => {
			const assistantResponse: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: generateDemoResponse(inputMessage, assistant),
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantResponse]);
			setIsProcessing(false);
		}, 1500);
	};

	// Demo response generator
	const generateDemoResponse = (
		message: string,
		assistant: Assistant
	): string => {
		const lowercaseMessage = message.toLowerCase();

		if (
			lowercaseMessage.includes('appointment') ||
			lowercaseMessage.includes('schedule')
		) {
			return 'I can help you schedule an appointment. What day and time works best for you? Or would you like me to check for the next available slots?';
		} else if (
			lowercaseMessage.includes('pain') ||
			lowercaseMessage.includes('hurt')
		) {
			return "I understand you're experiencing pain. Could you describe where it's located and how severe it is on a scale from 1-10? This will help me provide better assistance or determine if you need immediate medical attention.";
		} else if (
			lowercaseMessage.includes('prescription') ||
			lowercaseMessage.includes('refill')
		) {
			return "I'd be happy to help with prescription refills. Please provide your name, date of birth, and which medication you need refilled. I'll submit the request to your doctor for approval.";
		} else if (
			lowercaseMessage.includes('hello') ||
			lowercaseMessage.includes('hi')
		) {
			return `Hello! I'm ${t(
				`aiAssistants.assistants.${assistant.name}.name`
			)}. How can I assist you with your healthcare needs today?`;
		} else if (lowercaseMessage.includes('thank')) {
			return "You're welcome! Is there anything else I can help you with today?";
		} else {
			return "Thank you for your message. I'm here to help with scheduling appointments, answering medical questions, or connecting you with the right healthcare professional. Could you provide more details about how I can assist you?";
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl h-[80vh] overflow-hidden p-0 flex flex-col">
				<DialogHeader className="px-6 py-4 border-b flex-shrink-0">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<img
								src={t(`aiAssistants.assistants.${assistant.name}.avatar`)}
								alt={t(`aiAssistants.assistants.${assistant.name}.name`)}
								className="object-cover"
							/>
						</Avatar>
						<div>
							<DialogTitle className="text-xl">
								{t(`aiAssistants.assistants.${assistant.name}.name`)}
							</DialogTitle>
							<DialogDescription className="text-sm">
								{t(`aiAssistants.assistants.${assistant.name}.description`)}
							</DialogDescription>
						</div>
						<div className="ml-auto flex gap-2">
							{assistant.capabilities.map((capability) => (
								<Badge
									key={capability}
									variant="outline"
									className="capitalize"
								>
									{t(`aiAssistants.capabilities.${capability}`)}
								</Badge>
							))}
						</div>
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-hidden flex flex-col">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col overflow-hidden"
					>
						<TabsList className="px-6 py-2 border-b justify-start">
							<TabsTrigger value="chat" className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4" />
								{t('aiAssistants.chat')}
							</TabsTrigger>
							<TabsTrigger value="settings" className="flex items-center gap-2">
								<Settings className="h-4 w-4" />
								{t('aiAssistants.settings')}
							</TabsTrigger>
							{assistant.id === 'scheduling-assistant' && (
								<TabsTrigger
									value="receptionist"
									className="flex items-center gap-2"
								>
									<Phone className="h-4 w-4" />
									Receptionist Config
								</TabsTrigger>
							)}
						</TabsList>

						<TabsContent
							value="chat"
							className="flex-1 flex flex-col overflow-hidden p-0 m-0 data-[state=active]:flex-1"
						>
							<ScrollArea className="flex-1 p-4">
								<div className="space-y-4">
									{messages.map((message) => (
										<div
											key={message.id}
											className={`flex ${
												message.role === 'user'
													? 'justify-end'
													: 'justify-start'
											}`}
										>
											<div
												className={`max-w-[80%] rounded-lg p-3 ${
													message.role === 'user'
														? 'bg-primary text-primary-foreground'
														: 'bg-muted'
												}`}
											>
												<p className="whitespace-pre-wrap">{message.content}</p>
												<p
													className={`text-xs mt-1 ${
														message.role === 'user'
															? 'text-primary-foreground/70'
															: 'text-muted-foreground'
													}`}
												>
													{message.timestamp.toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</p>
											</div>
										</div>
									))}
									{isProcessing && (
										<div className="flex justify-start">
											<div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center space-x-2">
												<div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
												<div className="h-2 w-2 rounded-full bg-current animate-pulse delay-100"></div>
												<div className="h-2 w-2 rounded-full bg-current animate-pulse delay-200"></div>
											</div>
										</div>
									)}
								</div>
							</ScrollArea>

							<div className="p-4 border-t flex items-center gap-2">
								<Textarea
									placeholder={t('aiAssistants.typeMessage')}
									value={inputMessage}
									onChange={(e) => setInputMessage(e.target.value)}
									onKeyDown={handleKeyPress}
									className="min-h-10 resize-none"
								/>
								{assistant.capabilities.includes('voice') && (
									<Button
										variant="outline"
										size="icon"
										className="flex-shrink-0"
									>
										<Mic className="h-5 w-5" />
									</Button>
								)}
								<Button
									size="icon"
									className="flex-shrink-0"
									onClick={sendMessage}
									disabled={!inputMessage.trim() || isProcessing}
								>
									<Send className="h-5 w-5" />
								</Button>
							</div>
						</TabsContent>

						<TabsContent
							value="settings"
							className="flex-1 overflow-auto p-0 m-0 data-[state=active]:flex-1"
						>
							<ScrollArea className="h-full p-6">
								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-medium mb-2">
											{t('aiAssistants.generalSettings')}
										</h3>
										<Form {...form}>
											<div className="space-y-4">
												<FormField
													control={form.control}
													name="greeting"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																{t('aiAssistants.greeting')}
															</FormLabel>
															<FormDescription>
																{t('aiAssistants.greetingDescription')}
															</FormDescription>
															<FormControl>
																<Textarea
																	placeholder={t(
																		'aiAssistants.greetingPlaceholder'
																	)}
																	{...field}
																	className="min-h-20"
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<FormField
														control={form.control}
														name="responseTime"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	{t('aiAssistants.responseTime')}
																</FormLabel>
																<FormDescription>
																	{t('aiAssistants.responseTimeDescription')}
																</FormDescription>
																<FormControl>
																	<div className="space-y-4">
																		<Slider
																			min={1}
																			max={10}
																			step={1}
																			value={[field.value]}
																			onValueChange={(value) =>
																				field.onChange(value[0])
																			}
																		/>
																		<div className="flex justify-between text-xs text-muted-foreground">
																			<span>{t('aiAssistants.quicker')}</span>
																			<span>{field.value} sec</span>
																			<span>{t('aiAssistants.detailed')}</span>
																		</div>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="escalateThreshold"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	{t('aiAssistants.escalationThreshold')}
																</FormLabel>
																<FormDescription>
																	{t(
																		'aiAssistants.escalationThresholdDescription'
																	)}
																</FormDescription>
																<FormControl>
																	<div className="space-y-4">
																		<Slider
																			min={1}
																			max={10}
																			step={1}
																			value={[field.value]}
																			onValueChange={(value) =>
																				field.onChange(value[0])
																			}
																		/>
																		<div className="flex justify-between text-xs text-muted-foreground">
																			<span>
																				{t('aiAssistants.escalateEasily')}
																			</span>
																			<span>{field.value}/10</span>
																			<span>
																				{t('aiAssistants.handleMore')}
																			</span>
																		</div>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											<Separator className="my-6" />

											<h3 className="text-lg font-medium mb-4">
												{t('aiAssistants.featureSettings')}
											</h3>
											<div className="space-y-6">
												<div className="grid grid-cols-1 gap-4">
													<FormField
														control={form.control}
														name="voiceEnabled"
														render={({ field }) => (
															<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
																<div className="space-y-0.5">
																	<FormLabel className="text-base">
																		{t('aiAssistants.voiceEnabled')}
																	</FormLabel>
																	<FormDescription>
																		{t('aiAssistants.voiceEnabledDescription')}
																	</FormDescription>
																</div>
																<FormControl>
																	<Switch
																		checked={field.value}
																		onCheckedChange={field.onChange}
																		disabled={
																			!assistant.capabilities.includes('voice')
																		}
																	/>
																</FormControl>
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="notificationsEnabled"
														render={({ field }) => (
															<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
																<div className="space-y-0.5">
																	<FormLabel className="text-base">
																		{t('aiAssistants.notifications')}
																	</FormLabel>
																	<FormDescription>
																		{t('aiAssistants.notificationsDescription')}
																	</FormDescription>
																</div>
																<FormControl>
																	<Switch
																		checked={field.value}
																		onCheckedChange={field.onChange}
																	/>
																</FormControl>
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="autoReply"
														render={({ field }) => (
															<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
																<div className="space-y-0.5">
																	<FormLabel className="text-base">
																		{t('aiAssistants.autoReply')}
																	</FormLabel>
																	<FormDescription>
																		{t('aiAssistants.autoReplyDescription')}
																	</FormDescription>
																</div>
																<FormControl>
																	<Switch
																		checked={field.value}
																		onCheckedChange={field.onChange}
																	/>
																</FormControl>
															</FormItem>
														)}
													/>
												</div>
											</div>

											<Separator className="my-6" />

											<Card className="bg-muted/50 p-4">
												<h3 className="text-base font-medium mb-2">
													{t('aiAssistants.usageStatistics')}
												</h3>
												<div className="grid grid-cols-2 gap-4">
													<div>
														<p className="text-sm text-muted-foreground">
															{t('aiAssistants.totalChats')}
														</p>
														<p className="text-2xl font-semibold">127</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t('aiAssistants.resolvedQueries')}
														</p>
														<p className="text-2xl font-semibold">92%</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t('aiAssistants.appointmentsScheduled')}
														</p>
														<p className="text-2xl font-semibold">43</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t('aiAssistants.responseTime')}
														</p>
														<p className="text-2xl font-semibold">2.4s</p>
													</div>
												</div>
											</Card>
										</Form>
									</div>
								</div>
							</ScrollArea>
						</TabsContent>

						{assistant.id === 'scheduling-assistant' && (
							<TabsContent
								value="receptionist"
								className="flex-1 overflow-auto p-0 m-0 data-[state=active]:flex-1"
							>
								<ScrollArea className="h-full p-6">
									<div className="space-y-6">
										<div>
											<h2 className="text-xl font-semibold mb-4">
												Receptionist Configuration
											</h2>
											<p className="text-sm text-muted-foreground mb-6">
												Configure your AI receptionist to automatically handle
												appointment scheduling through chat or voice calls.
											</p>

											<Form {...form}>
												<FormField
													control={form.control}
													name="receptionist"
													render={({ field }) => (
														<FormItem className="space-y-3 mb-6">
															<FormLabel>Receptionist Type</FormLabel>
															<FormDescription>
																Choose which type of AI agent you want to use as
																your receptionist
															</FormDescription>
															<FormControl>
																<RadioGroup
																	onValueChange={(value) => {
																		field.onChange(
																			value as 'none' | 'voiceflow' | 'vapi'
																		);
																	}}
																	defaultValue={field.value}
																	className="flex flex-col space-y-1"
																>
																	<FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
																		<FormControl>
																			<RadioGroupItem value="none" />
																		</FormControl>
																		<FormLabel className="font-normal cursor-pointer flex items-center gap-2">
																			<Bot className="h-5 w-5 text-muted-foreground" />
																			<div>
																				<div className="font-medium">
																					No Receptionist
																				</div>
																				<span className="text-sm text-muted-foreground">
																					Manually handle all appointment
																					scheduling
																				</span>
																			</div>
																		</FormLabel>
																	</FormItem>
																	<FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
																		<FormControl>
																			<RadioGroupItem value="voiceflow" />
																		</FormControl>
																		<FormLabel className="font-normal cursor-pointer flex items-center gap-2">
																			<MessageSquare className="h-5 w-5 text-blue-500" />
																			<div>
																				<div className="font-medium">
																					Voiceflow Chat Agent
																				</div>
																				<span className="text-sm text-muted-foreground">
																					Conversational AI chat agent for
																					online scheduling
																				</span>
																			</div>
																		</FormLabel>
																	</FormItem>
																	<FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
																		<FormControl>
																			<RadioGroupItem value="vapi" />
																		</FormControl>
																		<FormLabel className="font-normal cursor-pointer flex items-center gap-2">
																			<Phone className="h-5 w-5 text-emerald-500" />
																			<div>
																				<div className="font-medium">
																					VAPI Voice Agent
																				</div>
																				<span className="text-sm text-muted-foreground">
																					Phone-based voice assistant that can
																					make and receive calls
																				</span>
																			</div>
																		</FormLabel>
																	</FormItem>
																</RadioGroup>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												{form.watch('receptionist') === 'voiceflow' && (
													<div className="space-y-4 border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
														<h3 className="text-lg font-medium flex items-center gap-2">
															<SquareCode className="h-5 w-5 text-blue-600" />
															Voiceflow Configuration
														</h3>

														<div className="grid grid-cols-2 gap-4">
															<FormField
																control={form.control}
																name="voiceflowConfig.projectId"
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Project ID</FormLabel>
																		<FormControl>
																			<Input
																				placeholder="vf123456"
																				{...field}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>

															<FormField
																control={form.control}
																name="voiceflowConfig.version"
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Version</FormLabel>
																		<FormControl>
																			<Input
																				placeholder="development"
																				{...field}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>

														<FormField
															control={form.control}
															name="voiceflowConfig.accessToken"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>API Key</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="vf.pt.xxxxxxxxxxxx"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="voiceflowConfig.welcomeMessage"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Welcome Message</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Hello! I'm your scheduling assistant. How can I help you today?"
																			className="min-h-20"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<div className="pt-4">
															<Card className="bg-white p-4 border border-blue-200 shadow-sm">
																<div className="flex items-start gap-4">
																	<div className="rounded-full bg-blue-100 p-3">
																		<Workflow className="h-6 w-6 text-blue-600" />
																	</div>
																	<div>
																		<h4 className="font-medium mb-1">
																			Test Your Voiceflow Agent
																		</h4>
																		<p className="text-sm text-muted-foreground mb-4">
																			Make sure your Voiceflow agent is properly
																			configured by testing it
																		</p>
																		<Button
																			variant="outline"
																			size="sm"
																			className="text-blue-600 border-blue-200"
																		>
																			Open Voiceflow Dashboard
																			<ArrowRight className="ml-2 h-4 w-4" />
																		</Button>
																	</div>
																</div>
															</Card>
														</div>
													</div>
												)}

												{form.watch('receptionist') === 'vapi' && (
													<div className="space-y-4 border rounded-lg p-4 bg-emerald-50/50 dark:bg-emerald-950/20">
														<h3 className="text-lg font-medium flex items-center gap-2">
															<Phone className="h-5 w-5 text-emerald-600" />
															VAPI Voice Agent Configuration
														</h3>

														<FormField
															control={form.control}
															name="vapiConfig.apiKey"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>VAPI API Key</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="vapi_xxxxxxxx"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<div className="grid grid-cols-2 gap-4">
															<FormField
																control={form.control}
																name="vapiConfig.voiceId"
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Voice ID</FormLabel>
																		<Select
																			onValueChange={field.onChange}
																			defaultValue={field.value}
																		>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder="Select a voice" />
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				<SelectItem value="alloy">
																					Alloy - Neutral
																				</SelectItem>
																				<SelectItem value="shimmer">
																					Shimmer - Female
																				</SelectItem>
																				<SelectItem value="nova">
																					Nova - Female
																				</SelectItem>
																				<SelectItem value="echo">
																					Echo - Male
																				</SelectItem>
																				<SelectItem value="fable">
																					Fable - Male
																				</SelectItem>
																			</SelectContent>
																		</Select>
																		<FormMessage />
																	</FormItem>
																)}
															/>

															<FormField
																control={form.control}
																name="vapiConfig.language"
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Language</FormLabel>
																		<Select
																			onValueChange={field.onChange}
																			defaultValue={field.value}
																		>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder="Select a language" />
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				<SelectItem value="en-US">
																					English (US)
																				</SelectItem>
																				<SelectItem value="en-GB">
																					English (UK)
																				</SelectItem>
																				<SelectItem value="es-ES">
																					Spanish
																				</SelectItem>
																				<SelectItem value="fr-FR">
																					French
																				</SelectItem>
																				<SelectItem value="de-DE">
																					German
																				</SelectItem>
																			</SelectContent>
																		</Select>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>

														<div className="grid grid-cols-2 gap-4">
															<FormField
																control={form.control}
																name="vapiConfig.callPreferredTime"
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Call Hours</FormLabel>
																		<FormControl>
																			<Input
																				placeholder="09:00-17:00"
																				{...field}
																			/>
																		</FormControl>
																		<FormDescription>
																			Time range when the agent can make calls
																		</FormDescription>
																		<FormMessage />
																	</FormItem>
																)}
															/>

															<FormField
																control={form.control}
																name="vapiConfig.callDuration"
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>
																			Max Call Duration (min)
																		</FormLabel>
																		<FormControl>
																			<Input
																				type="number"
																				min={1}
																				max={30}
																				placeholder="10"
																				{...field}
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>

														<FormField
															control={form.control}
															name="vapiConfig.webhook"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Webhook URL</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="https://your-api.com/webhooks/vapi"
																			{...field}
																		/>
																	</FormControl>
																	<FormDescription>
																		Where VAPI will send call events and
																		transcripts
																	</FormDescription>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<div className="pt-4">
															<Card className="grid sm:grid-cols-2 gap-4 bg-white p-4 border border-emerald-200 shadow-sm">
																<div className="flex items-start gap-4">
																	<div className="rounded-full bg-emerald-100 p-3">
																		<Phone className="h-6 w-6 text-emerald-600" />
																	</div>
																	<div>
																		<h4 className="font-medium mb-1">
																			Make Test Call
																		</h4>
																		<p className="text-sm text-muted-foreground mb-4">
																			Test your voice agent by making a call
																		</p>
																		<Button
																			variant="outline"
																			size="sm"
																			className="text-emerald-600 border-emerald-200"
																		>
																			Test Outbound Call
																		</Button>
																	</div>
																</div>

																<div className="flex items-start gap-4">
																	<div className="rounded-full bg-emerald-100 p-3">
																		<Globe className="h-6 w-6 text-emerald-600" />
																	</div>
																	<div>
																		<h4 className="font-medium mb-1">
																			Get Phone Number
																		</h4>
																		<p className="text-sm text-muted-foreground mb-4">
																			Set up a dedicated phone number
																		</p>
																		<Button
																			variant="outline"
																			size="sm"
																			className="text-emerald-600 border-emerald-200"
																		>
																			Configure Number
																		</Button>
																	</div>
																</div>
															</Card>
														</div>
													</div>
												)}

												{form.watch('receptionist') !== 'none' && (
													<div className="mt-6 space-y-4">
														<h3 className="text-lg font-medium flex items-center gap-2">
															<Calendar className="h-5 w-5" />
															Schedule Integration
														</h3>

														<Card className="p-4">
															<div className="flex items-start gap-4">
																<div className="rounded-full bg-gray-100 p-3">
																	<Calendar className="h-6 w-6" />
																</div>
																<div>
																	<h4 className="font-medium mb-1">
																		Connect Calendar
																	</h4>
																	<p className="text-sm text-muted-foreground mb-4">
																		Connect your calendar so the AI can check
																		availability and schedule appointments
																	</p>
																	<div className="grid grid-cols-2 gap-4">
																		<FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3">
																			<div className="space-y-0.5">
																				<FormLabel className="text-base">
																					Google Calendar
																				</FormLabel>
																			</div>
																			<Switch
																				checked={true}
																				onCheckedChange={() => {}}
																			/>
																		</FormItem>
																		<FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3">
																			<div className="space-y-0.5">
																				<FormLabel className="text-base">
																					Outlook Calendar
																				</FormLabel>
																			</div>
																			<Switch
																				checked={false}
																				onCheckedChange={() => {}}
																			/>
																		</FormItem>
																	</div>
																</div>
															</div>
														</Card>
													</div>
												)}
											</Form>
										</div>
									</div>
								</ScrollArea>
							</TabsContent>
						)}
					</Tabs>
				</div>

				<DialogFooter className="px-6 py-4 border-t">
					<div className="flex justify-between items-center w-full">
						<div className="text-sm text-muted-foreground">
							{t('aiAssistants.pricingInfo', {
								price: assistant.price.toFixed(2),
							})}
						</div>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => onOpenChange(false)}>
								{t('common.close')}
							</Button>
							<Button
								onClick={() => {
									form.handleSubmit((data) => {
										console.log('Settings saved:', data);
										onOpenChange(false);
									})();
								}}
							>
								{t('common.save')}
							</Button>
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
