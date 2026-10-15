import styles from "./ImagePlaceholder.module.css";

/** Stand-in for imagery the design has not supplied yet (founder photos, product screens). */
export default function ImagePlaceholder({ caption }: { caption: string }) {
  return (
    <div className={styles.slot} role="img" aria-label={caption}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className={styles.cap}>{caption}</span>
    </div>
  );
}
