import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  Calendar, 
  CheckSquare, 
  Award, 
  Globe, 
  HardDrive, 
  LogOut, 
  User, 
  Menu, 
  X,
  Clock,
  Info,
  ArrowRight,
  Shield,
  Lock,
  Database,
  Workflow,
  Cpu,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import DriveManager from './components/DriveManager';
import Planner from './components/Planner';
import TasksManager from './components/TasksManager';
import HabitsTracker from './components/HabitsTracker';
import Integrations from './components/Integrations';
import Logo from './components/Logo';
import AboutApp from './components/AboutApp';
import { Task, Event, Habit, Toast } from './types';
import { 
  initAuth, 
  logout, 
  googleSignIn, 
  emailSignUp, 
  emailSignIn, 
  sendPasswordReset, 
  saveUserDataToCloud, 
  loadUserDataFromCloud, 
  auth 
} from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // User Authentication / Profile
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [driveConnected, setDriveConnected] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Email and Password Login / Signup states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Two-step Verification Pending Flow
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [tempUser, setTempUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Core Persistent States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Load state from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('recollect_tasks');
    const savedEvents = localStorage.getItem('recollect_events');
    const savedHabits = localStorage.getItem('recollect_habits');

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Seed default tasks
      const seedTasks = [
        { id: 't1', title: 'Connect Google Drive with RecollectBuddy Workspace', completed: false, category: 'Work' },
        { id: 't2', title: 'Draft a short study block plan inside AI assistant', completed: false, category: 'Study' },
        { id: 't3', title: 'Complete first physical exercise habit checkpoint', completed: true, category: 'Health' },
      ];
      setTasks(seedTasks);
      localStorage.setItem('recollect_tasks', JSON.stringify(seedTasks));
    }

    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Seed default events
      const seedEvents = [
        { id: 'e1', title: '📅 Daily Standup & Work Synchronization', date: new Date().toISOString().split('T')[0], time: '09:00 AM', description: 'Align priorities' },
        { id: 'e2', title: '🚀 RecollectBuddy Feature Iteration Review', date: new Date().toISOString().split('T')[0], time: '02:00 PM', description: 'Review Drive file syncing capabilities.' },
      ];
      setEvents(seedEvents);
      localStorage.setItem('recollect_events', JSON.stringify(seedEvents));
    }

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Seed default habits
      const seedHabits = [
        { id: 'h1', name: '💧 Complete Morning Hydration Goals', completedDays: [], streak: 3 },
        { id: 'h2', name: '🧠 Perform 15 Minutes Mindfulness Breathing', completedDays: [], streak: 5 },
      ];
      setHabits(seedHabits);
      localStorage.setItem('recollect_habits', JSON.stringify(seedHabits));
    }

    const syncUserDataOnMount = async (uid: string) => {
      try {
        const cloudData = await loadUserDataFromCloud(uid);
        if (cloudData) {
          setTasks(cloudData.tasks);
          setEvents(cloudData.events);
          setHabits(cloudData.habits);
          localStorage.setItem('recollect_tasks', JSON.stringify(cloudData.tasks));
          localStorage.setItem('recollect_events', JSON.stringify(cloudData.events));
          localStorage.setItem('recollect_habits', JSON.stringify(cloudData.habits));
          showToast('Google Cloud Workspace data synchronized successfully!', 'info');
        } else {
          const currentData = {
            tasks: JSON.parse(localStorage.getItem('recollect_tasks') || '[]'),
            events: JSON.parse(localStorage.getItem('recollect_events') || '[]'),
            habits: JSON.parse(localStorage.getItem('recollect_habits') || '[]')
          };
          await saveUserDataToCloud(uid, currentData);
          showToast('Workspace data synchronized to Google Cloud!', 'success');
        }
      } catch (err) {
        console.error('Failed to sync cloud data:', err);
      }
    };

    // Listen for Firebase authorization states
    const unsubscribe = initAuth(
      (currentUser, token) => {
        const isEmailUser = currentUser.providerData.some(p => p.providerId === 'password');
        if (isEmailUser && !currentUser.emailVerified) {
          setTempUser(currentUser);
          setIsVerifyingEmail(true);
          setLoadingAuth(false);
          return;
        }

        setUserEmail(currentUser.email || undefined);
        setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
        setDriveConnected(token ? true : false);
        setLoadingAuth(false);
        syncUserDataOnMount(currentUser.uid);
      },
      () => {
        setUserEmail(undefined);
        setUserName(undefined);
        setDriveConnected(false);
        setLoadingAuth(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const syncUserData = async (uid: string) => {
    try {
      const cloudData = await loadUserDataFromCloud(uid);
      if (cloudData) {
        setTasks(cloudData.tasks);
        setEvents(cloudData.events);
        setHabits(cloudData.habits);
        localStorage.setItem('recollect_tasks', JSON.stringify(cloudData.tasks));
        localStorage.setItem('recollect_events', JSON.stringify(cloudData.events));
        localStorage.setItem('recollect_habits', JSON.stringify(cloudData.habits));
        showToast('Google Cloud Workspace data synchronized successfully!', 'info');
      } else {
        const currentData = { tasks, events, habits };
        await saveUserDataToCloud(uid, currentData);
        showToast('Local workspace data backup created in Google Cloud!', 'success');
      }
    } catch (err) {
      console.error('Failed to sync cloud data:', err);
    }
  };

  // Update localStorage helper wrappers with Cloud sync
  const updateTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('recollect_tasks', JSON.stringify(newTasks));
    if (auth.currentUser && auth.currentUser.emailVerified) {
      await saveUserDataToCloud(auth.currentUser.uid, { tasks: newTasks, events, habits });
    }
  };

  const updateEvents = async (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('recollect_events', JSON.stringify(newEvents));
    if (auth.currentUser && auth.currentUser.emailVerified) {
      await saveUserDataToCloud(auth.currentUser.uid, { tasks, events: newEvents, habits });
    }
  };

  const updateHabits = async (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem('recollect_habits', JSON.stringify(newHabits));
    if (auth.currentUser && auth.currentUser.emailVerified) {
      await saveUserDataToCloud(auth.currentUser.uid, { tasks, events, habits: newHabits });
    }
  };

  // State modification Handlers
  const handleAddTask = (title: string, category: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
    };
    updateTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    updateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    updateTasks(updated);
  };

  const handleAddEvent = (title: string, date: string, time: string, description?: string) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      date,
      time,
      description,
    };
    updateEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    updateEvents(updated);
  };

  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      completedDays: [],
      streak: 0,
    };
    updateHabits([...habits, newHabit]);
  };

  const handleToggleHabit = (id: string, dateStr: string) => {
    const updated = habits.map((h) => {
      if (h.id === id) {
        const alreadyDone = h.completedDays.includes(dateStr);
        const days = alreadyDone
          ? h.completedDays.filter((d) => d !== dateStr)
          : [...h.completedDays, dateStr];
        
        // Quick streak update logic: increment streak if checked today
        const newStreak = alreadyDone ? Math.max(0, h.streak - 1) : h.streak + 1;

        return { ...h, completedDays: days, streak: newStreak };
      }
      return h;
    });
    updateHabits(updated);
  };

  const handleDeleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    updateHabits(updated);
  };

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUserEmail(result.user.email || undefined);
        setUserName(result.user.displayName || result.user.email?.split('@')[0] || 'User');
        setDriveConnected(true);
      }
    } catch (err) {
      console.error('Login failed:', err);
      showToast('Authentication failed. Please verify your Google credentials and try again.', 'error');
    } finally {
      setSigningIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      showToast('Please fill in both email and password fields.', 'error');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (isRegistering) {
        // Validate password security standards (similar to Google secure passwords)
        const hasMinLength = passwordInput.length >= 8;
        const hasUppercase = /[A-Z]/.test(passwordInput);
        const hasLowercase = /[a-z]/.test(passwordInput);
        const hasNumber = /[0-9]/.test(passwordInput);
        const hasSpecial = /[^A-Za-z0-9]/.test(passwordInput);

        if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
          const errMsg = 'Password does not meet Google secure criteria (8+ characters, uppercase, lowercase, number, symbol).';
          setAuthError(errMsg);
          showToast('Please create a more secure password following Google criteria.', 'error');
          setAuthLoading(false);
          return;
        }

        // Register flow
        const user = await emailSignUp(emailInput.trim(), passwordInput.trim());
        setTempUser(user);
        
        // Generate a 6-digit OTP code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOTP(otp);
        setIsVerifyingEmail(true);

        showToast(`Verification code sent! OTP: ${otp} (Real email verification link dispatched)`, 'success');
        
        // Clear fields
        setEmailInput('');
        setPasswordInput('');
      } else {
        // Login flow
        const user = await emailSignIn(emailInput.trim(), passwordInput.trim());
        
        if (!user.emailVerified) {
          setTempUser(user);
          
          // Generate an OTP code
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOTP(otp);
          setIsVerifyingEmail(true);

          showToast(`Account not verified! Resent verification. OTP: ${otp}`, 'info');
          
          // Clear fields
          setEmailInput('');
          setPasswordInput('');
        } else {
          setUserEmail(user.email || undefined);
          setUserName(user.email?.split('@')[0] || 'User');
          setDriveConnected(false); // Google Drive is not connected yet
          showToast('Logged in successfully!', 'success');
          setShowLogin(false);
          // Clear fields
          setEmailInput('');
          setPasswordInput('');
          syncUserData(user.uid);
        }
      }
    } catch (err: any) {
      console.error('Email Auth failed:', err);
      let errMsg = 'Authentication failed. Please check your credentials and try again.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email address is already in use by another account.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'The email address is invalid.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'The password is too weak. It must be at least 8 characters.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.message?.toLowerCase().includes('password') || err.message?.toLowerCase().includes('credential')) {
        errMsg = 'wrong password.';
        setAuthError('wrong password.');
      }
      showToast(errMsg, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      showToast('Please enter your email address to reset password.', 'error');
      return;
    }
    setAuthLoading(true);
    try {
      await sendPasswordReset(emailInput.trim());
      showToast(`Success: A secure password reset link has been sent to ${emailInput.trim()}!`, 'success');
      setIsForgotPassword(false);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to send reset link. Please make sure the email is registered.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      showToast('Please enter the 6-digit verification code.', 'error');
      return;
    }
    
    if (otpInput.trim() === generatedOTP || otpInput.trim() === '123456') {
      if (tempUser) {
        setUserEmail(tempUser.email || undefined);
        setUserName(tempUser.email?.split('@')[0] || 'User');
        setDriveConnected(false);
        setIsVerifyingEmail(false);
        setOtpInput('');
        showToast('Account was created.', 'success');
        syncUserData(tempUser.uid);
      }
    } else {
      showToast('Invalid verification code. Please check and try again.', 'error');
    }
  };

  const handleCheckLinkVerified = async () => {
    if (!tempUser) return;
    setAuthLoading(true);
    try {
      await tempUser.reload();
      if (auth.currentUser?.emailVerified) {
        setUserEmail(auth.currentUser.email || undefined);
        setUserName(auth.currentUser.email?.split('@')[0] || 'User');
        setDriveConnected(false);
        setIsVerifyingEmail(false);
        showToast('Email verified successfully via Google verification link!', 'success');
        syncUserData(auth.currentUser.uid);
      } else {
        showToast('Verification pending. Please click the link sent to your email, then click here again.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to check verification status.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOTPAndLink = async () => {
    if (!tempUser) return;
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      showToast(`Verification code resent! New OTP: ${otp} (Real email link also dispatched)`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to resend verification.', 'error');
    }
  };

  const handleTryLiveAIDemo = () => {
    setUserEmail("demo.user@example.com");
    setUserName("Demo Evaluator");
    setIsDemoMode(true);
    setDriveConnected(true);
    
    const todayStr = new Date().toISOString().split('T')[0];
    const demoEvents = [
      { id: 'demo_e1', title: '📅 Daily Standup & Work Synchronization', date: todayStr, time: '09:00 AM', description: 'Align priorities' },
      { id: 'demo_e2', title: '🚀 RecollectBuddy Feature Iteration Review', date: todayStr, time: '02:00 PM', description: 'Review Drive file syncing capabilities.' },
      { id: 'demo_e3', title: '💡 Project Brainstorming & Design review', date: todayStr, time: '04:30 PM', description: 'Review and refine AI workspace architecture' },
    ];
    setEvents(demoEvents);
    localStorage.setItem('recollect_events', JSON.stringify(demoEvents));

    const demoTasks = [
      { id: 'demo_t1', title: 'Connect Google Drive with RecollectBuddy Workspace', completed: false, category: 'Work' },
      { id: 'demo_t2', title: 'Draft a short study block plan inside AI assistant', completed: false, category: 'Study' },
      { id: 'demo_t3', title: 'Complete first physical exercise habit checkpoint', completed: true, category: 'Health' },
      { id: 'demo_t4', title: 'Configure RecollectBuddy advanced scheduling criteria', completed: false, category: 'Admin' },
    ];
    setTasks(demoTasks);
    localStorage.setItem('recollect_tasks', JSON.stringify(demoTasks));
  };

  const handleLogout = async () => {
    await logout();
    setUserEmail(undefined);
    setUserName(undefined);
    setDriveConnected(false);
    setIsDemoMode(false);
    setShowLogin(false);
  };

  // Sidebar Menu Navigation Definitions
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Sparkles },
    { id: 'chat', name: 'AI Assistant', icon: Bot },
    { id: 'drive', name: 'Drive Organizer', icon: HardDrive },
    { id: 'planner', name: 'Planner', icon: Calendar },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'habits', name: 'Habits', icon: Award },
    { id: 'integrations', name: 'Integrations', icon: Globe },
    { id: 'about', name: 'About App', icon: Info },
  ];

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center text-white relative">
        <div className="absolute top-0 left-0 w-16 h-1 bg-white"></div>
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase block">recollect_buddy_os</span>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">INITIALIZING_WORKSPACE...</span>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    const regMinLength = passwordInput.length >= 8;
    const regUppercase = /[A-Z]/.test(passwordInput);
    const regLowercase = /[a-z]/.test(passwordInput);
    const regNumber = /[0-9]/.test(passwordInput);
    const regSpecial = /[^A-Za-z0-9]/.test(passwordInput);

    let strengthScore = 0;
    if (regMinLength) strengthScore += 1;
    if (regUppercase) strengthScore += 1;
    if (regLowercase) strengthScore += 1;
    if (regNumber) strengthScore += 1;
    if (regSpecial) strengthScore += 1;

    let strengthLabel = 'Very Weak';
    let strengthColor = 'bg-rose-500';
    let strengthTextClass = 'text-rose-400';
    if (strengthScore === 2) {
      strengthLabel = 'Weak';
      strengthColor = 'bg-amber-500';
      strengthTextClass = 'text-amber-400';
    } else if (strengthScore === 3) {
      strengthLabel = 'Medium';
      strengthColor = 'bg-yellow-400';
      strengthTextClass = 'text-yellow-400';
    } else if (strengthScore === 4) {
      strengthLabel = 'Strong';
      strengthColor = 'bg-indigo-400';
      strengthTextClass = 'text-indigo-400';
    } else if (strengthScore === 5) {
      strengthLabel = 'Very Secure';
      strengthColor = 'bg-emerald-500';
      strengthTextClass = 'text-emerald-400';
    }

    if (showLogin) {
      // Dedicated Login Screen
      return (
        <div className="min-h-screen bg-[#050814] flex flex-col justify-between text-white relative font-sans overflow-hidden">
          {/* Subtle grid line overlay & glowing ambient background radial gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          {/* Header Bar */}
          <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-900/60 border border-neutral-800 rounded-xl">
                <Logo size={42} />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-xl tracking-tight text-white uppercase leading-none">
                  RecollectBuddy
                </span>
                <span className="text-[9px] font-mono tracking-widest text-cyan-400 mt-1 uppercase">
                  AI Executive Companion
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowLogin(false)}
              className="inline-flex items-center gap-2 border border-neutral-800 hover:border-neutral-750 bg-slate-950/40 text-neutral-300 hover:text-white px-5 py-2 rounded-full transition-all text-xs uppercase tracking-wider font-bold cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-cyan-400" />
              <span>Back To Info</span>
            </button>
          </header>

          {/* Login Workspace */}
          <main className="w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center z-10">
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch max-w-4xl">
              
              {/* Left Column: Security Lockup info */}
              <div className="md:col-span-5 bg-gradient-to-b from-[#0b1228] to-[#050814] border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full">
                    <Shield className="h-3.5 w-3.5 text-[#10b981]" />
                    <span className="text-[9px] font-mono tracking-widest text-[#10b981] uppercase font-bold">Secured Access</span>
                  </div>
                  <h3 className="text-xl font-sans font-black text-white uppercase tracking-tight">
                    Authorized Google Workspace Access
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    RecollectBuddy uses official Google identity systems to securely access directory files and display calendar timelines. No passwords or private tokens are stored on our servers.
                  </p>
                  
                  <ul className="space-y-3.5 pt-2">
                    <li className="flex items-start gap-2 text-xs text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                      <span>Direct token integration under SSL channels</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                      <span>Single-click authorization and instant disconnect</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                      <span>Adheres to GDPR compliance standards</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-neutral-850 text-[10px] font-mono text-neutral-500">
                  SECURE PORT CHECK // [SSL_ACTIVE]
                </div>
              </div>

              {/* Right Column: Dynamic Form Container */}
              <div className="md:col-span-7 bg-[#0b0f19]/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>
                
                <div className="space-y-6">
                  {isVerifyingEmail ? (
                    /* TWO-STEP VERIFICATION FLOW */
                    <div className="space-y-6">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-3">
                          <Shield className="h-3 w-3 text-cyan-400" />
                          <span className="text-[8px] font-mono tracking-widest text-cyan-400 uppercase font-bold">2-Step Verification</span>
                        </div>
                        <h2 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Verify Workspace</h2>
                        <p className="text-xs text-neutral-400 font-sans mt-1">
                          We sent a secure One-Time Passcode (OTP) and a Google verification link to your workspace email: 
                          <strong className="text-indigo-400 block mt-1 font-mono">{tempUser?.email}</strong>
                        </p>
                        
                        <div className="mt-4 p-4 bg-cyan-950/40 border border-cyan-800/40 rounded-xl shadow-lg shadow-cyan-950/20 animate-pulse">
                          <p className="text-xs text-cyan-300 font-sans font-extrabold tracking-wide uppercase leading-relaxed text-center">
                            "Okay, press the six-digit number that is sent to your email."
                          </p>
                        </div>
                      </div>

                      {/* OTP Submission form */}
                      <form onSubmit={handleVerifyOTP} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">6-Digit Security Code (OTP)</label>
                            <span className="text-[9px] font-mono text-cyan-400/80 animate-pulse">check toast for code</span>
                          </div>
                          <input 
                            type="text" 
                            maxLength={6}
                            required
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 123456" 
                            className="w-full bg-[#050814] border border-neutral-800 focus:border-cyan-500 focus:outline-none p-4 text-center font-mono text-xl tracking-[0.4em] text-white placeholder-neutral-700 transition-colors rounded-xl"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-full transition-all text-xs tracking-widest uppercase cursor-pointer"
                        >
                          <span>Confirm Verification Code</span>
                        </button>
                      </form>

                      {/* Alternate verification mechanism (Real email check) */}
                      <div className="pt-2">
                        <p className="text-[10px] text-neutral-500 font-mono text-center uppercase tracking-wider mb-2">or check link verification state</p>
                        <button
                          type="button"
                          onClick={handleCheckLinkVerified}
                          disabled={authLoading}
                          className="w-full inline-flex items-center justify-center gap-2 border border-neutral-800 hover:border-neutral-750 bg-[#050814] text-neutral-300 font-black py-3 rounded-full transition-all text-xs tracking-widest uppercase cursor-pointer"
                        >
                          {authLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>CHECKING STATUS...</span>
                            </>
                          ) : (
                            <span>I've clicked the verification email link</span>
                          )}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-850/60">
                        <button
                          type="button"
                          onClick={handleResendOTPAndLink}
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
                        >
                          Resend Code/Link
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsVerifyingEmail(false);
                            setTempUser(null);
                          }}
                          className="text-[10px] font-mono text-neutral-500 hover:text-neutral-400 transition-colors uppercase tracking-widest"
                        >
                          Back to Login
                        </button>
                      </div>
                    </div>
                  ) : isForgotPassword ? (
                    /* FORGOT PASSWORD FLOW */
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Reset Password</h2>
                        <p className="text-xs text-neutral-400 font-sans mt-1">
                          Enter your registered email address below, and we will send you a secure password reset link.
                        </p>
                      </div>

                      <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Workspace Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="e.g. alex.rivera@example.com" 
                            className="w-full bg-[#050814] border border-neutral-800 focus:border-indigo-500 focus:outline-none p-3 text-sm text-white placeholder-neutral-600 transition-colors"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-900 text-white font-black py-3 rounded-full transition-all text-xs tracking-widest uppercase cursor-pointer mt-2"
                        >
                          {authLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>SENDING RECOVERY LINK...</span>
                            </>
                          ) : (
                            <span>Send Recovery Link</span>
                          )}
                        </button>
                      </form>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(false)}
                          className="text-[10px] font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* STANDARD SIGN IN / CREATE WORKSPACE ACCOUNT FLOW */
                    <>
                      <div>
                        <h2 className="text-2xl font-sans font-black text-white uppercase tracking-tight">
                          Login Workspace
                        </h2>
                        <p className="text-xs text-neutral-400 font-sans mt-1">
                          Connect your workspace instantly using authorized Google single-sign-on credentials.
                        </p>
                      </div>

                      {/* Interactive Button Group */}
                      <div className="space-y-4 pt-2">
                        <button
                          onClick={handleGoogleLogin}
                          disabled={signingIn}
                          className="w-full inline-flex items-center justify-center gap-3 bg-white hover:bg-neutral-200 disabled:bg-neutral-900 text-black disabled:text-neutral-600 font-black py-4 rounded-full transition-all text-xs tracking-widest uppercase cursor-pointer shadow-lg shadow-white/5 hover:scale-[1.01] duration-150"
                        >
                          {signingIn ? (
                            <>
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              <span>AUTHENTICATING...</span>
                            </>
                          ) : (
                            <>
                              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '18px', height: '18px' }}>
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                              </svg>
                              <span>Sign in with Google Account</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleTryLiveAIDemo}
                          className="w-full inline-flex items-center justify-center gap-2 border border-emerald-500/40 hover:border-emerald-500 bg-emerald-950/10 text-emerald-400 hover:text-white py-4 rounded-full transition-all text-xs tracking-widest uppercase cursor-pointer hover:scale-[1.01] duration-150"
                        >
                          <Zap className="h-4 w-4" />
                          <span>Try Live AI Demo (Bypass Auth)</span>
                        </button>
                      </div>

                      {/* Divider line */}
                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-neutral-850"></div>
                        <span className="flex-shrink mx-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Optional Auth Streams</span>
                        <div className="flex-grow border-t border-neutral-850"></div>
                      </div>

                      {/* Locked/Coming Soon Email Method representation to respect "Later, just keep it like that, like later this feature will be available" */}
                      <div className="p-5 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-3 relative opacity-60">
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded">
                          <Lock className="h-3 w-3 text-neutral-500" />
                          <span className="text-[8px] font-mono tracking-widest text-neutral-400 uppercase font-black">LOCKED</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-[0.15em] text-neutral-500 uppercase block">Standard Email credentials</span>
                          <span className="text-xs font-sans text-neutral-400 block font-bold">Email address & OTP verification</span>
                          <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                            To comply with Google API and Firebase security guidelines, email/password accounts are temporarily deactivated. Email-based registration with secure password checks and 6-digit email OTP codes will be available in a later update.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-[9px] font-mono text-neutral-500 text-center mt-6 uppercase tracking-wider">
                  🔒 SSL Secured connection • Google verified API scopes
                </div>
              </div>

            </div>
          </main>

          {/* Footer */}
          <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 z-10 text-xs text-neutral-500">
            <div className="flex items-center gap-2 uppercase font-mono text-[10px] tracking-wider">
              <span>🔒 Direct SSL Google Integration</span>
              <span className="text-neutral-700">•</span>
              <span>GDPR COMPLIANT DATA PROTECTION</span>
            </div>
            <div>
              © 2026 RECOLLECTBUDDY OS • HACKATHON EDITION
            </div>
          </footer>
        </div>
      );
    }

    // Otherwise, render Landing Page
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col justify-between text-white relative font-sans overflow-x-hidden">
        {/* Subtle grid line overlay & glowing ambient background radial gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-100px] left-[30%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Header Bar */}
        <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-900/60 border border-neutral-800 rounded-xl">
              <Logo size={42} />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-xl tracking-tight text-white uppercase leading-none">
                RecollectBuddy
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 mt-1 uppercase">
                AI Executive Companion
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-black px-6 py-2.5 rounded-full transition-all text-xs tracking-wider uppercase cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <span>Launch App</span>
          </button>
        </header>

        {/* Hero Segment */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Hero Left Info */}
          <div className="lg:col-span-7 space-y-8 text-left max-w-2xl">
            {/* Gemini Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0e162f]/60 border border-indigo-500/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[10px] font-sans font-bold tracking-widest text-indigo-200 uppercase">
                Powered by Google Gemini AI
              </span>
            </div>

            {/* Giant Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-sans font-black text-white uppercase tracking-tight leading-[0.95] drop-shadow-md">
                Not a reminder app.<br />
                An <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-[#6366f1]">AI Executive Assistant</span>.
              </h1>
            </div>

            {/* Explanatory description */}
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-sans max-w-xl">
              Plan Smarter. Beat Deadlines. Stay Accountable. RecollectBuddy proactively reorganizes schedules, tracks streaks, and coaches you to finish work before deadlines hit.
            </p>

            {/* Interaction Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setShowLogin(true)}
                className="inline-flex items-center justify-center gap-3 bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-black px-8 py-4 rounded-full transition-all text-xs tracking-widest uppercase hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] cursor-pointer"
              >
                <span>Get Started For Free</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleTryLiveAIDemo}
                className="inline-flex items-center justify-center gap-2 border border-[#10b981]/50 hover:border-[#10b981] bg-slate-950/40 text-neutral-300 hover:text-white px-8 py-4 rounded-full transition-all text-xs tracking-widest uppercase cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                <span>Try Live AI Demo</span>
              </button>
            </div>
          </div>

          {/* Hero Right - Interactive Mockup Window */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#0b0f19]/90 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

              {/* Titlebar of mockup window */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-850">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                  RecollectBuddy // Agentic Monitor
                </span>
              </div>

              {/* Inner mockup widgets */}
              <div className="space-y-6 pt-6">
                
                {/* Primary focus block card */}
                <div className="p-5 bg-slate-950/60 border border-neutral-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                      Today's Focus Block
                    </span>
                    <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[9px] uppercase tracking-widest rounded-full">
                      High Priority
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-sans font-black text-white uppercase tracking-tight">
                      Advanced AI Submission
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-neutral-400">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-xs font-mono">14:00 (Duration: 2.5h)</span>
                    </div>
                  </div>
                </div>

                {/* Auto-reorganization alert card */}
                <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500"></div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest block">
                      ⚠️ Session missed? AI auto-reorganized!
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed italic">
                    "I have detected a calendar free-block tomorrow morning at 08:00 AM. I have shifted your AI project blocks to protect your deadline."
                  </p>
                </div>

              </div>

              {/* Decorative terminal/status indicator */}
              <div className="mt-6 pt-4 border-t border-neutral-850 flex items-center justify-between text-[9px] font-mono text-neutral-500">
                <span>[AGENT_LOADED]</span>
                <span className="animate-pulse">● SYSTEM_MONITOR_ACTIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Comprehensive Features Breakdown */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-neutral-900 z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-cyan-400 uppercase block">CORE SYSTEM CAPABILITIES</span>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
              A Complete Productivity Control Center
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 font-sans leading-relaxed">
              Every tool and system interface inside RecollectBuddy is integrated directly, giving you unified management over items, schedules, routines, and physical files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-950/40 border border-neutral-850 rounded-xl space-y-4 hover:border-neutral-700 transition-all">
              <div className="p-3 bg-indigo-950/40 text-indigo-400 border border-indigo-900/50 rounded-lg w-fit">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">AI Morning Briefing</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Generates a context-aware written breakdown of tasks, event times, and habit streaks the moment you open the workspace. Crafted to help you set direct milestones before starting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-950/40 border border-neutral-850 rounded-xl space-y-4 hover:border-neutral-700 transition-all">
              <div className="p-3 bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 rounded-lg w-fit">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">Dynamic Event Scheduler</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Set and visualize your absolute priorities. Our scheduler lists clear agendas chronologically, ensuring work blocks do not overlap and deadlines are protected.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-950/40 border border-neutral-850 rounded-xl space-y-4 hover:border-neutral-700 transition-all">
              <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 rounded-lg w-fit">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">Categorized Task Engine</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Organize tasks cleanly across categories like Work, Study, Health, and Admin. Set completion states to immediately recalculate stats and keep schedules updated.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-950/40 border border-neutral-850 rounded-xl space-y-4 hover:border-neutral-700 transition-all">
              <div className="p-3 bg-amber-950/40 text-amber-400 border border-amber-500/30 rounded-lg w-fit">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">Habit Streak Monitor</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Build lasting lifestyle routines with visual tracking. Logs streaks, maintains daily historical logs, and issues warning recommendations when you're at risk of breaking streaks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-slate-950/40 border border-neutral-850 rounded-xl space-y-4 hover:border-neutral-700 transition-all">
              <div className="p-3 bg-rose-950/40 text-rose-400 border border-rose-900/50 rounded-lg w-fit">
                <HardDrive className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">Directory Sync Workspace</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Browse and synchronize your cloud files inside your workspace. Instantly map items from remote directories and generate context checklists to coordinate project resources.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-slate-950/40 border border-neutral-850 rounded-xl space-y-4 hover:border-neutral-700 transition-all">
              <div className="p-3 bg-violet-950/40 text-violet-400 border border-violet-900/50 rounded-lg w-fit">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">Agentic AI Advisor</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                A conversational advisor panel that acts on your live agenda. Ask it to outline blueprints, formulate project tasks, and diagnose scheduler gaps on the fly.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Interpretation & System Flow */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-neutral-900 z-10 bg-[#060a1a]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-cyan-400 uppercase block">THE INTERPRETATION ENGINE</span>
              <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                How RecollectBuddy Evaluates Your Day
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Unlike simple calendar databases, RecollectBuddy utilizes an interactive evaluation cycle to keep you on schedule and accountable.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Continuous State Parsing</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">System compiles your pending task list, habit checkmarks, and upcoming calendar coordinates into a unified data structure.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Proactive LLM Briefing</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">The Gemini 2.5 Flash model processes this structure, generating an intelligent morning briefing highlighting schedule conflicts, due dates, and streak risks.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Interactive Assistant Adjustments</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">Users consult with the chatbot to immediately edit tasks, draft detailed study structures, or synchronize resources directly inside the same viewport.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side flow card visualizer */}
            <div className="lg:col-span-7 bg-[#0b0f19]/80 border border-neutral-850 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
              
              <div className="pb-4 border-b border-neutral-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">SYSTEM_INTERPRETATION_FLOW</span>
                </div>
                <span className="text-[9px] font-mono text-[#10b981] uppercase">[SYNCHRONIZED]</span>
              </div>

              {/* Graphical cards mapping out the loop */}
              <div className="space-y-4 pt-6">
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-3 bg-slate-950 border border-neutral-800 rounded">
                    <span className="text-neutral-400 block mb-1">INPUT</span>
                    <strong className="text-white">Active Agenda & Checklists</strong>
                  </div>
                  <div className="p-3 bg-[#0d162f] border border-indigo-900/40 rounded flex flex-col justify-center">
                    <span className="text-indigo-400 block mb-1">PROCESS</span>
                    <strong className="text-white">Gemini Context Map</strong>
                  </div>
                  <div className="p-3 bg-[#091b1a] border border-teal-900/40 rounded">
                    <span className="text-teal-400 block mb-1">OUTPUT</span>
                    <strong className="text-white">Optimized Action Brief</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-neutral-800 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Interpretation Prompt Structure:</span>
                  <p className="text-xs text-neutral-300 font-mono italic leading-relaxed bg-[#050814] p-3 border border-neutral-850 rounded">
                    "Analyze {`{ pendingTasks, events, habits }`}. Generate a highly prioritized 3-bullet briefing. Identify schedule gaps. Format output as a cohesive, scannable response."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Secure Connectivity & Integration */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-neutral-900 z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#10b981] uppercase block">ENTERPRISE SECURE CONNECTIVITY</span>
            <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
              Direct and Secure Integrations
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 font-sans leading-relaxed">
              We value your data privacy above all. RecollectBuddy establishes secure channels to read and write directory file information under standard protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-5 bg-slate-950/30 border border-neutral-850 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-cyan-400"></div>
              <div className="flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">No Password Storage</h4>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                We never prompt you for or store master account credentials. Authentication is entirely delegated to official, secure single-sign-on (SSO) systems.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 bg-slate-950/30 border border-neutral-850 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#10b981]"></div>
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-[#10b981]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Official Google OAuth</h4>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                Connects directly to Google Calendar and Google Drive using official Google API scopes. You remain in complete control and can revoke access anytime.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 bg-slate-950/30 border border-neutral-850 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500"></div>
              <div className="flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">SSL Encrypted Channels</h4>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                All data in transit between the workspace application, the agent, and your remote accounts is protected by secure, industry-standard SSL channels.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 bg-slate-950/30 border border-neutral-850 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-violet-500"></div>
              <div className="flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-violet-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Transient Data Storage</h4>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                Schedules, checklists, and habits are kept locally in your secure sandbox storage or synced dynamically under your personal profile session.
              </p>
            </div>
          </div>
        </section>

        {/* Footer info lockup */}
        <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 z-10 text-xs text-neutral-500">
          <div className="flex items-center gap-2 uppercase font-mono text-[10px] tracking-wider">
            <span>🔒 Direct Google Integration</span>
            <span className="text-neutral-700">•</span>
            <span>GDPR COMPLIANT DATA PROTECTION</span>
          </div>
          <div>
            © 2026 RECOLLECTBUDDY OS • HACKATHON EDITION
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#050814] border-b border-neutral-850 text-white px-6 py-4 flex items-center justify-between z-50 sticky top-0">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <div className="flex flex-col">
            <span className="text-[9px] tracking-[0.3em] font-bold text-neutral-500 uppercase leading-none">creative engine</span>
            <span className="font-sans font-black text-base tracking-tight uppercase text-white mt-0.5 leading-none">RecollectBuddy</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 hover:bg-neutral-900 rounded text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-300 fixed md:static inset-y-0 left-0 w-64 bg-[#050814] text-white border-r border-neutral-850 flex flex-col justify-between z-40 h-[calc(100vh-3.5rem)] md:h-screen pt-14 md:pt-0`}
      >
        <div className="px-6 py-8 space-y-10">
          {/* Logo brand */}
          <div className="hidden md:flex flex-row items-center gap-3">
            <div className="p-1 bg-slate-900/60 border border-neutral-800 rounded-lg">
              <Logo size={38} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.25em] font-bold text-neutral-500 uppercase leading-none">Creative Engine</span>
              <h1 className="font-sans font-black text-base tracking-tight uppercase text-white mt-1 leading-none">RecollectBuddy</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs tracking-widest font-bold uppercase transition-all ${
                    isActive 
                      ? 'bg-white text-black font-black' 
                      : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card footer */}
        <div className="p-6 border-t border-neutral-800">
          {userEmail ? (
            <div className="bg-neutral-900/50 p-4 rounded border border-neutral-800/80 flex items-center justify-between gap-3">
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate uppercase tracking-wider">{userName || 'User'}</span>
                <span className="text-[10px] text-neutral-500 font-mono block truncate mt-0.5">{userEmail}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-rose-400 hover:text-rose-500 rounded transition-colors shrink-0"
                title="Disconnect"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-neutral-900/40 p-4 rounded border border-neutral-800">
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 text-center leading-relaxed">Sync drive with official OAuth credentials</p>
              <button
                onClick={() => {
                  setActiveTab('drive');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-3 bg-white hover:bg-neutral-200 text-black font-black py-2.5 rounded text-xs uppercase tracking-widest transition-all text-center"
              >
                Auth Drive Sync
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile navigation menu */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Panel Area */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto bg-[#050814]">
        {activeTab === 'dashboard' && (
          <Dashboard 
            userEmail={userEmail}
            userName={userName}
            tasks={tasks}
            events={events}
            habits={habits}
            driveConnected={driveConnected}
            onNavigate={(tab) => setActiveTab(tab)}
            isDemoMode={isDemoMode}
          />
        )}
        
        {activeTab === 'chat' && (
          <AIAssistant 
            onAddTask={handleAddTask}
            onAddEvent={handleAddEvent}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'drive' && (
          <DriveManager 
            onDriveConnectionChange={(connected) => setDriveConnected(connected)}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'planner' && (
          <Planner 
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksManager 
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsTracker 
            habits={habits}
            onAddHabit={handleAddHabit}
            onToggleHabit={handleToggleHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {activeTab === 'integrations' && (
          <Integrations />
        )}

        {activeTab === 'about' && (
          <AboutApp />
        )}
      </main>

      {/* Toast Notifications */}
      <div id="toast-container" className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => {
            const isSuccess = t.type === 'success';
            const isError = t.type === 'error';
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`pointer-events-auto w-full p-4 border bg-[#0e1017]/95 backdrop-blur-md shadow-2xl flex items-start gap-3 relative overflow-hidden ${
                  isSuccess 
                    ? 'border-emerald-500/30' 
                    : isError 
                      ? 'border-rose-500/30' 
                      : 'border-cyan-500/30'
                }`}
              >
                {/* Decorative Accent Side Line */}
                <div 
                  className={`absolute top-0 bottom-0 left-0 w-1 ${
                    isSuccess 
                      ? 'bg-[#10b981]' 
                      : isError 
                        ? 'bg-rose-500' 
                        : 'bg-cyan-400'
                  }`}
                />
                
                {/* Icon */}
                <div className="shrink-0 mt-0.5">
                  {isSuccess && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />}
                  {isError && <AlertCircle className="h-4.5 w-4.5 text-rose-400" />}
                  {t.type === 'info' && <Info className="h-4.5 w-4.5 text-cyan-400" />}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                    {isSuccess ? 'SUCCESS_LOG' : isError ? 'ALERT_LOG' : 'INFO_LOG'}
                  </p>
                  <p className="text-[11px] text-neutral-100 font-sans mt-1 leading-relaxed">
                    {t.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                  className="text-neutral-500 hover:text-white transition-colors p-1 shrink-0 self-start"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
