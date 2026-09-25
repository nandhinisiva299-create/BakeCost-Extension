/**
 * BakeCost - Storage & Persistence Engine
 * Supports Chrome Storage API with seamless localStorage fallback
 */

const StorageManager = {
  SETTINGS_KEY: 'bakeCost_settings_v1',
  RECIPES_KEY: 'bakeCost_recipes_v1',
  PANTRY_KEY: 'bakeCost_pantry_v1',

  defaultSettings: {
    bakeryName: 'The Artisan Bakehouse',
    bakerName: 'Chef Baker',
    contactNumber: '+91 98765 43210',
    instagramHandle: '@theartisanbakehouse',
    currency: '₹',
    currencyCode: 'INR',
    electricityRatePerKwh: 8.0,
    ovenWattage: 2000,
    bakerHourlyRate: 200,
    defaultWastagePercent: 8,
    defaultMarginPercent: 45,
    theme: 'light',
    measurementSystem: 'metric' // metric | imperial
  },

  defaultRecipes: [
    {
      id: 'rec_choco_truffle_1kg',
      name: '1kg Belgian Dark Chocolate Truffle Cake',
      category: 'Cakes',
      description: 'Ultra-rich moist chocolate sponge layered with 55% couverture dark chocolate ganache and chocolate drip.',
      yieldAmount: 1,
      yieldUnit: 'kg',
      servingCount: 10,
      scaleFactor: 1.0,
      createdAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',
      
      // Ingredients
      ingredients: [
        { id: 'i1', name: 'All-Purpose Flour (Maida)', qtyUsed: 200, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 45 },
        { id: 'i2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 220, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i3', name: 'Dutch Processed Cocoa Powder', qtyUsed: 60, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 340 },
        { id: 'i4', name: 'Baking Powder', qtyUsed: 6, unitUsed: 'g', packSize: 100, packUnit: 'g', packPrice: 35 },
        { id: 'i5', name: 'Baking Soda', qtyUsed: 4, unitUsed: 'g', packSize: 100, packUnit: 'g', packPrice: 25 },
        { id: 'i6', name: 'Fine Table Salt', qtyUsed: 2, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 25 },
        { id: 'i7', name: 'Full Cream Milk', qtyUsed: 180, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 68 },
        { id: 'i8', name: 'Neutral Vegetable Oil / Sunflower Oil', qtyUsed: 100, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 145 },
        { id: 'i9', name: 'Fresh Large Eggs', qtyUsed: 2, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i10', name: 'Pure Vanilla Extract / Paste', qtyUsed: 1, unitUsed: 'tsp', packSize: 50, packUnit: 'ml', packPrice: 260 },
        { id: 'i11', name: 'Dark Chocolate Couverture (55%)', qtyUsed: 350, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 380 },
        { id: 'i12', name: 'Heavy Whipping Cream (35%)', qtyUsed: 300, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 210 },
        { id: 'i13', name: 'Unsalted Butter', qtyUsed: 40, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 }
      ],

      // Overheads
      wastagePercent: 8,
      bakingTimeMinutes: 40,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.75,
      decoratingTimeHours: 1.0,
      bakerHourlyRate: 200,

      // Packaging items
      packaging: [
        { id: 'pkg1', name: 'Standard 8-inch Cake Box (Window)', qty: 1, unitCost: 35 },
        { id: 'pkg2', name: 'Heavy Duty 10-inch Cake Board (MDF)', qty: 1, unitCost: 25 },
        { id: 'pkg3', name: 'Satin Ribbon Roll (1.5m)', qty: 1, unitCost: 6 },
        { id: 'pkg4', name: 'Cake Knife & Sparkle Candle Set', qty: 1, unitCost: 15 },
        { id: 'pkg5', name: 'Eco Kraft Carry Bag (Large)', qty: 1, unitCost: 12 },
        { id: 'pkg6', name: 'Branded Thank You Stickers', qty: 1, unitCost: 2 }
      ],

      // Special Decorations
      decorations: [
        { id: 'dec1', name: 'Assorted Gourmet Sprinkles Mix', qty: 1, unitCost: 15 },
        { id: 'dec2', name: 'Edible 24k Gold Leaf Sheet (0.5)', qty: 1, unitCost: 35 }
      ],

      // Delivery & Extra
      deliveryCost: 0,

      // Pricing strategy
      pricingType: 'margin', // margin | markup | fixed
      targetMarginPercent: 45,
      targetMarkupPercent: 80,
      customSellingPrice: null
    },

    {
      id: 'rec_red_velvet_cupcakes',
      name: 'Batch of 12 Red Velvet Cupcakes with Cream Cheese Swirl',
      category: 'Cupcakes',
      description: 'Velvety cocoa cupcakes with a signature hint of tang and luxurious whipped cream cheese frosting.',
      yieldAmount: 12,
      yieldUnit: 'cupcakes',
      servingCount: 12,
      scaleFactor: 1.0,
      createdAt: '2026-09-22T14:30:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',
      
      ingredients: [
        { id: 'i1', name: 'Cake Flour', qtyUsed: 150, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 95 },
        { id: 'i2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 150, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i3', name: 'Dutch Processed Cocoa Powder', qtyUsed: 12, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 340 },
        { id: 'i4', name: 'Baking Soda', qtyUsed: 3, unitUsed: 'g', packSize: 100, packUnit: 'g', packPrice: 25 },
        { id: 'i5', name: 'Fine Table Salt', qtyUsed: 1, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 25 },
        { id: 'i6', name: 'Neutral Vegetable Oil / Sunflower Oil', qtyUsed: 80, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 145 },
        { id: 'i7', name: 'Fresh Large Eggs', qtyUsed: 1, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i8', name: 'Full Cream Milk', qtyUsed: 120, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 68 },
        { id: 'i9', name: 'Pure Vanilla Extract / Paste', qtyUsed: 1, unitUsed: 'tsp', packSize: 50, packUnit: 'ml', packPrice: 260 },
        { id: 'i10', name: 'Gel Food Color', qtyUsed: 3, unitUsed: 'g', packSize: 25, packUnit: 'g', packPrice: 110 },
        { id: 'i11', name: 'Cream Cheese (e.g. D’lecta / Philadelphia)', qtyUsed: 200, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 680 },
        { id: 'i12', name: 'Unsalted Butter', qtyUsed: 100, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i13', name: 'Icing Sugar / Powdered Sugar', qtyUsed: 120, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 90 }
      ],

      wastagePercent: 5,
      bakingTimeMinutes: 22,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.5,
      decoratingTimeHours: 0.5,
      bakerHourlyRate: 200,

      packaging: [
        { id: 'pkg1', name: '6-Cavity Cupcake Box with Insert', qty: 2, unitCost: 22 },
        { id: 'pkg2', name: 'Eco Kraft Carry Bag (Large)', qty: 1, unitCost: 12 },
        { id: 'pkg3', name: 'Branded Thank You Stickers', qty: 2, unitCost: 2 }
      ],

      decorations: [
        { id: 'dec1', name: 'Red Velvet Cake Crumbs & Sprinkles', qty: 1, unitCost: 10 }
      ],

      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 50,
      targetMarkupPercent: 100,
      customSellingPrice: null
    },

    {
      id: 'rec_fudgy_brownies',
      name: 'Fudgy Dark Chocolate Brownies (Box of 9)',
      category: 'Brownies',
      description: 'Crinkle-top, ultra-chewy fudgy chocolate brownies loaded with dark chocolate chunks.',
      yieldAmount: 9,
      yieldUnit: 'squares',
      servingCount: 9,
      scaleFactor: 1.0,
      createdAt: '2026-09-23T11:00:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',
      
      ingredients: [
        { id: 'i1', name: 'Dark Chocolate Couverture (55%)', qtyUsed: 200, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 380 },
        { id: 'i2', name: 'Unsalted Butter', qtyUsed: 120, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i3', name: 'Castor Sugar / Fine Sugar', qtyUsed: 150, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i4', name: 'Light Brown Sugar', qtyUsed: 50, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 120 },
        { id: 'i5', name: 'Fresh Large Eggs', qtyUsed: 2, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i6', name: 'All-Purpose Flour (Maida)', qtyUsed: 80, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 45 },
        { id: 'i7', name: 'Dutch Processed Cocoa Powder', qtyUsed: 30, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 340 },
        { id: 'i8', name: 'Fine Table Salt', qtyUsed: 2, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 25 },
        { id: 'i9', name: 'Semi-Sweet Chocolate Chips', qtyUsed: 60, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 220 }
      ],

      wastagePercent: 5,
      bakingTimeMinutes: 28,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 0.35,
      decoratingTimeHours: 0.25,
      bakerHourlyRate: 200,

      packaging: [
        { id: 'pkg1', name: 'Standard 8-inch Cake Box (Window)', qty: 1, unitCost: 35 },
        { id: 'pkg2', name: 'Branded Thank You Stickers', qty: 1, unitCost: 2 },
        { id: 'pkg3', name: 'Satin Ribbon Roll (1m)', qty: 1, unitCost: 4 }
      ],

      decorations: [],
      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 50,
      targetMarkupPercent: 100,
      customSellingPrice: null
    },

    {
      id: 'rec_strawberry_vanilla_cake',
      name: '1kg Fresh Strawberry & Swiss Buttercream Cake',
      category: 'Cakes',
      description: 'Fluffy Madagascar vanilla sponge layered with house-made fresh strawberry compote and silky Swiss meringue buttercream.',
      yieldAmount: 1,
      yieldUnit: 'kg',
      servingCount: 10,
      scaleFactor: 1.0,
      createdAt: '2026-09-24T09:00:00.000Z',
      updatedAt: '2026-09-25T08:00:00.000Z',

      ingredients: [
        { id: 'i1', name: 'Cake Flour', qtyUsed: 220, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 95 },
        { id: 'i2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 220, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'i3', name: 'Baking Powder', qtyUsed: 8, unitUsed: 'g', packSize: 100, packUnit: 'g', packPrice: 35 },
        { id: 'i4', name: 'Fine Table Salt', qtyUsed: 2, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 25 },
        { id: 'i5', name: 'Unsalted Butter', qtyUsed: 260, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 },
        { id: 'i6', name: 'Fresh Large Eggs', qtyUsed: 3, unitUsed: 'pcs', packSize: 30, packUnit: 'pcs', packPrice: 210 },
        { id: 'i7', name: 'Full Cream Milk', qtyUsed: 120, unitUsed: 'ml', packSize: 1, packUnit: 'l', packPrice: 68 },
        { id: 'i8', name: 'Pure Vanilla Extract / Paste', qtyUsed: 2, unitUsed: 'tsp', packSize: 50, packUnit: 'ml', packPrice: 260 },
        { id: 'i9', name: 'Icing Sugar / Powdered Sugar', qtyUsed: 250, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 90 }
      ],

      wastagePercent: 8,
      bakingTimeMinutes: 35,
      ovenWattage: 2000,
      electricityRate: 8,
      prepTimeHours: 1.0,
      decoratingTimeHours: 1.25,
      bakerHourlyRate: 200,

      packaging: [
        { id: 'pkg1', name: 'Standard 8-inch Cake Box (Window)', qty: 1, unitCost: 35 },
        { id: 'pkg2', name: 'Heavy Duty 10-inch Cake Board (MDF)', qty: 1, unitCost: 25 },
        { id: 'pkg3', name: 'Satin Ribbon Roll (1.5m)', qty: 1, unitCost: 6 },
        { id: 'pkg4', name: 'Eco Kraft Carry Bag (Large)', qty: 1, unitCost: 12 }
      ],

      decorations: [
        { id: 'dec1', name: 'Fresh Flower Cake Bundle (Gypsy/Roses)', qty: 1, unitCost: 150 },
        { id: 'dec2', name: 'Acrylic Custom Happy Birthday Topper', qty: 1, unitCost: 60 }
      ],

      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: 45,
      targetMarkupPercent: 82,
      customSellingPrice: null
    }
  ],

  // Load settings
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

  // Save settings
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

  // Load recipes
  async getRecipes() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([this.RECIPES_KEY], (res) => {
          if (res && res[this.RECIPES_KEY] && Array.isArray(res[this.RECIPES_KEY]) && res[this.RECIPES_KEY].length > 0) {
            resolve(res[this.RECIPES_KEY]);
          } else {
            // First time seeding
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
        // First time seeding
        this.saveRecipes(this.defaultRecipes);
        resolve(this.defaultRecipes);
      }
    });
  },

  // Save all recipes
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

  // Get recipe by ID
  async getRecipe(id) {
    const recipes = await this.getRecipes();
    return recipes.find(r => r.id === id) || null;
  },

  // Save or update single recipe
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

  // Delete recipe
  async deleteRecipe(id) {
    let recipes = await this.getRecipes();
    recipes = recipes.filter(r => r.id !== id);
    await this.saveRecipes(recipes);
    return recipes;
  },

  // Get Pantry Database (custom + default)
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

  // Save Pantry Database
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

  // Export full JSON backup
  async exportBackup() {
    const settings = await this.getSettings();
    const recipes = await this.getRecipes();
    const pantry = await this.getPantry();
    return JSON.stringify({
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings,
      recipes,
      pantry
    }, null, 2);
  },

  // Import JSON backup
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

  // Reset to sample state
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
