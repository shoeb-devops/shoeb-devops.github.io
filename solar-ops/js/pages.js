// SolarOps Bangladesh - Secondary Pages Component Library (v3.0 - Full Interactivity)

const defaultPlantsData = [
    {
        id: 'plant-1',
        name: 'Dhaka ReadyMade Factory',
        location: 'Tejgaon I/A, Dhaka',
        capacity: 100,
        status: 'Online',
        todayEnergy: 412.0,
        monthEnergy: 9240,
        pr: 82.4,
        modules: '184 × Longi Hi-MO 5 545W',
        inverters: '2 × Huawei SUN2000-50KTL',
        netMetering: 'Active (DESCO #NEM-491)',
        commissioned: '15 March 2025',
        note: 'IoT Ping: 12s ago'
    },
    {
        id: 'plant-2',
        name: 'Bay Shipping Port Warehouse',
        location: 'Patenga, Chittagong',
        capacity: 50,
        status: 'Online',
        todayEnergy: 198.5,
        monthEnergy: 4120,
        pr: 79.8,
        modules: '92 × JA Solar 545W Mono',
        inverters: '1 × Huawei SUN2000-50KTL',
        netMetering: 'Active (BPDB #NEM-112)',
        commissioned: '20 June 2025',
        note: 'Temp: 58°C Warning'
    },
    {
        id: 'plant-3',
        name: 'GreenTech Gazipur Complex',
        location: 'Tongi, Gazipur',
        capacity: 30,
        status: 'Maintenance',
        todayEnergy: 0.0,
        monthEnergy: 2890,
        pr: 75.2,
        modules: '56 × Trina Vertex S 540W',
        inverters: '1 × Growatt MIN 30000TL-X',
        netMetering: 'Pending Evaluation',
        commissioned: '01 Sept 2025',
        note: 'Scheduled Inverter Check'
    }
];

window.SolarOpsPages = {
    // ── Universal Modal Framework (Attached Directly to document.body) ──
    showModal: function(title, bodyHtml, footerButtonsHtml) {
        let m = document.getElementById('solarops-dynamic-modal');
        if (!m) {
            m = document.createElement('div');
            m.id = 'solarops-dynamic-modal';
            document.body.appendChild(m);
        }
        m.className = 'fixed inset-0 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4';
        m.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 999999 !important; display: flex !important;';
        
        m.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-fade-in relative" onclick="event.stopPropagation()">
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                    <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">${title}</h3>
                    <button onclick="SolarOpsPages.closeModal()" class="text-slate-400 hover:text-slate-600 text-lg p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="p-6 text-xs text-slate-600 space-y-4 max-h-[75vh] overflow-y-auto">
                    ${bodyHtml}
                </div>
                ${footerButtonsHtml ? `<div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 text-xs">${footerButtonsHtml}</div>` : ''}
            </div>
        `;
        m.onclick = () => SolarOpsPages.closeModal();
    },

    closeModal: function() {
        const m = document.getElementById('solarops-dynamic-modal');
        if (m) {
            m.style.display = 'none';
        }
    },

    showToast: function(msg) {
        let toast = document.getElementById('solarops-floating-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'solarops-floating-toast';
            document.body.appendChild(toast);
        }
        toast.style.cssText = 'position: fixed !important; bottom: 24px !important; right: 24px !important; z-index: 999999 !important; display: flex !important;';
        toast.className = 'bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl items-center gap-3 border border-slate-700 text-xs font-semibold';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-base"></i> <span>${msg}</span>`;
        setTimeout(() => { if (toast) toast.style.display = 'none'; }, 3500);
    },

    // ── 1. SOLAR PLANTS MANAGEMENT ──
    getPlants: function() {
        try {
            const stored = localStorage.getItem('solarops_plants_data');
            if (stored) return JSON.parse(stored);
        } catch(e){}
        return defaultPlantsData;
    },

    savePlants: function(plants) {
        try {
            localStorage.setItem('solarops_plants_data', JSON.stringify(plants));
        } catch(e){}
    },

    openAddPlantModal: function() {
        const formHtml = `
            <form id="new-plant-form" onsubmit="return SolarOpsPages.submitNewPlant(event)" class="space-y-3.5">
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Plant Name *</label>
                    <input id="np-name" type="text" placeholder="e.g. Apex Footwear Gazipur Unit" required
                           class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Location *</label>
                        <input id="np-location" type="text" placeholder="e.g. Kashimpur, Gazipur" required
                               class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800" />
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Capacity (kWp) *</label>
                        <input id="np-capacity" type="number" step="1" min="5" max="5000" value="75" required
                               class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">PV Modules</label>
                        <input id="np-modules" type="text" value="138 × Longi Hi-MO 6 550W"
                               class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Inverter Model</label>
                        <input id="np-inverters" type="text" value="1 × Huawei SUN2000-60KTL"
                               class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Utility DisCom</label>
                        <select id="np-discom" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium">
                            <option value="DESCO">DESCO (Dhaka North)</option>
                            <option value="DPDC">DPDC (Dhaka South)</option>
                            <option value="BPDB">BPDB (Chittagong/Urban)</option>
                            <option value="BREB">BREB / Palli Bidyut</option>
                            <option value="WZPDCL">WZPDCL (Khulna)</option>
                            <option value="NESCO">NESCO (Rajshahi)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Initial Status</label>
                        <select id="np-status" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium">
                            <option value="Online">🟢 Online (Active)</option>
                            <option value="Maintenance">🟡 Maintenance</option>
                            <option value="Testing">🔵 Commissioning / Testing</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Net Metering Status</label>
                    <select id="np-nem" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium">
                        <option value="Active NEM">Active (Agreement Signed)</option>
                        <option value="Step 5: Testing">Step 5: Anti-Islanding Joint Inspection</option>
                        <option value="Step 2: Feasibility">Step 2: DisCom Feasibility Check</option>
                        <option value="Pending Evaluation">Application Submitted</option>
                    </select>
                </div>
            </form>
        `;

        const footerButtons = `
            <button type="button" onclick="SolarOpsPages.closeModal()" class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-medium cursor-pointer">
                Cancel
            </button>
            <button type="button" onclick="SolarOpsPages.submitNewPlant(event)" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-check"></i> Register Plant
            </button>
        `;

        SolarOpsPages.showModal('<i class="fa-solid fa-solar-panel text-blue-600"></i> Register New Solar Plant', formHtml, footerButtons);
    },

    submitNewPlant: function(e) {
        if (e) e.preventDefault();
        const name = document.getElementById('np-name')?.value.trim();
        const location = document.getElementById('np-location')?.value.trim();
        const capacity = parseFloat(document.getElementById('np-capacity')?.value) || 50;
        const modules = document.getElementById('np-modules')?.value.trim() || 'Tier-1 Mono PERC 545W';
        const inverters = document.getElementById('np-inverters')?.value.trim() || 'Huawei SUN2000-50KTL';
        const discom = document.getElementById('np-discom')?.value || 'DESCO';
        const nemStatus = document.getElementById('np-nem')?.value || 'Pending Evaluation';
        const status = document.getElementById('np-status')?.value || 'Online';

        if (!name || !location) {
            alert('Please fill in Plant Name and Location');
            return false;
        }

        const plants = SolarOpsPages.getPlants();
        const newPlant = {
            id: 'plant-' + Date.now(),
            name: name,
            location: location,
            capacity: capacity,
            status: status,
            todayEnergy: status === 'Online' ? Number((capacity * 3.8).toFixed(1)) : 0,
            monthEnergy: Math.round(capacity * 88),
            pr: status === 'Online' ? 81.5 : 74.0,
            modules: modules,
            inverters: inverters,
            netMetering: nemStatus + ' (' + discom + ')',
            commissioned: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            note: 'IoT Online • Just Added'
        };

        plants.unshift(newPlant);
        SolarOpsPages.savePlants(plants);
        SolarOpsPages.closeModal();
        SolarOpsPages.refreshPlantsView();
        SolarOpsPages.showToast('✅ New plant "' + name + '" successfully added to fleet!');
        return false;
    },

    deletePlant: function(id) {
        if (!confirm('Are you sure you want to remove this solar plant from monitoring?')) return;
        let plants = SolarOpsPages.getPlants();
        plants = plants.filter(p => p.id !== id);
        SolarOpsPages.savePlants(plants);
        SolarOpsPages.refreshPlantsView();
        SolarOpsPages.showToast('Plant removed from monitoring fleet');
    },

    refreshPlantsView: function() {
        const root = document.getElementById('solarops-plants-root');
        if (root) {
            root.outerHTML = SolarOpsPages.renderPlants();
        }
    },

    exportPlantsCSV: function() {
        const plants = SolarOpsPages.getPlants();
        let csv = 'ID,Plant Name,Location,Capacity (kWp),Status,Today (kWh),Month (kWh),PR (%),Modules,Inverters,Net Metering,Commissioned\n';
        plants.forEach(p => {
            csv += `"${p.id}","${p.name}","${p.location}","${p.capacity}","${p.status}","${p.todayEnergy}","${p.monthEnergy}","${p.pr}","${p.modules}","${p.inverters}","${p.netMetering}","${p.commissioned}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SolarOps_Plants_Fleet_' + new Date().toISOString().slice(0,10) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        SolarOpsPages.showToast('📊 Solar Plants CSV Exported!');
    },

    renderPlants: function() {
        const plants = SolarOpsPages.getPlants();
        const totalPlants = plants.length;
        const totalCapacity = plants.reduce((sum, p) => sum + Number(p.capacity || 0), 0);
        const activePlants = plants.filter(p => p.status === 'Online').length;
        const maintPlants = plants.filter(p => p.status !== 'Online').length;
        const livePower = activePlants > 0 ? (totalCapacity * 0.402).toFixed(1) : '0.0';
        const avgPr = (plants.reduce((sum, p) => sum + Number(p.pr || 80), 0) / (totalPlants || 1)).toFixed(1);

        const cardsHtml = plants.map(p => {
            const isOnline = p.status === 'Online';
            const badgeClass = isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200';
            const dotClass = isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500';

            return `
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div class="p-5 border-b border-slate-100">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass} border inline-flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span> ${p.status}
                            </span>
                            <h3 class="text-lg font-bold text-slate-800 mt-2 truncate" title="${p.name}">${p.name}</h3>
                            <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><i class="fa-solid fa-location-dot text-slate-400"></i> ${p.location}</p>
                        </div>
                        <div class="text-right">
                            <span class="text-xl font-extrabold text-blue-600 block">${p.capacity} kWp</span>
                            <button onclick="SolarOpsPages.deletePlant('${p.id}')" class="text-slate-300 hover:text-rose-500 text-xs mt-1 transition cursor-pointer" title="Remove plant">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-5 space-y-4">
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                            <span class="text-xs text-slate-400 block">Today's Energy</span>
                            <span class="font-bold text-slate-800 text-base">${p.todayEnergy} kWh</span>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                            <span class="text-xs text-slate-400 block">This Month</span>
                            <span class="font-bold text-slate-800 text-base">${p.monthEnergy} kWh</span>
                        </div>
                    </div>
                    <div class="space-y-2 text-xs text-slate-600">
                        <div class="flex justify-between"><span>Performance Ratio (PR):</span><span class="font-semibold text-emerald-600">${p.pr}%</span></div>
                        <div class="flex justify-between"><span>Modules:</span><span class="font-medium text-slate-800 truncate max-w-[65%]" title="${p.modules}">${p.modules}</span></div>
                        <div class="flex justify-between"><span>Inverters:</span><span class="font-medium text-slate-800 truncate max-w-[65%]" title="${p.inverters}">${p.inverters}</span></div>
                        <div class="flex justify-between"><span>Net Metering:</span><span class="font-semibold text-emerald-600 truncate max-w-[65%]" title="${p.netMetering}">${p.netMetering}</span></div>
                        <div class="flex justify-between"><span>Commissioned:</span><span class="text-slate-500">${p.commissioned}</span></div>
                    </div>
                </div>
                <div class="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span class="${isOnline ? 'text-slate-500' : 'text-rose-500 font-medium'}"><i class="fa-solid fa-satellite-dish text-slate-400 mr-1"></i> ${p.note}</span>
                    <button onclick="if(window.solarApp) window.solarApp.selectPage('inverters')" class="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">
                        Open Telemetry <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

        return `
        <div id="solarops-plants-root" class="p-4 sm:p-6 space-y-6">
            <!-- Header & Action -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Solar Plants Management</h2>
                    <p class="text-sm text-slate-500">Commercial & Industrial (C&I) rooftop plants monitoring across Bangladesh</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="SolarOpsPages.exportPlantsCSV()" class="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-2 cursor-pointer">
                        <i class="fa-solid fa-download"></i> Export Data
                    </button>
                    <button onclick="SolarOpsPages.openAddPlantModal()" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow flex items-center gap-2 cursor-pointer">
                        <i class="fa-solid fa-plus"></i> Add New Plant
                    </button>
                </div>
            </div>

            <!-- KPI Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl"><i class="fa-solid fa-solar-panel"></i></div>
                    <div>
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Plants</p>
                        <h4 class="text-2xl font-bold text-slate-800">${totalPlants} Sites</h4>
                        <span class="text-xs text-emerald-600 font-medium"><i class="fa-solid fa-check"></i> 100% Monitored</span>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl"><i class="fa-solid fa-bolt"></i></div>
                    <div>
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Capacity</p>
                        <h4 class="text-2xl font-bold text-slate-800">${totalCapacity} kWp</h4>
                        <span class="text-xs text-slate-500 font-medium">${Math.round(totalCapacity * 1.84)} Modules</span>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl"><i class="fa-solid fa-signal"></i></div>
                    <div>
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Generation</p>
                        <h4 class="text-2xl font-bold text-slate-800">${livePower} kW</h4>
                        <span class="text-xs text-emerald-600 font-medium">${activePlants} Active | ${maintPlants} Maint.</span>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xl"><i class="fa-solid fa-chart-line"></i></div>
                    <div>
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. PR Ratio</p>
                        <h4 class="text-2xl font-bold text-slate-800">${avgPr}%</h4>
                        <span class="text-xs text-emerald-600 font-medium">Industry Benchmark &gt;78%</span>
                    </div>
                </div>
            </div>

            <!-- Plants Detailed Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${cardsHtml}
            </div>
        </div>
        `;
    },

    // ── 2. INVERTERS TELEMETRY ──
    openInverterDetails: function(name, model, kw, dcV, dcA, temp, pr) {
        const body = `
            <div class="space-y-3">
                <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 flex justify-between items-center">
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm">${name} — ${model}</h4>
                        <p class="text-[11px] text-slate-500">Telemetry feed from Modbus Gateway (RS-485)</p>
                    </div>
                    <span class="text-lg font-black text-blue-600">${kw} kW</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="p-2.5 bg-slate-50 rounded-lg"><span class="text-slate-400 block">DC Voltage:</span><strong>${dcV} V</strong></div>
                    <div class="p-2.5 bg-slate-50 rounded-lg"><span class="text-slate-400 block">DC Current:</span><strong>${dcA} A</strong></div>
                    <div class="p-2.5 bg-slate-50 rounded-lg"><span class="text-slate-400 block">Grid Frequency:</span><strong>50.01 Hz</strong></div>
                    <div class="p-2.5 bg-slate-50 rounded-lg"><span class="text-slate-400 block">Efficiency:</span><strong class="text-emerald-600">${pr}%</strong></div>
                    <div class="p-2.5 bg-slate-50 rounded-lg"><span class="text-slate-400 block">Internal Heat Sink:</span><strong class="${temp.includes('58') ? 'text-rose-600 font-bold' : 'text-slate-700'}">${temp}</strong></div>
                    <div class="p-2.5 bg-slate-50 rounded-lg"><span class="text-slate-400 block">Cooling Fan:</span><strong>2,400 RPM (Normal)</strong></div>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <span class="font-semibold text-slate-700 block">Harmonics & Grid Protection</span>
                    <p class="text-slate-500">THD-i: 1.8% (&lt; 3% IEEE 519 compliant) • Anti-Islanding Relay: Armed • Insulation Resistance: 32 MΩ</p>
                </div>
            </div>
        `;
        SolarOpsPages.showModal('<i class="fa-solid fa-microchip text-blue-600"></i> Inverter Diagnostic Details', body, `
            <button onclick="SolarOpsPages.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium">Close</button>
        `);
    },

    renderInverters: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Inverters Telemetry</h2>
                    <p class="text-sm text-slate-500">Real-time MPPT, AC/DC parameters, efficiency and thermals via Modbus RS485 & IoT Gateways</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> 3 / 4 Inverters Online
                    </span>
                </div>
            </div>

            <!-- Inverter Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Inverter 1 -->
                <div onclick="SolarOpsPages.openInverterDetails('INV-001','Huawei SUN2000-50KTL','38.2','580','66.0','42°C','98.4')"
                     class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition cursor-pointer">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">INV-001</span>
                            <h4 class="font-bold text-slate-800 text-sm mt-1">Huawei SUN2000-50KTL</h4>
                            <p class="text-[11px] text-slate-400">Dhaka Factory - Roof 01</p>
                        </div>
                        <span class="w-3 h-3 rounded-full bg-emerald-500" title="Online"></span>
                    </div>
                    <div class="text-center py-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100/60">
                        <span class="text-xs text-slate-500 font-medium">Output Power</span>
                        <div class="text-2xl font-black text-slate-800">38.2 <span class="text-sm font-semibold text-slate-500">/ 50 kW</span></div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full mt-2 max-w-[80%] mx-auto overflow-hidden">
                            <div class="bg-blue-600 h-full rounded-full" style="width: 76.4%"></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                        <div><span class="text-slate-400 block">Today:</span> <strong class="text-slate-700">215.2 kWh</strong></div>
                        <div><span class="text-slate-400 block">Efficiency:</span> <strong class="text-emerald-600">98.4%</strong></div>
                        <div><span class="text-slate-400 block">DC Voltage:</span> <strong class="text-slate-700">580 V</strong></div>
                        <div><span class="text-slate-400 block">Internal Temp:</span> <strong class="text-slate-700">42°C</strong></div>
                    </div>
                    <div class="text-[11px] text-blue-600 font-medium text-center pt-1">Click for live diagnostic telemetry →</div>
                </div>

                <!-- Inverter 2 -->
                <div onclick="SolarOpsPages.openInverterDetails('INV-002','Huawei SUN2000-50KTL','34.1','572','59.6','44°C','98.1')"
                     class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition cursor-pointer">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">INV-002</span>
                            <h4 class="font-bold text-slate-800 text-sm mt-1">Huawei SUN2000-50KTL</h4>
                            <p class="text-[11px] text-slate-400">Dhaka Factory - Roof 02</p>
                        </div>
                        <span class="w-3 h-3 rounded-full bg-emerald-500" title="Online"></span>
                    </div>
                    <div class="text-center py-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100/60">
                        <span class="text-xs text-slate-500 font-medium">Output Power</span>
                        <div class="text-2xl font-black text-slate-800">34.1 <span class="text-sm font-semibold text-slate-500">/ 50 kW</span></div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full mt-2 max-w-[80%] mx-auto overflow-hidden">
                            <div class="bg-blue-600 h-full rounded-full" style="width: 68.2%"></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                        <div><span class="text-slate-400 block">Today:</span> <strong class="text-slate-700">196.8 kWh</strong></div>
                        <div><span class="text-slate-400 block">Efficiency:</span> <strong class="text-emerald-600">98.1%</strong></div>
                        <div><span class="text-slate-400 block">DC Voltage:</span> <strong class="text-slate-700">572 V</strong></div>
                        <div><span class="text-slate-400 block">Internal Temp:</span> <strong class="text-slate-700">44°C</strong></div>
                    </div>
                    <div class="text-[11px] text-blue-600 font-medium text-center pt-1">Click for live diagnostic telemetry →</div>
                </div>

                <!-- Inverter 3 -->
                <div onclick="SolarOpsPages.openInverterDetails('INV-003','Huawei SUN2000-50KTL','41.8','595','70.2','58°C (High)','97.6')"
                     class="bg-white rounded-xl border border-amber-300 shadow-sm p-5 space-y-4 hover:shadow-md transition cursor-pointer relative">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">INV-003</span>
                            <h4 class="font-bold text-slate-800 text-sm mt-1">Huawei SUN2000-50KTL</h4>
                            <p class="text-[11px] text-slate-400">Chittagong Warehouse</p>
                        </div>
                        <span class="w-3 h-3 rounded-full bg-amber-500 animate-ping" title="Warning"></span>
                    </div>
                    <div class="text-center py-2 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-200">
                        <span class="text-xs text-amber-700 font-semibold flex items-center justify-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Thermal Throttling</span>
                        <div class="text-2xl font-black text-slate-800">41.8 <span class="text-sm font-semibold text-slate-500">/ 50 kW</span></div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full mt-2 max-w-[80%] mx-auto overflow-hidden">
                            <div class="bg-amber-500 h-full rounded-full" style="width: 83.6%"></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                        <div><span class="text-slate-400 block">Today:</span> <strong class="text-slate-700">198.5 kWh</strong></div>
                        <div><span class="text-slate-400 block">Internal Temp:</span> <strong class="text-rose-600 font-extrabold text-sm">58°C 🔥</strong></div>
                    </div>
                    <div class="text-[11px] text-amber-700 font-medium text-center pt-1">Inspect thermal alarm details →</div>
                </div>

                <!-- Inverter 4 -->
                <div class="bg-white rounded-xl border border-slate-200 opacity-80 shadow-sm p-5 space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">INV-004</span>
                            <h4 class="font-bold text-slate-800 text-sm mt-1">Growatt MIN 30000TL-X</h4>
                            <p class="text-[11px] text-slate-400">Gazipur Office</p>
                        </div>
                        <span class="w-3 h-3 rounded-full bg-rose-500" title="Offline"></span>
                    </div>
                    <div class="text-center py-2 bg-slate-100 rounded-xl border border-slate-200">
                        <span class="text-xs text-slate-400 font-medium">Output Power</span>
                        <div class="text-2xl font-black text-slate-400">0.0 <span class="text-sm font-semibold text-slate-400">/ 30 kW</span></div>
                    </div>
                    <div class="bg-rose-50 p-2.5 rounded-lg text-[11px] text-rose-700 flex justify-between border border-rose-200">
                        <span>Offline for scheduled overhaul</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // ── 3. ENERGY METERS (IoT) ──
    renderMeters: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Bi-directional Energy Meters & IoT Gateway</h2>
                    <p class="text-sm text-slate-500">Modbus/RS-485 to MQTT telemetry, grid export/import monitoring and CT measurements</p>
                </div>
                <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                    <i class="fa-solid fa-microchip"></i> ESP32 Gateway Firmware v2.4.1
                </span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Meter 1 -->
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs bg-slate-100 font-mono text-slate-600 px-2 py-0.5 rounded">EM-DESCO-01</span>
                            <h4 class="font-bold text-slate-800 text-base mt-1">Schneider Electric EM6400NG</h4>
                            <p class="text-xs text-slate-400">Class 0.5s Bi-directional Net Meter</p>
                        </div>
                        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">CALIBRATED</span>
                    </div>
                    <div class="space-y-2 text-xs">
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Site:</span><strong class="text-slate-800">Dhaka Factory (100 kWp)</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Export Energy Today:</span><strong class="text-emerald-600 font-bold">123.4 kWh</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Import Energy Today:</span><strong class="text-blue-600 font-bold">95.0 kWh</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Net Flow (Export - Import):</span><strong class="text-emerald-700 font-bold">+28.4 kWh (Credit)</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Line Voltage (L1-L2-L3):</span><strong class="text-slate-800 font-mono">402V / 401V / 399V</strong></div>
                        <div class="flex justify-between py-1"><span class="text-slate-500">Gateway Link:</span><strong class="text-emerald-600"><i class="fa-solid fa-wifi"></i> ESP32-MQTT Active</strong></div>
                    </div>
                </div>

                <!-- Meter 2 -->
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs bg-slate-100 font-mono text-slate-600 px-2 py-0.5 rounded">EM-BPDB-02</span>
                            <h4 class="font-bold text-slate-800 text-base mt-1">Holley DTSD545 3-Phase</h4>
                            <p class="text-xs text-slate-400">BPDB Approved Commercial Net Meter</p>
                        </div>
                        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">CALIBRATED</span>
                    </div>
                    <div class="space-y-2 text-xs">
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Site:</span><strong class="text-slate-800">Chittagong Warehouse (50 kWp)</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Export Energy Today:</span><strong class="text-emerald-600 font-bold">84.2 kWh</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Import Energy Today:</span><strong class="text-blue-600 font-bold">47.8 kWh</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Net Flow (Export - Import):</span><strong class="text-emerald-700 font-bold">+36.4 kWh (Credit)</strong></div>
                        <div class="flex justify-between py-1 border-b border-slate-100"><span class="text-slate-500">Line Voltage:</span><strong class="text-slate-800 font-mono">398V / 400V / 397V</strong></div>
                        <div class="flex justify-between py-1"><span class="text-slate-500">Gateway Link:</span><strong class="text-emerald-600"><i class="fa-solid fa-wifi"></i> ESP32-MQTT Active</strong></div>
                    </div>
                </div>

                <!-- IoT Architecture Card -->
                <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm space-y-3">
                    <h4 class="font-bold text-white text-base flex items-center gap-2">
                        <i class="fa-solid fa-diagram-project text-blue-400"></i> IoT Architecture Demo
                    </h4>
                    <p class="text-xs text-slate-300">How the actual telemetry stream works from rooftop to your platform:</p>
                    <div class="bg-black/30 p-3 rounded-lg font-mono text-[11px] text-emerald-400 space-y-1">
                        <div>PV Array & Inverter (Modbus RTU)</div>
                        <div class="text-slate-400 pl-4">↓ RS-485 [9600 baud, 8N1]</div>
                        <div>ESP32 Microcontroller Gateway</div>
                        <div class="text-slate-400 pl-4">↓ Wi-Fi / 4G SIM (MQTT broker)</div>
                        <div>EMQX / Mosquitto MQTT Broker</div>
                        <div class="text-slate-400 pl-4">↓ Node.js / Laravel Ingestion Worker</div>
                        <div>PostgreSQL / TimescaleDB Time-series</div>
                        <div class="text-slate-400 pl-4">↓ REST API / WebSockets</div>
                        <div class="text-amber-300">SolarOps Bangladesh Live UI</div>
                    </div>
                    <div class="pt-2 text-xs text-slate-400">
                        ⚡ Built to withstand Bangladesh grid instability & brownouts with offline buffer flash storage on ESP32.
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // ── 4. ALERTS & DIAGNOSTICS ──
    openWebhooksModal: function() {
        const body = `
            <div class="space-y-3">
                <p class="text-slate-500">Configure instant dispatch for critical inverter tripping, grid disconnect and islanding alarms.</p>
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Telegram Bot Token / Chat ID</label>
                    <input type="text" value="@SolarOpsAlertBot / -10049281928" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono" />
                </div>
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Email Alert Recipients (comma separated)</label>
                    <input type="text" value="shoeb.ops@company.bd, duty.engineer@solarops.com" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">SMS Alert Gateway (Teletalk/Grameenphone API)</label>
                    <input type="text" value="+8801712000000, +8801819000000" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                </div>
            </div>
        `;
        SolarOpsPages.showModal('<i class="fa-solid fa-bell text-blue-600"></i> Configure Alert Dispatch Webhooks', body, `
            <button onclick="SolarOpsPages.closeModal()" class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600">Cancel</button>
            <button onclick="SolarOpsPages.closeModal(); SolarOpsPages.showToast('✅ Webhook channels updated successfully!');" class="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save Webhooks</button>
        `);
    },

    filterAlerts: function(val) {
        const rows = document.querySelectorAll('#alerts-table-body tr');
        rows.forEach(r => {
            if (val === 'all') {
                r.style.display = '';
            } else if (val === 'critical') {
                r.style.display = r.innerText.includes('CRITICAL') ? '' : 'none';
            } else if (val === 'warning') {
                r.style.display = r.innerText.includes('WARNING') ? '' : 'none';
            }
        });
    },

    acknowledgeAlert: function(btn) {
        const tr = btn.closest('tr');
        if (tr) {
            const statusCell = tr.children[4];
            if (statusCell) statusCell.innerHTML = '<span class="text-blue-600 font-semibold">Acknowledged</span>';
            btn.innerText = 'Resolved';
            btn.className = 'px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 cursor-pointer';
            SolarOpsPages.showToast('Alert marked as acknowledged by operator');
        }
    },

    dismissAlert: function(btn) {
        const tr = btn.closest('tr');
        if (tr) {
            tr.remove();
            SolarOpsPages.showToast('Alert dismissed');
        }
    },

    renderAlerts: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Active Alerts & Diagnostics</h2>
                    <p class="text-sm text-slate-500">Real-time anomaly detection, inverter fault codes and threshold notifications</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="SolarOpsPages.showToast('All active alerts marked as acknowledged');" class="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer">Acknowledge All</button>
                    <button onclick="SolarOpsPages.openWebhooksModal()" class="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer">Configure Webhooks</button>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <div><span class="text-xs text-red-600 font-semibold uppercase">Critical Issues</span><h4 class="text-xl font-bold text-red-800">1 Plant</h4></div>
                </div>
                <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold"><i class="fa-solid fa-temperature-high"></i></div>
                    <div><span class="text-xs text-amber-600 font-semibold uppercase">Warnings</span><h4 class="text-xl font-bold text-amber-800">2 Inverters</h4></div>
                </div>
                <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold"><i class="fa-solid fa-check"></i></div>
                    <div><span class="text-xs text-emerald-600 font-semibold uppercase">Resolved (24h)</span><h4 class="text-xl font-bold text-emerald-800">5 Events</h4></div>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 class="font-bold text-slate-800 text-sm">System Event Log</h3>
                    <div class="flex gap-2">
                        <select onchange="SolarOpsPages.filterAlerts(this.value)" class="text-xs bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-700 font-medium">
                            <option value="all">All Severities</option>
                            <option value="critical">Critical Only</option>
                            <option value="warning">Warnings Only</option>
                        </select>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                            <tr>
                                <th class="p-3">Severity</th>
                                <th class="p-3">Plant & Device</th>
                                <th class="p-3">Alert Description</th>
                                <th class="p-3">Trigger Time</th>
                                <th class="p-3">Status</th>
                                <th class="p-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="alerts-table-body" class="divide-y divide-slate-100">
                            <tr class="hover:bg-red-50/30">
                                <td class="p-3"><span class="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded">CRITICAL</span></td>
                                <td class="p-3 font-semibold text-slate-800">Chittagong Warehouse<br><span class="text-slate-400 font-normal">Grid Disconnect (Island Mode)</span></td>
                                <td class="p-3 text-slate-600">Grid voltage dropped below 176V; automatic island protection triggered on BPDB line</td>
                                <td class="p-3 text-slate-500">18 min ago</td>
                                <td class="p-3"><span class="text-red-600 font-semibold">Active</span></td>
                                <td class="p-3 text-right"><button onclick="SolarOpsPages.acknowledgeAlert(this)" class="px-2.5 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">Inspect</button></td>
                            </tr>
                            <tr class="hover:bg-amber-50/30">
                                <td class="p-3"><span class="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded">WARNING</span></td>
                                <td class="p-3 font-semibold text-slate-800">Chittagong Warehouse<br><span class="text-slate-400 font-normal">INV-003</span></td>
                                <td class="p-3 text-slate-600">Internal heat sink temperature reached 58°C (Threshold 55°C); fan speed check required</td>
                                <td class="p-3 text-slate-500">42 min ago</td>
                                <td class="p-3"><span class="text-amber-600 font-semibold">Investigating</span></td>
                                <td class="p-3 text-right"><button onclick="SolarOpsPages.acknowledgeAlert(this)" class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 cursor-pointer">Acknowledge</button></td>
                            </tr>
                            <tr class="hover:bg-slate-50">
                                <td class="p-3"><span class="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded">WARNING</span></td>
                                <td class="p-3 font-semibold text-slate-800">Gazipur Complex<br><span class="text-slate-400 font-normal">INV-004</span></td>
                                <td class="p-3 text-slate-600">No telemetry packets received for >30 minutes (Offline for maintenance)</td>
                                <td class="p-3 text-slate-500">3 hrs ago</td>
                                <td class="p-3"><span class="text-slate-500 font-semibold">Maintenance Flag</span></td>
                                <td class="p-3 text-right"><button onclick="SolarOpsPages.acknowledgeAlert(this)" class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 cursor-pointer">Details</button></td>
                            </tr>
                            <tr class="hover:bg-slate-50">
                                <td class="p-3"><span class="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded">INFO</span></td>
                                <td class="p-3 font-semibold text-slate-800">Dhaka Factory<br><span class="text-slate-400 font-normal">Plant Level</span></td>
                                <td class="p-3 text-slate-600">Daily generation milestone reached: 400 kWh generated before 3:00 PM</td>
                                <td class="p-3 text-slate-500">1 hr ago</td>
                                <td class="p-3"><span class="text-emerald-600 font-semibold">Resolved</span></td>
                                <td class="p-3 text-right"><button onclick="SolarOpsPages.dismissAlert(this)" class="px-2.5 py-1 bg-slate-100 text-slate-500 rounded cursor-pointer">Dismiss</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // ── 5. MAINTENANCE WORK ORDERS ──
    openScheduleWorkOrderModal: function() {
        const body = `
            <div class="space-y-3">
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Work Order Title *</label>
                    <input id="wo-title" type="text" placeholder="e.g. Inverter Fan Replacement" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Target Plant</label>
                        <select id="wo-plant" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800">
                            <option>Dhaka ReadyMade Factory</option>
                            <option>Bay Shipping Warehouse</option>
                            <option>GreenTech Gazipur</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Due Date</label>
                        <input id="wo-date" type="date" value="2026-10-28" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                    </div>
                </div>
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Assigned Lead Technician</label>
                    <input id="wo-tech" type="text" value="Engr. Tanvir Ahmed (Senior O&M Lead)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                </div>
            </div>
        `;
        SolarOpsPages.showModal('<i class="fa-solid fa-wrench text-blue-600"></i> Schedule Maintenance Task', body, `
            <button onclick="SolarOpsPages.closeModal()" class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600">Cancel</button>
            <button onclick="SolarOpsPages.closeModal(); SolarOpsPages.showToast('✅ Work order successfully scheduled!');" class="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold">Schedule Order</button>
        `);
    },

    renderMaintenance: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Preventive & Corrective Maintenance (O&M)</h2>
                    <p class="text-sm text-slate-500">Module cleaning schedule, electrical torque auditing, thermography inspection</p>
                </div>
                <button onclick="SolarOpsPages.openScheduleWorkOrderModal()" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow flex items-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-calendar-plus"></i> Schedule Work Order
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Task 1 -->
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">Scheduled</span>
                        <span class="text-xs text-slate-400 font-mono">WO-2026-104</span>
                    </div>
                    <h4 class="font-bold text-slate-800 text-base">Bi-weekly Solar Panel Washing</h4>
                    <p class="text-xs text-slate-500">Dhaka RMG Factory — Dust and industrial soot accumulation causing ~4.2% soiling derate</p>
                    <div class="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
                        <div><i class="fa-regular fa-clock text-slate-400 mr-1"></i> Due: <strong>26 Oct 2026 (06:00 AM)</strong></div>
                        <div><i class="fa-regular fa-user text-slate-400 mr-1"></i> Assigned: <strong>CleanTech O&M Crew (4 Techs)</strong></div>
                        <div><i class="fa-solid fa-faucet text-slate-400 mr-1"></i> Method: Demineralized Water Spray + Soft Sponge</div>
                    </div>
                </div>

                <!-- Task 2 -->
                <div class="bg-white rounded-xl border border-amber-200 p-5 shadow-sm space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded">High Priority</span>
                        <span class="text-xs text-slate-400 font-mono">WO-2026-105</span>
                    </div>
                    <h4 class="font-bold text-slate-800 text-base">Inverter Fan & Heat Sink Cleanout</h4>
                    <p class="text-xs text-slate-500">Chittagong Warehouse (INV-003) — Resolving the 58°C thermal alarm</p>
                    <div class="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
                        <div><i class="fa-regular fa-clock text-slate-400 mr-1"></i> Due: <strong>Tomorrow (10:00 AM)</strong></div>
                        <div><i class="fa-regular fa-user text-slate-400 mr-1"></i> Assigned: <strong>Engr. Tanvir Ahmed (Senior Tech)</strong></div>
                        <div><i class="fa-solid fa-wrench text-slate-400 mr-1"></i> Action: Blower cleaning, thermal paste check</div>
                    </div>
                </div>

                <!-- Task 3 -->
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded">Completed</span>
                        <span class="text-xs text-slate-400 font-mono">WO-2026-098</span>
                    </div>
                    <h4 class="font-bold text-slate-800 text-base">Quarterly Earth Resistance Testing</h4>
                    <p class="text-xs text-slate-500">All 3 sites — Lightning arrester & DC earthing pit resistance measurement</p>
                    <div class="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
                        <div><i class="fa-regular fa-clock text-slate-400 mr-1"></i> Executed: <strong>18 Oct 2026</strong></div>
                        <div><i class="fa-regular fa-user text-slate-400 mr-1"></i> Signed off: <strong>Chief Electrical Inspector</strong></div>
                        <div><i class="fa-solid fa-shield-halved text-slate-400 mr-1"></i> Result: <strong>0.84 Ω (BNBC compliant &lt; 1 Ω)</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // ── 6. CUSTOMERS CRM ──
    openAddClientModal: function() {
        const body = `
            <div class="space-y-3">
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Company / Factory Name *</label>
                    <input type="text" placeholder="e.g. Square Pharmaceuticals Ltd" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                        <input type="text" placeholder="e.g. Pharmaceuticals" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Rooftop Capacity (kWp)</label>
                        <input type="number" value="120" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                    </div>
                </div>
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Key Contact Person & Email</label>
                    <input type="text" placeholder="Engr. Asaduzzaman / asad@square.bd" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                </div>
            </div>
        `;
        SolarOpsPages.showModal('<i class="fa-solid fa-user-plus text-blue-600"></i> Add Commercial Solar Client', body, `
            <button onclick="SolarOpsPages.closeModal()" class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600">Cancel</button>
            <button onclick="SolarOpsPages.closeModal(); SolarOpsPages.showToast('✅ Client added to portfolio!');" class="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save Client</button>
        `);
    },

    renderCustomers: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Commercial Clients & Portfolios</h2>
                    <p class="text-sm text-slate-500">C&I client billing, contracts, tariff rates and SLA compliance</p>
                </div>
                <button onclick="SolarOpsPages.openAddClientModal()" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow flex items-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-user-plus"></i> Add Client
                </button>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                            <tr>
                                <th class="p-3">Client Name</th>
                                <th class="p-3">Industry / Sector</th>
                                <th class="p-3">Installed Capacity</th>
                                <th class="p-3">Contact Person</th>
                                <th class="p-3">Monthly Savings</th>
                                <th class="p-3">Billing Tariff</th>
                                <th class="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 font-bold text-slate-800">ABC ReadyMade Garments Ltd</td>
                                <td class="p-3 text-slate-600">RMG Export (100% Export Oriented)</td>
                                <td class="p-3 font-semibold text-blue-600">100 kWp</td>
                                <td class="p-3 text-slate-700">Engr. Hasan Ali<br><span class="text-slate-400">hasan@abcgarments.com</span></td>
                                <td class="p-3 font-bold text-emerald-600">৳ 98,500 / mo</td>
                                <td class="p-3 font-mono text-slate-600">৳9.80 / kWh (E-Flat)</td>
                                <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Active Contract</span></td>
                            </tr>
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 font-bold text-slate-800">Bay Shipping Logistics Corp</td>
                                <td class="p-3 text-slate-600">Cold Storage & Port Logistics</td>
                                <td class="p-3 font-semibold text-blue-600">50 kWp</td>
                                <td class="p-3 text-slate-700">Mrs. Fatema Begum<br><span class="text-slate-400">fatema@bayshipping.bd</span></td>
                                <td class="p-3 font-bold text-emerald-600">৳ 52,400 / mo</td>
                                <td class="p-3 font-mono text-slate-600">৳10.20 / kWh (C-Commercial)</td>
                                <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Active Contract</span></td>
                            </tr>
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 font-bold text-slate-800">GreenTech Spinning Mills</td>
                                <td class="p-3 text-slate-600">Textile & Dyeing</td>
                                <td class="p-3 font-semibold text-blue-600">30 kWp</td>
                                <td class="p-3 text-slate-700">Mr. Kabir Chowdhury<br><span class="text-slate-400">k.chowdhury@greentech.com</span></td>
                                <td class="p-3 font-bold text-slate-400">৳ 28,000 / mo</td>
                                <td class="p-3 font-mono text-slate-600">৳9.50 / kWh (Industrial)</td>
                                <td class="p-3"><span class="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded">In Review</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // ── 7. EPC PROJECTS PIPELINE ──
    openNewProjectModal: function() {
        const body = `
            <div class="space-y-3">
                <div>
                    <label class="block font-semibold text-slate-700 mb-1">Project Name *</label>
                    <input type="text" placeholder="e.g. Meghna Group 1 MWp Rooftop" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Target Capacity (kWp)</label>
                        <input type="number" value="350" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                        <select class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800">
                            <option>1. Site Survey & LiDAR</option>
                            <option>2. SREDA Approval</option>
                            <option>3. Physical Installation</option>
                            <option>4. Commissioned (COD)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        SolarOpsPages.showModal('<i class="fa-solid fa-folder-plus text-blue-600"></i> Create EPC Installation Project', body, `
            <button onclick="SolarOpsPages.closeModal()" class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600">Cancel</button>
            <button onclick="SolarOpsPages.closeModal(); SolarOpsPages.showToast('✅ EPC Project registered in pipeline!');" class="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold">Create Project</button>
        `);
    },

    renderProjects: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Solar EPC Project Pipeline</h2>
                    <p class="text-sm text-slate-500">Engineering, Procurement & Construction lifecycle tracking</p>
                </div>
                <button onclick="SolarOpsPages.openNewProjectModal()" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow flex items-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-plus"></i> New EPC Project
                </button>
            </div>

            <!-- Pipeline Visual Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-bold uppercase text-slate-600">1. Site Survey & SLD</span>
                        <span class="text-xs bg-slate-200 px-2 py-0.5 rounded-full font-bold">2</span>
                    </div>
                    <div class="space-y-3">
                        <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs space-y-1">
                            <span class="font-bold text-slate-800 block">Apex Footwear Ltd</span>
                            <span class="text-slate-500 block">Capacity: 250 kWp Rooftop</span>
                            <span class="text-blue-600 font-semibold block">Drone LiDAR Survey Done</span>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs space-y-1">
                            <span class="font-bold text-slate-800 block">Square Food & Beverage</span>
                            <span class="text-slate-500 block">Capacity: 150 kWp Rooftop</span>
                            <span class="text-amber-600 font-semibold block">Structural Roof Audit</span>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-bold uppercase text-blue-700">2. SREDA / BPDB Approval</span>
                        <span class="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">1</span>
                    </div>
                    <div class="space-y-3">
                        <div class="bg-white p-3 rounded-lg border border-blue-200 shadow-sm text-xs space-y-1">
                            <span class="font-bold text-slate-800 block">Beximco Industrial Park</span>
                            <span class="text-slate-500 block">Capacity: 500 kWp</span>
                            <span class="text-blue-600 font-semibold block">NEM Approval in Process</span>
                        </div>
                    </div>
                </div>

                <div class="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-bold uppercase text-amber-700">3. Physical Installation</span>
                        <span class="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">1</span>
                    </div>
                    <div class="space-y-3">
                        <div class="bg-white p-3 rounded-lg border border-amber-200 shadow-sm text-xs space-y-1">
                            <span class="font-bold text-slate-800 block">Hamid Fabric Mills</span>
                            <span class="text-slate-500 block">Capacity: 75 kWp</span>
                            <div class="w-full bg-slate-200 h-1.5 rounded-full mt-1">
                                <div class="bg-amber-500 h-full rounded-full" style="width: 70%"></div>
                            </div>
                            <span class="text-slate-500 text-[10px] block">DC string cabling ongoing</span>
                        </div>
                    </div>
                </div>

                <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-bold uppercase text-emerald-700">4. Commissioned (COD)</span>
                        <span class="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">3</span>
                    </div>
                    <div class="space-y-3">
                        <div class="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm text-xs space-y-1">
                            <span class="font-bold text-slate-800 block">ABC ReadyMade Garments</span>
                            <span class="text-slate-500 block">100 kWp • COD: Mar 2025</span>
                            <span class="text-emerald-600 font-semibold block">Operating 100%</span>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm text-xs space-y-1">
                            <span class="font-bold text-slate-800 block">Bay Shipping Warehouse</span>
                            <span class="text-slate-500 block">50 kWp • COD: Jun 2025</span>
                            <span class="text-emerald-600 font-semibold block">Operating 100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // ── 8. NET METERING WORKFLOW ──
    openSlaPdfModal: function(plant, ref) {
        const body = `
            <div class="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <div class="flex justify-between border-b pb-2">
                    <span class="text-slate-500">Applicant:</span>
                    <strong class="text-slate-800">${plant}</strong>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="text-slate-500">SREDA / Utility Ref:</span>
                    <strong class="text-blue-700 font-mono">${ref}</strong>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="text-slate-500">Agreement Type:</span>
                    <strong class="text-slate-800">Bi-directional NEM 3-Phase SLA</strong>
                </div>
                <p class="text-xs text-slate-500 pt-1">This agreement authorizes grid synchronisation under Section 14 of the Bangladesh Net Metering Guidelines.</p>
            </div>
        `;
        SolarOpsPages.showModal('<i class="fa-solid fa-file-contract text-emerald-600"></i> Net Metering SLA Contract Details', body, `
            <button onclick="SolarOpsPages.closeModal()" class="px-4 py-2 border rounded-lg text-slate-600">Close</button>
            <button onclick="SolarOpsPages.closeModal(); SolarOpsPages.showToast('📄 SLA Certificate downloaded!');" class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Download Signed Copy</button>
        `);
    },

    renderNetMetering: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Bangladesh Net Energy Metering (NEM) Workflow</h2>
                    <p class="text-sm text-slate-500">Official step-by-step compliance tracker as per SREDA & Ministry of Power Guidelines</p>
                </div>
                <a href="https://nem.powerdivision.gov.bd/" target="_blank" class="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow inline-flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> NEM Portal (nem.powerdivision.gov.bd)
                </a>
            </div>

            <!-- Process Stages Bar -->
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h3 class="font-bold text-slate-800 text-base">Standard SREDA 7-Step Approval Lifecycle</h3>
                
                <div class="relative">
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                        <div style="width: 71%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs">
                        <div class="p-2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            1. Application
                            <span class="block text-[10px] text-emerald-600 mt-1 font-normal">Online portal</span>
                        </div>
                        <div class="p-2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            2. Feasibility
                            <span class="block text-[10px] text-emerald-600 mt-1 font-normal">DisCom Engineer</span>
                        </div>
                        <div class="p-2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            3. Sanction
                            <span class="block text-[10px] text-emerald-600 mt-1 font-normal">Capacity Allocation</span>
                        </div>
                        <div class="p-2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            4. Installation
                            <span class="block text-[10px] text-emerald-600 mt-1 font-normal">Hardware mounting</span>
                        </div>
                        <div class="p-2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            5. Testing
                            <span class="block text-[10px] text-emerald-600 mt-1 font-normal">Anti-islanding</span>
                        </div>
                        <div class="p-2 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200 animate-pulse">
                            6. Agreement
                            <span class="block text-[10px] text-blue-600 mt-1 font-normal">Tripartite Sign</span>
                        </div>
                        <div class="p-2 rounded bg-slate-100 text-slate-500 font-bold border border-slate-200">
                            7. Net Meter
                            <span class="block text-[10px] text-slate-400 mt-1 font-normal">Commercial COD</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Applications List -->
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">
                    Registered NEM Projects with Utilities
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                            <tr>
                                <th class="p-3">Application Ref</th>
                                <th class="p-3">Plant / Client</th>
                                <th class="p-3">Utility DisCom</th>
                                <th class="p-3">Sanctioned kWp</th>
                                <th class="p-3">Current Step</th>
                                <th class="p-3">Status</th>
                                <th class="p-3 text-right">Documents</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 font-mono font-bold text-slate-800">NEM-2025-DES-0491</td>
                                <td class="p-3 font-semibold text-slate-800">ABC ReadyMade Garments Ltd</td>
                                <td class="p-3 font-medium text-blue-700">DESCO (Dhaka)</td>
                                <td class="p-3 font-bold text-slate-800">100 kWp</td>
                                <td class="p-3 text-emerald-700 font-semibold">Step 7: Meter Active & Billing</td>
                                <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Completed</span></td>
                                <td class="p-3 text-right"><button onclick="SolarOpsPages.openSlaPdfModal('ABC Garments','NEM-2025-DES-0491')" class="text-blue-600 hover:underline cursor-pointer"><i class="fa-solid fa-file-pdf"></i> Signed SLA</button></td>
                            </tr>
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 font-mono font-bold text-slate-800">NEM-2025-PDB-0112</td>
                                <td class="p-3 font-semibold text-slate-800">Bay Shipping Logistics Corp</td>
                                <td class="p-3 font-medium text-amber-700">BPDB (Chittagong)</td>
                                <td class="p-3 font-bold text-slate-800">50 kWp</td>
                                <td class="p-3 text-emerald-700 font-semibold">Step 7: Bi-directional Active</td>
                                <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Completed</span></td>
                                <td class="p-3 text-right"><button onclick="SolarOpsPages.openSlaPdfModal('Bay Shipping','NEM-2025-PDB-0112')" class="text-blue-600 hover:underline cursor-pointer"><i class="fa-solid fa-file-pdf"></i> Signed SLA</button></td>
                            </tr>
                            <tr class="hover:bg-slate-50">
                                <td class="p-3 font-mono font-bold text-slate-800">NEM-2025-REB-0834</td>
                                <td class="p-3 font-semibold text-slate-800">GreenTech Spinning Mills</td>
                                <td class="p-3 font-medium text-emerald-700">BREB (Dhaka PBS-1)</td>
                                <td class="p-3 font-bold text-slate-800">30 kWp</td>
                                <td class="p-3 text-blue-700 font-semibold">Step 5: Anti-Islanding Inspection</td>
                                <td class="p-3"><span class="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded">In Progress</span></td>
                                <td class="p-3 text-right"><button onclick="SolarOpsPages.showToast('Test plan submitted to Palli Bidyut inspector')" class="text-blue-600 hover:underline cursor-pointer"><i class="fa-solid fa-file-pdf"></i> Test Plan</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // ── 9. AUTOMATED REPORTS ──
    openStatementModal: function() {
        const body = `
            <div class="space-y-3 p-2 font-mono text-xs text-slate-700">
                <div class="text-center pb-2 border-b">
                    <h3 class="font-bold text-base text-slate-900">SOLAR ENERGY RECONCILIATION STATEMENT</h3>
                    <p class="text-[10px] text-slate-500">Period: 01 Oct 2026 - 23 Oct 2026 | Utility: DESCO / BPDB</p>
                </div>
                <div class="space-y-1 text-[11px]">
                    <div class="flex justify-between"><span>Gross Solar Generation:</span><strong>16,250 kWh</strong></div>
                    <div class="flex justify-between"><span>On-site Self Consumption:</span><strong>11,480 kWh</strong></div>
                    <div class="flex justify-between"><span>Grid Exported (NEM Credit):</span><strong class="text-emerald-700">+ 4,770 kWh</strong></div>
                    <div class="flex justify-between"><span>Grid Imported (Night load):</span><strong class="text-blue-700">3,120 kWh</strong></div>
                    <div class="flex justify-between border-t pt-1 font-bold"><span>Net Billable Credit:</span><strong class="text-emerald-700">+ 1,650 kWh (৳ 16,170 credit)</strong></div>
                </div>
                <div class="p-2 bg-slate-50 rounded border text-[10px]">
                    Calculated under Bangladesh Industrial Tariff Category E-Flat @ ৳9.80/kWh.
                </div>
            </div>
        `;
        SolarOpsPages.showModal('<i class="fa-solid fa-file-invoice text-blue-600"></i> Monthly Energy Statement', body, `
            <button onclick="SolarOpsPages.closeModal()" class="px-4 py-2 border rounded-lg text-slate-600">Close</button>
            <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"><i class="fa-solid fa-print"></i> Print / Save PDF</button>
        `);
    },

    downloadReport: function(type) {
        let text = `SolarOps Bangladesh - ${type.toUpperCase()} REPORT\nGenerated: ${new Date().toISOString()}\n\n`;
        text += `Fleet Overview:\n- Total Monitored Sites: 3\n- Fleet Capacity: 180 kWp\n- Average PR Ratio: 80.4%\n- Grid DisCom: DESCO, BPDB, BREB\n\n`;
        text += `October 2026 Energy Yield: 16,250 kWh\nCarbon Offset: 10.07 Tonnes CO2 Avoided\nFinancial Savings: ৳ 1,59,250 BDT\n\n`;
        text += `Verified by: Shariful Islam Shoeb, Lead System Engineer`;

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SolarOps_${type}_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        SolarOpsPages.showToast(`📊 ${type} Report Downloaded!`);
    },

    renderReports: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Solar Energy & ESG Reports</h2>
                    <p class="text-sm text-slate-500">Automated generation data export, carbon credit verification & financial summaries</p>
                </div>
                <button onclick="SolarOpsPages.openStatementModal()" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow flex items-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-file-pdf"></i> Generate Monthly Statement
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg"><i class="fa-solid fa-calendar-days"></i></div>
                    <h4 class="font-bold text-slate-800 text-base">Monthly Energy Yield Report</h4>
                    <p class="text-xs text-slate-500">Detailed day-by-day generation vs theoretical irradiance model, PR metrics, and grid export credit calculation.</p>
                    <button onclick="SolarOpsPages.downloadReport('Monthly_Yield')" class="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded text-xs border border-slate-200 cursor-pointer">Download October 2026 Statement</button>
                </div>

                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"><i class="fa-solid fa-leaf"></i></div>
                    <h4 class="font-bold text-slate-800 text-base">ESG Carbon Offset Certificate</h4>
                    <p class="text-xs text-slate-500">Audited carbon reduction (tonnes CO₂) certified under Bangladesh Grid Emission factor (0.62 kg/kWh) for export compliance.</p>
                    <button onclick="SolarOpsPages.downloadReport('ESG_Carbon_Audit')" class="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded text-xs border border-slate-200 cursor-pointer">Download Carbon Audit</button>
                </div>

                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg"><i class="fa-solid fa-coins"></i></div>
                    <h4 class="font-bold text-slate-800 text-base">ROI & Financial Reconciliation</h4>
                    <p class="text-xs text-slate-500">Capex amortization, cumulative utility bill savings, and payback velocity analysis for factory CFOs.</p>
                    <button onclick="SolarOpsPages.downloadReport('Financial_Reconciliation')" class="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded text-xs border border-slate-200 cursor-pointer">Export Financial Summary</button>
                </div>
            </div>
        </div>
        `;
    },

    // ── 10. SETTINGS ──
    saveSettings: function() {
        SolarOpsPages.showToast('✅ Platform configuration saved successfully!');
    },

    renderSettings: function() {
        return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Platform Settings & SREDA Database</h2>
                    <p class="text-sm text-slate-500">IoT endpoints, SREDA certified equipment registry, user roles and grid parameters</p>
                </div>
                <button onclick="SolarOpsPages.saveSettings()" class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow cursor-pointer">
                    Save Configuration
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- SREDA Approved Database -->
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-certificate text-emerald-600"></i> SREDA Approved PV Equipment List
                        </h4>
                        <span class="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">200+ Registered</span>
                    </div>
                    <div class="space-y-3 text-xs">
                        <div class="p-3 bg-slate-50 rounded-lg space-y-1">
                            <span class="font-bold text-slate-800">Longi Solar Hi-MO 5 / 6 Series</span>
                            <p class="text-slate-500">545W Mono PERC • 21.3% Efficiency • Tier 1 BloombergNEF • SREDA Reg: #MOD-BD-019</p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-lg space-y-1">
                            <span class="font-bold text-slate-800">JA Solar DeepBlue 3.0</span>
                            <p class="text-slate-500">545W Mono Facial • 21.1% Efficiency • SREDA Reg: #MOD-BD-024</p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-lg space-y-1">
                            <span class="font-bold text-slate-800">Huawei SUN2000-50KTL / 100KTL Inverter</span>
                            <p class="text-slate-500">Three-Phase 400V • 98.8% Max Efficiency • SREDA Reg: #INV-BD-008</p>
                        </div>
                    </div>
                </div>

                <!-- Server & IoT Broker Config -->
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-server text-blue-600"></i> Server & Telemetry Engine
                        </h4>
                        <span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">Healthy</span>
                    </div>
                    <div class="space-y-2 text-xs">
                        <div class="flex justify-between py-1.5 border-b border-slate-100"><span class="text-slate-500">MQTT Broker Host:</span><strong class="font-mono text-slate-800">mqtt.solarops.com.bd:8883 (TLS)</strong></div>
                        <div class="flex justify-between py-1.5 border-b border-slate-100"><span class="text-slate-500">Database Engine:</span><strong class="font-mono text-slate-800">PostgreSQL 16 + TimescaleDB</strong></div>
                        <div class="flex justify-between py-1.5 border-b border-slate-100"><span class="text-slate-500">Ingestion Latency:</span><strong class="text-emerald-600">14ms</strong></div>
                        <div class="flex justify-between py-1.5 border-b border-slate-100"><span class="text-slate-500">Timezone Standard:</span><strong class="text-slate-800">Asia/Dhaka (UTC+6)</strong></div>
                        <div class="flex justify-between py-1.5 border-b border-slate-100"><span class="text-slate-500">Grid Base Frequency:</span><strong class="text-slate-800">50.0 Hz</strong></div>
                        <div class="flex justify-between py-1.5"><span class="text-slate-500">Current Operator:</span><strong class="text-slate-800">Shariful Islam Shoeb (System Engr / Lead)</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
};
