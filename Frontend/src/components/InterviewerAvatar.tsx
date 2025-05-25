
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export const InterviewerAvatar = () => {
  return (
    <motion.div 
      className="flex items-center gap-2 bg-black/20 backdrop-blur-sm p-2 rounded-lg border border-primary/30"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Avatar className="ring-2 ring-primary/50 ring-offset-1 ring-offset-background">
          <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=interviewer" />
          <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
        </Avatar>
      </motion.div>
      <div>
        <motion.p 
          className="text-sm font-medium"
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          AI Interviewer
        </motion.p>
        <motion.div 
          className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
};
