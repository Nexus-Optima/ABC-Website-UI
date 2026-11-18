"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CtaBand.module.css";

/** Closing call to action above the footer on every page except Contact and Demo. */
export default function CtaBand() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/demo") || pathname.startsWith("/contact")) return null;

  return (
    <section data-sec="contact" className={styles.band}>
      <div className={styles.copy}>
        <h2 className={styles.title}>See what better planning looks like for your plant.</h2>
        <p className={styles.text}>
          Tell us how your plant plans today, and we&apos;ll show you where Applied Bell Curve can help.
        </p>
      </div>
      <div className={styles.actions}>
        <Link href="/contact" className={`btn btn-outline ${styles.talk}`}>
          Talk to Us<i className="material-icons" aria-hidden="true">arrow_forward</i>
        </Link>
      </div>
    </section>
  );
}
