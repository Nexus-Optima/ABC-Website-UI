// Savings calculator models, one per suite. ALL COEFFICIENTS ARE SAMPLES — replace with ABC's validated figures.
// Lever: today's waste level (slider, prefilled industry-typical). opt = share of that level remaining after optimising.
// value(k, x, p) → annual ₹ cost (rs) at lever level x for plant inputs p.
import type { SuiteId } from "./data";

export type PlantField = { k: string; label: string; unit: string; def: number };
export type Lever = {
  k: string; label: string; by: string; unit: "%" | "h"; suffix: string;
  min: number; max: number; step: number; def: number; opt: number;
};
export type PlantInputs = Record<string, number>;
export type CalcModel = {
  note: string;
  plant: PlantField[];
  levers: Lever[];
  value: (k: string, x: number, p: PlantInputs) => { rs: number; qty: number; qu: string };
};

const NOTE = "Sample industry figures, not your plant data. Your demo validates them against your own records.";

export const calcModels: Record<SuiteId, CalcModel> = {
  "flexible-packaging": {
    note: NOTE,
    plant: [
      { k: "output", label: "MONTHLY OUTPUT", unit: "t", def: 600 },
      { k: "price", label: "AVG. SELLING PRICE", unit: "₹/kg", def: 260 },
      { k: "planners", label: "PLANNERS", unit: "people", def: 3 },
    ],
    levers: [
      { k: "trim", label: "Slitting trim loss", by: "Slitting Planner", unit: "%", suffix: "Share of output", min: 0, max: 12, step: 0.1, def: 4.5, opt: 0.55 },
      { k: "scrap", label: "Excess length waste", by: "Slitting Planner", unit: "%", suffix: "Share of output", min: 0, max: 8, step: 0.1, def: 2.5, opt: 0.65 },
      { k: "down", label: "Knife-setting changes", by: "Slitting Planner", unit: "%", suffix: "Share of slitter hours", min: 0, max: 20, step: 0.5, def: 8, opt: 0.65 },
      { k: "plan", label: "Planning effort", by: "Both modules", unit: "h", suffix: "Hours per planner per week", min: 0, max: 40, step: 1, def: 14, opt: 0.4 },
    ],
    value(k, x, p) {
      const kg = p.output * 12000;
      if (k === "trim" || k === "scrap") { const q = (kg * x) / 100; return { rs: q * p.price * 0.7, qty: q / 1000, qu: "t" }; }
      if (k === "down") { const q = (kg * x) / 100; return { rs: q * p.price * 0.2, qty: q / 1000, qu: "t of output lost" }; }
      const h = p.planners * x * 52;
      return { rs: h * 750, qty: h, qu: "planner hours" };
    },
  },
  "terry-towel": {
    note: NOTE,
    plant: [
      { k: "output", label: "MONTHLY OUTPUT", unit: "t", def: 350 },
      { k: "price", label: "AVG. SELLING PRICE", unit: "₹/kg", def: 380 },
      { k: "planners", label: "PLANNERS", unit: "people", def: 4 },
    ],
    levers: [
      { k: "yarn", label: "Loom changeover downtime", by: "Loom Planner", unit: "%", suffix: "Share of loom hours", min: 0, max: 10, step: 0.1, def: 3.5, opt: 0.6 },
      { k: "beam", label: "Idle loom time", by: "Loom Planner", unit: "%", suffix: "Share of loom hours", min: 0, max: 20, step: 0.5, def: 7, opt: 0.7 },
      { k: "batch", label: "Late orders", by: "Loom Planner", unit: "%", suffix: "Share past weaving cutoff", min: 0, max: 40, step: 1, def: 22, opt: 0.4 },
      { k: "late", label: "Expediting and penalties", by: "Loom Planner", unit: "%", suffix: "Share of revenue", min: 0, max: 30, step: 0.5, def: 12, opt: 0.45 },
      { k: "plan", label: "Planning effort", by: "All modules", unit: "h", suffix: "Hours per planner per week", min: 0, max: 40, step: 1, def: 16, opt: 0.4 },
    ],
    value(k, x, p) {
      const kg = p.output * 12000;
      if (k === "yarn") { const q = (kg * 1.1 * x) / 100; return { rs: q * p.price * 0.5, qty: q / 1000, qu: "t of yarn" }; }
      if (k === "beam") { const q = (kg * x) / 100; return { rs: q * p.price * 0.2, qty: q / 1000, qu: "t of output lost" }; }
      if (k === "batch") { const q = x >= 100 ? 0 : (kg * x) / (100 - x); return { rs: q * 20, qty: q / 1000, qu: "t of empty capacity dyed" }; }
      if (k === "late") return { rs: kg * p.price * (x / 100) * 0.05, qty: x, qu: "% of orders late" };
      const h = p.planners * x * 52;
      return { rs: h * 750, qty: h, qu: "planner hours" };
    },
  },
};
