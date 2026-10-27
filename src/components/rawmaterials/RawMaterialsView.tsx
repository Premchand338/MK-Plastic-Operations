import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  Edit2,
  Check,
  Search,
  ShoppingCart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RawMaterial, ManufacturingUnit } from '../../types';

export const RawMaterialsView: React.FC = () => {
  const {
    rawMaterials,
    parties,
    addRawMaterialInward,
    updateRawMaterial,
    currentUser
  } = useApp();

  const suppliers = parties.filter(p => p.type === 'Supplier');
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);

  // Inward Form states
  const [inwardMaterialId, setInwardMaterialId] = useState(rawMaterials[0]?.id || '');
  const [inwardSupplier, setInwardSupplier] = useState(suppliers[0]?.name || 'Supreme Petrochem Ltd');
  const [inwardQty, setInwardQty] = useState('1000');
  const [inwardRate, setInwardRate] = useState('118');
  const [inwardBillNo, setInwardBillNo] = useState('SPL-2026-904');

  // Edit Material Form states
  const [editName, setEditName] = useState('');
  const [editReorder, setEditReorder] = useState('');
  const [editCost, setEditCost] = useState('');

  const handleInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRawMaterialInward(
      inwardMaterialId,
      parseFloat(inwardQty) || 0,
      parseFloat(inwardRate) || 0,
      inwardSupplier,
      inwardBillNo
    );
    setShowInwardModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    updateRawMaterial({
      ...editingMaterial,
      name: editName,
      reorderLevel: parseFloat(editReorder) || editingMaterial.reorderLevel,
      costPerUnit: parseFloat(editCost) || editingMaterial.costPerUnit,
      isSampleEditable: false
    });
    setEditingMaterial(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Raw Materials & Chemical Inward
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Admin-Editable Master List
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage GPPS polymer granules, pearl pigments, lacquer, wire, packing bags, and bunching thread across units.
          </p>
        </div>

        <button
          onClick={() => setShowInwardModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-semibold shadow-xs hover:opacity-90"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Record Purchase Inward</span>
        </button>
      </div>

      {/* Raw Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {rawMaterials.map(rm => {
          const isLow = rm.currentStock <= rm.reorderLevel;
          return (
            <div
              key={rm.id}
              className={`rounded-2xl p-4 border shadow-xs flex flex-col justify-between text-xs transition-all ${
                isLow
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                  : 'bg-white dark:bg-[#201F2B] border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {rm.category} · {rm.applicableUnit}
                  </span>

                  {rm.isSampleEditable && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic">
                      sample, edit me
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                    {rm.name}
                  </h3>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setEditingMaterial(rm);
                        setEditName(rm.name);
                        setEditReorder(rm.reorderLevel.toString());
                        setEditCost(rm.costPerUnit.toString());
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      title="Edit material name, reorder alert limit or cost"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available Stock:</span>
                    <span
                      className={`font-mono font-bold text-base tabular-nums ${
                        isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {rm.currentStock.toLocaleString('en-IN')} {rm.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Reorder Warning Level:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">
                      {rm.reorderLevel} {rm.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/40">
                    <span>Approx Cost / Unit:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      ₹{rm.costPerUnit} / {rm.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10px] flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {isLow ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Reorder urgently!
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium">Stock Healthy</span>
                )}
                <span className="text-slate-400">Auto-consumed on batch entry</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Record Purchase Inward */}
      {showInwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Record Raw Material Purchase Inward
            </h3>
            <p className="text-slate-500 mb-4">
              Increases stock in selected unit warehouse and creates a ledger Purchase movement.
            </p>

            <form onSubmit={handleInwardSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Raw Material Item
                </label>
                <select
                  value={inwardMaterialId}
                  onChange={e => setInwardMaterialId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {rawMaterials.map(rm => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name} ({rm.unit}) — {rm.applicableUnit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  value={inwardSupplier}
                  onChange={e => setInwardSupplier(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    Inward Quantity
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={inwardQty}
                    onChange={e => setInwardQty(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rate per Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={inwardRate}
                    onChange={e => setInwardRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Supplier Bill / Challan No.
                </label>
                <input
                  type="text"
                  value={inwardBillNo}
                  onChange={e => setInwardBillNo(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInwardModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Confirm Inward Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Material Parameters */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Edit Material Master Record
            </h3>
            <p className="text-slate-500 mb-3">Admin configurable parameters</p>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Material Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Reorder Alert Threshold ({editingMaterial.unit})
                </label>
                <input
                  type="number"
                  value={editReorder}
                  onChange={e => setEditReorder(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Standard Cost per Unit (₹)
                </label>
                <input
                  type="number"
                  value={editCost}
                  onChange={e => setEditCost(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
