import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Experience <span className="text-gradient">Luxury</span> in Every Detail.
          </h1>
          <p className={styles.heroSubtitle}>
            Discover our exclusive collection of premium goods curated for the modern lifestyle. Uncompromising quality meets striking design.
          </p>
          <div className={styles.heroActions}>
            <Button size="lg">Shop the Collection</Button>
            <Button variant="outline" size="lg">View Lookbook</Button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          {/* We use a colored placeholder block for now until we have real product images */}
          <div className={`${styles.heroImagePlaceholder} glass`}>
            <div className={styles.abstractShape}></div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>Featured Categories</h2>
          <Link href="/categories" className={styles.viewAll}>
            View all categories &rarr;
          </Link>
        </div>
        <div className={styles.grid}>
          {['Watches', 'Leather Goods', 'Tech Accessories'].map((cat, i) => (
            <div key={i} className={`${styles.categoryCard} hover-lift`}>
              <div className={styles.categoryImagePlaceholder}></div>
              <div className={styles.categoryInfo}>
                <h3>{cat}</h3>
                <p>Explore collection</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
