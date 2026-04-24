import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  Calendar, 
  BarChart3, 
  Bell, 
  LogOut, 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  MousePointer2,
  RefreshCw,
  User,
  Lock,
  Printer,
  Clock,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants ---
const LOGO_URL = "https://ais-dev-4ghmlgu2ihq6ecz6dn6ccy-487328577540.asia-southeast1.run.app/logo.png"; // Placeholder for the new logo
const DEPARTMENTS = ["Thermal", "Flexo", "PFL", "Heat Transfer", "RFID", "Offset", "Levi's"];

// --- Components ---

const DelayModal = ({ isOpen, onClose, onConfirm, order, newDate }: { isOpen: boolean, onClose: () => void, onConfirm: (reason: string) => void, order: any, newDate: string }) => {
  const [reason, setReason] = React.useState('');
  
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-[500px] p-10 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-amber-50 rounded-2xl">
            <History className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Record Delay reason</h2>
            <p className="text-xs font-bold text-text-secondary uppercase opacity-60">SO: {order?.so_number}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-bg-main rounded-2xl border border-border-subtle">
              <p className="text-[0.6rem] font-black text-text-secondary uppercase mb-1">Old Date</p>
              <p className="text-sm font-black">{order?.delivery_date_cs}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-[0.6rem] font-black text-red-600 uppercase mb-1">New Date</p>
              <p className="text-sm font-black text-rpac-red">{newDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-black text-text-secondary uppercase tracking-widest pl-1">Reason for Adjustment</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g., Material shortage, Machine breakdown, Customer request..."
              className="w-full bg-bg-main border border-border-subtle rounded-2xl p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-rpac-red min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button onClick={onClose} className="flex-1 py-4 bg-bg-main text-text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-border-subtle">Cancel</button>
          <button 
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="flex-1 py-4 bg-rpac-red text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-rpac-red/20 disabled:opacity-50"
          >
            Confirm Change
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TimelineViewer = ({ orders }: { orders: any[] }) => {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] border border-border-subtle shadow-card p-10 mt-10 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Production Timeline</h3>
          <p className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-40 italic">Next 14 Day Slot Allocation</p>
        </div>
        <div className="flex items-center gap-4 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rpac-blue" /> Production</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Complete</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="flex border-b border-border-subtle mb-4">
            <div className="w-48 shrink-0 py-4 font-black text-[0.65rem] text-text-secondary uppercase">Machine / Order</div>
            {days.map(day => (
              <div key={day} className="flex-1 text-center py-4 border-l border-border-subtle">
                <span className="text-[0.65rem] font-black text-text-secondary uppercase block">{new Date(day).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {orders.slice(0, 8).map((order, i) => (
              <div key={i} className="flex items-center group">
                <div className="w-48 shrink-0 pr-4">
                   <p className="text-[0.75rem] font-black text-text-primary truncate">{order.so_number}</p>
                   <p className="text-[0.55rem] font-bold text-text-secondary uppercase opacity-40 truncate">{order.machine_name || 'Generic Line'}</p>
                </div>
                <div className="flex-1 relative h-10 bg-bg-main/50 rounded-full border border-border-subtle">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${((i + 3) * 17) % 40 + 20}%` }}
                     style={{ left: `${(i * 7) % 30}%` }}
                     className={`absolute h-full rounded-full flex items-center px-4 ${i % 3 === 0 ? 'bg-rpac-blue shadow-lg shadow-blue-500/20' : 'bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}
                   >
                     <span className="text-[0.55rem] font-black text-white uppercase whitespace-nowrap overflow-hidden">
                       {order.delivery_date_cs} • {order.order_qty?.toLocaleString()}
                     </span>
                   </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (userData: any) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await r.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (e) {
      setError('Connection to server failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rpac-blue flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-rpac-red opacity-10 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-500 opacity-10 rounded-full blur-[140px] animate-pulse-slow delay-1000" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white w-full max-w-[460px] rounded-[48px] shadow-2xl p-12 relative z-10 border border-white/20 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="p-4 bg-bg-main rounded-3xl mb-4 shadow-inner"
          >
            <img 
              src={LOGO_URL} 
              alt="RPAC Logo" 
              className="h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase">Production Access</h2>
          <p className="text-text-secondary text-xs mt-2 font-bold uppercase tracking-widest opacity-60 italic">Enterprise Intelligence System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-bg-main border-border-subtle border rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-rpac-red outline-none transition-all text-sm font-bold shadow-inner"
                required
              />
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Security Code"
                className="w-full bg-bg-main border-border-subtle border rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-rpac-red outline-none transition-all text-sm font-bold shadow-inner"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-rpac-red text-xs font-black uppercase text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button 
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-rpac-red text-white py-5 rounded-2xl font-black text-sm shadow-2xl shadow-rpac-red/30 hover:bg-red-600 transition-all flex items-center justify-center gap-3 mt-8 uppercase tracking-widest"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Enter Workspace'}
          </motion.button>
        </form>

        <div className="mt-12 text-center border-t border-dashed border-border-subtle pt-8">
            <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em]">SAP B1 Enterprise Integrated</p>
            </div>
            <p className="text-[0.6rem] text-text-secondary font-medium italic opacity-40 italic">Lanka Site 01 • Version 1.0.42-Stable</p>
        </div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, onLogout, userRole, userName }: { activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void, userRole: string, userName: string }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'planner', 'supervisor', 'management'] },
    { id: 'orders', icon: Layers, label: 'Work Orders', roles: ['admin', 'planner', 'supervisor'] },
    { id: 'scheduler', icon: Calendar, label: 'Scheduler', roles: ['admin', 'planner'] },
    { id: 'inventory', icon: Package, label: 'Inventory (SAP)', roles: ['admin', 'planner'] },
    { id: 'reports', icon: BarChart3, label: 'Analytics', roles: ['admin', 'management'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-[260px] bg-sidebar text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto shrink-0 z-50 shadow-2xl">
      <div className="p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img 
              src={LOGO_URL} 
              alt="RPAC Logo" 
              className="h-10 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" 
              referrerPolicy="no-referrer"
            />
            <div className="h-[2px] w-0 bg-rpac-red group-hover:w-full transition-all duration-500 rounded-full" />
        </div>
      </div>
      
      <nav className="flex-grow py-2 px-4 space-y-1 relative">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-4 text-[0.85rem] font-semibold transition-all duration-500 gap-4 rounded-2xl relative z-10 ${
              activeTab === item.id 
                ? 'text-white' 
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-sidebar-bg"
                className="absolute inset-0 bg-sidebar-active shadow-xl shadow-sidebar-active/30 rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <item.icon className={`w-[18px] h-[18px] transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'opacity-70'}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 rounded-3xl p-4 flex items-center gap-3 border border-white/5"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rpac-red to-rose-600 flex items-center justify-center text-[0.85rem] font-bold shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.85rem] font-bold truncate">{userName}</p>
            <p className="text-[0.65rem] text-white/40 uppercase tracking-tighter capitalize">{userRole}</p>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

const Header = ({ title }: { title: string }) => (
  <header className="bg-white/80 backdrop-blur-md border-b border-border-navbar h-[80px] flex items-center justify-between px-10 sticky top-0 z-40 shrink-0">
    <div className="flex flex-col">
      <h1 className="text-[1.25rem] font-black text-text-primary uppercase tracking-tight">{title}</h1>
      <p className="text-[0.7rem] text-text-secondary font-medium">Lanka Printing Division • Site 01</p>
    </div>
    <div className="flex items-center gap-8">
      <div className="flex flex-col text-right mr-2">
        <span className="text-[0.7rem] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 justify-end">
          <RefreshCw className="w-3 h-3" /> SAP B1 Connected
        </span>
        <span className="text-[0.75rem] text-text-secondary">Synced 2m ago</span>
      </div>
      <div className="relative cursor-pointer group">
        <div className="p-3 bg-bg-main rounded-2xl group-hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6 text-text-secondary" />
        </div>
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rpac-red rounded-full border-2 border-white animate-pulse"></span>
      </div>
    </div>
  </header>
);

const Dashboard = ({ userRole }: { userRole: string }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const r = await fetch('/api/dashboard/kpis');
        const data = await r.json();
        setStats(data);
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) return (
    <div className="h-[60vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
         <RefreshCw className="w-10 h-10 animate-spin text-rpac-blue/40" />
         <p className="text-sm font-bold text-text-secondary animate-pulse uppercase tracking-widest">Loading Analytics...</p>
       </div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: -15 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 180, 
        damping: 20 
      } 
    }
  };

  // Role-based visibility and specific views
  const isAdmin = userRole === 'admin';
  const isManagement = userRole === 'management';
  const isPlanner = userRole === 'planner';
  const isSupervisor = userRole === 'supervisor';

  const showProduction = isAdmin || isPlanner || isSupervisor || isManagement;
  const showOTD = isAdmin || isManagement;
  const showInventory = isAdmin || isPlanner;
  const showEfficiency = isAdmin || isManagement || isSupervisor;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-16 perspective-1000"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-10 pt-4">
        {showProduction && (
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-card border border-border-subtle group hover:shadow-2xl hover:border-rpac-blue/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rpac-blue/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 duration-700" />
            <p className="text-[0.65rem] text-text-secondary uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
               <Layers className="w-3 h-3 text-rpac-blue" /> Production
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-rpac-blue tracking-tighter">{stats.totalActiveOrders}</h3>
              <TrendingUp className="w-4 h-4 text-emerald-500 mb-1" />
            </div>
          </motion.div>
        )}
        
        {/* MTD Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-card border border-border-subtle group hover:shadow-2xl hover:border-blue-500/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 duration-700" />
            <p className="text-[0.65rem] text-text-secondary uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
               <Calendar className="w-3 h-3 text-blue-500" /> MTD Units
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-blue-700 tracking-tighter">{stats.mtdTarget || 0}</h3>
              <span className="text-[0.6rem] font-bold text-text-secondary uppercase opacity-40 mb-1">Month</span>
            </div>
        </motion.div>

        {/* YTD Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-card border border-border-subtle group hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 duration-700" />
            <p className="text-[0.65rem] text-text-secondary uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
               <BarChart3 className="w-3 h-3 text-indigo-500" /> YTD Volume
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-indigo-700 tracking-tighter">{stats.ytdTarget || 0}</h3>
              <span className="text-[0.6rem] font-bold text-text-secondary uppercase opacity-40 mb-1">Year</span>
            </div>
        </motion.div>

        {showOTD && (
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-card border border-border-subtle group hover:shadow-2xl hover:border-emerald-500/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 duration-700" />
            <p className="text-[0.65rem] text-text-secondary uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
               <CheckCircle2 className="w-3 h-3 text-emerald-500" /> OTD %
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-rpac-blue tracking-tighter">{stats.onTimeDeliveryRate}%</h3>
            </div>
          </motion.div>
        )}
        {showInventory && (
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-card border border-border-subtle group hover:shadow-2xl hover:border-rpac-red/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rpac-red/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 duration-700" />
            <p className="text-[0.65rem] text-text-secondary uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
               <AlertTriangle className="w-3 h-3 text-rpac-red" /> At Risk
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-rpac-red tracking-tighter">{stats.lowStockCount || 8}</h3>
            </div>
          </motion.div>
        )}
        {showEfficiency && (
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-[32px] shadow-card border border-border-subtle group hover:shadow-2xl hover:border-amber-500/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 duration-700" />
            <p className="text-[0.65rem] text-text-secondary uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
               <MousePointer2 className="w-3 h-3 text-amber-500" /> Plant OEE
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-amber-600 tracking-tighter">88.4%</h3>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-10">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[48px] border border-border-subtle shadow-card overflow-hidden">
          <div className="px-12 py-10 border-b border-border-subtle flex items-center justify-between bg-gradient-to-r from-white to-bg-main">
            <div>
                <h3 className="font-black text-text-primary uppercase tracking-tight text-xl">Pre-Press Pipeline</h3>
                <p className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-1 italic">Graphic Layout & Plate Approval System</p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-rpac-blue text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 active:scale-95">
              <Printer className="w-4 h-4" /> Plate Tracker
            </button>
          </div>
          <div className="p-12">
            <div className="grid grid-cols-7 gap-6 mb-8">
              {DEPARTMENTS.map((dept, idx) => (
                <div key={dept} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-full bg-bg-main h-40 rounded-[32px] relative overflow-hidden mb-4 border-2 border-border-subtle/50 group-hover:border-rpac-blue/30 group-hover:bg-blue-50/30 transition-all duration-700 shadow-inner group-hover:-translate-y-2">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${((idx + 1) * 23) % 75 + 15}%` }}
                      transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rpac-blue via-blue-500 to-sky-400 group-hover:brightness-110 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[0.6rem] font-black text-white bg-black/20 backdrop-blur-md px-2 py-1 rounded-full uppercase">Details</span>
                    </div>
                  </div>
                  <span className="text-[0.75rem] font-black text-text-secondary uppercase text-center leading-tight group-hover:text-rpac-blue transition-colors duration-500 w-full truncate px-1">{dept}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-rpac-blue shadow-lg shadow-blue-500/50" />
                        <span className="text-[0.7rem] font-black text-rpac-blue uppercase tracking-widest">Graphic Layout</span>
                    </div>
                    <p className="text-[0.65rem] font-bold text-text-secondary leading-normal opacity-60">Initial design and formatting stage from SAP BOM data.</p>
                 </div>
                 <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-rpac-red shadow-lg shadow-rpac-red/50" />
                        <span className="text-[0.7rem] font-black text-rpac-red uppercase tracking-widest">Layout Proof Reading</span>
                    </div>
                    <p className="text-[0.65rem] font-bold text-text-secondary leading-normal opacity-60">Quality check and text verification for production accuracy.</p>
                 </div>
                 <div className="p-6 bg-bg-main rounded-3xl border border-border-subtle flex flex-col gap-2 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-[0.7rem] font-black text-emerald-600 uppercase tracking-widest">Plates Processed</span>
                    </div>
                    <p className="text-[0.65rem] font-bold text-text-secondary leading-normal opacity-60">Final plates ready for department floor scheduling.</p>
                 </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-[48px] border border-border-subtle shadow-card p-12 flex flex-col items-center justify-between bg-gradient-to-b from-white to-bg-main relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rpac-blue/5 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="w-full mb-10 text-center">
            <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-2">Real-Time Status</h3>
            <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[0.7rem] font-black text-emerald-600 uppercase tracking-[0.2em] italic">SAP B1 Core Active</p>
            </div>
          </div>
          <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div 
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "backOut" }}
                className="absolute inset-0 rounded-full border-[28px] border-bg-main shadow-inner" 
              />
              <motion.div 
                initial={{ pathLength: 0, rotate: 180 }}
                animate={{ pathLength: 1, rotate: 45 }}
                transition={{ duration: 2.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-full border-[28px] border-rpac-blue border-t-transparent border-r-transparent drop-shadow-2xl" 
              />
              <motion.div 
                initial={{ pathLength: 0, rotate: 90 }}
                animate={{ pathLength: 1, rotate: -12 }}
                transition={{ duration: 2.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-full border-[28px] border-rpac-red border-t-transparent border-r-transparent border-b-transparent drop-shadow-2xl" 
              />
              <div className="flex flex-col items-center bg-white w-36 h-36 rounded-full shadow-2xl justify-center z-10 border border-border-subtle group-hover:scale-105 transition-transform duration-500">
                <p className="text-5xl font-black leading-none text-rpac-blue tracking-tighter">24</p>
                <p className="text-[0.7rem] text-text-secondary font-black uppercase tracking-[0.2em] mt-3">Orders</p>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-12 w-full text-[0.85rem] font-black">
             <div className="flex items-center gap-4 text-text-secondary group/item cursor-pointer hover:text-rpac-blue transition-colors">
                <div className="w-4 h-4 rounded-[6px] bg-rpac-blue shadow-lg group-hover/item:scale-125 transition-transform" /> <span className="opacity-60 group-hover/item:opacity-100 uppercase tracking-tighter">Flexo</span>
             </div>
             <div className="flex items-center gap-4 text-text-secondary group/item cursor-pointer hover:text-rpac-red transition-colors">
                <div className="w-4 h-4 rounded-[6px] bg-rpac-red shadow-lg group-hover/item:scale-125 transition-transform" /> <span className="opacity-60 group-hover/item:opacity-100 uppercase tracking-tighter">Thermal</span>
             </div>
             <div className="flex items-center gap-4 text-text-secondary group/item cursor-pointer hover:text-amber-500 transition-colors">
                <div className="w-4 h-4 rounded-[6px] bg-amber-500 shadow-lg group-hover/item:scale-125 transition-transform" /> <span className="opacity-60 group-hover/item:opacity-100 uppercase tracking-tighter">RFID</span>
             </div>
             <div className="flex items-center gap-4 text-text-secondary group/item cursor-pointer hover:text-emerald-500 transition-colors">
                <div className="w-4 h-4 rounded-[6px] bg-emerald-500 shadow-lg group-hover/item:scale-125 transition-transform" /> <span className="opacity-60 group-hover/item:opacity-100 uppercase tracking-tighter">Levi's</span>
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const WorkOrderDashboard = ({ userRole }: { userRole: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBomId, setShowBomId] = useState<string | null>(null);
  const [bomData, setBomData] = useState<any[]>([]);
  
  const [delayInfo, setDelayInfo] = useState<{order: any, newDate: string} | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const fetchDepts = async () => {
    const r = await fetch('/api/departments');
    const json = await r.json();
    setDepts(json);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = selectedDept ? `/api/orders?department_id=${selectedDept}` : '/api/orders';
      const r = await fetch(url);
      const json = await r.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedDept]);

  const fetchBom = async (itemCode: string) => {
    const r = await fetch(`/api/bom/${itemCode}`);
    const json = await r.json();
    setBomData(json);
    setShowBomId(itemCode);
  };

  const updateOrder = async (id: number, fields: any) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });
    fetchData();
  };

  const handleDateChange = (order: any, newDate: string) => {
    if (newDate > order.delivery_date_cs) {
      setDelayInfo({ order, newDate });
    } else {
      updateOrder(order.id, { delivery_date_cs: newDate });
    }
  };

  const confirmDelay = async (reason: string) => {
    if (!delayInfo) return;
    
    await fetch('/api/orders/delay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: delayInfo.order.id,
        original_date: delayInfo.order.delivery_date_cs,
        new_date: delayInfo.newDate,
        reason
      })
    });
    
    setDelayInfo(null);
    fetchData();
  };

  const filteredData = data.filter(row => 
    row.so_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.fg_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[40px] border border-border-subtle shadow-card px-10 py-8 animate-in zoom-in-95 duration-700 overflow-hidden min-h-[700px]">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-10 gap-6">
        <div className="flex flex-col">
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Work Order Planning Hub</h3>
            <div className="flex items-center gap-3 mt-1">
                <span className="text-[0.65rem] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest italic">Live Multi-Dept Sync</span>
                <p className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-40 italic">Centralized Production Control</p>
            </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
           <div className="flex bg-bg-main p-1.5 rounded-2xl border border-border-subtle shadow-inner mr-2">
              <button 
                onClick={() => setShowTimeline(false)}
                className={`px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-widest rounded-xl transition-all ${!showTimeline ? 'bg-white shadow-sm text-rpac-blue' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Table View
              </button>
              <button 
                onClick={() => setShowTimeline(true)}
                className={`px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-widest rounded-xl transition-all ${showTimeline ? 'bg-white shadow-sm text-rpac-blue' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Timeline Viewer
              </button>
           </div>

           <div className="relative flex-grow min-w-[200px]">
             <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search Orders..." 
               className="w-full xl:w-[260px] bg-bg-main border-0 rounded-2xl py-4 pl-14 pr-8 focus:ring-2 focus:ring-rpac-blue outline-none transition-all text-sm font-bold shadow-inner"
             />
           </div>

           <select 
             value={selectedDept}
             onChange={(e) => setSelectedDept(e.target.value)}
             className="bg-bg-main border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rpac-blue outline-none transition-all text-sm font-black uppercase tracking-widest shadow-inner cursor-pointer"
           >
              <option value="">All Departments</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
           </select>

           <button 
             onClick={fetchData}
             className="flex items-center px-8 py-4 bg-rpac-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
           >
             <RefreshCw className={`w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-700 ${loading ? 'animate-spin' : ''}`} /> Sync Orders
           </button>
        </div>
      </div>
      
      {showTimeline ? (
        <TimelineViewer orders={filteredData} />
      ) : (
        <div className="overflow-x-auto rounded-[32px] border border-border-subtle shadow-sm bg-white">
          <table className="w-full text-left border-collapse table-auto min-w-[1400px]">
            <thead>
              <tr className="bg-bg-main/50 border-b border-border-subtle">
                <th className="px-6 py-5 text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em]">Dept / Stage</th>
                <th className="px-6 py-5 text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em]">SO & Rec Date</th>
                <th className="px-6 py-5 text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em] text-right">Qty & Bal</th>
                <th className="px-6 py-5 text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em]">Item & BOM</th>
                <th className="px-6 py-5 text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em] text-center">Planning Date</th>
                <th className="px-6 py-5 text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em] text-center">Machine Aloc</th>
                <th className="px-6 py-5 text-[0.65rem] font-black text-text-secondary uppercase tracking-[0.2em] text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 uppercase">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-10 bg-gray-50/10"></td>
                  </tr>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/10 transition-all duration-300 group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <span className="text-[0.6rem] font-black text-rpac-blue bg-blue-50 px-2 py-0.5 rounded-md w-fit border border-blue-100">{row.department_name}</span>
                        <div className="flex flex-col">
                          <span className={`text-[0.65rem] font-black ${
                              row.current_stage?.includes('DISPATCH') ? 'text-indigo-600' :
                              row.current_stage?.includes('PRODUCTION') ? 'text-amber-600' : 'text-gray-500'
                          }`}>
                              {row.current_stage}
                          </span>
                          <span className="text-[0.6rem] text-text-secondary opacity-50 lowercase truncate max-w-[120px]">{row.docket_update}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[0.85rem] font-black text-text-primary group-hover:text-rpac-blue transition-colors underline decoration-dotted decoration-rpac-blue/30 cursor-help" title="View SO Details">{row.so_number}</span>
                          <span className="text-[0.6rem] text-text-secondary font-bold opacity-60">Rec: {row.planning_received_date}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-text-primary">{row.order_qty?.toLocaleString()}</span>
                        <span className={`text-[0.7rem] font-black ${row.balance > 0 ? 'text-rpac-red' : 'text-emerald-600'}`}>
                            {row.balance > 0 ? `Bal: ${row.balance?.toLocaleString()}` : 'Completed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col max-w-[320px]">
                        <span className="text-[0.8rem] font-black text-text-primary truncate" title={row.fg_description}>{row.fg_description}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[0.6rem] text-text-secondary font-bold truncate opacity-80 uppercase">{row.customer_name}</span>
                          <button 
                              onClick={() => fetchBom(row.fg_description)}
                              className="bg-bg-main hover:bg-gray-200 p-1 px-2 rounded-lg text-[0.6rem] font-black text-text-secondary transition-colors flex items-center gap-1"
                          >
                              <Layers className="w-3 h-3" /> BOM calc
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                          <input 
                              type="date" 
                              defaultValue={row.delivery_date_cs}
                              onChange={(e) => handleDateChange(row, e.target.value)}
                              className="bg-bg-main/50 border border-border-subtle rounded-xl px-3 py-2 text-[0.7rem] font-black focus:ring-2 focus:ring-rpac-blue outline-none transition-all cursor-pointer"
                          />
                          <span className="text-[0.55rem] font-black text-text-secondary opacity-40 uppercase tracking-tighter">Planned Delivery</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                          <div className="px-4 py-2 bg-bg-main rounded-xl border border-border-subtle flex items-center gap-2 group/mac hover:border-rpac-blue/30 transition-all cursor-pointer">
                              <Printer className="w-3 h-3 text-text-secondary group-hover/mac:text-rpac-blue" />
                              <span className="text-[0.7rem] font-black text-text-primary">{row.machine_name || 'Unassigned'}</span>
                          </div>
                          <span className="text-[0.55rem] font-black text-text-secondary opacity-40 uppercase tracking-tighter">Production Slot</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 justify-center">
                        {[1,2,3,4,5].map(i => (
                            <div 
                                 key={i} 
                                 onClick={() => updateOrder(row.id, { priority: i })}
                                 className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-125 ${
                                    i <= (row.priority || 0) 
                                    ? (row.priority > 3 ? 'bg-rpac-red scale-110 shadow-sm shadow-red-400' : 'bg-amber-400') 
                                    : 'bg-gray-100 hover:bg-gray-200'
                                 }`} 
                            />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                          <Layers className="w-16 h-16" />
                          <p className="text-sm font-black uppercase tracking-[0.3em]">No records in current partition</p>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DelayModal 
        isOpen={!!delayInfo} 
        onClose={() => setDelayInfo(null)} 
        onConfirm={confirmDelay} 
        order={delayInfo?.order} 
        newDate={delayInfo?.newDate || ''} 
      />

      <AnimatePresence>
        {showBomId && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-rpac-blue/40 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-[48px] w-full max-w-[800px] shadow-[0_32px_120px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                    <div className="px-12 py-10 border-b bg-bg-main flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-white rounded-3xl shadow-sm border border-border-subtle">
                                <Package className="w-8 h-8 text-rpac-blue" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">BOM material Analysis</h2>
                                <p className="text-[0.7rem] font-bold text-text-secondary uppercase mt-1 opacity-60">Item Code: {showBomId}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowBomId(null)} className="p-3 hover:bg-gray-200 rounded-2xl transition-colors">
                            <Plus className="w-8 h-8 rotate-45 text-text-secondary" />
                        </button>
                    </div>
                    <div className="p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                            <div className="flex flex-col gap-2">
                                <p className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary">Expected Required Qty</p>
                                <p className="text-3xl font-black text-rpac-blue">150,000 PCS</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary text-right">Raw material Status</p>
                                <p className="text-3xl font-black text-emerald-600 text-right uppercase">Optimized</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {bomData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-bg-main rounded-3xl border border-border-subtle hover:border-rpac-blue/20 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xs font-black text-text-secondary border border-border-subtle">#{i+1}</div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.75rem] font-black text-text-primary uppercase">{item.description}</span>
                                            <span className="text-[0.6rem] font-bold text-text-secondary opacity-40">Code: {item.material_code}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[0.8rem] font-black text-rpac-blue">{item.quantity_per_unit} {item.uom}</span>
                                            <span className="text-[0.55rem] font-black text-text-secondary uppercase opacity-40 tracking-widest">per unit</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[0.8rem] font-black text-emerald-600">{150000 * item.quantity_per_unit} {item.uom}</span>
                                            <span className="text-[0.55rem] font-black text-text-secondary uppercase opacity-40 tracking-widest">total need</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-8 bg-gray-50 flex justify-end gap-5">
                        <button className="px-10 py-5 bg-bg-main text-text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-border-subtle">Export BOM (Excel)</button>
                        <button className="px-10 py-5 bg-rpac-red text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-rpac-red/20 active:scale-95">Open MR in SAP</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MachineScheduler = () => {
    const [machines, setMachines] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/machines').then(r => r.json()).then(setMachines);
    }, []);

    return (
        <div className="bg-white p-10 rounded-[40px] border border-border-subtle shadow-card animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col">
                <h3 className="font-black text-text-primary uppercase tracking-tight">Machine Capacity Planner</h3>
                <p className="text-[0.7rem] text-text-secondary font-bold uppercase tracking-widest mt-1">Real-time scheduling per department</p>
            </div>
            <div className="flex bg-bg-main p-1.5 rounded-2xl border border-border-subtle shadow-inner">
                <button className="px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-widest rounded-xl bg-white shadow-sm text-rpac-blue text-xs tracking-widest">Shift Queue</button>
                <button className="px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-widest rounded-xl text-text-secondary hover:text-text-primary text-xs tracking-widest">Timeline Viewer</button>
            </div>
            </div>
            
            <div className="space-y-10">
            {machines.length > 0 ? machines.map((item, i) => {
                const load = [85, 40, 65, 20][i % 4];
                const color = ['bg-rpac-blue', 'bg-rpac-red', 'bg-indigo-600', 'bg-emerald-600'][i % 4];
                return (
                    <div key={item.id} className="group">
                    <div className="flex justify-between mb-4">
                        <span className="text-[0.75rem] font-black text-text-primary uppercase tracking-tighter flex items-center gap-2">
                        <Printer className="w-4 h-4 text-text-secondary group-hover:text-rpac-blue transition-colors" /> {item.name}
                        </span>
                        <span className="text-[0.75rem] font-black text-rpac-blue">{load}% Allocated</span>
                    </div>
                    <div className="relative h-14 bg-bg-main rounded-3xl p-2 border border-border-subtle shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${load}%` }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full ${color} rounded-2xl shadow-lg relative overflow-hidden group-hover:brightness-110 transition-all`}
                        >
                            <div className="absolute inset-0 bg-white/10 [mask-image:linear-gradient(45deg,transparent_25%,black_25%,black_50%,transparent_50%,transparent_75%,black_75%,black)] bg-[length:16px_16px] animate-[pulse_3s_linear_infinite]" />
                        </motion.div>
                    </div>
                    </div>
                )
            }) : (
                <div className="py-20 text-center text-text-secondary uppercase tracking-widest opacity-20 font-black">No machine data fetched</div>
            )}
            </div>
        </div>
    );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    if (userData.role === 'management') setActiveTab('dashboard');
    else if (userData.role === 'supervisor') setActiveTab('orders');
    else setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const titles: any = {
    dashboard: 'Operations Hub',
    orders: 'Production Tracker',
    scheduler: 'Capacity Planning',
    inventory: 'Material Control',
    reports: 'Insight & Intelligence',
  };

  return (
    <div className="min-h-screen bg-bg-main font-sans selection:bg-rpac-red selection:text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} userRole={user.role} userName={user.name} />
      
      <main className="ml-[260px] min-h-screen flex flex-col">
        <Header title={titles[activeTab]} />
        
        <div className="p-10 flex-grow">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[1600px] mx-auto"
                >
                    {activeTab === 'dashboard' && <Dashboard userRole={user.role} />}
                    {activeTab === 'orders' && <WorkOrderDashboard userRole={user.role} />}
                    {activeTab === 'scheduler' && <MachineScheduler />}
                    
                    {activeTab === 'inventory' && (
                        <div className="bg-white rounded-[48px] border border-border-subtle shadow-card px-10 py-12 animate-in zoom-in-95 duration-700">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="font-black text-text-primary uppercase tracking-tight text-xl">Material Stock (SAP B1)</h3>
                                    <p className="text-[0.7rem] text-text-secondary font-bold uppercase tracking-widest mt-1">Live inventory from SAP records</p>
                                </div>
                                <button className="flex items-center px-10 py-5 bg-rpac-blue text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rpac-blue/20 hover:scale-[1.02] transition-all">
                                    <RefreshCw className="w-5 h-5 mr-3" /> Sync Materials
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Thermal Ribbon', stock: '450 Rolls', status: 'Optimal' },
                                    { label: 'Flexo Solvent', stock: '120 KG', status: 'Low Stock' },
                                    { label: 'Heat Transfer Glue', stock: '80 Liters', status: 'Reorder' }
                                ].map(item => (
                                    <div key={item.label} className="bg-bg-main p-8 rounded-[32px] border border-border-subtle shadow-inner">
                                        <p className="text-[0.7rem] font-black uppercase text-text-secondary mb-2 tracking-widest opacity-60">{item.label}</p>
                                        <p className="text-3xl font-black text-rpac-blue tracking-tighter mb-4">{item.stock}</p>
                                        <span className={`text-[0.65rem] font-black uppercase px-3 py-1 rounded-xl border ${item.status === 'Optimal' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rpac-red bg-red-50 border-red-100'}`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="bg-white rounded-[48px] border border-border-subtle shadow-card px-10 py-12 animate-in duration-700">
                             <div className="flex items-center justify-between mb-12">
                                <h3 className="font-black text-text-primary uppercase tracking-tight text-xl">Production Analytics</h3>
                                <div className="flex gap-4">
                                    <button className="px-8 py-4 bg-bg-main text-text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-border-subtle">MTD</button>
                                    <button className="px-8 py-4 bg-rpac-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95">YTD</button>
                                </div>
                             </div>
                             <div className="h-[400px] w-full bg-bg-main rounded-[32px] flex items-center justify-center border border-dashed border-border-subtle shadow-inner">
                                <div className="flex flex-col items-center opacity-20">
                                    <BarChart3 className="w-16 h-16 text-text-primary" />
                                    <p className="text-sm font-black uppercase tracking-[0.4em] mt-6">Processing Plant Efficiency Data...</p>
                                </div>
                             </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
        
        <footer className="px-10 py-6 border-t border-border-navbar flex justify-between items-center bg-white/50">
           <p className="text-[0.65rem] font-bold text-text-secondary uppercase tracking-[0.2em]">&copy; 2026 RPAC Lanka Private Limited</p>
           <div className="flex gap-6">
              <span className="text-[0.65rem] font-bold text-text-secondary uppercase tracking-widest hover:text-rpac-red transition-colors cursor-pointer">Security Policy</span>
              <span className="text-[0.65rem] font-bold text-text-secondary uppercase tracking-widest hover:text-rpac-red transition-colors cursor-pointer">System Logs</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
