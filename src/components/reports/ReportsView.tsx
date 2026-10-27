import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  CheckCircle,
  TrendingUp,
  Shield,
  Layers,
  Calendar,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const {
    stockMovements,
    mouldingEntries,
    coatingBatches,
    parties,
    invoices,
    expenses,
    auditLogs,
    stageTotals,
    currentUser
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<
    'profit' | 'yield' | 'sales' | 'audit'
  >('profit');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (currentUser.role !== 'admin') {
    return (
      <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#201F2B] border border-slate-200 dark:border-slate-800">
        <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-200">
          Admin Reports Area
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Financial summaries, profit calculations, and audit trails are visible only to Admin personas.
        </p>
      </div>
    );
  }

  const handleExport = (reportName: string, format: 'Excel' | 'PDF') => {
    setExportNotice(`Exported ${reportName} as ${format} spreadsheet/document.`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  };

  // Calculations for Unit-wise Profit
  const totalSales = invoices.reduce((s, i) => s + i.taxableSubtotal, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const grossProfit = Math.max(0, totalSales - totalExpenses);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Operations & Financial Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unit-wise gross profit, 30-day yield trends, sales by party/product, and complete audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport(activeReportTab.toUpperCase(), 'Excel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport(activeReportTab.toUpperCase(), 'PDF')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <Download className="w-4 h-4 text-rose-500" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Report Category Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        <button
          onClick={() => setActiveReportTab('profit')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeReportTab === 'profit'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Unit-Wise Gross Profit
        </button>

        <button
          onClick={() => setActiveReportTab('yield')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeReportTab === 'yield'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Yield & Waste Analysis
        </button>

        <button
          onClick={() => setActiveReportTab('sales')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeReportTab === 'sales'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Sales by Party & Product
        </button>

        <button
          onClick={() => setActiveReportTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeReportTab === 'audit'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Unit Gross Profit Report */}
      {activeReportTab === 'profit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-xs text-slate-400">Total Billed Sales (Taxable)</span>
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                ₹{totalSales.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">Across Surat, Jaipur, Mumbai</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-xs text-slate-400">Total Unit Expenses</span>
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Power, wages, rent, maintenance</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 shadow-xs">
              <span className="text-xs text-emerald-800 dark:text-emerald-300">Estimated Gross Profit</span>
              <div className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                ₹{grossProfit.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                {totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(1) : 0}% Gross Operating Margin
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Monthly Unit-Wise Margin Accounting
            </h3>
            <p className="text-slate-500 mb-4 leading-relaxed">
              Material cost is derived from virgin GPPS purchase batches and coating chemicals; overheads are directly tagged to individual factory galas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">Manufacturing Unit</th>
                    <th className="p-2.5">Key Machines</th>
                    <th className="p-2.5 text-right">Output (KG)</th>
                    <th className="p-2.5 text-right">Allocated Overheads</th>
                    <th className="p-2.5 text-right">Avg Unit Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr>
                    <td className="p-2.5 font-semibold font-sans">Moulding Unit</td>
                    <td className="p-2.5 font-sans">M1, M2, M3, M4</td>
                    <td className="p-2.5 text-right">1,798 kg</td>
                    <td className="p-2.5 text-right">₹98,900</td>
                    <td className="p-2.5 text-right">₹55.0 / kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold font-sans">Pearl Coating</td>
                    <td className="p-2.5 font-sans">P1, P2 Barrels</td>
                    <td className="p-2.5 text-right">845 kg</td>
                    <td className="p-2.5 text-right">₹21,500</td>
                    <td className="p-2.5 text-right">₹25.4 / kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold font-sans">Metalizing</td>
                    <td className="p-2.5 font-sans">MZ1 Vacuum Chamber</td>
                    <td className="p-2.5 text-right">185 kg</td>
                    <td className="p-2.5 text-right">₹12,400</td>
                    <td className="p-2.5 text-right">₹67.0 / kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold font-sans">Common Factory Rent</td>
                    <td className="p-2.5 font-sans">Bhiwandi Shed 4-7</td>
                    <td className="p-2.5 text-right">—</td>
                    <td className="p-2.5 text-right">₹45,000</td>
                    <td className="p-2.5 text-right">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Yield Analysis */}
      {activeReportTab === 'yield' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Moulding Yield & Regrind Efficiency Trend
            </h3>
            <p className="text-slate-500 mb-4">
              Track ratio of good beads vs waste ground/reused across horizontal injection machines M1–M4.
            </p>

            <div className="space-y-3">
              {mouldingEntries.map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Machine {m.machineId} · {m.skuName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Input GPPS: {m.gppsUsedKg} kg · Regrind Reused: {m.regrindReusedKg} kg · Good: {m.goodBeadsKg} kg · Waste: {m.wasteKg} kg
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span
                      className={`text-base font-bold ${
                        m.yieldPct >= 90 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {m.yieldPct.toFixed(1)}% Yield
                    </span>
                    <div className="text-[10px] text-slate-400">{m.date} ({m.shift})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sales by Party & Product */}
      {activeReportTab === 'sales' && (
        <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80 text-xs">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Sales by Customer Party
            </span>
            <span className="text-slate-400">Total Billed Invoices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Customer Party</th>
                  <th className="p-3 font-semibold">Location / State</th>
                  <th className="p-3 font-semibold text-right">Invoices</th>
                  <th className="p-3 font-semibold text-right">Billed Amount</th>
                  <th className="p-3 font-semibold text-right">Paid</th>
                  <th className="p-3 font-semibold text-right">Pending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {parties.filter(p => p.type === 'Customer').map(c => {
                  const custInvoices = invoices.filter(i => i.partyId === c.id);
                  const billedTotal = custInvoices.reduce((s, i) => s + i.grandTotal, 0);
                  const paidTotal = custInvoices.reduce((s, i) => s + i.paidAmount, 0);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                        {c.name}
                      </td>
                      <td className="p-3 text-slate-500">{c.address.split(',')[1] || c.state}</td>
                      <td className="p-3 text-right font-mono">{custInvoices.length}</td>
                      <td className="p-3 text-right font-mono font-bold">₹{billedTotal.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono text-emerald-600">₹{paidTotal.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        ₹{c.outstandingBalance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeReportTab === 'audit' && (
        <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80 text-xs">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Immutable System Audit Log
            </span>
            <span className="text-slate-400">Who, when, record, old value → new value</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Timestamp</th>
                  <th className="p-3 font-semibold">User & Role</th>
                  <th className="p-3 font-semibold">Action</th>
                  <th className="p-3 font-semibold">Entity & ID</th>
                  <th className="p-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {log.userName}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {log.userRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : log.action === 'UPDATE'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : log.action === 'REVERSE'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {log.entityType} ({log.entityId.slice(0, 14)})
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 max-w-sm">
                      {log.description}
                      {log.oldValue && log.newValue && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {log.oldValue} → {log.newValue}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
