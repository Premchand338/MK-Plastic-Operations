export type UserRole = 'admin' | 'unit_manager' | 'staff';

export type ManufacturingUnit = 'moulding' | 'pearl' | 'metalizing' | 'threading' | 'warehouse';

export type MaterialStage = 'raw' | 'plain' | 'coated' | 'karigar' | 'finished';

export type LanguageCode = 'en' | 'hi' | 'hinglish';

export interface UserPersona {
  id: string;
  name: string;
  role: UserRole;
  unit?: ManufacturingUnit;
  assignedMachine?: string;
  avatar: string;
}

export type BeadShape = 'Round' | 'Half Round' | 'Drop' | 'Munga' | 'Sujni';

export type BeadMaterial = 'Semi' | 'Super' | 'Crylo' | 'SL' | 'PS' | 'DB';

export type BeadGrade = 'SR' | 'TR';

export type BeadColour =
  | 'Plain'
  | 'Off White'
  | 'White'
  | 'Orange'
  | 'Ferozi'
  | 'Peach'
  | 'Pink'
  | 'LCD'
  | 'Magenta'
  | 'Maroon'
  | 'Red'
  | 'Artery'
  | 'Unique'
  | 'Yellow'
  | 'Baby Pink'
  | 'Pista'
  | 'Cream'
  | 'Gold Metallic'
  | 'Silver Metallic'
  | 'Antique Bronze';

export type SellingUOM = 'KG' | 'Bunch' | 'Packet';

export interface ProductSKU {
  id: string;
  code: string;
  name: string;
  shape: BeadShape;
  size_mm: number;
  material: BeadMaterial;
  grade: BeadGrade;
  colour: BeadColour;
  process: 'Moulding' | 'Pearl' | 'Metalizing';
  plainBeadSkuId?: string; // Links coated finished SKU back to uncoloured plain bead SKU
  allowedSellingUOMs: SellingUOM[];
  kgToBunchRatio?: number; // e.g. 1 bunch = 0.085 kg (approx 11.76 bunches per kg)
  defaultRatePerUOM: {
    unit: SellingUOM;
    rate: number; // in INR
  };
  rateHistory?: {
    date: string;
    rate: number;
    unit: SellingUOM;
  }[];
  active: boolean;
  minBufferStockKg?: number;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: 'Polymer' | 'Essence' | 'Chemical' | 'Coating' | 'Packing' | 'Thread';
  unit: 'kg' | 'litre' | 'bag' | 'roll' | 'piece';
  applicableUnit: ManufacturingUnit;
  currentStock: number;
  reorderLevel: number;
  costPerUnit: number;
  isSampleEditable?: boolean;
}

export type MovementType =
  | 'Purchase'
  | 'Production_In'
  | 'Consumption'
  | 'Transfer_Out'
  | 'Transfer_In'
  | 'Sent_Karigar'
  | 'Received_Karigar'
  | 'Sale_Dispatch'
  | 'Return'
  | 'Damage'
  | 'Internal_Use'
  | 'Physical_Adjustment'
  | 'Adjustment'
  | 'Reversal';

export interface StockMovement {
  id: string;
  timestamp: string; // ISO String
  itemId: string; // SKU ID or Raw Material ID
  itemName: string;
  itemType: 'Raw' | 'Plain' | 'Coated' | 'Finished';
  locationUnit: ManufacturingUnit;
  stage: MaterialStage;
  qty: number; // positive for additions, negative for deductions
  uom: 'kg' | 'bunch' | 'bag' | 'litre' | 'roll' | 'piece' | 'packet';
  movementType: MovementType;
  referenceId?: string; // batch ID, order ID, transfer ID, challan
  operatorName: string;
  notes?: string;
  reversed?: boolean;
}

export interface MouldingProductionEntry {
  id: string;
  date: string; // YYYY-MM-DD
  shift: 'Day' | 'Night';
  machineId: 'M1' | 'M2' | 'M3' | 'M4';
  mouldId: string;
  skuId: string;
  skuName: string;
  gppsUsedKg: number;
  goodBeadsKg: number;
  wasteKg: number;
  regrindReusedKg: number;
  bagsPacked: number; // 25-30kg bags
  yieldPct: number; // calculated: (goodBeadsKg / (gppsUsedKg + regrindReusedKg)) * 100
  operatorName: string;
  downtimeMinutes?: number;
  downtimeReason?: string;
  remarks?: string;
  timestamp: string;
}

export interface CoatingBatchEntry {
  id: string;
  date: string;
  shift: 'Day' | 'Night';
  unit: 'pearl' | 'metalizing';
  machineId: 'P1' | 'P2' | 'MZ1';
  inputPlainSkuId: string;
  inputPlainKg: number;
  materialsUsed: {
    materialId: string;
    materialName: string;
    qty: number;
    unit: string;
  }[];
  outputSkuId: string;
  outputSkuName: string;
  outputColour: BeadColour;
  outputKg: number;
  rejectsKg: number;
  operatorName: string;
  remarks?: string;
  timestamp: string;
}

export interface KarigarJobWork {
  id: string;
  karigarId: string;
  karigarName: string;
  sourceUnit: 'pearl' | 'metalizing';
  dateSent: string;
  coatedSkuId: string;
  coatedSkuName: string;
  qtySentKg: number;
  bunchesReceived: number;
  packetsReceived?: number;
  looseReturnedKg: number;
  wastageKg: number;
  labourRatePerBunch?: number;
  totalLabourAmount?: number;
  status: 'Pending' | 'Partially_Received' | 'Completed' | 'Overdue';
  daysOut: number;
  slipNo: string;
  receiptHistory: {
    receiptDate: string;
    bunches: number;
    looseKg: number;
    wasteKg: number;
    threadWeightAddedKg?: number;
    totalThreadedWeightKg?: number;
    kachchaBillNo?: string;
    kachchaBillAmount?: number;
    packetsReceived?: number;
    packagingMode?: 'bunches_per_packet' | 'kg_per_packet';
    packetSizeValue?: number;
    rawLotRef?: string;
    remarks?: string;
  }[];
}

export type PartyType = 'Customer' | 'Supplier' | 'Karigar';

export interface Party {
  id: string;
  name: string;
  type: PartyType;
  phone: string;
  whatsapp?: string;
  gstin?: string;
  address: string;
  state: string; // default Maharashtra
  stateCode: string; // '27' for Maharashtra
  creditLimit: number;
  outstandingBalance: number; // in INR (positive = receivables, negative = payables)
  source: 'Phone' | 'WhatsApp' | 'Walk-in' | 'Reference';
  active: boolean;
}

export interface SalesOrderItem {
  skuId: string;
  skuName: string;
  qty: number;
  uom: SellingUOM;
  rate: number;
  amount: number;
  stockAvailable: number;
  isShortage: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Waiting_for_stock'
  | 'Ready'
  | 'Partially_dispatched'
  | 'Dispatched'
  | 'Cancelled';

export interface SalesOrder {
  id: string;
  orderNo: string;
  date: string;
  partyId: string;
  partyName: string;
  items: SalesOrderItem[];
  subtotal: number;
  promisedDate: string;
  status: OrderStatus;
  notes?: string;
  creditOverrideReason?: string;
  dispatches: {
    dispatchId: string;
    date: string;
    vehicleNo: string;
    transporterName?: string;
    packets?: number;
    items: { skuId: string; qty: number; uom: SellingUOM; packets?: number }[];
    partyName?: string;
    invoiced?: boolean;
    invoiceId?: string;
    invoiceType?: InvoiceType;
  }[];
}

export type InvoiceType = 'GST_Tax_Invoice' | 'Kachcha_Bill';

export interface InvoiceItem {
  skuId: string;
  skuName: string;
  hsnCode: string;
  qty: number;
  uom: SellingUOM;
  rate: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  type: InvoiceType;
  date: string;
  orderId?: string;
  partyId: string;
  partyName: string;
  partyGstin?: string;
  partyAddress: string;
  partyState: string;
  items: InvoiceItem[];
  taxableSubtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  roundOff: number;
  grandTotal: number;
  eWayBillNo?: string;
  paidAmount: number;
  paymentStatus: 'Unpaid' | 'Partially_Paid' | 'Paid';
  whatsappShareText?: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNo: string;
  date: string;
  partyId: string;
  partyName: string;
  amount: number;
  mode: 'Cash' | 'UPI' | 'Bank_Transfer' | 'Cheque';
  referenceNo?: string; // UTR or Cheque no
  chequeStatus?: 'Received' | 'Deposited' | 'Cleared' | 'Bounced';
  allocatedInvoiceIds: string[];
  notes?: string;
}

export type ExpenseCategory =
  | 'Electricity'
  | 'Labour'
  | 'Salary'
  | 'Transport'
  | 'Packing'
  | 'Machine_Repair'
  | 'Rent'
  | 'Raw_Material'
  | 'Other';

export interface ExpenseRecord {
  id: string;
  date: string;
  category: ExpenseCategory;
  unit: ManufacturingUnit | 'Common';
  amount: number;
  description: string;
  paidTo: string;
  mode: 'Cash' | 'Bank_Transfer' | 'UPI';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'REVERSE' | 'ADJUST';
  entityType: string;
  entityId: string;
  description: string;
  oldValue?: string;
  newValue?: string;
}

export interface OfflineOutboxItem {
  id: string; // client UUID
  timestamp: string;
  actionType: 'PRODUCTION_ENTRY' | 'STOCK_TRANSFER' | 'KARIGAR_SEND' | 'KARIGAR_RECEIVE' | 'DISPATCH';
  payload: any;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
}

export interface MouldingTask {
  id: string;
  adminId: string;
  assignedOperatorId: string;
  assignedOperatorName: string;
  machineId: 'M1' | 'M2';
  rawMaterialId: string;
  rawMaterialName: string;
  targetSkuId: string;
  targetSkuName: string;
  rawAllocatedKg: number;
  pieceRatePerKg: number; // e.g. ₹3.00 per kg of good moulded beads
  status: 'Assigned' | 'In_Progress' | 'Completed';
  assignedDate: string;
  completedAt?: string;
  notes?: string;
}

export interface OperatorMouldingSession {
  id: string;
  taskId?: string;
  operatorId: string;
  operatorName: string;
  machineId: 'M1' | 'M2';
  rawMaterialId: string;
  rawMaterialName: string;
  targetSkuId: string;
  targetSkuName: string;
  rawMaterialUsedKg: number;
  wasteGeneratedKg: number;
  mouldedBeadsKg: number;
  pieceRatePerKg: number;
  salaryEarned: number; // mouldedBeadsKg * pieceRatePerKg
  yieldPct: number;
  bagsPacked: number;
  status: 'Submitted' | 'Verified';
  timestamp: string;
  postActionTaken?: 'Direct_Sale' | 'Move_To_Threading' | 'Waste_Recycled' | 'Stored_In_Moulding';
}

export interface FactoryNotification {
  id: string;
  timestamp: string;
  type: 'Task_Completed' | 'Low_Stock' | 'Karigar_Overdue' | 'operator_moulding_completed' | string;
  operatorName?: string;
  machineId?: 'M1' | 'M2' | string;
  summary?: string;
  title?: string;
  message?: string;
  mouldedKg?: number;
  wasteKg?: number;
  salaryEarned?: number;
  read: boolean;
  meta?: {
    operatorName?: string;
    machineId?: string;
    mouldedKg?: number;
    wasteKg?: number;
    salaryEarned?: number;
    sessionId?: string;
  };
}

export interface ProductionProgram {
  id: string;
  programNo: string; // e.g. "PRG-26-001"
  date: string;
  machineId: 'M1' | 'M2' | 'P1' | 'P2' | 'MZ1';
  operatorId: string;
  operatorName: string;
  targetSkuId: string;
  targetSkuName: string;
  processType: 'Moulding' | 'Pearl' | 'Metalizing';
  rawLotName: string; // "Offer" / Lot identity
  rawAllocatedKg: number;
  targetPackets: number;
  packetsCompleted: number;
  piecesPerPacket: number; // e.g. 10 bunches per packet or 1.0 kg per packet
  packagingUnit: 'bunches_per_packet' | 'kg_per_packet';
  status: 'Scheduled' | 'Running' | 'Completed';
  liveCycleSeconds?: number;
  notes?: string;
}
