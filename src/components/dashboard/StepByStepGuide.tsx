import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRightLeft,
  Palette,
  Users,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
  Plus,
  Send,
  PackageCheck,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PLAIN_BEAD_SKUS, BROCHURE_PRODUCTS } from '../../data/seedData';
import { UnitTransferModal } from '../stock/UnitTransferModal';

interface StepInfo {
  number: number;
  id: string;
  title: string;
  hindiTitle: string;
  summary: string;
  inputDescription: string;
  outputDescription: string;
  ruleOrTip: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
}

export const StepByStepGuide: React.FC = () => {
  const {
    currentUser,
    stageTotals,
    calculateItemStock,
    karigarWorks,
    parties,
    sendToKarigar,
    receiveFromKarigar,
    addRawMaterialInward,
    setActiveTab,
    flowMode,
    toggleFlowMode
  } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showQuickKarigarModal, setShowQuickKarigarModal] = useState(false);
  const [showQuickReceiveModal, setShowQuickReceiveModal] = useState(false);

  // Inward Modal state
  const [inwardQty, setInwardQty] = useState('500'); // 20 bags of 25kg
  const [inwardRate, setInwardRate] = useState('118');
  const [inwardSupplier, setInwardSupplier] = useState('Reliance Industries (Polymers)');
  const [inwardBill, setInwardBill] = useState('INV-RIL-9421');

  // Karigar quick dispatch state
  const karigars = parties.filter(p => p.type === 'Karigar');
  const [selectedKarigarId, setSelectedKarigarId] = useState(karigars[0]?.id || '');
  const [karigarDispatchKg, setKarigarDispatchKg] = useState('100');

  // Karigar quick receive state
  const pendingKarigar = karigarWorks.find(kw => kw.bunchesReceived === 0 || kw.status === 'Pending' || kw.status === 'Overdue');
  const [recvBunches, setRecvBunches] = useState('800');
  const [recvLoose, setRecvLoose] = useState('12.5');
  const [recvWaste, setRecvWaste] = useState('2.0');

  // Live Calculations for current steps
  const gppsStockKg = stageTotals.rawKg;
  const gppsBags = Math.floor(gppsStockKg / 25);
  const plainStockKg = stageTotals.plainKg;
  const coatedStockKg = stageTotals.coatedKg;
  const atKarigarKg = stageTotals.atKarigarKg;
  const finishedBunches = stageTotals.finishedBunches;

  const steps: StepInfo[] = [
    {
      number: 1,
      id: 'raw_materials',
      title: 'Raw Material Inward',
      hindiTitle: 'कच्चा माल (GPPS) आवक',
      summary: 'Virgin plastic polymer granules arrive in standard 25 kg bags. They are stored in Moulding raw material stores before machine feeding.',
      inputDescription: 'Virgin GPPS Granules (Shalimar SR or Treemurti TR) from petrochemical supplier',
      outputDescription: '25 kg bags weighed and verified in factory inventory',
      ruleOrTip: 'Tip: 1 Bag = exactly 25 kg. Standard batch is 10 bags (250 kg).',
      actionLabel: 'Add GPPS Bags to Store',
      actionIcon: <Plus className="w-4 h-4" />
    },
    {
      number: 2,
      id: 'moulding',
      title: 'Moulding Injection (M1–M4)',
      hindiTitle: 'सादे दाने बनाना (मशीन M1–M4)',
      summary: 'Injection moulding machines (M1 to M4) heat GPPS granules for 35 min and inject molten plastic into steel moulds. Output is strictly uncoloured plain beads.',
      inputDescription: 'GPPS Granules + clean reground plastic waste',
      outputDescription: 'Uncoloured plain beads packed in 25–30 kg bags',
      ruleOrTip: 'Moulding produces ONLY uncoloured beads. Colour is added later in Pearl or Metalizing.',
      actionLabel: 'Log Moulding Output',
      actionIcon: <Sparkles className="w-4 h-4" />
    },
    {
      number: 3,
      id: 'transfers',
      title: 'Internal Move to Coating',
      hindiTitle: 'कोटिंग यूनिट में ट्रांसफर',
      summary: 'Plain uncoloured beads are transferred from Moulding to the Pearl unit (P1, P2) or Metalizing chamber (MZ1). All units are part of one firm under one GST number.',
      inputDescription: 'Plain uncoloured beads from Moulding unit',
      outputDescription: 'Material received at Pearl or Metalizing unit ready for coating',
      ruleOrTip: 'Important: No GST challan needed between internal factory units in Bhiwandi.',
      actionLabel: 'Move Plain Beads to Coating',
      actionIcon: <ArrowRightLeft className="w-4 h-4" />
    },
    {
      number: 4,
      id: 'coating',
      title: 'Pearl & Metalizing Coating',
      hindiTitle: 'कलर और कोटिंग (पर्ल / मैटल)',
      summary: 'Plain beads are coated with pearl essence and lacquer in rotating barrels (P1, P2) or vaporized with aluminum wire in the MZ1 vacuum chamber to create 16 brochure colors.',
      inputDescription: 'Plain beads + Pearl essence or Aluminum wire',
      outputDescription: 'Finished coloured beads (Off White, Ferozi, Magenta, Metallic Gold)',
      ruleOrTip: 'One plain bead size maps to multiple finished colour SKUs.',
      actionLabel: 'Log Coating Batch',
      actionIcon: <Palette className="w-4 h-4" />
    },
    {
      number: 5,
      id: 'threading',
      title: 'Karigar Threading (Outsource)',
      hindiTitle: 'कारीगर धागे में पिरोई (जॉब वर्क)',
      summary: 'Coated beads are sent by weight (KG) to local karigars who string them onto threads. Beads return as strung bunches, unstrung loose beads, and scrap.',
      inputDescription: 'Coated beads sent out by weight (KG) with numbered challan slip',
      outputDescription: 'Strung bunches (12 strings = 1 bunch) + returned loose beads',
      ruleOrTip: 'Karigars must return bunches within 15 days. App flags lots past 15 days as overdue.',
      actionLabel: 'Send Beads / Receive Bunches',
      actionIcon: <Users className="w-4 h-4" />
    },
    {
      number: 6,
      id: 'orders',
      title: 'Billing & Customer Dispatch',
      hindiTitle: 'पक्की / कच्ची बिक्री और बिलिंग',
      summary: 'Orders are booked from customers. Finished bunches or bulk KG are dispatched with vehicle details, generating official GST Tax Invoices or Kachcha bills.',
      inputDescription: 'Customer order from Bhiwandi, Surat, or Mumbai traders',
      outputDescription: 'GST Tax Invoice (27AABCM1234F1Z5) or Kachcha estimate + dispatch note',
      ruleOrTip: 'Pearl beads are sold in Bunches; Metalizing and Plain beads can be sold in KG or Bunches.',
      actionLabel: 'Create Order or Invoice',
      actionIcon: <FileText className="w-4 h-4" />
    }
  ];

  const currentStepInfo = steps[activeStep - 1];

  const handleStepAction = () => {
    switch (activeStep) {
      case 1:
        setShowInwardModal(true);
        break;
      case 2:
        setActiveTab('production');
        break;
      case 3:
        setShowTransferModal(true);
        break;
      case 4:
        setActiveTab('production');
        break;
      case 5:
        setActiveTab('karigar');
        break;
      case 6:
        setActiveTab('orders');
        break;
      default:
        break;
    }
  };

  const handleSaveInward = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(inwardQty) || 500;
    const rateNum = parseFloat(inwardRate) || 118;
    addRawMaterialInward('rm-gpps-sr', qtyNum, rateNum, inwardSupplier, inwardBill);
    setShowInwardModal(false);
  };

  const handleQuickKarigarSend = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = BROCHURE_PRODUCTS[0];
    const slipNo = `SLIP-${Date.now().toString().slice(-4)}`;
    sendToKarigar(
      selectedKarigarId,
      'pearl',
      sku.id,
      parseFloat(karigarDispatchKg) || 100,
      slipNo,
      2.5
    );
    setShowQuickKarigarModal(false);
  };

  const handleQuickKarigarRecv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingKarigar) return;
    receiveFromKarigar(
      pendingKarigar.id,
      parseInt(recvBunches) || 800,
      parseFloat(recvLoose) || 10,
      parseFloat(recvWaste) || 2,
      'Step-by-step guided reconciliation'
    );
    setShowQuickReceiveModal(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#201F2B] p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A86A]">
              Simple Factory Guide
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Beginner-Friendly 6 Steps
            </span>
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            How Plastic Granules Become Finished Beads
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Follow the 6 steps below to trace raw material from factory store to customer dispatch.
          </p>
        </div>

        {/* View Mode Toggle: Beginner Flow vs Advanced Studio */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 self-start sm:self-center">
          <button
            onClick={() => {
              if (flowMode !== 'step_by_step') toggleFlowMode();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              flowMode === 'step_by_step'
                ? 'bg-white dark:bg-[#201F2B] text-[#2B2A4C] dark:text-[#C9A86A] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Guided 6 Steps
          </button>
          <button
            onClick={() => {
              if (flowMode !== 'standard') toggleFlowMode();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              flowMode === 'standard'
                ? 'bg-white dark:bg-[#201F2B] text-[#2B2A4C] dark:text-[#C9A86A] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Full Overview
          </button>
        </div>
      </div>

      {/* Horizontal 6-Step Stepper Bar */}
      <div className="mt-5 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-[700px] lg:min-w-0 lg:grid lg:grid-cols-6">
          {steps.map(s => {
            const isSelected = activeStep === s.number;
            return (
              <button
                key={s.number}
                onClick={() => setActiveStep(s.number)}
                className={`w-full text-left p-3 rounded-2xl border transition-all relative ${
                  isSelected
                    ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] border-transparent shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/40 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isSelected ? 'text-[#C9A86A] dark:text-[#1E1D2B]' : 'text-slate-400'
                    }`}
                  >
                    Step 0{s.number}
                  </span>
                  {s.number < activeStep && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-emerald-300' : 'text-emerald-500'
                      }`}
                    />
                  )}
                </div>

                <div className="text-xs font-bold truncate">{s.title}</div>
                <div
                  className={`text-[10px] truncate mt-0.5 ${
                    isSelected ? 'text-white/80 dark:text-[#1E1D2B]/80' : 'text-slate-400'
                  }`}
                >
                  {s.hindiTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Interactive Workspace */}
      <div className="mt-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-[#FBFAF7] dark:from-slate-900/60 dark:to-[#17161F] border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left Column: Plain-Language Explanation */}
          <div className="space-y-4 max-w-2xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#C9A86A]">
                <span>STEP 0{currentStepInfo.number} OF 06</span>
                <span>·</span>
                <span>{currentStepInfo.hindiTitle}</span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {currentStepInfo.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {currentStepInfo.summary}
              </p>
            </div>

            {/* In / Out Visual Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Material Input
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  {currentStepInfo.inputDescription}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Material Output
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  {currentStepInfo.outputDescription}
                </span>
              </div>
            </div>

            {/* Beginner Pro-Tip Box */}
            <div className="p-3 rounded-xl bg-[#C9A86A]/10 border border-[#C9A86A]/30 text-xs text-[#2B2A4C] dark:text-[#ECEAF4] flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#C9A86A] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold text-slate-900 dark:text-slate-100">
                  Beginner Rule:
                </strong>{' '}
                {currentStepInfo.ruleOrTip}
              </div>
            </div>
          </div>

          {/* Right Column: Live Factory Stock & Direct Action */}
          <div className="lg:w-80 shrink-0 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Real-Time Status
              </span>
              <div className="mt-2 space-y-2">
                {activeStep === 1 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {gppsStockKg.toLocaleString('en-IN')} kg
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Raw GPPS in stock ({gppsBags} bags of 25 kg)
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {plainStockKg.toLocaleString('en-IN')} kg
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Plain uncoloured beads moulded in M1–M4
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {plainStockKg.toLocaleString('en-IN')} kg
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Ready to transfer to Pearl or Metalizing
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {coatedStockKg.toLocaleString('en-IN')} kg
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Coated beads in Pearl (P1, P2) & MZ1
                    </div>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {atKarigarKg.toLocaleString('en-IN')} kg
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Out with {parties.filter(p => p.type === 'Karigar').length} threading karigars
                    </div>
                  </div>
                )}

                {activeStep === 6 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {finishedBunches.toLocaleString('en-IN')} bunches
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Finished stock ready for GST / Kachcha sale
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Big Friendly Primary Action Button */}
            <button
              onClick={handleStepAction}
              className="w-full py-3 px-4 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-bold text-xs hover:opacity-95 transition-opacity shadow-sm flex items-center justify-center gap-2"
            >
              {currentStepInfo.actionIcon}
              <span>{currentStepInfo.actionLabel}</span>
            </button>

            {/* Stepper Navigation: Prev / Next */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev Step</span>
              </button>

              <button
                disabled={activeStep === steps.length}
                onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                className="flex items-center gap-1 text-xs font-semibold text-[#2B2A4C] dark:text-[#C9A86A] hover:underline disabled:opacity-40"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Quick Raw GPPS Inward (Step 1) */}
      {showInwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95 duration-150">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              Step 1 · Receive Virgin GPPS Granules
            </h3>
            <p className="text-slate-500 mt-0.5">
              Record new bags of GPPS into factory Moulding raw store.
            </p>

            <form onSubmit={handleSaveInward} className="space-y-3.5 pt-4">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  value={inwardSupplier}
                  onChange={e => setInwardSupplier(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Total Weight (KG)
                  </label>
                  <input
                    type="number"
                    step="25"
                    value={inwardQty}
                    onChange={e => setInwardQty(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ={Math.floor((parseFloat(inwardQty) || 0) / 25)} bags (25kg each)
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rate / KG (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={inwardRate}
                    onChange={e => setInwardRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Supplier Bill / Challan No
                </label>
                <input
                  type="text"
                  value={inwardBill}
                  onChange={e => setInwardBill(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInwardModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold shadow-xs hover:opacity-95"
                >
                  Save Inward (+{inwardQty} kg)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Inter-Unit Transfer (Step 3) */}
      {showTransferModal && (
        <UnitTransferModal
          onClose={() => setShowTransferModal(false)}
          initialFromUnit="moulding"
          initialToUnit="pearl"
          initialSkuId={PLAIN_BEAD_SKUS[0].id}
          initialQty="100"
        />
      )}
    </div>
  );
};
