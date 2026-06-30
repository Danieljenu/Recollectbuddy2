export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  size?: string;
  webViewLink?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  dueDate?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: string[]; // dates like "YYYY-MM-DD"
  streak: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

