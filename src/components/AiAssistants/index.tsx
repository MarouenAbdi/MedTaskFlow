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
import { Bot, Check, Plus, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AiAssistantDialog } from '@/modals/ai-assistant-dialog';
import { styles } from './styles';
import { useAiAssistants } from './hooks/useAiAssistants';
import { getCapabilityIcon, getCapabilityLabel } from './utils';

export default function AiAssistants() {
	const { t } = useTranslation();
	const {
		myActiveAssistants,
		availableAssistants,
		searchQuery,
		selectedAssistant,
		dialogOpen,
		activeAssistants,
		setSearchQuery,
		toggleAssistant,
		handleConfigureAssistant,
		setDialogOpen,
		switchToAvailableTab,
	} = useAiAssistants();

	return (
		<div className={styles.container}>
			<div className={styles.header.wrapper}>
				<div className={styles.header.titleSection}>
					<Avatar className={styles.header.avatar}>
						<AvatarFallback className={styles.header.avatarFallback}>
							<Bot className={styles.header.icon} />
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className={styles.header.title}>{t('nav.aiAssistants')}</h2>
						<p className={styles.header.description}>
							{t('aiAssistants.description')}
						</p>
					</div>
				</div>
				<div className={styles.search.wrapper}>
					<div className={styles.search.container}>
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
						<div className={styles.emptyState.wrapper}>
							<Bot className={styles.emptyState.icon} />
							<h3 className={styles.emptyState.title}>
								{t('aiAssistants.noActiveAssistants')}
							</h3>
							<p className={styles.emptyState.description}>
								{t('aiAssistants.activateFromAvailable')}
							</p>
							<Button onClick={switchToAvailableTab}>
								{t('aiAssistants.browseAssistants')}
							</Button>
						</div>
					) : (
						<div className={styles.cards.grid}>
							{myActiveAssistants.map((assistant) => (
								<Card key={assistant.id} className={styles.cards.active}>
									<CardHeader className={styles.cards.header.wrapper}>
										<div className={styles.cards.header.content}>
											<div className={styles.cards.header.imageContainer}>
												<div className={styles.cards.header.image}>
													<img
														src={t(
															`aiAssistants.assistants.${assistant.name}.avatar`
														)}
														alt={t(
															`aiAssistants.assistants.${assistant.name}.name`
														)}
														className={styles.cards.header.img}
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
									<CardContent className={styles.cards.content.wrapper}>
										<div className={styles.cards.content.badges}>
											{assistant.capabilities.map((capability) => {
												const Icon = getCapabilityIcon(capability);
												return (
													<Badge
														key={capability}
														variant="outline"
														className={styles.cards.content.badge}
													>
														<Icon className="h-4 w-4" />
														{getCapabilityLabel(capability, t)}
													</Badge>
												);
											})}
										</div>
									</CardContent>
									<CardFooter className={styles.cards.footer.wrapper}>
										<span className={styles.cards.footer.price}>
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
					<div className={styles.cards.grid}>
						{availableAssistants.map((assistant) => (
							<Card key={assistant.id} className={styles.cards.available}>
								<CardHeader className={styles.cards.header.wrapper}>
									<div className={styles.cards.header.content}>
										<div className={styles.cards.header.imageContainer}>
											<div className={styles.cards.header.image}>
												<img
													src={t(
														`aiAssistants.assistants.${assistant.name}.avatar`
													)}
													alt={t(
														`aiAssistants.assistants.${assistant.name}.name`
													)}
													className={styles.cards.header.img}
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
								<CardContent className={styles.cards.content.wrapper}>
									<div className={styles.cards.content.badges}>
										{assistant.capabilities.map((capability) => {
											const Icon = getCapabilityIcon(capability);
											return (
												<Badge
													key={capability}
													variant="outline"
													className={styles.cards.content.badge}
												>
													<Icon className="h-4 w-4" />
													{getCapabilityLabel(capability, t)}
												</Badge>
											);
										})}
									</div>
								</CardContent>
								<CardFooter className={styles.cards.footer.wrapper}>
									<span className={styles.cards.footer.price}>
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
							<div className={styles.emptyState.wrapper}>
								<Sparkles className={styles.emptyState.icon} />
								<h3 className={styles.emptyState.title}>
									{t('aiAssistants.noAvailableAssistants')}
								</h3>
								<p className={styles.emptyState.description}>
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
