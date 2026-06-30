import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, CheckSquare, Award, Clock, ArrowRight, RefreshCw, HardDrive, CheckCircle2, User, Mail, ShieldCheck, Key, Copy, Check } from 'lucide-react';
import { Task, Event, Habit } from '../types';
import { auth } from '../firebase';

interface DashboardProps {
  userEmail?: string;
  userName?: string;
  tasks: Task[];
  events: Event[];
  habits: Habit[];
  driveConnected: boolean;
  onNavigate: (tab: string) => void;
  isDemoMode?: boolean;
}

export default function Dashboard({
  userEmail,
  userName,
  tasks,
  events,
  habits,
  driveConnected,
  onNavigate,
  isDemoMode,
}: DashboardProps) {
  const [brief, setBrief] = useState<string>('');
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Retrieve current active user profile information from Google / Firebase session
  const currentUser = auth.currentUser;
  const userPhoto = currentUser?.photoURL || null;
  const userUid = currentUser?.uid || (isDemoMode ? 'recollect_usr_dj7739_sandbox' : 'anonymous_session');
  const userProvider = currentUser?.providerData?.[0]?.providerId === 'google.com' || isDemoMode 
    ? 'Google Accounts OAuth SSO' 
    : 'Local Sandbox Identity';
  const isEmailVerified = currentUser?.emailVerified || isDemoMode;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(userUid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const fetchBrief = async () => {
    setLoadingBrief(true);
    try {
      const response = await fetch('/api/gemini/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, events, habits }),
      });
      const data = await response.json();
      if (data.brief) {
        setBrief(data.brief);
      } else {
        setBrief('Welcome back! Complete your daily habit checklist and synchronize your Google Drive files to stay productive today.');
      }
    } catch (error) {
      console.error('Error fetching AI Brief:', error);
      setBrief('Welcome back! Complete your daily habit checklist and synchronize your Google Drive files to stay productive today.');
    } finally {
      setLoadingBrief(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [tasks.length, events.length, habits.length]);

  // Format current date
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedHabitsToday = habits.filter((h) => {
    const today = new Date().toISOString().split('T')[0];
    return h.completedDays.includes(today);
  }).length;

  return (
    <div className="space-y-8">
      {/* Top Banner with Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 bg-[#121212] border border-neutral-800 rounded-none relative">
        <div className="absolute top-0 left-0 w-16 h-1 bg-white"></div>
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-neutral-500 uppercase block">creative engine / standup</span>
          <h1 className="text-3xl font-sans font-black text-white uppercase tracking-tighter mt-2">
            Welcome, {userName || (userEmail ? userEmail.split('@')[0] : 'Guest')}
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1 uppercase tracking-widest">{todayStr}</p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto px-4 py-2 border border-neutral-800 bg-[#161616]">
          <span className={`h-2.5 w-2.5 rounded-full ${driveConnected ? 'bg-[#00FF00]' : 'bg-amber-500'}`}></span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-300">
            {driveConnected ? 'DRIVE_ONLINE' : 'DRIVE_OFFLINE'}
          </span>
        </div>
      </div>

      {/* Authorized Google Profile Details Box */}
      <div className="p-8 bg-gradient-to-b from-[#0b0f19] to-[#050814] border border-neutral-800 rounded-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* User Profile photo / Avatar with Google colored border ring */}
            <div className="relative shrink-0">
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt="Google Profile" 
                  className="w-16 h-16 rounded-full border-2 border-indigo-500/80 object-cover shadow-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-sans text-xl font-black">
                  {userName ? userName.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-1 bg-[#050814] border border-neutral-800 rounded-full">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-indigo-400 uppercase">Authenticated Session Profile</span>
                <span className="px-2 py-0.5 bg-indigo-950/60 border border-indigo-800/40 rounded text-[9px] font-mono text-indigo-300 font-bold uppercase">{userProvider}</span>
              </div>
              
              <h2 className="text-xl font-sans font-black text-white uppercase tracking-tight">
                {userName || (userEmail ? userEmail.split('@')[0] : 'Demo Evaluator')}
              </h2>
              
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-400">
                <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                <span className="font-sans font-semibold text-neutral-300">{userEmail || 'demo.user@example.com'}</span>
                {isEmailVerified && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-mono text-emerald-400 font-extrabold uppercase">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* UID and Access Details */}
          <div className="w-full lg:w-auto p-4 bg-[#050814]/60 border border-neutral-850/80 space-y-2 max-w-md shrink-0">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
              <span>Dynamic Workspace Token</span>
              <button 
                onClick={handleCopyUid}
                className="inline-flex items-center gap-1 hover:text-white text-indigo-400 transition-colors uppercase text-[9px] font-bold"
              >
                {copiedUid ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedUid ? 'COPIED_OK' : 'COPY_UID'}</span>
              </button>
            </div>
            
            <div className="bg-[#03050a] px-3 py-2 border border-neutral-900 rounded font-mono text-[10px] text-neutral-400 select-all break-all text-center lg:text-left">
              {userUid}
            </div>

            <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              <Key className="h-3 w-3 text-indigo-500" />
              <span>Drive & Calendar integrations secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Demo Sandbox Banner */}
      {isDemoMode && (
        <div className="p-6 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-800/40 rounded-none relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500"></div>
          <div className="flex items-start gap-4">
            <span className="p-2 bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 rounded-lg">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase block">
                🔴 LIVE SANDBOX DEMO ACTIVE
              </span>
              <p className="text-sm font-sans font-black text-white uppercase tracking-tight">
                "Instant Sandbox Evaluation Mode"
              </p>
              <p className="text-xs text-neutral-300 font-sans max-w-3xl leading-relaxed">
                You are currently signed in as <strong className="text-white">Demo Evaluator</strong> in sandbox evaluation mode. All task lists, habit logs, and AI morning briefs have been pre-populated with sample project items to let you test the RecollectBuddy workspace immediately. Feel free to interact, check off tasks, and play with the system!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => onNavigate('tasks')}
          className="p-6 bg-[#121212] border border-neutral-800 hover:border-neutral-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">001 / PENDING_TASKS</span>
            <CheckSquare className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <div className="mt-6">
            <span className="text-4xl font-black font-sans text-white tracking-tighter block">{pendingTasks}</span>
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase block mt-1">tasks remaining</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('planner')}
          className="p-6 bg-[#121212] border border-neutral-800 hover:border-neutral-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">002 / TODAY_AGENDA</span>
            <Calendar className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <div className="mt-6">
            <span className="text-4xl font-black font-sans text-white tracking-tighter block">{events.length}</span>
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase block mt-1">items scheduled</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('habits')}
          className="p-6 bg-[#121212] border border-neutral-800 hover:border-neutral-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">003 / HABIT_METRIC</span>
            <Award className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <div className="mt-6">
            <span className="text-4xl font-black font-sans text-white tracking-tighter block">{completedHabitsToday}</span>
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase block mt-1">completed today</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('drive')}
          className="p-6 bg-[#121212] border border-neutral-800 hover:border-neutral-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">004 / WORKSPACE</span>
            <HardDrive className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <div className="mt-6">
            <span className="text-xl font-bold font-sans text-white tracking-tighter block">
              {driveConnected ? 'STABLE_OK' : 'OFFLINE'}
            </span>
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase block mt-1">google drive integration</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Briefing + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: AI Daily Brief */}
        <div className="lg:col-span-2 p-8 bg-[#121212] border border-neutral-800 flex flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-850">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white" />
                <h2 className="text-sm font-bold tracking-widest font-sans uppercase">AI Daily Briefing</h2>
              </div>
              <button 
                onClick={fetchBrief} 
                disabled={loadingBrief}
                className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all rounded"
                title="Regenerate brief"
              >
                <RefreshCw className={`h-4 w-4 ${loadingBrief ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="py-6 text-neutral-300 leading-relaxed text-sm whitespace-pre-line font-sans tracking-wide">
              {loadingBrief ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-neutral-800 w-3/4"></div>
                  <div className="h-4 bg-neutral-800 w-5/6"></div>
                  <div className="h-4 bg-neutral-800 w-2/3"></div>
                </div>
              ) : (
                brief
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-850 flex justify-end">
            <button
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white hover:underline transition-all group"
            >
              Consult AI Assistant
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Side: Today's Agenda */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="h-5 w-5 text-slate-800" />
            <h2 className="text-base font-sans font-bold text-slate-900">Today's Agenda</h2>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Calendar className="h-8 w-8 mx-auto stroke-1 text-slate-300" />
              <p>No events scheduled today.</p>
              <button 
                onClick={() => onNavigate('planner')} 
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Schedule First Event
              </button>
            </div>
          ) : (
            <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-5 py-1">
              {events.map((event) => (
                <div key={event.id} className="relative group">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 bg-neutral-900 border border-neutral-400 group-hover:bg-indigo-600 group-hover:scale-125 transition-all"></span>
                  <span className="text-[10px] font-mono font-medium text-slate-400 block">{event.time}</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5 uppercase tracking-wide">{event.title}</span>
                  {event.description && (
                    <span className="text-[11px] text-slate-500 mt-0.5 block">{event.description}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
