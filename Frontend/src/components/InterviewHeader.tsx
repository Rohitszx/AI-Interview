
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Mic, Video } from "lucide-react";

interface InterviewHeaderProps {
  mode: "text" | "audio" | "video";
  onEndInterview: () => void;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({ mode, onEndInterview }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">Interview in Progress</h2>
        <div className="ml-4 flex items-center">
          <div className="animate-pulse w-2 h-2 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm text-gray-500">
            {mode === "text" ? "Text Chat" : mode === "audio" ? "Audio Interview" : "Video Interview"}
            {mode !== "text" && (
              <>
                {" "}
                <span className="inline-flex items-center ml-1">
                  {mode === "audio" ? <Mic className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                </span>
              </>
            )}
          </span>
        </div>
      </div>
      {/* <Button variant="outline" size="sm" onClick={onEndInterview}>
        <X className="h-4 w-4 mr-1" />
        End Interview
      </Button> */}
    </div>
  );
};
