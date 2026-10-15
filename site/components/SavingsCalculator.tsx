"use client";

import { useState } from "react";
import { calcModels } from "@/lib/calc-models";
import { getSuite, type SuiteId } from "@/lib/data";
import styles from "./SavingsCalculator.module.css";

function inr(n: number) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(1) + " L";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function num(v: string) {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return isFinite(n) ? n : 0;
}

export default function SavingsCalculator({ suiteId }: { suiteId: SuiteId }) {
  const C = calcModels[suiteId];
  const suite = getSuite(suiteId)!;
  const [plantVals, setPlantVals] = useState<Record<string, string>>(() =>
    Object.fromEntries(C.plant.map((f) => [f.k, String(f.def)])),
  );
  const [leverVals, setLeverVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(C.levers.map((l) => [l.k, l.def])),
  );

  const p: Record<string, number> = Object.fromEntries(C.plant.map((f) => [f.k, num(plantVals[f.k])]));
  let today = 0, opt = 0;
  const rows = C.levers.map((l) => {
    const x = leverVals[l.k];
    const a = C.value(l.k, x, p).rs, b = C.value(l.k, x * l.opt, p).rs;
    today += a;
    opt += b;
    return { lever: l, x, a, b };
  });
  const revenue = p.output * 12000 * p.price;
  const hasInput = p.output > 0 && p.price > 0;

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="savings-title">
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="rule" />
        <div className="eyebrow">SAVINGS ESTIMATE · {suite.industry.toUpperCase()}</div>
        <h2 id="savings-title" className="h2" style={{ maxWidth: "24ch", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
          What waste costs you today, and what you can save.
        </h2>
      </div>

      <div className={styles.box}>
        <div className={styles.inputs}>
          <div className={styles.group}>
            <span className={styles.groupLabel}>YOUR PLANT</span>
            <div className={styles.plant}>
              {C.plant.map((f) => (
                <label key={f.k} className={styles.plantField}>
                  <span className={styles.plantLabel}><span>{f.label}</span><span className={styles.unit}>{f.unit}</span></span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={`input ${styles.plantInput}`}
                    value={plantVals[f.k]}
                    onChange={(e) => setPlantVals((s) => ({ ...s, [f.k]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className={styles.levers}>
            <div className={styles.leversHead}>
              <span className={styles.groupLabel}>YOUR WASTE TODAY</span>
              <span className={styles.hint}>Prefilled with industry-typical values. Adjust to match your plant.</span>
            </div>
            {rows.map(({ lever: l, x }) => (
              <div key={l.k} className={styles.lever}>
                <div className={styles.leverHead}>
                  <span className={styles.leverLabel}>{l.label} <span>· {l.suffix}</span></span>
                  <span className={styles.leverValue}>{l.unit === "%" ? x.toFixed(1) + "%" : Math.round(x) + " h"}</span>
                </div>
                <input
                  type="range"
                  className={styles.range}
                  min={l.min}
                  max={l.max}
                  step={l.step}
                  value={x}
                  aria-label={l.label}
                  onChange={(e) => setLeverVals((s) => ({ ...s, [l.k]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.results} aria-live="polite">
          {hasInput ? (
            <div className={styles.resultsInner}>
              <div className={styles.tiles}>
                <div className={styles.tile}>
                  <span className={styles.tileLabel}>WASTE COST TODAY</span>
                  <span className={styles.tileValue}>{inr(today)}</span>
                  <span className={styles.tileNote}>per year</span>
                </div>
                <div className={styles.tile}>
                  <span className={styles.tileLabel}>REVENUE LOST</span>
                  <span className={styles.tileValue}>{(revenue > 0 ? (today / revenue) * 100 : 0).toFixed(1)}%</span>
                  <span className={styles.tileNote}>of {inr(revenue)} revenue</span>
                </div>
                <div className={`${styles.tile} ${styles.tileHi}`}>
                  <span className={styles.tileLabel}>YOU CAN SAVE</span>
                  <span className={styles.tileValue}>{inr(today - opt)}</span>
                  <span className={styles.tileNote}>per year with ABC</span>
                </div>
              </div>

              <div className={styles.table} role="table" aria-label="Cost and saving by source">
                <div className={styles.thead} role="row">
                  <span role="columnheader">BY SOURCE</span>
                  <span role="columnheader">COST TODAY</span>
                  <span role="columnheader">SAVING</span>
                </div>
                {rows.map(({ lever: l, a, b }) => (
                  <div key={l.k} className={styles.tr} role="row">
                    <span role="cell">{l.label}</span>
                    <span role="cell">{inr(a)}</span>
                    <span role="cell">{inr(a - b)}</span>
                  </div>
                ))}
              </div>

              <span className={styles.note}>{C.note}</span>
            </div>
          ) : (
            <div className={styles.empty}>
              <span className={styles.groupLabel}>AWAITING YOUR PLANT SIZE</span>
              <span>Add monthly output and selling price to see the estimate.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
