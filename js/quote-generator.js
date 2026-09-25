/**
 * BakeCost - Cute Bento Box & Cupcake Quote Generator
 * Generates aesthetic WhatsApp order DM summaries and cute printable cost sheets
 */

const QuoteGenerator = {
  /**
   * Format a WhatsApp quote ready for customer DMs with cute bento & cupcake aesthetic
   */
  generateWhatsAppText(recipe, calcResult, settings, clientDetails = {}) {
    const currency = settings.currency || '₹';
    const bakery = settings.bakeryName || 'Little Bento & Co. 🎀';
    const phone = settings.contactNumber || '';
    const insta = settings.instagramHandle || '';

    const clientName = clientDetails.name ? `Dear *${clientDetails.name}* 💖,` : 'Hello! 🎀';
    const orderDate = clientDetails.deliveryDate ? `\n📅 *Needed For:* ${clientDetails.deliveryDate}` : '';
    const messagePiping = clientDetails.notes ? `\n💌 *Custom Message/Piping:* "${clientDetails.notes}"` : '';

    const pkgItems = (recipe.packaging || [])
      .filter(p => (parseFloat(p.qty) || 0) > 0)
      .map(p => p.name)
      .join(', ');

    const decItems = (recipe.decorations || [])
      .filter(d => (parseFloat(d.qty) || 0) > 0)
      .map(d => d.name)
      .join(', ');

    let includesText = '';
    if (pkgItems || decItems) {
      includesText = `\n🎁 *Includes:* ${[pkgItems, decItems].filter(Boolean).join(' + ')}`;
    }

    const priceFormatted = `${currency}${Math.round(calcResult.sellingPrice).toLocaleString()}`;
    const unitPriceFormatted = calcResult.yieldAmount > 1 
      ? ` (${currency}${Math.round(calcResult.pricePerUnit).toLocaleString()}/${calcResult.yieldUnit})`
      : '';

    return `${clientName}

Thank you for choosing *${bakery}*! 🧁✨ Here are the details for your custom bake order:

🍰 *Item:* ${recipe.name}
🔢 *Quantity:* ${calcResult.yieldAmount} ${calcResult.yieldUnit} (~${calcResult.servingCount} servings)${orderDate}${messagePiping}${includesText}

💰 *Total Investment:* *${priceFormatted}*${unitPriceFormatted}

───────────────
🎀 *How to confirm your slot:*
1. Reply with *'YES CONFIRM'* & your delivery address.
2. 50% advance booking confirms your baking slot.
3. Freshly handmade with premium gourmet ingredients & love! 🍓🧸

🧁 *${bakery}*
${phone ? `📞 ${phone} | ` : ''}${insta ? `📸 ${insta}` : ''}`;
  },

  /**
   * Generates cute printable HTML string for browser print/PDF export
   */
  generatePrintableCostSheet(recipe, calcResult, settings, mode = 'internal') {
    const currency = settings.currency || '₹';
    const isClient = mode === 'client';

    const ingredientsRows = (calcResult.itemizedIngredients || []).map(i => `
      <tr>
        <td>${i.name}</td>
        <td>${i.scaledQty} ${i.unitUsed}</td>
        ${!isClient ? `
          <td>${currency}${i.packPrice} / ${i.packSize}${i.packUnit}</td>
          <td class="text-right font-medium">${currency}${i.calculatedCost.toFixed(2)}</td>
        ` : ''}
      </tr>
    `).join('');

    const packagingRows = (calcResult.itemizedPackaging || []).map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.qty}</td>
        ${!isClient ? `
          <td>${currency}${p.unitCost}</td>
          <td class="text-right font-medium">${currency}${p.cost.toFixed(2)}</td>
        ` : ''}
      </tr>
    `).join('');

    const decorationsRows = (calcResult.itemizedDecorations || []).map(d => `
      <tr>
        <td>${d.name}</td>
        <td>${d.qty}</td>
        ${!isClient ? `
          <td>${currency}${d.unitCost}</td>
          <td class="text-right font-medium">${currency}${d.cost.toFixed(2)}</td>
        ` : ''}
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${recipe.name} - ${isClient ? 'Quotation' : 'Recipe Cost Sheet'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
          body {
            font-family: 'Quicksand', sans-serif;
            color: #2b1e22;
            margin: 0;
            padding: 30px;
            background: #fff;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed #f0e6dd;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .brand-title {
            font-size: 26px;
            font-weight: 700;
            color: #ff6b8b;
          }
          .doc-type {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #a49198;
            font-weight: 700;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
          }
          .card {
            background: #fffbf9;
            border-radius: 16px;
            padding: 16px;
            border: 1px solid #fcefe9;
          }
          .card h4 {
            margin: 0 0 10px 0;
            color: #ff6b8b;
            font-size: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 13px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          th {
            background: #fff0f3;
            text-align: left;
            padding: 8px 12px;
            color: #d84869;
            font-weight: 700;
            border-radius: 6px;
          }
          td {
            padding: 8px 12px;
            border-bottom: 1px solid #fdf2f4;
          }
          .text-right { text-align: right; }
          .font-medium { font-weight: 600; }
          .total-box {
            background: linear-gradient(135deg, #fff0f3, #ffe5ec);
            border: 2px dashed #ff8fa3;
            border-radius: 18px;
            padding: 20px;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .price-huge {
            font-size: 30px;
            font-weight: 800;
            color: #ff5277;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-title">🎀 ${settings.bakeryName || 'Little Bento & Co.'}</div>
            <div style="font-size: 13px; color: #9c8a90;">${settings.contactNumber || ''} | ${settings.instagramHandle || ''}</div>
          </div>
          <div class="text-right">
            <div class="doc-type">${isClient ? 'Official Bake Quotation' : 'Master Bento Cost Sheet'}</div>
            <div style="font-size: 12px; color: #bcaaa4;">${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 20px;">
          <h2 style="margin: 0 0 6px 0; font-size: 20px; color: #2b1e22;">${recipe.name}</h2>
          <p style="margin: 0; color: #7d6b72; font-size: 13px;">${recipe.description || 'Cute handcrafted custom bake specialty.'}</p>
          <div style="margin-top: 10px; display: flex; gap: 20px; font-size: 13px; font-weight: 700; color: #ff6b8b;">
            <span>Yield: ${calcResult.yieldAmount} ${calcResult.yieldUnit}</span>
            <span>Servings: ~${calcResult.servingCount} portions</span>
          </div>
        </div>

        <h4 style="margin: 15px 0 8px 0; color: #ff6b8b;">🌾 Ingredients Breakdown</h4>
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity Used</th>
              ${!isClient ? `<th>Pack Basis</th><th class="text-right">Cost</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${ingredientsRows}
          </tbody>
        </table>

        ${packagingRows ? `
          <h4 style="margin: 15px 0 8px 0; color: #ff6b8b;">🍱 Bento Box, Liners & Packaging</h4>
          <table>
            <thead>
              <tr>
                <th>Packaging Item</th>
                <th>Qty</th>
                ${!isClient ? `<th>Unit Cost</th><th class="text-right">Cost</th>` : ''}
              </tr>
            </thead>
            <tbody>
              ${packagingRows}
            </tbody>
          </table>
        ` : ''}

        ${decorationsRows ? `
          <h4 style="margin: 15px 0 8px 0; color: #ff6b8b;">✨ Toppers, Pearls & Candles</h4>
          <table>
            <thead>
              <tr>
                <th>Decoration Item</th>
                <th>Qty</th>
                ${!isClient ? `<th>Unit Cost</th><th class="text-right">Cost</th>` : ''}
              </tr>
            </thead>
            <tbody>
              ${decorationsRows}
            </tbody>
          </table>
        ` : ''}

        ${!isClient ? `
          <div class="grid">
            <div class="card">
              <h4>⚡ Overhead & Utilities</h4>
              <div style="font-size: 13px; display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Baking Energy (${calcResult.bakingTimeMinutes}m @ ${calcResult.ovenWattage}W):</span>
                <strong>${currency}${calcResult.energyCost.toFixed(2)}</strong>
              </div>
              <div style="font-size: 13px; display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Wastage Buffer (${calcResult.wastagePercent}%):</span>
                <strong>${currency}${calcResult.wastageCost.toFixed(2)}</strong>
              </div>
              <div style="font-size: 13px; display: flex; justify-content: space-between;">
                <span>Baker Labor (${calcResult.totalLaborHours} hrs @ ${currency}${calcResult.bakerHourlyRate}/hr):</span>
                <strong>${currency}${calcResult.laborCost.toFixed(2)}</strong>
              </div>
            </div>

            <div class="card">
              <h4>📊 Cost & Margin Summary</h4>
              <div style="font-size: 13px; display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Total True Cost:</span>
                <strong>${currency}${calcResult.totalProductionCost.toFixed(2)}</strong>
              </div>
              <div style="font-size: 13px; display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Profit Margin:</span>
                <strong style="color: #10b981;">${calcResult.actualMarginPercent.toFixed(1)}% (${currency}${calcResult.netProfit.toFixed(2)})</strong>
              </div>
              <div style="font-size: 13px; display: flex; justify-content: space-between;">
                <span>Cost Per Unit:</span>
                <strong>${currency}${calcResult.costPerUnit.toFixed(2)} / ${calcResult.yieldUnit}</strong>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="total-box">
          <div>
            <div style="font-size: 14px; color: #ff5277; font-weight: 800;">TOTAL SELLING PRICE</div>
            <div style="font-size: 12px; color: #7d6b72;">Includes custom handcrafted bake, clamshell packaging & love</div>
          </div>
          <div class="price-huge">
            ${currency}${Math.round(calcResult.sellingPrice).toLocaleString()}
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.QuoteGenerator = QuoteGenerator;
}
