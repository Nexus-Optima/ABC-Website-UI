"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { getSuite, type Module, type Screen, type SuiteId } from "@/lib/data";
import styles from "./ModuleExplorer.module.css";

const ROTATE_MS = 5000;

/** Screenshot carousel for one live module. Advances every 5s; any click restarts the timer. */
function ScreenCarousel({ module: m }: { module: Module }) {
  const screens: Screen[] = m.screens ?? m.features.map((caption) => ({ caption }));
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const count = screens.length;

  const startRotation = useCallback(() => {
    clearInterval(timer.current);
    if (count < 2 || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
  }, [count]);

  useEffect(() => {
    startRotation();
    return () => clearInterval(timer.current);
  }, [startRotation]);

  if (!count) return null;

  const go = (i: number) => {
    setIndex((i + count) % count);
    startRotation();
  };

  return (
    <div className={styles.screen}>
      <div className={styles.stage} aria-live="polite" style={m.screenAspect ? ({ "--shot-aspect": m.screenAspect } as React.CSSProperties) : undefined}>
        {screens.map((s, i) => (
          <div key={s.caption} className={styles.shot} data-on={i === index || undefined} aria-hidden={i !== index}>
            {s.src ? (
              <Image src={s.src} alt={`${m.name}: ${s.caption}`} fill sizes="(max-width: 1099px) 100vw, 760px" style={{ objectFit: "contain" }} />
            ) : (
              <ImagePlaceholder caption={`Product screen — ${m.name}: ${s.caption}`} />
            )}
          </div>
        ))}
        {count > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(index - 1)} aria-label="Previous screen">
              <i className="material-icons" aria-hidden="true">chevron_left</i>
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(index + 1)} aria-label="Next screen">
              <i className="material-icons" aria-hidden="true">chevron_right</i>
            </button>
          </>
        )}
      </div>
      <div className={styles.bar}>
        <span className={styles.caption}>{screens[index].caption}</span>
        <div className={styles.pager}>
          {count > 1 && (
            <div className={styles.dots}>
              {screens.map((s, i) => (
                <button
                  key={s.caption}
                  type="button"
                  className={styles.dot}
                  data-on={i === index || undefined}
                  onClick={() => go(i)}
                  aria-label={`Show screen ${i + 1}`}
                />
              ))}
            </div>
          )}
          <span className={styles.count}>
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

function LiveModule({ module: m }: { module: Module }) {
  const [open, setOpen] = useState(true);
  const panelId = `module-${m.id}`;

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <button type="button" className={styles.head} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
          <span className={styles.icon}><i className="material-icons" aria-hidden="true">{m.icon}</i></span>
          <span className={styles.headText}>
            <span className={styles.name}>
              {m.name}
              {m.standalone && (
                <span className={`standalone-mark ${styles.mark}`} title="Also available standalone" aria-label="Also available standalone">
                  <i className="material-icons" aria-hidden="true">extension</i>
                </span>
              )}
            </span>
            <span className={styles.line}>{m.line}</span>
          </span>
          <i className={`material-icons ${styles.chev}`} aria-hidden="true">expand_less</i>
        </button>
        <ol id={panelId} className={styles.features} hidden={!open}>
          {m.features.map((f, i) => (
            <li key={f} className={styles.feat}>
              <span className={styles.featNum}>{String(i + 1).padStart(2, "0")}</span>
              {f}
            </li>
          ))}
        </ol>
      </div>
      <ScreenCarousel module={m} />
    </div>
  );
}

/** APS modules: live modules with features and screens, then the modules still in development. */
export default function ModuleExplorer({ suiteId }: { suiteId: SuiteId }) {
  const modules = getSuite(suiteId)!.modules;
  const live = modules.filter((m) => !m.dev);
  const soon = modules.filter((m) => m.dev);

  return (
    <div className={styles.groups}>
      {live.length > 0 && (
        <div className={styles.group}>
          <span className={styles.liveTag}><span className={styles.liveDot} />LIVE MODULES</span>
          {live.map((m) => <LiveModule key={m.id} module={m} />)}
        </div>
      )}
      {soon.length > 0 && (
        <div className={styles.group}>
          <span className={styles.soonTag}>COMING SOON</span>
          <div className={styles.soonGrid}>
            {soon.map((m) => (
              <div key={m.id} className={styles.soon}>
                <span className={styles.soonIcon}><i className="material-icons" aria-hidden="true">{m.icon}</i></span>
                <div className={styles.soonText}>
                  <span className={styles.soonName}>{m.name}</span>
                  <span className={styles.soonLine}>{m.line}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
