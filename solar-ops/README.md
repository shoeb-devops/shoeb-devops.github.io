# SolarOps Bangladesh ☀️

> **Industrial Solar PV Telemetry, Remote Operations & Net Energy Metering (NEM) Analytics Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![SREDA Compliant](https://img.shields.io/badge/SREDA-NEM%20Compliant-emerald.svg)](https://nem.powerdivision.gov.bd)
[![Built for Bangladesh](https://img.shields.io/badge/Grid-DESCO%20%7C%20BPDB%20%7C%20BREB-orange.svg)](#)

---

## 🌟 Overview

**SolarOps Bangladesh** is a modern, web-based Solar PV Management and Telemetry Monitoring Platform designed specifically for Bangladesh's rapidly growing commercial and industrial (C&I) rooftop solar market.

It bridges the gap between electrical engineering hardware (Inverters, Bi-directional Net Meters, Weather Stations) and modern software architecture (IoT Gateways, Time-series DBs, and Real-time Web Dashboards).

---

## ⚙️ Key Modules & Capabilities

1. **Executive Solar Dashboard**
   - Live AC Power (kW), Daily Generation (kWh), Monthly, and Lifetime yield.
   - Real-time generation vs factory load vs grid import/export visualizer.
   - Financial savings in Bangladeshi Taka (৳) and ESG carbon offset tracking.

2. **Telemetry & Inverter Diagnostics**
   - Modbus RS-485 / MQTT telemetry tracking DC input voltage, string currents, MPPT channels, and internal temperatures.
   - Automated thermal alarm thresholds (e.g., heatsink > 55°C).

3. **Bi-directional Energy Metering (NEM)**
   - Smart Class 0.5s Net Meter ingestion for DESCO, DPDC, BPDB, and BREB feeders.
   - Real-time export credits vs import tariff reconciliations.

4. **SREDA 7-Step Net Metering Workflow Tracker**
   - Full regulatory pipeline from initial online application, utility site inspection, feasibility sanction, installation, joint anti-islanding test, to official meter energization.

5. **Bangladesh Solar ROI & Payback Engine**
   - Dynamic calculator using division-specific solar irradiance data (Dhaka: 4.5 kWh/m²/day, Rajshahi: 5.0, etc.).
   - Computes recommended system size (kWp), Capex, 25-year cumulative cash flow, and exact payback period in years.

---

## 🏗️ System Architecture

```text
 [ Solar Panels ]  --->  [ String Inverter (Huawei/Growatt) ]
                                   │  (Modbus RS-485 RTU)
                                   ▼
                       [ ESP32 IoT Edge Gateway ]
                                   │  (MQTT over TLS / 4G GSM)
                                   ▼
                         [ Mosquitto Broker ]
                                   │
                         [ Data Ingestion Engine ]
                                   │
                    [ PostgreSQL / TimescaleDB ]
                                   │  (REST API / WebSockets)
                                   ▼
                   [ SolarOps Web Management UI ]
```

---

## 🚀 Quick Start

### Option 1: One-Click Run (Windows)
Double-click `run_app.bat` in the root directory. It will start a local web server and open the app in your default browser.

### Option 2: Python HTTP Server
```bash
python -m http.server 8080
```
Then open `http://localhost:8080` in your web browser.

---

## 👨‍💻 Author
**Shariful Islam Shoeb**  
*System Engineer | IT & Database Specialist*
