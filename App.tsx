import React, { useState } from 'react';
import { ViewState, UserProfile } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Analyzer from './components/Analyzer';
import TrainingPlan from './components/TrainingPlan';
import MentalGame from './components/MentalGame';
import Recruiting from './components/Recruiting';
import Onboarding from './components/Onboarding';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView(ViewState.DASHBOARD);
  };

  if (currentView === ViewState.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        <div className="relative z-10">
          {currentView === ViewState.DASHBOARD && userProfile && (
            <Dashboard user={userProfile} />
          )}
          {currentView === ViewState.ANALYZER && <Analyzer />}
          {currentView === ViewState.TRAINING && (
            <TrainingPlan user={userProfile || undefined} />
          )}
          {currentView === ViewState.MENTAL && <MentalGame />}
          {currentView === ViewState.RECRUITING && <Recruiting />}
        </div>
      </main>
    </div>
  );
}

export default App;