import React from 'react';
import { Smartphone, Calendar, MessageSquare, ShieldCheck, Check, Settings2, Globe } from 'lucide-react';

export default function Integrations() {
  const integrations = [
    {
      id: 'gcal',
      name: 'Google Calendar Sync',
      description: 'Synchronizes your RecollectBuddy local schedule with your real-time Google Calendar.',
      icon: Calendar,
      status: 'Active',
      color: 'text-white bg-neutral-900 border border-neutral-800',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp AI Productivity Companion',
      description: 'Interact with RecollectBuddy directly from your WhatsApp chat. Log tasks, toggle habits, and view briefings on-the-go.',
      icon: MessageSquare,
      status: 'Coming Soon',
      color: 'text-neutral-500 bg-neutral-900/40 border border-neutral-850',
    },
    {
      id: 'telegram',
      name: 'Telegram Notification Bot',
      description: 'Receive morning briefings, daily task summaries, and custom reminders directly to your Telegram channel.',
      icon: Smartphone,
      status: 'Beta Preview',
      color: 'text-neutral-300 bg-neutral-900 border border-neutral-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="p-8 bg-[#121212] border border-neutral-800 rounded-none relative">
        <div className="absolute top-0 left-0 w-16 h-1 bg-white"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neutral-900 border border-neutral-800 text-white rounded">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-neutral-500 uppercase block">creative engine / integrations</span>
            <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tighter mt-1">Workspace Integrations</h1>
            <p className="text-xs text-neutral-400 font-mono mt-1 uppercase tracking-widest">Connect RecollectBuddy to external productivity streams.</p>
          </div>
        </div>
      </div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((int, idx) => {
          const Icon = int.icon;
          return (
            <div
              key={int.id}
              className="p-8 bg-[#121212] border border-neutral-800 rounded-none relative flex flex-col justify-between hover:border-neutral-500 transition-all shadow-sm"
            >
              <div className="absolute top-0 left-0 w-12 h-0.5 bg-neutral-800 group-hover:bg-white transition-colors"></div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-none ${int.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2.5 py-1 border rounded uppercase tracking-wider ${
                      int.status === 'Active'
                        ? 'bg-neutral-950 border-[#00FF00] text-[#00FF00]'
                        : int.status === 'Coming Soon'
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-500'
                        : 'bg-neutral-950 border-neutral-700 text-neutral-300'
                    }`}
                  >
                    {int.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-neutral-500 block">{(idx + 1).toString().padStart(3, '0')} / CONNECTION</span>
                  <h3 className="text-sm font-bold text-white uppercase mt-1 tracking-wide">{int.name}</h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-2">{int.description}</p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-850 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 font-mono uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-[#00FF00]" />
                  <span>SECURE_OAUTH_ENCRYPTED</span>
                </div>

                <button
                  disabled={int.status === 'Coming Soon'}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-none border transition-all ${
                    int.status === 'Active'
                      ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-white'
                      : int.status === 'Coming Soon'
                      ? 'bg-neutral-950 text-neutral-600 border-neutral-900 cursor-not-allowed'
                      : 'bg-white border-white text-black hover:bg-neutral-200'
                  }`}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
