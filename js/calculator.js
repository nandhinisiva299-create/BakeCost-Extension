/**
 * BakeCost - Core Costing & Pricing Strategy Engine
 */

const BakeCostCalculator = {
  /**
   * Complete calculation for a recipe object
   */
  calculate(recipe, settings = {}) {
    if (!recipe) return null;

    const scaleFactor = parseFloat(recipe.scaleFactor) || 1.0;
    const yieldAmount = (parseFloat(recipe.yieldAmount) || 1) * scaleFactor;
    const yieldUnit = recipe.yieldUnit || 'portion';
    const servingCount = (parseInt(recipe.servingCount) || 1) * scaleFactor;

    // 1. Calculate Raw Ingredients
    let rawIngredientsCost = 0;
    const itemizedIngredients = (recipe.ingredients || []).map((item) => {
      const scaledQty = (parseFloat(item.qtyUsed) || 0) * scaleFactor;
      const cost = UnitConverter.calculateItemCost(
        scaledQty,
        item.unitUsed,
        item.packSize,
        item.packUnit,
        item.packPrice,
        item.name
      );
      rawIngredientsCost += cost;
      return {
        ...item,
        scaledQty,
        calculatedCost: cost
      };
    });

    // 2. Wastage / Scrap Buffer
    const wastagePercent = parseFloat(recipe.wastagePercent) || 0;
    const wastageCost = rawIngredientsCost * (wastagePercent / 100);
    const totalIngredientsCost = rawIngredientsCost + wastageCost;

    // 3. Energy & Utilities Overhead
    const bakingTimeMinutes = (parseFloat(recipe.bakingTimeMinutes) || 0);
    const ovenWattage = parseFloat(recipe.ovenWattage) || parseFloat(settings.ovenWattage) || 2000;
    const electricityRate = parseFloat(recipe.electricityRate) || parseFloat(settings.electricityRatePerKwh) || 8;
    
    // Power consumption in kWh = (Watts / 1000) * (Minutes / 60)
    const energyKwh = (ovenWattage / 1000) * (bakingTimeMinutes / 60);
    const energyCost = energyKwh * electricityRate;

    // 4. Baker Labor & Time
    const prepTimeHours = parseFloat(recipe.prepTimeHours) || 0;
    const decoratingTimeHours = parseFloat(recipe.decoratingTimeHours) || 0;
    const totalLaborHours = prepTimeHours + decoratingTimeHours;
    const bakerHourlyRate = parseFloat(recipe.bakerHourlyRate) || parseFloat(settings.bakerHourlyRate) || 0;
    const laborCost = totalLaborHours * bakerHourlyRate;

    // 5. Packaging Subtotal
    let packagingCost = 0;
    const itemizedPackaging = (recipe.packaging || []).map((pkg) => {
      const qty = parseFloat(pkg.qty) || 0;
      const unitCost = parseFloat(pkg.unitCost) || 0;
      const cost = qty * unitCost;
      packagingCost += cost;
      return { ...pkg, cost };
    });

    // 6. Decorations Subtotal
    let decorationsCost = 0;
    const itemizedDecorations = (recipe.decorations || []).map((dec) => {
      const qty = parseFloat(dec.qty) || 0;
      const unitCost = parseFloat(dec.unitCost) || 0;
      const cost = qty * unitCost;
      decorationsCost += cost;
      return { ...dec, cost };
    });

    // 7. Delivery & Logistics
    const deliveryCost = parseFloat(recipe.deliveryCost) || 0;

    // 8. Total True Production Cost
    const directMaterialCost = totalIngredientsCost + packagingCost + decorationsCost;
    const totalOverheadCost = energyCost + laborCost + deliveryCost;
    const totalProductionCost = directMaterialCost + totalOverheadCost;

    // Floor price = Costs excluding baker's labor (bare survival floor)
    const floorCost = totalProductionCost - laborCost;

    // 9. Pricing & Profit Calculation
    const pricingType = recipe.pricingType || 'margin'; // 'margin' | 'markup' | 'custom'
    const targetMarginPercent = parseFloat(recipe.targetMarginPercent) || 45;
    const targetMarkupPercent = parseFloat(recipe.targetMarkupPercent) || 80;
    const customSellingPrice = parseFloat(recipe.customSellingPrice) || 0;

    let sellingPrice = 0;
    let netProfit = 0;
    let actualMarginPercent = 0;
    let actualMarkupPercent = 0;

    if (pricingType === 'margin') {
      const marginDecimal = Math.min(0.99, Math.max(0.01, targetMarginPercent / 100));
      sellingPrice = totalProductionCost / (1 - marginDecimal);
      netProfit = sellingPrice - totalProductionCost;
      actualMarginPercent = targetMarginPercent;
      actualMarkupPercent = totalProductionCost > 0 ? (netProfit / totalProductionCost) * 100 : 0;
    } else if (pricingType === 'markup') {
      sellingPrice = totalProductionCost * (1 + targetMarkupPercent / 100);
      netProfit = sellingPrice - totalProductionCost;
      actualMarkupPercent = targetMarkupPercent;
      actualMarginPercent = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
    } else {
      // Custom price
      sellingPrice = customSellingPrice;
      netProfit = sellingPrice - totalProductionCost;
      actualMarginPercent = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
      actualMarkupPercent = totalProductionCost > 0 ? (netProfit / totalProductionCost) * 100 : 0;
    }

    // Safety check
    if (isNaN(sellingPrice) || sellingPrice < 0) sellingPrice = 0;
    if (isNaN(netProfit)) netProfit = 0;

    // 10. Per Unit Metrics
    const costPerUnit = yieldAmount > 0 ? totalProductionCost / yieldAmount : totalProductionCost;
    const pricePerUnit = yieldAmount > 0 ? sellingPrice / yieldAmount : sellingPrice;
    const profitPerUnit = yieldAmount > 0 ? netProfit / yieldAmount : netProfit;

    const costPerServing = servingCount > 0 ? totalProductionCost / servingCount : costPerUnit;
    const pricePerServing = servingCount > 0 ? sellingPrice / servingCount : pricePerUnit;

    // 11. Tiered Pricing Recommendations
    const tieredPricing = {
      floorPrice: floorCost,
      breakEvenPrice: totalProductionCost,
      wholesalePrice: totalProductionCost / (1 - 0.25), // 25% margin
      recommendedRetail: totalProductionCost / (1 - (targetMarginPercent / 100)),
      premiumPrice: totalProductionCost / (1 - 0.60) // 60% margin
    };

    // 12. Percentage Shares for Charts
    const totalSafe = totalProductionCost > 0 ? totalProductionCost : 1;
    const shares = {
      ingredientsPercent: (totalIngredientsCost / totalSafe) * 100,
      packagingPercent: (packagingCost / totalSafe) * 100,
      decorationsPercent: (decorationsCost / totalSafe) * 100,
      energyPercent: (energyCost / totalSafe) * 100,
      laborPercent: (laborCost / totalSafe) * 100,
      deliveryPercent: (deliveryCost / totalSafe) * 100
    };

    // 13. Smart Business Health Diagnostics & Alerts
    const insights = [];

    if (laborCost <= 0) {
      insights.push({
        type: 'danger',
        icon: '⚠️',
        title: 'Zero Baker Labor Budgeted',
        message: 'You have not allocated an hourly wage for your time. You are effectively baking for free!'
      });
    }

    if (actualMarginPercent < 20) {
      insights.push({
        type: 'warning',
        icon: '📉',
        title: 'Low Profit Margin (< 20%)',
        message: 'Your profit buffer is very slim. Ingredient price spikes or delivery hiccups could erase your entire earnings.'
      });
    } else if (actualMarginPercent >= 40) {
      insights.push({
        type: 'success',
        icon: '💎',
        title: 'Healthy Commercial Margin (≥ 40%)',
        message: 'Great job! This pricing gives your bakery sustainable growth and healthy cash flow.'
      });
    }

    if (shares.packagingPercent > 20) {
      insights.push({
        type: 'info',
        icon: '📦',
        title: 'High Packaging Share (> 20%)',
        message: `Packaging takes up ${shares.packagingPercent.toFixed(1)}% of your cost. Consider bulk ordering boxes/boards to increase profitability.`
      });
    }

    return {
      scaleFactor,
      yieldAmount,
      yieldUnit,
      servingCount,

      // Costs
      rawIngredientsCost,
      wastagePercent,
      wastageCost,
      totalIngredientsCost,
      itemizedIngredients,

      energyKwh,
      energyCost,
      bakingTimeMinutes,
      ovenWattage,
      electricityRate,

      totalLaborHours,
      prepTimeHours,
      decoratingTimeHours,
      bakerHourlyRate,
      laborCost,

      packagingCost,
      itemizedPackaging,

      decorationsCost,
      itemizedDecorations,

      deliveryCost,

      directMaterialCost,
      totalOverheadCost,
      totalProductionCost,

      // Pricing & Margins
      pricingType,
      targetMarginPercent,
      targetMarkupPercent,
      sellingPrice,
      netProfit,
      actualMarginPercent,
      actualMarkupPercent,

      // Per Unit Breakdown
      costPerUnit,
      pricePerUnit,
      profitPerUnit,
      costPerServing,
      pricePerServing,

      // Strategic Tiers & Analysis
      tieredPricing,
      shares,
      insights
    };
  }
};

if (typeof window !== 'undefined') {
  window.BakeCostCalculator = BakeCostCalculator;
}
