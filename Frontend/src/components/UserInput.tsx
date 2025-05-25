
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface UserInputProps {
  onSubmit: (message: string) => void;
  isDisabled: boolean;
}

export const UserInput: React.FC<UserInputProps> = ({ onSubmit, isDisabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    onSubmit(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        className="flex-grow min-h-[60px] resize-none"
        placeholder="Type your answer..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isDisabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
              handleSubmit(e);
            }
          }
        }}
      />
      <Button 
        type="submit" 
        disabled={isDisabled || !input.trim()} 
        className="self-end"
      >
        <Search className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  );
};
