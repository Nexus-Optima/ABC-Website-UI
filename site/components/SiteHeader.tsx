"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";

const NAV = [
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const onDemo = pathname.startsWith("/demo");
  // From a product page, the demo form is prefilled with that industry.
  const productMatch = /^\/products\/([^/]+)/.exec(pathname);
  const demoHref = productMatch ? `/demo?industry=${productMatch[1]}` : "/demo";

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="Applied Bell Curve home">
          <span className={styles.brandName}>APPLIED BELL CURVE</span>
          <span className={styles.brandSub}>MANUFACTURING PLANNING</span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          {!onDemo && (
            <Link href={demoHref} className={`btn ${styles.demo}`}>
              REQUEST A DEMO
            </Link>
          )}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className={styles.menu} aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.menuLink} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          {!onDemo && (
            <Link href={demoHref} className={styles.menuLink} onClick={() => setMenuOpen(false)}>
              Request a demo
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
