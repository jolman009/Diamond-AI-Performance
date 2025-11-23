import React, { useState } from 'react';
import { getRecruitingSummary } from '../services/geminiService';
import { User, Mail, Share2, Loader2, Edit3 } from 'lucide-react';

const Recruiting: React.FC = () => {
  const [bio, setBio] = useState("I am a hardworking shortstop from Texas looking to play D1 ball. I have a 3.8 GPA.");
  const [stats, setStats] = useState("Batting Avg: .450, Exit Velo: 92mph, 60yd Dash: 6.7s");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getRecruitingSummary(stats, bio);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-3xl font-bold text-white">Recruiting Profile</h2>
         <button className="flex items-center gap-2 text-cyan-400 border border-cyan-500/30 bg-cyan-900/20 px-4 py-2 rounded-lg hover:bg-cyan-900/40 transition-colors">
            <Share2 className="w-4 h-4" /> Share Profile
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-1 space-y-6">
           <div className="space-y-2">
             <label className="text-sm font-bold text-slate-400">Your Bio</label>
             <textarea 
               value={bio}
               onChange={(e) => setBio(e.target.value)}
               className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white h-32 focus:outline-none focus:border-cyan-500"
             />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-bold text-slate-400">Key Stats</label>
             <textarea 
               value={stats}
               onChange={(e) => setStats(e.target.value)}
               className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-cyan-500"
             />
           </div>
           <button 
             onClick={handleGenerate}
             disabled={loading}
             className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
             Generate AI Summary
           </button>
        </div>

        {/* Preview Card */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-900 to-slate-900 h-32 relative">
                 <div className="absolute -bottom-12 left-8 w-24 h-24 bg-slate-300 rounded-full border-4 border-white flex items-center justify-center text-slate-500 font-bold text-2xl">
                    <User className="w-12 h-12" />
                 </div>
              </div>
              <div className="pt-14 px-8 pb-8">
                 <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Alex "The Comet" Rider</h3>
                        <p className="text-slate-500 font-medium">Shortstop | Class of 2026</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                           <Mail className="w-4 h-4" />
                        </div>
                    </div>
                 </div>
                 
                 <div className="mt-6">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">About Me</h4>
                    {loading ? (
                       <div className="space-y-2 animate-pulse">
                          <div className="h-3 bg-slate-200 rounded w-full"></div>
                          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                          <div className="h-3 bg-slate-200 rounded w-4/6"></div>
                       </div>
                    ) : (
                       <p className="text-slate-700 leading-relaxed text-sm">
                          {summary || "Generate an AI summary to populate this section with professional phrasing tailored for recruiters."}
                       </p>
                    )}
                 </div>

                 <div className="mt-6">
                     <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">Verified Metrics</h4>
                     <div className="grid grid-cols-3 gap-4">
                        {stats.split(',').map((stat, i) => (
                           <div key={i} className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                              <p className="text-xs text-slate-500 font-bold">{stat.split(':')[0]}</p>
                              <p className="text-lg font-extrabold text-blue-900">{stat.split(':')[1] || '-'}</p>
                           </div>
                        ))}
                     </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Recruiting;