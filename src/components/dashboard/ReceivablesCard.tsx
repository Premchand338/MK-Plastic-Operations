import React from 'react';
import { IndianRupee, AlertCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReceivablesCard: React.FC = () => {
  const { totalReceivables, topOverdueParties, setActiveTab, currentUser, t } = useApp();

  // Hide financial metrics from non-admins as mandated by Row Level Security in Section 2!
  if (currentUser.role !== 'admin') {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              {t('receivables')} (Admin Only)
            </h3>
            <span className="text-[11px] text-slate-400">Firm Outstanding & Party Ageing</span>
          </div>
        </div>
        <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
          ₹{totalReceivables.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Top 5 Outstanding Parties
        </div>
        {topOverdueParties.map(party => {
          const isOverLimit = party.creditLimit > 0 && party.outstandingBalance > party.creditLimit;
          return (
            <div
              key={party.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="truncate pr-2">
                <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {party.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>{party.state}</span>
                  <span>·</span>
                  <span>Limit: ₹{(party.creditLimit / 1000).toFixed(0)}k</span>
                  {isOverLimit && (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> Over Limit
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  ₹{party.outstandingBalance.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  31–60 days
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={() => setActiveTab('parties')}
          className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
        >
          <span>View Customer Ledger & Ageing</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
