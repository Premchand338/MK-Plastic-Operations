import React from 'react';
import { Users, Clock, AlertCircle, ChevronRight, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KarigarAlertCard: React.FC = () => {
  const { karigarWorks, overdueDaysThreshold, setActiveTab, t } = useApp();

  return (
    <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#B98B4E]/10 text-[#B98B4E]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              {t('karigarPending')}
            </h3>
            <span className="text-[11px] text-slate-400">Overdue SLA: {overdueDaysThreshold} days</span>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('karigar')}
          className="flex items-center gap-1 text-xs font-semibold text-[#C9A86A] hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Slip</span>
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        {karigarWorks.slice(0, 3).map(kw => {
          const isOverdue = kw.status === 'Overdue' || kw.daysOut > overdueDaysThreshold;
          return (
            <div
              key={kw.id}
              className={`p-3 rounded-xl border text-xs transition-colors ${
                isOverdue
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                  {kw.karigarName}
                </span>
                {isOverdue ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-full shrink-0">
                    <AlertCircle className="w-3 h-3" />
                    {kw.daysOut}d Out (OVERDUE)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    {kw.daysOut}d Out
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 truncate">
                {kw.coatedSkuName}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                <span className="text-slate-500">
                  Sent: <strong className="font-mono text-slate-800 dark:text-slate-200">{kw.qtySentKg} kg</strong>
                </span>
                <span className="text-slate-500">
                  Received: <strong className="font-mono text-slate-800 dark:text-slate-200">{kw.bunchesReceived} bn</strong>
                </span>
                <span className="text-slate-500">
                  Loose: <strong className="font-mono text-slate-800 dark:text-slate-200">{kw.looseReturnedKg} kg</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={() => setActiveTab('karigar')}
          className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
        >
          <span>Manage Threading Job Work</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
