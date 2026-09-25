/**
 * BakeCost - Interactive SVG Visualizer & Health Gauge Engine
 * Zero external dependencies, pure SVG & Canvas for fast, CSP-compliant rendering
 */

const BakeVisualizer = {
  colors: {
    ingredients: '#F59E0B', // Warm Amber
    labor: '#EC4899',       // Rose Pink
    packaging: '#8B5CF6',   // Purple
    energy: '#06B6D4',      // Cyan
    decorations: '#10B981', // Emerald
    delivery: '#6366F1',    // Indigo
    profit: '#10B981',      // Fresh Green
    costBase: '#64748B'     // Slate
  },

  /**
   * Render interactive Donut Chart into a container element
   */
  renderCostDonut(containerId, calcResult, currency = '₹') {
    const container = document.getElementById(containerId);
    if (!container || !calcResult) return;

    const {
      totalIngredientsCost,
      laborCost,
      packagingCost,
      energyCost,
      decorationsCost,
      deliveryCost,
      totalProductionCost,
      netProfit,
      sellingPrice
    } = calcResult;

    const slices = [
      { label: 'Ingredients', value: totalIngredientsCost, color: '#F59E0B', icon: '🌾' },
      { label: 'Baker Labor', value: laborCost, color: '#EC4899', icon: '⏱️' },
      { label: 'Packaging', value: packagingCost, color: '#8B5CF6', icon: '📦' },
      { label: 'Oven & Energy', value: energyCost, color: '#06B6D4', icon: '⚡' },
      { label: 'Decorations', value: decorationsCost, color: '#3B82F6', icon: '✨' },
      { label: 'Delivery', value: deliveryCost, color: '#6366F1', icon: '🛵' }
    ].filter(s => s.value > 0);

    const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;

    // SVG parameters
    const size = 200;
    const strokeWidth = 32;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedAngle = 0;
    let svgPaths = '';

    slices.forEach((slice) => {
      const percentage = (slice.value / total) * 100;
      const strokeDashoffset = circumference - (circumference * percentage) / 100;
      const rotation = (accumulatedAngle / total) * 360 - 90;

      svgPaths += `
        <circle
          cx="${center}"
          cy="${center}"
          r="${radius}"
          fill="transparent"
          stroke="${slice.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${strokeDashoffset}"
          transform="rotate(${rotation} ${center} ${center})"
          class="donut-segment"
          data-label="${slice.label}"
          data-value="${currency}${slice.value.toFixed(1)}"
          data-percent="${percentage.toFixed(1)}%"
        />
      `;
      accumulatedAngle += slice.value;
    });

    const legendHtml = slices.map(s => `
      <div class="donut-legend-item">
        <span class="legend-color-dot" style="background-color: ${s.color}"></span>
        <span class="legend-name">${s.icon} ${s.label}</span>
        <span class="legend-value">${currency}${s.value.toFixed(0)} <small>(${((s.value / total) * 100).toFixed(0)}%)</small></span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="donut-chart-wrapper">
        <div class="donut-svg-holder">
          <svg viewBox="0 0 ${size} ${size}" class="donut-svg">
            <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent" stroke="var(--border-color, #e2e8f0)" stroke-width="${strokeWidth}" opacity="0.2" />
            ${svgPaths}
          </svg>
          <div class="donut-center-text">
            <span class="donut-center-label">Total Cost</span>
            <span class="donut-center-amount">${currency}${totalProductionCost.toFixed(0)}</span>
          </div>
        </div>
        <div class="donut-legend">
          ${legendHtml}
        </div>
      </div>
    `;
  },

  /**
   * Render Margin Health Meter Gauge
   */
  renderMarginGauge(containerId, marginPercent) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const margin = Math.max(0, Math.min(100, parseFloat(marginPercent) || 0));
    
    let statusClass = 'low';
    let statusText = 'Low Margin';
    let statusColor = '#EF4444';

    if (margin >= 45) {
      statusClass = 'optimal';
      statusText = 'Premium Healthy Margin';
      statusColor = '#10B981';
    } else if (margin >= 30) {
      statusClass = 'healthy';
      statusText = 'Standard Commercial Margin';
      statusColor = '#3B82F6';
    } else if (margin >= 20) {
      statusClass = 'moderate';
      statusText = 'Moderate Buffer';
      statusColor = '#F59E0B';
    } else {
      statusClass = 'critical';
      statusText = 'Dangerously Low';
      statusColor = '#EF4444';
    }

    container.innerHTML = `
      <div class="margin-gauge-card">
        <div class="gauge-header">
          <span class="gauge-title">Profit Margin Health</span>
          <span class="gauge-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="gauge-bar-track">
          <div class="gauge-bar-fill" style="width: ${margin}%; background-color: ${statusColor};"></div>
          <div class="gauge-marker marker-20" title="20% Floor"></div>
          <div class="gauge-marker marker-35" title="35% Target"></div>
          <div class="gauge-marker marker-50" title="50% Premium"></div>
        </div>
        <div class="gauge-scale-labels">
          <span>0%</span>
          <span>20% (Floor)</span>
          <span>35% (Good)</span>
          <span>50%+ (Optimal)</span>
        </div>
        <div class="gauge-current-value">
          <span class="val-num" style="color: ${statusColor}">${margin.toFixed(1)}%</span>
          <span class="val-desc">Gross Profit on Selling Price</span>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.BakeVisualizer = BakeVisualizer;
}
