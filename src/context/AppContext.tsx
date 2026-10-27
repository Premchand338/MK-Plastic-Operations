import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  UserPersona,
  ManufacturingUnit,
  ProductSKU,
  RawMaterial,
  StockMovement,
  MouldingProductionEntry,
  CoatingBatchEntry,
  KarigarJobWork,
  Party,
  SalesOrder,
  Invoice,
  PaymentReceipt,
  ExpenseRecord,
  AuditLogEntry,
  OfflineOutboxItem,
  LanguageCode,
  MouldingTask,
  OperatorMouldingSession,
  FactoryNotification,
  ProductionProgram
} from '../types';
import {
  DEMO_USERS,
  INITIAL_RAW_MATERIALS,
  PLAIN_BEAD_SKUS,
  BROCHURE_PRODUCTS,
  INITIAL_PARTIES,
  INITIAL_KARIGAR_WORK,
  INITIAL_ORDERS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_AUDIT_LOGS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_MOULDING_ENTRIES,
  INITIAL_COATING_BATCHES,
  INITIAL_MOULDING_TASKS,
  INITIAL_OPERATOR_SESSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PRODUCTION_PROGRAMS
} from '../data/seedData';
import { TRANSLATIONS } from '../i18n/translations';

export type AppTab =
  | 'dashboard'
  | 'production'
  | 'quick_entry'
  | 'stock'
  | 'transfers'
  | 'karigar'
  | 'catalogue'
  | 'orders'
  | 'parties'
  | 'raw_materials'
  | 'expenses'
  | 'reports'
  | 'settings';

interface AppContextType {
  // User & Auth
  currentUser: UserPersona;
  setCurrentUser: (user: UserPersona) => void;
  availableUsers: UserPersona[];
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  loginAsUser: (user: UserPersona) => void;
  logout: () => void;

  // App Configuration & Language
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;

  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  activeUnitFilter: ManufacturingUnit | 'all';
  setActiveUnitFilter: (unit: ManufacturingUnit | 'all') => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  flowMode: 'step_by_step' | 'standard';
  setFlowMode: (mode: 'step_by_step' | 'standard') => void;
  toggleFlowMode: () => void;

  // Network & Offline Outbox
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleOnlineStatus: () => void;
  offlineOutbox: OfflineOutboxItem[];
  syncOutbox: () => void;

  // Settings & Toggles
  karigarChargesEnabled: boolean;
  setKarigarChargesEnabled: (enabled: boolean) => void;
  overdueDaysThreshold: number;
  setOverdueDaysThreshold: (days: number) => void;

  // Master Data & Collections
  products: ProductSKU[];
  rawMaterials: RawMaterial[];
  stockMovements: StockMovement[];
  mouldingEntries: MouldingProductionEntry[];
  coatingBatches: CoatingBatchEntry[];
  karigarWorks: KarigarJobWork[];
  parties: Party[];
  orders: SalesOrder[];
  invoices: Invoice[];
  payments: PaymentReceipt[];
  expenses: ExpenseRecord[];
  auditLogs: AuditLogEntry[];

  // Computed Values & Calculators
  calculateItemStock: (itemId: string, unit?: ManufacturingUnit) => number;
  stageTotals: {
    rawKg: number;
    plainKg: number;
    transferredKg: number;
    coatedKg: number;
    atKarigarKg: number;
    finishedBunches: number;
    dispatchedTotalKg: number;
  };
  todayProduction: {
    mouldingKg: number;
    pearlKg: number;
    metalizingKg: number;
    avgYieldPct: number;
  };
  lowStockItems: RawMaterial[];
  overdueKarigarBatches: KarigarJobWork[];
  totalReceivables: number;
  topOverdueParties: Party[];

  // Mutating Actions
  addMouldingProduction: (entry: Omit<MouldingProductionEntry, 'id' | 'timestamp'>) => void;
  addCoatingBatch: (batch: Omit<CoatingBatchEntry, 'id' | 'timestamp'>) => void;
  createUnitTransfer: (fromUnit: ManufacturingUnit, toUnit: ManufacturingUnit, skuId: string, qtyKg: number, notes?: string) => void;
  sendToKarigar: (karigarId: string, sourceUnit: 'pearl' | 'metalizing', skuId: string, qtyKg: number, slipNo: string, rate?: number) => void;
  receiveFromKarigar: (
    workId: string,
    bunches: number,
    looseKg: number,
    wasteKg: number,
    remarks?: string,
    threadWeightAddedKg?: number,
    kachchaBillNo?: string,
    kachchaBillAmount?: number,
    packetsReceived?: number,
    packagingMode?: 'bunches_per_packet' | 'kg_per_packet',
    packetSizeValue?: number,
    rawLotRef?: string
  ) => void;
  createSalesOrder: (order: Omit<SalesOrder, 'id'>) => { success: boolean; shortage: boolean };
  recordDispatch: (orderId: string, vehicleNo: string, items: { skuId: string; qty: number; uom: 'KG' | 'Bunch' | 'Packet'; packets?: number }[]) => void;
  dispatchOrderWithInvoice: (
    orderId: string,
    vehicleNo: string,
    items: { skuId: string; qty: number; uom: 'KG' | 'Bunch' | 'Packet'; packets?: number }[],
    invoiceType: 'GST_Tax_Invoice' | 'Kachcha_Bill',
    transporterName?: string
  ) => { invoiceId: string; invoiceNo: string };
  createInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  recordPayment: (payment: Omit<PaymentReceipt, 'id'>) => void;
  addRawMaterialInward: (materialId: string, qty: number, rate: number, supplierName: string, billNo: string) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  applyPhysicalStockAudit: (skuId: string, countedQty: number, unit: ManufacturingUnit, reason: string) => void;
  reverseStockMovement: (movementId: string, reason: string) => void;
  updateProductConversion: (skuId: string, ratio: number) => void;
  updateRawMaterial: (material: RawMaterial) => void;

  // Dedicated Moulding Tasks & Operator Earnings
  mouldingTasks: MouldingTask[];
  operatorSessions: OperatorMouldingSession[];
  selectedMouldingTaskId: string | null;
  setSelectedMouldingTaskId: (id: string | null) => void;
  startMouldingBatchFromTask: (taskId: string) => void;
  assignMouldingTask: (task: Omit<MouldingTask, 'id' | 'status' | 'assignedDate'>) => void;
  submitOperatorMouldingSession: (session: Omit<OperatorMouldingSession, 'id' | 'timestamp' | 'status'>) => { sessionId: string; salaryEarned: number };
  recycleMouldingWaste: (sessionId: string, wasteKg: number) => void;
  getOperatorEarnings: (operatorId: string) => { todayEarned: number; weekEarned: number; totalKgProduced: number };

  // Production Programs (Admin/Owner planning & live worker tracking)
  productionPrograms: ProductionProgram[];
  createProductionProgram: (program: Omit<ProductionProgram, 'id' | 'programNo' | 'packetsCompleted' | 'status'>) => void;
  incrementProgramPackets: (programId: string, count: number) => void;
  completeProductionProgram: (programId: string) => void;

  // Real-Time Factory Notifications for Admin
  notifications: FactoryNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User Persona (Default Admin Rajesh Shah with fast switcher)
  const [currentUser, setCurrentUser] = useState<UserPersona>(DEMO_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeTab, setActiveTabInternal] = useState<AppTab>('dashboard');

  const setActiveTab = (tab: AppTab) => {
    if (currentUser.role === 'staff' && tab !== 'quick_entry') {
      setActiveTabInternal('quick_entry');
      return;
    }
    setActiveTabInternal(tab);
  };

  const loginAsUser = (user: UserPersona) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (user.role === 'staff') {
      setActiveTabInternal('quick_entry');
    } else if (user.role === 'unit_manager') {
      setActiveTabInternal('production');
    } else {
      setActiveTabInternal('dashboard');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };
  const [activeUnitFilter, setActiveUnitFilter] = useState<ManufacturingUnit | 'all'>('all');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [flowMode, setFlowMode] = useState<'step_by_step' | 'standard'>('step_by_step');

  const toggleFlowMode = () => {
    setFlowMode(prev => (prev === 'step_by_step' ? 'standard' : 'step_by_step'));
  };

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineOutbox, setOfflineOutbox] = useState<OfflineOutboxItem[]>([]);

  // Config Flags
  const [karigarChargesEnabled, setKarigarChargesEnabled] = useState<boolean>(false);
  const [overdueDaysThreshold, setOverdueDaysThreshold] = useState<number>(15);

  // Entities State
  const [products, setProducts] = useState<ProductSKU[]>([...PLAIN_BEAD_SKUS, ...BROCHURE_PRODUCTS]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);
  const [mouldingEntries, setMouldingEntries] = useState<MouldingProductionEntry[]>(INITIAL_MOULDING_ENTRIES);
  const [coatingBatches, setCoatingBatches] = useState<CoatingBatchEntry[]>(INITIAL_COATING_BATCHES);
  const [karigarWorks, setKarigarWorks] = useState<KarigarJobWork[]>(INITIAL_KARIGAR_WORK);
  const [parties, setParties] = useState<Party[]>(INITIAL_PARTIES);
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentReceipt[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [mouldingTasks, setMouldingTasks] = useState<MouldingTask[]>(INITIAL_MOULDING_TASKS);
  const [operatorSessions, setOperatorSessions] = useState<OperatorMouldingSession[]>(INITIAL_OPERATOR_SESSIONS);
  const [selectedMouldingTaskId, setSelectedMouldingTaskId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<FactoryNotification[]>(INITIAL_NOTIFICATIONS);
  const [productionPrograms, setProductionPrograms] = useState<ProductionProgram[]>(INITIAL_PRODUCTION_PROGRAMS);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleOnlineStatus = () => setIsOnline(prev => !prev);

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Log Audit Entry
  const addAuditLog = (action: AuditLogEntry['action'], entityType: string, entityId: string, description: string, oldValue?: string, newValue?: string) => {
    const log: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entityType,
      entityId,
      description,
      oldValue,
      newValue
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Stock Calculation from immutable movements ledger
  const calculateItemStock = (itemId: string, unit?: ManufacturingUnit): number => {
    return stockMovements
      .filter(m => m.itemId === itemId && !m.reversed && (!unit || m.locationUnit === unit))
      .reduce((sum, m) => sum + m.qty, 0);
  };

  // Calculate material pipeline totals across 6 stages
  const stageTotals = useMemo(() => {
    let rawKg = rawMaterials
      .filter(rm => rm.unit === 'kg')
      .reduce((acc, curr) => acc + curr.currentStock, 0);

    let plainKg = stockMovements
      .filter(m => m.stage === 'plain' && !m.reversed)
      .reduce((acc, curr) => acc + curr.qty, 0);

    let transferredKg = stockMovements
      .filter(m => m.movementType === 'Transfer_In' && !m.reversed)
      .reduce((acc, curr) => acc + curr.qty, 0);

    let coatedKg = stockMovements
      .filter(m => m.stage === 'coated' && !m.reversed)
      .reduce((acc, curr) => acc + curr.qty, 0);

    let atKarigarKg = stockMovements
      .filter(m => m.stage === 'karigar' && !m.reversed)
      .reduce((acc, curr) => acc + curr.qty, 0);

    let finishedBunches = stockMovements
      .filter(m => m.stage === 'finished' && m.uom === 'bunch' && !m.reversed)
      .reduce((acc, curr) => acc + curr.qty, 0);

    let dispatchedTotalKg = stockMovements
      .filter(m => m.movementType === 'Sale_Dispatch' && !m.reversed)
      .reduce((acc, curr) => acc + Math.abs(curr.qty), 0);

    return {
      rawKg: Math.max(0, rawKg),
      plainKg: Math.max(0, plainKg),
      transferredKg: Math.max(0, transferredKg),
      coatedKg: Math.max(0, coatedKg),
      atKarigarKg: Math.max(0, atKarigarKg),
      finishedBunches: Math.max(0, finishedBunches),
      dispatchedTotalKg: Math.max(0, dispatchedTotalKg)
    };
  }, [rawMaterials, stockMovements]);

  // Today's production metrics
  const todayProduction = useMemo(() => {
    const todayStr = '2026-10-24';
    const mouldingToday = mouldingEntries.filter(m => m.date === todayStr);
    const mouldingKg = mouldingToday.reduce((sum, m) => sum + m.goodBeadsKg, 0);
    const avgYieldPct = mouldingToday.length > 0
      ? mouldingToday.reduce((sum, m) => sum + m.yieldPct, 0) / mouldingToday.length
      : 91.5;

    const pearlToday = coatingBatches.filter(b => b.date === todayStr && b.unit === 'pearl');
    const pearlKg = pearlToday.reduce((sum, b) => sum + b.outputKg, 0);

    const metalToday = coatingBatches.filter(b => b.date === todayStr && b.unit === 'metalizing');
    const metalizingKg = metalToday.reduce((sum, b) => sum + b.outputKg, 0);

    return {
      mouldingKg,
      pearlKg,
      metalizingKg,
      avgYieldPct: Number(avgYieldPct.toFixed(1))
    };
  }, [mouldingEntries, coatingBatches]);

  // Low stock alert items
  const lowStockItems = useMemo(() => {
    return rawMaterials.filter(rm => rm.currentStock <= rm.reorderLevel);
  }, [rawMaterials]);

  // Overdue karigar batches
  const overdueKarigarBatches = useMemo(() => {
    return karigarWorks.filter(
      kw => (kw.status === 'Overdue' || kw.daysOut > overdueDaysThreshold) && kw.bunchesReceived === 0
    );
  }, [karigarWorks, overdueDaysThreshold]);

  // Total receivables & overdue customers
  const totalReceivables = useMemo(() => {
    return parties
      .filter(p => p.type === 'Customer')
      .reduce((sum, p) => sum + Math.max(0, p.outstandingBalance), 0);
  }, [parties]);

  const topOverdueParties = useMemo(() => {
    return parties
      .filter(p => p.type === 'Customer' && p.outstandingBalance > 0)
      .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
      .slice(0, 5);
  }, [parties]);

  // --- ACTIONS ---

  // 1. Moulding Production Entry
  const addMouldingProduction = (entry: Omit<MouldingProductionEntry, 'id' | 'timestamp'>) => {
    const entryId = `mould-entry-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newEntry: MouldingProductionEntry = { ...entry, id: entryId, timestamp };

    if (!isOnline) {
      setOfflineOutbox(prev => [
        ...prev,
        {
          id: `outbox-${Date.now()}`,
          timestamp,
          actionType: 'PRODUCTION_ENTRY',
          payload: newEntry,
          status: 'PENDING',
          retryCount: 0
        }
      ]);
    }

    setMouldingEntries(prev => [newEntry, ...prev]);

    // Ledger movements:
    // Consumption of GPPS
    const gppsConsumption: StockMovement = {
      id: `mov-${Date.now()}-1`,
      timestamp,
      itemId: 'rm-gpps-sr',
      itemName: 'GPPS Granules (SR)',
      itemType: 'Raw',
      locationUnit: 'moulding',
      stage: 'raw',
      qty: -entry.gppsUsedKg,
      uom: 'kg',
      movementType: 'Consumption',
      referenceId: entryId,
      operatorName: entry.operatorName,
      notes: `Machine ${entry.machineId} shift ${entry.shift}`
    };

    // Production In of Plain Beads
    const plainProduction: StockMovement = {
      id: `mov-${Date.now()}-2`,
      timestamp,
      itemId: entry.skuId,
      itemName: entry.skuName,
      itemType: 'Plain',
      locationUnit: 'moulding',
      stage: 'plain',
      qty: entry.goodBeadsKg,
      uom: 'kg',
      movementType: 'Production_In',
      referenceId: entryId,
      operatorName: entry.operatorName,
      notes: `Packed in ${entry.bagsPacked} bags. Waste: ${entry.wasteKg}kg`
    };

    setStockMovements(prev => [gppsConsumption, plainProduction, ...prev]);

    // Update Raw Material inventory counter
    setRawMaterials(prev =>
      prev.map(rm => (rm.id === 'rm-gpps-sr' ? { ...rm, currentStock: rm.currentStock - entry.gppsUsedKg } : rm))
    );

    addAuditLog('CREATE', 'MouldingProduction', entryId, `Produced ${entry.goodBeadsKg} kg of ${entry.skuName} on ${entry.machineId}`);
  };

  // 2. Coating Batch Entry
  const addCoatingBatch = (batch: Omit<CoatingBatchEntry, 'id' | 'timestamp'>) => {
    const batchId = `coat-batch-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newBatch: CoatingBatchEntry = { ...batch, id: batchId, timestamp };

    setCoatingBatches(prev => [newBatch, ...prev]);

    // Consume input plain beads
    const plainConsume: StockMovement = {
      id: `mov-${Date.now()}-1`,
      timestamp,
      itemId: batch.inputPlainSkuId,
      itemName: 'Plain Bead Input',
      itemType: 'Plain',
      locationUnit: batch.unit,
      stage: 'plain',
      qty: -batch.inputPlainKg,
      uom: 'kg',
      movementType: 'Consumption',
      referenceId: batchId,
      operatorName: batch.operatorName
    };

    // Output coated beads
    const coatedIn: StockMovement = {
      id: `mov-${Date.now()}-2`,
      timestamp,
      itemId: batch.outputSkuId,
      itemName: batch.outputSkuName,
      itemType: 'Coated',
      locationUnit: batch.unit,
      stage: 'coated',
      qty: batch.outputKg,
      uom: 'kg',
      movementType: 'Production_In',
      referenceId: batchId,
      operatorName: batch.operatorName,
      notes: `Rejects: ${batch.rejectsKg}kg`
    };

    setStockMovements(prev => [plainConsume, coatedIn, ...prev]);
    addAuditLog('CREATE', 'CoatingBatch', batchId, `Coated ${batch.outputKg} kg of ${batch.outputSkuName} on ${batch.machineId}`);
  };

  // 3. Unit Transfer
  const createUnitTransfer = (
    fromUnit: ManufacturingUnit,
    toUnit: ManufacturingUnit,
    skuId: string,
    qtyKg: number,
    notes?: string
  ) => {
    const timestamp = new Date().toISOString();
    const trfId = `TRF-${fromUnit[0].toUpperCase()}-${toUnit[0].toUpperCase()}-${Date.now()}`;
    const sku = products.find(p => p.id === skuId);
    const itemName = sku ? sku.name : 'Bead Transfer';

    const outMovement: StockMovement = {
      id: `mov-${Date.now()}-out`,
      timestamp,
      itemId: skuId,
      itemName,
      itemType: 'Plain',
      locationUnit: fromUnit,
      stage: 'plain',
      qty: -qtyKg,
      uom: 'kg',
      movementType: 'Transfer_Out',
      referenceId: trfId,
      operatorName: currentUser.name,
      notes: notes || `Internal transfer to ${toUnit}`
    };

    const inMovement: StockMovement = {
      id: `mov-${Date.now()}-in`,
      timestamp,
      itemId: skuId,
      itemName,
      itemType: 'Plain',
      locationUnit: toUnit,
      stage: 'plain',
      qty: qtyKg,
      uom: 'kg',
      movementType: 'Transfer_In',
      referenceId: trfId,
      operatorName: currentUser.name,
      notes: notes || `Internal transfer from ${fromUnit}`
    };

    setStockMovements(prev => [outMovement, inMovement, ...prev]);
    addAuditLog('CREATE', 'StockTransfer', trfId, `Moved ${qtyKg} kg ${itemName} from ${fromUnit} to ${toUnit}`);
  };

  // 4. Send to Karigar
  const sendToKarigar = (
    karigarId: string,
    sourceUnit: 'pearl' | 'metalizing',
    skuId: string,
    qtyKg: number,
    slipNo: string,
    rate?: number
  ) => {
    const timestamp = new Date().toISOString();
    const karigar = parties.find(p => p.id === karigarId);
    const sku = products.find(p => p.id === skuId);
    const workId = `kw-${Date.now()}`;

    const newJob: KarigarJobWork = {
      id: workId,
      slipNo,
      karigarId,
      karigarName: karigar ? karigar.name : 'Karigar',
      sourceUnit,
      dateSent: timestamp.slice(0, 10),
      coatedSkuId: skuId,
      coatedSkuName: sku ? sku.name : 'Coated Bead',
      qtySentKg: qtyKg,
      bunchesReceived: 0,
      looseReturnedKg: 0,
      wastageKg: 0,
      labourRatePerBunch: rate || 2.5,
      totalLabourAmount: 0,
      status: 'Pending',
      daysOut: 0,
      receiptHistory: []
    };

    setKarigarWorks(prev => [newJob, ...prev]);

    // Deduct coated beads from source unit
    const deductSource: StockMovement = {
      id: `mov-${Date.now()}-1`,
      timestamp,
      itemId: skuId,
      itemName: newJob.coatedSkuName,
      itemType: 'Coated',
      locationUnit: sourceUnit,
      stage: 'coated',
      qty: -qtyKg,
      uom: 'kg',
      movementType: 'Sent_Karigar',
      referenceId: slipNo,
      operatorName: currentUser.name,
      notes: `Sent to ${newJob.karigarName}`
    };

    // Add to karigar stage
    const addKarigar: StockMovement = {
      id: `mov-${Date.now()}-2`,
      timestamp,
      itemId: skuId,
      itemName: newJob.coatedSkuName,
      itemType: 'Coated',
      locationUnit: 'threading',
      stage: 'karigar',
      qty: qtyKg,
      uom: 'kg',
      movementType: 'Sent_Karigar',
      referenceId: slipNo,
      operatorName: currentUser.name
    };

    setStockMovements(prev => [deductSource, addKarigar, ...prev]);
    addAuditLog('CREATE', 'KarigarJobWork', workId, `Dispatched ${qtyKg} kg to ${newJob.karigarName} under ${slipNo}`);
  };

  // 5. Receive from Karigar with Thread Weight, Packets & Kachcha Bill
  const receiveFromKarigar = (
    workId: string,
    bunches: number,
    looseKg: number,
    wasteKg: number,
    remarks?: string,
    threadWeightAddedKg: number = 0,
    kachchaBillNo?: string,
    kachchaBillAmount?: number,
    packetsReceived?: number,
    packagingMode: 'bunches_per_packet' | 'kg_per_packet' = 'bunches_per_packet',
    packetSizeValue: number = 10,
    rawLotRef?: string
  ) => {
    const timestamp = new Date().toISOString();
    const work = karigarWorks.find(w => w.id === workId);
    if (!work) return;

    const receiptDate = timestamp.slice(0, 10);
    const sku = products.find(p => p.id === work.coatedSkuId);
    const ratio = sku?.kgToBunchRatio || 0.082;
    const beadsStrungKg = bunches * ratio;
    const totalThreadedWeightKg = beadsStrungKg + threadWeightAddedKg;
    const consumedKg = beadsStrungKg + looseKg + wasteKg;
    const billAmount = kachchaBillAmount || (work.labourRatePerBunch || 2.5) * bunches;

    const finalPackets = packetsReceived !== undefined && packetsReceived > 0
      ? packetsReceived
      : (packagingMode === 'bunches_per_packet' ? Math.max(1, Math.round(bunches / (packetSizeValue || 10))) : Math.max(1, Math.round(totalThreadedWeightKg / (packetSizeValue || 1))));

    setKarigarWorks(prev =>
      prev.map(w => {
        if (w.id === workId) {
          const newBunches = w.bunchesReceived + bunches;
          const newLoose = w.looseReturnedKg + looseKg;
          const newWaste = w.wastageKg + wasteKg;
          const isCompleted = newBunches * ratio + newLoose + newWaste >= w.qtySentKg * 0.95;

          return {
            ...w,
            bunchesReceived: newBunches,
            looseReturnedKg: newLoose,
            wastageKg: newWaste,
            totalLabourAmount: (w.labourRatePerBunch || 2.5) * newBunches,
            status: isCompleted ? 'Completed' : 'Partially_Received',
            receiptHistory: [
              ...w.receiptHistory,
              {
                receiptDate,
                bunches,
                packetsReceived: finalPackets,
                packagingMode,
                packetSizeValue,
                rawLotRef: rawLotRef || work.slipNo,
                looseKg,
                wasteKg,
                threadWeightAddedKg,
                totalThreadedWeightKg: Number(totalThreadedWeightKg.toFixed(2)),
                kachchaBillNo: kachchaBillNo || `KB-${Date.now().toString().slice(-4)}`,
                kachchaBillAmount: billAmount,
                remarks
              }
            ]
          };
        }
        return w;
      })
    );

    // Increase finished stock (bunches & packets)
    const addFinished: StockMovement = {
      id: `mov-${Date.now()}-fin`,
      timestamp,
      itemId: work.coatedSkuId,
      itemName: work.coatedSkuName,
      itemType: 'Finished',
      locationUnit: 'warehouse',
      stage: 'finished',
      qty: bunches,
      uom: 'bunch',
      movementType: 'Received_Karigar',
      referenceId: work.slipNo,
      operatorName: currentUser.name,
      notes: `Received from ${work.karigarName}. Beads: ${beadsStrungKg.toFixed(1)}kg + Threads: ${threadWeightAddedKg}kg = ${totalThreadedWeightKg.toFixed(1)}kg (${finalPackets} Packets in ${packagingMode === 'bunches_per_packet' ? `${packetSizeValue} bunches/pkt` : `${packetSizeValue} kg/pkt`})`
    };

    // Deduct from karigar location
    const deductKarigar: StockMovement = {
      id: `mov-${Date.now()}-kded`,
      timestamp,
      itemId: work.coatedSkuId,
      itemName: work.coatedSkuName,
      itemType: 'Coated',
      locationUnit: 'threading',
      stage: 'karigar',
      qty: -consumedKg,
      uom: 'kg',
      movementType: 'Received_Karigar',
      referenceId: work.slipNo,
      operatorName: currentUser.name,
      notes: `Returned: ${bunches} bunches (${finalPackets} packets), ${looseKg}kg loose, ${wasteKg}kg waste`
    };

    setStockMovements(prev => [addFinished, deductKarigar, ...prev]);
    addAuditLog('UPDATE', 'KarigarJobWork', workId, `Received ${bunches} bunches (${finalPackets} pkts, +${threadWeightAddedKg}kg thread) from ${work.karigarName}`);
  };

  // 6. Create Sales Order
  const createSalesOrder = (orderData: Omit<SalesOrder, 'id'>) => {
    const orderId = `ord-${Date.now()}`;
    const newOrder: SalesOrder = { ...orderData, id: orderId };
    setOrders(prev => [newOrder, ...prev]);

    const hasShortage = orderData.items.some(i => i.isShortage);
    addAuditLog('CREATE', 'SalesOrder', orderId, `Created Order ${newOrder.orderNo} for ${newOrder.partyName} (Total: ₹${newOrder.subtotal})`);
    return { success: true, shortage: hasShortage };
  };

  // 7. Dispatch Items with Packet Tracking
  const recordDispatch = (
    orderId: string,
    vehicleNo: string,
    items: { skuId: string; qty: number; uom: 'KG' | 'Bunch' | 'Packet'; packets?: number }[]
  ) => {
    const timestamp = new Date().toISOString();
    const dspId = `DSP-${Date.now()}`;
    const order = orders.find(o => o.id === orderId);
    const totalPackets = items.reduce((sum, it) => sum + (it.packets || (it.uom === 'Packet' ? it.qty : 0)), 0);

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const dispatches = [
            ...o.dispatches,
            {
              dispatchId: dspId,
              date: timestamp.slice(0, 10),
              vehicleNo,
              partyName: order?.partyName,
              packets: totalPackets,
              items
            }
          ];
          return {
            ...o,
            status: 'Partially_dispatched',
            dispatches
          };
        }
        return o;
      })
    );

    // Ledger movements for dispatch
    const movements: StockMovement[] = items.map(item => {
      const sku = products.find(p => p.id === item.skuId);
      return {
        id: `mov-${Date.now()}-${item.skuId}`,
        timestamp,
        itemId: item.skuId,
        itemName: sku ? sku.name : 'Dispatched Item',
        itemType: 'Finished',
        locationUnit: 'warehouse',
        stage: 'finished',
        qty: -item.qty,
        uom: item.uom.toLowerCase() as any,
        movementType: 'Sale_Dispatch',
        referenceId: dspId,
        operatorName: currentUser.name,
        notes: `Dispatched ${item.packets ? `${item.packets} packets` : `${item.qty} ${item.uom}`} to ${order?.partyName || 'Customer'} via ${vehicleNo}`
      };
    });

    setStockMovements(prev => [...movements, ...prev]);
    addAuditLog('CREATE', 'Dispatch', dspId, `Dispatched order ${order?.orderNo} (${totalPackets} packets) via vehicle ${vehicleNo}`);
  };

  // 8. 1-Click Dispatch with Immediate Invoice Generation (GST or Kachcha Bill)
  const dispatchOrderWithInvoice = (
    orderId: string,
    vehicleNo: string,
    items: { skuId: string; qty: number; uom: 'KG' | 'Bunch' | 'Packet'; packets?: number }[],
    invoiceType: 'GST_Tax_Invoice' | 'Kachcha_Bill',
    transporterName?: string
  ): { invoiceId: string; invoiceNo: string } => {
    const timestamp = new Date().toISOString();
    const dspId = `DSP-${Date.now()}`;
    const invoiceId = `inv-${Date.now()}`;
    const order = orders.find(o => o.id === orderId);
    const invoiceNo = invoiceType === 'GST_Tax_Invoice'
      ? `INV-26-${(invoices.length + 1).toString().padStart(4, '0')}`
      : `KB-EST-${(invoices.length + 1).toString().padStart(4, '0')}`;

    const totalPackets = items.reduce((sum, it) => sum + (it.packets || (it.uom === 'Packet' ? it.qty : 0)), 0);
    const party = parties.find(p => p.id === order?.partyId);

    // Calculate line items and subtotals conforming to InvoiceItem
    const invoiceItems = items.map(item => {
      const sku = products.find(p => p.id === item.skuId);
      const orderItem = order?.items.find(oi => oi.skuId === item.skuId);
      const rate = orderItem?.rate || sku?.defaultRatePerUOM.rate || 50;
      const taxable = item.qty * rate;
      const cgstAmt = invoiceType === 'GST_Tax_Invoice' ? (taxable * 9) / 100 : 0;
      const sgstAmt = invoiceType === 'GST_Tax_Invoice' ? (taxable * 9) / 100 : 0;

      return {
        skuId: item.skuId,
        skuName: sku ? sku.name : 'Finished Beads',
        hsnCode: '39269099',
        qty: item.qty,
        uom: item.uom,
        rate,
        taxableAmount: taxable,
        cgstRate: invoiceType === 'GST_Tax_Invoice' ? 9 : 0,
        cgstAmount: cgstAmt,
        sgstRate: invoiceType === 'GST_Tax_Invoice' ? 9 : 0,
        sgstAmount: sgstAmt,
        igstRate: 0,
        igstAmount: 0,
        totalAmount: taxable + cgstAmt + sgstAmt
      };
    });

    const taxableSubtotal = invoiceItems.reduce((acc, it) => acc + it.taxableAmount, 0);
    const totalCgst = invoiceItems.reduce((acc, it) => acc + it.cgstAmount, 0);
    const totalSgst = invoiceItems.reduce((acc, it) => acc + it.sgstAmount, 0);
    const grandTotal = Math.round(taxableSubtotal + totalCgst + totalSgst);

    // 1. Create Invoice
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNo,
      orderId,
      type: invoiceType,
      partyId: order?.partyId || '',
      partyName: order?.partyName || 'Customer',
      partyGstin: party?.gstin,
      partyAddress: party?.address || 'Bhiwandi, Maharashtra',
      partyState: party?.state || 'Maharashtra',
      date: timestamp.slice(0, 10),
      items: invoiceItems,
      taxableSubtotal,
      totalCgst,
      totalSgst,
      totalIgst: 0,
      roundOff: 0,
      grandTotal,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      whatsappShareText: `Namaste ${order?.partyName || 'Customer'}, your ${invoiceType === 'GST_Tax_Invoice' ? 'Tax Invoice' : 'Bill'} ${invoiceNo} for ₹${grandTotal.toLocaleString('en-IN')} has been generated. Regards, MK Plastics Bhiwandi.`
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // 2. Adjust Party Outstanding
    if (order?.partyId) {
      setParties(prev =>
        prev.map(p => {
          if (p.id === order.partyId) {
            return {
              ...p,
              outstandingBalance: p.outstandingBalance + grandTotal
            };
          }
          return p;
        })
      );
    }

    // 3. Update Order status and dispatches record
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const dispatches = [
            ...o.dispatches,
            {
              dispatchId: dspId,
              date: timestamp.slice(0, 10),
              vehicleNo,
              transporterName,
              partyName: order?.partyName,
              packets: totalPackets,
              invoiced: true,
              invoiceId,
              invoiceType,
              items
            }
          ];
          return {
            ...o,
            status: 'Partially_dispatched',
            dispatches
          };
        }
        return o;
      })
    );

    // 4. Ledger Movements
    const movements: StockMovement[] = items.map(item => {
      const sku = products.find(p => p.id === item.skuId);
      return {
        id: `mov-${Date.now()}-${item.skuId}`,
        timestamp,
        itemId: item.skuId,
        itemName: sku ? sku.name : 'Dispatched Item',
        itemType: 'Finished',
        locationUnit: 'warehouse',
        stage: 'finished',
        qty: -item.qty,
        uom: item.uom.toLowerCase() as any,
        movementType: 'Sale_Dispatch',
        referenceId: dspId,
        operatorName: currentUser.name,
        notes: `Dispatched ${item.packets ? `${item.packets} packets` : `${item.qty} ${item.uom}`} to ${order?.partyName} (Inv: ${invoiceNo})`
      };
    });

    setStockMovements(prev => [...movements, ...prev]);
    addAuditLog('CREATE', 'Invoice', invoiceId, `1-Click ${invoiceType} (${invoiceNo}) for ₹${grandTotal} generated on dispatch to ${order?.partyName}`);

    return { invoiceId, invoiceNo };
  };

  // Production Program management
  const createProductionProgram = (
    programData: Omit<ProductionProgram, 'id' | 'programNo' | 'packetsCompleted' | 'status'>
  ) => {
    const prgId = `prg-${Date.now()}`;
    const programNo = `PRG-26-${(productionPrograms.length + 1).toString().padStart(3, '0')}`;
    const newProgram: ProductionProgram = {
      ...programData,
      id: prgId,
      programNo,
      packetsCompleted: 0,
      status: 'Running',
      liveCycleSeconds: 45
    };
    setProductionPrograms(prev => [newProgram, ...prev]);
    addAuditLog('CREATE', 'ProductionProgram', prgId, `Admin scheduled ${programNo} on ${programData.machineId} for ${programData.targetSkuName}`);
  };

  const incrementProgramPackets = (programId: string, count: number) => {
    setProductionPrograms(prev =>
      prev.map(p => {
        if (p.id === programId) {
          const newCompleted = Math.max(0, p.packetsCompleted + count);
          const isDone = newCompleted >= p.targetPackets;
          return {
            ...p,
            packetsCompleted: newCompleted,
            status: isDone ? 'Completed' : (newCompleted > 0 ? 'Running' : p.status)
          };
        }
        return p;
      })
    );
  };

  const completeProductionProgram = (programId: string) => {
    setProductionPrograms(prev =>
      prev.map(p => (p.id === programId ? { ...p, status: 'Completed' } : p))
    );
    addAuditLog('UPDATE', 'ProductionProgram', programId, `Marked production program completed`);
  };

  // 8. Create Invoice (GST Tax or Kachcha Bill)
  const createInvoice = (invData: Omit<Invoice, 'id'>) => {
    const invoiceId = `inv-${Date.now()}`;
    const newInvoice: Invoice = { ...invData, id: invoiceId };
    setInvoices(prev => [newInvoice, ...prev]);

    // Update customer outstanding balance
    setParties(prev =>
      prev.map(p => {
        if (p.id === invData.partyId) {
          return {
            ...p,
            outstandingBalance: p.outstandingBalance + invData.grandTotal
          };
        }
        return p;
      })
    );

    addAuditLog('CREATE', 'Invoice', invoiceId, `Generated ${invData.type} ${invData.invoiceNo} for ₹${invData.grandTotal} to ${invData.partyName}`);
  };

  // 9. Record Payment
  const recordPayment = (payData: Omit<PaymentReceipt, 'id'>) => {
    const payId = `pay-${Date.now()}`;
    const newPayment: PaymentReceipt = { ...payData, id: payId };
    setPayments(prev => [newPayment, ...prev]);

    // Reduce party balance
    setParties(prev =>
      prev.map(p => {
        if (p.id === payData.partyId) {
          return {
            ...p,
            outstandingBalance: Math.max(0, p.outstandingBalance - payData.amount)
          };
        }
        return p;
      })
    );

    // If allocated to invoices, mark as paid
    if (payData.allocatedInvoiceIds.length > 0) {
      setInvoices(prev =>
        prev.map(inv => {
          if (payData.allocatedInvoiceIds.includes(inv.id)) {
            const newPaid = inv.paidAmount + payData.amount;
            return {
              ...inv,
              paidAmount: newPaid,
              paymentStatus: newPaid >= inv.grandTotal ? 'Paid' : 'Partially_Paid'
            };
          }
          return inv;
        })
      );
    }

    addAuditLog('CREATE', 'Payment', payId, `Received ₹${payData.amount} from ${payData.partyName} via ${payData.mode}`);
  };

  // 10. Raw Material Inward
  const addRawMaterialInward = (
    materialId: string,
    qty: number,
    rate: number,
    supplierName: string,
    billNo: string
  ) => {
    const timestamp = new Date().toISOString();
    const poRef = `BILL-${billNo}`;
    const mat = rawMaterials.find(r => r.id === materialId);
    if (!mat) return;

    setRawMaterials(prev =>
      prev.map(r => (r.id === materialId ? { ...r, currentStock: r.currentStock + qty, costPerUnit: rate } : r))
    );

    const inwardMov: StockMovement = {
      id: `mov-${Date.now()}-inward`,
      timestamp,
      itemId: materialId,
      itemName: mat.name,
      itemType: 'Raw',
      locationUnit: mat.applicableUnit,
      stage: 'raw',
      qty,
      uom: mat.unit,
      movementType: 'Purchase',
      referenceId: poRef,
      operatorName: currentUser.name,
      notes: `Purchased from ${supplierName} at ₹${rate}/${mat.unit}`
    };

    setStockMovements(prev => [inwardMov, ...prev]);
    addAuditLog('CREATE', 'RawMaterialPurchase', poRef, `Inward of ${qty} ${mat.unit} of ${mat.name} from ${supplierName}`);
  };

  // 11. Add Expense
  const addExpense = (exp: Omit<ExpenseRecord, 'id'>) => {
    const expId = `exp-${Date.now()}`;
    const newExp: ExpenseRecord = { ...exp, id: expId };
    setExpenses(prev => [newExp, ...prev]);
    addAuditLog('CREATE', 'Expense', expId, `Logged ₹${exp.amount} ${exp.category} expense for ${exp.unit}`);
  };

  // 12. Physical Stock Count Audit
  const applyPhysicalStockAudit = (
    skuId: string,
    countedQty: number,
    unit: ManufacturingUnit,
    reason: string
  ) => {
    if (currentUser.role !== 'admin') {
      alert('Only Admins can approve physical stock adjustments.');
      return;
    }
    const currentCalculated = calculateItemStock(skuId, unit);
    const diff = countedQty - currentCalculated;
    if (diff === 0) return;

    const timestamp = new Date().toISOString();
    const adjRef = `AUDIT-ADJ-${Date.now()}`;
    const sku = products.find(p => p.id === skuId);

    const adjMovement: StockMovement = {
      id: `mov-${Date.now()}-adj`,
      timestamp,
      itemId: skuId,
      itemName: sku ? sku.name : 'Stock Item',
      itemType: sku?.colour === 'Plain' ? 'Plain' : 'Coated',
      locationUnit: unit,
      stage: sku?.colour === 'Plain' ? 'plain' : 'finished',
      qty: diff,
      uom: 'kg',
      movementType: 'Physical_Adjustment',
      referenceId: adjRef,
      operatorName: currentUser.name,
      notes: `Physical Count: ${countedQty}kg (was ${currentCalculated}kg). Diff: ${diff}kg. Reason: ${reason}`
    };

    setStockMovements(prev => [adjMovement, ...prev]);
    addAuditLog('ADJUST', 'StockAudit', adjRef, `Physical stock adjustment for ${sku?.name}: diff ${diff}kg. ${reason}`, `${currentCalculated}kg`, `${countedQty}kg`);
  };

  // 13. Reverse Stock Movement (Admin only)
  const reverseStockMovement = (movementId: string, reason: string) => {
    if (currentUser.role !== 'admin') {
      alert('Only Admins can reverse stock movements.');
      return;
    }
    const target = stockMovements.find(m => m.id === movementId);
    if (!target || target.reversed) return;

    const timestamp = new Date().toISOString();
    const revId = `REV-${Date.now()}`;

    // Mark original movement reversed
    setStockMovements(prev =>
      prev.map(m => (m.id === movementId ? { ...m, reversed: true } : m))
    );

    // Create compensatory movement
    const compensatory: StockMovement = {
      id: `mov-${Date.now()}-comp`,
      timestamp,
      itemId: target.itemId,
      itemName: target.itemName,
      itemType: target.itemType,
      locationUnit: target.locationUnit,
      stage: target.stage,
      qty: -target.qty, // Invert quantity
      uom: target.uom,
      movementType: 'Reversal',
      referenceId: revId,
      operatorName: currentUser.name,
      notes: `Reversal of movement ${target.id}. Reason: ${reason}`
    };

    setStockMovements(prev => [compensatory, ...prev]);
    addAuditLog('REVERSE', 'StockMovement', target.id, `Reversed movement of ${target.qty} ${target.uom} ${target.itemName}. Reason: ${reason}`);
  };

  // 14. Update conversion ratio
  const updateProductConversion = (skuId: string, ratio: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === skuId ? { ...p, kgToBunchRatio: ratio } : p))
    );
    addAuditLog('UPDATE', 'ProductSKU', skuId, `Updated KG to bunch conversion ratio to ${ratio}`);
  };

  // 15. Update Raw Material
  const updateRawMaterial = (material: RawMaterial) => {
    setRawMaterials(prev =>
      prev.map(rm => (rm.id === material.id ? material : rm))
    );
    addAuditLog('UPDATE', 'RawMaterial', material.id, `Updated raw material parameters for ${material.name}`);
  };

  // 16. Sync Outbox
  const syncOutbox = () => {
    if (offlineOutbox.length === 0) return;
    setOfflineOutbox([]);
    addAuditLog('CREATE', 'OfflineSync', `sync-${Date.now()}`, `Synchronized ${offlineOutbox.length} offline queued entries to ledger`);
  };

  // 17. Assign Moulding Task (Admin to Operator)
  const assignMouldingTask = (task: Omit<MouldingTask, 'id' | 'status' | 'assignedDate'>) => {
    const taskId = `task-${task.machineId.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const assignedDate = new Date().toISOString().slice(0, 10);
    const newTask: MouldingTask = {
      ...task,
      id: taskId,
      status: 'Assigned',
      assignedDate
    };
    setMouldingTasks(prev => [newTask, ...prev]);
    addAuditLog('CREATE', 'MouldingTask', taskId, `Assigned task on ${task.machineId} to ${task.assignedOperatorName}: ${task.rawAllocatedKg} kg ${task.rawMaterialName} at ₹${task.pieceRatePerKg}/kg`);
  };

  // 17b. Start Moulding Batch from Assigned Task
  const startMouldingBatchFromTask = (taskId: string) => {
    setSelectedMouldingTaskId(taskId);
    setMouldingTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'In_Progress' } : t))
    );
    const task = mouldingTasks.find(t => t.id === taskId);
    if (task) {
      addAuditLog('UPDATE', 'MouldingTask', taskId, `Started moulding batch on ${task.machineId} (${task.targetSkuName})`);
    }
    setActiveTab('quick_entry');
  };

  // 18. Submit Operator Moulding Session (Piece-Rate Salary & Real-Time Alert)
  const submitOperatorMouldingSession = (session: Omit<OperatorMouldingSession, 'id' | 'timestamp' | 'status'>) => {
    const sessionId = `sess-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const salaryEarned = session.mouldedBeadsKg * session.pieceRatePerKg;
    const newSession: OperatorMouldingSession = {
      ...session,
      id: sessionId,
      salaryEarned: Number(salaryEarned.toFixed(2)),
      status: 'Submitted',
      timestamp
    };

    setOperatorSessions(prev => [newSession, ...prev]);

    // Update assigned task if present
    if (session.taskId) {
      setMouldingTasks(prev =>
        prev.map(t => (t.id === session.taskId ? { ...t, status: 'Completed', completedAt: timestamp } : t))
      );
    }

    // Also register in mouldingEntries
    const mouldingEntry: MouldingProductionEntry = {
      id: `mould-${sessionId}`,
      date: timestamp.slice(0, 10),
      shift: 'Day',
      machineId: session.machineId,
      mouldId: 'MLD-STD-CAV',
      skuId: session.targetSkuId,
      skuName: session.targetSkuName,
      gppsUsedKg: session.rawMaterialUsedKg,
      goodBeadsKg: session.mouldedBeadsKg,
      wasteKg: session.wasteGeneratedKg,
      regrindReusedKg: 0,
      bagsPacked: session.bagsPacked || Math.ceil(session.mouldedBeadsKg / 25),
      yieldPct: session.yieldPct,
      operatorName: session.operatorName,
      timestamp
    };
    setMouldingEntries(prev => [mouldingEntry, ...prev]);

    // Ledger movements: Consume Raw Material, Inward Plain Beads
    const rawConsume: StockMovement = {
      id: `mov-${Date.now()}-1`,
      timestamp,
      itemId: session.rawMaterialId,
      itemName: session.rawMaterialName,
      itemType: 'Raw',
      locationUnit: 'moulding',
      stage: 'raw',
      qty: -session.rawMaterialUsedKg,
      uom: 'kg',
      movementType: 'Consumption',
      referenceId: sessionId,
      operatorName: session.operatorName,
      notes: `Machine ${session.machineId} operation`
    };

    const beadsIn: StockMovement = {
      id: `mov-${Date.now()}-2`,
      timestamp,
      itemId: session.targetSkuId,
      itemName: session.targetSkuName,
      itemType: 'Plain',
      locationUnit: 'moulding',
      stage: 'plain',
      qty: session.mouldedBeadsKg,
      uom: 'kg',
      movementType: 'Production_In',
      referenceId: sessionId,
      operatorName: session.operatorName,
      notes: `Earned ₹${salaryEarned}. Waste: ${session.wasteGeneratedKg} kg`
    };

    setStockMovements(prev => [rawConsume, beadsIn, ...prev]);

    // Deduct raw material from current stock
    setRawMaterials(prev =>
      prev.map(rm => (rm.id === session.rawMaterialId ? { ...rm, currentStock: Math.max(0, rm.currentStock - session.rawMaterialUsedKg) } : rm))
    );

    // Emit real-time notification to Admin
    const notification: FactoryNotification = {
      id: `notif-${Date.now()}`,
      timestamp,
      type: 'Task_Completed',
      operatorName: session.operatorName,
      machineId: session.machineId,
      summary: `${session.operatorName} completed ${session.machineId}: ${session.mouldedBeadsKg} kg beads, ${session.wasteGeneratedKg} kg waste. Salary: ₹${salaryEarned.toFixed(0)}`,
      mouldedKg: session.mouldedBeadsKg,
      wasteKg: session.wasteGeneratedKg,
      salaryEarned,
      read: false
    };
    setNotifications(prev => [notification, ...prev]);

    addAuditLog(
      'CREATE',
      'OperatorMouldingSession',
      sessionId,
      `${session.operatorName} produced ${session.mouldedBeadsKg} kg (${session.wasteGeneratedKg} kg waste) on ${session.machineId}. Salary: ₹${salaryEarned}`
    );

    return { sessionId, salaryEarned };
  };

  // 19. Recycle Moulding Waste to Regrind Inventory
  const recycleMouldingWaste = (sessionId: string, wasteKg: number) => {
    const timestamp = new Date().toISOString();
    setRawMaterials(prev =>
      prev.map(rm => (rm.id === 'rm-gpps-regrind' ? { ...rm, currentStock: rm.currentStock + wasteKg } : rm))
    );

    const recycleMovement: StockMovement = {
      id: `mov-${Date.now()}-recycle`,
      timestamp,
      itemId: 'rm-gpps-regrind',
      itemName: 'Recycled GPPS Regrind',
      itemType: 'Raw',
      locationUnit: 'moulding',
      stage: 'raw',
      qty: wasteKg,
      uom: 'kg',
      movementType: 'Adjustment',
      referenceId: sessionId,
      operatorName: currentUser.name,
      notes: `Moulding waste recycled into regrind hopper for re-use`
    };
    setStockMovements(prev => [recycleMovement, ...prev]);

    setOperatorSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, postActionTaken: 'Waste_Recycled' } : s))
    );

    addAuditLog('ADJUST', 'RawMaterial', 'rm-gpps-regrind', `Recycled ${wasteKg} kg moulding waste back to regrind inventory`);
  };

  // 20. Operator Real-Time Earnings Calculator
  const getOperatorEarnings = (operatorId: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const sessions = operatorSessions.filter(s => s.operatorId === operatorId);
    const todaySessions = sessions.filter(s => s.timestamp.slice(0, 10) === todayStr);

    const todayEarned = todaySessions.reduce((sum, s) => sum + s.salaryEarned, 0);
    const weekEarned = sessions.reduce((sum, s) => sum + s.salaryEarned, 0);
    const totalKgProduced = sessions.reduce((sum, s) => sum + s.mouldedBeadsKg, 0);

    return {
      todayEarned: Number(todayEarned.toFixed(2)),
      weekEarned: Number(weekEarned.toFixed(2)),
      totalKgProduced: Number(totalKgProduced.toFixed(1))
    };
  };

  // 21. Notification Helpers
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: DEMO_USERS,
        isLoggedIn,
        setIsLoggedIn,
        loginAsUser,
        logout,
        language,
        setLanguage,
        t,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        activeUnitFilter,
        setActiveUnitFilter,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        flowMode,
        setFlowMode,
        toggleFlowMode,
        isOnline,
        setIsOnline,
        toggleOnlineStatus,
        offlineOutbox,
        syncOutbox,
        karigarChargesEnabled,
        setKarigarChargesEnabled,
        overdueDaysThreshold,
        setOverdueDaysThreshold,
        products,
        rawMaterials,
        stockMovements,
        mouldingEntries,
        coatingBatches,
        karigarWorks,
        parties,
        orders,
        invoices,
        payments,
        expenses,
        auditLogs,
        calculateItemStock,
        stageTotals,
        todayProduction,
        lowStockItems,
        overdueKarigarBatches,
        totalReceivables,
        topOverdueParties,
        addMouldingProduction,
        addCoatingBatch,
        createUnitTransfer,
        sendToKarigar,
        receiveFromKarigar,
        createSalesOrder,
        recordDispatch,
        dispatchOrderWithInvoice,
        createInvoice,
        recordPayment,
        addRawMaterialInward,
        addExpense,
        applyPhysicalStockAudit,
        reverseStockMovement,
        updateProductConversion,
        updateRawMaterial,
        mouldingTasks,
        operatorSessions,
        selectedMouldingTaskId,
        setSelectedMouldingTaskId,
        startMouldingBatchFromTask,
        assignMouldingTask,
        submitOperatorMouldingSession,
        recycleMouldingWaste,
        getOperatorEarnings,
        productionPrograms,
        createProductionProgram,
        incrementProgramPackets,
        completeProductionProgram,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
