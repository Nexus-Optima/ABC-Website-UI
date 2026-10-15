import type { Metadata } from "next";
import { Suspense } from "react";
import DemoForm from "@/components/DemoForm";
import styles from "./demo.module.css";

export const metadata: Metadata = { title: "Request a demo" };

export default function DemoPage() {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Request a demo</h1>
        <div className={`card ${styles.card}`}>
          {/* The industry is prefilled from ?industry= when arriving from a product page. */}
          <Suspense fallback={null}>
            <DemoForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
