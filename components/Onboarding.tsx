import React, { useState } from 'react';
import { UserRole, SkillLevel, UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(16);
  const [skill, setSkill] = useState<SkillLevel>(SkillLevel.BEGINNER);
  
  const handleNext = () => {
    if (step === 3) {
       onComplete({
          name,
          role: UserRole.PLAYER,
          age,
          skillLevel: skill,
          positions: ['SS', 'P'],
          goals: ['Improve Bat Speed']
       });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="mb-8 text-center">
           <div className="w-16 h-16 bg-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-2xl font-bold text-white">D</span>
           </div>
           <h1 className="text-2xl font-bold text-white">Welcome to Diamond AI</h1>
           <p className="text-slate-400 text-sm mt-1">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
             <div>
               <label className="block text-sm font-bold text-slate-300 mb-1">What's your name?</label>
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                 placeholder="Enter your name"
                 autoFocus
               />
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
             <div>
               <label className="block text-sm font-bold text-slate-300 mb-1">How old are you?</label>
               <p className="text-xs text-slate-500 mb-3">We adapt the training to your age group.</p>
               <input 
                 type="range" 
                 min="6" 
                 max="25" 
                 value={age}
                 onChange={(e) => setAge(parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
               />
               <div className="text-center mt-4">
                 <span className="text-4xl font-bold text-cyan-400">{age}</span>
                 <span className="text-slate-400 ml-2">years old</span>
               </div>
               <div className="text-center mt-2">
                 {age < 13 ? (
                   <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">Junior League Mode</span>
                 ) : (
                   <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">Pro Prospect Mode</span>
                 )}
               </div>
             </div>
          </div>
        )}

        {step === 3 && (
           <div className="space-y-4 animate-fade-in">
              <label className="block text-sm font-bold text-slate-300 mb-1">Select your skill level</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(SkillLevel).map((s) => (
                   <button
                     key={s}
                     onClick={() => setSkill(s)}
                     className={`p-3 rounded-lg border text-left transition-all ${
                        skill === s 
                        ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                     }`}
                   >
                     {s}
                   </button>
                ))}
              </div>
           </div>
        )}

        <button
          onClick={handleNext}
          disabled={step === 1 && !name}
          className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg"
        >
          {step === 3 ? "Enter Locker Room" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;