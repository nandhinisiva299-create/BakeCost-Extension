/**
 * BakeCost - Main Application Controller & UI State Manager
 */

const App = {
  currentRecipe: null,
  settings: {},
  recipes: [],
  pantry: [],
  activeTab: 'studio',
  currentScale: 1.0,

  async init() {
    console.log('[BakeCost] Initializing App...');
    
    // Load Settings, Recipes, Pantry from storage
    this.settings = await StorageManager.getSettings();
    this.recipes = await StorageManager.getRecipes();
    this.pantry = await StorageManager.getPantry();

    // Apply theme
    this.applyTheme(this.settings.theme || 'light');

    // Setup active recipe (first recipe or new default)
    if (this.recipes.length > 0) {
      this.currentRecipe = JSON.parse(JSON.stringify(this.recipes[0]));
    } else {
      this.createNewRecipe();
    }

    // Attach DOM Event Listeners
    this.bindEvents();

    // Render Initial UI
    this.renderAll();
    
    console.log('[BakeCost] App initialized.');
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.settings.theme = next;
    this.applyTheme(next);
    StorageManager.saveSettings(this.settings);
    this.showToast(`Switched to ${next} mode`, 'success');
  },

  createNewRecipe() {
    this.currentRecipe = {
      id: 'rec_' + Date.now(),
      name: 'Untitled Recipe',
      category: 'Cakes',
      description: '',
      yieldAmount: 1,
      yieldUnit: 'kg',
      servingCount: 8,
      scaleFactor: 1.0,
      ingredients: [
        { id: 'ing_1', name: 'All-Purpose Flour (Maida)', qtyUsed: 250, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 45 },
        { id: 'ing_2', name: 'Castor Sugar / Fine Sugar', qtyUsed: 200, unitUsed: 'g', packSize: 1, packUnit: 'kg', packPrice: 65 },
        { id: 'ing_3', name: 'Unsalted Butter', qtyUsed: 150, unitUsed: 'g', packSize: 500, packUnit: 'g', packPrice: 275 }
      ],
      wastagePercent: this.settings.defaultWastagePercent || 8,
      bakingTimeMinutes: 35,
      ovenWattage: this.settings.ovenWattage || 2000,
      electricityRate: this.settings.electricityRatePerKwh || 8,
      prepTimeHours: 0.75,
      decoratingTimeHours: 0.5,
      bakerHourlyRate: this.settings.bakerHourlyRate || 200,
      packaging: [
        { id: 'pkg_1', name: 'Standard 8-inch Cake Box (Window)', qty: 1, unitCost: 35 },
        { id: 'pkg_2', name: 'Heavy Duty 10-inch Cake Board (MDF)', qty: 1, unitCost: 25 }
      ],
      decorations: [],
      deliveryCost: 0,
      pricingType: 'margin',
      targetMarginPercent: this.settings.defaultMarginPercent || 45,
      targetMarkupPercent: 80,
      customSellingPrice: 0
    };
    this.currentScale = 1.0;
  },

  bindEvents() {
    // Tab switching
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // New Recipe button
    const newBtn = document.getElementById('btn-new-recipe');
    if (newBtn) {
      newBtn.addEventListener('click', () => {
        this.createNewRecipe();
        this.switchTab('studio');
        this.renderStudio();
        this.showToast('Created new blank recipe canvas', 'info');
      });
    }

    // Save Recipe buttons
    document.querySelectorAll('#btn-save-recipe, .btn-save-recipe').forEach(btn => {
      btn.addEventListener('click', () => this.saveCurrentRecipe());
    });

    // Duplicate Recipe buttons
    document.querySelectorAll('#btn-duplicate-recipe, .btn-duplicate-recipe').forEach(btn => {
      btn.addEventListener('click', () => this.duplicateCurrentRecipe());
    });

    // Studio basic details inputs
    const recipeNameInput = document.getElementById('recipe-name-input');
    if (recipeNameInput) {
      recipeNameInput.addEventListener('input', (e) => {
        this.currentRecipe.name = e.target.value;
        this.updateCalculations();
      });
    }

    const recipeCatInput = document.getElementById('recipe-category-select');
    if (recipeCatInput) {
      recipeCatInput.addEventListener('change', (e) => {
        this.currentRecipe.category = e.target.value;
      });
    }

    const yieldAmountInput = document.getElementById('recipe-yield-amount');
    if (yieldAmountInput) {
      yieldAmountInput.addEventListener('input', (e) => {
        this.currentRecipe.yieldAmount = parseFloat(e.target.value) || 1;
        this.updateCalculations();
      });
    }

    const yieldUnitInput = document.getElementById('recipe-yield-unit');
    if (yieldUnitInput) {
      yieldUnitInput.addEventListener('input', (e) => {
        this.currentRecipe.yieldUnit = e.target.value || 'portion';
        this.updateCalculations();
      });
    }

    const servingsInput = document.getElementById('recipe-servings-count');
    if (servingsInput) {
      servingsInput.addEventListener('input', (e) => {
        this.currentRecipe.servingCount = parseInt(e.target.value) || 1;
        this.updateCalculations();
      });
    }

    // Scale buttons
    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentScale = parseFloat(e.currentTarget.dataset.scale) || 1.0;
        this.currentRecipe.scaleFactor = this.currentScale;
        this.renderIngredientsTable();
        this.updateCalculations();
      });
    });

    // Add Ingredient button
    const addIngBtn = document.getElementById('btn-add-ingredient');
    if (addIngBtn) {
      addIngBtn.addEventListener('click', () => {
        this.currentRecipe.ingredients.push({
          id: 'ing_' + Date.now(),
          name: '',
          qtyUsed: 100,
          unitUsed: 'g',
          packSize: 1,
          packUnit: 'kg',
          packPrice: 50
        });
        this.renderIngredientsTable();
        this.updateCalculations();
      });
    }

    // Pantry Quick Pick modal trigger
    const quickPickBtn = document.getElementById('btn-pantry-picker');
    if (quickPickBtn) {
      quickPickBtn.addEventListener('click', () => this.openPantryModal());
    }

    // Pricing Strategy Tabs
    document.querySelectorAll('.strategy-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.strategy-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.dataset.strategy;
        this.currentRecipe.pricingType = mode;
        this.renderStrategyInputs();
        this.updateCalculations();
      });
    });

    // Margin Slider
    const marginSlider = document.getElementById('margin-slider');
    if (marginSlider) {
      marginSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 40;
        this.currentRecipe.targetMarginPercent = val;
        const disp = document.getElementById('margin-slider-value');
        if (disp) disp.textContent = val + '%';
        this.updateCalculations();
      });
    }

    // Markup Slider
    const markupSlider = document.getElementById('markup-slider');
    if (markupSlider) {
      markupSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 80;
        this.currentRecipe.targetMarkupPercent = val;
        const disp = document.getElementById('markup-slider-value');
        if (disp) disp.textContent = val + '%';
        this.updateCalculations();
      });
    }

    // Custom Price Input
    const customPriceInput = document.getElementById('custom-price-input');
    if (customPriceInput) {
      customPriceInput.addEventListener('input', (e) => {
        this.currentRecipe.customSellingPrice = parseFloat(e.target.value) || 0;
        this.updateCalculations();
      });
    }

    // Overhead Accordion toggles
    document.querySelectorAll('.overhead-header').forEach(hdr => {
      hdr.addEventListener('click', (e) => {
        const section = e.currentTarget.closest('.overhead-section');
        const content = section.querySelector('.overhead-content');
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        const icon = hdr.querySelector('.toggle-icon');
        if (icon) icon.textContent = isHidden ? '▲' : '▼';
      });
    });

    // Overhead Inputs
    this.bindOverheadInputs();

    // Packaging & Decoration Add buttons
    const addPkgBtn = document.getElementById('btn-add-pkg');
    if (addPkgBtn) {
      addPkgBtn.addEventListener('click', () => {
        this.currentRecipe.packaging = this.currentRecipe.packaging || [];
        this.currentRecipe.packaging.push({
          id: 'pkg_' + Date.now(),
          name: 'Custom Box / Bag',
          qty: 1,
          unitCost: 20
        });
        this.renderPackagingList();
        this.updateCalculations();
      });
    }

    const addDecBtn = document.getElementById('btn-add-dec');
    if (addDecBtn) {
      addDecBtn.addEventListener('click', () => {
        this.currentRecipe.decorations = this.currentRecipe.decorations || [];
        this.currentRecipe.decorations.push({
          id: 'dec_' + Date.now(),
          name: 'Custom Topper / Charm',
          qty: 1,
          unitCost: 50
        });
        this.renderDecorationsList();
        this.updateCalculations();
      });
    }

    // WhatsApp Formatter Events
    this.bindWhatsAppEvents();

    // Unit Converter Events
    this.bindConverterEvents();

    // Settings Form Events
    this.bindSettingsEvents();

    // Export / Import Events
    this.bindBackupEvents();
  },

  bindOverheadInputs() {
    const wastageInput = document.getElementById('overhead-wastage');
    if (wastageInput) {
      wastageInput.addEventListener('input', (e) => {
        this.currentRecipe.wastagePercent = parseFloat(e.target.value) || 0;
        const disp = document.getElementById('overhead-wastage-val');
        if (disp) disp.textContent = e.target.value + '%';
        this.updateCalculations();
      });
    }

    const bakeTimeInput = document.getElementById('overhead-bake-time');
    if (bakeTimeInput) {
      bakeTimeInput.addEventListener('input', (e) => {
        this.currentRecipe.bakingTimeMinutes = parseFloat(e.target.value) || 0;
        this.updateCalculations();
      });
    }

    const ovenWattInput = document.getElementById('overhead-oven-watt');
    if (ovenWattInput) {
      ovenWattInput.addEventListener('input', (e) => {
        this.currentRecipe.ovenWattage = parseFloat(e.target.value) || 2000;
        this.updateCalculations();
      });
    }

    const prepTimeInput = document.getElementById('overhead-prep-time');
    if (prepTimeInput) {
      prepTimeInput.addEventListener('input', (e) => {
        this.currentRecipe.prepTimeHours = parseFloat(e.target.value) || 0;
        this.updateCalculations();
      });
    }

    const decTimeInput = document.getElementById('overhead-dec-time');
    if (decTimeInput) {
      decTimeInput.addEventListener('input', (e) => {
        this.currentRecipe.decoratingTimeHours = parseFloat(e.target.value) || 0;
        this.updateCalculations();
      });
    }

    const laborWageInput = document.getElementById('overhead-labor-rate');
    if (laborWageInput) {
      laborWageInput.addEventListener('input', (e) => {
        this.currentRecipe.bakerHourlyRate = parseFloat(e.target.value) || 0;
        this.updateCalculations();
      });
    }

    const deliveryInput = document.getElementById('overhead-delivery-cost');
    if (deliveryInput) {
      deliveryInput.addEventListener('input', (e) => {
        this.currentRecipe.deliveryCost = parseFloat(e.target.value) || 0;
        this.updateCalculations();
      });
    }
  },

  bindWhatsAppEvents() {
    const generateBtn = document.getElementById('btn-copy-whatsapp');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        const text = document.getElementById('whatsapp-preview-box').innerText;
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('Copied WhatsApp quote to clipboard! 📋', 'success');
        });
      });
    }

    const printClientBtn = document.getElementById('btn-print-client-quote');
    if (printClientBtn) {
      printClientBtn.addEventListener('click', () => {
        const calc = BakeCostCalculator.calculate(this.currentRecipe, this.settings);
        const html = QuoteGenerator.generatePrintableCostSheet(this.currentRecipe, calc, this.settings, 'client');
        this.openPrintWindow(html);
      });
    }

    const printCostSheetBtn = document.getElementById('btn-print-cost-sheet');
    if (printCostSheetBtn) {
      printCostSheetBtn.addEventListener('click', () => {
        const calc = BakeCostCalculator.calculate(this.currentRecipe, this.settings);
        const html = QuoteGenerator.generatePrintableCostSheet(this.currentRecipe, calc, this.settings, 'internal');
        this.openPrintWindow(html);
      });
    }

    ['quote-client-name', 'quote-delivery-date', 'quote-notes'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.renderWhatsAppPreview());
      }
    });
  },

  openPrintWindow(htmlContent) {
    const printWin = window.open('', '_blank', 'width=850,height=900');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(htmlContent);
      printWin.document.close();
    }
  },

  bindConverterEvents() {
    const convInput = document.getElementById('conv-amount');
    const convFrom = document.getElementById('conv-from-unit');
    const convTo = document.getElementById('conv-to-unit');
    const convIng = document.getElementById('conv-ingredient');

    const updateConv = () => {
      if (!convInput || !convFrom || !convTo || !convIng) return;
      const amount = parseFloat(convInput.value) || 0;
      const result = UnitConverter.convert(amount, convFrom.value, convTo.value, convIng.value);
      const resDisplay = document.getElementById('conv-result-val');
      if (resDisplay) {
        resDisplay.textContent = `${result.toFixed(2)} ${convTo.value}`;
      }
    };

    [convInput, convFrom, convTo, convIng].forEach(el => {
      if (el) {
        el.addEventListener('input', updateConv);
        el.addEventListener('change', updateConv);
      }
    });
  },

  bindSettingsEvents() {
    const form = document.getElementById('bakery-settings-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.settings.bakeryName = document.getElementById('set-bakery-name').value;
        this.settings.bakerName = document.getElementById('set-baker-name').value;
        this.settings.contactNumber = document.getElementById('set-contact-phone').value;
        this.settings.instagramHandle = document.getElementById('set-instagram').value;
        this.settings.currency = document.getElementById('set-currency-symbol').value;
        this.settings.currencyCode = document.getElementById('set-currency-code').value;
        this.settings.electricityRatePerKwh = parseFloat(document.getElementById('set-electricity-rate').value) || 8;
        this.settings.ovenWattage = parseFloat(document.getElementById('set-oven-wattage').value) || 2000;
        this.settings.bakerHourlyRate = parseFloat(document.getElementById('set-hourly-rate').value) || 200;
        this.settings.defaultWastagePercent = parseFloat(document.getElementById('set-default-wastage').value) || 8;
        this.settings.defaultMarginPercent = parseFloat(document.getElementById('set-default-margin').value) || 45;

        await StorageManager.saveSettings(this.settings);
        this.renderAll();
        this.showToast('Bakery settings saved successfully! ✨', 'success');
      });
    }
  },

  bindBackupEvents() {
    const exportBtn = document.getElementById('btn-export-backup');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const json = await StorageManager.exportBackup();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BakeCost_Backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Exported full bakery data backup! 📦', 'success');
      });
    }

    const importInput = document.getElementById('import-file-input');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const res = await StorageManager.importBackup(ev.target.result);
          if (res.success) {
            this.settings = await StorageManager.getSettings();
            this.recipes = await StorageManager.getRecipes();
            this.pantry = await StorageManager.getPantry();
            if (this.recipes.length > 0) this.currentRecipe = this.recipes[0];
            this.renderAll();
            this.showToast(`Imported ${res.count} recipes successfully! 🎉`, 'success');
          } else {
            this.showToast('Import error: Invalid file format', 'danger');
          }
        };
        reader.readAsText(file);
      });
    }

    const resetBtn = document.getElementById('btn-reset-defaults');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('Reset all recipes, pantry, and settings to original demo data?')) {
          await StorageManager.resetToDefaults();
          this.settings = await StorageManager.getSettings();
          this.recipes = await StorageManager.getRecipes();
          this.pantry = await StorageManager.getPantry();
          this.currentRecipe = JSON.parse(JSON.stringify(this.recipes[0]));
          this.renderAll();
          this.showToast('Reset to original sample recipes! 🍰', 'info');
        }
      });
    }
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabId}`);
    });

    if (tabId === 'recipes') {
      this.renderRecipesGrid();
    } else if (tabId === 'pantry') {
      this.renderPantryManager();
    } else if (tabId === 'quotes') {
      this.renderWhatsAppPreview();
    } else if (tabId === 'settings') {
      this.renderSettingsForm();
    } else if (tabId === 'studio') {
      this.renderStudio();
    }
  },

  renderAll() {
    this.renderStudio();
    this.renderRecipesGrid();
    this.renderPantryManager();
    this.renderWhatsAppPreview();
    this.renderSettingsForm();
  },

  renderStudio() {
    if (!this.currentRecipe) return;

    // Set Form Fields
    const nameInput = document.getElementById('recipe-name-input');
    if (nameInput) nameInput.value = this.currentRecipe.name || '';

    const catSelect = document.getElementById('recipe-category-select');
    if (catSelect) catSelect.value = this.currentRecipe.category || 'Cakes';

    const yieldAmount = document.getElementById('recipe-yield-amount');
    if (yieldAmount) yieldAmount.value = this.currentRecipe.yieldAmount || 1;

    const yieldUnit = document.getElementById('recipe-yield-unit');
    if (yieldUnit) yieldUnit.value = this.currentRecipe.yieldUnit || 'kg';

    const servings = document.getElementById('recipe-servings-count');
    if (servings) servings.value = this.currentRecipe.servingCount || 10;

    // Overheads fields
    const wastage = document.getElementById('overhead-wastage');
    if (wastage) {
      wastage.value = this.currentRecipe.wastagePercent || 8;
      const disp = document.getElementById('overhead-wastage-val');
      if (disp) disp.textContent = (this.currentRecipe.wastagePercent || 8) + '%';
    }

    const bakeTime = document.getElementById('overhead-bake-time');
    if (bakeTime) bakeTime.value = this.currentRecipe.bakingTimeMinutes || 35;

    const ovenWatt = document.getElementById('overhead-oven-watt');
    if (ovenWatt) ovenWatt.value = this.currentRecipe.ovenWattage || 2000;

    const prepTime = document.getElementById('overhead-prep-time');
    if (prepTime) prepTime.value = this.currentRecipe.prepTimeHours || 0.75;

    const decTime = document.getElementById('overhead-dec-time');
    if (decTime) decTime.value = this.currentRecipe.decoratingTimeHours || 0.5;

    const laborRate = document.getElementById('overhead-labor-rate');
    if (laborRate) laborRate.value = this.currentRecipe.bakerHourlyRate || this.settings.bakerHourlyRate || 200;

    const deliveryCost = document.getElementById('overhead-delivery-cost');
    if (deliveryCost) deliveryCost.value = this.currentRecipe.deliveryCost || 0;

    // Strategy tabs & sliders
    const strat = this.currentRecipe.pricingType || 'margin';
    document.querySelectorAll('.strategy-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.strategy === strat);
    });
    this.renderStrategyInputs();

    this.renderIngredientsTable();
    this.renderPackagingList();
    this.renderDecorationsList();
    this.updateCalculations();
  },

  renderStrategyInputs() {
    const strat = this.currentRecipe.pricingType || 'margin';
    const marginGroup = document.getElementById('strategy-margin-group');
    const markupGroup = document.getElementById('strategy-markup-group');
    const customGroup = document.getElementById('strategy-custom-group');

    if (marginGroup) marginGroup.style.display = strat === 'margin' ? 'block' : 'none';
    if (markupGroup) markupGroup.style.display = strat === 'markup' ? 'block' : 'none';
    if (customGroup) customGroup.style.display = strat === 'custom' ? 'block' : 'none';

    if (strat === 'margin') {
      const slider = document.getElementById('margin-slider');
      if (slider) slider.value = this.currentRecipe.targetMarginPercent || 45;
      const disp = document.getElementById('margin-slider-value');
      if (disp) disp.textContent = (this.currentRecipe.targetMarginPercent || 45) + '%';
    } else if (strat === 'markup') {
      const slider = document.getElementById('markup-slider');
      if (slider) slider.value = this.currentRecipe.targetMarkupPercent || 80;
      const disp = document.getElementById('markup-slider-value');
      if (disp) disp.textContent = (this.currentRecipe.targetMarkupPercent || 80) + '%';
    } else if (strat === 'custom') {
      const inp = document.getElementById('custom-price-input');
      if (inp) inp.value = this.currentRecipe.customSellingPrice || '';
    }
  },

  renderIngredientsTable() {
    const tbody = document.getElementById('ingredients-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const currency = this.settings.currency || '₹';

    (this.currentRecipe.ingredients || []).forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.className = 'ingredient-row';
      tr.dataset.index = index;

      const scaledQty = (parseFloat(item.qtyUsed) || 0) * (this.currentScale || 1);
      const itemCost = UnitConverter.calculateItemCost(
        scaledQty,
        item.unitUsed,
        item.packSize,
        item.packUnit,
        item.packPrice,
        item.name
      );

      tr.innerHTML = `
        <td>
          <input type="text" class="form-control ing-name-input" value="${item.name || ''}" placeholder="e.g. Flour" list="pantry-datalist" data-field="name">
        </td>
        <td>
          <input type="number" step="any" min="0" class="form-control ing-qty-input" value="${item.qtyUsed}" data-field="qtyUsed">
        </td>
        <td>
          <select class="form-control ing-unit-select" data-field="unitUsed">
            ${this.getUnitOptions(item.unitUsed)}
          </select>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 4px;">
            <input type="number" step="any" min="0" class="form-control ing-pack-input" value="${item.packSize}" data-field="packSize" title="Pack Size">
            <select class="form-control ing-unit-select" data-field="packUnit">
              ${this.getUnitOptions(item.packUnit)}
            </select>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center;">
            <span style="font-weight: 600; margin-right: 4px; color: var(--text-muted);">${currency}</span>
            <input type="number" step="any" min="0" class="form-control ing-pack-input" value="${item.packPrice}" data-field="packPrice" title="Pack Price">
          </div>
        </td>
        <td class="ing-cost-display text-right">
          ${currency}${itemCost.toFixed(2)}
        </td>
        <td class="text-right">
          <button type="button" class="btn btn-ghost btn-sm btn-icon btn-remove-ing" title="Delete Ingredient">✕</button>
        </td>
      `;

      // Event listeners for row inputs
      tr.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', (e) => {
          const field = e.target.dataset.field;
          const val = e.target.value;
          
          if (field === 'name') {
            item.name = val;
            // Check if matches pantry item to auto-populate pack details
            const matched = this.pantry.find(p => p.name.toLowerCase() === val.trim().toLowerCase());
            if (matched) {
              item.packSize = matched.packSize;
              item.packUnit = matched.packUnit;
              item.packPrice = matched.packPrice;
              item.unitUsed = matched.defaultUnit || item.unitUsed;
              this.renderIngredientsTable();
            }
          } else if (field === 'qtyUsed' || field === 'packSize' || field === 'packPrice') {
            item[field] = parseFloat(val) || 0;
          } else {
            item[field] = val;
          }
          
          this.updateCalculations();
        });
      });

      // Remove row
      tr.querySelector('.btn-remove-ing').addEventListener('click', () => {
        this.currentRecipe.ingredients.splice(index, 1);
        this.renderIngredientsTable();
        this.updateCalculations();
      });

      tbody.appendChild(tr);
    });

    this.renderPantryDatalist();
  },

  getUnitOptions(selected) {
    const units = [
      { u: 'g', label: 'g' },
      { u: 'kg', label: 'kg' },
      { u: 'ml', label: 'ml' },
      { u: 'l', label: 'L' },
      { u: 'tsp', label: 'tsp' },
      { u: 'tbsp', label: 'tbsp' },
      { u: 'cup', label: 'cup' },
      { u: 'pcs', label: 'pcs' },
      { u: 'oz', label: 'oz' },
      { u: 'lb', label: 'lb' },
      { u: 'meter', label: 'meter' },
      { u: 'sheet', label: 'sheet' }
    ];

    return units.map(un => `
      <option value="${un.u}" ${un.u === selected ? 'selected' : ''}>${un.label}</option>
    `).join('');
  },

  renderPantryDatalist() {
    let datalist = document.getElementById('pantry-datalist');
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = 'pantry-datalist';
      document.body.appendChild(datalist);
    }
    datalist.innerHTML = this.pantry.map(p => `<option value="${p.name}"></option>`).join('');
  },

  renderPackagingList() {
    const container = document.getElementById('packaging-list-container');
    if (!container) return;

    container.innerHTML = '';
    const currency = this.settings.currency || '₹';

    (this.currentRecipe.packaging || []).forEach((pkg, index) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-bottom: 8px;';
      row.innerHTML = `
        <input type="text" class="form-control" style="flex: 2;" value="${pkg.name || ''}" placeholder="Box / Board / Ribbon">
        <div style="display: flex; align-items: center; gap: 4px; flex: 1;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Qty:</span>
          <input type="number" step="any" min="0" class="form-control" value="${pkg.qty}" style="width: 55px;">
        </div>
        <div style="display: flex; align-items: center; gap: 4px; flex: 1.2;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">${currency}</span>
          <input type="number" step="any" min="0" class="form-control" value="${pkg.unitCost}" style="width: 70px;">
        </div>
        <span style="font-weight: 700; color: var(--text-main); width: 60px; text-align: right;">
          ${currency}${((parseFloat(pkg.qty) || 0) * (parseFloat(pkg.unitCost) || 0)).toFixed(1)}
        </span>
        <button type="button" class="btn btn-ghost btn-sm btn-icon btn-remove-pkg">✕</button>
      `;

      const inputs = row.querySelectorAll('input');
      inputs[0].addEventListener('input', (e) => { pkg.name = e.target.value; });
      inputs[1].addEventListener('input', (e) => { pkg.qty = parseFloat(e.target.value) || 0; this.updateCalculations(); });
      inputs[2].addEventListener('input', (e) => { pkg.unitCost = parseFloat(e.target.value) || 0; this.updateCalculations(); });

      row.querySelector('.btn-remove-pkg').addEventListener('click', () => {
        this.currentRecipe.packaging.splice(index, 1);
        this.renderPackagingList();
        this.updateCalculations();
      });

      container.appendChild(row);
    });
  },

  renderDecorationsList() {
    const container = document.getElementById('decorations-list-container');
    if (!container) return;

    container.innerHTML = '';
    const currency = this.settings.currency || '₹';

    (this.currentRecipe.decorations || []).forEach((dec, index) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-bottom: 8px;';
      row.innerHTML = `
        <input type="text" class="form-control" style="flex: 2;" value="${dec.name || ''}" placeholder="Topper / Flowers / Gold Leaf">
        <div style="display: flex; align-items: center; gap: 4px; flex: 1;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Qty:</span>
          <input type="number" step="any" min="0" class="form-control" value="${dec.qty}" style="width: 55px;">
        </div>
        <div style="display: flex; align-items: center; gap: 4px; flex: 1.2;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">${currency}</span>
          <input type="number" step="any" min="0" class="form-control" value="${dec.unitCost}" style="width: 70px;">
        </div>
        <span style="font-weight: 700; color: var(--text-main); width: 60px; text-align: right;">
          ${currency}${((parseFloat(dec.qty) || 0) * (parseFloat(dec.unitCost) || 0)).toFixed(1)}
        </span>
        <button type="button" class="btn btn-ghost btn-sm btn-icon btn-remove-dec">✕</button>
      `;

      const inputs = row.querySelectorAll('input');
      inputs[0].addEventListener('input', (e) => { dec.name = e.target.value; });
      inputs[1].addEventListener('input', (e) => { dec.qty = parseFloat(e.target.value) || 0; this.updateCalculations(); });
      inputs[2].addEventListener('input', (e) => { dec.unitCost = parseFloat(e.target.value) || 0; this.updateCalculations(); });

      row.querySelector('.btn-remove-dec').addEventListener('click', () => {
        this.currentRecipe.decorations.splice(index, 1);
        this.renderDecorationsList();
        this.updateCalculations();
      });

      container.appendChild(row);
    });
  },

  updateCalculations() {
    if (!this.currentRecipe) return;

    this.currentRecipe.scaleFactor = this.currentScale || 1.0;
    const calc = BakeCostCalculator.calculate(this.currentRecipe, this.settings);
    const currency = this.settings.currency || '₹';

    // Update Live Pricing Hero Display
    const priceDisplay = document.getElementById('hero-selling-price');
    if (priceDisplay) {
      priceDisplay.textContent = Math.round(calc.sellingPrice).toLocaleString();
    }

    const priceUnitSub = document.getElementById('hero-price-unit-sub');
    if (priceUnitSub) {
      priceUnitSub.textContent = `for ${calc.yieldAmount} ${calc.yieldUnit} (${currency}${Math.round(calc.pricePerUnit).toLocaleString()}/${calc.yieldUnit} • ${currency}${Math.round(calc.pricePerServing).toLocaleString()}/serving)`;
    }

    // Update Stat Pills
    const statTotalCost = document.getElementById('stat-total-cost');
    if (statTotalCost) statTotalCost.textContent = `${currency}${calc.totalProductionCost.toFixed(2)}`;

    const statNetProfit = document.getElementById('stat-net-profit');
    if (statNetProfit) statNetProfit.textContent = `${currency}${calc.netProfit.toFixed(2)} (${calc.actualMarginPercent.toFixed(0)}%)`;

    const statIngredients = document.getElementById('stat-ingredients-cost');
    if (statIngredients) statIngredients.textContent = `${currency}${calc.totalIngredientsCost.toFixed(2)}`;

    const statOverhead = document.getElementById('stat-overhead-cost');
    if (statOverhead) statOverhead.textContent = `${currency}${(calc.laborCost + calc.energyCost + calc.packagingCost + calc.decorationsCost + calc.deliveryCost).toFixed(2)}`;

    // Update Tiered Pricing badges
    const tierFloor = document.getElementById('tier-floor-price');
    if (tierFloor) tierFloor.textContent = `${currency}${Math.round(calc.tieredPricing.floorPrice).toLocaleString()}`;

    const tierBreakEven = document.getElementById('tier-breakeven-price');
    if (tierBreakEven) tierBreakEven.textContent = `${currency}${Math.round(calc.tieredPricing.breakEvenPrice).toLocaleString()}`;

    const tierWholesale = document.getElementById('tier-wholesale-price');
    if (tierWholesale) tierWholesale.textContent = `${currency}${Math.round(calc.tieredPricing.wholesalePrice).toLocaleString()}`;

    const tierRetail = document.getElementById('tier-retail-price');
    if (tierRetail) tierRetail.textContent = `${currency}${Math.round(calc.tieredPricing.recommendedRetail).toLocaleString()}`;

    // Update Overhead summary badges in headers
    const energyBadge = document.getElementById('energy-cost-badge');
    if (energyBadge) energyBadge.textContent = `${currency}${calc.energyCost.toFixed(1)}`;

    const laborBadge = document.getElementById('labor-cost-badge');
    if (laborBadge) laborBadge.textContent = `${currency}${calc.laborCost.toFixed(0)} (${calc.totalLaborHours}h)`;

    const pkgBadge = document.getElementById('pkg-cost-badge');
    if (pkgBadge) pkgBadge.textContent = `${currency}${calc.packagingCost.toFixed(0)}`;

    const decBadge = document.getElementById('dec-cost-badge');
    if (decBadge) decBadge.textContent = `${currency}${calc.decorationsCost.toFixed(0)}`;

    // Render Visualizer Charts
    BakeVisualizer.renderCostDonut('cost-donut-container', calc, currency);
    BakeVisualizer.renderMarginGauge('margin-gauge-container', calc.actualMarginPercent);

    // Render Diagnostic Alerts
    const alertBox = document.getElementById('business-insights-container');
    if (alertBox) {
      if (calc.insights.length === 0) {
        alertBox.innerHTML = `
          <div class="insight-alert success">
            <span>✨</span>
            <div><strong>Balanced Costing:</strong> All overheads, labor, and margins are safely budgeted.</div>
          </div>
        `;
      } else {
        alertBox.innerHTML = calc.insights.map(ins => `
          <div class="insight-alert ${ins.type}">
            <span>${ins.icon}</span>
            <div>
              <strong>${ins.title}:</strong> ${ins.message}
            </div>
          </div>
        `).join('');
      }
    }

    // Refresh row cost displays in ingredients table
    const costCells = document.querySelectorAll('.ing-cost-display');
    (calc.itemizedIngredients || []).forEach((item, idx) => {
      if (costCells[idx]) {
        costCells[idx].textContent = `${currency}${item.calculatedCost.toFixed(2)}`;
      }
    });

    // Update WhatsApp quote if on quotes tab
    if (this.activeTab === 'quotes') {
      this.renderWhatsAppPreview();
    }
  },

  async saveCurrentRecipe() {
    if (!this.currentRecipe.name || this.currentRecipe.name.trim() === '') {
      this.currentRecipe.name = 'Delicious Baked Specialty';
    }
    await StorageManager.saveRecipe(this.currentRecipe);
    this.recipes = await StorageManager.getRecipes();
    this.showToast(`Saved "${this.currentRecipe.name}" to Recipe Book! 📖`, 'success');
  },

  async duplicateCurrentRecipe() {
    const clone = JSON.parse(JSON.stringify(this.currentRecipe));
    clone.id = 'rec_' + Date.now();
    clone.name = `${clone.name} (Copy)`;
    clone.createdAt = new Date().toISOString();
    await StorageManager.saveRecipe(clone);
    this.recipes = await StorageManager.getRecipes();
    this.currentRecipe = clone;
    this.renderStudio();
    this.showToast(`Duplicated into "${clone.name}"! 🍰`, 'info');
  },

  renderRecipesGrid() {
    const grid = document.getElementById('recipes-grid-container');
    if (!grid) return;

    const currency = this.settings.currency || '₹';
    const query = (document.getElementById('search-recipes-input')?.value || '').toLowerCase();

    const filtered = this.recipes.filter(r => 
      r.name.toLowerCase().includes(query) || (r.category || '').toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <h3>No recipes found</h3>
          <p>Create your first recipe canvas or reset demo recipes.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(r => {
      const calc = BakeCostCalculator.calculate(r, this.settings);
      return `
        <div class="recipe-book-card" data-id="${r.id}">
          <div>
            <div class="recipe-card-meta">
              <span class="badge badge-primary">${r.category || 'Bakery'}</span>
              <span class="badge ${calc.actualMarginPercent >= 40 ? 'badge-emerald' : 'badge-gold'}">${calc.actualMarginPercent.toFixed(0)}% Margin</span>
            </div>
            <div class="recipe-card-name">${r.name}</div>
            <div class="recipe-card-desc">${r.description || `${r.ingredients.length} ingredients • ${calc.yieldAmount} ${calc.yieldUnit}`}</div>
          </div>
          
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">
              <span>Cost: <strong>${currency}${calc.totalProductionCost.toFixed(0)}</strong></span>
              <span>Yield: <strong>${calc.yieldAmount} ${calc.yieldUnit}</strong></span>
            </div>
            <div class="recipe-card-pricing">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">SELLING PRICE</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary);">
                  ${currency}${Math.round(calc.sellingPrice).toLocaleString()}
                </div>
              </div>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn btn-secondary btn-sm btn-open-recipe" data-id="${r.id}">Edit ✏️</button>
                <button type="button" class="btn btn-ghost btn-sm btn-icon btn-delete-recipe" data-id="${r.id}" title="Delete">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Grid Actions
    grid.querySelectorAll('.btn-open-recipe').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        this.openRecipeById(id);
      });
    });

    grid.querySelectorAll('.btn-delete-recipe').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        if (confirm('Are you sure you want to delete this recipe?')) {
          await StorageManager.deleteRecipe(id);
          this.recipes = await StorageManager.getRecipes();
          this.renderRecipesGrid();
          this.showToast('Recipe deleted.', 'info');
        }
      });
    });

    grid.querySelectorAll('.recipe-book-card').forEach(card => {
      card.addEventListener('click', () => {
        this.openRecipeById(card.dataset.id);
      });
    });

    // Search filter event
    const searchInp = document.getElementById('search-recipes-input');
    if (searchInp && !searchInp.dataset.bound) {
      searchInp.dataset.bound = 'true';
      searchInp.addEventListener('input', () => this.renderRecipesGrid());
    }
  },

  async openRecipeById(id) {
    const r = await StorageManager.getRecipe(id);
    if (r) {
      this.currentRecipe = JSON.parse(JSON.stringify(r));
      this.currentScale = 1.0;
      this.switchTab('studio');
      this.renderStudio();
      this.showToast(`Loaded "${this.currentRecipe.name}"`, 'success');
    }
  },

  renderPantryManager() {
    const tbody = document.getElementById('pantry-manager-tbody');
    if (!tbody) return;

    const currency = this.settings.currency || '₹';
    const query = (document.getElementById('search-pantry-input')?.value || '').toLowerCase();

    const filtered = this.pantry.filter(p => 
      p.name.toLowerCase().includes(query) || (p.category || '').toLowerCase().includes(query)
    );

    tbody.innerHTML = filtered.map((item, idx) => `
      <tr>
        <td style="font-weight: 600;">${item.name}</td>
        <td><span class="badge badge-purple">${item.category || 'General'}</span></td>
        <td>
          <input type="number" step="any" min="0" class="form-control" style="width: 80px;" value="${item.packSize}" data-index="${idx}" data-field="packSize">
        </td>
        <td>
          <select class="form-control" style="width: 80px;" data-index="${idx}" data-field="packUnit">
            ${this.getUnitOptions(item.packUnit)}
          </select>
        </td>
        <td>
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 4px; color: var(--text-muted); font-weight: 600;">${currency}</span>
            <input type="number" step="any" min="0" class="form-control" style="width: 80px;" value="${item.packPrice}" data-index="${idx}" data-field="packPrice">
          </div>
        </td>
        <td class="text-right">
          <button type="button" class="btn btn-ghost btn-sm btn-icon btn-del-pantry" data-index="${idx}" title="Delete Item">✕</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('input, select').forEach(inp => {
      inp.addEventListener('change', async (e) => {
        const idx = parseInt(e.target.dataset.index);
        const field = e.target.dataset.field;
        const val = e.target.value;
        if (field === 'packSize' || field === 'packPrice') {
          filtered[idx][field] = parseFloat(val) || 0;
        } else {
          filtered[idx][field] = val;
        }
        await StorageManager.savePantry(this.pantry);
      });
    });

    tbody.querySelectorAll('.btn-del-pantry').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        this.pantry.splice(idx, 1);
        await StorageManager.savePantry(this.pantry);
        this.renderPantryManager();
        this.showToast('Ingredient removed from pantry', 'info');
      });
    });

    const addCustomBtn = document.getElementById('btn-add-pantry-custom');
    if (addCustomBtn && !addCustomBtn.dataset.bound) {
      addCustomBtn.dataset.bound = 'true';
      addCustomBtn.addEventListener('click', async () => {
        this.pantry.unshift({
          id: 'p_custom_' + Date.now(),
          name: 'Custom Ingredient',
          category: 'flours',
          packSize: 1,
          packUnit: 'kg',
          packPrice: 100,
          defaultUnit: 'g'
        });
        await StorageManager.savePantry(this.pantry);
        this.renderPantryManager();
        this.showToast('Added new custom pantry item', 'success');
      });
    }

    const searchPantryInp = document.getElementById('search-pantry-input');
    if (searchPantryInp && !searchPantryInp.dataset.bound) {
      searchPantryInp.dataset.bound = 'true';
      searchPantryInp.addEventListener('input', () => this.renderPantryManager());
    }
  },

  renderWhatsAppPreview() {
    const box = document.getElementById('whatsapp-preview-box');
    if (!box || !this.currentRecipe) return;

    const calc = BakeCostCalculator.calculate(this.currentRecipe, this.settings);
    const clientName = document.getElementById('quote-client-name')?.value || '';
    const deliveryDate = document.getElementById('quote-delivery-date')?.value || '';
    const notes = document.getElementById('quote-notes')?.value || '';

    const text = QuoteGenerator.generateWhatsAppText(this.currentRecipe, calc, this.settings, {
      name: clientName,
      deliveryDate,
      notes
    });

    box.textContent = text;
  },

  renderSettingsForm() {
    const s = this.settings;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    };

    setVal('set-bakery-name', s.bakeryName);
    setVal('set-baker-name', s.bakerName);
    setVal('set-contact-phone', s.contactNumber);
    setVal('set-instagram', s.instagramHandle);
    setVal('set-currency-symbol', s.currency);
    setVal('set-currency-code', s.currencyCode);
    setVal('set-electricity-rate', s.electricityRatePerKwh);
    setVal('set-oven-wattage', s.ovenWattage);
    setVal('set-hourly-rate', s.bakerHourlyRate);
    setVal('set-default-wastage', s.defaultWastagePercent);
    setVal('set-default-margin', s.defaultMarginPercent);
  },

  openPantryModal() {
    const modal = document.getElementById('pantry-picker-modal');
    const listContainer = document.getElementById('modal-pantry-list');
    if (!modal || !listContainer) return;

    const currency = this.settings.currency || '₹';

    listContainer.innerHTML = this.pantry.map(item => `
      <div class="pantry-picker-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 6px; cursor: pointer;">
        <div>
          <div style="font-weight: 600;">${item.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${item.packSize}${item.packUnit} • ${currency}${item.packPrice}</div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm btn-pick-item" data-id="${item.id}">+ Add</button>
      </div>
    `).join('');

    listContainer.querySelectorAll('.btn-pick-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.pantry.find(p => p.id === id);
        if (item) {
          this.currentRecipe.ingredients.push({
            id: 'ing_' + Date.now(),
            name: item.name,
            qtyUsed: item.defaultUnit === 'g' ? 100 : 1,
            unitUsed: item.defaultUnit || 'g',
            packSize: item.packSize,
            packUnit: item.packUnit,
            packPrice: item.packPrice
          });
          this.renderIngredientsTable();
          this.updateCalculations();
          this.showToast(`Added ${item.name} to recipe`, 'success');
        }
      });
    });

    modal.classList.add('active');

    const closeBtn = document.getElementById('btn-close-pantry-modal');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('active');
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'danger' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Auto bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

if (typeof window !== 'undefined') {
  window.App = App;
}
