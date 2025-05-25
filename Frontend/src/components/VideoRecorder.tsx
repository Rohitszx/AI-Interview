
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Video, Square } from "lucide-react";

interface VideoRecorderProps {
  onRecordingComplete: (transcription: string) => void;
  isDisabled: boolean;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onRecordingComplete, 
  isDisabled 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processingVideo, setProcessingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize webcam
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        streamRef.current = stream;
      } catch (error) {
        console.error("Error accessing camera or microphone:", error);
        toast.error("Failed to access camera or microphone. Please check your browser permissions.");
      }
    };
    
    initializeCamera();
    
    // Clean up when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (!streamRef.current) {
      toast.error("Camera not available. Please refresh and try again.");
      return;
    }
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setProcessingVideo(true);
        try {
          const audioBlob = new Blob(videoChunksRef.current, { type: 'audio/webm' });
          
          // Extract audio and convert speech to text
          // const transcription = await processSpeechToText(audioBlob);
          
          // if (transcription) {
          //   onRecordingComplete(transcription);
          // } else {
          //   toast.error("Failed to transcribe audio. Please try again.");
          // }
        } catch (error) {
          console.error("Error processing video audio:", error);
          toast.error("Failed to process video audio. Please try again.");
        } finally {
          setProcessingVideo(false);
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-grow bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-2 py-1 rounded">
            <div className="animate-pulse w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">REC</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex gap-2 justify-center">
        {!isRecording ? (
          <Button 
            onClick={startRecording} 
            disabled={isDisabled || processingVideo}
            variant="outline"
            className="flex-1 max-w-xs"
          >
            <Video className="h-4 w-4 mr-2" />
            {processingVideo ? "Processing video..." : "Start Recording"}
          </Button>
        ) : (
          <Button 
            onClick={stopRecording} 
            variant="destructive"
            className="flex-1 max-w-xs"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};
