# MK Plastics Operations — Client Workflow Enhancements

Production-grade manufacturing and sales execution plan addressing the client's six core factory requirements: **Threaded Stock In (Packet & KG modes)**, **Admin Production Program**, **Worker Live Machine Status**, **Lot Offer Yield Tracking**, **Order Dispatch by Packets**, and **1-Click Sales Invoicing (GST & Kachcha)**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following choices were confirmed in Phase 1 and will govern this implementation:
> - **Finished Stock Counting**: In Pearl, counting is strictly **bunches-wise per packet** (e.g. 10 or 12 bunches per packet). In Metalizing, both **bunches-per-packet** and **KG-per-packet** options are fully supported on every packet inward.
> - **Worker Workstation Update**: A live, high-visibility hardware-style status card showing the **Active Program**, running mould/SKU, and **live completed packet count** against target.
> - **Order Dispatch & Invoicing**: **1-Click invoice generation** embedded directly in the packet dispatch confirmation flow, with seamless toggle between **GST Tax Invoice** and **Kachcha Bill / Estimate**.

---

## 1. Overview & Core Concept

### What It Delivers
1. **Threaded Stock In**: Inward screen for threaded beads returned from outsourced karigars. Supports Pearl (bunches per packet) and Metalizing (dual bunches or KG per packet), while computing net weight discrepancy by factoring in thread weight ($\text{Beads} + \text{Thread} = \text{Finished Packets}$).
2. **Admin Production Program**: A visual master scheduler where Admin/Owner assigns production "Programs" to machines (M1, M2, P1, P2, MZ1) with target SKU, mould specification, raw material lot ("Offer"), and target finished packet quantity.
3. **Worker Live Process Update ("What's Running In Machine")**: On the machine operator screen, a prominent live card displays the currently active Program, mould specs, cycle status, target packets, and a 1-tap packet counter (+1, +5, +10 packets).
4. **Lot & Offer Yield ("Packets Received from Offer")**: Analytics and batch completion summaries showing exactly how many packets were extracted from each raw polymer lot / program offer.
5. **Order Dispatch Update ("Packets to Which Party")**: Dispatch modal tracking partial or full packet deliveries to specific wholesale parties, with transporter/vehicle details.
6. **1-Click Sales Invoicing**: Instant transition from packet dispatch to billing, creating official GST invoices (HSN 3926, 18% GST) or Kachcha estimates, updating party ledger balances automatically.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                   1. ADMIN PRODUCTION PROGRAM BOARD                    │
│   Owner programs M1/M2/P1/P2/MZ1 with Product, Raw Lot, Target Packets  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Worker selects "Start Program"
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 2. WORKER WORKSTATION: LIVE STATUS                     │
│  "RUNNING: PRG-26-08 · 3mm Pearl Round · Target: 100 Packets"          │
│  Live Packet Progress: [████████░░] 68/100 · +1 / +5 / Bag Feed        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Material moves to Threading
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   3. THREADED STOCK IN (KARIGAR INWARD)                │
│  Pearl: [1000 Bunches] ÷ 10 = 100 Packets (+1.0 kg Thread Weight)      │
│  Metalizing: [50.0 kg] ÷ 1.0 kg = 50 Packets (or Bunches toggle)      │
│  Yield: 100 Packets extracted from Lot #4                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Customer Order Ready
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   4. ORDER DISPATCH & 1-CLICK INVOICING                │
│  Select Party: Bharat Beads Wholesale · Dispatch: 50 Packets           │
│  Vehicle: MH-04-AB-1234                                                │
│  [ Generate GST Tax Invoice ]   or   [ Generate Kachcha Bill ]        │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Theme**: Industrial precision palette utilizing dark navy structural tones (`#2B2A4C`), nacre pearl accent (`#C9A86A`), emerald stock indicators (`#16A34A`), and high-legibility dark slate canvas (`#17161F` in dark mode, `#FBFAF7` in light mode).
- **Typography**: Clean display sans (`Plus Jakarta Sans`) paired with tabular monospace numerals (`JetBrains Mono`, `font-mono tabular-nums`) for exact packet counts, weights, and rupee values.
- **Worker Interface Ergonomics**: High-contrast, large touch buttons ($\ge 48\text{px}$) for greasy factory fingers, single-elevation cards without nested boxes, and clear text labels without decorative pulsing dots.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Packet Standardization for Pearl vs. Metalizing
- **Chosen Approach**: In Pearl coating, counting is strictly bunches-per-packet (default 10 bunches = 1 packet, configurable). In Metalizing, the inward modal provides an instant segmented toggle: **Bunches per Packet** (e.g. 10 bunches/pkt) OR **KG per Packet** (e.g. 1 kg net weight/pkt).
- **Why**: Pearl beads are sold and threaded exclusively in bunches; metalizing products (gold/silver coated beads) are frequently traded by weight (1 kg packets) or by strung bunches in Maharashtra markets.
- **Alternatives Considered**: Forcing a single global unit would cause discrepancies between physical packaging and invoice line items.

### Decision 2: Admin "Program" as Live Machine Authority
- **Chosen Approach**: A unified `ProductionProgram` entity that feeds both the Admin scheduler and the Worker's "What's Running in Machine" screen.
- **Why**: Eliminates verbal confusion between the owner in the cabin and machine operators on the shop floor. When Admin programs M1, the operator's phone/tablet instantly updates.

### Decision 3: 1-Click Invoicing on Dispatch Confirmation
- **Chosen Approach**: When the dispatch manager enters "50 Packets to Bharat Beads", the confirmation dialog presents two prominent buttons: **"1-Click GST Invoice"** (official 18% tax invoice) and **"1-Click Kachcha Bill"** (unbilled estimate), which instantly creates the invoice and adjusts party ledger balances.
- **Why**: Solves the owner's #1 complaint: dispatches going out without bills, causing delayed payment collection.

---

## 4. Technical Architecture & Data Strategy

### Component & State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GLOBAL STATE STORE                             │
│  - productionPrograms: ProductionProgram[]                              │
│  - karigarWorks: KarigarJobWork[] (with packet packaging metadata)      │
│  - stockMovements: StockMovement[] (uom: 'packet' | 'bunch' | 'kg')     │
│  - salesOrders: SalesOrder[] & invoices: Invoice[]                      │
└────────────────────┬───────────────────────────────┬────────────────────┘
                     │                               │
        ┌────────────┴─────────────┐   ┌─────────────┴────────────┐
        ▼                          ▼   ▼                          ▼
┌──────────────────┐   ┌─────────────────────┐   ┌──────────────────────┐
│ Admin Program    │   │ Worker Workstation  │   │ Karigar Threaded     │
│ Scheduler        │   │ "What's Running"    │   │ Stock In Modal       │
│ - Assign mould   │   │ - Live packet count │   │ - Bunches/pkt (Pearl)│
│ - Set target pkt │   │ - Cycle telemetry   │   │ - KG/pkt (Metalizing)│
│ - Lot allocation │   │ - Quick +1/+5 feed  │   │ - Thread weight add  │
└──────────────────┘   └─────────────────────┘   └──────────────────────┘
                                                          │
                                                          ▼
                                                 ┌──────────────────────┐
                                                 │ Order Dispatch &     │
                                                 │ 1-Click Invoicing    │
                                                 │ - Packets to Party   │
                                                 │ - GST or Kachcha     │
                                                 └──────────────────────┘
```

### Data Model Additions (`src/types/index.ts`)

```typescript
// 1. Admin Production Program
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
  piecesPerPacket: number; // bunches per packet or kg per packet
  packagingUnit: 'bunches_per_packet' | 'kg_per_packet';
  status: 'Scheduled' | 'Running' | 'Completed';
  notes?: string;
}

// 2. Threaded Stock In Inward Metadata
export interface ThreadedStockInReceipt {
  receiptDate: string;
  karigarId: string;
  slipNo: string;
  rawLotRef: string; // Lot identity ("Offer")
  bunchesReceived: number;
  packetsReceived: number;
  packagingMode: 'bunches_per_packet' | 'kg_per_packet';
  packetSizeValue: number; // e.g. 10 bunches/pkt or 1.0 kg/pkt
  threadWeightAddedKg: number;
  totalThreadedWeightKg: number;
  kachchaBillNo?: string;
  kachchaBillAmount?: number;
}
```

---

## 5. Verification & Testing Plan

1. **Threading Inward (Pearl vs Metalizing)**:
   - Test Pearl receipt: enter 1,000 bunches with 10 bunches/packet $\rightarrow$ verify 100 packets logged into stock.
   - Test Metalizing receipt: switch to KG mode $\rightarrow$ enter 50 kg beads + 1 kg thread with 1.0 kg/packet $\rightarrow$ verify 51 packets logged.
2. **Admin Program to Worker Live Status**:
   - Create a program as Admin for Machine M1 (100 packets target).
   - Log in as Worker Pawan Kumar $\rightarrow$ verify the live "RUNNING" card appears on the workstation with target 100 packets and real-time progress.
   - Tap "+1 Packet" or feed a 25kg bag $\rightarrow$ verify packet count increments live and Admin receives completion alert.
3. **Dispatch to 1-Click Invoice**:
   - Create dispatch of 50 packets to a party.
   - Click "1-Click GST Tax Invoice" $\rightarrow$ verify invoice created with 18% GST, party outstanding balance incremented, and PDF/print view ready.
   - Click "1-Click Kachcha Bill" $\rightarrow$ verify unbilled estimate created without tax breakdown.
4. **Responsive Testing**:
   - Verify all modals and cards at 390px (mobile) and 1440px (desktop).
   - Verify `compile_applet` and `lint_applet` pass with 0 errors.
