import {
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
  UserPersona,
  MouldingTask,
  OperatorMouldingSession,
  FactoryNotification,
  ProductionProgram
} from '../types';

export const DEMO_USERS: UserPersona[] = [
  {
    id: 'user-admin',
    name: 'Rajesh Shah (Owner / Admin)',
    role: 'admin',
    avatar: '👑'
  },
  {
    id: 'user-mgr-mould',
    name: 'Dinesh Yadav (Moulding Manager)',
    role: 'unit_manager',
    unit: 'moulding',
    avatar: '⚙️'
  },
  {
    id: 'user-mgr-pearl',
    name: 'Santosh Maurya (Pearl Manager)',
    role: 'unit_manager',
    unit: 'pearl',
    avatar: '🌸'
  },
  {
    id: 'user-mgr-metal',
    name: 'Imran Khan (Metalizing Manager)',
    role: 'unit_manager',
    unit: 'metalizing',
    avatar: '✨'
  },
  {
    id: 'user-staff-m1',
    name: 'Pawan Kumar (Operator M1)',
    role: 'staff',
    unit: 'moulding',
    assignedMachine: 'M1',
    avatar: '🔧'
  },
  {
    id: 'user-staff-m2',
    name: 'Raju Vishwakarma (Operator M2)',
    role: 'staff',
    unit: 'moulding',
    assignedMachine: 'M2',
    avatar: '🔧'
  },
  {
    id: 'user-staff-p1',
    name: 'Ganesh Patil (Operator P1)',
    role: 'staff',
    unit: 'pearl',
    assignedMachine: 'P1',
    avatar: '🎨'
  }
];

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    id: 'rm-gpps-black',
    name: 'Virgin GPPS Black Granules (for Black Beads)',
    category: 'Polymer',
    unit: 'kg',
    applicableUnit: 'moulding',
    currentStock: 2500,
    reorderLevel: 800,
    costPerUnit: 115,
    isSampleEditable: true
  },
  {
    id: 'rm-gpps-white',
    name: 'Virgin GPPS White Granules (for White Beads)',
    category: 'Polymer',
    unit: 'kg',
    applicableUnit: 'moulding',
    currentStock: 3200,
    reorderLevel: 1000,
    costPerUnit: 118,
    isSampleEditable: true
  },
  {
    id: 'rm-gpps-regrind',
    name: 'Recycled GPPS Regrind (Factory Waste Re-used)',
    category: 'Polymer',
    unit: 'kg',
    applicableUnit: 'moulding',
    currentStock: 480,
    reorderLevel: 200,
    costPerUnit: 45,
    isSampleEditable: true
  },
  {
    id: 'rm-gpps-sr',
    name: 'GPPS Granules (Shalimar Heavy SR)',
    category: 'Polymer',
    unit: 'kg',
    applicableUnit: 'moulding',
    currentStock: 3450,
    reorderLevel: 1000,
    costPerUnit: 118,
    isSampleEditable: true
  },
  {
    id: 'rm-gpps-tr',
    name: 'GPPS Granules (Treemurti Light TR)',
    category: 'Polymer',
    unit: 'kg',
    applicableUnit: 'moulding',
    currentStock: 2800,
    reorderLevel: 800,
    costPerUnit: 112,
    isSampleEditable: true
  },
  {
    id: 'rm-pearl-essence',
    name: 'Pearl Essence Grade A',
    category: 'Essence',
    unit: 'litre',
    applicableUnit: 'pearl',
    currentStock: 145,
    reorderLevel: 50,
    costPerUnit: 850,
    isSampleEditable: true
  },
  {
    id: 'rm-lacquer',
    name: 'High-Gloss Clear Lacquer',
    category: 'Chemical',
    unit: 'litre',
    applicableUnit: 'pearl',
    currentStock: 320,
    reorderLevel: 100,
    costPerUnit: 340,
    isSampleEditable: true
  },
  {
    id: 'rm-al-wire',
    name: 'Aluminium Wire 99.9% Purity',
    category: 'Coating',
    unit: 'kg',
    applicableUnit: 'metalizing',
    currentStock: 48,
    reorderLevel: 25,
    costPerUnit: 480,
    isSampleEditable: true
  },
  {
    id: 'rm-base-coat',
    name: 'Vacuum Primer Base Coat',
    category: 'Coating',
    unit: 'litre',
    applicableUnit: 'metalizing',
    currentStock: 110,
    reorderLevel: 40,
    costPerUnit: 520,
    isSampleEditable: true
  },
  {
    id: 'rm-top-coat',
    name: 'Protective UV Top Coat',
    category: 'Coating',
    unit: 'litre',
    applicableUnit: 'metalizing',
    currentStock: 85,
    reorderLevel: 30,
    costPerUnit: 560,
    isSampleEditable: true
  },
  {
    id: 'rm-bags-25kg',
    name: 'HDPE Woven Packing Bag (25-30kg capacity)',
    category: 'Packing',
    unit: 'piece',
    applicableUnit: 'moulding',
    currentStock: 1850,
    reorderLevel: 500,
    costPerUnit: 18,
    isSampleEditable: true
  },
  {
    id: 'rm-thread-nylon',
    name: 'High-Tensile Thread Roll (for bunching)',
    category: 'Thread',
    unit: 'roll',
    applicableUnit: 'threading',
    currentStock: 220,
    reorderLevel: 60,
    costPerUnit: 95,
    isSampleEditable: true
  }
];

// Plain bead SKUs made in Moulding (uncoloured)
export const PLAIN_BEAD_SKUS: ProductSKU[] = [
  {
    id: 'sku-plain-3r-semi-sr',
    code: 'PL-3R-SEMI-SR',
    name: '3MM Round Plain Bead - Semi (SR)',
    shape: 'Round',
    size_mm: 3,
    material: 'Semi',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 165 },
    active: true,
    minBufferStockKg: 200
  },
  {
    id: 'sku-plain-3r-semi-tr',
    code: 'PL-3R-SEMI-TR',
    name: '3MM Round Plain Bead - Semi (TR)',
    shape: 'Round',
    size_mm: 3,
    material: 'Semi',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 155 },
    active: true,
    minBufferStockKg: 150
  },
  {
    id: 'sku-plain-3r-super-tr',
    code: 'PL-3R-SUP-TR',
    name: '3MM Round Plain Bead - Super (TR)',
    shape: 'Round',
    size_mm: 3,
    material: 'Super',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 160 },
    active: true
  },
  {
    id: 'sku-plain-4r-super-tr',
    code: 'PL-4R-SUP-TR',
    name: '4MM Round Plain Bead - Super (TR)',
    shape: 'Round',
    size_mm: 4,
    material: 'Super',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 158 },
    active: true
  },
  {
    id: 'sku-plain-5r-semi-sr',
    code: 'PL-5R-SEMI-SR',
    name: '5MM Round Plain Bead - Semi (SR)',
    shape: 'Round',
    size_mm: 5,
    material: 'Semi',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 162 },
    active: true
  },
  {
    id: 'sku-plain-6r-super-tr',
    code: 'PL-6R-SUP-TR',
    name: '6MM Round Plain Bead - Super (TR)',
    shape: 'Round',
    size_mm: 6,
    material: 'Super',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 150 },
    active: true
  },
  {
    id: 'sku-plain-8r-sl-sr',
    code: 'PL-8R-SL-SR',
    name: '8MM Round Plain Bead - SL (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'SL',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 170 },
    active: true
  },
  {
    id: 'sku-plain-8r-super-sr',
    code: 'PL-8R-SUP-SR',
    name: '8MM Round Plain Bead - Super (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'Super',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 168 },
    active: true
  },
  {
    id: 'sku-plain-8r-crylo-tr',
    code: 'PL-8R-CRY-TR',
    name: '8MM Round Plain Bead - Crylo (TR)',
    shape: 'Round',
    size_mm: 8,
    material: 'Crylo',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 165 },
    active: true
  },
  {
    id: 'sku-plain-8r-ps-sr',
    code: 'PL-8R-PS-SR',
    name: '8MM Round Plain Bead - PS (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'PS',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 172 },
    active: true
  },
  {
    id: 'sku-plain-8r-db-sr',
    code: 'PL-8R-DB-SR',
    name: '8MM Round Plain Bead - DB (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'DB',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 175 },
    active: true
  },
  {
    id: 'sku-plain-10r-crylo-sr',
    code: 'PL-10R-CRY-SR',
    name: '10MM Round Plain Bead - Crylo (SR)',
    shape: 'Round',
    size_mm: 10,
    material: 'Crylo',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 180 },
    active: true
  },
  {
    id: 'sku-plain-8hr-crylo-sr',
    code: 'PL-8HR-CRY-SR',
    name: '8MM Half Round Plain Bead - Crylo (SR)',
    shape: 'Half Round',
    size_mm: 8,
    material: 'Crylo',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 178 },
    active: true
  },
  {
    id: 'sku-plain-8hr-semi-sr',
    code: 'PL-8HR-SEMI-SR',
    name: '8MM Half Round Plain Bead - Semi (SR)',
    shape: 'Half Round',
    size_mm: 8,
    material: 'Semi',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 174 },
    active: true
  },
  {
    id: 'sku-plain-9dr-semi-tr',
    code: 'PL-9DR-SEMI-TR',
    name: '9MM Drop Plain Bead - Semi (TR)',
    shape: 'Drop',
    size_mm: 9,
    material: 'Semi',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 185 },
    active: true
  },
  {
    id: 'sku-plain-11dr-semi-tr',
    code: 'PL-11DR-SEMI-TR',
    name: '11MM Drop Plain Bead - Semi (TR)',
    shape: 'Drop',
    size_mm: 11,
    material: 'Semi',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 195 },
    active: true
  },
  {
    id: 'sku-plain-3mg-semi-sr',
    code: 'PL-3MG-SEMI-SR',
    name: '3MM Munga Plain Bead - Semi (SR)',
    shape: 'Munga',
    size_mm: 3,
    material: 'Semi',
    grade: 'SR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 190 },
    active: true
  },
  {
    id: 'sku-plain-10sj-semi-tr',
    code: 'PL-10SJ-SEMI-TR',
    name: '10MM Sujni Plain Bead - Semi (TR)',
    shape: 'Sujni',
    size_mm: 10,
    material: 'Semi',
    grade: 'TR',
    colour: 'Plain',
    process: 'Moulding',
    allowedSellingUOMs: ['KG'],
    defaultRatePerUOM: { unit: 'KG', rate: 210 },
    active: true
  }
];

// All 24 Finished Brochure Products
export const BROCHURE_PRODUCTS: ProductSKU[] = [
  {
    id: 'sku-fin-1',
    code: 'FP-3R-OFFW-SR',
    name: '3MM Round Off White - Semi (SR)',
    shape: 'Round',
    size_mm: 3,
    material: 'Semi',
    grade: 'SR',
    colour: 'Off White',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-3r-semi-sr',
    allowedSellingUOMs: ['Bunch', 'KG'],
    kgToBunchRatio: 0.082, // ~12.2 bunches per kg
    defaultRatePerUOM: { unit: 'Bunch', rate: 26 },
    rateHistory: [
      { date: '2026-08-01', rate: 24, unit: 'Bunch' },
      { date: '2026-09-15', rate: 26, unit: 'Bunch' }
    ],
    active: true
  },
  {
    id: 'sku-fin-2',
    code: 'FP-3R-OFFW-TR',
    name: '3MM Round Off White - Semi (TR)',
    shape: 'Round',
    size_mm: 3,
    material: 'Semi',
    grade: 'TR',
    colour: 'Off White',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-3r-semi-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.076,
    defaultRatePerUOM: { unit: 'Bunch', rate: 24 },
    active: true
  },
  {
    id: 'sku-fin-3',
    code: 'FP-3R-WHT-TR',
    name: '3MM Round White - Super (TR)',
    shape: 'Round',
    size_mm: 3,
    material: 'Super',
    grade: 'TR',
    colour: 'White',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-3r-super-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.078,
    defaultRatePerUOM: { unit: 'Bunch', rate: 25 },
    active: true
  },
  {
    id: 'sku-fin-4',
    code: 'FP-4R-ORG-TR',
    name: '4MM Round Orange - Super (TR)',
    shape: 'Round',
    size_mm: 4,
    material: 'Super',
    grade: 'TR',
    colour: 'Orange',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-4r-super-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.115,
    defaultRatePerUOM: { unit: 'Bunch', rate: 32 },
    active: true
  },
  {
    id: 'sku-fin-5',
    code: 'FP-5R-FRZ-SR',
    name: '5MM Round Ferozi - Semi (SR)',
    shape: 'Round',
    size_mm: 5,
    material: 'Semi',
    grade: 'SR',
    colour: 'Ferozi',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-5r-semi-sr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.165,
    defaultRatePerUOM: { unit: 'Bunch', rate: 42 },
    active: true
  },
  {
    id: 'sku-fin-6',
    code: 'FP-5R-ORG-SR',
    name: '5MM Round Orange - Semi (SR)',
    shape: 'Round',
    size_mm: 5,
    material: 'Semi',
    grade: 'SR',
    colour: 'Orange',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-5r-semi-sr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.165,
    defaultRatePerUOM: { unit: 'Bunch', rate: 42 },
    active: true
  },
  {
    id: 'sku-fin-7',
    code: 'FP-6R-PCH-TR',
    name: '6MM Round Peach - Super (TR)',
    shape: 'Round',
    size_mm: 6,
    material: 'Super',
    grade: 'TR',
    colour: 'Peach',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-6r-super-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.23,
    defaultRatePerUOM: { unit: 'Bunch', rate: 54 },
    active: true
  },
  {
    id: 'sku-fin-8',
    code: 'FP-6R-PNK-TR',
    name: '6MM Round Pink - Super (TR)',
    shape: 'Round',
    size_mm: 6,
    material: 'Super',
    grade: 'TR',
    colour: 'Pink',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-6r-super-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.23,
    defaultRatePerUOM: { unit: 'Bunch', rate: 54 },
    active: true
  },
  {
    id: 'sku-fin-9',
    code: 'FP-8R-ART-SR',
    name: '8MM Round Artery - SL (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'SL',
    grade: 'SR',
    colour: 'Artery',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8r-sl-sr',
    allowedSellingUOMs: ['Bunch', 'KG'],
    kgToBunchRatio: 0.38,
    defaultRatePerUOM: { unit: 'Bunch', rate: 82 },
    active: true
  },
  {
    id: 'sku-fin-10',
    code: 'FP-8R-LCD-SR',
    name: '8MM Round LCD - Super (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'Super',
    grade: 'SR',
    colour: 'LCD',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8r-super-sr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.38,
    defaultRatePerUOM: { unit: 'Bunch', rate: 85 },
    active: true
  },
  {
    id: 'sku-fin-11',
    code: 'FP-8R-MAG-TR',
    name: '8MM Round Magenta - Crylo (TR)',
    shape: 'Round',
    size_mm: 8,
    material: 'Crylo',
    grade: 'TR',
    colour: 'Magenta',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8r-crylo-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.34,
    defaultRatePerUOM: { unit: 'Bunch', rate: 78 },
    active: true
  },
  {
    id: 'sku-fin-12',
    code: 'FP-8R-MAR-TR',
    name: '8MM Round Maroon - Crylo (TR)',
    shape: 'Round',
    size_mm: 8,
    material: 'Crylo',
    grade: 'TR',
    colour: 'Maroon',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8r-crylo-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.34,
    defaultRatePerUOM: { unit: 'Bunch', rate: 78 },
    active: true
  },
  {
    id: 'sku-fin-13',
    code: 'FP-8R-RED-TR',
    name: '8MM Round Red - Crylo (TR)',
    shape: 'Round',
    size_mm: 8,
    material: 'Crylo',
    grade: 'TR',
    colour: 'Red',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8r-crylo-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.34,
    defaultRatePerUOM: { unit: 'Bunch', rate: 78 },
    active: true
  },
  {
    id: 'sku-fin-14',
    code: 'FP-8R-UNQ-SR',
    name: '8MM Round Unique - PS (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'PS',
    grade: 'SR',
    colour: 'Unique',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8r-ps-sr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.39,
    defaultRatePerUOM: { unit: 'Bunch', rate: 88 },
    active: true
  },
  {
    id: 'sku-fin-15',
    code: 'FP-8R-YEL-SR',
    name: '8MM Round Yellow - DB (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'DB',
    grade: 'SR',
    colour: 'Yellow',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8r-db-sr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.4,
    defaultRatePerUOM: { unit: 'Bunch', rate: 90 },
    active: true
  },
  {
    id: 'sku-fin-16',
    code: 'FP-10R-BPK-SR',
    name: '10MM Round Baby Pink - Crylo (SR)',
    shape: 'Round',
    size_mm: 10,
    material: 'Crylo',
    grade: 'SR',
    colour: 'Baby Pink',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-10r-crylo-sr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.65,
    defaultRatePerUOM: { unit: 'Bunch', rate: 135 },
    active: true
  },
  {
    id: 'sku-fin-17',
    code: 'FP-8HR-RED-SR',
    name: '8MM Half Round Red - Crylo (SR)',
    shape: 'Half Round',
    size_mm: 8,
    material: 'Crylo',
    grade: 'SR',
    colour: 'Red',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8hr-crylo-sr',
    allowedSellingUOMs: ['Bunch', 'KG'],
    kgToBunchRatio: 0.21,
    defaultRatePerUOM: { unit: 'Bunch', rate: 58 },
    active: true
  },
  {
    id: 'sku-fin-18',
    code: 'FP-8HR-WHT-SR',
    name: '8MM Half Round White - Semi (SR)',
    shape: 'Half Round',
    size_mm: 8,
    material: 'Semi',
    grade: 'SR',
    colour: 'White',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-8hr-semi-sr',
    allowedSellingUOMs: ['Bunch', 'KG'],
    kgToBunchRatio: 0.22,
    defaultRatePerUOM: { unit: 'Bunch', rate: 60 },
    active: true
  },
  {
    id: 'sku-fin-19',
    code: 'FP-9DR-BPK-TR',
    name: '9MM Drop Baby Pink - Semi (TR)',
    shape: 'Drop',
    size_mm: 9,
    material: 'Semi',
    grade: 'TR',
    colour: 'Baby Pink',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-9dr-semi-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.32,
    defaultRatePerUOM: { unit: 'Bunch', rate: 75 },
    active: true
  },
  {
    id: 'sku-fin-20',
    code: 'FP-9DR-PST-TR',
    name: '9MM Drop Pista - Semi (TR)',
    shape: 'Drop',
    size_mm: 9,
    material: 'Semi',
    grade: 'TR',
    colour: 'Pista',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-9dr-semi-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.32,
    defaultRatePerUOM: { unit: 'Bunch', rate: 75 },
    active: true
  },
  {
    id: 'sku-fin-21',
    code: 'FP-11DR-OFFW-TR',
    name: '11MM Drop Off White - Semi (TR)',
    shape: 'Drop',
    size_mm: 11,
    material: 'Semi',
    grade: 'TR',
    colour: 'Off White',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-11dr-semi-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.48,
    defaultRatePerUOM: { unit: 'Bunch', rate: 110 },
    active: true
  },
  {
    id: 'sku-fin-22',
    code: 'FP-3MG-OFFW-SR',
    name: '3MM Munga Off White - Semi (SR)',
    shape: 'Munga',
    size_mm: 3,
    material: 'Semi',
    grade: 'SR',
    colour: 'Off White',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-3mg-semi-sr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.09,
    defaultRatePerUOM: { unit: 'Bunch', rate: 36 },
    active: true
  },
  {
    id: 'sku-fin-23',
    code: 'FP-10SJ-CRM-TR',
    name: '10MM Sujni Cream - Semi (TR)',
    shape: 'Sujni',
    size_mm: 10,
    material: 'Semi',
    grade: 'TR',
    colour: 'Cream',
    process: 'Pearl',
    plainBeadSkuId: 'sku-plain-10sj-semi-tr',
    allowedSellingUOMs: ['Bunch'],
    kgToBunchRatio: 0.52,
    defaultRatePerUOM: { unit: 'Bunch', rate: 125 },
    active: true
  },
  {
    id: 'sku-fin-24',
    code: 'FM-8R-GLD-SR',
    name: '8MM Round Gold Metallic - Super (SR)',
    shape: 'Round',
    size_mm: 8,
    material: 'Super',
    grade: 'SR',
    colour: 'Gold Metallic',
    process: 'Metalizing',
    plainBeadSkuId: 'sku-plain-8r-super-sr',
    allowedSellingUOMs: ['KG', 'Bunch'],
    kgToBunchRatio: 0.38,
    defaultRatePerUOM: { unit: 'KG', rate: 420 },
    active: true
  }
];

export const INITIAL_PARTIES: Party[] = [
  // Karigars (Job workers for threading)
  {
    id: 'party-karigar-1',
    name: 'Ramesh Bhai Threading (Anjurphata)',
    type: 'Karigar',
    phone: '+91 98201 44521',
    whatsapp: '919820144521',
    address: 'Gala 12, Anjurphata Industrial Area, Bhiwandi',
    state: 'Maharashtra',
    stateCode: '27',
    creditLimit: 0,
    outstandingBalance: 0,
    source: 'Reference',
    active: true
  },
  {
    id: 'party-karigar-2',
    name: 'Salim Embroidery & Threading Work',
    type: 'Karigar',
    phone: '+91 97654 32190',
    whatsapp: '919765432190',
    address: 'Shanti Nagar, Near Noor Masjid, Bhiwandi',
    state: 'Maharashtra',
    stateCode: '27',
    creditLimit: 0,
    outstandingBalance: 0,
    source: 'Walk-in',
    active: true
  },
  {
    id: 'party-karigar-3',
    name: 'Pooja Handicrafts Unit 2',
    type: 'Karigar',
    phone: '+91 99302 77144',
    whatsapp: '919930277144',
    address: 'Plot 44, Narpoli Road, Bhiwandi',
    state: 'Maharashtra',
    stateCode: '27',
    creditLimit: 0,
    outstandingBalance: 0,
    source: 'Reference',
    active: true
  },

  // Customers
  {
    id: 'party-cust-1',
    name: 'Shree Ganesh Bangles & Trimmings',
    type: 'Customer',
    phone: '+91 98250 11223',
    whatsapp: '919825011223',
    gstin: '24AACCG1122D1Z9',
    address: 'Shop 14, M.G. Market, Surat, Gujarat',
    state: 'Gujarat',
    stateCode: '24',
    creditLimit: 300000,
    outstandingBalance: 142500,
    source: 'Phone',
    active: true
  },
  {
    id: 'party-cust-2',
    name: 'Jai Ambe Ornaments & Raw Beads',
    type: 'Customer',
    phone: '+91 94140 88765',
    whatsapp: '919414088765',
    gstin: '08ABCPJ8876K1ZY',
    address: 'Johari Bazaar, Near Hawa Mahal, Jaipur, Rajasthan',
    state: 'Rajasthan',
    stateCode: '08',
    creditLimit: 250000,
    outstandingBalance: 88400,
    source: 'Reference',
    active: true
  },
  {
    id: 'party-cust-3',
    name: 'Royal Pearl House (Zaveri Bazaar)',
    type: 'Customer',
    phone: '+91 98200 44332',
    whatsapp: '919820044332',
    gstin: '27AABCR9911P1Z2',
    address: '2nd Floor, Motisha Lane, Zaveri Bazaar, Mumbai',
    state: 'Maharashtra',
    stateCode: '27',
    creditLimit: 500000,
    outstandingBalance: 215000,
    source: 'Walk-in',
    active: true
  },
  {
    id: 'party-cust-4',
    name: 'Shrinathji Beads & Novelties',
    type: 'Customer',
    phone: '+91 98110 55443',
    whatsapp: '919811055443',
    gstin: '07AAACS5544R1Z7',
    address: 'Sadar Bazaar, Main Road, Delhi',
    state: 'Delhi',
    stateCode: '07',
    creditLimit: 200000,
    outstandingBalance: 65000,
    source: 'Phone',
    active: true
  },
  {
    id: 'party-cust-5',
    name: 'Laxmi Garments Accessories',
    type: 'Customer',
    phone: '+91 98791 22334',
    whatsapp: '919879122334',
    gstin: '24AABCL2233M1Z6',
    address: 'Ghee Kanta Road, Ahmedabad, Gujarat',
    state: 'Gujarat',
    stateCode: '24',
    creditLimit: 150000,
    outstandingBalance: 162000, // Slightly over limit to demonstrate warning
    source: 'WhatsApp',
    active: true
  },
  {
    id: 'party-cust-6',
    name: 'Tirupati Fancy Store',
    type: 'Customer',
    phone: '+91 94401 99887',
    whatsapp: '919440199887',
    gstin: '36AAACT9988S1ZQ',
    address: 'General Bazaar, Secunderabad, Telangana',
    state: 'Telangana',
    stateCode: '36',
    creditLimit: 200000,
    outstandingBalance: 0,
    source: 'Reference',
    active: true
  },

  // Suppliers
  {
    id: 'party-supp-1',
    name: 'Supreme Petrochem Ltd (Polystyrene Polymers)',
    type: 'Supplier',
    phone: '+91 22 6709 8800',
    gstin: '27AAACS1000P1Z1',
    address: 'Solitaire Corporate Park, Andheri East, Mumbai',
    state: 'Maharashtra',
    stateCode: '27',
    creditLimit: 1500000,
    outstandingBalance: -420000, // We owe them
    source: 'Reference',
    active: true
  },
  {
    id: 'party-supp-2',
    name: 'Pearl Art Coatings & Chemicals',
    type: 'Supplier',
    phone: '+91 260 244 5566',
    gstin: '24AABCP2445C1Z3',
    address: 'GIDC Industrial Estate Phase 2, Vapi, Gujarat',
    state: 'Gujarat',
    stateCode: '24',
    creditLimit: 500000,
    outstandingBalance: -115000,
    source: 'Reference',
    active: true
  }
];

export const INITIAL_KARIGAR_WORK: KarigarJobWork[] = [
  {
    id: 'kw-101',
    slipNo: 'SLIP-2026-089',
    karigarId: 'party-karigar-1',
    karigarName: 'Ramesh Bhai Threading (Anjurphata)',
    sourceUnit: 'pearl',
    dateSent: '2026-10-04',
    coatedSkuId: 'sku-fin-1',
    coatedSkuName: '3MM Round Off White - Semi (SR)',
    qtySentKg: 120,
    bunchesReceived: 950,
    looseReturnedKg: 18.5,
    wastageKg: 3.2,
    labourRatePerBunch: 2.2,
    totalLabourAmount: 2090,
    status: 'Overdue', // 20 days out > 15 days threshold!
    daysOut: 20,
    receiptHistory: [
      {
        receiptDate: '2026-10-12',
        bunches: 500,
        looseKg: 10,
        wasteKg: 1.5,
        remarks: '1st partial lot received in good condition'
      },
      {
        receiptDate: '2026-10-18',
        bunches: 450,
        looseKg: 8.5,
        wasteKg: 1.7,
        remarks: '2nd partial lot. Remainder ~20kg pending with karigar'
      }
    ]
  },
  {
    id: 'kw-102',
    slipNo: 'SLIP-2026-094',
    karigarId: 'party-karigar-2',
    karigarName: 'Salim Embroidery & Threading Work',
    sourceUnit: 'pearl',
    dateSent: '2026-10-15',
    coatedSkuId: 'sku-fin-9',
    coatedSkuName: '8MM Round Artery - SL (SR)',
    qtySentKg: 85,
    bunchesReceived: 120,
    looseReturnedKg: 8,
    wastageKg: 1.5,
    labourRatePerBunch: 3.5,
    totalLabourAmount: 420,
    status: 'Pending',
    daysOut: 9,
    receiptHistory: [
      {
        receiptDate: '2026-10-21',
        bunches: 120,
        looseKg: 8,
        wasteKg: 1.5,
        remarks: 'First partial batch'
      }
    ]
  },
  {
    id: 'kw-103',
    slipNo: 'SLIP-2026-098',
    karigarId: 'party-karigar-3',
    karigarName: 'Pooja Handicrafts Unit 2',
    sourceUnit: 'metalizing',
    dateSent: '2026-10-18',
    coatedSkuId: 'sku-fin-24',
    coatedSkuName: '8MM Round Gold Metallic - Super (SR)',
    qtySentKg: 65,
    bunchesReceived: 0,
    looseReturnedKg: 0,
    wastageKg: 0,
    labourRatePerBunch: 4.0,
    totalLabourAmount: 0,
    status: 'Pending',
    daysOut: 6,
    receiptHistory: []
  }
];

export const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: 'ord-1001',
    orderNo: 'ORD-26-0412',
    date: '2026-10-20',
    partyId: 'party-cust-1',
    partyName: 'Shree Ganesh Bangles & Trimmings',
    items: [
      {
        skuId: 'sku-fin-1',
        skuName: '3MM Round Off White - Semi (SR)',
        qty: 1200,
        uom: 'Bunch',
        rate: 26,
        amount: 31200,
        stockAvailable: 1540,
        isShortage: false
      },
      {
        skuId: 'sku-fin-4',
        skuName: '4MM Round Orange - Super (TR)',
        qty: 600,
        uom: 'Bunch',
        rate: 32,
        amount: 19200,
        stockAvailable: 450, // Shortage!
        isShortage: true
      }
    ],
    subtotal: 50400,
    promisedDate: '2026-10-26',
    status: 'Waiting_for_stock',
    notes: 'Urgent for Diwali festive collection. Ready to take partial delivery.',
    dispatches: []
  },
  {
    id: 'ord-1002',
    orderNo: 'ORD-26-0409',
    date: '2026-10-17',
    partyId: 'party-cust-3',
    partyName: 'Royal Pearl House (Zaveri Bazaar)',
    items: [
      {
        skuId: 'sku-fin-10',
        skuName: '8MM Round LCD - Super (SR)',
        qty: 800,
        uom: 'Bunch',
        rate: 85,
        amount: 68000,
        stockAvailable: 920,
        isShortage: false
      },
      {
        skuId: 'sku-fin-24',
        skuName: '8MM Round Gold Metallic - Super (SR)',
        qty: 150,
        uom: 'KG',
        rate: 420,
        amount: 63000,
        stockAvailable: 185,
        isShortage: false
      }
    ],
    subtotal: 131000,
    promisedDate: '2026-10-22',
    status: 'Partially_dispatched',
    notes: 'Send via Bhiwandi-Mumbai regular tempo service',
    dispatches: [
      {
        dispatchId: 'dsp-8821',
        date: '2026-10-21',
        vehicleNo: 'MH-04-GF-4102',
        items: [
          { skuId: 'sku-fin-10', qty: 400, uom: 'Bunch' },
          { skuId: 'sku-fin-24', qty: 75, uom: 'KG' }
        ]
      }
    ]
  },
  {
    id: 'ord-1003',
    orderNo: 'ORD-26-0401',
    date: '2026-10-12',
    partyId: 'party-cust-2',
    partyName: 'Jai Ambe Ornaments & Raw Beads',
    items: [
      {
        skuId: 'sku-fin-19',
        skuName: '9MM Drop Baby Pink - Semi (TR)',
        qty: 500,
        uom: 'Bunch',
        rate: 75,
        amount: 37500,
        stockAvailable: 620,
        isShortage: false
      }
    ],
    subtotal: 37500,
    promisedDate: '2026-10-18',
    status: 'Dispatched',
    dispatches: [
      {
        dispatchId: 'dsp-8802',
        date: '2026-10-16',
        vehicleNo: 'RJ-14-EA-9912',
        items: [{ skuId: 'sku-fin-19', qty: 500, uom: 'Bunch' }]
      }
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-gst-2601',
    invoiceNo: 'MK/26-27/0142',
    type: 'GST_Tax_Invoice',
    date: '2026-10-21',
    orderId: 'ord-1002',
    partyId: 'party-cust-3',
    partyName: 'Royal Pearl House (Zaveri Bazaar)',
    partyGstin: '27AABCR9911P1Z2',
    partyAddress: '2nd Floor, Motisha Lane, Zaveri Bazaar, Mumbai',
    partyState: 'Maharashtra',
    items: [
      {
        skuId: 'sku-fin-10',
        skuName: '8MM Round LCD - Super (SR)',
        hsnCode: '39269099',
        qty: 400,
        uom: 'Bunch',
        rate: 85,
        taxableAmount: 34000,
        cgstRate: 9,
        cgstAmount: 3060,
        sgstRate: 9,
        sgstAmount: 3060,
        igstRate: 0,
        igstAmount: 0,
        totalAmount: 40120
      },
      {
        skuId: 'sku-fin-24',
        skuName: '8MM Round Gold Metallic - Super (SR)',
        hsnCode: '39269099',
        qty: 75,
        uom: 'KG',
        rate: 420,
        taxableAmount: 31500,
        cgstRate: 9,
        cgstAmount: 2835,
        sgstRate: 9,
        sgstAmount: 2835,
        igstRate: 0,
        igstAmount: 0,
        totalAmount: 37170
      }
    ],
    taxableSubtotal: 65500,
    totalCgst: 5895,
    totalSgst: 5895,
    totalIgst: 0,
    roundOff: 0,
    grandTotal: 77290,
    eWayBillNo: '241088492019',
    paidAmount: 50000,
    paymentStatus: 'Partially_Paid',
    whatsappShareText: 'Namaste Royal Pearl House, your GST Tax Invoice MK/26-27/0142 for ₹77,290 is dispatched via tempo MH-04-GF-4102. Balance pending: ₹27,290. Regards, MK Plastics Bhiwandi.'
  },
  {
    id: 'inv-kb-2602',
    invoiceNo: 'EST/26-27/0088',
    type: 'Kachcha_Bill',
    date: '2026-10-16',
    orderId: 'ord-1003',
    partyId: 'party-cust-2',
    partyName: 'Jai Ambe Ornaments & Raw Beads',
    partyAddress: 'Johari Bazaar, Near Hawa Mahal, Jaipur, Rajasthan',
    partyState: 'Rajasthan',
    items: [
      {
        skuId: 'sku-fin-19',
        skuName: '9MM Drop Baby Pink - Semi (TR)',
        hsnCode: '39269099',
        qty: 500,
        uom: 'Bunch',
        rate: 75,
        taxableAmount: 37500,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 0,
        igstAmount: 0,
        totalAmount: 37500
      }
    ],
    taxableSubtotal: 37500,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 0,
    roundOff: 0,
    grandTotal: 37500,
    paidAmount: 37500,
    paymentStatus: 'Paid',
    whatsappShareText: 'Namaste Jai Ambe Ornaments, estimate slip EST/26-27/0088 for ₹37,500 has been paid in full via RTGS. Thank you for your business. MK Plastics.'
  }
];

export const INITIAL_PAYMENTS: PaymentReceipt[] = [
  {
    id: 'pay-201',
    receiptNo: 'RCP-26-091',
    date: '2026-10-22',
    partyId: 'party-cust-3',
    partyName: 'Royal Pearl House (Zaveri Bazaar)',
    amount: 50000,
    mode: 'Bank_Transfer',
    referenceNo: 'HDFC-RTGS-99014251',
    allocatedInvoiceIds: ['inv-gst-2601'],
    notes: 'Advance part payment received against invoice MK/26-27/0142'
  },
  {
    id: 'pay-202',
    receiptNo: 'RCP-26-085',
    date: '2026-10-17',
    partyId: 'party-cust-2',
    partyName: 'Jai Ambe Ornaments & Raw Beads',
    amount: 37500,
    mode: 'UPI',
    referenceNo: 'UPI-261017894212',
    allocatedInvoiceIds: ['inv-kb-2602'],
    notes: 'Full payment on dispatch confirmation'
  },
  {
    id: 'pay-203',
    receiptNo: 'RCP-26-079',
    date: '2026-10-11',
    partyId: 'party-cust-1',
    partyName: 'Shree Ganesh Bangles & Trimmings',
    amount: 100000,
    mode: 'Cheque',
    referenceNo: 'CHQ-004512',
    chequeStatus: 'Cleared',
    allocatedInvoiceIds: [],
    notes: 'Account on-account clearance payment'
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-301',
    date: '2026-10-05',
    category: 'Electricity',
    unit: 'moulding',
    amount: 58400,
    description: 'MSEDCL Industrial Power Bill for Moulding Unit (4 machines)',
    paidTo: 'Maharashtra State Electricity Distribution Co.',
    mode: 'Bank_Transfer'
  },
  {
    id: 'exp-302',
    date: '2026-10-07',
    category: 'Labour',
    unit: 'moulding',
    amount: 32000,
    description: 'Fortnightly operator and helper wages (Shifts Day & Night)',
    paidTo: 'Shop Floor Contract Labour',
    mode: 'Cash'
  },
  {
    id: 'exp-303',
    date: '2026-10-10',
    category: 'Machine_Repair',
    unit: 'moulding',
    amount: 8500,
    description: 'Machine M2 heating band replacement & hydraulic valve overhaul',
    paidTo: 'Omkar Hydraulics Bhiwandi',
    mode: 'UPI'
  },
  {
    id: 'exp-304',
    date: '2026-10-12',
    category: 'Electricity',
    unit: 'pearl',
    amount: 21500,
    description: 'Power bill for Pearl coating barrels & dryer units',
    paidTo: 'MSEDCL',
    mode: 'Bank_Transfer'
  },
  {
    id: 'exp-305',
    date: '2026-10-14',
    category: 'Rent',
    unit: 'Common',
    amount: 45000,
    description: 'Factory Gala Monthly Rent (Units 1-3 & Storage Shed)',
    paidTo: 'Bhiwandi Industrial Estate Trust',
    mode: 'Bank_Transfer'
  },
  {
    id: 'exp-306',
    date: '2026-10-16',
    category: 'Transport',
    unit: 'threading',
    amount: 4200,
    description: 'Tempo trips transporting coated beads to karigars & bringing bunches back',
    paidTo: 'Shree Krishna Logistics',
    mode: 'Cash'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-10-24T09:15:00Z',
    userId: 'user-admin',
    userName: 'Rajesh Shah',
    userRole: 'admin',
    action: 'CREATE',
    entityType: 'RawMaterial',
    entityId: 'rm-gpps-sr',
    description: 'Initial seed stock verified for GPPS Granules SR at 3,450 kg'
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-24T08:45:00Z',
    userId: 'user-mgr-mould',
    userName: 'Dinesh Yadav',
    userRole: 'unit_manager',
    action: 'CREATE',
    entityType: 'StockTransfer',
    entityId: 'st-0941',
    description: 'Transferred 350 kg 3MM Round Semi SR from Moulding to Pearl unit'
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-23T17:30:00Z',
    userId: 'user-mgr-pearl',
    userName: 'Santosh Maurya',
    userRole: 'unit_manager',
    action: 'CREATE',
    entityType: 'KarigarWork',
    entityId: 'kw-101',
    description: 'Recorded partial return of 450 bunches + 8.5kg loose from Ramesh Bhai'
  }
];

// 30 Days of realistic stock ledger movements ensuring live balances are mathematically sound
export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  // 1. Raw Materials Purchase Inward
  {
    id: 'mov-1',
    timestamp: '2026-09-25T10:00:00Z',
    itemId: 'rm-gpps-sr',
    itemName: 'GPPS Granules (Shalimar Heavy SR)',
    itemType: 'Raw',
    locationUnit: 'moulding',
    stage: 'raw',
    qty: 5000,
    uom: 'kg',
    movementType: 'Purchase',
    referenceId: 'PO-26-880',
    operatorName: 'Dinesh Yadav',
    notes: 'Received from Supreme Petrochem Ltd via 16-wheeler trailer'
  },
  {
    id: 'mov-2',
    timestamp: '2026-09-26T11:00:00Z',
    itemId: 'rm-gpps-tr',
    itemName: 'GPPS Granules (Treemurti Light TR)',
    itemType: 'Raw',
    locationUnit: 'moulding',
    stage: 'raw',
    qty: 4000,
    uom: 'kg',
    movementType: 'Purchase',
    referenceId: 'PO-26-881',
    operatorName: 'Dinesh Yadav'
  },
  {
    id: 'mov-3',
    timestamp: '2026-09-28T09:30:00Z',
    itemId: 'rm-pearl-essence',
    itemName: 'Pearl Essence Grade A',
    itemType: 'Raw',
    locationUnit: 'pearl',
    stage: 'raw',
    qty: 200,
    uom: 'litre',
    movementType: 'Purchase',
    referenceId: 'PO-26-884',
    operatorName: 'Santosh Maurya'
  },

  // 2. Moulding Production (Consumption of GPPS -> Output of Plain Beads)
  {
    id: 'mov-4',
    timestamp: '2026-10-01T14:00:00Z',
    itemId: 'rm-gpps-sr',
    itemName: 'GPPS Granules (Shalimar Heavy SR)',
    itemType: 'Raw',
    locationUnit: 'moulding',
    stage: 'raw',
    qty: -850,
    uom: 'kg',
    movementType: 'Consumption',
    referenceId: 'MB-26-101',
    operatorName: 'Pawan Kumar'
  },
  {
    id: 'mov-5',
    timestamp: '2026-10-01T14:00:00Z',
    itemId: 'sku-plain-3r-semi-sr',
    itemName: '3MM Round Plain Bead - Semi (SR)',
    itemType: 'Plain',
    locationUnit: 'moulding',
    stage: 'plain',
    qty: 820,
    uom: 'kg',
    movementType: 'Production_In',
    referenceId: 'MB-26-101',
    operatorName: 'Pawan Kumar',
    notes: 'Shift Day M1. Good beads packed in 33 bags. 30kg waste collected for regrind.'
  },
  {
    id: 'mov-6',
    timestamp: '2026-10-02T16:00:00Z',
    itemId: 'rm-gpps-tr',
    itemName: 'GPPS Granules (Treemurti Light TR)',
    itemType: 'Raw',
    locationUnit: 'moulding',
    stage: 'raw',
    qty: -700,
    uom: 'kg',
    movementType: 'Consumption',
    referenceId: 'MB-26-102',
    operatorName: 'Raju Vishwakarma'
  },
  {
    id: 'mov-7',
    timestamp: '2026-10-02T16:00:00Z',
    itemId: 'sku-plain-6r-super-tr',
    itemName: '6MM Round Plain Bead - Super (TR)',
    itemType: 'Plain',
    locationUnit: 'moulding',
    stage: 'plain',
    qty: 678,
    uom: 'kg',
    movementType: 'Production_In',
    referenceId: 'MB-26-102',
    operatorName: 'Raju Vishwakarma'
  },

  // 3. Unit Transfer (Moulding -> Pearl: stock movement, no GST challan)
  {
    id: 'mov-8',
    timestamp: '2026-10-03T10:30:00Z',
    itemId: 'sku-plain-3r-semi-sr',
    itemName: '3MM Round Plain Bead - Semi (SR)',
    itemType: 'Plain',
    locationUnit: 'moulding',
    stage: 'plain',
    qty: -350,
    uom: 'kg',
    movementType: 'Transfer_Out',
    referenceId: 'TRF-M-P-001',
    operatorName: 'Dinesh Yadav',
    notes: 'Internal stock move to Pearl Unit 2'
  },
  {
    id: 'mov-9',
    timestamp: '2026-10-03T10:30:00Z',
    itemId: 'sku-plain-3r-semi-sr',
    itemName: '3MM Round Plain Bead - Semi (SR)',
    itemType: 'Plain',
    locationUnit: 'pearl',
    stage: 'plain',
    qty: 350,
    uom: 'kg',
    movementType: 'Transfer_In',
    referenceId: 'TRF-M-P-001',
    operatorName: 'Santosh Maurya',
    notes: 'Received at Pearl Unit 2 for Off White batch'
  },

  // 4. Coating Batch (Pearl Plain -> Coated Beads)
  {
    id: 'mov-10',
    timestamp: '2026-10-04T12:00:00Z',
    itemId: 'sku-plain-3r-semi-sr',
    itemName: '3MM Round Plain Bead - Semi (SR)',
    itemType: 'Plain',
    locationUnit: 'pearl',
    stage: 'plain',
    qty: -200,
    uom: 'kg',
    movementType: 'Consumption',
    referenceId: 'PB-26-081',
    operatorName: 'Ganesh Patil'
  },
  {
    id: 'mov-11',
    timestamp: '2026-10-04T12:00:00Z',
    itemId: 'sku-fin-1',
    itemName: '3MM Round Off White - Semi (SR)',
    itemType: 'Coated',
    locationUnit: 'pearl',
    stage: 'coated',
    qty: 198,
    uom: 'kg',
    movementType: 'Production_In',
    referenceId: 'PB-26-081',
    operatorName: 'Ganesh Patil',
    notes: 'Coated with Pearl Essence Grade A. 2kg drying rejects.'
  },

  // 5. Sent to Karigar for Threading
  {
    id: 'mov-12',
    timestamp: '2026-10-04T15:00:00Z',
    itemId: 'sku-fin-1',
    itemName: '3MM Round Off White - Semi (SR)',
    itemType: 'Coated',
    locationUnit: 'pearl',
    stage: 'coated',
    qty: -120,
    uom: 'kg',
    movementType: 'Sent_Karigar',
    referenceId: 'SLIP-2026-089',
    operatorName: 'Santosh Maurya',
    notes: 'Sent to Ramesh Bhai Threading (Anjurphata)'
  },
  {
    id: 'mov-13',
    timestamp: '2026-10-04T15:00:00Z',
    itemId: 'sku-fin-1',
    itemName: '3MM Round Off White - Semi (SR)',
    itemType: 'Coated',
    locationUnit: 'threading',
    stage: 'karigar',
    qty: 120,
    uom: 'kg',
    movementType: 'Sent_Karigar',
    referenceId: 'SLIP-2026-089',
    operatorName: 'Santosh Maurya'
  },

  // 6. Return from Karigar (Received as Bunches + Loose + Scrap)
  {
    id: 'mov-14',
    timestamp: '2026-10-18T16:00:00Z',
    itemId: 'sku-fin-1',
    itemName: '3MM Round Off White - Semi (SR)',
    itemType: 'Finished',
    locationUnit: 'warehouse',
    stage: 'finished',
    qty: 950,
    uom: 'bunch',
    movementType: 'Received_Karigar',
    referenceId: 'SLIP-2026-089',
    operatorName: 'Santosh Maurya',
    notes: 'Received strung bunches from Ramesh Bhai'
  },
  {
    id: 'mov-15',
    timestamp: '2026-10-18T16:00:00Z',
    itemId: 'sku-fin-1',
    itemName: '3MM Round Off White - Semi (SR)',
    itemType: 'Coated',
    locationUnit: 'threading',
    stage: 'karigar',
    qty: -99.8, // 950 bunches * 0.082kg + 18.5kg loose + 3.2kg waste = ~99.8kg
    uom: 'kg',
    movementType: 'Received_Karigar',
    referenceId: 'SLIP-2026-089',
    operatorName: 'Santosh Maurya'
  },

  // 7. Direct Sale of Plain Beads from Moulding
  {
    id: 'mov-16',
    timestamp: '2026-10-15T11:00:00Z',
    itemId: 'sku-plain-6r-super-tr',
    itemName: '6MM Round Plain Bead - Super (TR)',
    itemType: 'Plain',
    locationUnit: 'moulding',
    stage: 'plain',
    qty: -150,
    uom: 'kg',
    movementType: 'Sale_Dispatch',
    referenceId: 'DSP-8799',
    operatorName: 'Dinesh Yadav',
    notes: 'Direct loose plain bead sale to Jai Ambe Ornaments'
  },

  // 8. Finished Goods Dispatch (Sale)
  {
    id: 'mov-17',
    timestamp: '2026-10-21T14:30:00Z',
    itemId: 'sku-fin-10',
    itemName: '8MM Round LCD - Super (SR)',
    itemType: 'Finished',
    locationUnit: 'warehouse',
    stage: 'finished',
    qty: -400,
    uom: 'bunch',
    movementType: 'Sale_Dispatch',
    referenceId: 'DSP-8821',
    operatorName: 'Santosh Maurya',
    notes: 'Dispatched to Royal Pearl House Zaveri Bazaar'
  }
];

export const INITIAL_MOULDING_ENTRIES: MouldingProductionEntry[] = [
  {
    id: 'mould-entry-1',
    date: '2026-10-24',
    shift: 'Day',
    machineId: 'M1',
    mouldId: 'MLD-3R-64CAV',
    skuId: 'sku-plain-3r-semi-sr',
    skuName: '3MM Round Plain Bead - Semi (SR)',
    gppsUsedKg: 250,
    goodBeadsKg: 241.5,
    wasteKg: 8.5,
    regrindReusedKg: 15,
    bagsPacked: 10,
    yieldPct: 91.13,
    operatorName: 'Pawan Kumar',
    downtimeMinutes: 35,
    downtimeReason: 'Nozzle temperature heater sensor recalibration',
    remarks: 'Smooth operation, uniform shot weight',
    timestamp: '2026-10-24T08:30:00Z'
  },
  {
    id: 'mould-entry-2',
    date: '2026-10-23',
    shift: 'Night',
    machineId: 'M2',
    mouldId: 'MLD-5R-48CAV',
    skuId: 'sku-plain-5r-semi-sr',
    skuName: '5MM Round Plain Bead - Semi (SR)',
    gppsUsedKg: 300,
    goodBeadsKg: 288,
    wasteKg: 12,
    regrindReusedKg: 20,
    bagsPacked: 12,
    yieldPct: 90.0,
    operatorName: 'Raju Vishwakarma',
    downtimeMinutes: 15,
    downtimeReason: 'Hydraulic oil top-up',
    remarks: 'All bags checked for flash defect, zero rejection',
    timestamp: '2026-10-23T20:00:00Z'
  },
  {
    id: 'mould-entry-3',
    date: '2026-10-23',
    shift: 'Day',
    machineId: 'M3',
    mouldId: 'MLD-8R-32CAV',
    skuId: 'sku-plain-8r-super-sr',
    skuName: '8MM Round Plain Bead - Super (SR)',
    gppsUsedKg: 280,
    goodBeadsKg: 268.8,
    wasteKg: 11.2,
    regrindReusedKg: 10,
    bagsPacked: 11,
    yieldPct: 92.69,
    operatorName: 'Pawan Kumar',
    downtimeMinutes: 0,
    remarks: 'High quality gloss on plain beads',
    timestamp: '2026-10-23T08:00:00Z'
  }
];

export const INITIAL_COATING_BATCHES: CoatingBatchEntry[] = [
  {
    id: 'coat-batch-1',
    date: '2026-10-24',
    shift: 'Day',
    unit: 'pearl',
    machineId: 'P1',
    inputPlainSkuId: 'sku-plain-3r-semi-sr',
    inputPlainKg: 150,
    materialsUsed: [
      {
        materialId: 'rm-pearl-essence',
        materialName: 'Pearl Essence Grade A',
        qty: 3.5,
        unit: 'litre'
      },
      {
        materialId: 'rm-lacquer',
        materialName: 'High-Gloss Clear Lacquer',
        qty: 6.0,
        unit: 'litre'
      }
    ],
    outputSkuId: 'sku-fin-1',
    outputSkuName: '3MM Round Off White - Semi (SR)',
    outputColour: 'Off White',
    outputKg: 147.2,
    rejectsKg: 2.8,
    operatorName: 'Ganesh Patil',
    remarks: 'Double-dipped for rich nacreous sheen',
    timestamp: '2026-10-24T09:00:00Z'
  },
  {
    id: 'coat-batch-2',
    date: '2026-10-23',
    shift: 'Day',
    unit: 'metalizing',
    machineId: 'MZ1',
    inputPlainSkuId: 'sku-plain-8r-super-sr',
    inputPlainKg: 120,
    materialsUsed: [
      {
        materialId: 'rm-al-wire',
        materialName: 'Aluminium Wire 99.9% Purity',
        qty: 2.2,
        unit: 'kg'
      },
      {
        materialId: 'rm-base-coat',
        materialName: 'Vacuum Primer Base Coat',
        qty: 4.5,
        unit: 'litre'
      },
      {
        materialId: 'rm-top-coat',
        materialName: 'Protective UV Top Coat',
        qty: 5.0,
        unit: 'litre'
      }
    ],
    outputSkuId: 'sku-fin-24',
    outputSkuName: '8MM Round Gold Metallic - Super (SR)',
    outputColour: 'Gold Metallic',
    outputKg: 118.5,
    rejectsKg: 1.5,
    operatorName: 'Imran Khan',
    remarks: 'Vacuum chamber vacuum cycle 45 min, 100% mirror finish',
    timestamp: '2026-10-23T11:00:00Z'
  }
];

export const INITIAL_MOULDING_TASKS: MouldingTask[] = [
  {
    id: 'task-m1-01',
    adminId: 'user-admin',
    assignedOperatorId: 'user-staff-m1',
    assignedOperatorName: 'Pawan Kumar',
    machineId: 'M1',
    rawMaterialId: 'rm-gpps-black',
    rawMaterialName: 'Virgin GPPS Black Granules (for Black Beads)',
    targetSkuId: 'sku-plain-02',
    targetSkuName: '4MM Round - Semi (SR) Plain',
    rawAllocatedKg: 200,
    pieceRatePerKg: 3.0,
    status: 'In_Progress',
    assignedDate: '2026-10-25',
    notes: 'Urgent black bead batch for Bhiwandi wholesale order'
  },
  {
    id: 'task-m2-01',
    adminId: 'user-admin',
    assignedOperatorId: 'user-staff-m2',
    assignedOperatorName: 'Raju Vishwakarma',
    machineId: 'M2',
    rawMaterialId: 'rm-gpps-white',
    rawMaterialName: 'Virgin GPPS White Granules (for White Beads)',
    targetSkuId: 'sku-plain-04',
    targetSkuName: '6MM Drop - Super (SR) Plain',
    rawAllocatedKg: 150,
    pieceRatePerKg: 3.25,
    status: 'Assigned',
    assignedDate: '2026-10-25',
    notes: 'White beads for pearl essence coating batch'
  }
];

export const INITIAL_OPERATOR_SESSIONS: OperatorMouldingSession[] = [
  {
    id: 'sess-01',
    taskId: 'task-m1-01',
    operatorId: 'user-staff-m1',
    operatorName: 'Pawan Kumar',
    machineId: 'M1',
    rawMaterialId: 'rm-gpps-black',
    rawMaterialName: 'Virgin GPPS Black Granules',
    targetSkuId: 'sku-plain-02',
    targetSkuName: '4MM Round - Semi (SR) Plain',
    rawMaterialUsedKg: 200,
    wasteGeneratedKg: 80,
    mouldedBeadsKg: 120,
    pieceRatePerKg: 3.0,
    salaryEarned: 360,
    yieldPct: 60,
    bagsPacked: 5,
    status: 'Submitted',
    timestamp: '2026-10-25T09:30:00Z',
    postActionTaken: 'Stored_In_Moulding'
  },
  {
    id: 'sess-02',
    operatorId: 'user-staff-m2',
    operatorName: 'Raju Vishwakarma',
    machineId: 'M2',
    rawMaterialId: 'rm-gpps-white',
    rawMaterialName: 'Virgin GPPS White Granules',
    targetSkuId: 'sku-plain-04',
    targetSkuName: '6MM Drop - Super (SR) Plain',
    rawMaterialUsedKg: 25,
    wasteGeneratedKg: 10,
    mouldedBeadsKg: 15,
    pieceRatePerKg: 3.25,
    salaryEarned: 48.75,
    yieldPct: 60,
    bagsPacked: 1,
    status: 'Verified',
    timestamp: '2026-10-25T10:45:00Z',
    postActionTaken: 'Waste_Recycled'
  }
];

export const INITIAL_NOTIFICATIONS: FactoryNotification[] = [
  {
    id: 'notif-01',
    timestamp: '2026-10-25T09:31:00Z',
    type: 'Task_Completed',
    operatorName: 'Pawan Kumar',
    machineId: 'M1',
    summary: 'M1 Batch Complete: 120 kg moulded beads, 80 kg waste. Salary earned: ₹360.',
    mouldedKg: 120,
    wasteKg: 80,
    salaryEarned: 360,
    read: false
  }
];

export const INITIAL_PRODUCTION_PROGRAMS: ProductionProgram[] = [
  {
    id: 'prg-01',
    programNo: 'PRG-26-001',
    date: '2026-10-27',
    machineId: 'M1',
    operatorId: 'user-staff-m1',
    operatorName: 'Pawan Kumar',
    targetSkuId: 'sku-plain-02',
    targetSkuName: '4MM Round - Semi (SR) Plain',
    processType: 'Moulding',
    rawLotName: 'Offer Lot #104 (Virgin GPPS Black)',
    rawAllocatedKg: 200,
    targetPackets: 120,
    packetsCompleted: 68,
    piecesPerPacket: 1,
    packagingUnit: 'kg_per_packet',
    status: 'Running',
    liveCycleSeconds: 42,
    notes: 'Program from Admin/Owner: Surat wholesale order priority'
  },
  {
    id: 'prg-02',
    programNo: 'PRG-26-002',
    date: '2026-10-27',
    machineId: 'P1',
    operatorId: 'user-mgr-pearl',
    operatorName: 'Santosh Maurya',
    targetSkuId: 'sku-pearl-01',
    targetSkuName: '3MM Round - Super (SR) Off White',
    processType: 'Pearl',
    rawLotName: 'Offer Lot #105 (Pearl Coating Essence)',
    rawAllocatedKg: 100,
    targetPackets: 100,
    packetsCompleted: 40,
    piecesPerPacket: 10,
    packagingUnit: 'bunches_per_packet',
    status: 'Running',
    liveCycleSeconds: 120,
    notes: 'Bunches-wise counting: 10 bunches in 1 packet'
  },
  {
    id: 'prg-03',
    programNo: 'PRG-26-003',
    date: '2026-10-27',
    machineId: 'MZ1',
    operatorId: 'user-mgr-metal',
    operatorName: 'Imran Khan',
    targetSkuId: 'sku-metal-01',
    targetSkuName: '5MM Round - Semi (SR) Gold Metallic',
    processType: 'Metalizing',
    rawLotName: 'Offer Lot #108 (Aluminium Wire + Base Coat)',
    rawAllocatedKg: 150,
    targetPackets: 150,
    packetsCompleted: 110,
    piecesPerPacket: 1,
    packagingUnit: 'kg_per_packet',
    status: 'Running',
    liveCycleSeconds: 95,
    notes: 'Dual packing mode enabled: Bunches & KG on 1 packet'
  }
];

