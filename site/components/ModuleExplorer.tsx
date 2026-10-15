"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { getSuite, type SuiteId } from "@/lib/data";
import styles from "./ModuleExplorer.module.css";

type Pick = { m: number; f: number; open: number };

const ROTATE_MS = 5000;

/**
 * APS module list with expandable feature lists and a product-screen panel.
 * The selected feature advances every 5s; any click restarts the timer.
 */
export default function ModuleExplorer({ suiteId }: { suiteId: SuiteId }) {
  const suite = getSuite(suiteId)!;
  const modules = suite.modules;
  const [pick, setPick] = useState<Pick>(() => ({
    m: Math.max(0, modules.findIndex((x) => x.features.length)),
    f: 0,
    open: -1,
  }));
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const startRotation = useCallback(() => {
    clearInterval(timer.current);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const flat: [number, number][] = [];
    modules.forEach((m, mi) => m.features.forEach((_, fi) => flat.push([mi, fi])));
    if (flat.length < 2) return;
    timer.current = setInterval(() => {
      setPick((p) => {
        const k = flat.findIndex((a) => a[0] === p.m && a[1] === p.f);
        const [mi, fi] = flat[(k + 1) % flat.length];
        return { m: mi, f: fi, open: p.open === -1 ? -1 : mi };
      });
    }, ROTATE_MS);
  }, [modules]);

  useEffect(() => {
    startRotation();
    return () => clearInterval(timer.current);
  }, [startRotation]);

  const choose = (next: Pick) => {
    setPick(next);
    startRotation();
  };

  const current = modules[pick.m];
  const hasScreens = current?.features.length > 0;

  return (
    <div className={styles.grid}>
      <div className={styles.list}>
        <span className={styles.listLabel}>MODULES</span>
        {modules.map((m, i) => {
          const open = pick.open === i;
          const selected = pick.m === i;
          const panelId = `module-${m.id}`;
          return (
            <div key={m.id} className={styles.module} data-open={open || undefined} data-selected={selected || undefined}>
              <button
                type="button"
                className={styles.head}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => choose(open ? { ...pick, open: -1 } : { m: i, f: pick.m === i ? pick.f : 0, open: i })}
              >
                <span className={styles.icon}><i className="material-icons" aria-hidden="true">{m.icon}</i></span>
                <span className={styles.headText}>
                  <span className={styles.idx}>MODULE {String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.name}>
                    {m.name}
                    {m.standalone && (
                      <span className={`standalone-mark ${styles.mark}`} title="Also available standalone" aria-label="Also available standalone">
                        <i className="material-icons" aria-hidden="true">extension</i>
                      </span>
                    )}
                    {m.dev && <span className="tag">IN DEVELOPMENT</span>}
                  </span>
                </span>
                <i className={`material-icons ${styles.chev}`} aria-hidden="true">expand_more</i>
              </button>
              <div id={panelId} className={styles.panel} inert={!open}>
                <div className={styles.panelClip}>
                  <div className={styles.panelInner}>
                    <p className={styles.line}>{m.line}</p>
                    {m.features.map((text, fi) => {
                      const on = selected && pick.f === fi;
                      return (
                        <button
                          key={text}
                          type="button"
                          className={styles.feat}
                          data-on={on || undefined}
                          aria-pressed={on}
                          onClick={() => choose({ m: i, f: fi, open: i })}
                        >
                          <span className={styles.featBar} />
                          <span className={styles.featNum}>{i + 1}.{fi + 1}</span>
                          <span className={styles.featText}>{text}</span>
                          <i className="material-icons" aria-hidden="true">arrow_forward</i>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.screen} style={{ opacity: hasScreens ? 1 : 0 }} aria-live="polite">
        <div className={styles.stack}>
          {modules.flatMap((m, mi) =>
            m.features.map((text, fi) => {
              const on = pick.m === mi && pick.f === fi;
              // TODO: replace placeholders with product screenshots (screen-<suite>-<module>-<n>).
              return (
                <div key={`${m.id}-${fi}`} className={styles.shot} data-on={on || undefined} aria-hidden={!on}>
                  <ImagePlaceholder caption={`Product screen — ${m.name}: ${text}`} />
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
