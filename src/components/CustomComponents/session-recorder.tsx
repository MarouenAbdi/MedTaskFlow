import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SessionRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  className?: string;
}

export function SessionRecorder({ onTranscriptionComplete, className }: SessionRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
      setIsPaused(false);
      
      // Simulate transcription process
      simulateTranscription();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.info("Recording paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.info("Recording resumed");
    }
  };

  // This function simulates the transcription process
  // In a real implementation, you would send the audio to a transcription service
  const simulateTranscription = () => {
    setIsTranscribing(true);
    
    // Create an audio blob from the recorded chunks
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    // Simulate sending to a transcription service with a delay
    setTimeout(() => {
      // This is where you would normally process the audioBlob with a real transcription service
      // For demo purposes, we're generating a mock transcription
      const mockTranscription = generateMockTranscription(recordingTime);
      
      onTranscriptionComplete(mockTranscription);
      setIsTranscribing(false);
      toast.success("Transcription completed");
    }, 2000); // Simulate 2 second processing time
  };

  // Generate a realistic mock transcription based on recording duration
  const generateMockTranscription = (seconds: number) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `<h3>Session Transcription - ${date} at ${time}</h3>
<p><strong>Duration:</strong> ${formatTime(seconds)}</p>

<h4>Patient Symptoms</h4>
<p>Patient reports experiencing recurring headaches for the past two weeks, primarily in the frontal region. Describes the pain as "throbbing" and rates it 6/10 on the pain scale. Headaches typically occur in the afternoon and last for 2-3 hours.</p>

<h4>Additional Symptoms</h4>
<p>Patient also mentions occasional dizziness when standing up quickly and mild sensitivity to bright lights during headache episodes. No nausea or vomiting reported. Sleep patterns have been irregular due to work stress.</p>

<h4>Medical History Discussion</h4>
<p>Patient confirms no previous history of migraines or significant head injuries. Currently not taking any medications except occasional ibuprofen for headache relief, which provides moderate relief.</p>

<h4>Lifestyle Factors</h4>
<p>Patient acknowledges increased work stress over the past month and reduced water intake. Typically consumes 2-3 cups of coffee daily. Exercise routine has been inconsistent recently.</p>

<h4>Assessment Notes</h4>
<p>Vital signs within normal range. Neurological examination shows no abnormalities. Tension in neck and shoulder muscles observed during physical examination.</p>`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <div className={cn(
              "h-3 w-3 rounded-full bg-red-500",
              isPaused ? "opacity-50" : "animate-pulse"
            )} />
          ) : null}
          <span className="font-medium">
            {isRecording 
              ? `Recording ${isPaused ? '(Paused)' : ''}: ${formatTime(recordingTime)}`
              : "Ready to Record Session"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button 
              onClick={startRecording} 
              size="sm" 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button 
                  onClick={resumeRecording} 
                  size="sm" 
                  variant="outline"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button 
                  onClick={pauseRecording} 
                  size="sm" 
                  variant="outline"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button 
                onClick={stopRecording} 
                size="sm" 
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isTranscribing && (
        <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Transcribing your recording...</p>
          </div>
        </div>
      )}
    </div>
  );
}