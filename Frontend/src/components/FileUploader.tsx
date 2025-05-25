import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export interface FileUploaderProps {
  onFileSelect: (file: File) => Promise<void>;
  accept: string;
  isLoading?: boolean;
  error?: string;
  progress?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept,
  isLoading = false,
  error,
  progress = 0
}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">{accept.split(',').join(', ')} files</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
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
