# Database Schema Documentation
## ScholarLink - Platform Informasi Beasiswa

---

## 1. Overview

Database schema untuk platform ScholarLink yang mendukung fitur tanpa user login, dengan fokus pada management beasiswa oleh admin dan email subscription.

---

## 2. Database Models

### 2.1 Admin Model

```prisma
model Admin {
  id_admin    Int         @id @default(autoincrement())
  nama        String
  email       String      @unique
  password    String
  role        String      @default("admin") // "admin" atau "super_admin"
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relationship
  beasiswa    Beasiswa[]
}
```

#### Field Descriptions:
- **id_admin**: Primary key, auto increment
- **nama**: Nama lengkap admin
- **email**: Email admin (unique), digunakan untuk login
- **password**: Password admin (di-hash dengan bcrypt)
- **role**: Role admin ("admin" atau "super_admin")
- **createdAt**: Timestamp pembuatan
- **updatedAt**: Timestamp update terakhir

#### Relationships:
- **One-to-Many** dengan Beasiswa (satu admin dapat mengelola banyak beasiswa)

### 2.2 Beasiswa Model

```prisma
model Beasiswa {
  id_beasiswa       String   @id @default(cuid())
  id_admin          Int      // Foreign key ke Admin
  judul             String
  penyelenggara     String
  lokasi            String
  kategori          String
  deadline          DateTime
  tipe_pendanaan    String
  deskripsi         String
  link_pendaftaran  String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relationship
  admin             Admin    @relation(fields: [id_admin], references: [id_admin])
}
```

#### Field Descriptions:
- **id_beasiswa**: Primary key, menggunakan CUID
- **id_admin**: Foreign key ke Admin yang membuat beasiswa
- **judul**: Judul beasiswa
- **penyelenggara**: Pihak yang menyelenggarakan beasiswa
- **lokasi**: Lokasi beasiswa (dalam/luar negeri, kota)
- **kategori**: Kategori beasiswa (S1, S2, S3, SMA, Umum)
- **deadline**: Batas waktu pendaftaran
- **tipe_pendanaan**: Jenis pendanaan (Full, Partial, Merit)
- **deskripsi**: Deskripsi lengkap beasiswa
- **link_pendaftaran**: URL resmi pendaftaran
- **createdAt**: Timestamp pembuatan
- **updatedAt**: Timestamp update terakhir

#### Relationships:
- **Many-to-One** dengan Admin (banyak beasiswa dapat dikelola oleh satu admin)

### 2.3 Subscription Model

```prisma
model Subscription {
  id_subscription   Int              @id @default(autoincrement())
  email_user        String
  tanggal_daftar    DateTime         @default(now())
  createdAt         DateTime         @default(now())
}
```

#### Field Descriptions:
- **id_subscription**: Primary key, auto increment
- **email_user**: Email pengguna yang berlangganan
- **tanggal_daftar**: Tanggal pendaftaran subscription
- **createdAt**: Timestamp pembuatan

---

## 3. Database Relationships

### 3.1 Admin ↔ Beasiswa
```
Admin (1) ──── (N) Beasiswa
```
- **Relationship**: One-to-Many
- **Description**: Satu admin dapat mengelola banyak beasiswa
- **Foreign Key**: `Beasiswa.id_admin` → `Admin.id_admin`

### 3.2 Subscription (Standalone)
```
Subscription (Independent)
```
- **Relationship**: None
- **Description**: Email subscription tidak memerlukan user login
- **Purpose**: Mengirim notifikasi beasiswa baru

---

## 4. Database Constraints

### 4.1 Primary Keys
- **Admin**: `id_admin` (Int, Auto Increment)
- **Beasiswa**: `id_beasiswa` (String, CUID)
- **Subscription**: `id_subscription` (Int, Auto Increment)

### 4.2 Unique Constraints
- **Admin.email**: Email admin harus unique
- **Subscription.email_user**: Email subscription harus unique (optional)

### 4.3 Foreign Key Constraints
- **Beasiswa.id_admin**: Harus reference ke Admin.id_admin yang valid

### 4.4 Default Values
- **Admin.role**: Default "admin"
- **Admin.createdAt**: Default current timestamp
- **Admin.updatedAt**: Default current timestamp
- **Beasiswa.createdAt**: Default current timestamp
- **Beasiswa.updatedAt**: Default current timestamp
- **Subscription.tanggal_daftar**: Default current timestamp
- **Subscription.createdAt**: Default current timestamp

---

