---
name: frontend-dev-test
description: >
  Skill สำหรับทดสอบ frontend ของ shadowMarketplace (React + Vite).
  ใช้เมื่อต้องการ verify ว่า code ที่แก้ไขทำงานได้ถูกต้อง
  ครอบคลุมการ lint, build check, และการ inspect structure
  โดยไม่ต้องรัน dev server เอง (ผู้ใช้จะ run เอง)
---

# Frontend Dev Test Skill

## เมื่อไหร่ควรใช้ Skill นี้
- หลังแก้ไขหรือสร้าง component ใหม่
- เมื่อต้องการตรวจสอบว่า import path ถูกต้อง
- เมื่อต้องการ verify โครงสร้างไฟล์ก่อน merge
- เมื่อผู้ใช้พูดว่า "ทดสอบ", "check", "verify", "ดูว่าทำงานได้ไหม"

## สิ่งที่ทำได้โดยไม่ต้องรัน dev server

### 1. ตรวจสอบ Import Paths
ใช้ grep เพื่อหา import ที่อาจพัง:
```powershell
# หา import ทั้งหมดใน src
grep -r "^import" frontend/src --include="*.jsx" --include="*.js"

# ตรวจสอบว่า component ที่ import มีไฟล์จริงหรือเปล่า
Get-ChildItem frontend/src/components -Name
```

### 2. ตรวจสอบโครงสร้างไฟล์
```powershell
# แสดง tree ของ src/
Get-ChildItem frontend/src -Recurse | Select-Object FullName
```

### 3. Static Lint (oxlint)
โปรเจกต์นี้ใช้ oxlint (ไม่ใช่ ESLint):
```powershell
cd frontend
npx oxlint src/
```

### 4. Build Check (ไม่ต้องรัน server)
```powershell
cd frontend
npm run build
# ถ้า build สำเร็จ = ไม่มี syntax error หรือ import พัง
```

### 5. ตรวจสอบ package.json dependencies
```powershell
cat frontend/package.json
# ดูว่า dependencies ที่ใช้ใน code มีใน package.json หรือยัง
```

## สิ่งที่ผู้ใช้ทำเอง (ไม่ต้อง run แทน)
- `npm run dev` — รัน dev server ดูผลใน browser
- ทดสอบ UI interaction (click, hover, form)
- ดูใน browser DevTools

## Checklist หลังแก้ไข Component

- [ ] ไฟล์ component อยู่ที่ `src/components/` หรือ `src/pages/`
- [ ] Export เป็น `export default function ComponentName()`
- [ ] Import paths ใช้ relative path ที่ถูกต้อง (`../data/mockData`)
- [ ] Props ที่รับเข้ามามี default value ถ้าจำเป็น
- [ ] มี `id` attribute บน interactive element (สำคัญสำหรับ pentesting)
- [ ] มี `aria-label` บน button/input ที่ไม่มี text ชัดเจน

## โครงสร้าง Component ของ shadowMarketplace

```
src/
├── App.jsx                  ← root, assembles sections
├── App.css                  ← component/section styles  
├── index.css                ← design system tokens + utilities
├── main.jsx                 ← entry point
├── components/
│   ├── Badge.jsx            ← reusable: HOT/NEW/SALE tags
│   ├── Navbar.jsx           ← sticky nav, search, cart count
│   ├── CategoryStrip.jsx    ← category filter tabs
│   ├── ProductCard.jsx      ← product listing card
│   ├── FeatureCard.jsx      ← platform feature card
│   └── BoardPostCard.jsx    ← discussion board post row
└── data/
    └── mockData.js          ← CATEGORIES, PRODUCTS, POSTS, FEATURES
```

## Pattern สำหรับสร้าง Component ใหม่

```jsx
/* src/components/MyComponent.jsx */

/**
 * MyComponent — คำอธิบาย
 * @param {type} propName  คำอธิบาย prop
 */
export default function MyComponent({ propName, optionalProp = 'default' }) {
  return (
    <div className="my-component" id="my-component">
      {/* content */}
    </div>
  )
}
```

## CSS Class Naming Convention

ใช้ BEM-like naming ตาม design system:
- Block: `.product-card`
- Element: `.product-card-body`, `.product-card-footer`
- Modifier: `.btn-primary`, `.badge-accent`

CSS variables ทั้งหมดอยู่ใน `index.css` ภายใต้ `:root { ... }`

## Notes สำหรับ Intentional Vulnerabilities

Component ต่อไปนี้มี "ช่องโหว่ตั้งใจ" — อย่าแก้ไข:
- `BoardPostCard.jsx` — อนาคตจะใช้ `dangerouslySetInnerHTML` (XSS)
- `Navbar.jsx` — `handleSearch` มี `console.log` (Information Disclosure)
- `ProfilePage` (ยังไม่ได้สร้าง) — จะส่ง `role` field ใน PUT request (Mass Assignment)

## Best Practices & Documentation
- ให้ปฏิบัติตามวิธีที่ดีที่สุด (Best Practices) ในการเขียนโค้ดและการทำงานเสมอ
- สามารถดาวน์โหลด Documentation หรือเอกสารอ้างอิงต่างๆ มาเก็บไว้ในโปรเจกต์เพื่อใช้อ่านประกอบได้
- **ข้อควรระวังสำคัญ:** หากมีการดาวน์โหลดเอกสาร (Docs) เข้ามาในโปรเจกต์ ต้องนำไปใส่ในไฟล์ `.gitignore` เสมอ เพื่อป้องกันไม่ให้เผลอ Commit ไฟล์เอกสารเหล่านั้นขึ้นระบบ Version Control
