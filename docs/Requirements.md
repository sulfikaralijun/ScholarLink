# Requirements Document
## ScholarLink - Platform Informasi Beasiswa

---

## 1. Introduction

### 1.1 Purpose
Dokumen ini menjelaskan functional dan non-functional requirements untuk platform ScholarLink, sistem informasi beasiswa yang mendukung SDGs ke-10 (Reduced Inequalities) tanpa user login.

### 1.2 Scope
Dokumen ini mencakup semua kebutuhan sistem yang harus dipenuhi untuk membuat platform informasi beasiswa yang efektif, mudah digunakan, dan mendukung akses pendidikan yang merata tanpa memerlukan registrasi user.

### 1.3 Definitions
- **Functional Requirements**: Kebutuhan yang menjelaskan apa yang sistem harus lakukan
- **Non-Functional Requirements**: Kebutuhan yang menjelaskan bagaimana sistem harus berperforma
- **Admin**: Pengelola sistem yang mengelola data beasiswa
- **Super Admin**: Admin dengan hak akses penuh untuk mengelola admin lain
- **Beasiswa**: Program bantuan pendidikan berupa dana atau fasilitas
- **Subscription**: Email subscription untuk notifikasi beasiswa

---

## 2. Functional Requirements

### 2.1 Public Access (Tanpa Login)

#### 2.1.1 Beasiswa Information
- **FR-001**: Sistem menampilkan daftar beasiswa
- **FR-002**: Sistem menampilkan detail beasiswa
- **FR-003**: Sistem menampilkan link pendaftaran resmi
- **FR-004**: Sistem menampilkan deadline beasiswa
- **FR-005**: Sistem menampilkan persyaratan beasiswa

#### 2.1.2 Search and Filter
- **FR-006**: User dapat mencari beasiswa berdasarkan keyword
- **FR-007**: User dapat filter berdasarkan kategori pendidikan
- **FR-008**: User dapat filter berdasarkan lokasi
- **FR-009**: User dapat filter berdasarkan deadline
- **FR-010**: User dapat filter berdasarkan tipe pendanaan
- **FR-011**: User dapat sorting berdasarkan deadline
- **FR-012**: Sistem menampilkan hasil pencarian yang relevan

#### 2.1.3 Email Subscription
- **FR-013**: User dapat subscribe untuk notifikasi
- **FR-014**: Sistem mengirim email notifikasi beasiswa baru
- **FR-015**: Sistem mengirim reminder deadline beasiswa
- **FR-016**: User dapat unsubscribe dari notifikasi
- **FR-017**: Sistem mencatat status pengiriman notifikasi

### 2.2 Admin Management

#### 2.2.1 Admin Authentication
- **FR-018**: Admin dapat login ke sistem
- **FR-019**: Admin dapat logout dari sistem
- **FR-020**: Sistem memvalidasi kredensial admin
- **FR-021**: Sistem menggenerate JWT token setelah login
- **FR-022**: Sistem menyimpan session admin

#### 2.2.2 Beasiswa Management
- **FR-023**: Admin dapat menambah beasiswa baru
- **FR-024**: Admin dapat mengedit beasiswa
- **FR-025**: Admin dapat menghapus beasiswa
- **FR-026**: Admin dapat melihat statistik sistem
- **FR-027**: Admin dapat mengirim notifikasi email

#### 2.2.3 Super Admin Management
- **FR-028**: Super admin dapat menambah admin baru
- **FR-029**: Super admin dapat mengedit admin
- **FR-030**: Super admin dapat menghapus admin
- **FR-031**: Super admin dapat melihat semua admin
- **FR-032**: Super admin dapat mengelola role admin

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

#### 3.1.1 Response Time
- **NFR-001**: Halaman utama load dalam waktu < 3 detik
- **NFR-002**: Pencarian beasiswa memberikan hasil dalam waktu < 2 detik
- **NFR-003**: Database query selesai dalam waktu < 1 detik
- **NFR-004**: API response selesai dalam waktu < 2 detik
- **NFR-005**: Login process selesai dalam waktu < 3 detik

#### 3.1.2 Throughput
- **NFR-006**: Sistem dapat menangani 100 user bersamaan
- **NFR-007**: Sistem dapat menangani 1000 request per menit
- **NFR-008**: Database dapat menangani 10000 query per jam
- **NFR-009**: Sistem dapat menangani 100 beasiswa per halaman
- **NFR-010**: Sistem dapat menangani 1000 subscription per hari

#### 3.1.3 Scalability
- **NFR-011**: Sistem dapat di-scale horizontal
- **NFR-012**: Database dapat di-scale untuk data besar
- **NFR-013**: Sistem dapat menangani pertumbuhan data beasiswa
- **NFR-014**: Sistem dapat menangani peak traffic
- **NFR-015**: Sistem dapat menangani pertumbuhan subscription

### 3.2 Security Requirements

#### 3.2.1 Authentication Security
- **NFR-016**: Password admin di-hash menggunakan bcrypt
- **NFR-017**: Session admin menggunakan JWT token
- **NFR-018**: Token memiliki expiry time
- **NFR-019**: Login attempt dibatasi (rate limiting)
- **NFR-020**: Password memiliki complexity requirements

#### 3.2.2 Data Security
- **NFR-021**: Data di-encrypt dalam transit
- **NFR-022**: Data di-encrypt dalam storage
- **NFR-023**: Input di-validate untuk mencegah injection
- **NFR-024**: Database menggunakan prepared statements
- **NFR-025**: Sensitive data di-mask dalam logs

#### 3.2.3 Access Control
- **NFR-026**: Admin hanya dapat mengakses data sendiri
- **NFR-027**: Super admin memiliki akses penuh
- **NFR-028**: API menggunakan authentication
- **NFR-029**: File upload di-validate
- **NFR-030**: CORS dikonfigurasi dengan benar

### 3.3 Usability Requirements

#### 3.3.1 User Interface
- **NFR-031**: Interface responsive untuk mobile dan desktop
- **NFR-032**: Interface mudah digunakan oleh user awam
- **NFR-033**: Navigation intuitif dan konsisten
- **NFR-034**: Error messages jelas dan helpful
- **NFR-035**: Loading states ditampilkan untuk operasi panjang

#### 3.3.2 Accessibility
- **NFR-036**: Interface accessible untuk pengguna disabilitas
- **NFR-037**: Keyboard navigation didukung
- **NFR-038**: Screen reader dapat membaca konten
- **NFR-039**: Color contrast memenuhi standar WCAG
- **NFR-040**: Text dapat di-zoom hingga 200%

#### 3.3.3 User Experience
- **NFR-041**: User dapat menyelesaikan task dalam 3 klik
- **NFR-042**: Search memberikan hasil yang relevan
- **NFR-043**: Filter mudah digunakan
- **NFR-044**: Navigation mudah dipahami
- **NFR-045**: Notifikasi tidak mengganggu

### 3.4 Reliability Requirements

#### 3.4.1 Availability
- **NFR-046**: Sistem memiliki uptime 99%+
- **NFR-047**: Sistem dapat recover dari error
- **NFR-048**: Database memiliki backup
- **NFR-049**: Sistem memiliki monitoring
- **NFR-050**: Sistem memiliki alert untuk issues

#### 3.4.2 Error Handling
- **NFR-051**: Sistem menangani error dengan graceful
- **NFR-052**: Error di-log untuk debugging
- **NFR-053**: User mendapat feedback untuk error
- **NFR-054**: Sistem dapat recover dari database error
- **NFR-055**: Sistem dapat recover dari network error

#### 3.4.3 Data Integrity
- **NFR-056**: Data konsisten di semua operasi
- **NFR-057**: Database transaction atomic
- **NFR-058**: Data di-validate sebelum disimpan
- **NFR-059**: Backup data dapat di-restore
- **NFR-060**: Data corruption dapat dideteksi

### 3.5 Compatibility Requirements

#### 3.5.1 Browser Compatibility
- **NFR-061**: Sistem compatible dengan Chrome 90+
- **NFR-062**: Sistem compatible dengan Firefox 88+
- **NFR-063**: Sistem compatible dengan Safari 14+
- **NFR-064**: Sistem compatible dengan Edge 90+
- **NFR-065**: Sistem compatible dengan mobile browsers

#### 3.5.2 Device Compatibility
- **NFR-066**: Sistem responsive untuk screen 320px+
- **NFR-067**: Sistem responsive untuk tablet
- **NFR-068**: Sistem responsive untuk desktop
- **NFR-069**: Touch interface responsive
- **NFR-070**: Keyboard interface responsive

#### 3.5.3 Operating System Compatibility
- **NFR-071**: Sistem compatible dengan Windows 10+
- **NFR-072**: Sistem compatible dengan macOS 11+
- **NFR-073**: Sistem compatible dengan Linux
- **NFR-074**: Sistem compatible dengan iOS 14+
- **NFR-075**: Sistem compatible dengan Android 8+

### 3.6 Maintainability Requirements

#### 3.6.1 Code Quality
- **NFR-076**: Code mengikuti coding standards
- **NFR-077**: Code memiliki documentation
- **NFR-078**: Code dapat di-refactor dengan mudah
- **NFR-079**: Code dapat di-debug dengan mudah
- **NFR-080**: Code clean dan maintainable

#### 3.6.2 Documentation
- **NFR-081**: API memiliki documentation
- **NFR-082**: Database memiliki documentation
- **NFR-083**: User manual tersedia
- **NFR-084**: Admin guide tersedia
- **NFR-085**: Code documentation tersedia

#### 3.6.3 Monitoring (Optional)
- **NFR-086**: Sistem memiliki basic error handling
- **NFR-087**: Sistem memiliki logging untuk debugging
- **NFR-088**: Sistem memiliki performance monitoring (optional)
- **NFR-089**: Sistem memiliki user activity tracking (optional)
- **NFR-090**: Sistem memiliki alert system (optional)

---

## 4. Requirements Traceability

### 4.1 Functional Requirements Traceability

| Requirement ID | Description | Priority | Status |
|----------------|-------------|----------|--------|
| FR-001 | Display Beasiswa List | High | Pending |
| FR-002 | Display Beasiswa Detail | High | Pending |
| FR-003 | Display Registration Link | High | Pending |
| FR-004 | Display Deadline | High | Pending |
| FR-005 | Display Requirements | High | Pending |
| FR-006 | Search by Keyword | High | Pending |
| FR-007 | Filter by Category | High | Pending |
| FR-008 | Filter by Location | High | Pending |
| FR-009 | Filter by Deadline | High | Pending |
| FR-010 | Filter by Funding Type | High | Pending |
| FR-011 | Sort by Deadline | Medium | Pending |
| FR-012 | Display Search Results | High | Pending |
| FR-013 | Email Subscription | Medium | Pending |
| FR-014 | Send Email Notifications | Medium | Pending |
| FR-015 | Send Deadline Reminders | Medium | Pending |
| FR-016 | Unsubscribe | Medium | Pending |
| FR-017 | Track Email Status | Low | Pending |
| FR-018 | Admin Login | High | Pending |
| FR-019 | Admin Logout | High | Pending |
| FR-020 | Validate Admin Credentials | High | Pending |
| FR-021 | Generate JWT Token | High | Pending |
| FR-022 | Store Admin Session | High | Pending |
| FR-023 | Create Beasiswa | High | Pending |
| FR-024 | Update Beasiswa | High | Pending |
| FR-025 | Delete Beasiswa | High | Pending |
| FR-026 | View System Statistics | Medium | Pending |
| FR-027 | Send Email Notifications | Medium | Pending |
| FR-028 | Create Admin | Medium | Pending |
| FR-029 | Update Admin | Medium | Pending |
| FR-030 | Delete Admin | Medium | Pending |
| FR-031 | View All Admins | Medium | Pending |
| FR-032 | Manage Admin Roles | Medium | Pending |

### 4.2 Non-Functional Requirements Traceability

| Requirement ID | Description | Priority | Status |
|----------------|-------------|----------|--------|
| NFR-001 | Page Load < 3s | High | Pending |
| NFR-002 | Search < 2s | High | Pending |
| NFR-003 | DB Query < 1s | High | Pending |
| NFR-004 | API Response < 2s | High | Pending |
| NFR-005 | Login < 3s | High | Pending |
| NFR-006 | 100 Concurrent Users | Medium | Pending |
| NFR-007 | 1000 RPM | Medium | Pending |
| NFR-008 | 10000 QPH | Medium | Pending |
| NFR-009 | 100 Beasiswa/Page | Medium | Pending |
| NFR-010 | 1000 Subscriptions/Day | Medium | Pending |
| NFR-011 | Horizontal Scaling | Low | Pending |
| NFR-012 | Database Scaling | Low | Pending |
| NFR-013 | Data Growth Handling | Low | Pending |
| NFR-014 | Peak Traffic Handling | Low | Pending |
| NFR-015 | Subscription Growth | Low | Pending |

---

## 5. Requirements Validation

### 5.1 Validation Criteria
- **Completeness**: Semua requirements harus lengkap
- **Consistency**: Requirements tidak boleh bertentangan
- **Feasibility**: Requirements harus dapat diimplementasi
- **Testability**: Requirements harus dapat di-test
- **Traceability**: Requirements harus dapat di-track

### 5.2 Validation Methods
- **Review**: Peer review oleh developer
- **Testing**: Manual testing untuk semua scenarios
- **Prototyping**: Proof of concept untuk fitur kompleks
- **User Feedback**: Feedback dari target users
- **Expert Review**: Review oleh domain expert

---

## 6. Appendices

### 6.1 Glossary
- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **SDGs**: Sustainable Development Goals
- **WCAG**: Web Content Accessibility Guidelines

### 6.2 References
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [SDGs Documentation](https://sdgs.un.org/goals)

---

*Dokumen ini dibuat untuk mata kuliah RPL (Rekayasa Perangkat Lunak)*
*Versi: 2.0 | Tanggal: 2024*

