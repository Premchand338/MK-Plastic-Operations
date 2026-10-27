import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Filter,
  PieChart,
  Calendar,
  Building,
  Zap,
  Wrench,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory, ManufacturingUnit, ExpenseRecord } from '../../types';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, currentUser } = useApp();

  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Electricity');
  const [expUnit, setExpUnit] = useState<ManufacturingUnit | 'Common'>('moulding');
  const [expAmount, setExpAmount] = useState('15000');
  const [expDesc, setExpDesc] = useState('');
  const [expPaidTo, setExpPaidTo] = useState('');
  const [expMode, setExpMode] = useState<ExpenseRecord['mode']>('Bank_Transfer');

  if (currentUser.role !== 'admin') {
    return (
      <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#201F2B] border border-slate-200 dark:border-slate-800">
        <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-200">
          Access Restricted
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Unit Managers and Staff do not have permission to view firm expenses, invoice amounts, rates, or profit margins. Please switch to Admin persona in the header.
        </p>
      </div>
    );
  }

  const filteredExpenses = expenses.filter(e => {
    if (filterUnit !== 'all' && e.unit !== filterUnit) return false;
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    return true;
  });

  const totalExpenseSum = filteredExpenses.reduce((s, e) => s + e.amount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      date: new Date().toISOString().slice(0, 10),
      category: expCategory,
      unit: expUnit,
      amount: parseFloat(expAmount) || 0,
      description: expDesc,
      paidTo: expPaidTo,
      mode: expMode
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Factory Expenses & Cost Centres
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unit-wise breakdown of power bills, machine maintenance, wages, and common overheads.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-semibold shadow-xs hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Filter and Summary Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterUnit}
            onChange={e => setFilterUnit(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium capitalize"
          >
            <option value="all">All Units & Common</option>
            <option value="moulding">Moulding</option>
            <option value="pearl">Pearl</option>
            <option value="metalizing">Metalizing</option>
            <option value="threading">Threading</option>
            <option value="Common">Common Gala Overhead</option>
          </select>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Labour">Labour & Wages</option>
            <option value="Machine_Repair">Machine Repair</option>
            <option value="Rent">Factory Rent</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Filtered Total:</span>
          <span className="font-mono font-bold text-base text-slate-900 dark:text-slate-100">
            ₹{totalExpenseSum.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Category & Tagged Unit</th>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold">Paid To</th>
                <th className="py-3 px-4 font-semibold">Mode</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredExpenses.map(exp => (
                <tr
                  key={exp.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300">
                    {exp.date}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {exp.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {exp.unit} Unit
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {exp.description}
                  </td>

                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {exp.paidTo}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                      {exp.mode.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Expense */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Log Factory Overhead / Expense
            </h3>
            <p className="text-slate-500 mb-4">
              Tag directly to a manufacturing unit for accurate gross profit accounting.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Expense Category
                  </label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Labour">Labour & Wages</option>
                    <option value="Machine_Repair">Machine Repair</option>
                    <option value="Rent">Factory Gala Rent</option>
                    <option value="Transport">Transport</option>
                    <option value="Packing">Packing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tagged Unit
                  </label>
                  <select
                    value={expUnit}
                    onChange={e => setExpUnit(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 capitalize font-medium"
                  >
                    <option value="moulding">Moulding</option>
                    <option value="pearl">Pearl</option>
                    <option value="metalizing">Metalizing</option>
                    <option value="threading">Threading</option>
                    <option value="Common">Common / Shared</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={e => setExpAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Paid To (Vendor / Contractor)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MSEDCL or Omkar Hydraulics"
                  value={expPaidTo}
                  onChange={e => setExpPaidTo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Machine M2 heating band replacement"
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
