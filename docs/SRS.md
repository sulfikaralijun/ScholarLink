# Software Requirements Specification (SRS)
## ScholarLink - Platform Informasi Beasiswa

---

## 1. Introduction

### 1.1 Purpose
Dokumen ini menjelaskan spesifikasi kebutuhan untuk platform ScholarLink, sebuah sistem informasi beasiswa yang memudahkan akses informasi beasiswa untuk semua kalangan tanpa perlu registrasi, mendukung SDGs ke-10 (Reduced Inequalities).

### 1.2 Scope
ScholarLink adalah platform web yang menyediakan:
- Informasi beasiswa yang terpusat dan mudah diakses (tanpa login)
- Pencarian dan filter beasiswa
- Management system untuk admin
- Email subscription untuk notifikasi beasiswa

### 1.3 Definitions
- **Beasiswa**: Program bantuan pendidikan berupa dana atau fasilitas
- **Admin**: Pengelola sistem yang mengelola data beasiswa
- **Super Admin**: Admin dengan hak akses penuh untuk mengelola admin lain
- **Subscription**: Email subscription untuk notifikasi beasiswa
- **SDGs**: Sustainable Development Goals

### 1.4 References
- SDGs ke-10: Reduced Inequalities
- SvelteKit Documentation
- Prisma Documentation
- TailwindCSS Documentation

---

## 2. Overall Description

### 2.1 Product Perspective
ScholarLink adalah sistem web-based yang berjalan di browser dengan database MySQL. Sistem ini terintegrasi dengan email service untuk notifikasi dan tidak memerlukan user registration.

### 2.2 Product Functions
- **Informasi Beasiswa**: Menampilkan daftar beasiswa dengan detail lengkap
- **Pencarian**: Mencari beasiswa berdasarkan keyword
- **Filter**: Filter beasiswa berdasarkan kategori, lokasi, deadline
- **Admin Management**: Admin dapat mengelola data beasiswa
- **Email Subscription**: User dapat subscribe untuk notifikasi

### 2.3 User Characteristics
- **Public Users**: Semua orang yang mengakses informasi beasiswa
- **Admin**: Pengelola sistem dengan akses management
- **Super Admin**: Admin dengan hak akses penuh
- **Target**: Semua kalangan, terutama yang membutuhkan akses pendidikan

### 2.4 Constraints
- **Teknologi**: SvelteKit, Posgresql, Docker
- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive**: Mobile-first design
- **Security**: JWT authentication untuk admin, bcrypt password hashing

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Public Access (Tanpa Login)
- **FR-001**: Sistem menampilkan daftar beasiswa
- **FR-002**: Sistem menampilkan detail beasiswa
- **FR-003**: Sistem menampilkan link pendaftaran resmi
- **FR-004**: Sistem menampilkan deadline beasiswa
- **FR-005**: Sistem menampilkan persyaratan beasiswa

#### 3.1.2 Search and Filter
- **FR-006**: User dapat mencari beasiswa berdasarkan keyword
- **FR-007**: User dapat filter berdasarkan kategori pendidikan
- **FR-008**: User dapat filter berdasarkan lokasi
- **FR-009**: User dapat filter berdasarkan deadline
- **FR-010**: User dapat filter berdasarkan tipe pendanaan
- **FR-011**: User dapat sorting berdasarkan deadline
- **FR-012**: Sistem menampilkan hasil pencarian yang relevan

#### 3.1.3 Admin Authentication
- **FR-013**: Admin dapat login ke sistem
- **FR-014**: Admin dapat logout dari sistem
- **FR-015**: Sistem memvalidasi kredensial admin
- **FR-016**: Sistem menggenerate JWT token setelah login
- **FR-017**: Sistem menyimpan session admin

#### 3.1.4 Admin Management
- **FR-018**: Admin dapat menambah beasiswa baru
- **FR-019**: Admin dapat mengedit beasiswa
- **FR-020**: Admin dapat menghapus beasiswa
- **FR-021**: Admin dapat melihat statistik sistem
- **FR-022**: Super admin dapat mengelola admin lain
- **FR-023**: Admin dapat mengirim notifikasi email

#### 3.1.5 Email Subscription
- **FR-024**: User dapat subscribe untuk notifikasi
- **FR-025**: Sistem mengirim email notifikasi beasiswa baru
- **FR-026**: Sistem mengirim reminder deadline beasiswa
- **FR-027**: User dapat unsubscribe dari notifikasi
- **FR-028**: Sistem mencatat status pengiriman notifikasi

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance
- **NFR-001**: Halaman utama load dalam waktu < 3 detik
- **NFR-002**: Pencarian memberikan hasil dalam waktu < 2 detik
- **NFR-003**: Sistem dapat menangani 100 user bersamaan
- **NFR-004**: Database query response time < 1 detik
- **NFR-005**: API response harus selesai dalam waktu < 2 detik

#### 3.2.2 Security
- **NFR-006**: Password admin di-hash menggunakan bcrypt
- **NFR-007**: Session admin menggunakan JWT token
- **NFR-008**: Input validation untuk mencegah SQL injection
- **NFR-009**: HTTPS untuk semua komunikasi
- **NFR-010**: Rate limiting untuk mencegah abuse

#### 3.2.3 Usability
- **NFR-011**: Interface responsive untuk mobile dan desktop
- **NFR-012**: Navigation yang intuitif dan mudah dipahami
- **NFR-013**: Loading states untuk semua operasi
- **NFR-014**: Error messages yang jelas dan helpful
- **NFR-015**: Accessibility untuk pengguna disabilitas

#### 3.2.4 Reliability
- **NFR-016**: Sistem beroperasi dengan stabil
- **NFR-017**: Error handling untuk semua operasi
- **NFR-018**: Data backup (optional)
- **NFR-019**: Graceful degradation jika service down

#### 3.2.5 Compatibility
- **NFR-020**: Compatible dengan Chrome, Firefox, Safari, Edge
- **NFR-021**: Mobile responsive untuk screen 320px+
- **NFR-022**: Cross-platform compatibility
- **NFR-023**: Database compatible dengan MySQL 8.0+

### 3.3 Interface Requirements

#### 3.3.1 User Interface
- **UI-001**: Landing page dengan hero section
- **UI-002**: Daftar beasiswa dengan card layout
- **UI-003**: Search bar dengan filter options
- **UI-004**: Detail beasiswa page
- **UI-005**: Admin dashboard untuk management

#### 3.3.2 Hardware Interface
- **HI-001**: Web browser interface
- **HI-002**: Mobile device compatibility
- **HI-003**: Touch interface support

#### 3.3.3 Software Interface
- **SI-001**: MySQL database connection
- **SI-002**: Email service integration
- **SI-003**: JWT token management
- **SI-004**: File upload untuk admin

---

## 4. Appendices

### 4.1 Glossary
- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **SDGs**: Sustainable Development Goals

### 4.2 References
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [SDGs Documentation](https://sdgs.un.org/goals)


