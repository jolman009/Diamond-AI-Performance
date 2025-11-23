import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Achievement, VideoEntry, CalendarEvent } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, CartesianGrid, Area, AreaChart 
} from 'recharts';
import { 
  Play, Pause, TrendingUp, Activity, Calendar, Trophy, Star, Medal, Crown, Clock, Film, 
  Zap, Wind, Shield, Flame, ChevronRight, Filter, Rocket, X, AlertCircle, Target,
  SkipBack, SkipForward, Rewind, FastForward, RotateCcw, Settings, Gauge
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
}

// --- Mock Data ---
const exitVelocityData = [
  { date: 'Jan', value: 68 },
  { date: 'Feb', value: 70 },
  { date: 'Mar', value: 72 },
  { date: 'Apr', value: 71 },
  { date: 'May', value: 75 },
  { date: 'Jun', value: 78 },
];

const juniorStats = [
  { name: 'Super Power', value: 80, color: 'bg-yellow-400', icon: Zap, textColor: 'text-yellow-400' },
  { name: 'Lightning Speed', value: 65, color: 'bg-blue-400', icon: Wind, textColor: 'text-blue-400' },
  { name: 'Iron Defense', value: 90, color: 'bg-green-400', icon: Shield, textColor: 'text-green-400' },
];

const skillRadarData = [
  { subject: 'Power', A: 120, fullMark: 150 },
  { subject: 'Contact', A: 98, fullMark: 150 },
  { subject: 'Speed', A: 86, fullMark: 150 },
  { subject: 'Arm', A: 99, fullMark: 150 },
  { subject: 'Fielding', A: 85, fullMark: 150 },
  { subject: 'Mental', A: 65, fullMark: 150 },
];

const mockVideos: VideoEntry[] = [
  { 
    id: '1', 
    title: 'Batting Practice - Tue', 
    date: '2 days ago', 
    score: 82, 
    thumbnail: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=600&auto=format&fit=crop', 
    tags: ['Hitting'],
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    feedbackPoints: [
      { timestamp: 3, text: "Hands are loading well here!", x: 45, y: 40 },
      { timestamp: 8, text: "Good hip rotation torque.", x: 50, y: 60 },
      { timestamp: 12, text: "Follow through slightly off-balance.", x: 55, y: 30 }
    ]
  },
  { 
    id: '2', 
    title: 'Pitching Mechanics', 
    date: '1 week ago', 
    score: 75, 
    thumbnail: 'https://images.unsplash.com/photo-1595210382266-2d0077c1f5bf?q=80&w=600&auto=format&fit=crop', 
    tags: ['Pitching'],
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    feedbackPoints: [
      { timestamp: 2, text: "Leg lift is powerful.", x: 40, y: 50 },
      { timestamp: 6, text: "Arm slot dropping too low.", x: 60, y: 40 }
    ]
  },
  { 
    id: '3', 
    title: 'Fielding Drills', 
    date: '2 weeks ago', 
    score: 88, 
    thumbnail: 'https://images.unsplash.com/photo-1562077772-3bd305261897?q=80&w=600&auto=format&fit=crop', 
    tags: ['Defense'],
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    feedbackPoints: [
      { timestamp: 4, text: "Great glove presentation!", x: 50, y: 80 }
    ]
  },
];

const mockAchievements: Achievement[] = [
  { id: '1', title: 'First Homer', description: 'Hit your first home run recorded.', iconName: 'Trophy', unlocked: true, xpValue: 500 },
  { id: '2', title: 'Speed Demon', description: 'Complete 5 sprint drills.', iconName: 'Activity', unlocked: true, xpValue: 300 },
  { id: '3', title: 'Iron Man', description: 'Train 7 days in a row.', iconName: 'Crown', unlocked: false, xpValue: 1000 },
  { id: '4', title: 'Sniper', description: 'Hit the target 10 times.', iconName: 'Crosshair', unlocked: true, xpValue: 250 },
];

const mockSchedule: CalendarEvent[] = [
  { id: '1', title: 'Batting Cage Session', date: 'Today', time: '4:00 PM', type: 'TRAINING' },
  { id: '2', title: 'Team Practice', date: 'Tomorrow', time: '5:30 PM', type: 'TRAINING' },
  { id: '3', title: 'Lesson with Coach Mike', date: 'Saturday', time: '10:00 AM', type: 'LESSON' },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isJunior = user.age < 13;
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | 'YTD'>('3M');
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry | null>(null);
  
  // Video Player State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const themeColor = isJunior ? 'text-yellow-400' : 'text-cyan-400';
  const themeBg = isJunior ? 'bg-yellow-500' : 'bg-cyan-500';
  const themeBorder = isJunior ? 'border-yellow-500' : 'border-cyan-500';

  const handleVideoClick = (video: VideoEntry) => {
    setSelectedVideo(video);
    setCurrentTime(0);
    setIsPlaying(true);
    setPlaybackRate(1);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
        setDuration(videoRef.current.duration);
        // Attempt auto-play when loaded
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleVideoEnded = () => {
      setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    }
  };

  const jumpToTimestamp = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
          videoRef.current.play();
          setIsPlaying(true);
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
      setPlaybackRate(rate);
      if (videoRef.current) {
          videoRef.current.playbackRate = rate;
      }
  };

  const stepFrame = (frames: number) => {
      if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
          // Assuming 30fps = ~0.033s per frame
          videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + (frames * 0.033), 0), duration);
      }
  };

  const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
          window.clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
          if (isPlaying) setShowControls(false);
      }, 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
        case 'Trophy': return Trophy;
        case 'Activity': return Activity;
        case 'Crown': return Crown;
        case 'Crosshair': return Target;
        default: return Star;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs mb-1 font-mono">{label}</p>
          <div className="flex items-end gap-1">
             <span className="text-cyan-400 font-bold text-xl">{payload[0].value}</span>
             <span className="text-xs text-slate-500 font-medium mb-1">MPH</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-8 pb-24 md:pb-6 relative">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className={`text-3xl font-extrabold ${isJunior ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse' : 'text-white'}`}>
            {isJunior ? `Welcome, Captain ${user.name}!` : 'Performance Dashboard'}
          </h2>
          <p className="text-slate-400 mt-1">
            {isJunior ? "Ready for today's mission? Let's play ball!" : `Tracking metrics for ${user.positions.join('/')} development.`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${isJunior ? 'bg-orange-900/30 border-orange-500/50' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex flex-col items-center">
                    <p className={`text-[10px] uppercase font-bold ${isJunior ? 'text-orange-400' : 'text-slate-500'}`}>Streak</p>
                    <p className={`text-xl font-black ${isJunior ? 'text-orange-400' : 'text-white'}`}>5</p>
                </div>
                {isJunior ? <Flame className="w-8 h-8 text-orange-500 animate-bounce" /> : <Flame className="w-5 h-5 text-slate-500" />}
            </div>

            {/* Junior XP / Pro Status */}
            {isJunior && (
                <div className="px-4 py-2 bg-yellow-900/30 rounded-xl border border-yellow-500/50 flex items-center gap-3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-yellow-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div>
                        <p className="text-[10px] text-yellow-500 uppercase font-bold">Level 12</p>
                        <div className="w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                           <div className="h-full bg-yellow-400 w-3/4 rounded-full"></div>
                        </div>
                    </div>
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
            )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          <section className={`rounded-2xl p-6 border relative overflow-hidden ${isJunior ? 'bg-slate-800 border-slate-700' : 'bg-slate-800 border-slate-700'}`}>
             {/* Junior Background decoration */}
             {isJunior && <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>}

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {isJunior ? <Rocket className="w-6 h-6 text-purple-400" /> : <TrendingUp className="w-5 h-5 text-cyan-400" />}
                {isJunior ? 'My Super Stats' : 'Analytics Center'}
              </h3>
              
              {!isJunior && (
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                   {['1M', '3M', 'YTD'].map((range) => (
                      <button 
                        key={range}
                        onClick={() => setTimeRange(range as any)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${timeRange === range ? 'bg-cyan-900 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                      >
                        {range}
                      </button>
                   ))}
                </div>
              )}
            </div>
            
            {isJunior ? (
              // JUNIOR STATS VIEW - Playful & Icon driven
              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {juniorStats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.name} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-all hover:-translate-y-1">
                           <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-20`}>
                                 <Icon className={`w-6 h-6 ${stat.textColor}`} />
                              </div>
                              <span className="font-bold text-slate-200">{stat.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${stat.color} transition-all duration-1000`}
                                  style={{ width: `${stat.value}%` }}
                                ></div>
                             </div>
                             <span className={`text-sm font-bold ${stat.textColor}`}>{stat.value}</span>
                           </div>
                        </div>
                      )
                   })}
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 rounded-xl border border-purple-500/30 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                      <Trophy className="w-6 h-6 text-purple-400 animate-pulse" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-lg">New Record!</p>
                      <p className="text-slate-300 text-sm">You threw 5 strikes in a row! Awesome!</p>
                   </div>
                </div>
              </div>
            ) : (
              // PRO STATS VIEW - Detailed & Interactive
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-72 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-400">Exit Velocity Progression</h4>
                    <span className="text-xs text-green-400 flex items-center bg-green-900/20 px-2 py-0.5 rounded border border-green-500/20">
                       <TrendingUp className="w-3 h-3 mr-1" /> +12%
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={exitVelocityData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-72 w-full hidden md:block relative">
                   <div className="flex items-center justify-between mb-2">
                       <h4 className="text-sm font-bold text-slate-400">Skill Composition</h4>
                       <Filter className="w-4 h-4 text-slate-600 cursor-pointer hover:text-slate-300" />
                   </div>
                   <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                        <Radar name="Skills" dataKey="A" stroke="#0ea5e9" strokeWidth={2} fill="#0ea5e9" fillOpacity={0.4} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} itemStyle={{ color: '#38bdf8' }} />
                      </RadarChart>
                   </ResponsiveContainer>
                   <div className="absolute bottom-0 right-0 text-[10px] text-slate-600">
                      *Compared to D1 Avg
                   </div>
                </div>
              </div>
            )}
          </section>

          {/* Video Library */}
          <section>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {isJunior ? <Film className="w-6 h-6 text-pink-400" /> : <Film className="w-5 h-5 text-cyan-400" />}
                    {isJunior ? 'My Replays' : 'Film Room'}
                </h3>
                <button className={`text-sm flex items-center transition-colors ${isJunior ? 'text-pink-400 hover:text-pink-300' : 'text-cyan-400 hover:text-cyan-300'}`}>
                   View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {mockVideos.map((video) => (
                   <div 
                      key={video.id} 
                      onClick={() => handleVideoClick(video)}
                      className={`group relative rounded-xl overflow-hidden border transition-all shadow-lg cursor-pointer ${isJunior ? 'bg-slate-800 border-slate-700 hover:scale-105 hover:border-pink-500/50' : 'bg-slate-800 border-slate-700 hover:border-cyan-500/50'}`}
                    >
                      <div className="aspect-video relative">
                         <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className={`p-3 rounded-full ${isJunior ? 'bg-pink-500 text-white' : 'bg-cyan-500 text-white'}`}>
                                <Play className="w-6 h-6 fill-current" />
                            </div>
                         </div>
                         <div className="absolute top-2 right-2 bg-slate-900/90 px-2 py-0.5 rounded text-xs text-white font-mono border border-slate-700">
                            {video.score}
                         </div>
                      </div>
                      <div className="p-3">
                         <h4 className="font-semibold text-slate-200 truncate text-sm">{video.title}</h4>
                         <p className="text-xs text-slate-500 mt-1">{video.date}</p>
                      </div>
                   </div>
                ))}
             </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
           
           {/* Schedule */}
           <section className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-indigo-400" />
                 {isJunior ? 'Calendar' : 'Upcoming Schedule'}
              </h3>
              <div className="space-y-3">
                 {mockSchedule.map((event) => (
                    <div key={event.id} className="flex gap-3 items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors group">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${event.type === 'GAME' ? 'bg-red-500/20 text-red-400' : event.type === 'LESSON' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-400'}`}>
                          {event.date.substring(0,3)}
                       </div>
                       <div>
                          <p className="text-slate-200 font-medium text-sm group-hover:text-white transition-colors">{event.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                             <Clock className="w-3 h-3" /> {event.time}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           {/* Achievements / Trophy Case - Split Logic */}
           {isJunior ? (
               <section className="rounded-2xl p-5 border border-yellow-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-yellow-900/20 relative overflow-hidden">
                   {/* Background decoration */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>

                   <div className="flex justify-between items-center mb-4 relative z-10">
                       <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 flex items-center gap-2">
                           <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                           Trophy Case
                       </h3>
                       <span className="text-xs font-bold text-yellow-500/80 uppercase tracking-widest">Level 12</span>
                   </div>

                   <div className="grid grid-cols-2 gap-4 relative z-10">
                       {mockAchievements.map((ach) => {
                           const Icon = getAchievementIcon(ach.iconName);
                           return (
                               <div key={ach.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all duration-300 group ${
                                   ach.unlocked 
                                       ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:scale-105 hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:-translate-y-1' 
                                       : 'bg-slate-900/80 border-2 border-slate-700 opacity-60 grayscale'
                               }`}>
                                   <div className={`mb-3 relative ${ach.unlocked ? 'animate-bounce-slow' : ''}`}>
                                        {/* Glow behind icon */}
                                        {ach.unlocked && <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full"></div>}
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center relative z-10 ${ach.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' : 'bg-slate-700 text-slate-500'}`}>
                                            <Icon className={`w-8 h-8 ${ach.unlocked ? 'fill-current' : ''}`} />
                                        </div>
                                   </div>
                                   <p className={`font-bold text-sm leading-tight ${ach.unlocked ? 'text-yellow-100' : 'text-slate-500'}`}>{ach.title}</p>
                                   {ach.unlocked && <div className="mt-2 text-[10px] font-bold text-yellow-500 bg-yellow-900/30 px-2 py-0.5 rounded-full border border-yellow-500/30">+{ach.xpValue} XP</div>}
                               </div>
                           );
                       })}
                   </div>
               </section>
           ) : (
               <section className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="text-lg font-bold text-white flex items-center gap-2">
                           <Medal className="w-5 h-5 text-cyan-400" />
                           Recent Achievements
                       </h3>
                   </div>
                   <div className="space-y-3">
                       {mockAchievements.map((ach) => {
                           const Icon = getAchievementIcon(ach.iconName);
                           return (
                               <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${ach.unlocked ? 'bg-slate-900 border-slate-700 hover:border-slate-500' : 'bg-slate-900/50 border-slate-800 opacity-60'}`}>
                                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${ach.unlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-600'}`}>
                                       <Icon className="w-5 h-5" />
                                   </div>
                                   <div>
                                       <h4 className={`font-bold text-sm ${ach.unlocked ? 'text-slate-200' : 'text-slate-500'}`}>{ach.title}</h4>
                                       <p className="text-xs text-slate-500">{ach.description}</p>
                                   </div>
                                   {ach.unlocked && <div className="ml-auto text-xs font-mono text-cyan-500">+{ach.xpValue}</div>}
                               </div>
                           );
                       })}
                   </div>
               </section>
           )}
        </div>
      </div>

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-slate-700 max-h-[90vh]">
            
            {/* Main Video Area */}
            <div 
              className="flex-1 relative bg-black flex items-center justify-center group select-none"
              onMouseMove={handleMouseMove}
              onClick={togglePlay}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); closeVideo(); }} 
                className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <video 
                ref={videoRef}
                src={selectedVideo.url} 
                className="w-full h-full max-h-[80vh] object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
              />
              
              {/* Center Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm p-6 rounded-full border border-white/20 shadow-2xl scale-100 transition-transform">
                        <Play className="w-12 h-12 fill-white text-white ml-2" />
                    </div>
                </div>
              )}

              {/* Advanced Control Bar Overlay */}
              <div 
                className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 z-40 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => e.stopPropagation()} // Prevent play toggle when clicking controls
              >
                  {/* Scrubber */}
                  <div className="flex items-center gap-4 mb-2">
                     <span className="text-xs font-mono text-slate-300 w-10 text-right">{formatTime(currentTime)}</span>
                     <input 
                       type="range" 
                       min="0" 
                       max={duration || 100} 
                       step="0.01"
                       value={currentTime} 
                       onChange={handleSeek}
                       className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:h-2 transition-all"
                     />
                     <span className="text-xs font-mono text-slate-500 w-10">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                     {/* Playback Controls */}
                     <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>
                        
                        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-white/10">
                            <button onClick={() => stepFrame(-1)} className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors" title="Previous Frame">
                                <SkipBack className="w-4 h-4" />
                            </button>
                            <button onClick={() => stepFrame(1)} className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors" title="Next Frame">
                                <SkipForward className="w-4 h-4" />
                            </button>
                        </div>

                        <button onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                                videoRef.current.play();
                                setIsPlaying(true);
                            }
                        }} className="text-slate-400 hover:text-white transition-colors" title="Replay">
                             <RotateCcw className="w-5 h-5" />
                        </button>
                     </div>

                     {/* Speed Controls */}
                     <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-600 backdrop-blur-sm">
                             <Gauge className="w-3 h-3 text-slate-400 ml-1" />
                             {[0.25, 0.5, 1.0].map((rate) => (
                                 <button
                                    key={rate}
                                    onClick={() => changePlaybackRate(rate)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${playbackRate === rate ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                                 >
                                     {rate}x
                                 </button>
                             ))}
                         </div>
                     </div>
                  </div>
              </div>

              {/* Feedback Overlays - Repositioned to be under controls if needed or z-index managed */}
              {selectedVideo.feedbackPoints?.map((point, idx) => {
                  const isVisible = Math.abs(currentTime - point.timestamp) < 1.5;
                  if (!isVisible) return null;
                  
                  return (
                      <div 
                        key={idx}
                        className="absolute pointer-events-none animate-bounce-in z-20"
                        style={{ 
                            left: `${point.x || 50}%`, 
                            top: `${point.y || 50}%`,
                            transform: 'translate(-50%, -50%)' 
                        }}
                      >
                        <div className={`${themeBg}/90 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl shadow-xl backdrop-blur-md border border-white/20 whitespace-nowrap mb-2 relative`}>
                            {point.text}
                            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-${isJunior ? 'yellow-500' : 'cyan-500'}/90`}></div>
                        </div>
                        <div className={`w-4 h-4 ${themeBg} rounded-full mx-auto shadow-[0_0_15px_currentColor] ring-2 ring-white`}></div>
                      </div>
                  );
              })}
            </div>

            {/* Sidebar / Feedback List */}
            <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
              <div className="p-5 border-b border-slate-800 bg-slate-900">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">{selectedVideo.title}</h3>
                <p className="text-slate-400 text-sm">{selectedVideo.date} • AI Score: <span className={`${themeColor} font-bold`}>{selectedVideo.score}</span></p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-800/50">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Activity className="w-3 h-3" /> AI Analysis Timeline
                </h4>
                {selectedVideo.feedbackPoints?.map((point, idx) => {
                    const isActive = Math.abs(currentTime - point.timestamp) < 1.5;
                    return (
                        <button 
                            key={idx}
                            onClick={() => jumpToTimestamp(point.timestamp)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 group relative overflow-hidden ${
                                isActive 
                                ? `${themeBg}/10 ${themeBorder} ring-1 ring-${isJunior ? 'yellow-500' : 'cyan-500'}` 
                                : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                            }`}
                        >
                            {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 ${themeBg}`}></div>}
                            <div className={`${isActive ? themeColor : 'text-slate-500'} font-mono text-xs font-bold pt-1`}>
                                0:{point.timestamp.toString().padStart(2, '0')}
                            </div>
                            <div>
                                <p className={`text-sm ${isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                                    {point.text}
                                </p>
                            </div>
                        </button>
                    )
                })}
                {(!selectedVideo.feedbackPoints || selectedVideo.feedbackPoints.length === 0) && (
                    <div className="text-center text-slate-500 py-10 text-sm flex flex-col items-center">
                        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                        No specific feedback points detected.
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;