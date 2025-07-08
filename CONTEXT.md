# AMASCO – Autonomous Multi-Agent Supply Chain Orchestrator

## ✅ Project Purpose
This project is a simulation-based system designed to demonstrate how multiple autonomous AI agents can manage a dynamic retail supply chain.

The key goal is to show real-time agent-driven decisions in response to inventory changes, delivery route disruptions, and external events like weather or supplier failures.

## 🖥️ Frontend
- The frontend is **already built and added** in the `/frontend` directory.
- It's a **React dashboard** with the following layout:
  - **Left Panel**: Inventory status for stores/warehouses
  - **Center Panel**: Map showing delivery routes and trucks
  - **Right Panel**: Agent decision log with explanations
  - **Footer**: Buttons for “Trigger Disruption”, “Fast Forward”, and “Pause Simulation”
- The frontend expects data in JSON format from the backend or mock files.

## 🧠 Backend Expectations
The backend (to be developed) will simulate the following agents:

- **InventoryAgent**: Monitors stock levels and triggers restock actions.
- **RouteAgent**: Reroutes delivery trucks based on route disruptions.
- **DisruptionAgent**: Simulates random or user-triggered disruptions like weather or supplier issues.
- **ExplanationAgent (optional)**: Provides human-readable justifications for agent decisions.

# 🔧 Backend Implementation Plan for AMASCO

This document outlines the expectations, architecture, and recommended implementation strategy for the backend of the AMASCO project. Please follow these guidelines when generating or modifying code. **Do not make assumptions**; ask for clarification if any section is unclear.

---

## 1️⃣ Backend Technology

- ✅ Use **Python** as the language.
- ✅ Use **FastAPI** as the framework to expose APIs.
- Rationale: FastAPI is lightweight, async-ready, and integrates well with frontend fetch logic.

---

## 2️⃣ Agent Architecture

- ✅ Implement all agents as **classes or modules inside a single Python backend application**.
- ❌ Do NOT make each agent a separate process or microservice.
- Rationale: This is a simulation system, not a production-scale app. Keeping everything inside one app makes coordination easier and faster for development.

---

## 3️⃣ Simulation Data Source

- ✅ Start with **predefined JSON mock data** for consistent demo behavior.
- ✅ Add random data generation later as a developer toggle (`simulate_random=True`).
- Place all mock data files inside a `/data/` folder.
  
### Example Mock Files

#### 📄 `data/inventory.json`
```json
{
  "Store A": { "stock": 6, "threshold": 10 },
  "Store B": { "stock": 12, "threshold": 10 },
  "Store C": { "stock": 3, "threshold": 8 }
}

These will be used by the frontend to render the live simulation state.

## 🎯 Final Output
A fully interactive supply chain simulation where AI agents respond autonomously to events and explain their actions in real-time via the existing frontend.