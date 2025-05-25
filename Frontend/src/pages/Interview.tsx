import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ChatMessage } from "@/components/ChatMessage";
import { UserInput } from "@/components/UserInput";
import { InterviewHeader } from "@/components/InterviewHeader";
import { AudioRecorder } from "@/components/AudioRecorder";
import { VideoRecorder } from "@/components/VideoRecorder";
import { generateAIQuestion, finishInterview, startInterview, submitInterviewAnswer } from "@/lib/api";
import ReactDOM from "react-dom";
import { InterviewerAvatar } from "@/components/InterviewerAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// Interview duration is now AI-driven. No fixed time limit.

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Interview state
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewId, setInterviewId] = useState<string>("");
  const [interviewContext, setInterviewContext] = useState<any>(null);

  // No timer state needed; interview ends when AI says so.
  const [showEndModal, setShowEndModal] = useState(false);

  // Get interview mode from location state
  const interviewMode = (location.state?.mode || "text") as "audio" | "video" | "text";

  // On component mount, start the interview
  useEffect(() => {
    if (!location.state?.resumeText || !location.state?.jobDescription) {
      toast.error("Missing resume or job description");
      navigate("/setup");
      return;
    }

    const initializeInterview = async () => {
      try {
        setIsLoading(true);
        const now = new Date().toISOString();
        const response = await startInterview(
          location.state.resumeText,
          location.state.jobDescription
        );

        if (response.question === 'END OF INTERVIEW') {
          toast.error("Interview could not be started. Please check your resume and job description.");
          navigate("/setup");
          return;
        }

        const questionMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.question,
          timestamp: new Date()
        };

        setMessages([questionMessage]);
        setInterviewContext(response.interviewContext);
        setWaitingForResponse(true);
      } catch (error) {
        console.error("Failed to start interview:", error);
        setError("Failed to start interview. Please try again.");
        toast.error("Failed to start interview");
      } finally {
        setIsLoading(false);
      }
    };

    initializeInterview();
  }, [location.state, navigate]);

  // Timer logic removed; AI determines when to end the interview.

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Requests the next interview question from the backend API
   * Updates state with the new question and manages interview flow
   */
  const askNextQuestion = async (endEarly = false) => {
    setError(null);
    setIsLoading(true);
    try {
      // Prepare previous questions/answers
      const previousQuestions = messages.filter(m => m.role === 'assistant').map(m => m.content);
      const previousAnswers = messages.filter(m => m.role === 'user').map(m => m.content);
      const count = previousQuestions.length + 1;
      const payload = {
        resumeText: location.state.resumeText,
        jobDescription: location.state.jobDescription,
        previousQuestions,
        previousAnswers,
        count,
        isFinished: endEarly || isInterviewComplete
      };
      const response = await generateAIQuestion(payload);
      const question = response.question;
      if (question === 'END OF INTERVIEW') {
        setIsInterviewComplete(true);
        try {
          const feedbackResult = await finishInterview(interviewContext);
          // Add END OF INTERVIEW message only if feedback is fetched
          setMessages(prev => ([...prev, {
            id: crypto.randomUUID(),
            role: "system",
            content: "END OF INTERVIEW",
            timestamp: new Date()
          }]));
          navigate("/feedback", {
            state: {
              feedback: feedbackResult.feedback,
              messages: messages
            }
          });
        } catch (e) {
          setError("Failed to fetch feedback. Please try again.");
        }
        return;
      }
      setMessages(prev => ([...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: question,
        timestamp: new Date()
      }]));
      setWaitingForResponse(true);
    } catch (error) {
      setError("Failed to get next question. Please try again.");
      toast.error("Failed to get next question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!interviewContext) {
      toast.error("Interview context not found");
      return;
    }
    try {
      setIsLoading(true);
      setWaitingForResponse(false);
      // Add user's answer to messages
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      const response = await submitInterviewAnswer(interviewContext, answer);
      if (response.finished || response.question === 'END OF INTERVIEW') {
        setIsInterviewComplete(true);
        try {
          const feedbackResult = await finishInterview(interviewContext);
          navigate("/feedback", {
            state: {
              feedback: feedbackResult.feedback,
              messages: messages
            }
          });
        } catch (e) {
          setError("Failed to fetch feedback. Please try again.");
        }
        return;
      }
      // Add assistant's next question
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.question,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setWaitingForResponse(true);
      setInterviewContext(response.interviewContext);
    } catch (error) {
      setError("Failed to submit answer. Please try again.");
      toast.error("Failed to submit answer");
    } finally {
      setIsLoading(false);
    }
  };

  // End interview logic (no navigation)
  const handleEndInterview = async (auto = false) => {
    if (!interviewContext || isInterviewComplete) return;
    setIsInterviewComplete(true);
    try {
      const feedbackResult = await finishInterview(interviewContext);
      navigate("/feedback", {
        state: {
          feedback: feedbackResult.feedback,
          messages: messages
        }
      });
    } catch (e) {
      setError("Failed to fetch feedback. Please try again.");
    }
  };

  const confirmEndInterview = () => {
    setShowEndModal(false);
    handleEndInterview(true);
  };

  return (
    <motion.div 
      className="container mx-auto py-6 px-4 max-w-5xl flex flex-col h-[calc(100vh-72px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%)",
        backgroundSize: "100% 100%",
        backgroundPosition: "center"
      }}
    >
      <InterviewHeader mode={interviewMode} onEndInterview={() => setShowEndModal(true)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
        {!isInterviewComplete && (
          <Button variant="destructive" onClick={() => setShowEndModal(true)}>
            End Interview
          </Button>
        )}
      </div>
      <div className={`flex-grow flex ${interviewMode === "video" ? "flex-row gap-4" : "flex-col"}`}>
        {interviewMode === "video" ? (
          <>
            {/* Video section - larger portion */}
            <motion.div 
              className="flex-grow flex flex-col w-7/12"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="flex-grow overflow-hidden flex flex-col border border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 flex-grow relative">
                  <VideoRecorder onRecordingComplete={handleSubmitAnswer} isDisabled={isLoading || isInterviewComplete} />
                  
                  {/* Interviewer avatar overlay */}
                  <div className="absolute bottom-6 right-6 z-10">
                    <InterviewerAvatar />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Chat section - smaller portion */}
            <motion.div 
              className="w-5/12 flex flex-col"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="flex-grow overflow-hidden flex flex-col border border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 flex-grow overflow-hidden flex flex-col">
                  <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChatMessage 
                            message={message.content} 
                            isUser={message.role === "user"}
                          />
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <Card className="flex-grow overflow-hidden flex flex-col border border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex-grow overflow-hidden flex flex-col">
              <ScrollArea className="flex-grow pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChatMessage 
                        message={message.content} 
                        isUser={message.role === "user"}
                      />
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="p-4 border-t">
              {interviewMode === "text" ? (
                <UserInput onSubmit={handleSubmitAnswer} isDisabled={isLoading || isInterviewComplete || !waitingForResponse} />
              ) : interviewMode === "audio" ? (
                <AudioRecorder onRecordingComplete={handleSubmitAnswer} isDisabled={isLoading || isInterviewComplete || !waitingForResponse} />
              ) : null /* Video controls are in the video section */}
            </div>
          </Card>
        )}
      </div>

  {showEndModal &&
  ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <p className="mb-4 text-lg font-semibold text-red-600">
          Are you sure you want to end the interview midway? <br />
          <span className="text-base text-muted-foreground">This might affect your selection chances.</span>
        </p>
        <div className="flex justify-end space-x-2">
          <Button onClick={() => setShowEndModal(false)}>Cancel</Button>
          <Button variant="destructive" onClick={confirmEndInterview}>
            End Anyway
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}


    </motion.div>
  );
};

export default Interview;
