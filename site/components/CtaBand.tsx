"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CtaBand.module.css";

/** Closing call to action above the footer on every page except Contact and Demo. Product, Industries and About pages use their own copy. */
export default function CtaBand() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/demo") || pathname.startsWith("/contact")) return null;
  const onProduct = ["/products/", "/industries", "/about"].some((p) => pathname.startsWith(p));

  return (
    <section data-sec="contact" className={styles.band}>
      <div className={styles.copy}>
        {onProduct ? (
          <>
            <h2 className={styles.title}>See what better planning looks like for your plant.</h2>
            <p className={styles.text}>
              Tell us how your plant plans today, and we&apos;ll show you where Applied Bell Curve can help.
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Bring one week of your real schedule.</h2>
            <p className={styles.text}>
              We will show you what the solver would have done differently, line by line.
            </p>
          </>
        )}
      </div>
      <div className={styles.actions}>
        <Link href="/contact" className={`btn btn-outline ${styles.talk}`}>
          Talk to Us<i className="material-icons" aria-hidden="true">arrow_forward</i>
        </Link>
      </div>
    </section>
  );
}
