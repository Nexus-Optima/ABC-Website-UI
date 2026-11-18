import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = { title: "Contact" };

// TODO: replace placeholder phone, address and LinkedIn URL.
const CHANNELS = [
  { icon: "support_agent", label: "SUPPORT", value: "support@appliedbellcurve.com", href: "mailto:support@appliedbellcurve.com", note: "For existing customers" },
  { icon: "call", label: "PHONE", value: "+00 00000 00000", href: "tel:+000000000000", note: "Mon–Fri, 09:30–18:30" },
  { icon: "location_on", label: "OFFICE", value: "Street address, City, Country", href: "#", note: "Visits by appointment" },
  { icon: "open_in_new", label: "LINKEDIN", value: "Applied Bell Curve", href: "#", note: "News and open roles" },
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">CONTACT</div>
        <h1 className="page-title">Talk to us.</h1>
      </section>

      <section className={`section ${styles.body}`}>
        <div className={styles.grid}>
          <div className={styles.channels}>
            {CHANNELS.map((c) => (
              <div key={c.label} className={styles.channel}>
                <span className={styles.icon}><i className="material-icons" aria-hidden="true">{c.icon}</i></span>
                <div className={styles.channelText}>
                  <span className="label">{c.label}</span>
                  <a href={c.href} className={styles.value}>{c.value}</a>
                  <span className={styles.note}>{c.note}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={`card ${styles.formCard}`}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
