import React, { useState } from 'react';
import { ArrowRight, ArrowRightLeft, X, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManufacturingUnit } from '../../types';
import { PLAIN_BEAD_SKUS } from '../../data/seedData';

interface UnitTransferModalProps {
  onClose: () => void;
  initialFromUnit?: ManufacturingUnit;
  initialToUnit?: ManufacturingUnit;
  initialSkuId?: string;
  initialQty?: string;
}

export const UnitTransferModal: React.FC<UnitTransferModalProps> = ({
  onClose,
  initialFromUnit,
  initialToUnit,
  initialSkuId,
  initialQty
}) => {
  const { createUnitTransfer, calculateItemStock } = useApp();

  const [fromUnit, setFromUnit] = useState<ManufacturingUnit>(initialFromUnit || 'moulding');
  const [toUnit, setToUnit] = useState<ManufacturingUnit>(initialToUnit || 'pearl');
  const [selectedSkuId, setSelectedSkuId] = useState(initialSkuId || PLAIN_BEAD_SKUS[0].id);
  const [qtyKg, setQtyKg] = useState(initialQty || '250');
  const [notes, setNotes] = useState('Shift lot transfer for pearl coating');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const selectedSku = PLAIN_BEAD_SKUS.find(p => p.id === selectedSkuId);
  const availableStock = calculateItemStock(selectedSkuId, fromUnit);
  const qtyNumber = parseFloat(qtyKg) || 0;
  const isShortage = qtyNumber > availableStock;

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromUnit === toUnit) {
      alert('From unit and To unit must be different.');
      return;
    }
    if (qtyNumber <= 0) return;
    setShowConfirmation(true);
  };

  const handleConfirmTransfer = () => {
    createUnitTransfer(fromUnit, toUnit, selectedSkuId, qtyNumber, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#2B2A4C]/10 dark:bg-[#C9A86A]/20 text-[#2B2A4C] dark:text-[#C9A86A]">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                Inter-Unit Stock Transfer
              </h3>
              <span className="text-[11px] text-slate-400">One firm, one GST · No challan</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showConfirmation ? (
          <form onSubmit={handlePreSubmit} className="space-y-4 pt-3">
            {/* From Unit -> To Unit Selection */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  From Unit
                </label>
                <select
                  value={fromUnit}
                  onChange={e => setFromUnit(e.target.value as any)}
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
                  To Unit
                </label>
                <select
                  value={toUnit}
                  onChange={e => setToUnit(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 capitalize font-medium"
                >
                  <option value="pearl">Pearl</option>
                  <option value="metalizing">Metalizing</option>
                  <option value="moulding">Moulding</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
            </div>

            {/* SKU Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Item / Plain Bead SKU
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Available in {fromUnit}: <strong>{availableStock} kg</strong>
                </span>
              </div>
              <select
                value={selectedSkuId}
                onChange={e => setSelectedSkuId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
              >
                {PLAIN_BEAD_SKUS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Transfer Quantity (KG)
              </label>
              <input
                type="number"
                step="0.5"
                value={qtyKg}
                onChange={e => setQtyKg(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-base font-bold"
                required
              />
              {isShortage && (
                <span className="text-[11px] text-rose-500 font-semibold block mt-1">
                  Warning: Quantity exceeds current calculated {fromUnit} balance ({availableStock} kg).
                </span>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Transfer Remarks
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
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
                className="px-5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold"
              >
                Review Transfer
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Screen as required by usability rules */
          <div className="space-y-4 pt-3">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Transfer Summary Confirmation
              </span>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Move <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{qtyNumber} kg</span> of{' '}
                <span className="underline decoration-amber-400">{selectedSku?.name}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize pt-1">
                <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {fromUnit} Unit
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {toUnit} Unit
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 text-[11px] leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Creates an immutable Transfer_Out and Transfer_In ledger pair with a shared reference ID. No GST invoice or internal challan required.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Back / Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold flex items-center gap-1.5 shadow-sm hover:bg-emerald-700"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Execute Transfer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
