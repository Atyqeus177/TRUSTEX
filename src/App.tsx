import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate,
  Link
} from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  where,
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { db, auth } from './firebase';
import { Submission, DIRECTED_TO_OPTIONS, QUESTIONS } from './types';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  LayoutDashboard, 
  LogOut, 
  Trash2, 
  Eye, 
  Download, 
  Search,
  Filter,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#F27D26] selection:text-white">
    <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:bg-[#F27D26] transition-colors">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tighter uppercase italic">TRUSTEX</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium opacity-60">
          <span className="hidden sm:inline">Supervised by Patriq Digital Solutions</span>
          <Link to="/admin/login" className="hover:text-[#F27D26] transition-colors flex items-center gap-1">
            <Lock className="w-3 h-3" /> Admin
          </Link>
        </div>
      </div>
    </header>
    <main className="max-w-5xl mx-auto px-6 py-12">
      {children}
    </main>
    <footer className="border-t border-black/5 py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-xs uppercase tracking-widest">
        <p>© 2026 TRUSTEX SOCIAL EXPERIMENT</p>
        <p>PATRIQ DIGITAL SOLUTIONS</p>
      </div>
    </footer>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    directed_to: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.directed_to || !formData.reason) return;
    localStorage.setItem('trustex_reg', JSON.stringify(formData));
    navigate('/experiment');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-12"
    >
      <div className="space-y-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none italic uppercase">
          Digital Trust <br />
          <span className="text-[#F27D26]">Experiment</span>
        </h1>
        <p className="text-lg opacity-60 max-w-lg mx-auto leading-relaxed">
          TRUSTEX is a social experiment designed to explore human trust, online behavior, and digital interactions. Participation is voluntary, and all responses are confidential.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-black/5 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest opacity-40">Full Name</label>
          <input 
            required
            type="text"
            placeholder="Enter your name"
            className="w-full bg-[#F5F5F5] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#F27D26] transition-all outline-none"
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest opacity-40">Directed To</label>
          <select 
            required
            className="w-full bg-[#F5F5F5] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#F27D26] transition-all outline-none appearance-none"
            value={formData.directed_to}
            onChange={e => setFormData({ ...formData, directed_to: e.target.value })}
          >
            <option value="">Select a person</option>
            {DIRECTED_TO_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest opacity-40">Reason for Participation</label>
          <textarea 
            required
            rows={4}
            placeholder="Describe why you are participating in this experiment..."
            className="w-full bg-[#F5F5F5] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#F27D26] transition-all outline-none resize-none"
            value={formData.reason}
            onChange={e => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#F27D26] transition-colors flex items-center justify-center gap-2 group"
        >
          Save & Begin TRUSTEX Experiment
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
};

const ExperimentPage = () => {
  const navigate = useNavigate();
  const [regData, setRegData] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>(new Array(8).fill(''));
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('trustex_reg');
    if (!saved) navigate('/');
    else setRegData(JSON.parse(saved));
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      submitExperiment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const submitExperiment = async () => {
    if (answers.some(a => !a.trim())) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simple heuristic for "experienced scam" - check q4 for keywords
      const q4 = answers[3].toLowerCase();
      const hasScam = q4.includes('yes') || q4.includes('fraud') || q4.includes('scam') || q4.includes('deception');

      await addDoc(collection(db, 'submissions'), {
        ...regData,
        q1: answers[0],
        q2: answers[1],
        q3: answers[2],
        q4: answers[3],
        q5: answers[4],
        q6: answers[5],
        q7: answers[6],
        q8: answers[7],
        created_at: new Date().toISOString(),
        has_experienced_scam: hasScam
      });
      localStorage.removeItem('trustex_reg');
      navigate('/thank-you');
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while saving your responses. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!regData) return null;

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Question {currentStep + 1} of 8</p>
            <h2 className="text-3xl font-bold tracking-tight italic">{QUESTIONS[currentStep]}</h2>
          </div>
        </div>
        <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#F27D26]" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        <textarea 
          autoFocus
          rows={10}
          placeholder="Type your answer here..."
          className="w-full bg-white border border-black/10 rounded-2xl p-8 focus:ring-2 focus:ring-[#F27D26] transition-all outline-none resize-none text-lg leading-relaxed shadow-sm"
          value={answers[currentStep]}
          onChange={e => {
            const newAnswers = [...answers];
            newAnswers[currentStep] = e.target.value;
            setAnswers(newAnswers);
          }}
        />

        <div className="flex gap-4">
          {currentStep > 0 && (
            <button 
              onClick={handlePrev}
              className="px-8 py-5 rounded-xl font-bold uppercase tracking-widest bg-[#F5F5F5] hover:bg-black/5 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          )}
          <button 
            onClick={handleNext}
            disabled={!answers[currentStep].trim() || isSubmitting}
            className="flex-1 bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#F27D26] transition-colors flex items-center justify-center gap-2 disabled:opacity-20"
          >
            {isSubmitting ? 'Saving...' : currentStep === QUESTIONS.length - 1 ? 'Complete Experiment' : 'Next Question'}
            {currentStep < QUESTIONS.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const ThankYouPage = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-2xl mx-auto text-center space-y-8 py-12"
  >
    <div className="w-24 h-24 bg-[#F27D26] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#F27D26]/20">
      <CheckCircle className="w-12 h-12 text-white" />
    </div>
    <div className="space-y-4">
      <h1 className="text-5xl font-bold tracking-tighter italic uppercase">Thank You</h1>
      <p className="text-xl opacity-60 leading-relaxed">
        Thank you for participating in TRUSTEX. Your insights help us understand digital trust and human behavior online.
      </p>
    </div>
    <div className="p-8 bg-white border border-black/5 rounded-2xl shadow-sm">
      <p className="text-sm italic opacity-60">
        "Special thanks to everyone who participated and shared their honest perspectives. Your contribution is valuable and appreciated."
      </p>
    </div>
    <Link 
      to="/" 
      className="inline-block bg-black text-white px-12 py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#F27D26] transition-colors"
    >
      Return Home
    </Link>
  </motion.div>
);

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please ensure you have admin access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter italic uppercase">Admin Access</h1>
        <p className="opacity-60">Please sign in with your authorized Google account to access the dashboard.</p>
      </div>
      <button 
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#F27D26] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
        {loading ? 'Authenticating...' : 'Sign in with Google'}
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirected, setFilterDirected] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Check if user is admin (atyq379@gmail.com is default)
        if (u.email === 'atyq379@gmail.com') {
          setIsAdmin(true);
          setUser(u);
        } else {
          // Check firestore users collection
          const userDoc = await getDocFromServer(doc(db, 'users', u.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
            setUser(u);
          } else {
            alert("Unauthorized access.");
            signOut(auth);
            navigate('/admin/login');
          }
        }
      } else {
        navigate('/admin/login');
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'submissions'), orderBy('created_at', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(data);
      setLoading(false);
    });
    return () => unsub();
  }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteDoc(doc(db, 'submissions', id));
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Full Name", "Directed To", "Reason", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Date"];
    const rows = submissions.map(s => [
      s.id,
      s.full_name,
      s.directed_to,
      s.reason,
      s.q1, s.q2, s.q3, s.q4, s.q5, s.q6, s.q7, s.q8,
      s.created_at
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `trustex_submissions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = submissions.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.q1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.q4.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDirected ? s.directed_to === filterDirected : true;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const totalSubmissions = submissions.length;
  const submissionsToday = submissions.filter(s => 
    format(new Date(s.created_at), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;
  const scamExperiencedCount = submissions.filter(s => s.has_experienced_scam).length;

  const directedStats = DIRECTED_TO_OPTIONS.map(opt => ({
    name: opt,
    count: submissions.filter(s => s.directed_to === opt).length
  })).sort((a, b) => b.count - a.count);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-12 h-12 border-4 border-[#F27D26] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tighter italic uppercase">Admin Dashboard</h1>
          <p className="opacity-40 text-sm font-medium">Logged in as {user?.email}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportCSV}
            className="bg-[#F5F5F5] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black/5 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={() => signOut(auth)}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#F27D26] transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">Total Submissions</p>
          <p className="text-4xl font-bold tracking-tighter italic">{totalSubmissions}</p>
        </div>
        <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">Submissions Today</p>
          <p className="text-4xl font-bold tracking-tighter italic text-[#F27D26]">{submissionsToday}</p>
        </div>
        <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">Scam Experiences</p>
          <p className="text-4xl font-bold tracking-tighter italic text-red-500">{scamExperiencedCount}</p>
        </div>
        <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-sm space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40">Most Targeted</p>
          <p className="text-xl font-bold tracking-tight truncate">{directedStats[0]?.name || 'N/A'}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-black/5 p-8 rounded-2xl shadow-sm space-y-6">
          <h3 className="font-bold uppercase tracking-widest text-sm opacity-40 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Submissions by Person
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={directedStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                <XAxis dataKey="name" hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.4 }} />
                <Tooltip 
                  cursor={{ fill: '#00000005' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#F27D26" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-black/5 p-8 rounded-2xl shadow-sm space-y-6">
          <h3 className="font-bold uppercase tracking-widest text-sm opacity-40 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Fraud Exposure
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Experienced Scam', value: scamExperiencedCount },
                    { name: 'No Scam', value: totalSubmissions - scamExperiencedCount }
                  ]}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#EF4444" />
                  <Cell fill="#00000010" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-3xl font-bold italic">{Math.round((scamExperiencedCount / totalSubmissions) * 100) || 0}%</p>
              <p className="text-[10px] uppercase tracking-widest opacity-40">At Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-black/5 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
            <input 
              type="text"
              placeholder="Search by name or content..."
              className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#F27D26] transition-all outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
              <select 
                className="w-full md:w-56 bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#F27D26] transition-all outline-none appearance-none"
                value={filterDirected}
                onChange={e => setFilterDirected(e.target.value)}
              >
                <option value="">All Directed Persons</option>
                {DIRECTED_TO_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F5]/50 text-[10px] uppercase tracking-widest font-bold opacity-40">
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4">Directed To</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-black/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold tracking-tight">{s.full_name}</div>
                    <div className="text-xs opacity-40 truncate max-w-[200px]">{s.reason}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{s.directed_to}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm opacity-40">{format(new Date(s.created_at), 'MMM dd, HH:mm')}</span>
                  </td>
                  <td className="px-6 py-4">
                    {s.has_experienced_scam ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-md text-[10px] font-bold uppercase tracking-tighter">
                        <AlertTriangle className="w-3 h-3" /> Scam Exp.
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-md text-[10px] font-bold uppercase tracking-tighter">
                        <CheckCircle className="w-3 h-3" /> Safe
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedSubmission(s)}
                        className="p-2 hover:bg-black hover:text-white rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id!)}
                        className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-[#F5F5F5]/50">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tighter italic uppercase">{selectedSubmission.full_name}</h2>
                  <p className="text-xs font-medium opacity-40 uppercase tracking-widest">
                    Directed to {selectedSubmission.directed_to} • {format(new Date(selectedSubmission.created_at), 'PPP p')}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5 rotate-180" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-10">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F27D26]">Reason for Participation</h4>
                  <p className="text-lg leading-relaxed italic opacity-80">{selectedSubmission.reason}</p>
                </div>
                
                <div className="grid gap-10">
                  {QUESTIONS.map((q, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                        <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest">{q}</h4>
                      </div>
                      <div className="pl-9">
                        <p className="text-lg leading-relaxed bg-[#F5F5F5] p-6 rounded-2xl border border-black/5">
                          {(selectedSubmission as any)[`q${i+1}`]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/experiment" element={<ExperimentPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
