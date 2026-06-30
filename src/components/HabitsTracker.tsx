import React, { useState } from 'react';
import { Award, Plus, Trash, Check, Zap } from 'lucide-react';
import { Habit } from '../types';

interface HabitsTrackerProps {
  habits: Habit[];
  onAddHabit: (name: string) => void;
  onToggleHabit: (id: string, date: string) => void;
  onDeleteHabit: (id: string) => void;
}

export default function HabitsTracker({ habits, onAddHabit, onToggleHabit, onDeleteHabit }: HabitsTrackerProps) {
  const [newHabitName, setNewHabitName] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    onAddHabit(newHabitName);
    setNewHabitName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create Habit Column */}
      <div className="lg:col-span-1 p-6 bg-[#121212] border border-neutral-800 rounded-none relative h-fit space-y-4">
        <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-850 mb-4">
          <Award className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Create Habit</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Habit Name</label>
            <input
              type="text"
              required
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g. Read for 20 mins"
              className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2.5 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black font-black py-3 rounded-none transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Build Habit
          </button>
        </form>
      </div>

      {/* Habit Streak Column */}
      <div className="lg:col-span-2 p-6 bg-[#121212] border border-neutral-800 rounded-none relative space-y-4">
        <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-850">
          <Award className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Daily Routines & Streaks</h2>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-xs space-y-2">
            <Award className="h-10 w-10 mx-auto stroke-1 text-neutral-600" />
            <p className="font-mono uppercase tracking-widest">HABIT_REGISTRY_EMPTY</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const isCompletedToday = habit.completedDays.includes(today);

              return (
                <div
                  key={habit.id}
                  className="p-4 border border-neutral-800 rounded-none bg-neutral-950/40 flex items-center justify-between gap-4 group hover:border-neutral-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Tick Checkbox for today */}
                    <button
                      onClick={() => onToggleHabit(habit.id, today)}
                      className={`h-5 w-5 rounded-none border flex items-center justify-center transition-all ${
                        isCompletedToday
                          ? 'bg-white border-white text-black'
                          : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {isCompletedToday && <Check className="h-4 w-4 text-black" />}
                    </button>

                    <div>
                      <h3
                        className={`text-xs font-bold uppercase tracking-wide transition-all ${
                          isCompletedToday ? 'text-neutral-500 line-through' : 'text-white'
                        }`}
                      >
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#00FF00] font-bold font-mono uppercase tracking-wider">
                        <Zap className="h-3.5 w-3.5 fill-current text-[#00FF00]" />
                        <span>Streak: {habit.streak} days</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-1.5 hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 rounded transition-all"
                    title="Delete habit"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
