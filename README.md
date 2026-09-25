# 🍰 BakeCost — Smart Costing & Pricing Assistant for Home Bakers

**BakeCost** is a modern, professional browser extension and costing studio engineered specifically for home bakers, custom cake designers, and boutique baking businesses. It solves the widespread problem of accidental underpricing by capturing **true production costs** — including ingredients, unit conversions, oven electricity/gas, scrap wastage, handcrafted labor wages, packaging, and custom cake decorations.

---

## 🚀 Key Features

### 1. 🌾 Accurate Recipe Cost Calculator & Unit Converter
- **Unit Conversion Engine**: Seamlessly handles mass (`g`, `kg`, `oz`, `lb`), volume (`ml`, `L`, `cup`, `tbsp`, `tsp`, `fl oz`), and count (`pcs`, `dozen`, `sheet`, `meter`).
- **Density-Aware Calculations**: Converts cups to exact grams for baking staples (Flour: 125g/cup, Sugar: 200g/cup, Butter: 227g/cup, Cocoa: 100g/cup).
- **Auto Formula**: `(Quantity Used / Pack Size) × Pack Price` calculated dynamically in real-time.
- **Batch Scaling**: 1-click scale recipe 0.5x, 1x, 1.5x, 2x, 3x, or custom batch amounts.

### 2. ⚡ The Hidden Overhead & Baker Wage Engine
- **Oven Electricity / Energy**: Auto-computes power costs based on oven wattage (e.g. 2000W), baking duration (minutes), and your local kWh rate.
- **True Baker Labor Wage**: Factor in prep, mixing, and decorating time multiplied by your target hourly rate so you never bake for free.
- **Scrap & Trimming Wastage Buffer**: Configurable 0% to 25% safety margin for batter residue, trimmed cake tops, and test batches.
- **Packaging & Delivery**: Cost tracking for boxes, MDF cake boards, satin ribbons, candles/knives, bags, and courier delivery.
- **Special Decorations**: Toppers, edible gold leaf, fresh flower bundles, and macarons.

### 3. 🎯 Smart Pricing Strategy & Margin Analysis
- **3 Pricing Modes**: Target Gross Margin % (slider), Markup on Cost %, or Custom Fixed Price.
- **Tiered Price Benchmarks**:
  - ⚠️ **Floor Price**: Bare raw material survival cost (excluding labor).
  - ⚖️ **Break-Even Price**: Production cost including baker's wage.
  - 🏷️ **Wholesale Price**: Standard 25% commercial margin.
  - 💎 **Recommended Retail Price**: Sustainable premium artisan pricing.
- **Per-Unit Breakdown**: Live calculation of Cost & Price per Serving and per Kilogram/Piece.

### 4. 📊 Visualizer & Business Health Diagnostics
- **Interactive SVG Donut Chart**: Visual breakdown of Ingredients vs. Labor vs. Packaging vs. Energy vs. Decorations.
- **Profit Margin Gauge**: Live meter rating your margin safety (Critical, Moderate, Healthy, Premium).
- **Smart Diagnostic Alerts**: Warns if labor is budgeted at ₹0, if margin is dangerously low, or if packaging exceeds 20% of budget.

### 5. 💬 Instant WhatsApp Quote & Invoice Generator
- **1-Click WhatsApp DM Text**: Generates beautiful, emoji-formatted order summaries with customer names, delivery deadlines, custom notes, and total price.
- **Printable Cost Sheet & Quotation**: Export clean PDF/Print cost sheets and client-facing quotations with your bakery's branding.

### 6. 🏪 Master Pantry & Saved Recipe Book
- **45+ Pre-loaded Ingredients & Defaults**: Categorized database of flours, chocolates, sugars, dairy, packaging, and toppers.
- **5 Pre-loaded Gourmet Recipes**:
  1. 1kg Belgian Dark Chocolate Truffle Cake
  2. Batch of 12 Red Velvet Cupcakes with Cream Cheese Swirl
  3. 1kg Fresh Strawberry & Swiss Buttercream Cake
  4. Fudgy Dark Chocolate Brownies (Box of 9)
- **Offline & Storage Ready**: Works completely offline using Chrome Storage API and LocalStorage with full JSON backup import/export.

---

## 🛠️ How to Install as a Chrome Extension

1. Open **Google Chrome** (or Microsoft Edge / Brave).
2. Navigate to `chrome://extensions` in the address bar.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left corner.
5. Select this project directory (`c:\Users\Nandhini\New folder (2)`).
6. Click the puzzle icon 🧩 in Chrome's toolbar and pin **BakeCost**!

---

## 📂 Project Structure

```text
├── manifest.json              # Chrome Manifest V3 configuration
├── popup.html                 # Extension popup interface
├── dashboard.html             # Full-screen Studio & Recipe Book
├── index.html                 # Standalone web app preview & entry
├── css/
│   ├── style.css              # Design system tokens, warm bakery themes, dark/light mode
│   ├── components.css         # UI components, pricing cards, forms, tables, modals
│   └── animations.css         # Micro-interactions, keyframes, transitions
├── js/
│   ├── app.js                 # App controller, event bindings, tab routing, calculations
│   ├── calculator.js          # Core costing engine, overheads, margins, diagnostic alerts
│   ├── pantry.js              # 45+ preset ingredients, packaging items, and decorations
│   ├── storage.js             # Storage adapter (Chrome Storage + LocalStorage fallback)
│   ├── visualizer.js          # Interactive SVG donut chart and margin gauge meter
│   ├── quote-generator.js     # WhatsApp DM formatter and printable PDF generator
│   ├── units.js               # Unit conversion and baking density database
│   └── background.js          # Manifest V3 service worker
└── assets/
    └── icons/                 # Crisp PNG icons (16px, 32px, 48px, 128px)
```

---

## 💡 Example Costing Calculation

```text
Butter:
Pack size = 500g
Pack price = ₹275
Used = 150g
Cost used = (150 / 500) × 275 = ₹82.50

Oven Electricity:
Power = 2000W (2 kW)
Baking Time = 35 minutes (0.583 hours)
Rate = ₹8.00 / kWh
Energy Cost = 2 × 0.583 × 8 = ₹9.33

Baker Labor:
Prep & Decorating = 1.25 hours
Wage Rate = ₹200 / hour
Labor Cost = 1.25 × 200 = ₹250.00
```
