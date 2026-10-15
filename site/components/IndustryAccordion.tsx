"use client";

import Link from "next/link";
import { useState } from "react";
import IndustryPhoto from "@/components/IndustryPhoto";
import { getSuite, homeIndustries } from "@/lib/data";
import styles from "./IndustryAccordion.module.css";

/**
 * Homepage "Industries We Serve".
 * Desktop: expandable rows showing the segments served. Mobile: compact link cards.
 */
export default function IndustryAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <div className={`${styles.list} desktop-only`}>
        {homeIndustries.map((ind) => {
          const suite = getSuite(ind.id)!;
          const open = openId === ind.id;
          const panelId = `ind-panel-${ind.id}`;
          return (
            <div key={ind.id} className={styles.item} data-open={open || undefined}>
              <button
                type="button"
                className={styles.row}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : ind.id)}
              >
                <div className={styles.media}>
                  <IndustryPhoto suite={suite} sizes="300px" />
                </div>
                <div className={styles.rowBody}>
                  <div className={styles.rowText}>
                    <span className={styles.num}>{ind.num}</span>
                    <span className={styles.name}>{ind.name}</span>
                  </div>
                  <i className="material-icons" aria-hidden="true">{open ? "expand_less" : "expand_more"}</i>
                </div>
              </button>
              <div id={panelId} className={styles.panel} aria-hidden={!open} inert={!open}>
                <div className={styles.panelClip}>
                  <div className={styles.panelInner}>
                    <div className={styles.segments}>
                      <span className={styles.segLabel}>SEGMENTS WE SERVE</span>
                      <div className={styles.segGrid}>
                        {ind.subs.map((sub) => (
                          <div key={sub} className={styles.seg}><span />{sub}</div>
                        ))}
                      </div>
                    </div>
                    <Link href={`/products/${ind.id}`} className={`btn btn-primary ${styles.view}`}>
                      View products<i className="material-icons" aria-hidden="true">arrow_forward</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${styles.cards} mobile-only`}>
        {homeIndustries.map((ind) => (
          <Link key={ind.id} href={`/products/${ind.id}`} className={styles.card}>
            <div className={styles.cardMedia}>
              <IndustryPhoto suite={getSuite(ind.id)!} sizes="120px" />
            </div>
            <div className={styles.cardBody}>
              <span>{ind.name}</span>
              <i className="material-icons" aria-hidden="true">arrow_forward</i>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
