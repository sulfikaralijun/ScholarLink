# ScholarLink — Platform Informasi Beasiswa

Panduan singkat untuk meng-clone, konfigurasi, dan menjalankan proyek ini dari awal sampai siap digunakan.

## Prasyarat
- Node.js 18+ dan pnpm
- PostgreSQL 14+
- Akun Resend (untuk pengiriman email)

## 1) Clone Repository
```bash
git clone <repo-url>
cd ScholarLink
```

## 2) Siapkan Environment Variables
Salin file contoh dan isi nilainya sesuai lingkungan Anda.
```bash
cp env.example .env
```
Wajib diisi minimal:
- `DATABASE_URL` dan `DIRECT_URL` (PostgreSQL - [bsai menggunakan docker cukup jalankan `docker compose up -d`])
- `JWT_SECRET` (string acak kuat)
- `RESEND_API_KEY` dan `RESEND_EMAIL_FROM`

## 3) Install Dependencies
```bash
pnpm install
```

## 4) Generate Prisma Client & Migrasi Database
```bash
pnpm prisma:generate
pnpm dlx prisma migrate deploy
```

Opsional: seed data awal (jika tersedia script seed)
```bash
pnpm db:seed
```

## 5) Jalankan Aplikasi (Dev)
```bash
pnpm dev
```
Akses:
- Landing page: `http://localhost:5173/`
- Dashboard (protected): `http://localhost:5173/dashboard`

## 6) Build & Preview (Prod-like)
```bash
pnpm build
pnpm preview
```

## Fitur Utama
- Landing: daftar beasiswa, pencarian dengan debounce, filter sederhana, halaman detail.
- Auth Admin: login JWT (cookie httpOnly), proteksi API dan dashboard.
- Dashboard: CRUD Beasiswa (tambah/edit/hapus).
- Subscription: double opt-in, email konfirmasi, auto-broadcast saat beasiswa baru dibuat, footer + unsubscribe.

## Arsitektur Singkat
- SvelteKit 2 + Svelte 5, TailwindCSS + DaisyUI
- Prisma (PostgreSQL)
- Resend untuk email


## login admin acccount:

route: /login (tidak disediakan navigation pada client, hanya internal team yg tau)
email: admin@scholarlink.com
password: admin123