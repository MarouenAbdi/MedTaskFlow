import { useTranslation } from 'react-i18next';
import { format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Clock, Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewAppointmentDialog } from '@/modals/new-appointment-dialog';
import { EditAppointmentDialog } from '@/modals/edit-appointment-dialog';
import { useAppointments } from './hooks/useAppointments';
import { styles } from './styles';
import {
	appointmentTypes,
	formatAppointmentType,
	generateTimeSlots,
} from './utils';

export default function Appointments() {
	const { t } = useTranslation();
	const {
		currentDate,
		selectedType,
		selectedAppointment,
		editDialogOpen,
		newAppointmentOpen,
		selectedTimeSlot,
		isMobile,
		weekDays,
		handlePreviousWeek,
		handleNextWeek,
		getAppointmentsForTimeSlot,
		handleAppointmentClick,
		handleSaveAppointment,
		handleDeleteAppointment,
		handleTimeSlotClick,
		handleNewAppointment,
		setSelectedType,
		setNewAppointmentOpen,
		setEditDialogOpen,
		setCurrentDate,
	} = useAppointments();

	const timeSlots = generateTimeSlots();

	return (
		<div className={styles.container}>
			<div className={styles.header.wrapper}>
				<Avatar className={styles.header.avatar}>
					<AvatarFallback className={styles.header.avatarFallback}>
						<Calendar className={styles.header.icon} />
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className={styles.header.title}>{t('nav.appointments')}</h2>
					<p className={styles.header.description}>
						{t('appointments.description')}
					</p>
				</div>
			</div>

			<div className={styles.controls.wrapper(isMobile)}>
				<div className={styles.controls.navigation.wrapper}>
					<Button variant="outline" size="icon" onClick={handlePreviousWeek}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon" onClick={handleNextWeek}>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<h3 className={styles.controls.navigation.dateRange}>
						{format(weekDays[0], 'MMMM d')} -{' '}
						{format(weekDays[4], 'MMMM d, yyyy')}
					</h3>
				</div>

				<div className={styles.controls.filters.wrapper}>
					<Select value={selectedType} onValueChange={setSelectedType}>
						<SelectTrigger className={styles.controls.filters.select}>
							<SelectValue placeholder={t('appointments.type')} />
						</SelectTrigger>
						<SelectContent>
							{appointmentTypes.map((type) => (
								<SelectItem key={type.value} value={type.value}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button onClick={() => setNewAppointmentOpen(true)}>
						<Plus className="mr-2 h-4 w-4" /> {t('appointments.new')}
					</Button>
				</div>
			</div>

			<div className={styles.calendar.container}>
				{isMobile ? (
					// Mobile View - Single Day with Timeline
					<div className="flex flex-col h-full">
						<div className={styles.calendar.mobile.daySelector.wrapper}>
							<div
								className={styles.calendar.mobile.daySelector.scrollContainer}
							>
								<div
									className={styles.calendar.mobile.daySelector.buttonContainer}
								>
									{weekDays.map((day, index) => (
										<Button
											key={index}
											variant={
												isSameDay(day, currentDate) ? 'default' : 'ghost'
											}
											className={styles.calendar.mobile.daySelector.button}
											onClick={() => setCurrentDate(day)}
										>
											<div className="text-center">
												<div>{format(day, 'EEE')}</div>
												<div className="text-sm">{format(day, 'MMM d')}</div>
											</div>
										</Button>
									))}
								</div>
							</div>
						</div>
						<div className={styles.calendar.mobile.timeline.wrapper}>
							<div className="divide-y">
								{timeSlots.map((time) => {
									const dayAppointments = getAppointmentsForTimeSlot(
										currentDate,
										time
									);
									return (
										<div
											key={time}
											className={styles.calendar.mobile.timeline.slot}
											onClick={() => handleTimeSlotClick(currentDate, time)}
										>
											<div className={styles.calendar.mobile.timeline.time}>
												{time}
											</div>
											<div className="space-y-2">
												{dayAppointments.map((appointment) => (
													<div
														key={appointment.id}
														onClick={(e) => {
															e.stopPropagation();
															handleAppointmentClick(appointment);
														}}
														className={styles.appointment.wrapper(
															appointment.type
														)}
													>
														<div className={styles.appointment.header.wrapper}>
															<div
																className={styles.appointment.header.patient}
															>
																{appointment.patient}
															</div>
															<div
																className={styles.appointment.header.duration}
															>
																<Clock
																	className={styles.appointment.header.icon}
																/>
																{appointment.duration}min
															</div>
														</div>
														<Badge
															variant="outline"
															className={styles.appointment.badge(
																appointment.type
															)}
														>
															{formatAppointmentType(appointment.type)}
														</Badge>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				) : (
					// Desktop View - Week Calendar
					<div className={styles.calendar.desktop.grid.wrapper}>
						<div className={styles.calendar.desktop.grid.timeColumn}>
							<div className={styles.calendar.desktop.grid.timeHeader}></div>
							<div className="divide-y">
								{timeSlots.map((time) => (
									<div
										key={time}
										className={styles.calendar.desktop.grid.timeSlot}
									>
										{time}
									</div>
								))}
							</div>
						</div>

						<div className={styles.calendar.desktop.content.wrapper}>
							<div className={styles.calendar.desktop.content.grid}>
								{weekDays.map((day, index) => (
									<div
										key={index}
										className={styles.calendar.desktop.content.dayColumn}
									>
										<div className={styles.calendar.desktop.dayHeader.wrapper}>
											<div
												className={styles.calendar.desktop.dayHeader.content}
											>
												<div className={styles.calendar.desktop.dayHeader.day}>
													{format(day, 'EEEE')}
												</div>
												<div className={styles.calendar.desktop.dayHeader.date}>
													{format(day, 'MMM d')}
												</div>
											</div>
										</div>
										<div>
											{timeSlots.map((time) => {
												const dayAppointments = getAppointmentsForTimeSlot(
													day,
													time
												);
												return (
													<div
														key={time}
														className={cn(
															'h-20 border-b p-1 cursor-pointer hover:bg-accent/50 transition-colors',
															dayAppointments.length > 0 && 'bg-muted/30'
														)}
														onClick={() => handleTimeSlotClick(day, time)}
													>
														{dayAppointments.map((appointment) => (
															<div
																key={appointment.id}
																onClick={(e) => {
																	e.stopPropagation();
																	handleAppointmentClick(appointment);
																}}
																className={styles.appointment.wrapper(
																	appointment.type
																)}
															>
																<div
																	className={styles.appointment.header.patient}
																>
																	{appointment.patient}
																</div>
																<div className="flex items-center gap-2">
																	<Badge
																		variant="outline"
																		className={styles.appointment.badge(
																			appointment.type
																		)}
																	>
																		{formatAppointmentType(appointment.type)}
																	</Badge>
																	<span className="text-xs text-muted-foreground">
																		{appointment.duration}min
																	</span>
																</div>
															</div>
														))}
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			<NewAppointmentDialog
				open={newAppointmentOpen}
				onOpenChange={setNewAppointmentOpen}
				onSave={handleNewAppointment}
				selectedTimeSlot={selectedTimeSlot}
				withButton={false}
			/>

			{selectedAppointment && (
				<EditAppointmentDialog
					appointment={selectedAppointment}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					onSave={handleSaveAppointment}
					onDelete={handleDeleteAppointment}
				/>
			)}
		</div>
	);
}
