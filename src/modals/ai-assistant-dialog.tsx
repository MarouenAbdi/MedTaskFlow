import { useEffect } from 'react';
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
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Settings, Phone, Bot, ArrowRight, Calendar, Save } from 'lucide-react';
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
import { useForm, UseFormReturn } from 'react-hook-form';
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
import { toast } from 'sonner';

// Types
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

interface VapiConfigFormProps {
	form: UseFormReturn<AssistantSettings>;
}

const VapiConfigForm: React.FC<VapiConfigFormProps> = ({ form }) => (
	<Card className="mt-4">
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<Phone className="h-5 w-5" /> VAPI Voice Agent Configuration
			</CardTitle>
			<CardDescription>
				Configure the settings for the VAPI-based voice receptionist.
			</CardDescription>
		</CardHeader>
		<CardContent className="space-y-4">
			<FormField
				control={form.control}
				name="vapiConfig.apiKey"
				render={({ field }) => (
					<FormItem>
						<FormLabel>API Key</FormLabel>
						<FormControl>
							<Input placeholder="Enter VAPI API Key" {...field} />
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
							<FormLabel>Voice</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select voice" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="alloy">Alloy</SelectItem>
									<SelectItem value="echo">Echo</SelectItem>
									<SelectItem value="fable">Fable</SelectItem>
									<SelectItem value="onyx">Onyx</SelectItem>
									<SelectItem value="nova">Nova</SelectItem>
									<SelectItem value="shimmer">Shimmer</SelectItem>
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select language" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="en-US">English (US)</SelectItem>
									<SelectItem value="es-ES">Spanish (Spain)</SelectItem>
									<SelectItem value="fr-FR">French (France)</SelectItem>
									<SelectItem value="de-DE">German (Germany)</SelectItem>
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
							<FormLabel>Preferred Calling Hours</FormLabel>
							<FormControl>
								<Input placeholder="e.g., 09:00-17:00" {...field} />
							</FormControl>
							<FormDescription>
								Timezone based on practice settings.
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
							<FormLabel>Max Call Duration (minutes)</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="10"
									{...field}
									onChange={(e) =>
										field.onChange(parseInt(e.target.value, 10) || 0)
									}
								/>
							</FormControl>
							<FormDescription>Maximum duration for each call.</FormDescription>
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
								type="url"
								placeholder="https://yourdomain.com/webhook"
								{...field}
							/>
						</FormControl>
						<FormDescription>
							URL to receive call events and transcripts.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Separator />
			<div className="flex justify-between items-center">
				<h4 className="font-medium">Test Configuration</h4>
				<Button variant="outline" size="sm">
					<Phone className="h-4 w-4 mr-2" /> Test Call
				</Button>
			</div>
			<div className="flex justify-between items-center">
				<h4 className="font-medium">Phone Number</h4>
				<Button variant="outline" size="sm">
					<Settings className="h-4 w-4 mr-2" /> Setup Number
				</Button>
			</div>
			<Separator />
			<h4 className="font-medium">Calendar Integration</h4>
			<div className="flex gap-4">
				<Button variant="outline" size="sm" className="flex-1">
					<Calendar className="h-4 w-4 mr-2" /> Connect Google Calendar
				</Button>
				<Button variant="outline" size="sm" className="flex-1">
					<Calendar className="h-4 w-4 mr-2" /> Connect Outlook Calendar
				</Button>
			</div>
		</CardContent>
	</Card>
);

interface VoiceflowConfigFormProps {
	form: UseFormReturn<AssistantSettings>;
}

const VoiceflowConfigForm: React.FC<VoiceflowConfigFormProps> = ({ form }) => (
	<Card className="mt-4">
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<Bot className="h-5 w-5" /> Voiceflow Chat Agent Configuration
			</CardTitle>
			<CardDescription>
				Configure the settings for the Voiceflow-based chat receptionist.
			</CardDescription>
		</CardHeader>
		<CardContent className="space-y-4">
			<FormField
				control={form.control}
				name="voiceflowConfig.projectId"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Project ID</FormLabel>
						<FormControl>
							<Input placeholder="Enter Voiceflow Project ID" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="voiceflowConfig.version"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Version</FormLabel>
							<FormControl>
								<Input placeholder="e.g., production" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="voiceflowConfig.accessToken"
					render={({ field }) => (
						<FormItem>
							<FormLabel>API Key (Access Token)</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Enter Voiceflow API Key"
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
				name="voiceflowConfig.welcomeMessage"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Welcome Message</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Initial message from the agent"
								{...field}
							/>
						</FormControl>
						<FormDescription>
							The first message the chat agent sends.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Separator />
			<div className="flex justify-between items-center">
				<h4 className="font-medium">Test Configuration</h4>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						window.open('https://creator.voiceflow.com/', '_blank')
					}
				>
					<ArrowRight className="h-4 w-4 mr-2" /> Go to Voiceflow Dashboard
				</Button>
			</div>
			<Separator />
			<h4 className="font-medium">Calendar Integration</h4>
			<div className="flex gap-4">
				<Button variant="outline" size="sm" className="flex-1">
					<Calendar className="h-4 w-4 mr-2" /> Connect Google Calendar
				</Button>
				<Button variant="outline" size="sm" className="flex-1">
					<Calendar className="h-4 w-4 mr-2" /> Connect Outlook Calendar
				</Button>
			</div>
		</CardContent>
	</Card>
);

export function AiAssistantDialog({
	assistant,
	open,
	onOpenChange,
}: AiAssistantDialogProps) {
	const { t } = useTranslation();

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

	// Submit handler
	const onSubmit = (values: AssistantSettings) => {
		console.log('Saving settings:', values);
		toast.success('Assistant settings saved successfully!');
		onOpenChange(false); // Close dialog on save
	};

	// Watch receptionist value
	const receptionistType = form.watch('receptionist');

	// Effect to reset configs
	useEffect(() => {
		if (receptionistType === 'none') {
			form.reset({
				...form.getValues(),
				voiceflowConfig: undefined,
				vapiConfig: undefined,
			});
		}
	}, [receptionistType, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl h-[80vh] overflow-hidden p-0 flex flex-col">
				<DialogHeader className="px-6 py-4 border-b flex-shrink-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-12 w-12">
								<img
									src={t(`aiAssistants.assistants.${assistant.name}.avatar`)}
									alt={t(`aiAssistants.assistants.${assistant.name}.name`)}
									className="object-cover"
								/>
							</Avatar>
							<div>
								<DialogTitle className="text-lg">
									{t(`aiAssistants.assistants.${assistant.name}.name`)}{' '}
									Configuration
								</DialogTitle>
								<DialogDescription className="text-sm">
									{t(`aiAssistants.assistants.${assistant.name}.description`)}
								</DialogDescription>
							</div>
						</div>
						<div className="ml-auto flex gap-1 flex-wrap max-w-[200px]">
							{assistant.capabilities.map((capability) => (
								<Badge
									key={capability}
									variant="outline"
									className="capitalize text-xs px-1.5 py-0.5"
								>
									{t(`aiAssistants.capabilities.${capability}`)}
								</Badge>
							))}
						</div>
					</div>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex-1 flex flex-col overflow-hidden"
					>
						<ScrollArea className="flex-1 p-6">
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>{t('aiAssistants.generalSettings')}</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="greeting"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t('aiAssistants.greeting')}</FormLabel>
													<FormDescription>
														{t('aiAssistants.greetingDescription')}
													</FormDescription>
													<FormControl>
														<Textarea
															placeholder={t(
																'aiAssistants.greetingPlaceholder'
															)}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="responseTime"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t('aiAssistants.responseTime')} (seconds)
													</FormLabel>
													<FormDescription>
														{t('aiAssistants.responseTimeDescription')}
													</FormDescription>
													<FormControl>
														<div className="flex items-center gap-4">
															<Slider
																min={1}
																max={10}
																step={1}
																defaultValue={[field.value]}
																onValueChange={(value) =>
																	field.onChange(value[0])
																}
															/>
															<span className="w-8 text-right">
																{field.value}s
															</span>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="voiceEnabled"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
													<div className="space-y-0.5">
														<FormLabel>
															{t('aiAssistants.voiceInput')}
														</FormLabel>
														<FormDescription>
															{t('aiAssistants.voiceInputDescription')}
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
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
													<div className="space-y-0.5">
														<FormLabel>
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
									</CardContent>
								</Card>

								{assistant.id === 'scheduling-assistant' && (
									<Card>
										<CardHeader>
											<CardTitle>Receptionist Configuration</CardTitle>
											<CardDescription>
												Configure an automated voice or chat receptionist for
												appointment scheduling.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<FormField
												control={form.control}
												name="receptionist"
												render={({ field }) => (
													<FormItem className="space-y-3">
														<FormLabel>Select Receptionist Type</FormLabel>
														<FormControl>
															<RadioGroup
																onValueChange={field.onChange}
																defaultValue={field.value}
																className="flex flex-col space-y-1"
															>
																<FormItem className="flex items-center space-x-3 space-y-0">
																	<FormControl>
																		<RadioGroupItem value="none" />
																	</FormControl>
																	<FormLabel className="font-normal">
																		No Receptionist
																	</FormLabel>
																</FormItem>
																<FormItem className="flex items-center space-x-3 space-y-0">
																	<FormControl>
																		<RadioGroupItem value="voiceflow" />
																	</FormControl>
																	<FormLabel className="font-normal">
																		Voiceflow Chat Agent
																	</FormLabel>
																</FormItem>
																<FormItem className="flex items-center space-x-3 space-y-0">
																	<FormControl>
																		<RadioGroupItem value="vapi" />
																	</FormControl>
																	<FormLabel className="font-normal">
																		VAPI Voice Agent
																	</FormLabel>
																</FormItem>
															</RadioGroup>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											{receptionistType === 'voiceflow' && (
												<VoiceflowConfigForm form={form} />
											)}
											{receptionistType === 'vapi' && (
												<VapiConfigForm form={form} />
											)}
										</CardContent>
									</Card>
								)}
							</div>
						</ScrollArea>
						<DialogFooter className="p-4 border-t flex-shrink-0">
							<Button type="submit">
								<Save className="h-4 w-4 mr-2" />
								Save Settings
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
