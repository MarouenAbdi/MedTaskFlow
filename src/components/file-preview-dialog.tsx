import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ZoomIn, ZoomOut, RotateCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PDFViewer } from "@/components/pdf-viewer";

interface FilePreviewDialogProps {
  file: {
    name: string;
    type: string;
    url: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (fileName: string) => void;
}

export function FilePreviewDialog({
  file,
  open,
  onOpenChange,
  onDownload,
}: FilePreviewDialogProps) {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const isPdf = file.type === "pdf";
  const isImage = file.type === "image";
  
  // Reset zoom and rotation when the file changes or dialog opens
  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
    }
  }, [open, file.url]);
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload(file.name);
    } else {
      try {
        // Fallback download method
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading ${file.name}`);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    }
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate max-w-md">{file.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden bg-muted/30 h-[calc(90vh-4rem)]">
          {isPdf ? (
            <PDFViewer 
              url={file.url} 
              fileName={file.name}
              onDownload={handleDownload}
            />
          ) : isImage ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
                <div className="relative flex items-center justify-center h-full w-full">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-h-full max-w-full object-contain transition-all duration-200"
                    style={{ 
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />
                </div>
              </div>
              
              <div className="border-t bg-background p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-16 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRotate}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Preview not available</h3>
                <p className="text-muted-foreground mb-4">
                  This file type cannot be previewed. You can download it to view locally.
                </p>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}