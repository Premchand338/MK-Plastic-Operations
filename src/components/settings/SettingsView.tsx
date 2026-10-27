import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Clock,
  Layers,
  Users,
  CheckCircle2,
  Globe,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    karigarChargesEnabled,
    setKarigarChargesEnabled,
    overdueDaysThreshold,
    setOverdueDaysThreshold,
    language,
    setLanguage,
    currentUser,
    availableUsers,
    setCurrentUser
  } = useApp();

  const [savedNotice, setSavedNotice] = useState(false);
  const [thresholdInput, setThresholdInput] = useState(overdueDaysThreshold.toString());

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const days = parseInt(thresholdInput);
    if (!isNaN(days) && days > 0) {
      setOverdueDaysThreshold(days);
    }
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 text-xs">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            System & Factory Settings
          </h1>
          <p className="text-slate-500 mt-0.5">
            Configure firm GST profile, machine parameters, overdue thresholds, and feature flags.
          </p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4">
        {/* Company Profile Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-[#C9A86A]" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
              Firm Profile & GST Identity (Single Entity)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Firm Legal Name
              </label>
              <input
                type="text"
                disabled
                defaultValue="MK Plastics / Beads Bazaar"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                GSTIN Number (One firm, all units)
              </label>
              <input
                type="text"
                disabled
                defaultValue="27AABCM1234F1Z5"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-mono font-bold text-slate-700 dark:text-slate-300"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Registered Factory Address
              </label>
              <input
                type="text"
                disabled
                defaultValue="Plot 108, Gala 4-7, Anjurphata Road, Bhiwandi, Thane, Maharashtra 421302"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Operational Thresholds & Flags */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-[#C9A86A]" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
              Operational Thresholds & Job-Work Policies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Karigar SLA Overdue Days */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Karigar Overdue Threshold (Days)
              </label>
              <input
                type="number"
                value={thresholdInput}
                onChange={e => setThresholdInput(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                required
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Batches with karigars longer than {thresholdInput} days trigger overdue alert flags on the dashboard.
              </span>
            </div>

            {/* Karigar Labour Charges Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Karigar Labour Charges & Payables
                </span>
                <span className="text-[11px] text-slate-400">
                  Track per-bunch threading charges (default OFF as per owner request).
                </span>
              </div>
              <input
                type="checkbox"
                checked={karigarChargesEnabled}
                onChange={e => setKarigarChargesEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-[#C9A86A] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Active Machine Infrastructure */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-4 h-4 text-[#C9A86A]" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
              Registered Manufacturing Units & Machines
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-[#4A5A7A] block mb-1">Moulding Unit</span>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                <div>• Machine M1 (Horizontal)</div>
                <div>• Machine M2 (Horizontal)</div>
                <div>• Machine M3 (Horizontal)</div>
                <div>• Machine M4 (Horizontal)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-[#C98A9B] block mb-1">Pearl Unit</span>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                <div>• Barrel P1 (Coating)</div>
                <div>• Barrel P2 (Coating)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-[#8E99A8] block mb-1">Metalizing Unit</span>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                <div>• Machine MZ1 (Vacuum Chamber)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold shadow-xs hover:opacity-90"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
