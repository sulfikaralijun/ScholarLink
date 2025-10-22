-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Beasiswa" (
    "id_beasiswa" TEXT NOT NULL,
    "id_admin" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "penyelenggara" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "tipe_pendanaan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "link_pendaftaran" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beasiswa_pkey" PRIMARY KEY ("id_beasiswa")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id_subscription" SERIAL NOT NULL,
    "email_user" TEXT NOT NULL,
    "tanggal_daftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id_subscription")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Beasiswa" ADD CONSTRAINT "Beasiswa_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Admin"("id_admin") ON DELETE RESTRICT ON UPDATE CASCADE;
