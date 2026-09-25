/**
 * BakeCost - Smart Unit Conversion Engine
 * Supports Mass, Volume, Count, and Ingredient-Specific Density Conversions
 */

const UnitConverter = {
  // Common density conversions (grams per 1 standard US Cup = 240ml)
  ingredientDensities: {
    // Flours & Starches
    'all purpose flour': 125,
    'flour': 125,
    'maida': 125,
    'cake flour': 115,
    'bread flour': 130,
    'whole wheat flour': 120,
    'atta': 120,
    'almond flour': 96,
    'cornstarch': 128,
    'corn flour': 128,
    
    // Sugars
    'granulated sugar': 200,
    'sugar': 200,
    'castor sugar': 200,
    'powdered sugar': 120,
    'icing sugar': 120,
    'brown sugar': 220,
    'honey': 340,
    'condensed milk': 306,
    'maple syrup': 322,
    
    // Fats & Dairy
    'butter': 227,
    'unsalted butter': 227,
    'salted butter': 227,
    'heavy cream': 238,
    'whipping cream': 238,
    'fresh cream': 240,
    'cream cheese': 225,
    'milk': 244,
    'oil': 218,
    'vegetable oil': 218,
    'melted butter': 227,
    'mascarpone': 225,
    'curd': 245,
    'yogurt': 245,
    'buttermilk': 242,
    
    // Chocolates & Cocoa
    'cocoa powder': 100,
    'dark cocoa powder': 100,
    'chocolate chips': 170,
    'melted chocolate': 200,
    
    // Leaveners & Extracts (tablespoon / teaspoon friendly)
    'baking powder': 192, // 1 cup = 192g (1 tsp = ~4g)
    'baking soda': 240,   // 1 cup = 240g (1 tsp = ~5g)
    'salt': 288,          // 1 cup = 288g (1 tsp = ~6g)
    'vanilla extract': 240 // 1 cup = 240g (1 tsp = ~5g)
  },

  // Base unit conversions to grams (for mass) or milliliters (for volume) or count
  unitTypes: {
    // Mass -> Base: grams (g)
    'g': { type: 'mass', toBase: 1, label: 'Gram (g)' },
    'kg': { type: 'mass', toBase: 1000, label: 'Kilogram (kg)' },
    'mg': { type: 'mass', toBase: 0.001, label: 'Milligram (mg)' },
    'oz': { type: 'mass', toBase: 28.3495, label: 'Ounce (oz)' },
    'lb': { type: 'mass', toBase: 453.592, label: 'Pound (lb)' },
    
    // Volume -> Base: milliliters (ml)
    'ml': { type: 'volume', toBase: 1, label: 'Milliliter (ml)' },
    'l': { type: 'volume', toBase: 1000, label: 'Liter (L)' },
    'liter': { type: 'volume', toBase: 1000, label: 'Liter (L)' },
    'tsp': { type: 'volume', toBase: 4.92892, label: 'Teaspoon (tsp)' },
    'tbsp': { type: 'volume', toBase: 14.7868, label: 'Tablespoon (tbsp)' },
    'cup': { type: 'volume', toBase: 240, label: 'Cup (cup)' },
    'fl oz': { type: 'volume', toBase: 29.5735, label: 'Fluid Ounce (fl oz)' },
    'pint': { type: 'volume', toBase: 473.176, label: 'Pint (pt)' },
    'quart': { type: 'volume', toBase: 946.353, label: 'Quart (qt)' },
    
    // Count -> Base: piece (pcs)
    'pcs': { type: 'count', toBase: 1, label: 'Piece (pcs)' },
    'pc': { type: 'count', toBase: 1, label: 'Piece (pc)' },
    'piece': { type: 'count', toBase: 1, label: 'Piece' },
    'unit': { type: 'count', toBase: 1, label: 'Unit' },
    'dozen': { type: 'count', toBase: 12, label: 'Dozen (12 pcs)' },
    'pack': { type: 'count', toBase: 1, label: 'Pack' },
    'sheet': { type: 'count', toBase: 1, label: 'Sheet' },
    'box': { type: 'count', toBase: 1, label: 'Box' },
    'meter': { type: 'length', toBase: 1, label: 'Meter (m)' },
    'cm': { type: 'length', toBase: 0.01, label: 'Centimeter (cm)' },
    'inch': { type: 'length', toBase: 0.0254, label: 'Inch (in)' }
  },

  /**
   * Find matching density for an ingredient name
   */
  getDensity(ingredientName) {
    if (!ingredientName) return 1.0; // default 1ml = 1g for liquids
    const cleanName = ingredientName.trim().toLowerCase();
    
    // Direct lookup
    if (this.ingredientDensities[cleanName]) {
      return this.ingredientDensities[cleanName] / 240; // g per ml
    }
    
    // Substring search
    for (const [key, gPerCup] of Object.entries(this.ingredientDensities)) {
      if (cleanName.includes(key) || key.includes(cleanName)) {
        return gPerCup / 240;
      }
    }
    
    return 1.0; // default water density: 1g = 1ml
  },

  /**
   * Normalize any quantity & unit into standard base units:
   * Mass -> Grams (g)
   * Volume -> Milliliters (ml)
   * Count -> Pieces (pcs)
   */
  toBaseUnit(quantity, unit) {
    const qty = parseFloat(quantity) || 0;
    const u = (unit || 'g').trim().toLowerCase();
    
    const info = this.unitTypes[u];
    if (info) {
      return {
        amount: qty * info.toBase,
        type: info.type
      };
    }
    
    return { amount: qty, type: 'custom' };
  },

  /**
   * Calculates the exact cost of quantity used given pack details.
   * Handles same-type conversions (e.g. g to kg, ml to L) and cross-type (cups to grams, tbsp to g).
   */
  calculateItemCost(qtyUsed, unitUsed, packSize, packUnit, packPrice, ingredientName = '') {
    const used = parseFloat(qtyUsed) || 0;
    const size = parseFloat(packSize) || 0;
    const price = parseFloat(packPrice) || 0;
    
    if (size <= 0 || price <= 0 || used <= 0) {
      return 0;
    }

    const uUsed = (unitUsed || 'g').trim().toLowerCase();
    const uPack = (packUnit || 'g').trim().toLowerCase();

    // Direct identical units
    if (uUsed === uPack) {
      return (used / size) * price;
    }

    const baseUsed = this.toBaseUnit(used, uUsed);
    const basePack = this.toBaseUnit(size, uPack);

    // Both are mass (e.g. g and kg) or both volume (e.g. ml and L) or both count
    if (baseUsed.type === basePack.type && baseUsed.type !== 'custom') {
      return (baseUsed.amount / basePack.amount) * price;
    }

    // Cross conversion between Volume & Mass using density lookup
    const density = this.getDensity(ingredientName); // grams per ml

    let usedGrams = 0;
    if (baseUsed.type === 'mass') {
      usedGrams = baseUsed.amount;
    } else if (baseUsed.type === 'volume') {
      usedGrams = baseUsed.amount * density;
    }

    let packGrams = 0;
    if (basePack.type === 'mass') {
      packGrams = basePack.amount;
    } else if (basePack.type === 'volume') {
      packGrams = basePack.amount * density;
    }

    if (usedGrams > 0 && packGrams > 0) {
      return (usedGrams / packGrams) * price;
    }

    // Fallback: direct ratio
    return (used / size) * price;
  },

  /**
   * Convert between any two units for the Quick Converter tool
   */
  convert(amount, fromUnit, toUnit, ingredientName = '') {
    const val = parseFloat(amount) || 0;
    const uFrom = (fromUnit || 'g').trim().toLowerCase();
    const uTo = (toUnit || 'g').trim().toLowerCase();

    if (uFrom === uTo) return val;

    const baseFrom = this.toBaseUnit(val, uFrom);
    const infoTo = this.unitTypes[uTo];

    if (!infoTo) return val;

    // Direct same dimension
    if (baseFrom.type === infoTo.type) {
      return baseFrom.amount / infoTo.toBase;
    }

    // Cross-dimension volume <-> mass
    const density = this.getDensity(ingredientName); // g/ml
    
    if (baseFrom.type === 'volume' && infoTo.type === 'mass') {
      // ml -> g -> target mass unit
      const totalGrams = baseFrom.amount * density;
      return totalGrams / infoTo.toBase;
    }

    if (baseFrom.type === 'mass' && infoTo.type === 'volume') {
      // g -> ml -> target volume unit
      const totalMl = baseFrom.amount / (density || 1);
      return totalMl / infoTo.toBase;
    }

    return val;
  }
};

if (typeof window !== 'undefined') {
  window.UnitConverter = UnitConverter;
}
