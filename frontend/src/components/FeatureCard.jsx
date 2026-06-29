/* src/components/FeatureCard.jsx — Single feature highlight card */

/**
 * FeatureCard — card แสดง feature ของ platform
 * @param {string} icon   emoji icon
 * @param {string} title  ชื่อ feature
 * @param {string} desc   คำอธิบาย
 */
export default function FeatureCard({ icon, title, desc }) {
  return (
    <article className="feature-card">
      <div className="feature-icon" aria-hidden="true">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </article>
  )
}
