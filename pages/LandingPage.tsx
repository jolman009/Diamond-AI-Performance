import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Video, Brain, Target, TrendingUp, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: 'AI Video Analysis',
      description: 'Upload your swings and get instant biomechanical feedback from our advanced AI coach.',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Mental Game Training',
      description: 'Build mental toughness with visualization exercises and performance psychology techniques.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Personalized Drills',
      description: 'Get custom training plans based on your skill level, position, and goals.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Progress Tracking',
      description: 'Track your improvement over time with detailed analytics and performance metrics.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Recruiting Profile',
      description: 'Build your recruiting profile and showcase your skills to college coaches.',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Achievement System',
      description: 'Earn XP, unlock achievements, and stay motivated throughout your journey.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold">Diamond AI</span>
          <span className="text-sm text-blue-400 font-semibold">Europa Edition</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-white hover:text-blue-400 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
            <span className="text-blue-300 font-semibold">Next-Gen Baseball & Softball Training</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Train Like a Pro with AI-Powered Coaching
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            Diamond AI combines cutting-edge artificial intelligence with elite-level coaching to help you
            master your mechanics, elevate your mental game, and reach your full potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/50"
            >
              Start Training Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold text-lg transition-all border border-white/20"
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Everything You Need to Excel</h2>
        <p className="text-center text-slate-400 mb-12 text-lg">
          Comprehensive training tools designed for players, coaches, and parents
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30 p-12 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-slate-300">Athletes Training</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">50,000+</div>
              <div className="text-slate-300">Videos Analyzed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-slate-300">Improvement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Game?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of athletes using Diamond AI to reach their full potential.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-bold text-xl transition-all hover:scale-105 shadow-xl shadow-blue-500/50"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-400">
        <div className="container mx-auto px-6">
          <p>&copy; 2025 Diamond AI - Europa Edition. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
