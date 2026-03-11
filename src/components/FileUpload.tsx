import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onUpload, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf' || file.type === 'text/plain') {
      onUpload(file);
    } else {
      alert('Please upload a PDF or TXT file.');
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div 
      id="upload-zone"
      className={`
        relative w-full max-w-2xl mx-auto h-64 border-2 border-dashed rounded-2xl
        flex flex-col items-center justify-center transition-all duration-300
        ${isDragging ? 'border-ink bg-ink/5 scale-[1.02]' : 'border-ink/20 hover:border-ink/40'}
        ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => !isProcessing && document.getElementById('fileInput')?.click()}
    >
      <input 
        id="fileInput"
        type="file" 
        className="hidden" 
        accept=".pdf,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      
      {isProcessing ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-ink" />
          <p className="font-serif italic text-lg">Synthesizing Research Narrative...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="p-4 bg-ink text-bg rounded-full">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-serif italic mb-1">Upload Research CV</h3>
            <p className="text-sm opacity-60 max-w-xs">
              Drag and drop your PDF or TXT CV to generate an interactive academic profile.
            </p>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs font-mono opacity-40">
              <FileText className="w-3 h-3" /> PDF
            </div>
            <div className="flex items-center gap-1 text-xs font-mono opacity-40">
              <FileText className="w-3 h-3" /> TXT
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
