-- =============================================================================
-- SISTEM INFORMASI & LOGBOOK KEUANGAN KEBUN SAWIT (SI-KEBUN SAWIT)
-- Database Schema: Pencatatan Penjualan TBS, Biaya Perawatan & Posisi Kas Kebun
-- Kompatibilitas: MySQL 8.0+, MariaDB 10.5+, PostgreSQL 12+
-- Karakter Enkoding: UTF-8 (utf8mb4)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS db_kebun_sawit
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_kebun_sawit;

-- -----------------------------------------------------------------------------
-- 1. TABEL: pemilik_kebun
-- Menyimpan identitas pekebun dan legalitas kepemilikan
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS pemilik_kebun;
CREATE TABLE pemilik_kebun (
    id VARCHAR(36) PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    nik VARCHAR(16) UNIQUE,
    no_hp_wa VARCHAR(25),
    alamat_domisili TEXT,
    kelompok_tani VARCHAR(100),
    status_verifikasi ENUM('Terverifikasi', 'Dalam Proses', 'Belum Verifikasi') DEFAULT 'Terverifikasi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Data Identitas Pemilik Kebun Sawit';

-- -----------------------------------------------------------------------------
-- 2. TABEL: kebun_sawit
-- Menyimpan karakteristik teknis, varietas, luas lahan, dan target produksi
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS kebun_sawit;
CREATE TABLE kebun_sawit (
    id VARCHAR(36) PRIMARY KEY,
    pemilik_id VARCHAR(36) NOT NULL,
    nama_kebun VARCHAR(100) NOT NULL,
    luas_lahan_ha DECIMAL(6,2) NOT NULL DEFAULT 1.00,
    jumlah_pokok INT NOT NULL DEFAULT 140,
    target_panen_ton DECIMAL(6,2) NOT NULL DEFAULT 5.00,
    varietas_bibit VARCHAR(100) DEFAULT 'DxP Socfindo',
    tahun_tanam INT DEFAULT 2017,
    status_lahan VARCHAR(50) DEFAULT 'SHM (Sertifikat Hak Milik)',
    pengumpul_utama_ram VARCHAR(100) NOT NULL,
    kontak_ram VARCHAR(100),
    kondisi_jalan VARCHAR(255),
    catatan_kebun TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_kebun_pemilik FOREIGN KEY (pemilik_id) 
        REFERENCES pemilik_kebun(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Data Spesifikasi & Teknis Kebun Sawit';

-- -----------------------------------------------------------------------------
-- 3. TABEL: lokasi_kebun
-- Menyimpan detail geografis wilayah dan koordinat GPS peta digital
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS lokasi_kebun;
CREATE TABLE lokasi_kebun (
    id VARCHAR(36) PRIMARY KEY,
    kebun_id VARCHAR(36) NOT NULL UNIQUE,
    desa_blok VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(100),
    kabupaten VARCHAR(100),
    provinsi VARCHAR(100),
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    url_google_maps VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lokasi_kebun FOREIGN KEY (kebun_id) 
        REFERENCES kebun_sawit(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Titik Koordinat GPS & Lokasi Kebun';

-- -----------------------------------------------------------------------------
-- 4. TABEL: master_kategori_biaya
-- Referensi kategori pengeluaran operasional kebun sawit
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS master_kategori_biaya;
CREATE TABLE master_kategori_biaya (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    warna_badge VARCHAR(20) DEFAULT '#16A34A'
) ENGINE=InnoDB COMMENT='Kategori Pengeluaran Biaya Kebun';

-- -----------------------------------------------------------------------------
-- 5. TABEL: penjualan_tbs (ARUS KAS MASUK)
-- Pencatatan hasil panen Tandan Buah Segar (TBS) ke pengumpul / RAM
-- Rumus Otomatis:
-- - Netto = Bruto * (1 - Potongan / 100)
-- - Total Diterima = Netto * Harga
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS penjualan_tbs;
CREATE TABLE penjualan_tbs (
    id VARCHAR(36) PRIMARY KEY,
    kebun_id VARCHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    pengumpul_ram VARCHAR(100) NOT NULL,
    bruto_kg DECIMAL(10,2) NOT NULL,
    potongan_persen DECIMAL(5,2) NOT NULL DEFAULT 2.00,
    netto_kg DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(bruto_kg * (1 - (potongan_persen / 100)), 2)) STORED,
    harga_per_kg DECIMAL(10,2) NOT NULL,
    total_diterima_rp DECIMAL(14,2) GENERATED ALWAYS AS (ROUND(netto_kg * harga_per_kg, 0)) STORED,
    status_pembayaran ENUM('Lunas', 'Belum Lunas', 'Sebagian') NOT NULL DEFAULT 'Lunas',
    no_nota_slip VARCHAR(50),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_penjualan_kebun_tgl (kebun_id, tanggal),
    CONSTRAINT fk_penjualan_kebun FOREIGN KEY (kebun_id) 
        REFERENCES kebun_sawit(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Catatan Arus Kas Masuk Penjualan TBS';

-- -----------------------------------------------------------------------------
-- 6. TABEL: pengeluaran_biaya (ARUS KAS KELUAR)
-- Pencatatan seluruh biaya operasional: pupuk, upah perawatan, dodos, langsir
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS pengeluaran_biaya;
CREATE TABLE pengeluaran_biaya (
    id VARCHAR(36) PRIMARY KEY,
    kebun_id VARCHAR(36) NOT NULL,
    kategori_id INT NOT NULL,
    tanggal DATE NOT NULL,
    rincian_barang_jasa_hk TEXT NOT NULL,
    jumlah_biaya_rp DECIMAL(14,2) NOT NULL,
    penerima_keterangan VARCHAR(100) NOT NULL,
    metode_pembayaran VARCHAR(50) DEFAULT 'Tunai',
    no_bukti VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pengeluaran_kebun_tgl (kebun_id, tanggal),
    CONSTRAINT fk_pengeluaran_kebun FOREIGN KEY (kebun_id) 
        REFERENCES kebun_sawit(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pengeluaran_kategori FOREIGN KEY (kategori_id) 
        REFERENCES master_kategori_biaya(id) ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Catatan Arus Kas Keluar Biaya Perawatan & Panen';

-- =============================================================================
-- VIEW: v_ringkasan_keuangan_bulanan
-- Perhitungan Otomatis: Netto, Pemasukan, Pengeluaran, Laba Bersih, dan HPP/Kg
-- =============================================================================
DROP VIEW IF EXISTS v_ringkasan_keuangan_bulanan;
CREATE VIEW v_ringkasan_keuangan_bulanan AS
SELECT 
    k.id AS kebun_id,
    k.nama_kebun,
    p.nama_lengkap AS nama_pemilik,
    k.luas_lahan_ha,
    k.jumlah_pokok,
    k.target_panen_ton,
    DATE_FORMAT(tgl_ref.tanggal, '%Y-%m') AS periode_bulan,
    
    -- Agregasi Panen TBS (Arus Kas Masuk)
    COALESCE(SUM(tbs.bruto_kg), 0) AS total_bruto_kg,
    COALESCE(SUM(tbs.netto_kg), 0) AS total_netto_kg,
    COALESCE(SUM(tbs.total_diterima_rp), 0) AS total_pemasukan_rp,
    CASE 
        WHEN COALESCE(SUM(tbs.netto_kg), 0) > 0 
        THEN ROUND(SUM(tbs.total_diterima_rp) / SUM(tbs.netto_kg), 2)
        ELSE 0 
    END AS rata_harga_jual_per_kg,
    
    -- Agregasi Pengeluaran (Arus Kas Keluar)
    COALESCE(biaya.total_pengeluaran, 0) AS total_pengeluaran_rp,
    
    -- Rumus 1: Keuntungan Bersih = Pemasukan - Pengeluaran
    (COALESCE(SUM(tbs.total_diterima_rp), 0) - COALESCE(biaya.total_pengeluaran, 0)) AS laba_bersih_rp,
    
    -- Rumus 2: HPP (Harga Pokok Produksi) = Pengeluaran ÷ Netto Kg
    CASE 
        WHEN COALESCE(SUM(tbs.netto_kg), 0) > 0 
        THEN ROUND(COALESCE(biaya.total_pengeluaran, 0) / SUM(tbs.netto_kg), 2)
        ELSE 0 
    END AS hpp_per_kg,
    
    -- Margin Keuntungan = Harga Rata-rata - HPP
    CASE 
        WHEN COALESCE(SUM(tbs.netto_kg), 0) > 0 
        THEN ROUND((SUM(tbs.total_diterima_rp) - COALESCE(biaya.total_pengeluaran, 0)) / SUM(tbs.netto_kg), 2)
        ELSE 0 
    END AS margin_laba_per_kg,
    
    -- Status Keuntungan Kebun
    CASE 
        WHEN (COALESCE(SUM(tbs.total_diterima_rp), 0) - COALESCE(biaya.total_pengeluaran, 0)) >= 0 
        THEN 'UNTUNG' 
        ELSE 'DEFISIT' 
    END AS status_kebun,

    -- Produktivitas per Hektar (Kg/Ha) & per Pokok (Kg/Pokok)
    ROUND(COALESCE(SUM(tbs.netto_kg), 0) / k.luas_lahan_ha, 2) AS produktivitas_kg_per_ha,
    ROUND(COALESCE(SUM(tbs.netto_kg), 0) / k.jumlah_pokok, 2) AS hasil_kg_per_pokok

FROM kebun_sawit k
JOIN pemilik_kebun p ON k.pemilik_id = p.id
-- Cross join unik bulan transaksi
JOIN (
    SELECT kebun_id, tanggal FROM penjualan_tbs
    UNION
    SELECT kebun_id, tanggal FROM pengeluaran_biaya
) tgl_ref ON tgl_ref.kebun_id = k.id
LEFT JOIN penjualan_tbs tbs ON tbs.kebun_id = k.id 
    AND DATE_FORMAT(tbs.tanggal, '%Y-%m') = DATE_FORMAT(tgl_ref.tanggal, '%Y-%m')
LEFT JOIN (
    SELECT 
        kebun_id, 
        DATE_FORMAT(tanggal, '%Y-%m') AS bln, 
        SUM(jumlah_biaya_rp) AS total_pengeluaran
    FROM pengeluaran_biaya
    GROUP BY kebun_id, DATE_FORMAT(tanggal, '%Y-%m')
) biaya ON biaya.kebun_id = k.id AND biaya.bln = DATE_FORMAT(tgl_ref.tanggal, '%Y-%m')
GROUP BY 
    k.id, k.nama_kebun, p.nama_lengkap, k.luas_lahan_ha, k.jumlah_pokok, 
    k.target_panen_ton, DATE_FORMAT(tgl_ref.tanggal, '%Y-%m'), biaya.total_pengeluaran;

-- =============================================================================
-- SEED DATA AWAL (SESUAI CONTOH RESMI DOKUMEN BUKU KAS SAWIT BULAN NOVEMBER 2026)
-- =============================================================================

-- Master Kategori Biaya
INSERT INTO master_kategori_biaya (id, nama_kategori, deskripsi, warna_badge) VALUES
(1, 'Pemupukan', 'Pembelian pupuk anorganik (NPK, Urea, TSP, KCl, Dolomit, Borat) dan ongkos angkut', '#DC2626'),
(2, 'Upah Perawatan', 'Upah tabur pupuk, semprot herbisida, piringan, pasar pikul, kastrasi (HK)', '#4338CA'),
(3, 'Upah Panen & Langsir', 'Ongkos tukang dodos/egrek, angkut langsir sepeda motor / gerobak ke TPH/RAM', '#B45309'),
(4, 'Pestisida & Herbisida', 'Racun rumput sistemik / kontak, insektisida ulat api, fungisida jamur busuk buah', '#15803D'),
(5, 'Pembersihan & Pruning', 'Tunas pasir pelepah sawit, pembersihan piringan, cuci parit cacing', '#7E22CE'),
(6, 'Pengadaan Alat & Sarana', 'Dodos sawit, egrek, angkong/sorong, karung brondolan, batu asah, sepatu bot', '#475569'),
(7, 'Lain-lain', 'Biaya darurat atau pengeluaran tak terduga kebun', '#64748B')
ON DUPLICATE KEY UPDATE nama_kategori=VALUES(nama_kategori);

-- Data Pemilik Kebun
INSERT INTO pemilik_kebun (id, nama_lengkap, nik, no_hp_wa, alamat_domisili, kelompok_tani, status_verifikasi) VALUES
('pemilik-1', 'H. Syamsudin', '1401021234560001', '0812-7654-3210', 'Jl. Poros Sawit No. 12, RT 03 / RW 02', 'Kelompok Tani Sawit Jaya', 'Terverifikasi');

-- Data Kebun Sawit (Kebun Utama 4.5 Ha & Kebun Tambahan 3.0 Ha)
INSERT INTO kebun_sawit (
    id, pemilik_id, nama_kebun, luas_lahan_ha, jumlah_pokok, target_panen_ton, 
    varietas_bibit, tahun_tanam, status_lahan, pengumpul_utama_ram, kontak_ram, kondisi_jalan, catatan_kebun
) VALUES
('kebun-1', 'pemilik-1', 'Kebun Sawit Berkah Mandiri', 4.50, 630, 6.00, 
 'DxP Socfindo (Unggul Bersertifikat)', 2017, 'SHM (Sertifikat Hak Milik)', 
 'RAM Makmur Jaya', '0813-9876-5432 (H. Badrun)', 
 'Jalan Poros Aspal, Akses Pasar Pikul & TPH Padat Terawat', 
 'Jarak tanam 9m x 9m segitiga sama sisi (140 pokok/Ha). Parit cacing lancar dan piringan bersih.'),

('kebun-2', 'pemilik-1', 'Kebun Sawit Sejahtera Blok C', 3.00, 420, 4.00, 
 'Marihat', 2019, 'SKT (Surat Keterangan Tanah)', 
 'RAM Berkah Sawit', '0852-1122-3344 (Pak Joko)', 
 'Jalan Tanah Perkerasan Sirtu, Akses TPH Mudah', 
 'Tanaman umur muda produktif, pemupukan organik dan NPK teratur.');

-- Data Titik Lokasi GPS Peta
INSERT INTO lokasi_kebun (id, kebun_id, desa_blok, kecamatan, kabupaten, provinsi, latitude, longitude, url_google_maps) VALUES
('lokasi-1', 'kebun-1', 'Desa Makmur Jaya, Blok B3', 'Tapung Hilir', 'Kampar', 'Riau', 0.612450, 101.214560, 'https://www.google.com/maps?q=0.612450,101.214560'),
('lokasi-2', 'kebun-2', 'Desa Rimba Beringin, Blok C2', 'Tapung Hulu', 'Kampar', 'Riau', 0.658200, 101.189400, 'https://www.google.com/maps?q=0.658200,101.189400');

-- Data Transaksi Penjualan TBS (Arus Kas Masuk Periode November 2026)
-- Transaksi 1: 05/11/2026 | Bruto 2.500 Kg | Pot 2% | Netto 2.450 Kg | Rp 2.850 -> Rp 6.982.500 (Lunas)
-- Transaksi 2: 19/11/2026 | Bruto 2.650 Kg | Pot 2% | Netto 2.597 Kg | Rp 2.900 -> Rp 7.531.300 (Lunas)
-- Total Bulan Ini: Bruto 5.150 Kg | Netto 5.047 Kg | Total Pemasukan: Rp 14.513.800
INSERT INTO penjualan_tbs (id, kebun_id, tanggal, pengumpul_ram, bruto_kg, potongan_persen, harga_per_kg, status_pembayaran, no_nota_slip, catatan) VALUES
('p-1', 'kebun-1', '2026-11-05', 'RAM Makmur Jaya', 2500.00, 2.00, 2850.00, 'Lunas', 'NOTA-0511/MJ', 'Panen rotasi ke-1 November. Buah matang merah, brondolan segar.'),
('p-2', 'kebun-1', '2026-11-19', 'RAM Makmur Jaya', 2650.00, 2.00, 2900.00, 'Lunas', 'NOTA-1911/MJ', 'Panen rotasi ke-2 November. Kualitas TBS grade A.');

-- Data Transaksi Pengeluaran Biaya (Arus Kas Keluar Periode November 2026)
-- Biaya 1: 01/11 | Pemupukan (10 sak NPK + Transportasi) | Rp 4.440.000 | Toko Tani
-- Biaya 2: 02/11 | Upah Perawatan (Tabur pupuk 2 Orang / HK) | Rp 300.000 | Tunai
-- Biaya 3: 05/11 | Upah Panen & Langsir (2.450 Kg @ Rp 250/Kg) | Rp 612.500 | Pemanen A
-- Biaya 4: 19/11 | Upah Panen & Langsir (2.597 Kg @ Rp 250/Kg) | Rp 649.250 | Pemanen A
-- Total Pengeluaran Bulan Ini: Rp 6.001.750
INSERT INTO pengeluaran_biaya (id, kebun_id, kategori_id, tanggal, rincian_barang_jasa_hk, jumlah_biaya_rp, penerima_keterangan, metode_pembayaran) VALUES
('k-1', 'kebun-1', 1, '2026-11-01', 'Beli 10 sak NPK Kujang @ Rp 440.000 + Transportasi', 4440000.00, 'Toko Tani', 'Transfer Bank'),
('k-2', 'kebun-1', 2, '2026-11-02', 'Upah tabur pupuk 2 Orang (2 Hari Kerja / HK)', 300000.00, 'Tunai', 'Tunai'),
('k-3', 'kebun-1', 3, '2026-11-05', 'Ongkos pemanen & langsir motor 2.450 Kg @ Rp 250/Kg', 612500.00, 'Pemanen A', 'Tunai'),
('k-4', 'kebun-1', 3, '2026-11-19', 'Ongkos pemanen & langsir motor 2.597 Kg @ Rp 250/Kg', 649250.00, 'Pemanen A', 'Tunai');

-- =============================================================================
-- CONTOH QUERY ANALISIS & LAPORAN DASHBOARD RESMI KEBUN
-- =============================================================================

-- Query 1: Menampilkan Laporan Ringkasan Keuangan Bulanan (Sesuai Dashboard PDF)
-- SELECT * FROM v_ringkasan_keuangan_bulanan WHERE periode_bulan = '2026-11';

-- Query 2: Evaluasi HPP (Harga Pokok Produksi) & Margin Keuntungan per Kebun
-- SELECT 
--     nama_kebun,
--     total_netto_kg,
--     total_pemasukan_rp,
--     total_pengeluaran_rp,
--     laba_bersih_rp,
--     hpp_per_kg,
--     rata_harga_jual_per_kg,
--     margin_laba_per_kg,
--     status_kebun
-- FROM v_ringkasan_keuangan_bulanan;
