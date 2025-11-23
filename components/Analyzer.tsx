import React, { useState, useRef, useEffect } from 'react';
import { analyzeMechanics } from '../services/geminiService';
import { Upload, AlertCircle, CheckCircle, Loader2, PlayCircle, Save, Download } from 'lucide-react';

const Analyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  // For a real app, we would use a video element. For this demo, if it's a video, we might just show a placeholder
  // or handle it similarly. The API supports video/mp4.
  const [isVideo, setIsVideo] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResult(null);
      setError(null);
      setIsSaved(false);

      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsVideo(selectedFile.type.startsWith('video/'));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setIsSaved(false);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const analysisText = await analyzeMechanics(base64, file.type, "Analyzing a baseball/softball swing for mechanical efficiency.");
      setResult(analysisText);
    } catch (err) {
      setError("Failed to process the file. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "diamond-ai-analysis.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToProfile = () => {
    if (!result) return;
    setIsSaved(true);
    // In a real app, this would send data to the backend
    setTimeout(() => {
        // Reset state after a delay if needed, or keep it true to show "Saved"
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <span className="bg-cyan-500 w-2 h-8 rounded-full inline-block"></span>
          AI Swing & Pitch Analyzer
        </h2>
        <p className="text-slate-400 mt-2">Upload a video or snapshot of your mechanics. Our Europan AI algorithms will dissect every movement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
            file ? 'border-cyan-500/50 bg-cyan-900/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800'
          }`}>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center">
              {previewUrl ? (
                <div className="relative w-full rounded-lg overflow-hidden shadow-lg max-h-64">
                  {isVideo ? (
                    <video src={previewUrl} controls className="w-full h-full object-contain" />
                  ) : (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  )}
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-200">Click to upload media</p>
                  <p className="text-sm text-slate-500 mt-1">Supports MP4, MOV, JPG, PNG</p>
                </>
              )}
            </label>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform flex items-center justify-center gap-2 ${
              !file || isAnalyzing
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-[1.02] hover:shadow-cyan-500/25'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing Biometrics...
              </>
            ) : (
              <>
                <PlayCircle className="w-6 h-6" />
                Analyze Mechanics
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 min-h-[400px] shadow-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
            <h3 className="text-xl font-bold text-white">Analysis Report</h3>
            {result && (
              <div className="flex gap-2">
                <button 
                  onClick={handleDownload} 
                  title="Download Report" 
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSaveToProfile} 
                  title="Save to Locker Room" 
                  className={`p-2 rounded-lg transition-all flex items-center gap-2 ${isSaved ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-700 text-slate-400 hover:text-white'}`}
                >
                  {isSaved ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-xs font-bold">Saved</span>
                      </>
                  ) : (
                      <Save className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!result && !isAnalyzing && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
              <CheckCircle className="w-16 h-16 mb-4" />
              <p>Ready for data input</p>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-slate-700 rounded w-3/4"></div>
               <div className="h-4 bg-slate-700 rounded w-full"></div>
               <div className="h-4 bg-slate-700 rounded w-5/6"></div>
               <div className="h-32 bg-slate-700 rounded w-full mt-6"></div>
            </div>
          )}

          {result && (
            <div className="prose prose-invert max-w-none">
              {/* Using a safe markdown renderer or just styling plain text with whitespace for now since we can't easily import ReactMarkdown without adding another file/complexity. 
                  I will treat newlines as breaks. */}
              {result.split('\n').map((line, i) => (
                <p key={i} className={`mb-2 ${line.startsWith('#') ? 'text-cyan-400 font-bold text-lg mt-4' : 'text-slate-300'}`}>
                  {line.replace(/^#+\s/, '')}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;