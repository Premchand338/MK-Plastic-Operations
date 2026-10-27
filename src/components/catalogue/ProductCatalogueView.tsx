import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  History,
  Edit2,
  Check,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BeadShapeIcon } from '../common/BeadShapeIcon';
import { ProductSKU } from '../../types';

export const ProductCatalogueView: React.FC = () => {
  const { products, updateProductConversion, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'finished' | 'plain'>('finished');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterShape, setFilterShape] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [editingSku, setEditingSku] = useState<ProductSKU | null>(null);
  const [newRatio, setNewRatio] = useState<string>('');
  const [selectedHistorySku, setSelectedHistorySku] = useState<ProductSKU | null>(null);

  const displayedProducts = products.filter(p => {
    if (activeTab === 'finished' && p.process === 'Moulding') return false;
    if (activeTab === 'plain' && p.process !== 'Moulding') return false;
    if (filterShape !== 'all' && p.shape !== filterShape) return false;
    if (filterMaterial !== 'all' && p.material !== filterMaterial) return false;
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSaveConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSku) return;
    const ratio = parseFloat(newRatio);
    if (!isNaN(ratio) && ratio > 0) {
      updateProductConversion(editingSku.id, ratio);
    }
    setEditingSku(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Product Catalogue & Brochure SKUs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            24 official brochure products mapped from uncoloured plain moulding beads to finished pearl and metalizing colours.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setActiveTab('finished')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'finished'
                ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Finished SKUs (24 Brochure)
          </button>
          <button
            onClick={() => setActiveTab('plain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'plain'
                ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Moulding Plain Beads (Uncoloured)
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterShape}
            onChange={e => setFilterShape(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
          >
            <option value="all">All Shapes</option>
            <option value="Round">Round</option>
            <option value="Half Round">Half Round</option>
            <option value="Drop">Drop</option>
            <option value="Munga">Munga</option>
            <option value="Sujni">Sujni</option>
          </select>

          <select
            value={filterMaterial}
            onChange={e => setFilterMaterial(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
          >
            <option value="all">All Materials</option>
            <option value="Semi">Semi</option>
            <option value="Super">Super</option>
            <option value="Crylo">Crylo</option>
            <option value="SL">SL</option>
            <option value="PS">PS</option>
            <option value="DB">DB</option>
          </select>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search brochure SKU, colour, shape..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {displayedProducts.map(sku => (
          <div
            key={sku.id}
            className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between text-xs transition-all hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <BeadShapeIcon shape={sku.shape} className="text-[#C9A86A]" />
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    {sku.code}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    sku.process === 'Pearl'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : sku.process === 'Metalizing'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {sku.process}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                  {sku.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 text-slate-500 mt-1 text-[11px]">
                  <span>{sku.size_mm}mm</span>
                  <span>·</span>
                  <span>{sku.shape}</span>
                  <span>·</span>
                  <span>{sku.material}</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{sku.grade}</span>
                  {sku.colour !== 'Plain' && (
                    <>
                      <span>·</span>
                      <span className="text-[#C9A86A] font-semibold">{sku.colour}</span>
                    </>
                  )}
                </div>
              </div>

              {/* KG <-> Bunch Conversion Display & Editable */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Conversion Ratio:</span>
                  <div className="flex items-center gap-1">
                    {sku.kgToBunchRatio ? (
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        1 bn = {sku.kgToBunchRatio} kg (~{(1 / sku.kgToBunchRatio).toFixed(1)} bn/kg)
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">Not Set</span>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setEditingSku(sku);
                          setNewRatio(sku.kgToBunchRatio ? sku.kgToBunchRatio.toString() : '0.085');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Edit KG to bunch conversion"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                  <span className="text-slate-400">Default Rate:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200">
                    <span>₹{sku.defaultRatePerUOM.rate} / {sku.defaultRatePerUOM.unit}</span>
                    {sku.rateHistory && sku.rateHistory.length > 0 && (
                      <button
                        onClick={() => setSelectedHistorySku(sku)}
                        className="text-slate-400 hover:text-[#C9A86A] p-0.5"
                        title="View rate price history"
                      >
                        <History className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Sell Units: {sku.allowedSellingUOMs.join(', ')}</span>
              <span className="text-emerald-600 font-medium">Active in Catalogue</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Conversion Ratio Modal */}
      {editingSku && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Set KG ↔ Bunch Conversion
            </h3>
            <p className="text-slate-500 mb-3 truncate">{editingSku.name}</p>

            <form onSubmit={handleSaveConversion} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  1 Bunch = Weight in KG
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={newRatio}
                  onChange={e => setNewRatio(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-sm"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Example: 0.082 kg per bunch yields ~12.2 bunches per kg.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSku(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold"
                >
                  Save Ratio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price History Modal */}
      {selectedHistorySku && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Rate History: {selectedHistorySku.name}
            </h3>
            <p className="text-slate-500 mb-3 text-[11px]">
              Old invoices lock the rate at time of sale; future price list changes never alter historical bills.
            </p>

            <div className="space-y-2 mb-4">
              {selectedHistorySku.rateHistory?.map((hist, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-between font-mono"
                >
                  <span className="text-slate-500">{hist.date}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{hist.rate} / {hist.unit}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedHistorySku(null)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
