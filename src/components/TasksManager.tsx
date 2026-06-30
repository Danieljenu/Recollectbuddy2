import React, { useState } from 'react';
import { CheckSquare, Plus, Trash, Check, Filter } from 'lucide-react';
import { Task } from '../types';

interface TasksManagerProps {
  tasks: Task[];
  onAddTask: (title: string, category: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksManager({ tasks, onAddTask, onToggleTask, onDeleteTask }: TasksManagerProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Work');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const categories = ['Work', 'Personal', 'Study', 'Health'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask(newTitle, newCategory);
    setNewTitle('');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create Task Column */}
      <div className="lg:col-span-1 p-6 bg-[#121212] border border-neutral-800 rounded-none relative h-fit space-y-4">
        <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-850 mb-4">
          <CheckSquare className="h-4 w-4 text-white" />
          <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Create Task</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Task Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Sync meeting notes with Drive"
              className="w-full bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-3 py-2.5 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-sans"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1.5">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewCategory(cat)}
                  className={`py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-none border transition-all ${
                    newCategory === cat
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black font-black py-3 rounded-none transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </form>
      </div>

      {/* Tasks Listing Column */}
      <div className="lg:col-span-2 p-6 bg-[#121212] border border-neutral-800 rounded-none relative space-y-4">
        <div className="absolute top-0 left-0 w-12 h-0.5 bg-white"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-850">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-white" />
            <h2 className="text-xs font-bold tracking-widest font-sans uppercase">Task Checklist</h2>
          </div>

          {/* Filtering buttons */}
          <div className="flex items-center gap-1 bg-[#161616] border border-neutral-850 p-1">
            {(['all', 'active', 'completed'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all ${
                  filter === type
                    ? 'bg-white text-black font-bold'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-xs space-y-2">
            <CheckSquare className="h-10 w-10 mx-auto stroke-1 text-neutral-600" />
            <p className="font-mono uppercase tracking-widest">TASK_CHECKLIST_EMPTY</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task, idx) => (
              <div
                key={task.id}
                className="p-4 border border-neutral-800 rounded-none bg-neutral-950/40 flex items-center justify-between gap-4 group hover:border-neutral-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Custom Styled Checkbox */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`h-5 w-5 rounded-none border flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-white border-white text-black'
                        : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500 text-white'
                    }`}
                  >
                    {task.completed && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <div>
                    <span
                      className={`text-xs font-bold transition-all uppercase tracking-wide ${
                        task.completed ? 'text-neutral-500 line-through' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 uppercase tracking-wider">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 rounded transition-all"
                  title="Delete task"
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
