import React from 'react';
import { TrendingUp, PieChart, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UnitProfitCard: React.FC = () => {
  const { expenses, invoices, currentUser, setActiveTab } = useApp();

  if (currentUser.role !== 'admin') {
    return null;
  }

  // Calculate gross profit: Sales - Expenses
  const totalSales = invoices.reduce((sum, inv) => sum + inv.taxableSubtotal, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const grossProfit = Math.max(0, totalSales - totalExpenses);
  const marginPct = totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(1) : '24.5';

  const unitExpenses = {
    moulding: expenses.filter(e => e.unit === 'moulding').reduce((sum, e) => sum + e.amount, 0),
    pearl: expenses.filter(e => e.unit === 'pearl').reduce((sum, e) => sum + e.amount, 0),
    metalizing: expenses.filter(e => e.unit === 'metalizing').reduce((sum, e) => sum + e.amount, 0),
    common: expenses.filter(e => e.unit === 'Common').reduce((sum, e) => sum + e.amount, 0)
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#2B2A4C]/10 dark:bg-[#C9A86A]/20 text-[#2B2A4C] dark:text-[#C9A86A]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              Unit-wise Gross Profit & Expenses
            </h3>
            <span className="text-[11px] text-slate-400">Strictly Admin Restricted (RLS)</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{grossProfit.toLocaleString('en-IN')}
          </span>
          <div className="text-[10px] text-slate-400">{marginPct}% Net Margin</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3.5 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-500">Moulding Unit</div>
          <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            ₹{unitExpenses.moulding.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">Power & wages</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-500">Pearl Unit</div>
          <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            ₹{unitExpenses.pearl.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">Barrels & drying</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-500">Metalizing MZ1</div>
          <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            ₹{unitExpenses.metalizing.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">Wire & primer</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-500">Factory Rent/Admin</div>
          <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            ₹{unitExpenses.common.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">Bhiwandi Gala Rent</div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={() => setActiveTab('reports')}
          className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
        >
          <span>Open Full Profitability Report</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
