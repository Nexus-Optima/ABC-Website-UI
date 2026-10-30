import Link from "next/link";
import IndustryPhoto from "@/components/IndustryPhoto";
import { getSuite, homeIndustries } from "@/lib/data";
import styles from "./IndustryAccordion.module.css";

/** Homepage "Industries We Serve": one row per industry, linking to its products page. */
export default function IndustryAccordion() {
  return (
    <div className={styles.list}>
      {homeIndustries.map((ind) => (
        <Link key={ind.id} href={`/products/${ind.id}`} className={styles.row}>
          <div className={styles.media}>
            <IndustryPhoto suite={getSuite(ind.id)!} sizes="(max-width: 767px) 120px, 300px" />
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
  );
}
