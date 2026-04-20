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
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants ---
const LOGO_URL = "https://storage.googleapis.com/static.antigravity.dev/cortex/8987019/rpac-logo.png";
const DEPARTMENTS = ["Thermal", "Flexo", "PFL", "Heat Transfer", "RFID", "Offset", "Levi's"];

// --- Components ---

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-rpac-blue flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rpac-red opacity-10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 opacity-10 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-[420px] rounded-[32px] shadow-2xl p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <img 
            src={LOGO_URL} 
            alt="RPAC Logo" 
            className="h-16 mb-4 object-contain"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Production Management</h2>
          <p className="text-text-secondary text-sm mt-1">Enterprise Planning Suite</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-widest px-1">Username</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-bg-main border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rpac-red outline-none transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-widest px-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-main border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rpac-red outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-rpac-red text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-rpac-red/20 hover:bg-red-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary">
            Syncing with <span className="font-bold text-rpac-blue">SAP Business One</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders', icon: Layers, label: 'Work Orders' },
    { id: 'scheduler', icon: Calendar, label: 'Scheduler' },
    { id: 'inventory', icon: Package, label: 'Inventory (SAP)' },
    { id: 'reports', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="w-[260px] bg-sidebar text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto shrink-0 z-50">
      <div className="p-8 flex items-center justify-center">
        <img 
          src={LOGO_URL} 
          alt="RPAC" 
          className="h-10 object-contain invert brightness-200" 
          referrerPolicy="no-referrer"
        />
      </div>
      
      <nav className="flex-grow py-2 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-4 text-[0.85rem] font-semibold transition-all gap-4 rounded-2xl ${
              activeTab === item.id 
                ? 'bg-sidebar-active text-white shadow-lg shadow-sidebar-active/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-[18px] h-[18px] ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-white/5 rounded-3xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rpac-red flex items-center justify-center text-[0.85rem] font-bold shadow-inner">SK</div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.85rem] font-bold truncate">S. Kulatunga</p>
            <p className="text-[0.65rem] text-white/40 uppercase tracking-tighter">Production Planner</p>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
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

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/kpis').then(r => r.json()).then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-8">
        <div className="bg-white p-6 rounded-[24px] shadow-card border border-border-subtle hover:scale-[1.02] transition-all">
          <p className="text-[0.7rem] text-text-secondary uppercase font-black tracking-[0.1em] mb-4">Production Volume</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-rpac-blue">{stats.totalActiveOrders}</h3>
            <span className="text-[0.75rem] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">↑ 12%</span>
          </div>
          <p className="text-[0.65rem] text-text-secondary mt-2">Active orders across departments</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] shadow-card border border-border-subtle hover:scale-[1.02] transition-all">
          <p className="text-[0.7rem] text-text-secondary uppercase font-black tracking-[0.1em] mb-4">On-Time Delivery</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-rpac-blue">{stats.onTimeDeliveryRate}%</h3>
            <span className="text-[0.75rem] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">↑ 0.4%</span>
          </div>
          <p className="text-[0.65rem] text-text-secondary mt-2">Current month performance</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] shadow-card border border-border-subtle hover:scale-[1.02] transition-all">
          <p className="text-[0.7rem] text-text-secondary uppercase font-black tracking-[0.1em] mb-4">Inventory Alerts</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-rpac-red">{stats.lowStockCount}</h3>
            <span className="text-[0.75rem] font-bold text-rpac-red bg-red-50 px-2 py-1 rounded-lg">Stock-Out Risk</span>
          </div>
          <p className="text-[0.65rem] text-text-secondary mt-2">Items requiring urgent purchase</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] shadow-card border border-border-subtle hover:scale-[1.02] transition-all">
          <p className="text-[0.7rem] text-text-secondary uppercase font-black tracking-[0.1em] mb-4">Overall Efficiency</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-rpac-blue">88.4%</h3>
            <span className="text-[0.75rem] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Avg Load</span>
          </div>
          <p className="text-[0.65rem] text-text-secondary mt-2">Machine utilization today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-10 mb-10">
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-border-subtle shadow-card overflow-hidden">
          <div className="px-8 py-6 border-b border-border-subtle flex items-center justify-between">
            <h3 className="font-black text-text-primary uppercase tracking-tight">Pre-Press Workflow Progress</h3>
            <button className="text-[0.75rem] font-bold text-rpac-blue hover:underline">Track Plates</button>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {DEPARTMENTS.map(dept => (
                <div key={dept} className="flex flex-col items-center">
                  <div className="w-full bg-bg-main h-24 rounded-2xl relative overflow-hidden mb-2 border border-border-subtle">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-rpac-blue transition-all duration-1000"
                      style={{ height: `${Math.floor(Math.random() * 80) + 10}%` }}
                    />
                  </div>
                  <span className="text-[0.65rem] font-black text-text-secondary uppercase text-center leading-none">{dept}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-6 text-[0.7rem] font-bold text-text-secondary">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rpac-blue" /> Layout Proof Reading</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rpac-red" /> Plate Making</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-bg-main border" /> Queue</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[32px] border border-border-subtle shadow-card p-10 flex flex-col items-center">
          <h3 className="text-[1rem] font-black text-text-primary uppercase mb-8 self-start tracking-tight">Orders by Status</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[18px] border-bg-main" />
              <div className="absolute inset-0 rounded-full border-[18px] border-rpac-blue border-t-transparent border-r-transparent rotate-45" />
              <div className="absolute inset-0 rounded-full border-[18px] border-rpac-red border-t-transparent border-r-transparent border-b-transparent -rotate-12" />
              <div className="flex flex-col items-center">
                <p className="text-3xl font-black leading-none text-rpac-blue">24</p>
                <p className="text-[0.6rem] text-text-secondary font-black uppercase tracking-widest mt-1">Total</p>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-12 w-full text-[0.75rem] font-bold">
             <div className="flex items-center gap-3 text-text-secondary"><div className="w-3 h-3 rounded bg-rpac-blue" /> Flexo</div>
             <div className="flex items-center gap-3 text-text-secondary"><div className="w-3 h-3 rounded bg-rpac-red" /> Thermal</div>
             <div className="flex items-center gap-3 text-text-secondary"><div className="w-3 h-3 rounded bg-amber-500" /> RFID</div>
             <div className="flex items-center gap-3 text-text-secondary"><div className="w-3 h-3 rounded bg-emerald-500" /> Levi's</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersTable = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setData);
  }, []);

  return (
    <div className="bg-white rounded-[32px] border border-border-subtle shadow-card px-10 py-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="relative w-full max-w-[400px]">
          <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Sales Orders or Customers..." 
            className="w-full bg-bg-main border-0 rounded-2xl py-4 pl-14 pr-8 focus:ring-2 focus:ring-rpac-blue outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="flex gap-4">
           <button className="flex items-center px-6 py-4 bg-bg-main text-text-primary rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-100">
             <RefreshCw className="w-4 h-4 mr-2" /> Sync SAP
           </button>
           <button className="flex items-center px-6 py-4 bg-rpac-red text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rpac-red/20 hover:bg-red-600 transition-all active:scale-95">
             <Plus className="w-4 h-4 mr-2" /> New Planner
           </button>
        </div>
      </div>
      
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[0.7rem] font-black text-text-secondary uppercase tracking-[0.1em] border-b border-border-subtle">
              <th className="pb-6 px-4">SAP Sales Order</th>
              <th className="pb-6 px-4">Customer / Product</th>
              <th className="pb-6 px-4">Department</th>
              <th className="pb-6 px-4">Pre-Press Status</th>
              <th className="pb-6 px-4">Prod. Status</th>
              <th className="pb-6 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {data.map(order => (
              <tr key={order.id} className="hover:bg-bg-main/50 transition-colors group">
                <td className="py-6 px-4 font-black text-sm text-text-primary">
                  {order.salesOrder}
                  <div className="text-[0.65rem] text-text-secondary font-medium uppercase tracking-tighter mt-1">{order.code}</div>
                </td>
                <td className="py-6 px-4">
                  <div className="font-bold text-text-primary text-sm">{order.customer}</div>
                  <div className="text-[0.75rem] text-text-secondary font-medium">{order.product}</div>
                </td>
                <td className="py-6 px-4">
                  <span className="px-3 py-1 bg-white border border-border-subtle rounded-xl text-[0.65rem] font-black text-text-primary uppercase tracking-tighter">
                    {order.department}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-xl text-[0.65rem] font-black uppercase tracking-tighter shadow-sm border ${
                      order.prePress === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      order.prePress === 'Layout' ? 'bg-rpac-red text-white border-rpac-red shadow-rpac-red/20' : 
                      'bg-bg-main text-text-secondary border-border-subtle'
                    }`}>
                      {order.prePress}
                    </span>
                    {order.prePress === 'Completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                </td>
                <td className="py-6 px-4">
                   <div className="flex flex-col gap-1 w-24">
                      <div className="flex justify-between text-[0.6rem] font-black uppercase text-text-secondary">
                        <span>{order.status}</span>
                        <span>{order.status === 'In Progress' ? '45%' : '0%'}</span>
                      </div>
                      <div className="w-full bg-bg-main h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${order.status === 'In Progress' ? 'bg-rpac-blue' : 'bg-gray-200'}`}
                          style={{ width: order.status === 'In Progress' ? '45%' : '0%' }}
                        />
                      </div>
                   </div>
                </td>
                <td className="py-6 px-4 text-right">
                  <button className="p-3 bg-bg-main rounded-[14px] text-text-secondary hover:bg-white hover:text-rpac-blue hover:shadow-sm border border-transparent hover:border-border-subtle transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MachineScheduler = () => (
  <div className="bg-white p-10 rounded-[40px] border border-border-subtle shadow-card animate-in slide-in-from-bottom-5 duration-700">
    <div className="flex items-center justify-between mb-12">
      <div className="flex flex-col">
        <h3 className="font-black text-text-primary uppercase tracking-tight">Machine Capacity Planner</h3>
        <p className="text-[0.7rem] text-text-secondary font-bold uppercase tracking-widest mt-1">Real-time scheduling per department</p>
      </div>
      <div className="flex bg-bg-main p-1.5 rounded-2xl border border-border-subtle shadow-inner">
        <button className="px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-widest rounded-xl bg-white shadow-sm text-rpac-blue">Shift Queue</button>
        <button className="px-6 py-2.5 text-[0.65rem] font-black uppercase tracking-widest rounded-xl text-text-secondary hover:text-text-primary">Timeline Viewer</button>
      </div>
    </div>
    
    <div className="space-y-10">
      {[
        { name: 'Flexo Press FL-01', load: 85, color: 'bg-rpac-blue' },
        { name: 'Thermal T1-TH', load: 40, color: 'bg-rpac-red' },
        { name: 'RFID Inserter RF-01', load: 65, color: 'bg-indigo-600' },
        { name: 'Levi\'s Custom LE-01', load: 20, color: 'bg-emerald-600' }
      ].map((item) => (
        <div key={item.name} className="group">
          <div className="flex justify-between mb-4">
            <span className="text-[0.75rem] font-black text-text-primary uppercase tracking-tighter flex items-center gap-2">
              <Printer className="w-4 h-4 text-text-secondary" /> {item.name}
            </span>
            <span className="text-[0.75rem] font-black text-rpac-blue">{item.load}% Allocated</span>
          </div>
          <div className="relative h-14 bg-bg-main rounded-3xl p-2 border border-border-subtle shadow-inner">
             <div 
              className={`h-full ${item.color} rounded-2xl shadow-lg relative overflow-hidden transition-all duration-1000 ease-out`}
              style={{ width: `${item.load}%` }}
             >
                <div className="absolute inset-0 bg-white/10 [mask-image:linear-gradient(45deg,transparent_25%,black_25%,black_50%,transparent_50%,transparent_75%,black_75%,black)] bg-[length:16px_16px] animate-[pulse_3s_linear_infinite]" />
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsLoggedIn(false)} />
      
      <main className="ml-[260px] min-h-screen flex flex-col">
        <Header title={titles[activeTab]} />
        
        <div className="p-10 flex-grow">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'circOut' }}
                >
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'orders' && <OrdersTable />}
                    {activeTab === 'scheduler' && <MachineScheduler />}
                    
                    {/* Placeholder for missing functional tabs */}
                    {(activeTab === 'inventory' || activeTab === 'reports') && (
                        <div className="bg-white rounded-[40px] border border-border-subtle shadow-card p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-bg-main rounded-full flex items-center justify-center mb-8">
                                <RefreshCw className="w-10 h-10 text-gray-300 animate-spin-slow" />
                            </div>
                            <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-4">
                              Connecting to SAP B1 Server...
                            </h2>
                            <p className="text-text-secondary max-w-sm font-medium">
                              Integrating with live Business One inventory and sales data for the {titles[activeTab]} module.
                            </p>
                            <button className="mt-10 px-8 py-4 bg-rpac-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rpac-blue/20 hover:scale-[1.05] transition-all">
                              Try Reconnecting
                            </button>
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
