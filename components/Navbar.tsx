import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ViewState } from '../types';
import { Activity, Camera, Brain, Trophy, User, LayoutDashboard, Upload } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const location = useLocation();
  const isUploadPage = location.pathname === '/app/upload';

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Locker Room', icon: LayoutDashboard },
    { id: ViewState.ANALYZER, label: 'AI Analyzer', icon: Camera },
    { id: ViewState.TRAINING, label: 'Training Plan', icon: Activity },
    { id: ViewState.MENTAL, label: 'Mental Zone', icon: Brain },
    { id: ViewState.RECRUITING, label: 'Recruiting', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 md:relative md:w-64 md:h-screen md:border-r md:border-t-0 md:flex md:flex-col z-50">
      <div className="hidden md:flex items-center justify-center h-20 border-b border-slate-700">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          DIAMOND AI
        </h1>
      </div>
      
      <div className="flex md:flex-col justify-around md:justify-start md:p-4 h-16 md:h-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id && !isUploadPage;
          return (
            <Link
              key={item.id}
              to="/app"
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col md:flex-row items-center md:p-3 md:mb-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-6 h-6 md:mr-3 ${isActive ? 'stroke-2' : 'stroke-1'}`} />
              <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">{item.label}</span>
            </Link>
          );
        })}

        {/* Upload Link */}
        <Link
          to="/app/upload"
          className={`flex flex-col md:flex-row items-center md:p-3 md:mb-2 rounded-xl transition-all duration-200 ${
            isUploadPage
              ? 'text-cyan-400 bg-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Upload className={`w-6 h-6 md:mr-3 ${isUploadPage ? 'stroke-2' : 'stroke-1'}`} />
          <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">Upload</span>
        </Link>
      </div>
      
      <div className="hidden md:block mt-auto p-4 border-t border-slate-700">
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-100">Pro Member</span>
          </div>
          <p className="text-xs text-slate-300">Next session: Today 4PM</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;