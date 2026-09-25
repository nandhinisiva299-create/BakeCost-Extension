/**
 * BakeCost - Master Pantry & Preset Ingredients Database
 */

const DefaultPantry = {
  categories: [
    { id: 'flours', name: '🌾 Flours & Grains', icon: '🌾' },
    { id: 'sugars', name: '🍬 Sugars & Sweeteners', icon: '🍬' },
    { id: 'dairy', name: '🧈 Dairy, Eggs & Fats', icon: '🧈' },
    { id: 'chocolate', name: '🍫 Chocolate & Cocoa', icon: '🍫' },
    { id: 'leavening', name: '🧪 Leaveners, Flavors & Colors', icon: '🧪' },
    { id: 'packaging', name: '📦 Boxes & Packaging', icon: '📦' },
    { id: 'decorations', name: '✨ Toppers & Decorations', icon: '✨' }
  ],

  items: [
    // Flours & Grains
    { id: 'p_1', name: 'All-Purpose Flour (Maida)', category: 'flours', packSize: 1, packUnit: 'kg', packPrice: 45, defaultUnit: 'g' },
    { id: 'p_2', name: 'Cake Flour', category: 'flours', packSize: 1, packUnit: 'kg', packPrice: 95, defaultUnit: 'g' },
    { id: 'p_3', name: 'Almond Flour', category: 'flours', packSize: 500, packUnit: 'g', packPrice: 550, defaultUnit: 'g' },
    { id: 'p_4', name: 'Cornstarch / Corn Flour', category: 'flours', packSize: 500, packUnit: 'g', packPrice: 40, defaultUnit: 'g' },
    { id: 'p_5', name: 'Whole Wheat Flour (Atta)', category: 'flours', packSize: 1, packUnit: 'kg', packPrice: 48, defaultUnit: 'g' },
    { id: 'p_6', name: 'Bread Flour', category: 'flours', packSize: 1, packUnit: 'kg', packPrice: 85, defaultUnit: 'g' },

    // Sugars & Sweeteners
    { id: 'p_7', name: 'Castor Sugar / Fine Sugar', category: 'sugars', packSize: 1, packUnit: 'kg', packPrice: 65, defaultUnit: 'g' },
    { id: 'p_8', name: 'Icing Sugar / Powdered Sugar', category: 'sugars', packSize: 1, packUnit: 'kg', packPrice: 90, defaultUnit: 'g' },
    { id: 'p_9', name: 'Light Brown Sugar', category: 'sugars', packSize: 500, packUnit: 'g', packPrice: 120, defaultUnit: 'g' },
    { id: 'p_10', name: 'Dark Brown Sugar', category: 'sugars', packSize: 500, packUnit: 'g', packPrice: 140, defaultUnit: 'g' },
    { id: 'p_11', name: 'Sweetened Condensed Milk', category: 'sugars', packSize: 400, packUnit: 'g', packPrice: 135, defaultUnit: 'g' },
    { id: 'p_12', name: 'Pure Honey', category: 'sugars', packSize: 500, packUnit: 'g', packPrice: 220, defaultUnit: 'g' },
    { id: 'p_13', name: 'Liquid Glucose / Corn Syrup', category: 'sugars', packSize: 500, packUnit: 'g', packPrice: 160, defaultUnit: 'g' },

    // Dairy, Eggs & Fats
    { id: 'p_14', name: 'Unsalted Butter', category: 'dairy', packSize: 500, packUnit: 'g', packPrice: 275, defaultUnit: 'g' },
    { id: 'p_15', name: 'Amul Salted Butter', category: 'dairy', packSize: 500, packUnit: 'g', packPrice: 260, defaultUnit: 'g' },
    { id: 'p_16', name: 'Heavy Whipping Cream (35%)', category: 'dairy', packSize: 1, packUnit: 'l', packPrice: 210, defaultUnit: 'ml' },
    { id: 'p_17', name: 'Cream Cheese (e.g. D’lecta / Philadelphia)', category: 'dairy', packSize: 1, packUnit: 'kg', packPrice: 680, defaultUnit: 'g' },
    { id: 'p_18', name: 'Fresh Large Eggs', category: 'dairy', packSize: 30, packUnit: 'pcs', packPrice: 210, defaultUnit: 'pcs' },
    { id: 'p_19', name: 'Full Cream Milk', category: 'dairy', packSize: 1, packUnit: 'l', packPrice: 68, defaultUnit: 'ml' },
    { id: 'p_20', name: 'Mascarpone Cheese', category: 'dairy', packSize: 500, packUnit: 'g', packPrice: 420, defaultUnit: 'g' },
    { id: 'p_21', name: 'Neutral Vegetable Oil / Sunflower Oil', category: 'dairy', packSize: 1, packUnit: 'l', packPrice: 145, defaultUnit: 'ml' },

    // Chocolate & Cocoa
    { id: 'p_22', name: 'Dark Chocolate Couverture (55%)', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 380, defaultUnit: 'g' },
    { id: 'p_23', name: 'Dark Compound Chocolate', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 160, defaultUnit: 'g' },
    { id: 'p_24', name: 'White Chocolate Couverture', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 420, defaultUnit: 'g' },
    { id: 'p_25', name: 'Dutch Processed Cocoa Powder', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 340, defaultUnit: 'g' },
    { id: 'p_26', name: 'Semi-Sweet Chocolate Chips', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 220, defaultUnit: 'g' },

    // Leaveners, Flavors & Colors
    { id: 'p_27', name: 'Baking Powder', category: 'leavening', packSize: 100, packUnit: 'g', packPrice: 35, defaultUnit: 'g' },
    { id: 'p_28', name: 'Baking Soda', category: 'leavening', packSize: 100, packUnit: 'g', packPrice: 25, defaultUnit: 'g' },
    { id: 'p_29', name: 'Instant Active Dry Yeast', category: 'leavening', packSize: 100, packUnit: 'g', packPrice: 80, defaultUnit: 'g' },
    { id: 'p_30', name: 'Pure Vanilla Extract / Paste', category: 'leavening', packSize: 50, packUnit: 'ml', packPrice: 260, defaultUnit: 'tsp' },
    { id: 'p_31', name: 'Synthetic Vanilla Essence', category: 'leavening', packSize: 100, packUnit: 'ml', packPrice: 55, defaultUnit: 'tsp' },
    { id: 'p_32', name: 'Gel Food Color', category: 'leavening', packSize: 25, packUnit: 'g', packPrice: 110, defaultUnit: 'tsp' },
    { id: 'p_33', name: 'Fine Table Salt', category: 'leavening', packSize: 1, packUnit: 'kg', packPrice: 25, defaultUnit: 'g' },

    // Packaging Defaults
    { id: 'p_34', name: 'Standard 8-inch Cake Box (Window)', category: 'packaging', packSize: 10, packUnit: 'pcs', packPrice: 350, defaultUnit: 'pcs' },
    { id: 'p_35', name: 'Standard 10-inch Cake Box (Tall)', category: 'packaging', packSize: 10, packUnit: 'pcs', packPrice: 480, defaultUnit: 'pcs' },
    { id: 'p_36', name: 'Heavy Duty 10-inch Cake Board (MDF)', category: 'packaging', packSize: 10, packUnit: 'pcs', packPrice: 250, defaultUnit: 'pcs' },
    { id: 'p_37', name: '6-Cavity Cupcake Box with Insert', category: 'packaging', packSize: 10, packUnit: 'pcs', packPrice: 220, defaultUnit: 'pcs' },
    { id: 'p_38', name: 'Satin Ribbon Roll (25m)', category: 'packaging', packSize: 25, packUnit: 'meter', packPrice: 90, defaultUnit: 'meter' },
    { id: 'p_39', name: 'Eco Kraft Carry Bag (Large)', category: 'packaging', packSize: 25, packUnit: 'pcs', packPrice: 300, defaultUnit: 'pcs' },
    { id: 'p_40', name: 'Branded Thank You Stickers (Roll of 100)', category: 'packaging', packSize: 100, packUnit: 'pcs', packPrice: 180, defaultUnit: 'pcs' },
    { id: 'p_41', name: 'Cake Knife & Sparkle Candle Set', category: 'packaging', packSize: 10, packUnit: 'pcs', packPrice: 150, defaultUnit: 'pcs' },

    // Decorations Defaults
    { id: 'p_42', name: 'Acrylic Custom Happy Birthday Topper', category: 'decorations', packSize: 5, packUnit: 'pcs', packPrice: 300, defaultUnit: 'pcs' },
    { id: 'p_43', name: 'Edible 24k Gold Leaf Sheets', category: 'decorations', packSize: 5, packUnit: 'sheet', packPrice: 350, defaultUnit: 'sheet' },
    { id: 'p_44', name: 'Assorted Gourmet Sprinkles Mix', category: 'decorations', packSize: 250, packUnit: 'g', packPrice: 280, defaultUnit: 'g' },
    { id: 'p_45', name: 'Fresh Flower Cake Bundle (Gypsy/Roses)', category: 'decorations', packSize: 1, packUnit: 'pack', packPrice: 150, defaultUnit: 'pack' },
    { id: 'p_46', name: 'White Sugar Fondant (Satin Ice / Vizyon)', category: 'decorations', packSize: 1, packUnit: 'kg', packPrice: 320, defaultUnit: 'g' }
  ]
};

if (typeof window !== 'undefined') {
  window.DefaultPantry = DefaultPantry;
}
