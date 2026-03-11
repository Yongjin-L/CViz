import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { analyzeCV } from './services/gemini';
import { extractTextFromPDF } from './services/pdf';
import { CVAnalysis } from './types';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function App() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      if (!text.trim()) {
        throw new Error("Could not extract text from the file. It might be empty or unreadable.");
      }

      setCvText(text);
      const result = await analyzeCV(text);
      setAnalysis(result);
    } catch (error) {
      console.error("Processing failed:", error);
      alert(error instanceof Error ? error.message : "Failed to process CV. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setCvText(null);
  };

  return (
    <div className="min-h-screen bg-bg">
      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-4xl w-full text-center space-y-12">
              <header className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-mono tracking-widest uppercase"
                >
                  <Sparkles className="w-3 h-3 text-accent" /> AI-Powered Academic Narratives
                </motion.div>
                
                <h1 className="text-7xl lg:text-9xl font-serif font-bold tracking-tighter leading-[0.85] text-slate-900">
                  CViz<br />
                </h1>
                
                <p className="text-xl lg:text-2xl font-serif italic text-slate-500 max-w-2xl mx-auto">
                  Transform your static research CV into a dynamic, interactive narrative that highlights your impact and expertise.
                </p>
              </header>

              <FileUpload onUpload={handleUpload} isProcessing={isProcessing} />

              <footer className="pt-12 border-t border-line flex flex-col md:flex-row items-center justify-center gap-8 opacity-40">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Theme Extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Interactive Visualization</span>
                </div>
              </footer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Dashboard data={analysis} cvText={cvText || ""} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
