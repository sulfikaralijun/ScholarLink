# ScholarLink Documentation

## 📚 Dokumentasi Project ScholarLink

Dokumentasi lengkap untuk platform informasi beasiswa ScholarLink yang mendukung SDGs ke-10 (Reduced Inequalities) dengan fokus pada akses informasi beasiswa tanpa user login.

### 📋 Daftar Dokumen

1. **[Software Requirements Specification (SRS)](./SRS.md)** - Spesifikasi kebutuhan sistem
2. **[Software Design Document (SDD)](./SDD.md)** - Desain arsitektur dan komponen sistem
3. **[Project Plan](./ProjectPlan.md)** - Rencana pengembangan dan timeline
4. **[Requirements](./Requirements.md)** - Functional dan Non-Functional Requirements
5. **[Database Schema](./DatabaseSchema.md)** - ERD dan database schema
6. **[Use Cases](./UseCases.md)** - Use case diagram dan deskripsi
7. **[Class Diagram](./ClassDiagram.md)** - Class diagram dan relasi

### 🎯 Tujuan Project

Platform informasi beasiswa yang memudahkan akses informasi beasiswa untuk semua kalangan tanpa perlu registrasi, mendukung SDGs ke-10 dalam mengurangi kesenjangan akses pendidikan.

### 🚀 Teknologi yang Digunakan

- **Frontend**: SvelteKit 5, TailwindCSS, DaisyUI
- **Backend**: SvelteKit, Prisma ORM
- **Database**: Postgresql
- **Authentication**: JWT, bcrypt (Admin only)

### 📅 Timeline

- **Phase 1**: Core Features (Minggu 1-2)
- **Phase 2**: Admin Features (Minggu 3)
- **Phase 3**: Finalization (Minggu 4)

### 🎯 Fitur Utama

#### **Public Features (Tanpa Login)**
- ✅ Landing page dengan informasi platform
- ✅ Daftar beasiswa lengkap
- ✅ Pencarian dan filter beasiswa
- ✅ Detail beasiswa dengan link pendaftaran
- ✅ Email subscription untuk notifikasi

#### **Admin Features (Dengan Login)**
- ✅ Admin authentication
- ✅ CRUD beasiswa operations
- ✅ Admin dashboard
- ✅ Analytics dan statistik
- ✅ Email notification management

### 🗄️ Database Schema

#### **Models:**
- **Admin**: Management admin dengan role (admin/super_admin)
- **Beasiswa**: Data beasiswa dengan tracking admin
- **Subscription**: Email subscription untuk notifikasi

#### **Relationships:**
- Admin (1) → Beasiswa (N)
- Subscription (Standalone)

### 📊 Fitur yang TIDAK Ada

- ❌ User registration/login
- ❌ User dashboard
- ❌ Bookmark beasiswa
- ❌ Personal notifications
- ❌ User preferences

### 🎯 Keuntungan Tanpa User Login

1. **Lebih Sederhana** - Tidak perlu handle user management
2. **Lebih Cepat** - Implementasi lebih cepat
3. **Lebih Fokus** - Fokus pada informasi beasiswa
4. **Lebih Mudah** - Tidak perlu authentication complexity
5. **Lebih Accessible** - Semua orang bisa akses tanpa registrasi

---


