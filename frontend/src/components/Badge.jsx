/* src/components/Badge.jsx — Reusable badge/tag component */

/**
 * Badge — แสดง label เล็กๆ สำหรับ category, status, tag ต่างๆ
 *
 * @param {'accent'|'red'|'green'|'amber'} variant
 * @param {string} children
 */
export default function Badge({ variant = 'accent', children, className = '', style = {} }) {
  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}
