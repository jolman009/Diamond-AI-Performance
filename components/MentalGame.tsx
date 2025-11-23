import React, { useState } from 'react';
import { generateMentalDrill } from '../services/geminiService';
import { Brain, Zap, Wind, Sparkles, Loader2 } from 'lucide-react';

const MentalGame: React.FC = () => {
  const [activeResponse, setActiveResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const topics = [
    { id: 'confidence', label: 'Pre-Game Confidence', icon: Zap, color: 'text-yellow-400' },
    { id: 'focus', label: 'Deep Focus', icon: Brain, color: 'text-purple-400' },
    { id: 'pressure', label: 'Clutch Situations', icon: Sparkles, color: 'text-cyan-400' },
    { id: 'reset', label: 'Reset After Error', icon: Wind, color: 'text-green-400' },
  ];

  const handleTopicClick = async (topic: string) => {
    setLoading(true);
    setActiveResponse(null);
    const response = await generateMentalDrill(topic);
    setActiveResponse(response);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6 h-full">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Mental Game Zone</h2>
        <p className="text-slate-400">Train your mind just as hard as your body.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => handleTopicClick(t.label)}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group"
            >
              <Icon className={`w-8 h-8 ${t.color} group-hover:scale-110 transition-transform`} />
              <span className="text-slate-200 font-medium text-sm">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none" />
        
        {loading ? (
           <div className="flex flex-col items-center gap-4 z-10">
             <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
             <p className="text-cyan-400 font-mono text-sm">Synthesizing neural patterns...</p>
           </div>
        ) : activeResponse ? (
          <div className="z-10 max-w-2xl text-left animate-fade-in">
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
               <Brain className="w-5 h-5 text-cyan-400" /> Drill Generated
             </h3>
             <div className="prose prose-invert text-slate-300">
                {activeResponse.split('\n').map((line, i) => (
                   <p key={i} className="mb-2">{line}</p>
                ))}
             </div>
          </div>
        ) : (
          <div className="z-10 opacity-40">
             <Brain className="w-20 h-20 text-slate-600 mx-auto mb-4" />
             <p className="text-slate-400">Select a mental aspect above to generate a guided visualization.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalGame;