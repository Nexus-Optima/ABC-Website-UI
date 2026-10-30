import Link from "next/link";
import styles from "./SiteFooter.module.css";

const LINKS = [
  { href: "/#why", label: "Why ABC" },
  { href: "/industries", label: "Industries" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <span className={styles.brand}>APPLIED BELL CURVE</span>
        <nav className={styles.links} aria-label="Footer">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.bottom}>
        <span className={styles.tagline}>PLANNING SYSTEMS FOR FACTORIES THAT KNOW THEIR CONSTRAINTS.</span>      </div>
    </footer>
  );
}
