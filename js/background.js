// Background Service Worker for BakeCost Extension (Manifest V3)

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[BakeCost] Extension installed successfully:', details.reason);
  
  // Set default settings if not already present
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['bakeCost_settings'], (res) => {
      if (!res.bakeCost_settings) {
        const defaultSettings = {
          currency: '₹',
          currencyCode: 'INR',
          electricityRatePerKwh: 8.0,
          ovenWattage: 2000,
          bakerHourlyRate: 200,
          defaultWastagePercent: 8,
          defaultMarginPercent: 40,
          theme: 'light'
        };
        chrome.storage.local.set({ bakeCost_settings: defaultSettings }, () => {
          console.log('[BakeCost] Default settings initialized.');
        });
      }
    });
  }
});

// Enable side panel behavior if supported
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
}
