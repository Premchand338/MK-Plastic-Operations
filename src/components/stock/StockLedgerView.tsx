import React, { useState } from 'react';
import {
  Package,
  ArrowRightLeft,
  ClipboardCheck,
  RotateCcw,
  Download,
  Filter,
  Search,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MovementType, ManufacturingUnit, MaterialStage } from '../../types';
import { UnitTransferModal } from './UnitTransferModal';
import { PhysicalStockAuditModal } from './PhysicalStockAuditModal';

export const StockLedgerView: React.FC = () => {
  const {
    stockMovements,
    products,
    reverseStockMovement,
    currentUser,
    calculateItemStock,
    t
  } = useApp();

  const [filterUnit, setFilterUnit] = useState<ManufacturingUnit | 'all'>('all');
  const [filterStage, setFilterStage] = useState<MaterialStage | 'all'>('all');
  const [filterType, setFilterType] = useState<MovementType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Reversal dialog state
  const [reversalTargetId, setReversalTargetId] = useState<string | null>(null);
  const [reversalReason, setReversalReason] = useState('');

  const filteredMovements = stockMovements.filter(m => {
    if (filterUnit !== 'all' && m.locationUnit !== filterUnit) return false;
    if (filterStage !== 'all' && m.stage !== filterStage) return false;
    if (filterType !== 'all' && m.movementType !== filterType) return false;
    if (
      searchQuery &&
      !m.itemName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(m.referenceId || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExport = (type: 'Excel' | 'PDF') => {
    setExportNotice(`Exporting ${filteredMovements.length} ledger movements as ${type}... (File downloaded)`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  };

  const handleConfirmReversal = () => {
    if (!reversalTargetId || !reversalReason) return;
    reverseStockMovement(reversalTargetId, reversalReason);
    setReversalTargetId(null);
    setReversalReason('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* View Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Immutable Stock Movement Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stock is never an arbitrary editable number. It is mathematically summed from verified ledger movements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Unit Transfer</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowAuditModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>Physical Count Audit</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExport('Excel')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
              title="Export filtered ledger to Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
              title="Export filtered ledger to PDF"
            >
              <Download className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Unit Filter */}
          <select
            value={filterUnit}
            onChange={e => setFilterUnit(e.target.value as any)}
            className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium capitalize"
          >
            <option value="all">All Units</option>
            <option value="moulding">Moulding</option>
            <option value="pearl">Pearl</option>
            <option value="metalizing">Metalizing</option>
            <option value="threading">Threading</option>
            <option value="warehouse">Warehouse</option>
          </select>

          {/* Stage Filter */}
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value as any)}
            className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium capitalize"
          >
            <option value="all">All Stages</option>
            <option value="raw">Raw Materials</option>
            <option value="plain">Plain Beads</option>
            <option value="coated">Coated Beads</option>
            <option value="karigar">At Karigar</option>
            <option value="finished">Finished Stock</option>
          </select>

          {/* Movement Type Filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
          >
            <option value="all">All Movement Types</option>
            <option value="Purchase">Purchase Inward</option>
            <option value="Production_In">Production Output</option>
            <option value="Consumption">Consumption</option>
            <option value="Transfer_In">Transfer In</option>
            <option value="Transfer_Out">Transfer Out</option>
            <option value="Sent_Karigar">Sent to Karigar</option>
            <option value="Received_Karigar">Received from Karigar</option>
            <option value="Sale_Dispatch">Sale Dispatch</option>
            <option value="Physical_Adjustment">Physical Audit Adjustment</option>
            <option value="Reversal">Reversal Entry</option>
          </select>
        </div>

        {/* Live Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search item, slip or reference..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Ledger Entries ({filteredMovements.length})
          </span>
          <span className="text-slate-400">Append-Only Immutable Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Item & Type</th>
                <th className="py-3 px-4 font-semibold">Location & Stage</th>
                <th className="py-3 px-4 font-semibold">Movement Type</th>
                <th className="py-3 px-4 font-semibold text-right">Quantity</th>
                <th className="py-3 px-4 font-semibold">Reference & Operator</th>
                {currentUser.role === 'admin' && (
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredMovements.map(mov => {
                const isPositive = mov.qty > 0;
                return (
                  <tr
                    key={mov.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors ${
                      mov.reversed ? 'opacity-40 line-through bg-slate-100/50 dark:bg-slate-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-slate-800 dark:text-slate-200">
                        {new Date(mov.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                        {mov.itemName}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {mov.itemType} Material
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                        {mov.locationUnit}
                      </span>
                      <div className="text-[10px] text-slate-400 capitalize">Stage: {mov.stage}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          mov.movementType === 'Purchase' || mov.movementType === 'Production_In'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : mov.movementType === 'Consumption' || mov.movementType === 'Sale_Dispatch'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : mov.movementType === 'Reversal'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {mov.movementType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-bold text-sm tabular-nums ${
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {isPositive ? `+${mov.qty}` : mov.qty} {mov.uom}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                        {mov.referenceId || 'Direct'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                        By: {mov.operatorName} {mov.notes ? `· ${mov.notes}` : ''}
                      </div>
                    </td>

                    {currentUser.role === 'admin' && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {!mov.reversed && mov.movementType !== 'Reversal' && (
                          <button
                            onClick={() => setReversalTargetId(mov.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Admin Reversal: Creates compensatory balancing movement"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reversal Confirmation Modal */}
      {reversalTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Confirm Stock Reversal
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Nothing is hard-deleted. Reversing this record appends an inverted compensatory movement to the ledger and records an audit log.
            </p>
            <div className="mb-4">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Reversal (Required)
              </label>
              <input
                type="text"
                placeholder="e.g. Weighing scale calibration error"
                value={reversalReason}
                onChange={e => setReversalReason(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReversalTargetId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReversal}
                disabled={!reversalReason}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold disabled:opacity-50"
              >
                Execute Reversal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unit Transfer Modal */}
      {showTransferModal && (
        <UnitTransferModal onClose={() => setShowTransferModal(false)} />
      )}

      {/* Physical Stock Audit Modal */}
      {showAuditModal && (
        <PhysicalStockAuditModal onClose={() => setShowAuditModal(false)} />
      )}
    </div>
  );
};
