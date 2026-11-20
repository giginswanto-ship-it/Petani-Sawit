-- =============================================================================
-- SISTEM INFORMASI & LOGBOOK KEUANGAN KEBUN SAWIT (SI-KEBUN SAWIT)
-- Database Schema untuk SQLite / Android Room / Standalone Local DB
-- =============================================================================

PRAGMA foreign_keys = ON;

-- 1. TABEL: pemilik_kebun
DROP TABLE IF EXISTS pemilik_kebun;
CREATE TABLE pemilik_kebun (
    id TEXT PRIMARY KEY,
    nama_lengkap TEXT NOT NULL,
    nik TEXT UNIQUE,
    no_hp_wa TEXT,
    alamat_domisili TEXT,
    kelompok_tani TEXT,
    status_verifikasi TEXT DEFAULT 'Terverifikasi',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL: kebun_sawit
DROP TABLE IF EXISTS kebun_sawit;
CREATE TABLE kebun_sawit (
    id TEXT PRIMARY KEY,
    pemilik_id TEXT NOT NULL,
    nama_kebun TEXT NOT NULL,
    luas_lahan_ha REAL NOT NULL DEFAULT 1.0,
    jumlah_pokok INTEGER NOT NULL DEFAULT 140,
    target_panen_ton REAL NOT NULL DEFAULT 5.0,
    varietas_bibit TEXT DEFAULT 'DxP Socfindo',
    tahun_tanam INTEGER DEFAULT 2017,
    status_lahan TEXT DEFAULT 'SHM (Sertifikat Hak Milik)',
    pengumpul_utama_ram TEXT NOT NULL,
    kontak_ram TEXT,
    kondisi_jalan TEXT,
    catatan_kebun TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pemilik_id) REFERENCES pemilik_kebun(id) ON DELETE CASCADE
);

-- 3. TABEL: lokasi_kebun
DROP TABLE IF EXISTS lokasi_kebun;
CREATE TABLE lokasi_kebun (
    id TEXT PRIMARY KEY,
    kebun_id TEXT NOT NULL UNIQUE,
    desa_blok TEXT NOT NULL,
    kecamatan TEXT,
    kabupaten TEXT,
    provinsi TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    url_google_maps TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kebun_id) REFERENCES kebun_sawit(id) ON DELETE CASCADE
);

-- 4. TABEL: master_kategori_biaya
DROP TABLE IF EXISTS master_kategori_biaya;
CREATE TABLE master_kategori_biaya (
    id INTEGER PRIMARY KEY,
    nama_kategori TEXT NOT NULL UNIQUE,
    deskripsi TEXT,
    warna_badge TEXT DEFAULT '#16A34A'
);

-- 5. TABEL: penjualan_tbs (ARUS KAS MASUK)
DROP TABLE IF EXISTS penjualan_tbs;
CREATE TABLE penjualan_tbs (
    id TEXT PRIMARY KEY,
    kebun_id TEXT NOT NULL,
    tanggal TEXT NOT NULL, -- format YYYY-MM-DD
    pengumpul_ram TEXT NOT NULL,
    bruto_kg REAL NOT NULL,
    potongan_persen REAL NOT NULL DEFAULT 2.0,
    netto_kg REAL NOT NULL,
    harga_per_kg REAL NOT NULL,
    total_diterima_rp REAL NOT NULL,
    status_pembayaran TEXT NOT NULL DEFAULT 'Lunas',
    no_nota_slip TEXT,
    catatan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kebun_id) REFERENCES kebun_sawit(id) ON DELETE CASCADE
);

-- 6. TABEL: pengeluaran_biaya (ARUS KAS KELUAR)
DROP TABLE IF EXISTS pengeluaran_biaya;
CREATE TABLE pengeluaran_biaya (
    id TEXT PRIMARY KEY,
    kebun_id TEXT NOT NULL,
    kategori_id INTEGER NOT NULL,
    tanggal TEXT NOT NULL, -- format YYYY-MM-DD
    rincian_barang_jasa_hk TEXT NOT NULL,
    jumlah_biaya_rp REAL NOT NULL,
    penerima_keterangan TEXT NOT NULL,
    metode_pembayaran TEXT DEFAULT 'Tunai',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kebun_id) REFERENCES kebun_sawit(id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_id) REFERENCES master_kategori_biaya(id)
);

-- VIEW: v_ringkasan_keuangan_bulanan
DROP VIEW IF EXISTS v_ringkasan_keuangan_bulanan;
CREATE VIEW v_ringkasan_keuangan_bulanan AS
SELECT 
    k.id AS kebun_id,
    k.nama_kebun,
    p.nama_lengkap AS nama_pemilik,
    k.luas_lahan_ha,
    k.jumlah_pokok,
    k.target_panen_ton,
    strftime('%Y-%m', tbs.tanggal) AS periode_bulan,
    COALESCE(SUM(tbs.bruto_kg), 0) AS total_bruto_kg,
    COALESCE(SUM(tbs.netto_kg), 0) AS total_netto_kg,
    COALESCE(SUM(tbs.total_diterima_rp), 0) AS total_pemasukan_rp,
    COALESCE(SUM(tbs.total_diterima_rp) / NULLIF(SUM(tbs.netto_kg), 0), 0) AS rata_harga_jual_per_kg,
    COALESCE(biaya.total_pengeluaran, 0) AS total_pengeluaran_rp,
    (COALESCE(SUM(tbs.total_diterima_rp), 0) - COALESCE(biaya.total_pengeluaran, 0)) AS laba_bersih_rp,
    COALESCE(biaya.total_pengeluaran / NULLIF(SUM(tbs.netto_kg), 0), 0) AS hpp_per_kg,
    CASE 
        WHEN (COALESCE(SUM(tbs.total_diterima_rp), 0) - COALESCE(biaya.total_pengeluaran, 0)) >= 0 
        THEN 'UNTUNG' 
        ELSE 'DEFISIT' 
    END AS status_kebun
FROM kebun_sawit k
JOIN pemilik_kebun p ON k.pemilik_id = p.id
LEFT JOIN penjualan_tbs tbs ON tbs.kebun_id = k.id
LEFT JOIN (
    SELECT 
        kebun_id, 
        strftime('%Y-%m', tanggal) AS bln, 
        SUM(jumlah_biaya_rp) AS total_pengeluaran
    FROM pengeluaran_biaya
    GROUP BY kebun_id, strftime('%Y-%m', tanggal)
) biaya ON biaya.kebun_id = k.id AND biaya.bln = strftime('%Y-%m', tbs.tanggal)
GROUP BY k.id, k.nama_kebun, p.nama_lengkap, strftime('%Y-%m', tbs.tanggal);

-- SEED DATA AWAL (SESUAI DOKUMEN PDF LAMPIRAN)
INSERT INTO master_kategori_biaya VALUES 
(1, 'Pemupukan', 'Beli pupuk NPK, Urea, TSP, KCl, Dolomit', '#DC2626'),
(2, 'Upah Perawatan', 'Upah tabur pupuk, semprot gulma (HK)', '#4338CA'),
(3, 'Upah Panen & Langsir', 'Ongkos dodos dan angkut langsir motor', '#B45309'),
(4, 'Pestisida & Herbisida', 'Racun rumput sistemik / kontak', '#15803D'),
(5, 'Pembersihan & Pruning', 'Tunas pelepah dan piringan', '#7E22CE'),
(6, 'Pengadaan Alat & Sarana', 'Dodos, egrek, angkong', '#475569'),
(7, 'Lain-lain', 'Biaya darurat atau tak terduga', '#64748B');

INSERT INTO pemilik_kebun VALUES 
('pemilik-1', 'H. Syamsudin', '1401021234560001', '0812-7654-3210', 'Jl. Poros Sawit No. 12, RT 03 / RW 02', 'Kelompok Tani Sawit Jaya', 'Terverifikasi', CURRENT_TIMESTAMP);

INSERT INTO kebun_sawit VALUES 
('kebun-1', 'pemilik-1', 'Kebun Sawit Berkah Mandiri', 4.5, 630, 6.0, 'DxP Socfindo (Unggul Bersertifikat)', 2017, 'SHM (Sertifikat Hak Milik)', 'RAM Makmur Jaya', '0813-9876-5432', 'Jalan Poros Aspal, Akses TPH Padat Terawat', 'Jarak tanam 9x9m segitiga sama sisi', CURRENT_TIMESTAMP),
('kebun-2', 'pemilik-1', 'Kebun Sawit Sejahtera Blok C', 3.0, 420, 4.0, 'Marihat', 2019, 'SKT (Surat Keterangan Tanah)', 'RAM Berkah Sawit', '0852-1122-3344', 'Jalan Tanah Perkerasan Sirtu', 'Tanaman umur muda produktif', CURRENT_TIMESTAMP);

INSERT INTO lokasi_kebun VALUES 
('lokasi-1', 'kebun-1', 'Desa Makmur Jaya, Blok B3', 'Tapung Hilir', 'Kampar', 'Riau', 0.612450, 101.214560, 'https://www.google.com/maps?q=0.612450,101.214560', CURRENT_TIMESTAMP),
('lokasi-2', 'kebun-2', 'Desa Rimba Beringin, Blok C2', 'Tapung Hulu', 'Kampar', 'Riau', 0.658200, 101.189400, 'https://www.google.com/maps?q=0.658200,101.189400', CURRENT_TIMESTAMP);

-- Penjualan TBS (Arus Kas Masuk November 2026)
INSERT INTO penjualan_tbs VALUES 
('p-1', 'kebun-1', '2026-11-05', 'RAM Makmur Jaya', 2500.0, 2.0, 2450.0, 2850.0, 6982500.0, 'Lunas', 'NOTA-0511/MJ', 'Panen rotasi ke-1 November', CURRENT_TIMESTAMP),
('p-2', 'kebun-1', '2026-11-19', 'RAM Makmur Jaya', 2650.0, 2.0, 2597.0, 2900.0, 7531300.0, 'Lunas', 'NOTA-1911/MJ', 'Panen rotasi ke-2 November', CURRENT_TIMESTAMP);

-- Pengeluaran Biaya (Arus Kas Keluar November 2026)
INSERT INTO pengeluaran_biaya VALUES 
('k-1', 'kebun-1', 1, '2026-11-01', 'Beli 10 sak NPK Kujang @ Rp 440.000 + Transportasi', 4440000.0, 'Toko Tani', 'Transfer Bank', CURRENT_TIMESTAMP),
('k-2', 'kebun-1', 2, '2026-11-02', 'Upah tabur pupuk 2 Orang (2 Hari Kerja / HK)', 300000.0, 'Tunai', 'Tunai', CURRENT_TIMESTAMP),
('k-3', 'kebun-1', 3, '2026-11-05', 'Ongkos pemanen & langsir motor 2.450 Kg @ Rp 250/Kg', 612500.0, 'Pemanen A', 'Tunai', CURRENT_TIMESTAMP),
('k-4', 'kebun-1', 3, '2026-11-19', 'Ongkos pemanen & langsir motor 2.597 Kg @ Rp 250/Kg', 649250.0, 'Pemanen A', 'Tunai', CURRENT_TIMESTAMP);
