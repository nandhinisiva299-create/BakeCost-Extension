/**
 * BakeCost - Storage & Persistence Engine
 * Supports Chrome Storage API with seamless localStorage fallback
 * Pre-loaded with Cute Korean Bento Box Cakes and Gourmet Cupcake Master Presets
 */

const StorageManager = {
  SETTINGS_KEY: 'bakeCost_settings_v2',
  RECIPES_KEY: 'bakeCost_recipes_v2',
  PANTRY_KEY: 'bakeCost_pantry_v2',

  defaultSettings: {
    bakeryName: 'Little Bento & Co. 🎀',
    bakerName: 'Chef Baker',
    contactNumber: '+91 98765 43210',
    instagramHandle: '@littlebentobakes',
    currency: '₹',
    currencyCode: 'INR',
    electricityRatePerKwh: 8.0,
    ovenWattage: 2000,
    bakerHourlyRate: 250,
    defaultWastagePercent: 6,
    defaultMarginPercent: 50,
    theme: 'light',
    measurementSystem: 'metric'
  },

  defaultRecipes: [
    {
      id: 'rec_bento_strawberry_milk',
      name: '🎀 4-inch Korean Pastel Bento Cake (Strawberry Milk)',
      category: 'Bento Cakes',
      description: 'Cute 4-inch Korean lunchbox cake with fluffy vanilla sponge, fresh strawberry compote filling, silky pastel buttercream, and vintage piped lettering.',
      yieldAmount: 1,
      yieldUnit: 'bento box',
      servingCount: 2,
      scaleFactor: 1.0,
      createdAt: '2026-09-24T10:00:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',
      
      // Ingredients for 4-inch 2-layer mini cake
      ingredients: [
        { id: 'i1', name: 'Cake Flour (Ultra Fine)', qtyUsed: 75, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 95 },
        { id: 'i2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 70, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i3', name: 'Fresh Large Eggs', qtyUsed: 1, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i4', name: 'Unsalted Butter (for Silky Buttercream)', qtyUsed: 110, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i5', name: 'Icing Sugar / Powdered Sugar', qtyUsed: 100, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 90 },
        { id: 'i6', name: 'Full Cream Milk', qtyUsed: 40, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 68 },
        { id: 'i7', name: 'Strawberry Compote / Berry Puree', qtyUsed: 50, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 250 },
        { id: 'i8', name: 'Pure Madagascar Vanilla Extract', qtyUsed: 0.5, unitUsed: 'tsp', packSize: 50, packUnit: 'ml', packPrice: 260 },
        { id: 'i9', name: 'Korean Pastel Gel Colors (Baby Pink/Sky/Lilac)', qtyUsed: 1, unitUsed: 'tsp', packSize: 25, packUnit: 'g', packPrice: 120 }
      ],

      // Overheads
      wastagePercent: 6,
      bakingTimeMinutes: 20,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.35,
      decoratingTimeHours: 0.65, // Hand lettered piping
      bakerHourlyRate: 250,

      // Cute Bento Packaging
      packaging: [
        { id: 'pkg1', name: 'Sugarcane Clamshell Bento Box (4-inch)', qty: 1, unitCost: 9 },
        { id: 'pkg2', name: 'Aesthetic Bento Wax / Gingham Paper Sheet', qty: 1, unitCost: 2.2 },
        { id: 'pkg3', name: 'Mini Eco Wooden Bento Fork / Spoon', qty: 1, unitCost: 1.8 },
        { id: 'pkg4', name: 'Pastel Striped Bento Candle & Match', qty: 1, unitCost: 8 },
        { id: 'pkg5', name: 'Aesthetic Bakery Washi Tape (Strip)', qty: 1, unitCost: 1 }
      ],

      decorations: [
        { id: 'dec1', name: 'Mini Pastel Edible Sugar Pearls', qty: 1, unitCost: 5 }
      ],

      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 50,
      targetMarkupPercent: 100,
      customSellingPrice: null
    },

    {
      id: 'rec_cupcakes_box_6',
      name: '🧁 Box of 6 Gourmet Vanilla Bean Swirl Cupcakes',
      category: 'Cupcakes',
      description: 'Set of 6 golden vanilla bean cupcakes crowned with sky-high pastel buttercream swirls, sugar pearls, and tulip liners.',
      yieldAmount: 6,
      yieldUnit: 'cupcakes',
      servingCount: 6,
      scaleFactor: 1.0,
      createdAt: '2026-09-23T14:30:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',
      
      ingredients: [
        { id: 'i1', name: 'Cake Flour (Ultra Fine)', qtyUsed: 120, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 95 },
        { id: 'i2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 110, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i3', name: 'Unsalted Butter (for Silky Buttercream)', qtyUsed: 140, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i4', name: 'Fresh Large Eggs', qtyUsed: 1, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i5', name: 'Full Cream Milk', qtyUsed: 80, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 68 },
        { id: 'i6', name: 'Icing Sugar / Powdered Sugar', qtyUsed: 150, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 90 },
        { id: 'i7', name: 'Baking Powder', qtyUsed: 4, unitUsed: 'g', packSize: 100, packUnit: 'g', packPrice: 35 },
        { id: 'i8', name: 'Pure Madagascar Vanilla Extract', qtyUsed: 1, unitUsed: 'tsp', packSize: 50, packUnit: 'ml', packPrice: 260 }
      ],

      wastagePercent: 5,
      bakingTimeMinutes: 18,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.3,
      decoratingTimeHours: 0.35,
      bakerHourlyRate: 250,

      packaging: [
        { id: 'pkg1', name: '6-Cavity Cupcake Box with Window & Insert', qty: 1, unitCost: 26 },
        { id: 'pkg2', name: 'Pastel Tulip Cupcake Liners', qty: 6, unitCost: 1.9 },
        { id: 'pkg3', name: 'Aesthetic Bakery Washi Tape (Strip)', qty: 1, unitCost: 1 }
      ],

      decorations: [
        { id: 'dec1', name: 'Mini Pastel Edible Sugar Pearls (50g)', qty: 1, unitCost: 10 }
      ],

      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 50,
      targetMarkupPercent: 100,
      customSellingPrice: null
    },

    {
      id: 'rec_bento_nutella_fudge',
      name: '🍫 4-inch Nutella & Oreo Crunch Bento Cake',
      category: 'Bento Cakes',
      description: 'Fudgy dark cocoa 4-inch bento cake with pure Nutella molten core, crushed Oreo buttercream, and retro shell piping.',
      yieldAmount: 1,
      yieldUnit: 'bento box',
      servingCount: 2,
      scaleFactor: 1.0,
      createdAt: '2026-09-22T11:00:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',
      
      ingredients: [
        { id: 'i1', name: 'All-Purpose Flour (Maida)', qtyUsed: 65, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 45 },
        { id: 'i2', name: 'Dutch Processed Cocoa Powder', qtyUsed: 25, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 340 },
        { id: 'i3', name: 'Castor Sugar / Fine Sugar', qtyUsed: 80, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i4', name: 'Fresh Large Eggs', qtyUsed: 1, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i5', name: 'Unsalted Butter (for Silky Buttercream)', qtyUsed: 90, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i6', name: 'Nutella Hazelnut Spread', qtyUsed: 60, unitUsed: 'g', packSize: 350, packUnit: 'g', packPrice: 380 },
        { id: 'i7', name: 'Icing Sugar / Powdered Sugar', qtyUsed: 90, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 90 },
        { id: 'i8', name: 'Full Cream Milk', qtyUsed: 45, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 68 }
      ],

      wastagePercent: 5,
      bakingTimeMinutes: 20,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.3,
      decoratingTimeHours: 0.5,
      bakerHourlyRate: 250,

      packaging: [
        { id: 'pkg1', name: 'Clear Top Bento Cake Box (4.5-inch)', qty: 1, unitCost: 15 },
        { id: 'pkg2', name: 'Aesthetic Bento Wax / Gingham Paper Sheet', qty: 1, unitCost: 2.2 },
        { id: 'pkg3', name: 'Mini Eco Wooden Bento Fork / Spoon', qty: 1, unitCost: 1.8 },
        { id: 'pkg4', name: 'Pastel Striped Bento Candle & Match', qty: 1, unitCost: 8 }
      ],

      decorations: [],
      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 50,
      targetMarkupPercent: 100,
      customSellingPrice: null
    },

    {
      id: 'rec_bento_kawaii_bear',
      name: '🧸 Cute Kawaii Bear 4-inch Bento Box Cake',
      category: 'Bento Cakes',
      description: 'Delightful Korean style bento cake with 3D piped bear face, chocolate sponge, salted caramel buttercream, and mini birthday candle.',
      yieldAmount: 1,
      yieldUnit: 'bento box',
      servingCount: 2,
      scaleFactor: 1.0,
      createdAt: '2026-09-21T09:00:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',

      ingredients: [
        { id: 'i1', name: 'Cake Flour (Ultra Fine)', qtyUsed: 75, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 95 },
        { id: 'i2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 70, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i3', name: 'Fresh Large Eggs', qtyUsed: 1, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i4', name: 'Unsalted Butter (for Silky Buttercream)', qtyUsed: 120, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i5', name: 'Icing Sugar / Powdered Sugar', qtyUsed: 110, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 90 },
        { id: 'i6', name: 'Dark Chocolate Couverture (55%)', qtyUsed: 30, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 380 }
      ],

      wastagePercent: 6,
      bakingTimeMinutes: 20,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.4,
      decoratingTimeHours: 0.75, // Detailed bear face piping
      bakerHourlyRate: 250,

      packaging: [
        { id: 'pkg1', name: 'Sugarcane Clamshell Bento Box (4-inch)', qty: 1, unitCost: 9 },
        { id: 'pkg2', name: 'Aesthetic Bento Wax / Gingham Paper Sheet', qty: 1, unitCost: 2.2 },
        { id: 'pkg3', name: 'Mini Eco Wooden Bento Fork / Spoon', qty: 1, unitCost: 1.8 },
        { id: 'pkg4', name: 'Pastel Striped Bento Candle & Match', qty: 1, unitCost: 8 }
      ],

      decorations: [
        { id: 'dec1', name: 'Cute Teddy Bear / Daisy Sugar Charms', qty: 1, unitCost: 18 }
      ],

      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 50,
      targetMarkupPercent: 100,
      customSellingPrice: null
    },

    {
      id: 'rec_mini_cupcakes_12',
      name: '🍓 Batch of 12 Mini Strawberry Blossom Cupcakes',
      category: 'Cupcakes',
      description: 'Bite-sized mini cupcakes with fresh strawberry puree buttercream rosettes, 24k edible gold flakes, and sweet pastel cups.',
      yieldAmount: 12,
      yieldUnit: 'mini cupcakes',
      servingCount: 12,
      scaleFactor: 1.0,
      createdAt: '2026-09-20T11:00:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',

      ingredients: [
        { id: 'i1', name: 'Cake Flour (Ultra Fine)', qtyUsed: 100, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 95 },
        { id: 'i2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 90, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i3', name: 'Unsalted Butter (for Silky Buttercream)', qtyUsed: 120, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i4', name: 'Fresh Large Eggs', qtyUsed: 1, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i5', name: 'Strawberry Compote / Berry Puree', qtyUsed: 40, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 250 },
        { id: 'i6', name: 'Icing Sugar / Powdered Sugar', qtyUsed: 120, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 90 }
      ],

      wastagePercent: 5,
      bakingTimeMinutes: 14,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.25,
      decoratingTimeHours: 0.35,
      bakerHourlyRate: 250,

      packaging: [
        { id: 'pkg1', name: '12-Cavity Cupcake Box with Insert', qty: 1, unitCost: 38 },
        { id: 'pkg2', name: 'Greaseproof Standard Cupcake Cups', qty: 12, unitCost: 1.2 }
      ],

      decorations: [
        { id: 'dec1', name: 'Edible 24k Gold Flakes (Small Jar)', qty: 1, unitCost: 15 }
      ],

      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 50,
      targetMarkupPercent: 100,
      customSellingPrice: null
    }
  ],

  async getSettings() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([this.SETTINGS_KEY], (res) => {
          if (res && res[this.SETTINGS_KEY]) {
            resolve({ ...this.defaultSettings, ...res[this.SETTINGS_KEY] });
          } else {
            resolve(this.defaultSettings);
          }
        });
      } else {
        const stored = localStorage.getItem(this.SETTINGS_KEY);
        if (stored) {
          try {
            resolve({ ...this.defaultSettings, ...JSON.parse(stored) });
            return;
          } catch (e) {
            console.error(e);
          }
        }
        resolve(this.defaultSettings);
      }
    });
  },

  async saveSettings(settings) {
    return new Promise((resolve) => {
      const data = { ...this.defaultSettings, ...settings };
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [this.SETTINGS_KEY]: data }, () => resolve(data));
      } else {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data));
        resolve(data);
      }
    });
  },

  async getRecipes() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([this.RECIPES_KEY], (res) => {
          if (res && res[this.RECIPES_KEY] && Array.isArray(res[this.RECIPES_KEY]) && res[this.RECIPES_KEY].length > 0) {
            resolve(res[this.RECIPES_KEY]);
          } else {
            this.saveRecipes(this.defaultRecipes);
            resolve(this.defaultRecipes);
          }
        });
      } else {
        const stored = localStorage.getItem(this.RECIPES_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              resolve(parsed);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
        this.saveRecipes(this.defaultRecipes);
        resolve(this.defaultRecipes);
      }
    });
  },

  async saveRecipes(recipes) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [this.RECIPES_KEY]: recipes }, () => resolve(recipes));
      } else {
        localStorage.setItem(this.RECIPES_KEY, JSON.stringify(recipes));
        resolve(recipes);
      }
    });
  },

  async getRecipe(id) {
    const recipes = await this.getRecipes();
    return recipes.find(r => r.id === id) || null;
  },

  async saveRecipe(recipe) {
    const recipes = await this.getRecipes();
    const existingIndex = recipes.findIndex(r => r.id === recipe.id);
    recipe.updatedAt = new Date().toISOString();
    
    if (existingIndex >= 0) {
      recipes[existingIndex] = recipe;
    } else {
      if (!recipe.id) recipe.id = 'rec_' + Date.now();
      if (!recipe.createdAt) recipe.createdAt = new Date().toISOString();
      recipes.unshift(recipe);
    }
    await this.saveRecipes(recipes);
    return recipe;
  },

  async deleteRecipe(id) {
    let recipes = await this.getRecipes();
    recipes = recipes.filter(r => r.id !== id);
    await this.saveRecipes(recipes);
    return recipes;
  },

  async getPantry() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([this.PANTRY_KEY], (res) => {
          if (res && res[this.PANTRY_KEY] && Array.isArray(res[this.PANTRY_KEY])) {
            resolve(res[this.PANTRY_KEY]);
          } else {
            const defaults = window.DefaultPantry ? window.DefaultPantry.items : [];
            this.savePantry(defaults);
            resolve(defaults);
          }
        });
      } else {
        const stored = localStorage.getItem(this.PANTRY_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              resolve(parsed);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
        const defaults = window.DefaultPantry ? window.DefaultPantry.items : [];
        this.savePantry(defaults);
        resolve(defaults);
      }
    });
  },

  async savePantry(items) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [this.PANTRY_KEY]: items }, () => resolve(items));
      } else {
        localStorage.setItem(this.PANTRY_KEY, JSON.stringify(items));
        resolve(items);
      }
    });
  },

  async exportBackup() {
    const settings = await this.getSettings();
    const recipes = await this.getRecipes();
    const pantry = await this.getPantry();
    return JSON.stringify({
      version: '2.0.0',
      theme: 'cute_bento_cupcake',
      exportedAt: new Date().toISOString(),
      settings,
      recipes,
      pantry
    }, null, 2);
  },

  async importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) await this.saveSettings(data.settings);
      if (data.recipes && Array.isArray(data.recipes)) await this.saveRecipes(data.recipes);
      if (data.pantry && Array.isArray(data.pantry)) await this.savePantry(data.pantry);
      return { success: true, count: data.recipes ? data.recipes.length : 0 };
    } catch (e) {
      console.error('Import error:', e);
      return { success: false, error: e.message };
    }
  },

  async resetToDefaults() {
    await this.saveSettings(this.defaultSettings);
    await this.saveRecipes(this.defaultRecipes);
    const defaults = window.DefaultPantry ? window.DefaultPantry.items : [];
    await this.savePantry(defaults);
    return true;
  }
};

if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}
