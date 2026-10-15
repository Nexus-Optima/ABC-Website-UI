import Image from "next/image";
import type { Suite } from "@/lib/data";
import styles from "./IndustryPhoto.module.css";

/**
 * Industry photo with the brand treatment from the design:
 * greyscale + contrast, a navy "lighten" wash and a pale "multiply" wash.
 * Fills its positioned parent.
 */
export default function IndustryPhoto({ suite, sizes, priority }: { suite: Suite; sizes: string; priority?: boolean }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.photo}>
        <Image
          src={suite.image}
          alt={suite.shot}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover", objectPosition: suite.imagePosition }}
        />
      </div>
      <div className={styles.lighten} />
      <div className={styles.multiply} />
    </div>
  );
}
