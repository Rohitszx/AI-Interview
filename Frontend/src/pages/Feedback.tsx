import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface Feedback {
  verdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'No Hire' | 'Lean No Hire';
  verdictSummary: string; // one-line summary
  overallPerformance: string;
  technicalAccuracy: string;
  communicationEffectiveness: string;
  strengths: string[];
  areasForImprovement: string[];
  advice: string[];
}

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const feedback = location.state?.feedback as Feedback;
  const messages = location.state?.messages as Message[];

  if (!feedback || !messages) {
    toast.error("No feedback data available");
    navigate("/setup");
    return null;
  }

  const handleStartNewInterview = () => {
    navigate("/setup");
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Interview Feedback</CardTitle>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-base font-semibold" style={{color: feedback.verdict === "Strong Hire" ? "#34C759" : feedback.verdict === "Hire" ? "#F7DC6F" : feedback.verdict === "Lean Hire" ? "#F7DC6F" : "#F56565"}}>
              Verdict:&nbsp;
              <span className="px-3 py-1 text-sm font-semibold rounded-md" style={{backgroundColor: feedback.verdict === "Strong Hire" ? "#34C75920" : feedback.verdict === "Hire" ? "#F7DC6F20" : feedback.verdict === "Lean Hire" ? "#F7DC6F20" : "#F5656520"}}>
                {feedback.verdict === "Strong Hire"
                  ? "Strong Hire"
                  : feedback.verdict === "Hire"
                  ? "Hire"
                  : feedback.verdict === "Lean Hire"
                  ? "Borderline Hire"
                  : "No Hire"}
              </span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
            <p className="text-muted-foreground">{feedback.overallPerformance}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Technical Accuracy</h3>
            <p className="text-muted-foreground">{feedback.technicalAccuracy}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Communication Effectiveness</h3>
            <p className="text-muted-foreground">{feedback.communicationEffectiveness}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Strengths</h3>
            <ul className="list-disc pl-5 space-y-1">
              {Array.isArray(feedback.strengths) && feedback.strengths.map((strength, index) => (
                <li key={index} className="text-muted-foreground">{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
            <ul className="list-disc pl-5 space-y-1">
              {Array.isArray(feedback.areasForImprovement) && feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="text-muted-foreground">{area}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Advice</h3>
            <ul className="list-disc pl-5 space-y-1">
              {Array.isArray(feedback.advice) ? feedback.advice.map((advice, index) => (
                <li key={index} className="text-muted-foreground">{advice}</li>
              )) : null}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Interview Transcript</h3>
            <div className="space-y-4 mt-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.role === "assistant"
                      ? "bg-primary/10"
                      : "bg-secondary/10"
                  }`}
                >
                  <p className="font-semibold">
                    {message.role === "assistant" ? "Interviewer" : "You"}:
                  </p>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={handleStartNewInterview}>Start New Interview</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;
