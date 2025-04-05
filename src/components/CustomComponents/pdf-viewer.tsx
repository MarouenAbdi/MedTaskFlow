import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PDFViewerProps {
	url: string;
	fileName?: string;
	onDownload?: () => void;
	hideToolbar?: boolean;
}

export function PDFViewer({
	url,
	fileName = 'document.pdf',
	onDownload,
	hideToolbar = false,
}: PDFViewerProps) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const handleIframeLoad = () => {
		setLoading(false);
	};

	const handleIframeError = () => {
		setError(true);
		setLoading(false);
	};

	const handleDownload = () => {
		if (onDownload) {
			onDownload();
		} else {
			try {
				const link = document.createElement('a');
				link.href = url;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				toast.success(`Downloading ${fileName}`);
			} catch (err) {
				console.error('Download error:', err);
				toast.error('Failed to download the file');
			}
		}
	};

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-8 text-center">
				<AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
				<h3 className="text-lg font-medium mb-2">Unable to load PDF</h3>
				<p className="text-muted-foreground mb-4">
					The PDF viewer couldn't load this file. You can try downloading it to
					view locally.
				</p>
				{!hideToolbar && (
					<Button onClick={handleDownload}>
						<Download className="h-4 w-4 mr-2" />
						Download PDF
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full relative">
			{loading && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
					<Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
					<p className="text-sm text-muted-foreground">Loading PDF...</p>
				</div>
			)}

			{!hideToolbar && (
				<div className="flex items-center justify-end p-2 border-b bg-muted/20">
					<Button variant="outline" size="sm" onClick={handleDownload}>
						<Download className="h-4 w-4 mr-2" />
						Download
					</Button>
				</div>
			)}

			<div className="flex-1 w-full h-full bg-muted/30">
				<iframe
					src={`${url}${url.includes('?') ? '&' : '#'}toolbar=0&navpanes=0`}
					className="w-full h-full"
					onLoad={handleIframeLoad}
					onError={handleIframeError}
					title="PDF Viewer"
				/>
			</div>
		</div>
	);
}
