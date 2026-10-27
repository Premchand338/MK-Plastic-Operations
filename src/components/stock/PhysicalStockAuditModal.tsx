import React, { useState } from 'react';
import { ClipboardCheck, X, Check, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManufacturingUnit } from '../../types';

interface PhysicalStockAuditModalProps {
  onClose: () => void;
}

export const PhysicalStockAuditModal: React.FC<PhysicalStockAuditModalProps> = ({ onClose }) => {
  const { products, calculateItemStock, applyPhysicalStockAudit, currentUser } = useApp();

  const [unit, setUnit] = useState<ManufacturingUnit>('moulding');
  const [skuId, setSkuId] = useState(products[0].id);
  const [countedQty, setCountedQty] = useState('250');
  const [reason, setReason] = useState('Monthly physical floor count reconciliation');

  const selectedSku = products.find(p => p.id === skuId);
  const calculatedStock = calculateItemStock(skuId, unit);
  const countedNum = parseFloat(countedQty) || 0;
  const discrepancy = countedNum - calculatedStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (discrepancy === 0) {
      alert('Physical count matches calculated ledger stock exactly. No adjustment required.');
      return;
    }
    applyPhysicalStockAudit(skuId, countedNum, unit, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                Physical Stock Count Audit
              </h3>
              <span className="text-[11px] text-slate-400">Strictly Admin Authorized</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Select Unit / Location
            </label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 capitalize font-medium"
            >
              <option value="moulding">Moulding</option>
              <option value="pearl">Pearl</option>
              <option value="metalizing">Metalizing</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Select Product SKU
            </label>
            <select
              value={skuId}
              onChange={e => setSkuId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Current Ledger Expected vs Physical Entered */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400">Ledger Calculated:</span>
              <div className="font-mono text-base font-bold text-slate-800 dark:text-slate-200">
                {calculatedStock} kg
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Physical Counted:</span>
              <input
                type="number"
                step="0.5"
                value={countedQty}
                onChange={e => setCountedQty(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Calculated Discrepancy Display */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              discrepancy === 0
                ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200'
                : discrepancy > 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Calculated Difference:</span>
            </div>
            <span className="font-mono font-bold text-sm">
              {discrepancy > 0 ? `+${discrepancy}` : discrepancy} kg
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Audit Reason / Explanation
            </label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 text-white font-semibold flex items-center gap-1.5 shadow-sm hover:bg-amber-700"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve & Post Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
