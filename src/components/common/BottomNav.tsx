import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Users,
  FileText,
  Package,
  Layers,
  DollarSign,
  BarChart3,
  Settings,
  X,
  Sparkles,
  Truck
} from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    t,
    currentUser,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen
  } = useApp();

  // 5 Essential Operational Tabs
  const primaryTabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Flow',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: currentUser.role === 'staff' ? 'quick_entry' : 'production',
      label: 'Production',
      icon: <Activity className="w-5 h-5" />
    },
    {
      id: 'karigar',
      label: 'Karigar',
      icon: <Users className="w-5 h-5 text-[#B98B4E]" />
    },
    ...(currentUser.role === 'admin'
      ? [
          {
            id: 'orders' as AppTab,
            label: 'Orders',
            icon: <FileText className="w-5 h-5" />
          }
        ]
      : [
          {
            id: 'transfers' as AppTab,
            label: 'Transfers',
            icon: <Truck className="w-5 h-5 text-blue-500" />
          }
        ]),
    {
      id: 'stock',
      label: 'Stock',
      icon: <Package className="w-5 h-5" />
    }
  ];

  const adminDrawerItems: { id: AppTab; label: string; icon: React.ReactNode; desc: string; adminOnly?: boolean }[] = [
    {
      id: 'raw_materials',
      label: 'Step 1 · Raw GPPS Inward',
      icon: <Package className="w-4 h-4 text-amber-600" />,
      desc: 'Receive virgin granules in 25kg bags'
    },
    {
      id: 'quick_entry',
      label: 'Fast 30s Machine Log',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      desc: 'Quick keypad entry for machine operators'
    },
    {
      id: 'transfers',
      label: 'Inter-Unit Transfers',
      icon: <Truck className="w-4 h-4 text-blue-500" />,
      desc: 'Move plain beads Moulding → Pearl/Metalizing'
    },
    {
      id: 'catalogue',
      label: '24 Brochure Products',
      icon: <Layers className="w-4 h-4 text-purple-500" />,
      desc: 'Catalog, conversion ratios & rates'
    },
    {
      id: 'parties',
      label: 'Parties & CRM',
      icon: <Users className="w-4 h-4 text-emerald-500" />,
      desc: 'Customer credit limits & ageing ledger'
    },
    {
      id: 'expenses',
      label: 'Factory Expenses',
      icon: <DollarSign className="w-4 h-4 text-rose-500" />,
      desc: 'Unit-wise electricity, wages & rent',
      adminOnly: true
    },
    {
      id: 'reports',
      label: 'Operations & Profit Reports',
      icon: <BarChart3 className="w-4 h-4 text-indigo-500" />,
      desc: 'Gross margins, yield trends & audit log',
      adminOnly: true
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
      desc: 'Firm GSTIN, machines & thresholds',
      adminOnly: true
    }
  ];

  return (
    <>
      {/* Mobile Fixed Bottom Navigation Bar (5 Essential Touch Targets >= 48px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#17161F]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 pb-safe shadow-lg">
        <div className="grid grid-cols-5 items-center h-14 px-1">
          {primaryTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[48px] flex flex-col items-center justify-center transition-colors relative ${
                  isActive
                    ? 'text-[#2B2A4C] dark:text-[#C9A86A] font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#2B2A4C] dark:bg-[#C9A86A]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Slide-out Administrative Drawer Trigger */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-t-3xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border-t border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto pb-safe animate-in slide-in-from-bottom duration-200 text-xs">
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                  Management & Master Data
                </h3>
                <span className="text-[11px] text-slate-500">MK Plastics Operations</span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 py-3">
              {adminDrawerItems
                .filter(item => !item.adminOnly || currentUser.role === 'admin')
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#2B2A4C]/10 border-[#2B2A4C] dark:bg-[#C9A86A]/20 dark:border-[#C9A86A]'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
