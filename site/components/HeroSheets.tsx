"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroSheets.module.css";

/*
 * "Today vs. with Applied Bell Curve" hero (design: HeroProblemSheets).
 * Left: a stack of spreadsheets surrounded by problem pills. At CMP the left
 * stage compresses into its half and the right half reveals six solution pills
 * around a live production-plan tool. Timing and geometry match the design.
 */

const END = 15.6;
const CMP = 6.6;
const TP = [0.3, 0.6, 0.9, 1.2, 1.5];
const TL = [1.9, 2.5, 3.1, 3.7, 4.3, 4.9];
const LR = [-2.5, 2.5, -2, 2, -2, 1.5];
const PROB_SH = "inset 0 -3px 6px rgba(200,85,61,.10), inset 0 2px 3px rgba(255,255,255,.8), 0 1px 1px rgba(200,85,61,.14), 0 4px 10px rgba(200,85,61,.10)";
const TS = [8.9, 9.6, 10.3, 11.0, 11.7, 12.4, 8.1];
const SHEETS = [{ x: -14, y: 24, r: -4 }, { x: 12, y: 12, r: 3 }, { x: -6, y: 0, r: -2 }, { x: 10, y: -12, r: 2.5 }, { x: 0, y: -24, r: -1 }];
const NAMES = ["Order_Book_Sep.xlsx", "Machine_Capacity.xlsx", "Changeover_Matrix.xlsx", "Pending_Orders.xlsx", "Production_Plan_FINAL_v3.xlsx"];
const WAVES = [13.4, 14.4];
// Problem pills: LPC = compact layout (after compress), LPW = wide layout around the enlarged stack.
const LPC = [[200, 82], [450, 92], [110, 240], [530, 252], [190, 415], [455, 428]];
const LPW = [[-20, 96], [660, 106], [-140, 262], [790, 272], [-40, 414], [690, 424]];
const SX = 1.45, PX = 1.42;
// Pop-in peak per solution pill, limited by free space around it.
const PEAK = [1.25, 1.25, 1.1, 1.25, 1.25, 1.1];
const ORIG = ["50% 50%", "50% 50%", "33% 50%", "50% 50%", "50% 50%", "67% 50%"];
const PILL_SH = "inset 0 -4px 8px rgba(6,57,84,.08), inset 0 2px 3px rgba(255,255,255,.9), 0 1px 1px rgba(6,57,84,.10), 0 4px 12px rgba(6,57,84,.08)";
const TOOL_SH = "0 2px 3px rgba(6,57,84,.16), 0 10px 24px rgba(6,57,84,.18)";
const N_ = "#063954", T_ = "#2d5a6b", L_ = "#7fa3b6", S_ = "stripe";
const LANES: [number, number, string][][] = [
  [[0, 44, N_], [48, 34, T_], [86, 64, N_]],
  [[0, 28, L_], [32, 66, N_], [102, 48, S_]],
  [[0, 56, T_], [60, 38, L_], [102, 48, N_]],
  [[0, 36, N_], [40, 50, T_], [94, 26, L_], [124, 26, S_]],
  [[0, 70, L_], [74, 76, N_]],
];

const PROBLEMS = [
  "Replanning Is Hard", "One Plan, No Options", "Avoidable Waste", "Throughput Is Lost",
  "Poor Cross-Team Visibility", "Delayed Delivery Dates",
];

const SOLUTIONS = [
  { title: "Fast and Efficient Replanning", left: 98, top: 32 },
  { title: "Compare Alternate Plans", left: 338, top: 32 },
  { title: "Maximum Throughput", left: 436, top: 210 },
  { title: "Less Production Waste", left: 338, top: 388 },
  { title: "One System, Shared Visibility", left: 98, top: 388 },
  { title: "Higher OTIF", left: 0, top: 210 },
];

const SPOKES = ["M250 165 V92", "M370 165 V92", "M420 240 H436", "M370 315 V388", "M250 315 V388", "M200 240 H184"];

const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const outCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const inOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const outBack = (p: number) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// Deterministic decoration (same on server and client).
const rnd = seeded(7);
const SHEET_DATA = SHEETS.map((_, i) => {
  const marks = [];
  for (let k = 0; k < 11; k++) {
    const c = Math.floor(rnd() * 4), r = Math.floor(rnd() * 7);
    marks.push({ x: c * 42 + 5, y: r * 13 + 4, w: Math.round(12 + rnd() * 22) });
  }
  const flashes = [0, 1].map(() => ({ x: Math.floor(rnd() * 4) * 42, y: Math.floor(1 + rnd() * 6) * 13 }));
  return { marks, flashes, name: NAMES[i] };
});
const LANE_DATA = LANES.map((bars) =>
  bars.map(([x, w, c]) => ({
    x, w,
    dx: Math.round((rnd() - 0.5) * 60),
    bg: c === S_ ? "repeating-linear-gradient(135deg,#dbe4ea 0 3px,#f8fafc 3px 6px)" : c,
    bd: c === S_ ? "1px solid #c3d1db" : "0",
  })),
);

type Els = {
  root: HTMLDivElement;
  left: HTMLElement; lbox: HTMLElement; lstage: HTMLElement;
  div: HTMLElement; rlabel: HTMLElement; box: HTMLElement; stage: HTMLElement;
  sheets: { el: HTMLElement; flashes: HTMLElement[] }[];
  lps: HTMLElement[]; pills: HTMLElement[];
  spokes: SVGPathElement[]; pulses: SVGPathElement[];
  halo: HTMLElement; bars: { el: HTMLElement; dx: number }[];
  util: HTMLElement; up: HTMLElement;
};

function collect(r: HTMLDivElement): Els {
  const q = <T extends Element = HTMLElement>(s: string) => Array.from(r.querySelectorAll<T>(s));
  const one = (s: string) => r.querySelector<HTMLElement>(s)!;
  const lps: HTMLElement[] = [], pills: HTMLElement[] = [];
  q("[data-lp]").forEach((el) => (lps[+el.dataset.lp!] = el));
  q("[data-pill]").forEach((el) => (pills[+el.dataset.pill!] = el));
  const spokes = q<SVGPathElement>("[data-spoke]");
  const pulses = q<SVGPathElement>("[data-pulse]");
  [...spokes, ...pulses].forEach((p) => p.setAttribute("pathLength", "1"));
  pulses.forEach((p) => p.setAttribute("stroke-dasharray", "0.22 2"));
  spokes.forEach((p) => p.setAttribute("stroke-dasharray", "1 1"));
  return {
    root: r, lps, pills, spokes, pulses,
    sheets: q("[data-sheet]").map((el) => ({ el, flashes: Array.from(el.querySelectorAll<HTMLElement>("[data-flash]")) })),
    left: one("[data-left]"), lbox: one("[data-lbox]"), lstage: one("[data-lstage]"),
    div: one("[data-div]"), rlabel: one("[data-rlabel]"), box: one("[data-stagebox]"), stage: one("[data-stage]"),
    halo: one("[data-halo]"),
    bars: q("[data-bar]").map((el) => ({ el, dx: +(el.dataset.dx || 0) })),
    util: one("[data-util]"), up: one("[data-uparrow]"),
  };
}

function apply(E: Els, t: number, ts: number, reduced: boolean, state: { spread: number }) {
  const stacked = E.root.clientWidth < 720;

  const s = Math.min(1, E.box.clientWidth / 620, E.box.clientHeight / 480);
  E.stage.style.transform = `translate(-50%,-50%) scale(${s.toFixed(4)})`;

  const cp = reduced ? 1 : inOut(cl((t - CMP) / 1.0));
  {
    const W = E.root.clientWidth, k = stacked ? 0 : 1 - cp;
    const bw = E.lbox.clientWidth, bh = E.lbox.clientHeight;
    const fit = Math.min(1, bw / 640, bh / 480);
    const full = Math.max(fit, Math.min(1.2, (W * 0.9) / 640, bh / 480));
    const sc = fit + (full - fit) * k;
    const cx = E.left.offsetLeft + E.lbox.offsetLeft + bw / 2;
    E.lstage.style.transform = `translateX(${((W / 2 - cx) * k).toFixed(2)}px) scale(${sc.toFixed(4)})`;
    state.spread = Math.max(0, Math.min(1, (W / sc / 2 - 160) / 470));
  }
  // When stacked (mobile) the left stage stays compact; there is no room to spread.
  const k = stacked ? 0 : 1 - cp;
  const ex = 1 + (SX - 1) * k, pex = 1 + (PX - 1) * k, m = state.spread;
  E.div.style.opacity = String(cp);
  E.rlabel.style.opacity = String(cl((t - CMP - 0.8) / 0.5));

  E.sheets.forEach((sh, i) => {
    const cfg = SHEETS[i % SHEETS.length], tp = TP[i % TP.length];
    const p = cl((ts - (tp - 0.35)) / 0.45), e = outCubic(p);
    const y = cfg.y - 60 * (1 - e);
    const rot = cfg.r + (1 - e) * (cfg.r > 0 ? 7 : -7);
    sh.el.style.opacity = String(Math.min(1, p * 3));
    sh.el.style.transform = `translate(${(cfg.x * ex).toFixed(2)}px, ${(y * ex).toFixed(2)}px) rotate(${rot}deg) scale(${ex.toFixed(4)})`;
    sh.flashes.forEach((f, j) => {
      let op = 0;
      const start = tp + 0.5 + j * 1.4 + i * 0.3;
      if (!reduced && ts > start && ts < END) {
        const ph = (ts - start) % 3.3;
        if (ph < 0.55) op = ph < 0.1 ? ph / 0.1 : 1 - (ph - 0.1) / 0.45;
      }
      f.style.opacity = (op * 0.9).toFixed(3);
    });
  });

  E.lps.forEach((el, i) => {
    const p = cl((t - TL[i]) / 0.4);
    const sc = 0.6 + 0.4 * outBack(p);
    const fx = reduced ? 0 : Math.sin(ts * 1.3 + i) * 1.8, fy = reduced ? 0 : Math.cos(ts * 1.1 + i * 1.7) * 1.8;
    el.style.opacity = cl(p / 0.35).toFixed(3);
    const c0 = LPC[i], w0 = LPW[i], wx = 320 + (w0[0] - 320) * m;
    el.style.left = (c0[0] + (wx - c0[0]) * k).toFixed(2) + "px";
    el.style.top = (c0[1] + (w0[1] - c0[1]) * k).toFixed(2) + "px";
    el.style.transform = `translate(-50%,-50%) translate(${fx.toFixed(2)}px, ${fy.toFixed(2)}px) rotate(${LR[i]}deg) scale(${(sc * pex).toFixed(4)})`;
    el.style.boxShadow = PROB_SH;
  });

  const bump = (x: number, w: number) => (x > 0 && x < w ? Math.sin((Math.PI * x) / w) : 0);
  E.pills.forEach((el, i) => {
    const p = cl((t - TS[i]) / 0.25);
    el.style.opacity = String(cl(p / 0.5));
    // First appearance: grow to PEAK, then settle to rest size before the next pill pops.
    const grow = outCubic(cl((t - TS[i]) / 0.22)), settle = inOut(cl((t - TS[i] - 0.36) / 0.28));
    const big = i < 6 ? (PEAK[i] - 1) * grow * (1 - settle) : 0;
    el.style.transformOrigin = i < 6 ? ORIG[i] : "50% 50%";
    el.style.zIndex = big > 0.005 ? "3" : "";
    el.style.transform = `scale(${((0.85 + 0.15 * outBack(p)) * (1 + big)).toFixed(4)})`;
    let g = 0;
    if (!reduced) WAVES.forEach((w) => (g = Math.max(g, bump(t - (i === 6 ? w - 0.1 : w + 0.45), 0.5))));
    const base = i === 6 ? TOOL_SH : PILL_SH;
    el.style.boxShadow = g > 0.01 ? `0 0 0 ${(4 * g).toFixed(2)}px rgba(6,57,84,${(0.14 * g).toFixed(3)}), ${base}` : base;
  });

  const draw = (el: SVGPathElement, d: number) => { el.style.strokeDashoffset = (1 - d).toFixed(4); el.style.opacity = d > 0 ? "1" : "0"; };
  E.spokes.forEach((el, j) => draw(el, inOut(cl((t - (TS[j] - 0.35)) / 0.35))));

  E.pulses.forEach((el) => {
    let op = 0, off = 0.22;
    if (!reduced) WAVES.forEach((w) => { const q = (t - w) / 0.8; if (q > 0 && q < 1) { op = Math.sin(Math.PI * q); off = 0.22 - q * 1.22; } });
    el.style.opacity = op.toFixed(3);
    el.style.strokeDashoffset = off.toFixed(4);
  });

  {
    let op = 0, sc = 1;
    if (!reduced) WAVES.forEach((w) => { const q = (t - w) / 1.0; if (q > 0 && q < 1) { op = 0.5 * (1 - q); sc = 1 + 0.35 * outCubic(q); } });
    E.halo.style.opacity = op.toFixed(3);
    E.halo.style.transform = `scale(${1 + (sc - 1) * 0.35}, ${1 + (sc - 1) * 0.5})`;
  }

  const t6 = TS[6];
  E.bars.forEach((b, j) => {
    const p = reduced ? 1 : outCubic(cl((t - (t6 + 0.25 + j * 0.05)) / 0.5));
    b.el.style.opacity = cl(p * 2).toFixed(3);
    b.el.style.transform = `translateX(${(b.dx * (1 - p)).toFixed(2)}px)`;
  });
  E.util.style.transform = `scaleX(${(reduced ? 1 : outCubic(cl((t - (t6 + 1.2)) / 0.9))).toFixed(4)})`;
  const a = reduced ? 1 : outCubic(cl((t - (t6 + 2.0)) / 0.4));
  E.up.style.opacity = a.toFixed(3);
  E.up.style.transform = `translateY(${((1 - a) * 3).toFixed(2)}px)`;
}

export default function HeroSheets() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const els = collect(root);
    const state = { spread: 1 };
    const t0 = performance.now();
    let raf = 0;

    const tick = () => {
      if (reduced) {
        apply(els, END, END, true, state);
        return;
      }
      const e = (performance.now() - t0) / 1000;
      apply(els, Math.min(END, e), e, false, state);
      // Flashes stop at END; after that only layout changes need a repaint.
      if (e < END + 0.1) raf = requestAnimationFrame(tick);
    };
    tick();

    // Keep the final frame correct when the container is resized.
    const ro = new ResizeObserver(() => {
      const e = (performance.now() - t0) / 1000;
      if (reduced || e >= END) apply(els, END, Math.max(e, END), reduced, state);
    });
    ro.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} role="img" aria-label="Today: planning across scattered spreadsheets makes replanning hard, wastes material and delays delivery dates. With Applied Bell Curve: one integrated system with fast replanning, alternate plans to compare, higher OTIF and less production waste.">
      <div data-left className={styles.left}>
        <div className={styles.labelToday}>TODAY</div>
        <div data-lbox className={styles.lbox}>
          <div data-lstage className={styles.lstage}>
            {SHEET_DATA.map((s) => (
              <div key={s.name} data-sheet className={styles.sheet} style={{ opacity: 0 }}>
                <div className={styles.sheetChrome}>
                  <span /><span /><span />
                </div>
                <div className={styles.sheetHead} />
                <div className={styles.sheetGrid}>
                  {s.marks.map((m, i) => (
                    <div key={i} className={styles.mark} style={{ left: m.x, top: m.y, width: m.w }} />
                  ))}
                  {s.flashes.map((f, i) => (
                    <div key={i} data-flash className={styles.flash} style={{ left: f.x, top: f.y }} />
                  ))}
                </div>
                <div className={styles.sheetTab}>
                  <i className="material-icons" aria-hidden="true">grid_on</i>
                  <span>{s.name}</span>
                </div>
              </div>
            ))}
            {PROBLEMS.map((label, i) => (
              <div key={label} data-lp={i} className={styles.problem} style={{ left: LPC[i][0], top: LPC[i][1] }}>
                <span className={styles.problemGloss} />
                <span className={styles.problemDot} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div data-div className={styles.divider} />

      <div className={styles.right}>
        <div data-rlabel className={styles.labelAbc}>WITH APPLIED BELL CURVE</div>
        <div data-stagebox className={styles.stagebox}>
          <div data-stage className={styles.stage}>
            <svg width="620" height="480" viewBox="0 0 620 480" className={styles.svg} aria-hidden="true">
              <g fill="none" stroke="#063954" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
                {SPOKES.map((d) => <path key={d} data-spoke d={d} style={{ opacity: 0 }} />)}
              </g>
              <g fill="none" stroke="#063954" strokeWidth="2.5" strokeLinecap="round">
                {SPOKES.map((d) => <path key={d} data-pulse d={d} opacity="0" />)}
              </g>
            </svg>

            {SOLUTIONS.map((p, i) => (
              <div key={p.title} data-pill={i} className={styles.pill} style={{ left: p.left, top: p.top, opacity: 0 }}>
                <span className={styles.pillGloss} />
                <span className={styles.pillTitle}>{p.title}</span>
              </div>
            ))}

            <div data-halo className={styles.halo} />
            <div data-pill="6" className={styles.tool} style={{ opacity: 0 }}>
              <div className={styles.toolBar}>
                <span /><span /><span />
                <span className={styles.toolTitle}>Integrated System</span>
                <span className={styles.toolLive}>LIVE</span>
              </div>
              <div className={styles.toolBody}>
                <div className={styles.toolRail}>
                  <i className="material-icons" style={{ color: "#063954" }}>dashboard</i>
                  <i className="material-icons">view_timeline</i>
                  <i className="material-icons">tune</i>
                  <i className="material-icons">insights</i>
                </div>
                <div className={styles.toolMain}>
                  {LANE_DATA.map((bars, li) => (
                    <div key={li} className={styles.lane}>
                      <span className={styles.laneTag} />
                      <div className={styles.laneTrack}>
                        {bars.map((b, bi) => (
                          <div key={bi} data-bar data-dx={b.dx} className={styles.bar}
                            style={{ left: b.x, width: b.w, background: b.bg, border: b.bd, opacity: 0 }} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className={styles.eff}>
                    <span>EFFICIENCY</span>
                    <div className={styles.effTrack}><div data-util className={styles.effFill} /></div>
                    <i data-uparrow className="material-icons" style={{ opacity: 0 }}>arrow_upward</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
