import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  onFileSelect: (file: File | null) => void;
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
  progress?: number;
}

export const JobDescription: React.FC<JobDescriptionProps> = ({
  value,
  onChange,
  onFileSelect,
  onSubmit,
  isLoading = false,
  error,
  progress = 0
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Textarea
          placeholder="Paste job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px]"
          disabled={isLoading}
        />
        <div className="flex items-center gap-4">
          <Button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
          >
            Save Job Description
          </Button>
          <div className="relative">
            <input
              type="file"
              className="hidden"
              id="jd-file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('jd-file')?.click()}
              disabled={isLoading}
            >
              Upload File
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {isLoading && progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
