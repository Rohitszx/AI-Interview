import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileUploader } from "@/components/FileUploader";
import { JobDescription } from "@/components/JobDescription";
import { uploadResume, uploadJobDescription } from "@/lib/api";

const INTERVIEW_MODES = [
  { key: 'text', label: 'Text' },
  { key: 'audio', label: 'Audio' },
  { key: 'video', label: 'Video' },
];

const Setup = () => {
  const navigate = useNavigate();
   
  const [resume, setResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>(""); 
  const [mode, setMode] = useState<'text' | 'audio' | 'video'>('text');

  // Processing states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{resume: number, jd: number}>({resume: 0, jd: 0});
  
  // Error states
  const [errors, setErrors] = useState<{resume?: string, jd?: string, general?: string}>({});

  // Handle resume upload
  const handleResumeUpload = async (file: File) => {
    try {
      setErrors(prev => ({ ...prev, resume: undefined }));
      setIsLoading(true);
      setUploadProgress(prev => ({ ...prev, resume: 10 }));
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Resume file size exceeds 5MB limit');
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Resume must be a PDF, Word document, or text file');
      }
      
      const response = await uploadResume(file);
      setUploadProgress(prev => ({ ...prev, resume: 100 }));
      setResume(file);
      setResumeText(response.text);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Resume upload error:", error);
      setErrors(prev => ({ ...prev, resume: error instanceof Error ? error.message : 'Failed to upload resume' }));
      setUploadProgress(prev => ({ ...prev, resume: 0 }));
      toast.error(error instanceof Error ? error.message : 'Failed to upload resume');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job description upload immediately on file select
  const handleJobDescriptionUpload = async (file: File) => {
    try {
      setErrors(prev => ({ ...prev, jd: undefined }));
      setIsLoading(true);
      setUploadProgress(prev => ({ ...prev, jd: 10 }));

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Job description file size exceeds 5MB limit');
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Job description must be a PDF, Word document, or text file');
      }

      const response = await uploadJobDescription(file);
      setUploadProgress(prev => ({ ...prev, jd: 100 }));
      setJobDescription(response.text);
      toast.success("Job description uploaded successfully");
    } catch (error) {
      console.error("Job description upload error:", error);
      setErrors(prev => ({ ...prev, jd: error instanceof Error ? error.message : 'Failed to upload job description' }));
      setUploadProgress(prev => ({ ...prev, jd: 0 }));
      toast.error(error instanceof Error ? error.message : 'Failed to upload job description');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job description submit for pasted text only
  const handleJobDescriptionSubmit = async () => {
    try {
      setErrors(prev => ({ ...prev, jd: undefined }));
      setIsLoading(true);
      setUploadProgress(prev => ({ ...prev, jd: 10 }));

      if (jobDescription.trim()) {
        setJobDescription(jobDescription.trim());
        setUploadProgress(prev => ({ ...prev, jd: 100 }));
        toast.success("Job description saved successfully");
      } else {
        throw new Error('Please provide a job description');
      }
    } catch (error) {
      console.error("Job description submission error:", error);
      setErrors(prev => ({ ...prev, jd: error instanceof Error ? error.message : 'Failed to submit job description' }));
      setUploadProgress(prev => ({ ...prev, jd: 0 }));
      toast.error(error instanceof Error ? error.message : 'Failed to submit job description');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = () => {
    if (!resumeText) {
      setErrors(prev => ({ ...prev, resume: 'Please upload your resume first' }));
      toast.error('Please upload your resume first');
      return;
    }

    if (!jobDescription) {
      setErrors(prev => ({ ...prev, jd: 'Please provide a job description' }));
      toast.error('Please provide a job description');
      return;
    }

    navigate('/interview', {
      state: {
        resumeText,
        jobDescription
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Interview Mode Selector */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm border bg-muted">
          {INTERVIEW_MODES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-150
                ${mode === key ? 'bg-primary text-white' : 'bg-muted text-primary'}
                ${key !== 'text' ? 'border-l border-gray-300' : ''}
                ${mode === key ? '' : 'hover:bg-primary/10'}`}
              onClick={() => setMode(key as 'text' | 'audio' | 'video')}
              aria-pressed={mode === key}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Show Coming Soon for Audio/Video */}
      {mode !== 'text' && (
        <div className="mb-4 text-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-3">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} interview mode is <b>coming soon</b>!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Interview Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upload">Upload Documents</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resume</h3>
                  <FileUploader
                    onFileSelect={handleResumeUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    isLoading={isLoading}
                    error={errors.resume}
                    progress={uploadProgress.resume}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <JobDescription
                    value={jobDescription}
                    onChange={setJobDescription}
                    onFileSelect={handleJobDescriptionUpload}
                    onSubmit={handleJobDescriptionSubmit}
                    isLoading={isLoading}
                    error={errors.jd}
                    progress={uploadProgress.jd}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resume Preview</h3>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    {resumeText || 'No resume uploaded yet'}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description Preview</h3>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    {jobDescription || 'No job description provided yet'}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              onClick={handleStartInterview}
              disabled={mode !== 'text'}
              className="w-full"
            >
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;
