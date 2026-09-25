/**
 * BakeCost - Master Pantry & Preset Ingredients Database
 * Tailored for Cute Korean Bento Box Cakes, Gourmet Cupcakes & Artisan Bakery
 */

const DefaultPantry = {
  categories: [
    { id: 'bento_cupcake_pkg', name: '🍱 Bento Boxes & Cupcake Packaging', icon: '🍱' },
    { id: 'flours', name: '🌾 Flours & Dry Base', icon: '🌾' },
    { id: 'sugars', name: '🍬 Sugars & Sweeteners', icon: '🍬' },
    { id: 'dairy', name: '🧈 Dairy, Buttercream & Fats', icon: '🧈' },
    { id: 'chocolate', name: '🍫 Chocolates & Fillings', icon: '🍫' },
    { id: 'leavening', name: '🎨 Pastel Colors, Flavors & Extras', icon: '🎨' },
    { id: 'decorations', name: '✨ Bento Toppers, Pearls & Candles', icon: '✨' }
  ],

  items: [
    // Bento & Cupcake Packaging Presets
    { id: 'p_bento_1', name: 'Sugarcane Clamshell Bento Box (4-inch)', category: 'bento_cupcake_pkg', packSize: 50, packUnit: 'pcs', packPrice: 450, defaultUnit: 'pcs' },
    { id: 'p_bento_2', name: 'Clear Top Bento Cake Box (4.5-inch)', category: 'bento_cupcake_pkg', packSize: 25, packUnit: 'pcs', packPrice: 380, defaultUnit: 'pcs' },
    { id: 'p_bento_3', name: 'Aesthetic Bento Wax / Gingham Paper Sheet', category: 'bento_cupcake_pkg', packSize: 100, packUnit: 'sheet', packPrice: 220, defaultUnit: 'sheet' },
    { id: 'p_bento_4', name: 'Mini Eco Wooden Bento Fork / Spoon', category: 'bento_cupcake_pkg', packSize: 100, packUnit: 'pcs', packPrice: 180, defaultUnit: 'pcs' },
    { id: 'p_bento_5', name: 'Pastel Striped Bento Candle & Match', category: 'bento_cupcake_pkg', packSize: 20, packUnit: 'pcs', packPrice: 160, defaultUnit: 'pcs' },
    { id: 'p_bento_6', name: 'Aesthetic Bakery Washi Tape (Roll)', category: 'bento_cupcake_pkg', packSize: 10, packUnit: 'meter', packPrice: 85, defaultUnit: 'meter' },
    { id: 'p_bento_7', name: 'Pastel Tulip Cupcake Liners', category: 'bento_cupcake_pkg', packSize: 100, packUnit: 'pcs', packPrice: 190, defaultUnit: 'pcs' },
    { id: 'p_bento_8', name: 'Greaseproof Standard Cupcake Cups', category: 'bento_cupcake_pkg', packSize: 100, packUnit: 'pcs', packPrice: 120, defaultUnit: 'pcs' },
    { id: 'p_bento_9', name: '4-Cavity Cupcake Box with Window & Insert', category: 'bento_cupcake_pkg', packSize: 10, packUnit: 'pcs', packPrice: 200, defaultUnit: 'pcs' },
    { id: 'p_bento_10', name: '6-Cavity Cupcake Box with Window & Insert', category: 'bento_cupcake_pkg', packSize: 10, packUnit: 'pcs', packPrice: 260, defaultUnit: 'pcs' },
    { id: 'p_bento_11', name: '12-Cavity Cupcake Box with Insert', category: 'bento_cupcake_pkg', packSize: 10, packUnit: 'pcs', packPrice: 380, defaultUnit: 'pcs' },
    { id: 'p_bento_12', name: 'Standard 8-inch Cake Box (Window)', category: 'bento_cupcake_pkg', packSize: 10, packUnit: 'pcs', packPrice: 350, defaultUnit: 'pcs' },
    { id: 'p_bento_13', name: '4-inch Mini Bento Cake Board (Round)', category: 'bento_cupcake_pkg', packSize: 25, packUnit: 'pcs', packPrice: 175, defaultUnit: 'pcs' },

    // Flours & Dry Base
    { id: 'p_1', name: 'Cake Flour (Ultra Fine)', category: 'flours', packSize: 1, packUnit: 'kg', packPrice: 95, defaultUnit: 'g' },
    { id: 'p_2', name: 'All-Purpose Flour (Maida)', category: 'flours', packSize: 1, packUnit: 'kg', packPrice: 45, defaultUnit: 'g' },
    { id: 'p_3', name: 'Almond Flour', category: 'flours', packSize: 500, packUnit: 'g', packPrice: 550, defaultUnit: 'g' },
    { id: 'p_4', name: 'Cornstarch / Corn Flour', category: 'flours', packSize: 500, packUnit: 'g', packPrice: 40, defaultUnit: 'g' },

    // Sugars & Sweeteners
    { id: 'p_7', name: 'Castor Sugar / Fine Sugar', category: 'sugars', packSize: 1, packUnit: 'kg', packPrice: 65, defaultUnit: 'g' },
    { id: 'p_8', name: 'Icing Sugar / Powdered Sugar', category: 'sugars', packSize: 1, packUnit: 'kg', packPrice: 90, defaultUnit: 'g' },
    { id: 'p_9', name: 'Light Brown Sugar', category: 'sugars', packSize: 500, packUnit: 'g', packPrice: 120, defaultUnit: 'g' },
    { id: 'p_11', name: 'Sweetened Condensed Milk', category: 'sugars', packSize: 400, packUnit: 'g', packPrice: 135, defaultUnit: 'g' },

    // Dairy, Buttercream & Fats
    { id: 'p_14', name: 'Unsalted Butter (for Silky Buttercream)', category: 'dairy', packSize: 500, packUnit: 'g', packPrice: 275, defaultUnit: 'g' },
    { id: 'p_15', name: 'Amul Salted Butter', category: 'dairy', packSize: 500, packUnit: 'g', packPrice: 260, defaultUnit: 'g' },
    { id: 'p_16', name: 'Heavy Whipping Cream (35%)', category: 'dairy', packSize: 1, packUnit: 'l', packPrice: 210, defaultUnit: 'ml' },
    { id: 'p_17', name: 'Cream Cheese (e.g. D’lecta / Philadelphia)', category: 'dairy', packSize: 1, packUnit: 'kg', packPrice: 680, defaultUnit: 'g' },
    { id: 'p_18', name: 'Fresh Large Eggs', category: 'dairy', packSize: 30, packUnit: 'pcs', packPrice: 210, defaultUnit: 'pcs' },
    { id: 'p_19', name: 'Full Cream Milk', category: 'dairy', packSize: 1, packUnit: 'l', packPrice: 68, defaultUnit: 'ml' },
    { id: 'p_21', name: 'Neutral Vegetable Oil', category: 'dairy', packSize: 1, packUnit: 'l', packPrice: 145, defaultUnit: 'ml' },

    // Chocolates & Fillings
    { id: 'p_22', name: 'Dark Chocolate Couverture (55%)', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 380, defaultUnit: 'g' },
    { id: 'p_24', name: 'White Chocolate Couverture', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 420, defaultUnit: 'g' },
    { id: 'p_25', name: 'Dutch Processed Cocoa Powder', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 340, defaultUnit: 'g' },
    { id: 'p_fill_1', name: 'Strawberry Compote / Berry Puree', category: 'chocolate', packSize: 500, packUnit: 'g', packPrice: 250, defaultUnit: 'g' },
    { id: 'p_fill_2', name: 'Nutella Hazelnut Spread', category: 'chocolate', packSize: 350, packUnit: 'g', packPrice: 380, defaultUnit: 'g' },
    { id: 'p_fill_3', name: 'Lotus Biscoff Spread', category: 'chocolate', packSize: 400, packUnit: 'g', packPrice: 450, defaultUnit: 'g' },

    // Pastel Colors, Flavors & Extras
    { id: 'p_27', name: 'Baking Powder', category: 'leavening', packSize: 100, packUnit: 'g', packPrice: 35, defaultUnit: 'g' },
    { id: 'p_28', name: 'Baking Soda', category: 'leavening', packSize: 100, packUnit: 'g', packPrice: 25, defaultUnit: 'g' },
    { id: 'p_30', name: 'Pure Madagascar Vanilla Extract', category: 'leavening', packSize: 50, packUnit: 'ml', packPrice: 260, defaultUnit: 'tsp' },
    { id: 'p_col_1', name: 'Korean Pastel Gel Colors (Baby Pink/Sky/Lilac)', category: 'leavening', packSize: 25, packUnit: 'g', packPrice: 120, defaultUnit: 'tsp' },
    { id: 'p_col_2', name: 'Disposable Piping Bags (Pack of 50)', category: 'leavening', packSize: 50, packUnit: 'pcs', packPrice: 150, defaultUnit: 'pcs' },
    { id: 'p_33', name: 'Fine Table Salt', category: 'leavening', packSize: 1, packUnit: 'kg', packPrice: 25, defaultUnit: 'g' },

    // Bento Toppers, Pearls & Candles
    { id: 'p_dec_1', name: 'Mini Pastel Edible Sugar Pearls (50g)', category: 'decorations', packSize: 50, packUnit: 'g', packPrice: 110, defaultUnit: 'g' },
    { id: 'p_dec_2', name: 'Edible 24k Gold Flakes (Small Jar)', category: 'decorations', packSize: 1, packUnit: 'pcs', packPrice: 220, defaultUnit: 'pcs' },
    { id: 'p_dec_3', name: 'Pastel Bento Acrylic Mini Topper / Charm', category: 'decorations', packSize: 5, packUnit: 'pcs', packPrice: 150, defaultUnit: 'pcs' },
    { id: 'p_dec_4', name: 'Cute Teddy Bear / Daisy Sugar Charms', category: 'decorations', packSize: 10, packUnit: 'pcs', packPrice: 180, defaultUnit: 'pcs' }
  ]
};

if (typeof window !== 'undefined') {
  window.DefaultPantry = DefaultPantry;
}
