import Link from "next/link";
import IndustryPhoto from "@/components/IndustryPhoto";
import { getSuite, homeIndustries } from "@/lib/data";
import styles from "./IndustryAccordion.module.css";

/**
 * Homepage "Industries We Serve".
 * Desktop: wide rows linking to the products page. Mobile: compact link cards.
 */
export default function IndustryAccordion() {
  return (
    <>
      <div className={`${styles.list} desktop-only`}>
        {homeIndustries.map((ind) => (
          <Link key={ind.id} href={`/products/${ind.id}`} className={styles.row}>
            <div className={styles.media}>
              <IndustryPhoto suite={getSuite(ind.id)!} sizes="300px" />
            </div>
            <div className={styles.rowBody}>
              <div className={styles.rowText}>
                <span className={styles.num}>{ind.num}</span>
                <span className={styles.name}>{ind.name}</span>
              </div>
              <span className={styles.arrow}>
                <i className="material-icons" aria-hidden="true">arrow_forward</i>
              </span>
            </div>
          </Link>
        ))}
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
