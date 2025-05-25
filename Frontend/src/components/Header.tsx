
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <motion.header 
      className="border-b backdrop-blur-sm bg-background/80 py-4 px-4 md:px-6 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold relative group">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
            AI Interview Simulator
          </span>
          <motion.span 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-indigo-500 group-hover:w-full"
            animate={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </Link>
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ThemeToggle />
          <UserProfileMenu />
        </motion.div>
      </div>
    </motion.header>
  );
};
