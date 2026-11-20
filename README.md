# SI-KEBUN SAWIT 🌴
### Sistem Informasi & Buku Kas Logbook Keuangan Kebun Sawit Terpadu
*Sistem Pencatatan Penjualan TBS, Biaya Perawatan Kebun & Posisi Kas Mandiri*

---

## 📌 Ringkasan Aplikasi

Aplikasi **SI-KEBUN SAWIT** adalah sistem aplikasi terintegrasi yang dibangun secara dinamis untuk mengelola administrasi kebun kelapa sawit rakyat mandiri. Sistem ini mengimplementasikan secara penuh formulir dan lembar kerja resmi **"BUKU KAS & LOGBOOK KEUANGAN KEBUN SAWIT"**, dilengkapi dengan antarmuka digital modern, peta interaktif lokasi kebun, dan kalkulator indikator finansial otomatis (Keuntungan Bersih, HPP/Kg, Margin Keuntungan, dan Produktivitas Lahan).

Sesuai instruksi khusus:
> **Halaman muka aplikasi difokuskan secara khusus untuk menampilkan Data Kebun, Data Pemilik Kebun, serta Lokasi Kebun & Titik Koordinat GPS Peta Digital.**

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dapat dijalankan dengan sangat mudah di Windows melalui beberapa pilihan berikut:

### Opsi 1: Satu-Klik Menggunakan File Batch (Paling Praktis)
1. Cukup klik ganda (double-click) pada file:
   ```text
   Buka_Aplikasi_Kebun_Sawit.bat
   ```
2. Aplikasi akan otomatis mendeteksi server lokal dan langsung membuka browser Anda di alamat `http://localhost:3000`.

### Opsi 2: Menggunakan Terminal / Node.js
Buka PowerShell atau Command Prompt pada folder ini, lalu jalankan:
```bash
npm start
# atau
node server.js
```
Kemudian buka browser di: [http://localhost:3000](http://localhost:3000)

### Opsi 3: Buka Langsung File HTML (Tanpa Server)
Klik ganda file `index.html` langsung di browser Anda (Google Chrome, Microsoft Edge, Mozilla Firefox). Seluruh fitur, perhitungan, penyimpanan data browser (LocalStorage), grafik, dan ekspor tetap berfungsi 100%.

---

## 📋 Modul & Fitur Utama Sistem

### 1. 🏡 Halaman Muka: Data Kebun, Pemilik Kebun, & Lokasi Kebun
Halaman utama yang langsung menyambut pengguna saat aplikasi dibuka:
- **Identitas Pemilik & Legalitas:**
  - Nama Pemilik / Petani (e.g. *H. Syamsudin*)
  - Nomor Kontak WhatsApp aktif (dapat diklik langsung untuk chat)
  - NIK / Nomor ID Petani
  - Alamat Domisili Pemilik
  - Status Hak Atas Tanah (*SHM, SKT, Girik*)
  - Pengumpul Utama (RAM / Delivery)
- **Karakteristik & Teknis Kebun:**
  - Luas Lahan dalam Hektar (Ha)
  - Jumlah Batang Pokok Sawit
  - Standar Populasi Hektar (SPH): e.g. *140 Pokok/Ha (Ideal)*
  - Varietas Bibit Unggul (e.g. *DxP Socfindo, Dami Mas, Topaz, Marihat*)
  - Tahun Tanam & Umur Tanaman (e.g. *Tahun 2017, Umur 9 Tahun - Fase TM Prima*)
  - Target Panen Bulanan (Ton/Bulan)
  - Kondisi Akses Jalan & TPH (Tempat Pengumpulan Hasil)
- **Peta Digital & Titik Koordinat GPS Interaktif (Leaflet OSM):**
  - Alamat Desa / Blok Kebun, Kecamatan, Kabupaten, dan Provinsi
  - Koordinat GPS (Latitude & Longitude)
  - Peta interaktif dengan pin lokasi kebun yang dapat digeser (drag & drop) untuk menyesuaikan koordinat
  - Tombol **"GPS"** untuk mendeteksi lokasi koordinat perangkat secara real-time
  - Tombol **"Buka di Google Maps"** untuk navigasi langsung ke titik kebun
- **Ringkasan Indikator Keuangan Cepat Bulan Berjalan:**
  - 4 Kotak KPI: *Total Panen Netto*, *Total Pemasukan*, *Total Pengeluaran*, dan *Laba Bersih & HPP*
- **Manajemen Multi-Kebun / Multi-Blok:**
  - Petani dapat mengelola lebih dari 1 hamparan/kaveling kebun sawit dalam satu akun/sistem

---

### 2. 📋 Buku Kas & Logbook Keuangan (Persis Lembar Dokumen PDF)
Modul lembar kerja digital yang persis 1-ke-1 dengan dokumen resmi lampiran:
- **Header Profil Kebun & Pemilih Periode Bulan/Tahun:**
  - Periode: Bulan [Nama Bulan] / [Tahun]
  - Profil 4 Kotak: Nama Pemilik/Kebun, Luas Lahan (Ha/Pokok), Lokasi/Blok, RAM Pengumpul
- **Bagian 1: Dashboard Ringkasan Keuangan Kebun (Indikator Otomatis):**
  - Total Panen Netto (Kg) vs Target Bulanan
  - Total Pemasukan (Rp) Hasil Jual TBS ke Pengumpul
  - Total Pengeluaran (Rp) Upah + Pupuk + Perawatan + Langsir
  - Laba Bersih & HPP (Rp Laba, Rp HPP/Kg)
- **Bagian 2: Catatan Pemasukan Penjualan TBS (Arus Kas Masuk):**
  - Tabel: *Tanggal, Pengumpul / RAM, Bruto (Kg), Potongan (%), Netto (Kg), Harga (Rp/Kg), Total Diterima (Rp), Status (Lunas/Tempo), Aksi*
  - Perhitungan otomatis saat input:
    $$\text{Netto (Kg)} = \text{Bruto} \times \left(1 - \frac{\text{Potongan \%}}{100}\right)$$
    $$\text{Total Diterima (Rp)} = \text{Netto (Kg)} \times \text{Harga (Rp/Kg)}$$
  - Baris Akumulasi Otomatis: Total Bruto, Total Netto, Rata-rata Harga Jual/Kg, Total Uang Diterima
- **Bagian 3: Catatan Pengeluaran Biaya Perawatan & Panen (Arus Kas Keluar):**
  - Kategori Lengkap: *Pemupukan, Upah Perawatan (HK), Upah Panen & Langsir, Pestisida & Herbisida, Pruning/Tunas Pelepah, Pengadaan Alat, Biaya Lain-lain*
  - Baris Total Pengeluaran Bulan Ini
- **Kotak Catatan Rumus Pengelolaan Keuangan Kebun Sawit:**
  - **1. Keuntungan Bersih:** $\text{Total Pemasukan} - \text{Total Pengeluaran}$
  - **2. HPP (Harga Pokok Produksi):** $\frac{\text{Total Pengeluaran}}{\text{Total Kg Netto}}$
  - Kesimpulan cerdas dinamis:
    > *"Artinya, selama harga jual TBS di atas Rp [HPP]/kg, kebun Anda tetap untung!"*

---

### 3. 📈 Grafik Analisis & Simulator Sensitivitas Harga TBS
- **Metrik Produktivitas Lahan:**
  - Produktivitas per Hektar (Kg/Ha/Bulan)
  - Hasil Rata-rata per Pokok Sawit (Kg/Pokok/Bulan)
  - Margin Laba Bersih per Kg TBS (Harga Jual $-$ HPP)
- **Visualisasi Visual (Chart.js):**
  - Grafik Batang Arus Kas Masuk vs Keluar vs Laba
  - Grafik Donat Komposisi Biaya (Pemupukan vs Panen vs Perawatan)
- **Simulator Sensitivitas Harga TBS (Slider Interaktif):**
  - Geser slider simulasi harga (Rp 1.000 – Rp 4.000/Kg) untuk memproyeksikan keuntungan bersih jika harga TBS di pabrik/RAM naik atau turun.

---

### 4. 🖨️ Format Cetak Lembar Resmi & Ekspor
- **Pratinjau Cetak Lembar Dokumen:**
  - Format lembar A4 siap cetak yang 100% identik dengan PDF lampiran pengguna (`Buku Kas Kebun Sawit — Document Version 1.0`)
  - Tombol pintas **Cetak Dokumen / Simpan PDF (`Ctrl + P`)**
- **Ekspor Data ke Format CSV / Excel:**
  - Unduh rekapitulasi data panen dan biaya ke format spreadsheet `.csv`
- **Cadangkan & Pulihkan (Backup / Restore JSON):**
  - Amankan seluruh database ke file JSON lokal, dan pulihkan kapan saja.

---

## 🗂️ Struktur File Proyek

```text
PETANI SAWIT/
│
├── index.html                    # Antarmuka web utama (Tailwind CSS, Icons, Responsive)
├── app.js                        # Logika aplikasi, kalkulasi, Leaflet Map, Charts, CRUD
├── styles.css                    # Styling estetika & format print dokumen A4
├── server.js                     # Server backend HTTP mandiri Node.js
├── package.json                  # Konfigurasi npm
├── Buka_Aplikasi_Kebun_Sawit.bat # Launcher otomatis 1-klik di Windows
├── README.md                     # Dokumentasi panduan lengkap
└── data/
    └── keuangan_sawit.json       # Database lokal (multi-kebun, panen TBS, biaya)
```

---

*Disiapkan untuk Pengelolaan Kebun Sawit Rakyat Mandiri, Berkelanjutan & Menguntungkan.*
