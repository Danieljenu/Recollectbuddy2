import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Settings, 
  Cpu, 
  Compass, 
  MapPin, 
  GitBranch, 
  FileText, 
  ExternalLink, 
  BookOpen, 
  Award, 
  ChevronRight, 
  Code2, 
  ArrowRight,
  Zap
} from 'lucide-react';
import Logo from './Logo';

export default function AboutApp() {
  const coreFeatures = [
    {
      title: 'AI Executive Assistant',
      description: 'Proactively analyzes your workloads, schedules, and past habits to generate personalized recommendations.',
      icon: Sparkles,
    },
    {
      title: 'Smart Task Prioritization',
      description: 'Goes beyond simple lists to automatically prioritize critical deadlines and task categories.',
      icon: Award,
    },
    {
      title: 'AI Assistant Chat Interface',
      description: 'Interactive natural language conversational partner to log, query, and structure your workday dynamically.',
      icon: Compass,
    },
    {
      title: 'Workspace Drive Organizer',
      description: 'Direct workspace file management with Google Drive to draft, sync, and organize documents on-the-fly.',
      icon: Settings,
    },
    {
      title: 'Dynamic Habit Routines',
      description: 'Interactive tracker that logs routine consistency, automatically adjusting daily goals and streaks.',
      icon: Zap,
    },
    {
      title: 'Responsive Modern Canvas',
      description: 'A dark, Swiss-inspired typographic layout optimized across desktop, tablet, and mobile viewing grids.',
      icon: Cpu,
    },
  ];

  const workflowSteps = [
    { step: '01', title: 'Workspace Launch', description: 'User logs into the secure RecollectBuddy dashboard via Google.' },
    { step: '02', title: 'Workload Evaluation', description: 'The AI engine parses tasks, schedules, and current habits.' },
    { step: '03', title: 'Deadline Optimization', description: 'Urgent items and upcoming commitments are instantly prioritized.' },
    { step: '04', title: 'Schedule Synthesis', description: 'Generates a detailed, action-focused daily standup briefing.' },
    { step: '05', title: 'Adaptive Reorganization', description: 'Missed blocks and routines are auto-rescheduled dynamically.' },
    { step: '06', title: 'Intelligent Advisory', description: 'Provides real-time chat insights for maximum focus and stress reduction.' },
  ];

  const futureRoadmap = [
    { phase: 'Phase 1', title: 'Google Calendar Sync', status: 'Active Development', desc: 'Bidirectional sync to reflect local timeline changes in GCal.' },
    { phase: 'Phase 2', title: 'WhatsApp Integration', status: 'In Design', desc: 'Interact, complete, and command your schedule over mobile chat.' },
    { phase: 'Phase 3', title: 'Natural Voice Advisory', status: 'In Design', desc: 'Direct audio briefings and scheduling via speech synthesis.' },
    { phase: 'Phase 4', title: 'Team Workspaces', status: 'Planning', desc: 'Multi-member collaborative canvases and shared project briefings.' },
    { phase: 'Phase 5', title: 'AI Productivity Audits', status: 'Planning', desc: 'Automatic weekly feedback and advice on stress management.' },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Header */}
      <div className="p-8 md:p-12 bg-gradient-to-br from-[#121622] via-[#0D101D] to-[#060B16] border border-neutral-800 rounded-none relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-24 h-1.5 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500"></div>
        
        {/* Animated ambient light orb in background */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-4 bg-slate-950/40 border border-neutral-800 rounded-2xl shrink-0 backdrop-blur-sm">
          <Logo size={120} />
        </div>

        <div className="space-y-4 text-center md:text-left">
          <span className="text-[10px] font-mono font-black tracking-[0.3em] text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 border border-cyan-800/30 uppercase rounded-full inline-block">
            PROJECT_MANIFEST_OK // v1.0.0
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-black text-white tracking-tighter uppercase leading-none">
            RecollectBuddy
          </h1>
          <p className="text-xs md:text-sm font-mono tracking-widest text-neutral-400 uppercase">
            AI Productivity Companion • Plan Smarter. Beat Deadlines. Stay Ahead.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <a 
              href="https://recollectbuddy.vercel.app/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-none transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-5 py-2.5 rounded-none transition-all bg-slate-950/20"
            >
              <Code2 className="h-4 w-4" />
              GitHub Repository
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Executive Summary and Problem Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Executive Summary */}
        <div className="p-8 bg-[#121212] border border-neutral-800 rounded-none relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-12 h-0.5 bg-violet-500"></div>
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-850">
              <FileText className="h-4 w-4 text-violet-400" />
              <h2 className="text-xs font-bold tracking-widest font-sans uppercase text-white">Executive Summary</h2>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans pt-6">
              RecollectBuddy is an AI-powered productivity platform that goes beyond simple reminders. It proactively analyzes schedules, tasks, and deadlines to recommend the best course of action, helping students and professionals stay highly organized, focused, and stress-free.
            </p>
          </div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest pt-6 mt-4 border-t border-neutral-850">
            01 / PORTFOLIO_OVERVIEW
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="p-8 bg-[#121212] border border-neutral-800 rounded-none relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-12 h-0.5 bg-cyan-500"></div>
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-850">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <h2 className="text-xs font-bold tracking-widest font-sans uppercase text-white">Problem & Our Solution</h2>
            </div>
            <div className="space-y-4 pt-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">The Problem</span>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-1">
                  Traditional productivity applications depend heavily on manual planning and simple notifications. Users often miss deadlines, procrastinate, or struggle to prioritize work effectively.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Our Solution</span>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans mt-1">
                  RecollectBuddy acts as an AI Executive Assistant. It analyzes the user's workload, recommends study or work sessions, reorganizes missed tasks, and provides intelligent suggestions instead of only sending reminders.
                </p>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest pt-6 mt-4 border-t border-neutral-850">
            02 / STRATEGY_SOLVE
          </div>
        </div>

      </div>

      {/* Core Features */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-neutral-800">
          <BookOpen className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase text-white">Core Architectural Modules</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 bg-[#121212] border border-neutral-800 rounded-none relative hover:border-neutral-500 transition-all flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-10 h-0.5 bg-neutral-800"></div>
                <div className="space-y-4">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-white rounded w-fit">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{feat.title}</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-2">{feat.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Workflow Timeline */}
      <div className="p-8 bg-[#121212] border border-neutral-800 rounded-none relative space-y-8">
        <div className="absolute top-0 left-0 w-16 h-1 bg-white"></div>
        
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-850">
          <Compass className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase text-white">System Operations Workflow</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="p-5 border border-neutral-850 bg-neutral-950/40 relative flex gap-4">
              <span className="text-lg font-black font-mono text-neutral-600 self-start">{step.step}</span>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{step.title}</h4>
                <p className="text-[11px] text-neutral-400 font-sans mt-1 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack & Innovation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Technology Stack */}
        <div className="lg:col-span-1 p-8 bg-[#121212] border border-neutral-800 rounded-none relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-12 h-0.5 bg-indigo-500"></div>
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-850">
              <Code2 className="h-4 w-4 text-indigo-400" />
              <h2 className="text-xs font-bold tracking-widest font-sans uppercase text-white">Technology Stack</h2>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel', 'GitHub', 'Google Gemini API', 'Firebase OAuth'].map((tech, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border border-neutral-800 bg-neutral-900 text-neutral-300 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest pt-6 mt-8 border-t border-neutral-850">
            03 / DEVELOPER_STACK
          </div>
        </div>

        {/* Innovation */}
        <div className="lg:col-span-2 p-8 bg-[#121212] border border-neutral-800 rounded-none relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-12 h-0.5 bg-emerald-500"></div>
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-850">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h2 className="text-xs font-bold tracking-widest font-sans uppercase text-white">Adaptive Innovation</h2>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans pt-6">
              Unlike traditional reminder applications, RecollectBuddy actively assists users by adapting schedules and recommending actions before deadlines become problems. 
              By integrating natural conversational AI, robust checklist rules, and official Google Drive folder syncing, it acts as a fully cohesive digital workplace monitor.
            </p>
          </div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest pt-6 mt-8 border-t border-neutral-850">
            04 / COMPETITIVE_ADVANTAGE
          </div>
        </div>

      </div>

      {/* Future Roadmap */}
      <div className="p-8 bg-[#121212] border border-neutral-800 rounded-none relative space-y-6">
        <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
        
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-850">
          <GitBranch className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase text-white">Project Future Roadmap</h2>
        </div>

        <div className="relative border-l border-neutral-800 pl-4 ml-2 space-y-6">
          {futureRoadmap.map((road, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[21px] top-1.5 h-2 w-2 bg-white border border-neutral-500 group-hover:bg-cyan-400 group-hover:scale-125 transition-all"></span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">{road.phase}</span>
                <span className="text-xs font-black text-white uppercase tracking-wider">{road.title}</span>
                <span className="text-[9px] font-mono border border-neutral-800 bg-neutral-900 text-neutral-400 px-2 py-0.5 uppercase tracking-widest self-start">
                  {road.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans mt-1">{road.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="p-8 md:p-10 bg-neutral-900/40 border border-neutral-800 rounded-none relative text-center max-w-2xl mx-auto space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white"></div>
        <h3 className="text-lg font-sans font-black text-white uppercase tracking-tighter">In Conclusion</h3>
        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
          RecollectBuddy transforms productivity management from passive reminders into proactive AI guidance, helping users plan smarter, reduce stress, and achieve their goals more efficiently.
        </p>
      </div>

    </div>
  );
}
