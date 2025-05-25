
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="relative overflow-hidden border border-primary/20 bg-background/80 backdrop-blur-sm"
      >
        {theme === "dark" ? (
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-5 w-5 text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="h-5 w-5 text-indigo-500" />
          </motion.div>
        )}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-background/10 to-primary/5 rounded-md"
          animate={{
            background: theme === "dark" 
              ? "linear-gradient(to right top, rgba(30, 41, 59, 0.1), rgba(147, 51, 234, 0.05))" 
              : "linear-gradient(to right top, rgba(219, 234, 254, 0.1), rgba(79, 70, 229, 0.05))"
          }}
        />
      </Button>
    </motion.div>
  );
};
