"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CtaBand.module.css";

/** "Bring one week of your real schedule." — shown above the footer on every page except Contact and Demo. */
export default function CtaBand() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/demo") || pathname.startsWith("/contact")) return null;

  return (
    <section data-sec="contact" className={styles.band}>
      <div className={styles.copy}>
        <h2 className={styles.title}>Bring one week of your real schedule.</h2>
        <p className={styles.text}>
          We will show you what the solver would have done differently<span className="desktop-only">, line by line</span>.
        </p>
      </div>
      <div className={styles.actions}>
        <Link href="/demo" className={`btn btn-caps ${styles.demo} mobile-only`}>
          REQUEST A DEMO
        </Link>
        <Link href="/contact" className={`btn btn-outline ${styles.talk}`}>
          Talk to Us<i className="material-icons" aria-hidden="true">arrow_forward</i>
        </Link>
      </div>
    </section>
  );
}
