import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { SessionRecorder } from '@/components/CustomComponents/session-recorder';
import { RichTextEditorModal } from '../../modals/rich-text-editor-modal';
import { FileText, Save, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SessionTranscriptionDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSave?: (transcription: string) => void;
	patientName?: string;
}

export function SessionTranscriptionDialog({
	open,
	onOpenChange,
	onSave,
	patientName = 'Patient',
}: SessionTranscriptionDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [transcription, setTranscription] = useState('');
	const [isEditorOpen, setIsEditorOpen] = useState(false);

	const handleOpenChange = (newOpen: boolean) => {
		if (onOpenChange) {
			onOpenChange(newOpen);
		} else {
			setIsOpen(newOpen);
		}
	};

	const handleTranscriptionComplete = (text: string) => {
		setTranscription(text);
	};

	const handleSave = () => {
		if (onSave) {
			onSave(transcription);
		}
		handleOpenChange(false);
		toast.success('Transcription saved to patient record');
	};

	const handleCopy = () => {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = transcription;
		const plainText = tempDiv.textContent || tempDiv.innerText || '';
		navigator.clipboard.writeText(plainText);
		toast.success('Transcription copied to clipboard');
	};

	const handleClear = () => {
		setTranscription('');
		toast.info('Transcription cleared');
	};

	return (
		<Dialog
			open={open !== undefined ? open : isOpen}
			onOpenChange={handleOpenChange}
		>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-6">
				<DialogHeader className="mb-4">
					<DialogTitle>Session Recording & Transcription</DialogTitle>
					<DialogDescription>
						Record your session with {patientName}. The audio will be
						automatically transcribed and can be saved to the patient's medical
						record.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
					<SessionRecorder
						onTranscriptionComplete={handleTranscriptionComplete}
					/>

					{transcription && (
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium">Transcription</h3>
								<div className="flex items-center gap-2">
									<Button variant="outline" size="sm" onClick={handleCopy}>
										<Copy className="h-4 w-4 mr-2" />
										Copy
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditorOpen(true)}
									>
										<FileText className="h-4 w-4 mr-2" />
										Edit
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleClear}
										className="text-destructive"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Clear
									</Button>
								</div>
							</div>

							<div
								className="border rounded-md p-4 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm"
								dangerouslySetInnerHTML={{ __html: transcription }}
							/>
						</div>
					)}
				</div>

				<div className="flex justify-end gap-2 mt-6 pt-4 border-t">
					<Button variant="outline" onClick={() => handleOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!transcription}>
						<Save className="h-4 w-4 mr-2" />
						Save to Patient Record
					</Button>
				</div>

				<RichTextEditorModal
					content={transcription}
					onChange={setTranscription}
					title="Edit Transcription"
					open={isEditorOpen}
					onOpenChange={setIsEditorOpen}
				/>
			</DialogContent>
		</Dialog>
	);
}
