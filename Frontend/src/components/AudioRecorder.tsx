
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mic, Square } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (transcription: string) => void;
  isDisabled: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  isDisabled 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        setProcessingAudio(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert speech to text
          // const transcription = await processSpeechToText(audioBlob);
          
          // if (transcription) {
          //   onRecordingComplete(transcription);
          // } else {
          //   toast.error("Failed to transcribe audio. Please try again.");
          // }
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Failed to process audio. Please try again.");
        } finally {
          setProcessingAudio(false);
        }
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {!isRecording ? (
        <Button 
          onClick={startRecording} 
          disabled={isDisabled || processingAudio}
          variant="outline"
          className="flex-1"
        >
          <Mic className="h-4 w-4 mr-2" />
          {processingAudio ? "Processing audio..." : "Start Recording"}
        </Button>
      ) : (
        <Button 
          onClick={stopRecording} 
          variant="destructive"
          className="flex-1"
        >
          <Square className="h-4 w-4 mr-2" />
          Stop Recording
        </Button>
      )}
      
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="animate-pulse w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">Recording...</span>
        </div>
      )}
    </div>
  );
};
