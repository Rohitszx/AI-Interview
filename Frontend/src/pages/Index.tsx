import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowRight, Brain, Calendar, FileUp, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate("/setup");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full bg-indigo-500/5 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 60, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto pt-20 pb-16 px-4">
        <div className="text-center mb-16 relative">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered Interview Simulator
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Practice your interview skills with our AI interviewer tailored to your resume and job description.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="text-lg px-8 relative overflow-hidden bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
              onClick={handleStartInterview}
            >
              <span className="relative z-10 flex items-center">
                Start Interview Practice
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
              <motion.span 
                className="absolute inset-0 bg-white/10"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  repeatDelay: 1
                }}
              />
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <ArrowDown className="animate-bounce text-primary dark:text-primary" size={36} />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FileUp size={24} />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">Choose Interview Mode</CardTitle>
                <CardDescription>Step 1</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Select between audio, video, or text-based interview modes based on your preference.</p>
              </CardContent>
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-indigo-500 group-hover:w-full transition-all duration-300"></div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">Upload Documents</CardTitle>
                <CardDescription>Step 2</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Upload your resume and job description to tailor the interview to your specific needs.</p>
              </CardContent>
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-indigo-500 group-hover:w-full transition-all duration-300"></div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Brain size={24} />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">Get Feedback</CardTitle>
                <CardDescription>Step 3</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Receive detailed feedback on your performance with actionable tips for improvement.</p>
              </CardContent>
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-indigo-500 group-hover:w-full transition-all duration-300"></div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div 
        className="relative overflow-hidden py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-indigo-600/90 -z-10"></div>
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'] 
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p>Ready to ace your next interview?</p>
          </motion.h2>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 relative overflow-hidden bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
              onClick={handleStartInterview}
            >
              <span className="relative z-10 flex items-center">
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
              <motion.span 
                className="absolute inset-0 bg-white/10"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  repeatDelay: 1
                }}
              />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
