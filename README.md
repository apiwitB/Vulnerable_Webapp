Tech Stack
- Backend: FastAPI
- Frontend: React
- Database: PostgreSQL
- Container: Docker + Docker Compose
- Auth: JWT

Functional Requirements
- User registration/login (ทดสอบ Auth bypass, JWT issues)
- User profile (view/edit) (ทดสอบ IDOR)
- Post/Comment CRUD (ทดสอบ XSS, CSRF)
- Search function (ทดสอบ SQL Injection)
- File upload (avatar) (ทดสอบ Unrestricted file upload, path traversal)
- Admin panel (ทดสอบ Privilege escalation, broken access control)
- API endpoint (fetch external data) (ทดสอบ SSRF)

Vulnerability Checklist
**SQL Injection** — ใน search/login (ใช้ raw query โดยไม่ parameterize)
- [ ]  **Broken Authentication** — JWT secret weak, ไม่เช็ค expiry
- [ ]  **IDOR** — `/api/users/{id}` ไม่เช็คว่า user เป็นเจ้าของข้อมูลจริง
- [ ]  **XSS** — Comment field ไม่ sanitize output
- [ ]  **CSRF** — ฟอร์ม sensitive action ไม่มี CSRF token
- [ ]  **SSRF** — Feature "fetch URL preview" ที่ไม่ validate input (เหมือนที่เจอใน exam!)
- [ ]  **Broken Access Control** — Admin endpoint เช็คแค่ frontend ไม่เช็ค backend
- [ ]  **Insecure File Upload** — Upload avatar ไม่เช็ค file type/extension
- [ ]  **Security Misconfiguration** — Docker container รัน root, debug mode เปิดทิ้งไว้

Theme shadowMarketplace (E-Commerce Platform)
features:
- discussion board
- Search Function
- Product Management
- Shopping cart
- Order Management
- User Profile
- Admin panel
- File upload