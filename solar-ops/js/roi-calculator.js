/**
 * Solar ROI Calculator - Bangladesh Specific
 * Renders a professional ROI calculator inside a given container.
 * Dependencies: Tailwind CSS (CDN), Chart.js (CDN)
 */

function renderROICalculator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // ── Bangladesh Solar Data ──────────────────────────────────────────
  const SOLAR_IRRADIANCE_BY_LOCATION = {
    'Dhaka': 4.5, 'Chittagong': 4.3, 'Rajshahi': 5.0, 'Khulna': 4.7,
    'Sylhet': 4.1, 'Rangpur': 4.8, 'Barisal': 4.4, 'Mymensingh': 4.5
  };

  const MONTHLY_IRRADIANCE = {
    Jan: 4.2, Feb: 4.8, Mar: 5.3, Apr: 5.5, May: 5.0, Jun: 3.8,
    Jul: 3.5, Aug: 3.8, Sep: 4.0, Oct: 4.5, Nov: 4.5, Dec: 4.0
  };

  const DAYS_IN_MONTH = {
    Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30,
    Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31
  };

  const PANEL_SPECS = {
    'Mono PERC 545W': { watt: 545, kwpPer100Sqft: 1.8, efficiency: 0.21 },
    'Poly 330W': { watt: 330, kwpPer100Sqft: 1.2, efficiency: 0.17 },
    'Bifacial 550W': { watt: 550, kwpPer100Sqft: 1.9, efficiency: 0.22 }
  };

  // ── State ──────────────────────────────────────────────────────────
  let state = {
    monthlyBill: 50000,
    electricityRate: 9.80,
    roofArea: 5000,
    roofType: 'Flat RCC',
    daytimeLoad: 40,
    nightLoad: 15,
    location: 'Dhaka',
    netMetering: true,
    batteryStorage: false,
    panelType: 'Mono PERC 545W',
    // Advanced
    systemLoss: 15,
    panelDegradation: 0.5,
    costPerKwp: 65000,
    maintenancePct: 1,
    priceEscalation: 5,
    netMeteringRate: 6.50,
    batteryCostPerKwh: 15000,
    batteryCapacityHours: 4
  };

  let cashFlowChart = null;
  let monthlyGenChart = null;

  // ── Calculation Engine ─────────────────────────────────────────────
  function calculate() {
    const panel = PANEL_SPECS[state.panelType];
    const irradiance = SOLAR_IRRADIANCE_BY_LOCATION[state.location] || 4.5;
    const lossMultiplier = 1 - state.systemLoss / 100;

    // System sizing based on daytime load and roof area
    const maxKwpByRoof = (state.roofArea / 100) * panel.kwpPer100Sqft;
    const kwpByLoad = state.daytimeLoad * 1.2; // 120% of daytime load
    const kwpByBill = (state.monthlyBill / state.electricityRate) / (irradiance * 30 * lossMultiplier);
    const recommendedKwp = Math.min(maxKwpByRoof, Math.max(kwpByLoad, kwpByBill));
    const systemKwp = Math.round(recommendedKwp * 10) / 10;

    const numPanels = Math.ceil((systemKwp * 1000) / panel.watt);
    const requiredArea = Math.round((systemKwp / panel.kwpPer100Sqft) * 100);
    const areaUsedPct = Math.round((requiredArea / state.roofArea) * 100);

    // Annual generation
    const annualGeneration = Math.round(systemKwp * irradiance * 365 * lossMultiplier);

    // Self-consumption & export
    const annualDaytimeConsumption = state.daytimeLoad * 8 * 365; // ~8 sun hours load
    const selfConsumption = Math.min(annualGeneration, annualDaytimeConsumption);
    const gridExport = state.netMetering ? Math.max(0, annualGeneration - selfConsumption) : 0;

    // CO2 reduction (Bangladesh grid emission factor: ~0.62 kg CO2/kWh)
    const annualCO2 = Math.round((annualGeneration * 0.62) / 1000 * 10) / 10;

    // Financial
    let systemCost = Math.round(systemKwp * state.costPerKwp);
    if (state.batteryStorage) {
      const batteryKwh = state.nightLoad * state.batteryCapacityHours;
      systemCost += batteryKwh * state.batteryCostPerKwh;
    }

    const annualMaintenanceCost = systemCost * (state.maintenancePct / 100);

    // Year 1 savings
    const savingsFromSelfConsumption = selfConsumption * state.electricityRate;
    const savingsFromExport = gridExport * state.netMeteringRate;
    const year1Savings = savingsFromSelfConsumption + savingsFromExport - annualMaintenanceCost;

    // 25-year cash flow with escalation & degradation
    let cumulativeSavings = 0;
    let cumulativeCosts = systemCost;
    const yearlyData = [];
    let paybackYear = null;

    for (let y = 1; y <= 25; y++) {
      const degradation = Math.pow(1 - state.panelDegradation / 100, y - 1);
      const escalation = Math.pow(1 + state.priceEscalation / 100, y - 1);
      const yearGen = annualGeneration * degradation;
      const yearSelfCons = Math.min(yearGen, annualDaytimeConsumption);
      const yearExport = state.netMetering ? Math.max(0, yearGen - yearSelfCons) : 0;
      const yearSavings = (yearSelfCons * state.electricityRate * escalation)
                        + (yearExport * state.netMeteringRate * escalation)
                        - annualMaintenanceCost;
      cumulativeSavings += yearSavings;
      const netPosition = cumulativeSavings - systemCost;
      yearlyData.push({
        year: y,
        annualSavings: Math.round(yearSavings),
        cumulativeSavings: Math.round(cumulativeSavings),
        netPosition: Math.round(netPosition)
      });
      if (!paybackYear && netPosition >= 0) paybackYear = y;
    }

    const totalSavings25 = cumulativeSavings;
    const roi25 = ((totalSavings25 - systemCost) / systemCost) * 100;
    const netSavings25 = totalSavings25 - systemCost;
    const monthlySavings = year1Savings / 12;

    // Simple payback
    const simplePayback = systemCost / year1Savings;

    // Monthly generation
    const avgIrradiance = Object.values(MONTHLY_IRRADIANCE).reduce((a, b) => a + b) / 12;
    const monthlyGen = {};
    for (const [month, irr] of Object.entries(MONTHLY_IRRADIANCE)) {
      monthlyGen[month] = Math.round(systemKwp * irr * DAYS_IN_MONTH[month] * lossMultiplier);
    }

    // Environmental
    const co2_25years = Math.round(annualCO2 * 25 * 0.88 * 10) / 10; // with avg degradation
    const treesEquivalent = Math.round(co2_25years * 1000 / 21); // ~21 kg CO2/tree/year * 25
    const carsOffRoad = Math.round(co2_25years / 4.6 * 10) / 10;

    return {
      systemKwp, numPanels, requiredArea, areaUsedPct,
      annualGeneration, selfConsumption, gridExport, annualCO2,
      systemCost, year1Savings: Math.round(year1Savings), monthlySavings: Math.round(monthlySavings),
      simplePayback: Math.round(simplePayback * 10) / 10,
      roi25: Math.round(roi25), netSavings25: Math.round(netSavings25),
      yearlyData, monthlyGen, paybackYear,
      co2_25years, treesEquivalent, carsOffRoad
    };
  }

  // ── Format helpers ─────────────────────────────────────────────────
  function fmt(n) {
    return new Intl.NumberFormat('en-IN').format(n);
  }
  function fmtTk(n) {
    return '৳' + fmt(n);
  }

  // ── Render ─────────────────────────────────────────────────────────
  function render() {
    container.innerHTML = `
      <div class="roi-calc-root" style="font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 mb-6 shadow-lg">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                Solar ROI Calculator
              </h2>
              <p class="text-emerald-100 mt-1 text-sm">Bangladesh-specific analysis with real-time calculations</p>
            </div>
            <div class="flex items-center gap-2 bg-white/15 backdrop-blur rounded-lg px-4 py-2">
              <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span class="text-white text-sm font-medium">BPDB Rates Updated 2024</span>
            </div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <!-- INPUT PANEL -->
          <div class="xl:col-span-4 space-y-4">
            <!-- Basic Inputs Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                  System Parameters
                </h3>
              </div>
              <div class="p-5 space-y-5">
                <!-- Monthly Bill -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Electricity Bill</label>
                  <div class="flex items-center gap-3">
                    <input type="range" id="roi-monthlyBill" min="5000" max="500000" step="1000" value="${state.monthlyBill}" class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600">
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">৳</span>
                      <input type="number" id="roi-monthlyBill-input" value="${state.monthlyBill}" class="w-28 pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                    </div>
                  </div>
                </div>

                <!-- Electricity Rate -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Avg. Electricity Rate (৳/kWh)</label>
                  <input type="number" id="roi-electricityRate" value="${state.electricityRate}" step="0.10" min="3" max="20" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                </div>

                <!-- Roof Area -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Available Roof Area (sq ft)</label>
                  <div class="flex items-center gap-3">
                    <input type="range" id="roi-roofArea" min="500" max="50000" step="100" value="${state.roofArea}" class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600">
                    <input type="number" id="roi-roofArea-input" value="${state.roofArea}" class="w-24 px-2 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                </div>

                <!-- Roof Type -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Roof Type</label>
                  <select id="roi-roofType" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                    <option ${state.roofType === 'Flat RCC' ? 'selected' : ''}>Flat RCC</option>
                    <option ${state.roofType === 'Tin Shed' ? 'selected' : ''}>Tin Shed</option>
                    <option ${state.roofType === 'Mixed' ? 'selected' : ''}>Mixed</option>
                  </select>
                </div>

                <!-- Daytime / Night Load -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Daytime Load (kW)</label>
                    <input type="number" id="roi-daytimeLoad" value="${state.daytimeLoad}" min="1" max="500" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Night Load (kW)</label>
                    <input type="number" id="roi-nightLoad" value="${state.nightLoad}" min="0" max="200" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                </div>

                <!-- Location -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Location</label>
                  <select id="roi-location" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                    ${Object.keys(SOLAR_IRRADIANCE_BY_LOCATION).map(loc => `<option ${state.location === loc ? 'selected' : ''}>${loc}</option>`).join('')}
                  </select>
                </div>

                <!-- Panel Type -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Panel Type</label>
                  <select id="roi-panelType" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                    ${Object.keys(PANEL_SPECS).map(p => `<option ${state.panelType === p ? 'selected' : ''}>${p}</option>`).join('')}
                  </select>
                </div>

                <!-- Toggles -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                    <span class="text-xs font-semibold text-gray-600 uppercase">Net Metering</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="roi-netMetering" ${state.netMetering ? 'checked' : ''} class="sr-only peer">
                      <div class="w-9 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-emerald-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                    <span class="text-xs font-semibold text-gray-600 uppercase">Battery</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="roi-batteryStorage" ${state.batteryStorage ? 'checked' : ''} class="sr-only peer">
                      <div class="w-9 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-emerald-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Advanced Settings -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button id="roi-advancedToggle" class="w-full bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Advanced Settings
                </h3>
                <svg id="roi-advancedChevron" class="w-5 h-5 text-gray-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div id="roi-advancedPanel" class="hidden p-5 space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">System Loss (%)</label>
                    <input type="number" id="roi-systemLoss" value="${state.systemLoss}" min="5" max="30" step="1" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Degradation (%/yr)</label>
                    <input type="number" id="roi-panelDegradation" value="${state.panelDegradation}" min="0.1" max="2" step="0.1" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Cost/kWp (৳)</label>
                    <input type="number" id="roi-costPerKwp" value="${state.costPerKwp}" min="30000" max="150000" step="1000" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Maintenance (%/yr)</label>
                    <input type="number" id="roi-maintenancePct" value="${state.maintenancePct}" min="0" max="5" step="0.5" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Price Escalation (%/yr)</label>
                    <input type="number" id="roi-priceEscalation" value="${state.priceEscalation}" min="0" max="15" step="0.5" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Net Meter Rate (৳/kWh)</label>
                    <input type="number" id="roi-netMeteringRate" value="${state.netMeteringRate}" min="1" max="15" step="0.25" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Battery Cost (৳/kWh)</label>
                    <input type="number" id="roi-batteryCostPerKwh" value="${state.batteryCostPerKwh}" min="5000" max="40000" step="1000" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Battery Hours</label>
                    <input type="number" id="roi-batteryCapacityHours" value="${state.batteryCapacityHours}" min="1" max="12" step="1" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  </div>
                </div>
                <button id="roi-resetDefaults" class="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>

          <!-- OUTPUT PANEL -->
          <div class="xl:col-span-8 space-y-5" id="roi-output-area">
            <!-- Loading placeholder -->
            <div class="flex items-center justify-center py-20">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span class="ml-3 text-gray-500">Calculating...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    updateOutput();
  }

  function renderOutput(r) {
    const outputArea = document.getElementById('roi-output-area');
    if (!outputArea) return;

    const paybackColor = r.simplePayback <= 4 ? 'emerald' : r.simplePayback <= 6 ? 'yellow' : 'red';
    const paybackLabel = r.simplePayback <= 4 ? 'Excellent' : r.simplePayback <= 6 ? 'Good' : 'Moderate';

    outputArea.innerHTML = `
      <!-- Summary Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Recommended System -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h4 class="font-semibold text-gray-800 text-sm">Recommended System</h4>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-baseline">
              <span class="text-xs text-gray-500">System Size</span>
              <span class="text-xl font-bold text-blue-600">${r.systemKwp} kWp</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Panels Required</span>
              <span class="font-semibold text-gray-800">${r.numPanels} panels</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Roof Area Needed</span>
              <span class="font-semibold text-gray-800">${fmt(r.requiredArea)} sq ft</span>
            </div>
            <div class="mt-2">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-500">Area Utilization</span>
                <span class="font-medium text-gray-700">${r.areaUsedPct}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${Math.min(r.areaUsedPct, 100)}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Annual Performance -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h4 class="font-semibold text-gray-800 text-sm">Annual Performance</h4>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-baseline">
              <span class="text-xs text-gray-500">Annual Generation</span>
              <span class="text-xl font-bold text-amber-600">${fmt(r.annualGeneration)} kWh</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Self-Consumption</span>
              <span class="font-semibold text-gray-800">${fmt(Math.round(r.selfConsumption))} kWh</span>
            </div>
            ${state.netMetering ? `
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Grid Export</span>
              <span class="font-semibold text-emerald-600">${fmt(Math.round(r.gridExport))} kWh</span>
            </div>` : ''}
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">CO₂ Reduction</span>
              <span class="font-semibold text-green-600">${r.annualCO2} tons/yr</span>
            </div>
          </div>
        </div>

        <!-- Financial Analysis -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h4 class="font-semibold text-gray-800 text-sm">Financial Summary</h4>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-baseline">
              <span class="text-xs text-gray-500">System Cost</span>
              <span class="text-lg font-bold text-gray-800">${fmtTk(r.systemCost)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Annual Savings</span>
              <span class="font-semibold text-emerald-600">${fmtTk(r.year1Savings)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Monthly Savings</span>
              <span class="font-semibold text-emerald-600">${fmtTk(r.monthlySavings)}</span>
            </div>
            <div class="pt-2 border-t border-gray-100 flex justify-between text-sm">
              <span class="text-gray-500">Payback Period</span>
              <span class="inline-flex items-center gap-1 font-bold text-${paybackColor}-600">
                ${r.simplePayback} yrs
                <span class="text-[10px] font-medium bg-${paybackColor}-100 text-${paybackColor}-700 px-1.5 py-0.5 rounded-full">${paybackLabel}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ROI Highlights Bar -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-around gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-emerald-700">${r.roi25}%</div>
          <div class="text-xs text-emerald-600 font-medium">25-Year ROI</div>
        </div>
        <div class="w-px h-10 bg-emerald-200 hidden sm:block"></div>
        <div class="text-center">
          <div class="text-2xl font-bold text-emerald-700">${fmtTk(r.netSavings25)}</div>
          <div class="text-xs text-emerald-600 font-medium">25-Year Net Savings</div>
        </div>
        <div class="w-px h-10 bg-emerald-200 hidden sm:block"></div>
        <div class="text-center">
          <div class="text-2xl font-bold text-emerald-700">${r.simplePayback} yrs</div>
          <div class="text-xs text-emerald-600 font-medium">Payback Period</div>
        </div>
        <div class="w-px h-10 bg-emerald-200 hidden sm:block"></div>
        <div class="text-center">
          <div class="text-2xl font-bold text-emerald-700">${r.co2_25years} t</div>
          <div class="text-xs text-emerald-600 font-medium">CO₂ Avoided (25yr)</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- 25-Year Cash Flow -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h4 class="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            25-Year Cash Flow Analysis
          </h4>
          <div style="height: 280px;"><canvas id="roi-cashflow-chart"></canvas></div>
        </div>

        <!-- Monthly Generation -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h4 class="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm6.364 3.636a1 1 0 010 1.414l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM21 11a1 1 0 110 2h-2a1 1 0 110-2h2zM17.95 17.95a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 111.414-1.414l1.414 1.414a1 1 0 010 1.414zM13 19a1 1 0 11-2 0v-2a1 1 0 112 0v2zm-6.364-.636a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414a1 1 0 01-1.414 0zM3 13a1 1 0 110-2h2a1 1 0 110 2H3zm2.636-7.95a1 1 0 011.414 0l1.414 1.414A1 1 0 017.05 7.878L5.636 6.464a1 1 0 010-1.414zM12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
            Monthly Generation Estimate
          </h4>
          <div style="height: 280px;"><canvas id="roi-monthly-chart"></canvas></div>
        </div>
      </div>

      <!-- Environmental Impact -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h4 class="font-semibold text-gray-800 text-sm mb-5 flex items-center gap-2">
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          25-Year Environmental Impact
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-green-50 rounded-xl">
            <div class="w-14 h-14 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            </div>
            <div class="text-3xl font-bold text-green-700">${r.co2_25years}</div>
            <div class="text-sm text-green-600 font-medium">Tons CO₂ Avoided</div>
            <div class="text-xs text-gray-500 mt-1">Over 25 years</div>
          </div>
          <div class="text-center p-4 bg-emerald-50 rounded-xl">
            <div class="w-14 h-14 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div class="text-3xl font-bold text-emerald-700">${fmt(r.treesEquivalent)}</div>
            <div class="text-sm text-emerald-600 font-medium">Trees Equivalent</div>
            <div class="text-xs text-gray-500 mt-1">Planted and grown for 25 years</div>
          </div>
          <div class="text-center p-4 bg-teal-50 rounded-xl">
            <div class="w-14 h-14 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center">
              <svg class="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div class="text-3xl font-bold text-teal-700">${r.carsOffRoad}</div>
            <div class="text-sm text-teal-600 font-medium">Cars Off the Road</div>
            <div class="text-xs text-gray-500 mt-1">Annual equivalent</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons & Disclaimer -->
      <div class="flex flex-wrap items-center gap-3">
        <button id="roi-downloadReport" class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Download Report
        </button>
        <button id="roi-requestQuote" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 border border-emerald-300 rounded-lg font-medium text-sm hover:bg-emerald-50 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Request Quotation
        </button>
        <div class="ml-auto text-xs text-gray-400 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          This is an estimate based on average conditions. Actual results may vary based on site survey.
        </div>
      </div>
    `;

    createCharts(r);
    bindOutputEvents(r);
  }

  // ── Charts ─────────────────────────────────────────────────────────
  function createCharts(r) {
    // Destroy old charts
    if (cashFlowChart) { cashFlowChart.destroy(); cashFlowChart = null; }
    if (monthlyGenChart) { monthlyGenChart.destroy(); monthlyGenChart = null; }

    // Cash Flow Chart
    const cfCtx = document.getElementById('roi-cashflow-chart');
    if (cfCtx) {
      const years = r.yearlyData.map(d => 'Yr ' + d.year);
      const cumulativeSavings = r.yearlyData.map(d => d.cumulativeSavings);
      const investmentLine = r.yearlyData.map(() => r.systemCost);
      const netPosition = r.yearlyData.map(d => d.netPosition);

      cashFlowChart = new Chart(cfCtx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Cumulative Savings',
              data: cumulativeSavings,
              backgroundColor: cumulativeSavings.map((v, i) => netPosition[i] >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(16, 185, 129, 0.35)'),
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 1,
              borderRadius: 3,
              order: 2
            },
            {
              label: 'System Investment',
              data: investmentLine,
              type: 'line',
              borderColor: 'rgba(239, 68, 68, 0.8)',
              borderWidth: 2,
              borderDash: [6, 3],
              pointRadius: 0,
              pointHoverRadius: 4,
              fill: false,
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, padding: 15, font: { size: 11 } }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.dataset.label + ': ৳' + new Intl.NumberFormat('en-IN').format(ctx.raw)
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 13 }
            },
            y: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                font: { size: 10 },
                callback: (v) => '৳' + (v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v)
              }
            }
          }
        }
      });
    }

    // Monthly Generation Chart
    const mgCtx = document.getElementById('roi-monthly-chart');
    if (mgCtx) {
      const months = Object.keys(r.monthlyGen);
      const values = Object.values(r.monthlyGen);
      const maxVal = Math.max(...values);
      const colors = values.map(v => {
        const ratio = v / maxVal;
        if (ratio > 0.85) return 'rgba(245, 158, 11, 0.8)';
        if (ratio > 0.7) return 'rgba(251, 191, 36, 0.7)';
        return 'rgba(253, 224, 71, 0.6)';
      });

      monthlyGenChart = new Chart(mgCtx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{
            label: 'Generation (kWh)',
            data: values,
            backgroundColor: colors,
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.raw.toLocaleString('en-IN') + ' kWh',
                afterLabel: (ctx) => {
                  const monthKey = Object.keys(MONTHLY_IRRADIANCE)[ctx.dataIndex];
                  return 'Irradiance: ' + MONTHLY_IRRADIANCE[monthKey] + ' kWh/m²/day';
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 11 } }
            },
            y: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                font: { size: 10 },
                callback: (v) => v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v
              }
            }
          }
        }
      });
    }
  }

  // ── Download Report ────────────────────────────────────────────────
  function generateReport(r) {
    const date = new Date().toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' });
    const lines = [
      '═══════════════════════════════════════════════════════════',
      '          SOLAR ROI ANALYSIS REPORT - BANGLADESH',
      '═══════════════════════════════════════════════════════════',
      `Report Date: ${date}`,
      '',
      '── INPUT PARAMETERS ──────────────────────────────────────',
      `Location:               ${state.location}`,
      `Monthly Bill:           ৳${fmt(state.monthlyBill)}`,
      `Electricity Rate:       ৳${state.electricityRate}/kWh`,
      `Available Roof Area:    ${fmt(state.roofArea)} sq ft`,
      `Roof Type:              ${state.roofType}`,
      `Daytime Load:           ${state.daytimeLoad} kW`,
      `Night Load:             ${state.nightLoad} kW`,
      `Panel Type:             ${state.panelType}`,
      `Net Metering:           ${state.netMetering ? 'Yes' : 'No'}`,
      `Battery Storage:        ${state.batteryStorage ? 'Yes' : 'No'}`,
      '',
      '── RECOMMENDED SYSTEM ────────────────────────────────────',
      `System Size:            ${r.systemKwp} kWp`,
      `Number of Panels:       ${r.numPanels}`,
      `Required Roof Area:     ${fmt(r.requiredArea)} sq ft`,
      `Roof Utilization:       ${r.areaUsedPct}%`,
      '',
      '── ANNUAL PERFORMANCE ────────────────────────────────────',
      `Annual Generation:      ${fmt(r.annualGeneration)} kWh`,
      `Self-Consumption:       ${fmt(Math.round(r.selfConsumption))} kWh`,
      `Grid Export:            ${fmt(Math.round(r.gridExport))} kWh`,
      `CO₂ Reduction:          ${r.annualCO2} tons/year`,
      '',
      '── FINANCIAL ANALYSIS ────────────────────────────────────',
      `Estimated System Cost:  ৳${fmt(r.systemCost)}`,
      `Annual Savings (Yr 1):  ৳${fmt(r.year1Savings)}`,
      `Monthly Savings (Yr 1): ৳${fmt(r.monthlySavings)}`,
      `Simple Payback Period:  ${r.simplePayback} years`,
      `25-Year ROI:            ${r.roi25}%`,
      `25-Year Net Savings:    ৳${fmt(r.netSavings25)}`,
      '',
      '── 25-YEAR CASH FLOW ─────────────────────────────────────',
      'Year | Annual Savings | Cumulative | Net Position',
      '-----+----------------+------------+-------------',
      ...r.yearlyData.map(d =>
        `  ${String(d.year).padStart(2)} | ৳${String(fmt(d.annualSavings)).padStart(13)} | ৳${String(fmt(d.cumulativeSavings)).padStart(10)} | ৳${String(fmt(d.netPosition)).padStart(11)}`
      ),
      '',
      '── ENVIRONMENTAL IMPACT (25 YEARS) ──────────────────────',
      `CO₂ Avoided:            ${r.co2_25years} tons`,
      `Trees Equivalent:       ${fmt(r.treesEquivalent)} trees`,
      `Cars Off Road:          ${r.carsOffRoad} cars (annual equivalent)`,
      '',
      '── ASSUMPTIONS ───────────────────────────────────────────',
      `System Loss:            ${state.systemLoss}%`,
      `Panel Degradation:      ${state.panelDegradation}%/year`,
      `Cost per kWp:           ৳${fmt(state.costPerKwp)}`,
      `Annual Maintenance:     ${state.maintenancePct}% of system cost`,
      `Price Escalation:       ${state.priceEscalation}%/year`,
      `Net Metering Rate:      ৳${state.netMeteringRate}/kWh (BPDB)`,
      '',
      '═══════════════════════════════════════════════════════════',
      'DISCLAIMER: This is an estimate based on average conditions.',
      'Actual results may vary based on site survey, weather patterns,',
      'equipment specifications, and grid policies.',
      '═══════════════════════════════════════════════════════════',
      'Generated by SolarOps Bangladesh | www.solarops.com.bd',
      ''
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Solar_ROI_Report_${state.location}_${r.systemKwp}kWp.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Event Binding ──────────────────────────────────────────────────
  function bindEvents() {
    const el = (id) => document.getElementById(id);

    // Slider + input sync for Monthly Bill
    const billSlider = el('roi-monthlyBill');
    const billInput = el('roi-monthlyBill-input');
    if (billSlider && billInput) {
      billSlider.addEventListener('input', () => { billInput.value = billSlider.value; state.monthlyBill = +billSlider.value; updateOutput(); });
      billInput.addEventListener('input', () => { billSlider.value = billInput.value; state.monthlyBill = +billInput.value; updateOutput(); });
    }

    // Slider + input sync for Roof Area
    const roofSlider = el('roi-roofArea');
    const roofInput = el('roi-roofArea-input');
    if (roofSlider && roofInput) {
      roofSlider.addEventListener('input', () => { roofInput.value = roofSlider.value; state.roofArea = +roofSlider.value; updateOutput(); });
      roofInput.addEventListener('input', () => { roofSlider.value = roofInput.value; state.roofArea = +roofInput.value; updateOutput(); });
    }

    // Simple inputs
    const simpleBindings = [
      ['roi-electricityRate', 'electricityRate'],
      ['roi-daytimeLoad', 'daytimeLoad'],
      ['roi-nightLoad', 'nightLoad'],
    ];
    simpleBindings.forEach(([id, key]) => {
      const input = el(id);
      if (input) input.addEventListener('input', () => { state[key] = +input.value; updateOutput(); });
    });

    // Selects
    const selectBindings = [
      ['roi-roofType', 'roofType'],
      ['roi-location', 'location'],
      ['roi-panelType', 'panelType'],
    ];
    selectBindings.forEach(([id, key]) => {
      const select = el(id);
      if (select) select.addEventListener('change', () => { state[key] = select.value; updateOutput(); });
    });

    // Toggles
    const toggleBindings = [
      ['roi-netMetering', 'netMetering'],
      ['roi-batteryStorage', 'batteryStorage'],
    ];
    toggleBindings.forEach(([id, key]) => {
      const cb = el(id);
      if (cb) cb.addEventListener('change', () => { state[key] = cb.checked; updateOutput(); });
    });

    // Advanced toggle
    const advToggle = el('roi-advancedToggle');
    const advPanel = el('roi-advancedPanel');
    const advChevron = el('roi-advancedChevron');
    if (advToggle && advPanel) {
      advToggle.addEventListener('click', () => {
        advPanel.classList.toggle('hidden');
        if (advChevron) advChevron.style.transform = advPanel.classList.contains('hidden') ? '' : 'rotate(180deg)';
      });
    }

    // Advanced inputs
    const advBindings = [
      ['roi-systemLoss', 'systemLoss'],
      ['roi-panelDegradation', 'panelDegradation'],
      ['roi-costPerKwp', 'costPerKwp'],
      ['roi-maintenancePct', 'maintenancePct'],
      ['roi-priceEscalation', 'priceEscalation'],
      ['roi-netMeteringRate', 'netMeteringRate'],
      ['roi-batteryCostPerKwh', 'batteryCostPerKwh'],
      ['roi-batteryCapacityHours', 'batteryCapacityHours'],
    ];
    advBindings.forEach(([id, key]) => {
      const input = el(id);
      if (input) input.addEventListener('input', () => { state[key] = +input.value; updateOutput(); });
    });

    // Reset defaults
    const resetBtn = el('roi-resetDefaults');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.systemLoss = 15;
        state.panelDegradation = 0.5;
        state.costPerKwp = 65000;
        state.maintenancePct = 1;
        state.priceEscalation = 5;
        state.netMeteringRate = 6.50;
        state.batteryCostPerKwh = 15000;
        state.batteryCapacityHours = 4;
        // Re-render advanced inputs
        advBindings.forEach(([id, key]) => {
          const input = el(id);
          if (input) input.value = state[key];
        });
        updateOutput();
      });
    }
  }

  function bindOutputEvents(r) {
    const dlBtn = document.getElementById('roi-downloadReport');
    if (dlBtn) dlBtn.addEventListener('click', () => generateReport(r));

    const quoteBtn = document.getElementById('roi-requestQuote');
    if (quoteBtn) {
      quoteBtn.addEventListener('click', () => {
        const subject = encodeURIComponent(`Solar Quotation Request - ${r.systemKwp} kWp System`);
        const body = encodeURIComponent(
          `Dear SolarOps Team,\n\nI am interested in a solar system with the following specifications:\n\n` +
          `Location: ${state.location}\nSystem Size: ${r.systemKwp} kWp\nRoof Area: ${fmt(state.roofArea)} sq ft\nRoof Type: ${state.roofType}\n` +
          `Panel Type: ${state.panelType}\nNet Metering: ${state.netMetering ? 'Yes' : 'No'}\nBattery: ${state.batteryStorage ? 'Yes' : 'No'}\n\n` +
          `Please provide a detailed quotation.\n\nThank you.`
        );
        window.open(`mailto:info@solarops.com.bd?subject=${subject}&body=${body}`, '_self');
      });
    }
  }

  // ── Update Loop (debounced) ────────────────────────────────────────
  let updateTimer = null;
  function updateOutput() {
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      const r = calculate();
      renderOutput(r);
    }, 50);
  }

  // ── Initialize ─────────────────────────────────────────────────────
  render();
}

// Auto-initialize if container exists
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('roi-calculator')) {
      renderROICalculator('roi-calculator');
    }
  });
}
