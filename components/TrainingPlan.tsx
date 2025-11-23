import React from 'react';
import { UserProfile, Drill } from '../types';
import { Play, Clock, BarChart, Gamepad2, Zap, Dumbbell, Activity } from 'lucide-react';

interface TrainingPlanProps {
  user?: UserProfile;
}

const allDrills: Drill[] = [
  // JUNIOR DRILLS
  {
    name: "T-Rex Arms",
    category: "Batting",
    duration: "10 min",
    difficulty: "Beginner",
    description: "Keep your elbows in like a T-Rex to hit the ball harder!",
    ageGroup: "JUNIOR",
  },
  {
    name: "Statue of Liberty",
    category: "Pitching",
    duration: "10 min",
    difficulty: "Beginner",
    description: "Hold your finish pose like a statue for 3 seconds after every throw.",
    ageGroup: "JUNIOR",
  },
  {
    name: "Zombie Dodgeball",
    category: "Agility",
    duration: "15 min",
    difficulty: "Easy",
    description: "Move your feet fast to dodge the imaginary zombies!",
    ageGroup: "JUNIOR",
  },
  // PRO DRILLS
  {
    name: "Hip Separation / Torque",
    category: "Biomechanics",
    duration: "20 min",
    difficulty: "Advanced",
    description: "Focus on X-Factor stretch. Maximize hip-shoulder separation.",
    ageGroup: "SENIOR",
  },
  {
    name: "High-Velo Tee Progression",
    category: "Batting",
    duration: "25 min",
    difficulty: "Intermediate",
    description: "Top hand isolation followed by high-tee torque drills.",
    ageGroup: "SENIOR",
  },
  {
    name: "Changeup Grip Mastery",
    category: "Pitching",
    duration: "15 min",
    difficulty: "Advanced",
    description: "Circle change mechanics. Maintain arm speed to deceive batter.",
    ageGroup: "SENIOR",
  }
];

const TrainingPlan: React.FC<TrainingPlanProps> = ({ user }) => {
  const isJunior = user && user.age < 13;
  const filteredDrills = allDrills.filter(d => 
    isJunior ? d.ageGroup === 'JUNIOR' : d.ageGroup === 'SENIOR'
  );

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 md:pb-6">
       <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${isJunior ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400' : 'text-white'}`}>
            {isJunior ? "Today's Fun Missions" : "Daily Training Regimen"}
          </h2>
          <p className="text-slate-400">
            {isJunior ? "Complete these to earn 500 XP!" : "AI-generated protocol based on your mechanics analysis."}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-500 uppercase tracking-widest">Focus Area</p>
          <p className={`text-xl font-bold ${isJunior ? 'text-green-400' : 'text-cyan-400'}`}>
            {isJunior ? 'Super Speed' : 'Power Output'}
          </p>
        </div>
      </header>

      {/* Progress / Status Bar */}
      <div className="mb-8 bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
          <div className={`p-3 rounded-full ${isJunior ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
             {isJunior ? <Gamepad2 className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
          </div>
          <div className="flex-1">
             <div className="flex justify-between text-sm mb-2 text-slate-300">
                <span className="font-bold">{isJunior ? "Mission Progress" : "Weekly Workload"}</span>
                <span>30%</span>
             </div>
             <div className="w-full bg-slate-700 rounded-full h-2">
                <div className={`h-2 rounded-full w-[30%] ${isJunior ? 'bg-green-500' : 'bg-blue-500'}`}></div>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredDrills.map((drill, index) => (
          <div 
            key={index} 
            className={`
              rounded-xl p-6 border transition-all hover:scale-[1.01] cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
              ${isJunior 
                ? 'bg-slate-800 border-slate-700 hover:border-green-400/50 hover:bg-slate-800/90' 
                : 'bg-slate-800 border-slate-700 hover:border-cyan-500/30'
              }
            `}
          >
            <div className="flex items-start gap-4">
               <div className={`
                 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors
                 ${isJunior ? 'bg-slate-700 text-green-400 group-hover:bg-green-900/30' : 'bg-slate-700 text-cyan-400 group-hover:bg-cyan-900/30'}
               `}>
                  {/* Icon based on category if we wanted, for now just index or generic */}
                  {isJunior ? <Zap className="w-8 h-8 fill-current" /> : <Dumbbell className="w-6 h-6" />}
               </div>
               <div>
                  <h4 className={`text-lg font-bold group-hover:text-white transition-colors ${isJunior ? 'text-white' : 'text-slate-200'}`}>
                    {drill.name}
                  </h4>
                  <p className="text-slate-400 text-sm mb-2">{drill.description}</p>
                  <div className="flex gap-3 text-xs text-slate-500 font-mono">
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {drill.duration}</span>
                     <span className="flex items-center gap-1"><BarChart className="w-3 h-3" /> {drill.difficulty}</span>
                     <span className="px-2 py-0.5 bg-slate-700 rounded text-[10px] uppercase tracking-wider">{drill.category}</span>
                  </div>
               </div>
            </div>
            
            <button className={`
              w-full sm:w-auto px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors
              ${isJunior 
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' 
                : 'bg-slate-700 hover:bg-cyan-600 text-white'
              }
            `}>
              <Play className="w-4 h-4 fill-current" />
              {isJunior ? "Let's Go!" : "Start Module"}
            </button>
          </div>
        ))}
      </div>

      {/* Coach Note / Tip */}
      <div className={`mt-8 rounded-2xl p-6 border text-center ${isJunior ? 'bg-gradient-to-r from-orange-900/40 to-yellow-900/40 border-yellow-500/30' : 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500/30'}`}>
         <h3 className={`text-xl font-bold mb-2 ${isJunior ? 'text-yellow-400' : 'text-white'}`}>
           {isJunior ? "Coach says:" : "Instructor Note"}
         </h3>
         <p className={`${isJunior ? 'text-yellow-100' : 'text-indigo-200 italic'}`}>
           {isJunior 
             ? "\"Remember to have fun! Swing hard in case you hit it!\""
             : "\"Focus on the hip drive today. Your last analysis showed slightly early trunk rotation.\""
           }
         </p>
      </div>
    </div>
  );
};

export default TrainingPlan;