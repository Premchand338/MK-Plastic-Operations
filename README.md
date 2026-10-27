# MK Plastics Operations — Multi-Unit Beads Manufacturing Web App

Production-grade, mobile-first operations and inventory tracking web application built for **MK Plastics / Beads Bazaar** in Bhiwandi, Maharashtra, India. It enables the owner to supervise three factory units (Moulding, Pearl Coating, Metalizing) and outsourced threading karigars under one unified GST identity, tracing every kilo of raw GPPS granules from purchase to finished bunch sales.

---

## 💎 Design System — "Pearl & Thread"

- **Color Tokens**:
  - Primary Navy: `#2B2A4C` (Dark: `#C9C8F0`)
  - Accent Gold: `#C9A86A` (Dark: `#D9BC84`)
  - Soft Sand: `#E6D7BC` (Dark: `#3A3326`)
  - Pearl Background: `#FBFAF7` (Dark: `#17161F`)
  - Card Surfaces: `#FFFFFF` (Dark: `#201F2B`)
  - Unit Identity: Moulding `#4A5A7A` (Slate), Pearl `#C98A9B` (Rose), Metalizing `#8E99A8` (Steel), Threading `#B98B4E` (Amber)
- **Typography**:
  - Headings: **Marcellus** (refined serif echoing the Beads Bazaar brochure)
  - Body & UI: **Poppins** (clean, crisp, and readable in high-glare factory environments)
  - Hindi: **Noto Sans Devanagari**
  - All numbers & weights: Tabular figures (`tabular-nums`) with 3-decimal numeric precision and ₹ currency
- **Signature Details**:
  - Soft nacre sheen gradient on the dashboard hero card and active chips
  - Bead-string progress visualizer (row of filled circles) for live yield percentages
  - Custom SVG bead glyphs for Round, Half Round, Drop, Munga, and Sujni shapes
  - Zero-pill metadata discipline with unboxed text and clean separators

---

## 👥 Personas & Demo Logins (1-Click Switcher in Top Bar)

1. **Owner / Admin (Rajesh Shah)**:
   - Full firm-wide oversight
   - Can view rates, profit, financials, receivables, and expenses
   - Can approve physical stock adjustments and execute stock reversals
2. **Unit Managers**:
   - Dinesh Yadav (Moulding Unit)
   - Santosh Maurya (Pearl Unit)
   - Imran Khan (Metalizing Unit)
   - Scoped strictly to their own unit; prices, margins, and expenses are hidden
3. **Machine Operator Staff**:
   - Pawan Kumar (Operator M1)
   - Raju Vishwakarma (Operator M2)
   - Ganesh Patil (Operator P1)
   - 30-Second Fast-Entry mode with large numeric keypads

---

## 📦 Material Traceability Pipeline (The 6 Stages)

1. **Raw Material Inward**: GPPS granules (SR / TR grades), Pearl essence, lacquer, aluminum wire, primers, packing bags, and thread.
2. **Moulding (M1–M4)**: 4 horizontal injection machines melting GPPS into uncoloured plain beads in 25–30kg bags. Waste reground and reused.
3. **Inter-Unit Transfers**: Plain beads moved to Pearl or Metalizing units. One firm, one GST identity — stock movement without challan.
4. **Coating (P1, P2 & MZ1)**: Plain beads + pigments/lacquer coated into 16 brochure shades or mirror metal finishes.
5. **Threading (Outsourced Karigars)**: Coated beads sent out by KG, returning as strung bunches + loose beads + scrap. Monitored against a 15-day SLA.
6. **Finished Stock & Sales**: Bunches and loose KG sold under GST Tax Invoices or Kachcha bills (estimates) with partial dispatch and payment tracking.

---

## 📱 Mobile-First PWA & Offline Support

- **Installable PWA**: Compliant `manifest.json`, brand SVG icon, and in-app install prompt with guided iOS instructions.
- **Offline Outbox**: When shop-floor connectivity drops in Bhiwandi, entries are safely queued with client UUIDs in the device outbox so syncing never creates duplicates.
- **Phone Bottom Bar**: 5 destinations (`Home`, `Stock`, `Entry (+)`, `Orders`, `More`) with large 48px+ touch targets.
- **Desktop Sidebar**: Expands into a 260px command center on 1440px displays.
- **Trilingual**: 1-click toggle between **English**, **हिंदी (Hindi)**, and **Hinglish** (Roman Hindi).
