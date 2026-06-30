import React, { useState } from 'react';
import { Calendar, Plus, Clock, FileText, Check, Trash } from 'lucide-react';
import { Event } from '../types';

interface PlannerProps {
  events: Event[];
  onAddEvent: (title: string, date: string, time: string, description?: string) => void;
  onDeleteEvent: (id: string) => void;
}

export default function Planner({ events, onAddEvent, onDeleteEvent }: PlannerProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

    onAddEvent(title, date, time, description);
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create Event Panel */}
      <div className="lg:col-span-1 p-6 bg-[#121212] border border-neutral-800 rounded-none relative h-fit space-y-4">
        <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-850">
          <Calendar className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Add Agenda Item</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Review Session"
              className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2.5 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2 text-xs focus:outline-none transition-all text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 02:00 PM"
                className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add specifics, files details, links..."
              className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2.5 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-sans"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black font-black py-3 rounded-none transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Schedule Event
          </button>
        </form>
      </div>

      {/* Agenda Items List */}
      <div className="lg:col-span-2 p-6 bg-[#121212] border border-neutral-800 rounded-none relative space-y-4">
        <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-850">
          <Clock className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Daily Agenda Timeline</h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-xs space-y-2">
            <Calendar className="h-10 w-10 mx-auto stroke-1 text-neutral-600" />
            <p className="font-mono uppercase tracking-widest">TIMELINE_IS_EMPTY</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, idx) => (
              <div
                key={event.id}
                className="p-4 border border-neutral-800 rounded-none bg-neutral-950/40 flex items-center justify-between gap-4 group hover:border-neutral-600 transition-all"
              >
                <div className="flex gap-4 items-start">
                  <span className="text-[10px] font-mono text-neutral-500 self-start mt-1">{(idx + 1).toString().padStart(3, '0')}</span>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-400 mt-1 font-mono uppercase tracking-widest">
                      <span>{event.date}</span>
                      <span>/</span>
                      <span>{event.time}</span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-neutral-400 font-sans mt-1.5 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="p-2 hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 rounded transition-all"
                  title="Delete event"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
