import React, { useState, useEffect } from 'react';
import { Vote, FileText, Settings, BarChart2, Home, Landmark, ShieldCheck, Mail, BookOpen, Clock, Sparkles } from 'lucide-react';
import VoterPortal from './components/VoterPortal';
import AdminPortal from './components/AdminPortal';
import ResultsDisplay from './components/ResultsDisplay';
import ProjectDetails from './components/ProjectDetails';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'voter' | 'admin' | 'results' | 'report'>('home');
  const [systime, setSystime] = useState(new Date().toLocaleTimeString());
  const [stats, setStats] = useState({
    total_elections: 0,
    total_voters: 0,
    total_votes: 0
  });

  // Keep live time for high programmatic fidelity
  useEffect(() => {
    const handle = setInterval(() => {
      setSystime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(handle);
  }, []);

  // Sync quick stats for landing metrics
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          total_elections: data.total_elections || 0,
          total_voters: data.total_voters || 0,
          total_votes: data.total_votes || 0
        });
      })
      .catch(err => console.error('Error fetching dashboard specs:', err));
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333333] flex flex-col font-sans" id="ovs-app-canvas">
      
      {/* 1. TOP HEADER BRAND BAR */}
      <header className="bg-[#1F4E79] text-white shadow-md relative overflow-hidden" id="ovs-brand-header">
        {/* Subtle decorative geometric background grids */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute left-1/4 bottom-0 translate-y-12 w-32 h-32 bg-white/5 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 h-auto sm:h-18">
          
          <div 
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90"
            onClick={() => setCurrentTab('home')}
            id="brand-logo"
          >
            <div className="bg-white/10 p-2 rounded-lg border border-white/10 text-white">
              <Landmark className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight flex items-center gap-1.5 uppercase font-mono">
                Online Voting System <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full lowercase tracking-normal">secure</span>
              </h1>
              <p className="text-[10px] text-slate-300 font-medium">
                Advance Institute of Science and Technology, Dehradun
              </p>
            </div>
          </div>

          {/* Quick presentation details & real clock */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300 bg-black/15 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              {systime}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-[#28A745] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              AES-256 Verified
            </span>
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC NAV DIRECTORY BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs" id="ovs-main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap h-12" id="nav-tabs-bar">
            
            <button
              id="nav-home-btn"
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentTab === 'home'
                  ? 'border-[#1F4E79] text-[#1F4E79]'
                  : 'border-transparent text-slate-500 hover:text-[#1F4E79]'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <button
              id="nav-voter-btn"
              onClick={() => setCurrentTab('voter')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentTab === 'voter'
                  ? 'border-[#1F4E79] text-[#1F4E79]'
                  : 'border-transparent text-slate-500 hover:text-[#1F4E79]'
              }`}
            >
              <Vote className="w-4 h-4" />
              Voter Portal
            </button>

            <button
              id="nav-results-btn"
              onClick={() => setCurrentTab('results')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentTab === 'results'
                  ? 'border-[#1F4E79] text-[#1F4E79]'
                  : 'border-transparent text-slate-500 hover:text-[#1F4E79]'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Real-time Results
            </button>

            <button
              id="nav-admin-btn"
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentTab === 'admin'
                  ? 'border-[#1F4E79] text-[#1F4E79]'
                  : 'border-transparent text-slate-500 hover:text-[#1F4E79]'
              }`}
            >
              <Settings className="w-4 h-4" />
              Admin Room
            </button>

            <button
              id="nav-report-btn"
              onClick={() => setCurrentTab('report')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentTab === 'report'
                  ? 'border-[#1F4E79] text-[#1F4E79]'
                  : 'border-transparent text-slate-500 hover:text-[#1F4E79]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Academic Report (PDF)
            </button>

          </nav>
        </div>
      </div>

      {/* 3. MAIN TAB CONTENT BOX PANEL */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" id="ovs-main-viewport">
        
        {/* VIEW A: HOME / LANDING PAGE */}
        {currentTab === 'home' && (
          <div className="space-y-8 animate-fadeIn" id="panel-home">
            
            {/* Academic Submitted Citation Jumbotron banner */}
            <div className="bg-[#EBF3FB] rounded-2xl border border-blue-100 p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center md:justify-between gap-6">
              <div className="space-y-3 z-10 text-center md:text-left">
                <span className="bg-[#1F4E79]/10 text-[#1F4E79] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Academic Presentation Profile
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1F4E79] tracking-tight">
                  Online Voting System (OVS)
                </h2>
                <p className="text-slate-600 text-xs md:text-sm max-w-2xl leading-relaxed">
                  A fully functional 3-Tier e-voting system designed as a secure web-based electronic voting platform. Built for the final BCA 6th Semester submission at <strong>Advance Institute of Science and Technology, Dehradun</strong>.
                </p>
                
                {/* Submitters names */}
                <div className="pt-2 flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs">
                  <span className="bg-white border border-blue-200/50 rounded-lg px-3 py-1.5 text-slate-800 font-serif leading-none shadow-xs">
                    Submitted by: <strong className="font-sans font-bold text-[#1F4E79]">Kushal Mohan</strong>
                  </span>
                  <span className="bg-white border border-blue-200/50 rounded-lg px-3 py-1.5 text-slate-800 font-serif leading-none shadow-xs">
                    Submitted by: <strong className="font-sans font-bold text-[#1F4E79]">Golu Chaudhary</strong>
                  </span>
                </div>
              </div>

              {/* Glowing Icon representation */}
              <div className="relative text-center hidden md:block">
                <div className="w-24 h-24 rounded-full bg-white text-[#1F4E79] border-4 border-blue-100/60 shadow flex items-center justify-center font-bold text-3xl">
                  <Vote className="w-12 h-12 text-[#1F4E79]" />
                </div>
              </div>
            </div>

            {/* Quick stats board */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Ballots Posted</span>
                <span className="text-2xl md:text-3xl font-extrabold text-[#1F4E79] mt-2">{stats.total_elections}</span>
                <span className="text-[9px] text-[#2E75B6] mt-1 font-sans">Active & Draft pools</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Electors Registered</span>
                <span className="text-2xl md:text-3xl font-extrabold text-[#1F4E79] mt-2">{stats.total_voters}</span>
                <span className="text-[9px] text-green-600 mt-1 font-sans font-semibold">100% Verified Accounts</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Ballots Polled</span>
                <span className="text-2xl md:text-3xl font-extrabold text-green-600 mt-2">{stats.total_votes}</span>
                <span className="text-[9px] text-[#2E75B6] mt-1 font-sans font-semibold">AES-256 double-checked</span>
              </div>
            </div>

            {/* Action directions Call and Grid of Features */}
            <div className="grid md:grid-cols-3 gap-6" id="home-featured-links">
              
              <div 
                onClick={() => setCurrentTab('voter')}
                className="bg-white hover:bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:border-[#1F4E79]/40 cursor-pointer shadow-xs transition group space-y-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] text-[#1F4E79] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition">
                  <Vote className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1F4E79] group-hover:underline">Voter Sign-In Portal</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Access eligible active elections, view candidate profiles, and cast your ballot securely. Double-vote checks enforced immediately.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => setCurrentTab('results')}
                className="bg-white hover:bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:border-[#1F4E79]/40 cursor-pointer shadow-xs transition group space-y-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] text-[#1F4E79] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1F4E79] group-hover:underline">Real-Time Poll Results</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Check election tallies immediately, read automated percentages, and view frontrunner winner badges with complete database-checked audits.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => setCurrentTab('report')}
                className="bg-white hover:bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:border-[#1F4E79]/40 cursor-pointer shadow-xs transition group space-y-4"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-800 group-hover:underline">Academic Project Report</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Perfect replica of the 50-page BCA 6th Semester original project documentation, certificates of authenticity, abstract, and validation testing.
                  </p>
                </div>
              </div>

            </div>

            {/* Platform Trust banner footer with badges */}
            <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left" id="trust-banner">
              <div className="space-y-0.5">
                <p className="font-bold text-xs text-slate-800 flex items-center justify-center md:justify-start gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Democratic Integrity Assured
                </p>
                <p className="text-[11px] text-slate-500">Every single transaction check complies completely with cyber research requirements.</p>
              </div>

              {/* Cyber Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[9px] font-bold text-slate-500">
                <span className="bg-slate-100 px-2.5 py-1 rounded">Bcrypt Salt Passwords</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded">No-Concatenate PDO SQL</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded">Anti-Double Ballot Block</span>
              </div>
            </div>

          </div>
        )}

        {/* VIEW B: VOTER PORTAL MODULE */}
        {currentTab === 'voter' && (
          <div className="animate-fadeIn" id="panel-voter-portal">
            <VoterPortal />
          </div>
        )}

        {/* VIEW C: ADMIN PORTAL MODULE */}
        {currentTab === 'admin' && (
          <div className="animate-fadeIn" id="panel-admin-portal">
            <AdminPortal />
          </div>
        )}

        {/* VIEW D: REAL TIME RESULTS */}
        {currentTab === 'results' && (
          <div className="animate-fadeIn" id="panel-results-display">
            <ResultsDisplay />
          </div>
        )}

        {/* VIEW E: PROJECT REPLICATED REPORT */}
        {currentTab === 'report' && (
          <div className="animate-fadeIn" id="panel-project-report">
            <ProjectDetails />
          </div>
        )}

      </main>

      {/* 4. FOOTER CREDITS BRANDING ACCENT */}
      <footer className="bg-[#1F4E79] text-white border-t border-[#2E75B6]/20 mt-12 py-8 text-xs font-sans text-center transition" id="ovs-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-2 text-slate-300 font-mono text-[10px]">
            <span>PHP 8.x + MySQL model</span>
            <span>•</span>
            <span>Tailwind React Platform</span>
            <span>•</span>
            <span>Bcrypt Security</span>
            <span>•</span>
            <span>E-Voting Standards compliant</span>
          </div>

          <div className="w-16 h-0.5 bg-slate-400/25 mx-auto rounded" />

          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              Advance Institute of Science and Technology, Dehradun
            </p>
            <p className="text-slate-400 text-[11px]">
              BCA 6th Semester Project • Session 2023 - 2026 • Under supervisors guided documentation.
            </p>
          </div>

          <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest pt-1">
            Developed & Authored by <strong className="text-slate-300">Kushal Mohan</strong> & <strong className="text-slate-300">Golu Chaudhary</strong>
          </p>
        </div>
      </footer>

    </div>
  );
}
