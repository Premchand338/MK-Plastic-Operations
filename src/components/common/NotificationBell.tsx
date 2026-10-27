import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    currentUser
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        title="Admin Notifications & Task Status"
        aria-label="Admin Notifications"
      >
        <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center leading-none border-2 border-white dark:border-[#17161F]">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-slate-900 dark:text-slate-100 text-sm">
                Live Factory Alerts
              </span>
              {unreadNotificationCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 text-[10px] font-bold">
                  {unreadNotificationCount} New
                </span>
              )}
            </div>

            <button
              onClick={() => {
                clearAllNotifications();
                setIsOpen(false);
              }}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
              title="Clear all alerts"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Notification List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                <p>No active alerts. Factory operations running smoothly!</p>
              </div>
            ) : (
              notifications.map(n => {
                const timeStr = new Date(n.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      n.read
                        ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 text-slate-500'
                        : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {timeStr}
                      </span>
                    </div>

                    <p className="text-[11px] mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                      {n.message}
                    </p>

                    {/* Meta info tags if operator session */}
                    {n.meta && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        {n.meta.machineId && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            {n.meta.machineId}
                          </span>
                        )}
                        {n.meta.mouldedKg !== undefined && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold">
                            +{n.meta.mouldedKg} kg Beads
                          </span>
                        )}
                        {n.meta.wasteKg !== undefined && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                            {n.meta.wasteKg} kg Waste
                          </span>
                        )}
                        {n.meta.salaryEarned !== undefined && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 font-bold">
                            ₹{n.meta.salaryEarned} Salary
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick shortcut to Operator Workstation */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('quick_entry');
                setIsOpen(false);
              }}
              className="text-[11px] font-bold text-[#C9A86A] hover:underline flex items-center gap-1"
            >
              <span>View Operator Moulding Station</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-slate-400">Bhiwandi Unit 1</span>
          </div>
        </div>
      )}
    </div>
  );
};
