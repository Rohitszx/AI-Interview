
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <motion.div 
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] break-words shadow-sm backdrop-blur-sm",
          isUser
            ? "bg-primary text-primary-foreground bg-gradient-to-br from-primary to-primary/80"
            : "bg-secondary text-secondary-foreground bg-gradient-to-br from-secondary to-secondary/80"
        )}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {message}
      </motion.div>
    </motion.div>
  );
};
