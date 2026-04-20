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
  Play,
  CheckCircle2,
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders', icon: Settings, label: 'Production Orders' },
    { id: 'scheduler', icon: Calendar, label: 'Machine Scheduler' },
    { id: 'inventory', icon: Package, label: 'Inventory & BOM' },
    { id: 'reports', icon: BarChart3, label: 'Reports & OEE' },
  ];

  return (
    <div className="w-[250px] bg-sidebar text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto shrink-0 transition-all">
      <div className="p-[1.5rem] border-b border-white/10">
        <h1 className="text-[1.25rem] font-[800] tracking-tight-minimal flex items-center gap-3">
          <div className="w-6 h-6 bg-sidebar-active rounded" />
          RPAC Lanka
        </h1>
      </div>
      
      <nav className="flex-grow py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-[1.5rem] py-3 text-[0.9rem] font-medium transition-all gap-3 ${
              activeTab === item.id 
                ? 'bg-sidebar-active text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-[18px] h-[18px] ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-[1.25rem] bg-black/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#475569] flex items-center justify-center text-[0.75rem] font-bold">SK</div>
        <div>
          <p className="text-[0.85rem] font-semibold">S. Kulatunga</p>
          <p className="text-[0.7rem] text-white/50">Production Planner</p>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title }: { title: string }) => (
  <header className="bg-white border-b border-border-navbar h-[64px] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
    <h1 className="text-[1.25rem] font-bold text-text-primary leading-none">{title}</h1>
    <div className="flex items-center gap-6">
      <div className="relative cursor-pointer">
        <Bell className="w-6 h-6 text-text-secondary" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white"></span>
      </div>
      <p className="text-[0.85rem] text-text-secondary">Friday, 24 May 2024</p>
    </div>
  </header>
);

const KPICard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
  <div className="bg-white p-5 rounded-[12px] shadow-card border border-border-subtle">
    <p className="text-[0.75rem] text-text-secondary uppercase font-semibold tracking-wider mb-2">{title}</p>
    <div className="text-[1.5rem] font-bold text-text-primary flex items-baseline gap-2">
      {value}
      {trend && <span className="text-[0.75rem] font-semibold text-[#10b981]">{trend}</span>}
    </div>
  </div>
);

const Dashboard = () => (
  <div className="animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-6">
      <KPICard title="Active Orders" value="24" trend="↑ 4" />
      <KPICard title="Delivery Rate" value="92.5%" trend="↑ 1.2%" />
      <KPICard title="Low Stock Items" value="07" />
      <KPICard title="OEE Today" value="84.2%" trend="↓ 2%" colorClass="text-[#ef4444]" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8 mb-6">
      <div className="lg:col-span-2 bg-white rounded-[12px] border border-border-subtle shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between font-semibold">
          <span>Recent Production Alerts</span>
          <button className="text-[0.75rem] text-sidebar-active hover:underline">View All</button>
        </div>
        <div className="divide-y divide-border-subtle/50">
          <div className="grid grid-cols-[100px_1fr_120px] items-center px-6 py-3 text-[0.85rem]">
            <span className="bg-[#fee2e2] text-[#ef4444] px-2 py-0.5 rounded text-[0.7rem] font-bold uppercase w-fit">Urgent</span>
            <span className="text-text-primary">Raw material shortage: Grade A Rubber - Stock below 50kg</span>
            <span className="text-text-secondary text-[0.75rem] text-right">10 mins ago</span>
          </div>
          <div className="grid grid-cols-[100px_1fr_120px] items-center px-6 py-3 text-[0.85rem]">
            <span className="bg-[#fef3c7] text-[#d97706] px-2 py-0.5 rounded text-[0.7rem] font-bold uppercase w-fit">Warning</span>
            <span className="text-text-primary">Maintenance due: Mixing Mill #4 (Next shift)</span>
            <span className="text-text-secondary text-[0.75rem] text-right">2 hours ago</span>
          </div>
          <div className="grid grid-cols-[100px_1fr_120px] items-center px-6 py-3 text-[0.85rem]">
            <span className="bg-[#fee2e2] text-[#ef4444] px-2 py-0.5 rounded text-[0.7rem] font-bold uppercase w-fit">Urgent</span>
            <span className="text-text-primary">Schedule Conflict: Machine #2 double-booked for Order #8821</span>
            <span className="text-text-secondary text-[0.75rem] text-right">4 hours ago</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-[12px] border border-border-subtle shadow-card p-6 flex flex-col">
        <h3 className="text-[1rem] font-semibold mb-6">Orders by Status</h3>
        <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[15px] border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-[15px] border-sidebar-active border-t-transparent border-r-transparent rotate-45"></div>
                <div className="z-10 text-center">
                    <p className="text-xl font-bold leading-none">60%</p>
                    <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest mt-1">Status</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-8 w-full text-[0.75rem]">
               <div className="flex items-center gap-2 text-text-secondary"><div className="w-2 h-2 rounded-sm bg-sidebar-active"></div> Planned</div>
               <div className="flex items-center gap-2 text-text-secondary"><div className="w-2 h-2 rounded-sm bg-[#10b981]"></div> In Progress</div>
               <div className="flex items-center gap-2 text-text-secondary"><div className="w-2 h-2 rounded-sm bg-[#f59e0b]"></div> On Hold</div>
               <div className="flex items-center gap-2 text-text-secondary"><div className="w-2 h-2 rounded-sm bg-[#ef4444]"></div> Delayed</div>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const OrdersTable = () => (
  <div className="bg-white rounded-2xl border shadow-sm animate-in zoom-in-95 duration-500">
    <div className="p-6 border-b flex items-center justify-between">
      <div className="relative w-1/3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search work orders..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
        />
      </div>
      <button className="flex items-center px-4 py-2 bg-[#2563eb] text-white rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors">
        <Plus className="w-4 h-4 mr-2" />
        New Order
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <tr>
            <th className="px-6 py-4">Order Code</th>
            <th className="px-6 py-4">Product Name</th>
            <th className="px-6 py-4">Quantity</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { id: '2026-001', name: 'Industrial Mats A1', qty: '500 PCS', status: 'In Progress', statusColor: 'text-blue-600 bg-blue-50 border-blue-100' },
            { id: '2026-002', name: 'Conveyor Belt V-Shape', qty: '50 Rolls', status: 'Planned', statusColor: 'text-gray-600 bg-gray-50 border-gray-100' },
            { id: '2026-003', name: 'Gasket Seal 40mm', qty: '2000 PCS', status: 'Completed', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          ].map(order => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-5 font-bold text-sm text-gray-800">#{order.id}</td>
              <td className="px-6 py-5 text-sm">
                <div className="font-semibold">{order.name}</div>
                <div className="text-[10px] text-gray-400">Created: 2026-04-10</div>
              </td>
              <td className="px-6 py-5 text-sm font-medium">{order.qty}</td>
              <td className="px-6 py-5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.statusColor}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex justify-center items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Scheduler = () => (
    <div className="bg-white p-8 rounded-2xl border shadow-sm animate-in slide-in-from-bottom-5 duration-700">
        <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800">Machine Loading Timeline</h3>
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-white shadow-sm">Week</button>
                <button className="px-4 py-1.5 text-xs font-bold text-gray-500 rounded-lg">Month</button>
            </div>
        </div>
        
        <div className="space-y-6">
            {['Vulcanizer A', 'Cutting M1', 'Mixing Mill 2', 'Extruder Max'].map((machine, i) => (
                <div key={machine} className="flex items-center space-x-4">
                    <div className="w-32 text-xs font-bold text-gray-500 uppercase tracking-wider">{machine}</div>
                    <div className="flex-1 h-12 bg-gray-50 rounded-xl relative border border-dashed border-gray-200">
                        {i === 0 && (
                            <div className="absolute left-[10%] w-[40%] top-2 bottom-2 bg-blue-600 rounded-lg shadow-md flex items-center px-3 overflow-hidden">
                                <span className="text-[10px] font-bold text-white whitespace-nowrap">PO-2026-001 (Shoes)</span>
                            </div>
                        )}
                        {i === 1 && (
                             <div className="absolute left-[30%] w-[30%] top-2 bottom-2 bg-emerald-600 rounded-lg shadow-md flex items-center px-3 overflow-hidden">
                             <span className="text-[10px] font-bold text-white whitespace-nowrap">PO-2026-004 (Lining)</span>
                         </div>
                        )}
                        {i === 3 && (
                             <div className="absolute left-[5%] w-[60%] top-2 bottom-2 bg-indigo-600 rounded-lg shadow-md flex items-center px-3 overflow-hidden">
                             <span className="text-[10px] font-bold text-white whitespace-nowrap">PO-2026-002 (Belt)</span>
                         </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-8 flex justify-between px-32 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Mon 19</span>
            <span>Tue 20</span>
            <span>Wed 21</span>
            <span>Thu 22</span>
            <span>Fri 23</span>
        </div>
    </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const titles: any = {
    dashboard: 'Operations Overview',
    orders: 'Work Order Management',
    scheduler: 'Resource Planning',
    inventory: 'Raw Material Stock',
    reports: 'Business Intelligence',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 min-h-screen">
        <Header title={titles[activeTab]} />
        
        <div className="p-8 max-w-7xl mx-auto mt-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'orders' && <OrdersTable />}
                    {activeTab === 'scheduler' && <Scheduler />}
                    {activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'scheduler' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                             <LayoutDashboard className="w-12 h-12 text-gray-200 mb-4" />
                             <p className="text-gray-400 font-medium tracking-tight">Viewing Source Code for {titles[activeTab]}...</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
