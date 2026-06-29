/* src/components/CategoryStrip.jsx — Horizontal category tab bar */

import { CATEGORIES } from '../data/mockData'

/**
 * CategoryStrip — แถบ category filter ด้านบน product grid
 * @param {string}   active    id ของ category ที่เลือกอยู่
 * @param {Function} onSelect  callback เมื่อเลือก category
 */
export default function CategoryStrip({ active, onSelect }) {
  return (
    <div className="category-section" role="navigation" aria-label="Product categories">
      <div className="category-inner">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            id={`cat-${cat.id}`}
            className={`category-chip ${active === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
            aria-pressed={active === cat.id}
          >
            <span aria-hidden="true">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
