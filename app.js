/**
 * SI-KEBUN SAWIT - Logika Aplikasi & Sistem Terpadu
 * Buku Kas & Logbook Keuangan Kebun Sawit Terpadu
 */

// Initial Seed Data (Persis Dokumen PDF Lampiran)
const DEFAULT_DATABASE = {
  active_kebun_id: "kebun-1",
  kebun_list: [
    {
      id: "kebun-1",
      nama_kebun: "Kebun Sawit Berkah Mandiri",
      nama_pemilik: "H. Syamsudin",
      no_hp: "0812-7654-3210",
      nik: "1401021234560001",
      alamat_pemilik: "Jl. Poros Sawit No. 12, RT 03 / RW 02",
      luas_lahan_ha: 4.5,
      jumlah_pokok: 630,
      target_panen_ton: 6.0,
      varietas_bibit: "DxP Socfindo (Unggul Bersertifikat)",
      tahun_tanam: 2017,
      status_lahan: "SHM (Sertifikat Hak Milik)",
      lokasi_desa_blok: "Desa Makmur Jaya, Blok B3",
      kecamatan: "Tapung Hilir",
      kabupaten: "Kampar",
      provinsi: "Riau",
      koordinat_lat: 0.612450,
      koordinat_lng: 101.214560,
      pengumpul_utama: "RAM Makmur Jaya",
      kontak_ram: "0813-9876-5432 (H. Badrun)",
      kondisi_jalan: "Jalan Poros Aspal, Akses Pasar Pikul & TPH Padat Terawat",
      catatan_kebun: "Jarak tanam 9m x 9m segitiga sama sisi (140 pokok/Ha). Parit cacing lancar dan piringan bersih."
    },
    {
      id: "kebun-2",
      nama_kebun: "Kebun Sawit Sejahtera Blok C",
      nama_pemilik: "H. Syamsudin",
      no_hp: "0812-7654-3210",
      nik: "1401021234560001",
      alamat_pemilik: "Jl. Poros Sawit No. 12, RT 03 / RW 02",
      luas_lahan_ha: 3.0,
      jumlah_pokok: 420,
      target_panen_ton: 4.0,
      varietas_bibit: "Marihat",
      tahun_tanam: 2019,
      status_lahan: "SKT (Surat Keterangan Tanah)",
      lokasi_desa_blok: "Desa Rimba Beringin, Blok C2",
      kecamatan: "Tapung Hulu",
      kabupaten: "Kampar",
      provinsi: "Riau",
      koordinat_lat: 0.658200,
      koordinat_lng: 101.189400,
      pengumpul_utama: "RAM Berkah Sawit",
      kontak_ram: "0852-1122-3344 (Pak Joko)",
      kondisi_jalan: "Jalan Tanah Perkerasan Sirtu, Akses TPH Mudah",
      catatan_kebun: "Tanaman umur muda produktif, pemupukan organik dan NPK teratur."
    }
  ],
  penjualan_tbs: [
    {
      id: "p-1",
      kebun_id: "kebun-1",
      tgl: "2026-11-05",
      pengumpul_ram: "RAM Makmur Jaya",
      bruto_kg: 2500,
      pot_persen: 2.0,
      netto_kg: 2450,
      harga_rp: 2850,
      total_rp: 6982500,
      status: "Lunas",
      no_nota: "NOTA-0511/MJ",
      catatan: "Panen rotasi ke-1 November. Buah matang merah, brondolan segar."
    },
    {
      id: "p-2",
      kebun_id: "kebun-1",
      tgl: "2026-11-19",
      pengumpul_ram: "RAM Makmur Jaya",
      bruto_kg: 2650,
      pot_persen: 2.0,
      netto_kg: 2597,
      harga_rp: 2900,
      total_rp: 7531300,
      status: "Lunas",
      no_nota: "NOTA-1911/MJ",
      catatan: "Panen rotasi ke-2 November. Kualitas TBS grade A."
    }
  ],
  pengeluaran_biaya: [
    {
      id: "k-1",
      kebun_id: "kebun-1",
      tgl: "2026-11-01",
      kategori: "Pemupukan",
      rincian: "Beli 10 sak NPK Kujang @ Rp 440.000 + Transportasi",
      jumlah_rp: 4440000,
      keterangan: "Toko Tani",
      metode_bayar: "Transfer Bank"
    },
    {
      id: "k-2",
      kebun_id: "kebun-1",
      tgl: "2026-11-02",
      kategori: "Upah Perawatan",
      rincian: "Upah tabur pupuk 2 Orang (2 Hari Kerja / HK)",
      jumlah_rp: 300000,
      keterangan: "Tunai",
      metode_bayar: "Tunai"
    },
    {
      id: "k-3",
      kebun_id: "kebun-1",
      tgl: "2026-11-05",
      kategori: "Upah Panen & Langsir",
      rincian: "Ongkos pemanen & langsir motor 2.450 Kg @ Rp 250/Kg",
      jumlah_rp: 612500,
      keterangan: "Pemanen A",
      metode_bayar: "Tunai"
    },
    {
      id: "k-4",
      kebun_id: "kebun-1",
      tgl: "2026-11-19",
      kategori: "Upah Panen & Langsir",
      rincian: "Ongkos pemanen & langsir motor 2.597 Kg @ Rp 250/Kg",
      jumlah_rp: 649250,
      keterangan: "Pemanen A",
      metode_bayar: "Tunai"
    }
  ]
};

// Global App State
let appData = null;
let currentTab = 'halaman-muka';
let selectedBulan = 11;
let selectedTahun = 2026;

// Leaflet Map & Chart.js instances
let leafMap = null;
let leafMarker = null;
let chartArusKasInstance = null;
let chartKomposisiBiayaInstance = null;

const NAMA_BULAN = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Helper: Format Rupiah
function formatRp(val) {
  const num = Math.round(Number(val) || 0);
  return 'Rp ' + num.toLocaleString('id-ID');
}

function formatRpPlain(val) {
  const num = Math.round(Number(val) || 0);
  return num.toLocaleString('id-ID');
}

// Helper: Format Angka Ribuan
function formatNumber(val, decimals = 0) {
  const num = Number(val) || 0;
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Helper: Format Tanggal ke DD/MM
function formatTglShort(dateStr) {
  if (!dateStr) return "-";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

// Show Toast Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-800 text-white' : (type === 'error' ? 'bg-rose-800 text-white' : 'bg-slate-800 text-white');
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-info');

  toast.className = `${bg} px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-semibold pointer-events-auto transition transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// =========================================================================
// DATA PERSISTENCE & API SYNC
// =========================================================================

async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.kebun_list && json.data.kebun_list.length > 0) {
        appData = json.data;
        localStorage.setItem('si_kebun_sawit_db', JSON.stringify(appData));
        initApp();
        return;
      }
    }
  } catch (err) {
    console.log('Server API tidak terjangkau (dibuka offline/file://). Membaca LocalStorage...');
  }

  // Fallback to LocalStorage
  const localRaw = localStorage.getItem('si_kebun_sawit_db');
  if (localRaw) {
    try {
      appData = JSON.parse(localRaw);
      initApp();
      return;
    } catch (e) {
      console.error('Error parsing local storage:', e);
    }
  }

  // Fallback to Default Seed Data
  appData = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  localStorage.setItem('si_kebun_sawit_db', JSON.stringify(appData));
  initApp();
}

async function saveData() {
  if (!appData) return;
  localStorage.setItem('si_kebun_sawit_db', JSON.stringify(appData));

  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    const badge = document.getElementById('serverStatusBadge');
    if (badge) {
      badge.textContent = 'Tersimpan di Sistem & Server';
      badge.className = 'font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200';
    }
  } catch (err) {
    const badge = document.getElementById('serverStatusBadge');
    if (badge) {
      badge.textContent = 'Tersimpan di Browser (Offline)';
      badge.className = 'font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300';
    }
  }
}

// =========================================================================
// GETTERS & ACTIVE FARM LOGIC
// =========================================================================

function getActiveKebun() {
  if (!appData || !appData.kebun_list || appData.kebun_list.length === 0) {
    return null;
  }
  const found = appData.kebun_list.find(k => k.id === appData.active_kebun_id);
  return found || appData.kebun_list[0];
}

function getFilteredTransactions() {
  const kebun = getActiveKebun();
  if (!kebun) return { penjualan: [], pengeluaran: [] };

  const targetPrefix = `${selectedTahun}-${String(selectedBulan).padStart(2, '0')}`;

  const penjualan = (appData.penjualan_tbs || []).filter(item => {
    return item.kebun_id === kebun.id && item.tgl && item.tgl.startsWith(targetPrefix);
  }).sort((a, b) => a.tgl.localeCompare(b.tgl));

  const pengeluaran = (appData.pengeluaran_biaya || []).filter(item => {
    return item.kebun_id === kebun.id && item.tgl && item.tgl.startsWith(targetPrefix);
  }).sort((a, b) => a.tgl.localeCompare(b.tgl));

  return { penjualan, pengeluaran };
}

function calculateFinancials(penjualan, pengeluaran, kebun) {
  let totalBruto = 0;
  let totalNetto = 0;
  let totalPemasukan = 0;

  penjualan.forEach(item => {
    const bruto = Number(item.bruto_kg) || 0;
    const pot = Number(item.pot_persen) || 0;
    const netto = item.netto_kg !== undefined ? Number(item.netto_kg) : Math.round(bruto * (1 - pot / 100));
    const harga = Number(item.harga_rp) || 0;
    const total = item.total_rp !== undefined ? Number(item.total_rp) : Math.round(netto * harga);

    totalBruto += bruto;
    totalNetto += netto;
    totalPemasukan += total;
  });

  let totalPengeluaran = 0;
  pengeluaran.forEach(item => {
    totalPengeluaran += Number(item.jumlah_rp) || 0;
  });

  const labaBersih = totalPemasukan - totalPengeluaran;
  const hppPerKg = totalNetto > 0 ? (totalPengeluaran / totalNetto) : 0;
  const rataHargaPerKg = totalNetto > 0 ? (totalPemasukan / totalNetto) : 0;
  const marginPerKg = rataHargaPerKg - hppPerKg;

  const targetTon = Number(kebun.target_panen_ton) || 6.0;
  const targetKg = targetTon * 1000;
  const capaianPct = targetKg > 0 ? ((totalNetto / targetKg) * 100) : 0;

  const luasHa = Number(kebun.luas_lahan_ha) || 1;
  const pokok = Number(kebun.jumlah_pokok) || 1;

  const prodPerHa = totalNetto / luasHa;
  const prodPerPokok = totalNetto / pokok;

  return {
    totalBruto,
    totalNetto,
    totalPemasukan,
    totalPengeluaran,
    labaBersih,
    hppPerKg,
    rataHargaPerKg,
    marginPerKg,
    targetTon,
    capaianPct,
    prodPerHa,
    prodPerPokok
  };
}

// =========================================================================
// RENDERING FUNCTIONS
// =========================================================================

function renderApp() {
  const kebun = getActiveKebun();
  if (!kebun) return;

  const { penjualan, pengeluaran } = getFilteredTransactions();
  const fin = calculateFinancials(penjualan, pengeluaran, kebun);

  // 1. Populate Kebun Selector Dropdown
  const selKebun = document.getElementById('selectActiveKebun');
  if (selKebun) {
    selKebun.innerHTML = appData.kebun_list.map(k => `
      <option value="${k.id}" ${k.id === kebun.id ? 'selected' : ''}>
        ${k.nama_kebun} (${k.luas_lahan_ha} Ha)
      </option>
    `).join('');
  }

  // 2. Render Halaman Muka (Profil Kebun, Pemilik, & Lokasi)
  renderHalamanMuka(kebun, fin);

  // 3. Render Buku Kas & Logbook (Sesuai PDF)
  renderLogbook(kebun, penjualan, pengeluaran, fin);

  // 4. Render Analisis, Grafik, & Simulator HPP
  renderAnalisis(kebun, penjualan, pengeluaran, fin);

  // 5. Render Lembar Cetak Dokumen Resmi
  renderLembarCetak(kebun, penjualan, pengeluaran, fin);

  // 6. Update Peta Leaflet
  updateMapLocation(kebun);
}

function renderHalamanMuka(kebun, fin) {
  // Hero Banner
  document.getElementById('heroNamaKebun').textContent = kebun.nama_kebun;
  document.getElementById('heroNamaPemilik').textContent = kebun.nama_pemilik;
  document.getElementById('heroLokasiSingkat').textContent = `${kebun.lokasi_desa_blok}, ${kebun.kabupaten} - ${kebun.provinsi}`;

  // Kartu 1: Pemilik & Legalitas
  document.getElementById('pemilikNama').textContent = kebun.nama_pemilik;
  document.getElementById('pemilikHpText').textContent = kebun.no_hp || "-";
  const pemilikKontak = document.getElementById('pemilikKontak');
  if (kebun.no_hp) {
    const cleanHp = kebun.no_hp.replace(/[^0-9]/g, '');
    pemilikKontak.href = `https://wa.me/62${cleanHp.replace(/^0/, '')}`;
  } else {
    pemilikKontak.removeAttribute('href');
  }
  document.getElementById('pemilikNik').textContent = kebun.nik || "-";
  document.getElementById('pemilikAlamat').textContent = kebun.alamat_pemilik || "-";
  document.getElementById('pemilikStatusLahan').textContent = kebun.status_lahan || "SHM";
  document.getElementById('pemilikRAM').textContent = kebun.pengumpul_utama || "-";

  // Kartu 2: Data Teknis Kebun
  const currentYear = new Date().getFullYear();
  const umurSawit = kebun.tahun_tanam ? (currentYear - Number(kebun.tahun_tanam)) : 9;
  const statusFase = umurSawit < 4 ? "TBM (Tanaman Belum Menghasilkan)" : "TM (Tanaman Menghasilkan)";

  document.getElementById('badgeUmurSawit').textContent = `TM (${umurSawit} Thn)`;
  document.getElementById('kebunLuasVal').textContent = formatNumber(kebun.luas_lahan_ha, 1);
  document.getElementById('kebunPokokVal').textContent = formatNumber(kebun.jumlah_pokok);

  const sph = kebun.luas_lahan_ha > 0 ? Math.round(kebun.jumlah_pokok / kebun.luas_lahan_ha) : 140;
  document.getElementById('kebunSPH').textContent = `${sph} Pokok / Ha (${sph >= 135 && sph <= 145 ? 'Ideal' : 'Cukup'})`;
  document.getElementById('kebunBibit').textContent = kebun.varietas_bibit || "Unggul Bersertifikat";
  document.getElementById('kebunTahunTanam').textContent = `${kebun.tahun_tanam || 2017} (Umur ${umurSawit} Tahun)`;
  document.getElementById('kebunTargetPanen').textContent = `${formatNumber(kebun.target_panen_ton, 1)} Ton / Bulan`;
  document.getElementById('kebunKondisiJalan').textContent = kebun.kondisi_jalan || "Akses Jalan Padat Terawat";

  // Kartu 3: Lokasi & Titik GPS
  document.getElementById('lokasiAlamatLengkap').textContent = `${kebun.lokasi_desa_blok}, Kec. ${kebun.kecamatan}`;
  document.getElementById('lokasiKabProv').textContent = `${kebun.kabupaten}, ${kebun.provinsi}`;
  const lat = Number(kebun.koordinat_lat) || 0.612450;
  const lng = Number(kebun.koordinat_lng) || 101.214560;
  document.getElementById('lokasiKoordinatGPS').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  document.getElementById('btnBukaGoogleMaps').href = `https://www.google.com/maps?q=${lat},${lng}`;

  // Ringkasan Cepat Bulan Berjalan
  document.getElementById('ringkasanPeriodeLabel').textContent = `${NAMA_BULAN[selectedBulan]} ${selectedTahun}`;
  document.getElementById('kpiNettoKg').textContent = formatNumber(fin.totalNetto);
  document.getElementById('kpiTargetTon').textContent = formatNumber(fin.targetTon, 1);
  document.getElementById('kpiTargetPct').textContent = `${fin.capaianPct.toFixed(1)}%`;
  document.getElementById('kpiProgressBar').style.width = `${Math.min(fin.capaianPct, 100)}%`;

  document.getElementById('kpiPemasukanRp').textContent = formatRpPlain(fin.totalPemasukan);
  document.getElementById('kpiRataHargaRp').textContent = formatRp(fin.rataHargaPerKg);

  document.getElementById('kpiPengeluaranRp').textContent = formatRpPlain(fin.totalPengeluaran);

  document.getElementById('kpiLabaBersihRp').textContent = formatRpPlain(fin.labaBersih);
  document.getElementById('kpiHPPRp').textContent = formatRp(fin.hppPerKg);

  const kpiBadge = document.getElementById('kpiStatusBadge');
  const kpiNotice = document.getElementById('kpiHPPNotice');
  if (fin.labaBersih >= 0) {
    kpiBadge.textContent = 'UNTUNG';
    kpiBadge.className = 'bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase';
    kpiNotice.textContent = `✓ Harga jual di atas HPP (Margin: ${formatRp(fin.marginPerKg)}/Kg)`;
    kpiNotice.className = 'text-[11px] text-emerald-700 font-medium mt-1';
  } else {
    kpiBadge.textContent = 'PERHATIAN';
    kpiBadge.className = 'bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase';
    kpiNotice.textContent = `⚠ Pengeluaran melebihi pemasukan bulan ini`;
    kpiNotice.className = 'text-[11px] text-rose-700 font-medium mt-1';
  }

  // Render Multi-Kebun Grid
  renderMultiKebunGrid();
}

function renderMultiKebunGrid() {
  const container = document.getElementById('gridMultiKebun');
  if (!container) return;

  const activeId = appData.active_kebun_id;

  container.innerHTML = appData.kebun_list.map(k => {
    const isActive = k.id === activeId;
    return `
      <div class="border ${isActive ? 'border-sawit-700 bg-sawit-50/40 ring-2 ring-sawit-600/30' : 'border-slate-200 bg-white hover:border-slate-300'} rounded-xl p-4 transition flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-extrabold text-sm text-slate-900">${k.nama_kebun}</span>
            ${isActive ? '<span class="bg-sawit-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Aktif</span>' : ''}
          </div>
          <p class="text-xs text-slate-600 mb-2 flex items-center gap-1">
            <i class="fa-solid fa-location-dot text-rose-500 text-[10px]"></i> ${k.lokasi_desa_blok}
          </p>
          <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 mb-3">
            <div>
              <span class="text-slate-400 text-[10px]">Luas:</span>
              <p class="font-bold text-slate-800">${k.luas_lahan_ha} Ha</p>
            </div>
            <div>
              <span class="text-slate-400 text-[10px]">Jumlah Pokok:</span>
              <p class="font-bold text-slate-800">${k.jumlah_pokok} Pokok</p>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button onclick="setActiveKebun('${k.id}')" class="text-xs font-bold text-sawit-800 hover:text-sawit-900">
            ${isActive ? '✓ Sedang Dipilih' : 'Pilih Kebun Ini ➔'}
          </button>
          <button onclick="editSpecificKebun('${k.id}')" class="text-xs text-slate-400 hover:text-slate-700" title="Edit Kebun">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderLogbook(kebun, penjualan, pengeluaran, fin) {
  // Header Dokumen
  document.getElementById('docPeriodeText').textContent = `${NAMA_BULAN[selectedBulan]} ${selectedTahun}`;
  document.getElementById('docNamaPemilikDanKebun').textContent = `${kebun.nama_pemilik} / ${kebun.nama_kebun}`;
  document.getElementById('docLuasDanPokok').textContent = `${kebun.luas_lahan_ha} Ha (${kebun.jumlah_pokok} Pokok)`;
  document.getElementById('docLokasiBlok').textContent = kebun.lokasi_desa_blok;
  document.getElementById('docPengumpulRAM').textContent = kebun.pengumpul_utama;

  // 1. Dashboard Ringkasan Keuangan Kebun
  document.getElementById('docNettoKg').textContent = formatNumber(fin.totalNetto);
  document.getElementById('docTargetTon').textContent = formatNumber(fin.targetTon, 1);
  document.getElementById('docPemasukanRp').textContent = formatRpPlain(fin.totalPemasukan);
  document.getElementById('docPengeluaranRp').textContent = formatRpPlain(fin.totalPengeluaran);
  document.getElementById('docLabaBersihRp').textContent = formatRpPlain(fin.labaBersih);
  document.getElementById('docHPPRp').textContent = formatRp(fin.hppPerKg);

  // 2. Tabel Pemasukan Penjualan TBS
  const tbodyTBS = document.getElementById('tbodyPenjualanTBS');
  if (tbodyTBS) {
    if (penjualan.length === 0) {
      tbodyTBS.innerHTML = `
        <tr>
          <td colspan="9" class="py-6 text-center text-slate-400 italic">
            Belum ada catatan penjualan TBS pada bulan ini. Klik tombol "+ Tambah Transaksi TBS".
          </td>
        </tr>
      `;
    } else {
      tbodyTBS.innerHTML = penjualan.map(item => `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-3 text-center font-medium">${formatTglShort(item.tgl)}</td>
          <td class="py-3 px-3 font-semibold text-slate-800">${item.pengumpul_ram}</td>
          <td class="py-3 px-3 text-right font-mono-numbers">${formatNumber(item.bruto_kg)}</td>
          <td class="py-3 px-3 text-center">${item.pot_persen}%</td>
          <td class="py-3 px-3 text-right font-extrabold text-slate-900 font-mono-numbers">${formatNumber(item.netto_kg)}</td>
          <td class="py-3 px-3 text-right font-mono-numbers">${formatNumber(item.harga_rp)}</td>
          <td class="py-3 px-3 text-right font-extrabold text-emerald-800 font-mono-numbers">${formatRpPlain(item.total_rp)}</td>
          <td class="py-3 px-3 text-center">
            <span class="inline-block px-2 py-0.5 rounded text-[11px] font-bold ${item.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}">
              ${item.status || 'Lunas'}
            </span>
          </td>
          <td class="py-3 px-3 text-center no-print">
            <div class="flex items-center justify-center space-x-1.5">
              <button onclick="editPanen('${item.id}')" class="text-slate-400 hover:text-sawit-700 p-1" title="Edit">
                <i class="fa-solid fa-pen text-xs"></i>
              </button>
              <button onclick="deletePanen('${item.id}')" class="text-slate-400 hover:text-rose-600 p-1" title="Hapus">
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Tfoot Ringkasan TBS
    document.getElementById('tfootTotalBruto').textContent = formatNumber(fin.totalBruto);
    document.getElementById('tfootTotalNetto').textContent = formatNumber(fin.totalNetto);
    document.getElementById('tfootRataHarga').textContent = `Rata: ${formatNumber(fin.rataHargaPerKg)}`;
    document.getElementById('tfootTotalDiterima').textContent = formatRpPlain(fin.totalPemasukan);
  }

  // 3. Tabel Pengeluaran Biaya Kebun
  const tbodyBiaya = document.getElementById('tbodyPengeluaranBiaya');
  if (tbodyBiaya) {
    if (pengeluaran.length === 0) {
      tbodyBiaya.innerHTML = `
        <tr>
          <td colspan="6" class="py-6 text-center text-slate-400 italic">
            Belum ada catatan pengeluaran pada bulan ini. Klik tombol "+ Tambah Pengeluaran".
          </td>
        </tr>
      `;
    } else {
      tbodyBiaya.innerHTML = pengeluaran.map(item => {
        let badgeClass = 'badge-pemupukan';
        if (item.kategori.includes('Perawatan')) badgeClass = 'badge-perawatan';
        else if (item.kategori.includes('Panen') || item.kategori.includes('Langsir')) badgeClass = 'badge-panen';
        else if (item.kategori.includes('Herbisida') || item.kategori.includes('Pestisida')) badgeClass = 'badge-herbisida';
        else if (item.kategori.includes('Pruning') || item.kategori.includes('Pembersihan')) badgeClass = 'badge-pruning';
        else if (item.kategori.includes('Alat')) badgeClass = 'badge-alat';

        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="py-3 px-3 text-center font-medium">${formatTglShort(item.tgl)}</td>
            <td class="py-3 px-3">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}">
                ${item.kategori}
              </span>
            </td>
            <td class="py-3 px-3 text-slate-700">${item.rincian}</td>
            <td class="py-3 px-3 text-right font-extrabold text-rose-800 font-mono-numbers">${formatRpPlain(item.jumlah_rp)}</td>
            <td class="py-3 px-3 text-slate-600 font-medium">${item.keterangan || '-'}</td>
            <td class="py-3 px-3 text-center no-print">
              <div class="flex items-center justify-center space-x-1.5">
                <button onclick="editBiaya('${item.id}')" class="text-slate-400 hover:text-sawit-700 p-1" title="Edit">
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button onclick="deleteBiaya('${item.id}')" class="text-slate-400 hover:text-rose-600 p-1" title="Hapus">
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    document.getElementById('tfootTotalPengeluaran').textContent = formatRpPlain(fin.totalPengeluaran);
  }

  // Footer Rumus & Penjelasan
  document.getElementById('rumusKeuntunganDetail').textContent = `${formatRp(fin.totalPemasukan)} − ${formatRp(fin.totalPengeluaran)} = ${formatRp(fin.labaBersih)}`;
  document.getElementById('rumusHPPDetail').textContent = `${formatRp(fin.totalPengeluaran)} ÷ ${formatNumber(fin.totalNetto)} Kg = ${formatRp(fin.hppPerKg)} / Kg`;

  const kesimpulanEl = document.getElementById('kesimpulanHPPText');
  if (kesimpulanEl) {
    if (fin.hppPerKg > 0) {
      kesimpulanEl.textContent = `Artinya, selama harga jual TBS di atas ${formatRp(fin.hppPerKg)}/kg, kebun Anda tetap untung!`;
    } else {
      kesimpulanEl.textContent = `Belum ada panen tercatat pada periode ini.`;
    }
  }
}

function renderAnalisis(kebun, penjualan, pengeluaran, fin) {
  // Metrik Produksi
  document.getElementById('analisisProdHa').textContent = formatNumber(fin.prodPerHa, 0);
  document.getElementById('analisisProdPokok').textContent = formatNumber(fin.prodPerPokok, 2);
  document.getElementById('analisisMarginKg').textContent = formatRpPlain(fin.marginPerKg);
  const marginSub = document.getElementById('analisisMarginSub');
  if (marginSub) {
    marginSub.textContent = `Harga Jual (${formatRp(fin.rataHargaPerKg)}) − HPP (${formatRp(fin.hppPerKg)})`;
  }

  // Update Charts
  renderCharts(penjualan, pengeluaran, fin);

  // Update Simulator
  const defaultHarga = fin.rataHargaPerKg > 0 ? Math.round(fin.rataHargaPerKg) : 2875;
  const slider = document.getElementById('sliderSimulasiHarga');
  if (slider) {
    slider.value = defaultHarga;
    updateSimulasiHarga(defaultHarga);
  }
}

function renderCharts(penjualan, pengeluaran, fin) {
  // Chart 1: Arus Kas
  const ctxArus = document.getElementById('chartArusKas');
  if (ctxArus) {
    if (chartArusKasInstance) chartArusKasInstance.destroy();

    chartArusKasInstance = new Chart(ctxArus, {
      type: 'bar',
      data: {
        labels: ['Pemasukan TBS', 'Pengeluaran Biaya', 'Laba Bersih'],
        datasets: [{
          label: 'Total Rupiah (Rp)',
          data: [fin.totalPemasukan, fin.totalPengeluaran, Math.max(0, fin.labaBersih)],
          backgroundColor: [
            'rgba(34, 197, 94, 0.85)',
            'rgba(244, 63, 94, 0.85)',
            'rgba(245, 158, 11, 0.85)'
          ],
          borderColor: [
            '#16a34a',
            '#e11d48',
            '#d97706'
          ],
          borderWidth: 1.5,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => formatRp(context.parsed.y)
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => 'Rp ' + (val / 1000000).toFixed(1) + ' Jt'
            }
          }
        }
      }
    });
  }

  // Chart 2: Komposisi Biaya
  const ctxKomposisi = document.getElementById('chartKomposisiBiaya');
  if (ctxKomposisi) {
    if (chartKomposisiBiayaInstance) chartKomposisiBiayaInstance.destroy();

    // Grouping pengeluaran per kategori
    const catMap = {};
    pengeluaran.forEach(item => {
      const cat = item.kategori || 'Lain-lain';
      catMap[cat] = (catMap[cat] || 0) + (Number(item.jumlah_rp) || 0);
    });

    const labels = Object.keys(catMap);
    const dataValues = Object.values(catMap);

    const bgColors = [
      '#ef4444', '#6366f1', '#f59e0b', '#10b981', '#8b5cf6', '#64748b'
    ];

    chartKomposisiBiayaInstance = new Chart(ctxKomposisi, {
      type: 'doughnut',
      data: {
        labels: labels.length > 0 ? labels : ['Belum ada biaya'],
        datasets: [{
          data: dataValues.length > 0 ? dataValues : [1],
          backgroundColor: bgColors.slice(0, labels.length || 1),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.parsed;
                return ` ${context.label}: ${formatRp(val)}`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}

function updateSimulasiHarga(harga) {
  const hargaNum = Number(harga) || 2875;
  document.getElementById('sliderHargaLabel').textContent = formatRp(hargaNum);

  const kebun = getActiveKebun();
  const { penjualan, pengeluaran } = getFilteredTransactions();
  const fin = calculateFinancials(penjualan, pengeluaran, kebun);

  const estimasiNetto = fin.totalNetto > 0 ? fin.totalNetto : 5047;
  const estimasiPengeluaran = fin.totalPengeluaran;

  const totalProyeksiPemasukan = estimasiNetto * hargaNum;
  const proyeksiLaba = totalProyeksiPemasukan - estimasiPengeluaran;
  const marginPerKg = hargaNum - fin.hppPerKg;

  document.getElementById('simulasiNettoKg').textContent = `${formatNumber(estimasiNetto)} Kg`;
  document.getElementById('simulasiHPPRp').textContent = `${formatRp(fin.hppPerKg)} / Kg`;
  document.getElementById('simulasiPengeluaranRp').textContent = formatRp(estimasiPengeluaran);

  document.getElementById('simulasiHasilLabaRp').textContent = formatRp(proyeksiLaba);
  document.getElementById('simulasiMarginBadge').textContent = `Margin: ${marginPerKg >= 0 ? '+' : ''}${formatRp(marginPerKg)} / Kg`;

  const teksAnalisis = document.getElementById('simulasiAnalisisTeks');
  if (proyeksiLaba >= 0) {
    teksAnalisis.innerHTML = `Pada harga TBS <strong>${formatRp(hargaNum)}/Kg</strong>, Anda memperoleh keuntungan bersih sebesar <strong class="text-emerald-400">${formatRp(proyeksiLaba)}</strong> (Margin: <strong>${formatRp(marginPerKg)}/Kg</strong>).`;
  } else {
    teksAnalisis.innerHTML = `<span class="text-rose-400">Peringatan: Pada harga ini di bawah HPP kebun (${formatRp(fin.hppPerKg)}/Kg), kebun mengalami defisit ${formatRp(Math.abs(proyeksiLaba))}.</span>`;
  }
}

function renderLembarCetak(kebun, penjualan, pengeluaran, fin) {
  document.getElementById('printPeriodeText').textContent = `Bulan: ${NAMA_BULAN[selectedBulan]} / ${selectedTahun}`;
  document.getElementById('printNamaPemilik').textContent = `${kebun.nama_pemilik} / ${kebun.nama_kebun}`;
  document.getElementById('printLuasLahan').textContent = `${kebun.luas_lahan_ha} Ha (${kebun.jumlah_pokok} Pokok)`;
  document.getElementById('printLokasiBlok').textContent = kebun.lokasi_desa_blok;
  document.getElementById('printRAM').textContent = kebun.pengumpul_utama;

  document.getElementById('printNettoVal').textContent = `${formatNumber(fin.totalNetto)} Kg`;
  document.getElementById('printTargetVal').textContent = formatNumber(fin.targetTon, 1);
  document.getElementById('printPemasukanVal').textContent = formatRp(fin.totalPemasukan);
  document.getElementById('printPengeluaranVal').textContent = formatRp(fin.totalPengeluaran);
  document.getElementById('printLabaVal').textContent = formatRp(fin.labaBersih);
  document.getElementById('printHPPVal').textContent = formatRp(fin.hppPerKg);

  const printTbodyTBS = document.getElementById('printTbodyTBS');
  if (printTbodyTBS) {
    printTbodyTBS.innerHTML = penjualan.map(item => `
      <tr>
        <td class="p-1.5 border-r border-slate-300 text-center">${formatTglShort(item.tgl)}</td>
        <td class="p-1.5 border-r border-slate-300 font-semibold">${item.pengumpul_ram}</td>
        <td class="p-1.5 border-r border-slate-300 text-right font-mono">${formatNumber(item.bruto_kg)}</td>
        <td class="p-1.5 border-r border-slate-300 text-center">${item.pot_persen}%</td>
        <td class="p-1.5 border-r border-slate-300 text-right font-extrabold font-mono">${formatNumber(item.netto_kg)}</td>
        <td class="p-1.5 border-r border-slate-300 text-right font-mono">${formatNumber(item.harga_rp)}</td>
        <td class="p-1.5 border-r border-slate-300 text-right font-extrabold font-mono text-emerald-800">${formatRpPlain(item.total_rp)}</td>
        <td class="p-1.5 text-center">${item.status || 'Lunas'}</td>
      </tr>
    `).join('');
  }

  document.getElementById('printTotalBruto').textContent = formatNumber(fin.totalBruto);
  document.getElementById('printTotalNetto').textContent = formatNumber(fin.totalNetto);
  document.getElementById('printRataHarga').textContent = `Rata: ${formatNumber(fin.rataHargaPerKg)}`;
  document.getElementById('printTotalDiterima').textContent = formatRpPlain(fin.totalPemasukan);

  const printTbodyBiaya = document.getElementById('printTbodyBiaya');
  if (printTbodyBiaya) {
    printTbodyBiaya.innerHTML = pengeluaran.map(item => `
      <tr>
        <td class="p-1.5 border-r border-slate-300 text-center">${formatTglShort(item.tgl)}</td>
        <td class="p-1.5 border-r border-slate-300 font-semibold text-slate-800">${item.kategori}</td>
        <td class="p-1.5 border-r border-slate-300">${item.rincian}</td>
        <td class="p-1.5 border-r border-slate-300 text-right font-extrabold font-mono text-rose-800">${formatRpPlain(item.jumlah_rp)}</td>
        <td class="p-1.5">${item.keterangan || '-'}</td>
      </tr>
    `).join('');
  }

  document.getElementById('printTotalPengeluaran').textContent = formatRpPlain(fin.totalPengeluaran);

  document.getElementById('printRumusLaba').textContent = `${formatRp(fin.totalPemasukan)} − ${formatRp(fin.totalPengeluaran)} = ${formatRp(fin.labaBersih)}`;
  document.getElementById('printRumusHPP').textContent = `${formatRp(fin.totalPengeluaran)} ÷ ${formatNumber(fin.totalNetto)} Kg = ${formatRp(fin.hppPerKg)} / Kg`;
  document.getElementById('printKesimpulanHPP').textContent = `Artinya, selama harga jual TBS di atas ${formatRp(fin.hppPerKg)}/kg, kebun Anda tetap untung!`;
}

// =========================================================================
// LEAFLET MAP LOGIC
// =========================================================================

function initMap() {
  const mapEl = document.getElementById('mapKebun');
  if (!mapEl || leafMap) return;

  const kebun = getActiveKebun();
  const lat = kebun && kebun.koordinat_lat ? Number(kebun.koordinat_lat) : 0.612450;
  const lng = kebun && kebun.koordinat_lng ? Number(kebun.koordinat_lng) : 101.214560;

  try {
    leafMap = L.map('mapKebun', {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(leafMap);

    leafMarker = L.marker([lat, lng], { draggable: true }).addTo(leafMap);

    leafMarker.on('dragend', function (e) {
      const pos = e.target.getLatLng();
      if (kebun) {
        kebun.koordinat_lat = pos.lat;
        kebun.koordinat_lng = pos.lng;
        saveData();
        renderHalamanMuka(kebun, calculateFinancials([], [], kebun));
        showToast(`Koordinat GPS diperbarui: ${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`);
      }
    });

    leafMarker.bindPopup(`<b>${kebun ? kebun.nama_kebun : 'Kebun Sawit'}</b><br>${kebun ? kebun.lokasi_desa_blok : ''}`).openPopup();
  } catch (err) {
    console.warn('Gagal menginisialisasi Leaflet Map:', err);
  }
}

function updateMapLocation(kebun) {
  if (!leafMap || !leafMarker || !kebun) return;
  const lat = Number(kebun.koordinat_lat) || 0.612450;
  const lng = Number(kebun.koordinat_lng) || 101.214560;

  leafMap.setView([lat, lng], 14);
  leafMarker.setLatLng([lat, lng]);
  leafMarker.getPopup().setContent(`<b>${kebun.nama_kebun}</b><br>${kebun.lokasi_desa_blok}`);
}

function locateUserGPS() {
  if (navigator.geolocation) {
    showToast('Mencari sinyal GPS perangkat...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const kebun = getActiveKebun();
        if (kebun) {
          kebun.koordinat_lat = lat;
          kebun.koordinat_lng = lng;
          saveData();
          renderApp();
          showToast(`Lokasi GPS berhasil ditemukan: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
      },
      (err) => {
        showToast('Gagal mengakses GPS: ' + err.message, 'error');
      },
      { timeout: 10000 }
    );
  } else {
    showToast('Browser Anda tidak mendukung Geolocation GPS', 'error');
  }
}

// =========================================================================
// TAB SWITCHING
// =========================================================================

function switchTab(tabId) {
  currentTab = tabId;

  // Buttons state
  const tabs = ['halaman-muka', 'logbook', 'analisis', 'cetak'];
  const tabBtnMap = {
    'halaman-muka': 'navTabHalamanMuka',
    'logbook': 'navTabLogbook',
    'analisis': 'navTabAnalisis',
    'cetak': 'navTabCetak'
  };

  const contentMap = {
    'halaman-muka': 'tabContentHalamanMuka',
    'logbook': 'tabContentLogbook',
    'analisis': 'tabContentAnalisis',
    'cetak': 'tabContentCetak'
  };

  tabs.forEach(t => {
    const btn = document.getElementById(tabBtnMap[t]);
    const content = document.getElementById(contentMap[t]);

    if (t === tabId) {
      if (btn) btn.classList.add('active');
      if (content) content.classList.remove('hidden');
    } else {
      if (btn) btn.classList.remove('active');
      if (content) content.classList.add('hidden');
    }
  });

  // Re-render chart / map when opening specific tabs
  if (tabId === 'halaman-muka') {
    setTimeout(() => {
      if (leafMap) leafMap.invalidateSize();
    }, 200);
  } else if (tabId === 'analisis') {
    const kebun = getActiveKebun();
    const { penjualan, pengeluaran } = getFilteredTransactions();
    const fin = calculateFinancials(penjualan, pengeluaran, kebun);
    renderCharts(penjualan, pengeluaran, fin);
  }
}

// =========================================================================
// MULTI KEBUN SWITCHER
// =========================================================================

function setActiveKebun(kebunId) {
  appData.active_kebun_id = kebunId;
  saveData();
  renderApp();
  showToast('Kebun aktif berhasil dialihkan.');
}

// =========================================================================
// MODALS & CRUD OPERATIONS
// =========================================================================

// Modal Panen (TBS)
function openModalPanen(id = null) {
  const modal = document.getElementById('modalPanen');
  const title = document.getElementById('modalPanenTitle');
  const form = document.getElementById('formPanen');
  form.reset();

  const kebun = getActiveKebun();
  const defaultDate = `${selectedTahun}-${String(selectedBulan).padStart(2, '0')}-05`;

  if (id) {
    title.textContent = 'Edit Catatan Penjualan TBS';
    const item = (appData.penjualan_tbs || []).find(p => p.id === id);
    if (item) {
      document.getElementById('formPanenId').value = item.id;
      document.getElementById('inputPanenTgl').value = item.tgl;
      document.getElementById('inputPanenRAM').value = item.pengumpul_ram;
      document.getElementById('inputPanenBruto').value = item.bruto_kg;
      document.getElementById('inputPanenPot').value = item.pot_persen;
      document.getElementById('inputPanenHarga').value = item.harga_rp;
      document.getElementById('inputPanenStatus').value = item.status || 'Lunas';
      document.getElementById('inputPanenNota').value = item.no_nota || '';
      document.getElementById('inputPanenCatatan').value = item.catatan || '';
    }
  } else {
    title.textContent = 'Catat Penjualan TBS (RAM)';
    document.getElementById('formPanenId').value = '';
    document.getElementById('inputPanenTgl').value = defaultDate;
    document.getElementById('inputPanenRAM').value = kebun ? kebun.pengumpul_utama : 'RAM Makmur Jaya';
    document.getElementById('inputPanenBruto').value = '';
    document.getElementById('inputPanenPot').value = '2.0';
    document.getElementById('inputPanenHarga').value = '2850';
    document.getElementById('inputPanenStatus').value = 'Lunas';
  }

  calcPanenForm();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModalPanen() {
  const modal = document.getElementById('modalPanen');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function calcPanenForm() {
  const bruto = parseFloat(document.getElementById('inputPanenBruto').value) || 0;
  const pot = parseFloat(document.getElementById('inputPanenPot').value) || 0;
  const harga = parseFloat(document.getElementById('inputPanenHarga').value) || 0;

  const netto = Math.round(bruto * (1 - pot / 100));
  const total = Math.round(netto * harga);

  document.getElementById('inputPanenNettoPreview').value = formatNumber(netto) + ' Kg';
  document.getElementById('inputPanenTotalPreview').value = formatRp(total);
}

function savePanen(e) {
  e.preventDefault();
  const kebun = getActiveKebun();
  if (!kebun) return;

  const id = document.getElementById('formPanenId').value;
  const tgl = document.getElementById('inputPanenTgl').value;
  const pengumpul_ram = document.getElementById('inputPanenRAM').value;
  const bruto_kg = parseFloat(document.getElementById('inputPanenBruto').value) || 0;
  const pot_persen = parseFloat(document.getElementById('inputPanenPot').value) || 0;
  const harga_rp = parseFloat(document.getElementById('inputPanenHarga').value) || 0;
  const status = document.getElementById('inputPanenStatus').value;
  const no_nota = document.getElementById('inputPanenNota').value;
  const catatan = document.getElementById('inputPanenCatatan').value;

  const netto_kg = Math.round(bruto_kg * (1 - pot_persen / 100));
  const total_rp = Math.round(netto_kg * harga_rp);

  if (!appData.penjualan_tbs) appData.penjualan_tbs = [];

  if (id) {
    const idx = appData.penjualan_tbs.findIndex(p => p.id === id);
    if (idx !== -1) {
      appData.penjualan_tbs[idx] = {
        ...appData.penjualan_tbs[idx],
        tgl, pengumpul_ram, bruto_kg, pot_persen, netto_kg, harga_rp, total_rp, status, no_nota, catatan
      };
      showToast('Transaksi TBS berhasil diperbarui.');
    }
  } else {
    const newId = 'p-' + Date.now();
    appData.penjualan_tbs.push({
      id: newId,
      kebun_id: kebun.id,
      tgl, pengumpul_ram, bruto_kg, pot_persen, netto_kg, harga_rp, total_rp, status, no_nota, catatan
    });
    showToast('Transaksi TBS baru berhasil ditambahkan.');
  }

  saveData();
  closeModalPanen();
  renderApp();
}

function editPanen(id) {
  openModalPanen(id);
}

function deletePanen(id) {
  if (confirm('Yakin ingin menghapus catatan penjualan TBS ini?')) {
    appData.penjualan_tbs = (appData.penjualan_tbs || []).filter(p => p.id !== id);
    saveData();
    renderApp();
    showToast('Catatan penjualan berhasil dihapus.');
  }
}

// Modal Biaya (Pengeluaran)
function openModalBiaya(id = null) {
  const modal = document.getElementById('modalBiaya');
  const title = document.getElementById('modalBiayaTitle');
  const form = document.getElementById('formBiaya');
  form.reset();

  const defaultDate = `${selectedTahun}-${String(selectedBulan).padStart(2, '0')}-01`;

  if (id) {
    title.textContent = 'Edit Pengeluaran Biaya Kebun';
    const item = (appData.pengeluaran_biaya || []).find(k => k.id === id);
    if (item) {
      document.getElementById('formBiayaId').value = item.id;
      document.getElementById('inputBiayaTgl').value = item.tgl;
      document.getElementById('inputBiayaKategori').value = item.kategori;
      document.getElementById('inputBiayaRincian').value = item.rincian;
      document.getElementById('inputBiayaJumlah').value = item.jumlah_rp;
      document.getElementById('inputBiayaKeterangan').value = item.keterangan;
      document.getElementById('inputBiayaMetode').value = item.metode_bayar || 'Tunai';
    }
  } else {
    title.textContent = 'Catat Pengeluaran Biaya Kebun';
    document.getElementById('formBiayaId').value = '';
    document.getElementById('inputBiayaTgl').value = defaultDate;
    document.getElementById('inputBiayaKategori').value = 'Pemupukan';
    document.getElementById('inputBiayaJumlah').value = '';
    document.getElementById('inputBiayaKeterangan').value = 'Toko Tani';
    document.getElementById('inputBiayaMetode').value = 'Tunai';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModalBiaya() {
  const modal = document.getElementById('modalBiaya');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function saveBiaya(e) {
  e.preventDefault();
  const kebun = getActiveKebun();
  if (!kebun) return;

  const id = document.getElementById('formBiayaId').value;
  const tgl = document.getElementById('inputBiayaTgl').value;
  const kategori = document.getElementById('inputBiayaKategori').value;
  const rincian = document.getElementById('inputBiayaRincian').value;
  const jumlah_rp = parseFloat(document.getElementById('inputBiayaJumlah').value) || 0;
  const keterangan = document.getElementById('inputBiayaKeterangan').value;
  const metode_bayar = document.getElementById('inputBiayaMetode').value;

  if (!appData.pengeluaran_biaya) appData.pengeluaran_biaya = [];

  if (id) {
    const idx = appData.pengeluaran_biaya.findIndex(k => k.id === id);
    if (idx !== -1) {
      appData.pengeluaran_biaya[idx] = {
        ...appData.pengeluaran_biaya[idx],
        tgl, kategori, rincian, jumlah_rp, keterangan, metode_bayar
      };
      showToast('Biaya kebun berhasil diperbarui.');
    }
  } else {
    const newId = 'k-' + Date.now();
    appData.pengeluaran_biaya.push({
      id: newId,
      kebun_id: kebun.id,
      tgl, kategori, rincian, jumlah_rp, keterangan, metode_bayar
    });
    showToast('Pengeluaran baru berhasil ditambahkan.');
  }

  saveData();
  closeModalBiaya();
  renderApp();
}

function editBiaya(id) {
  openModalBiaya(id);
}

function deleteBiaya(id) {
  if (confirm('Yakin ingin menghapus catatan pengeluaran ini?')) {
    appData.pengeluaran_biaya = (appData.pengeluaran_biaya || []).filter(k => k.id !== id);
    saveData();
    renderApp();
    showToast('Catatan pengeluaran berhasil dihapus.');
  }
}

// Modal Kebun & Pemilik
function openModalEditKebun() {
  const kebun = getActiveKebun();
  if (!kebun) return;
  editSpecificKebun(kebun.id);
}

function editSpecificKebun(kebunId) {
  const kebun = appData.kebun_list.find(k => k.id === kebunId);
  if (!kebun) return;

  const modal = document.getElementById('modalKebun');
  document.getElementById('modalKebunTitle').textContent = 'Edit Profil Kebun & Pemilik';
  document.getElementById('formKebunId').value = kebun.id;

  // Pemilik
  document.getElementById('inputKebunNamaPemilik').value = kebun.nama_pemilik || '';
  document.getElementById('inputKebunNoHP').value = kebun.no_hp || '';
  document.getElementById('inputKebunNIK').value = kebun.nik || '';
  document.getElementById('inputKebunAlamatPemilik').value = kebun.alamat_pemilik || '';

  // Kebun
  document.getElementById('inputKebunNama').value = kebun.nama_kebun || '';
  document.getElementById('inputKebunStatusLahan').value = kebun.status_lahan || 'SHM (Sertifikat Hak Milik)';
  document.getElementById('inputKebunLuas').value = kebun.luas_lahan_ha || '';
  document.getElementById('inputKebunPokok').value = kebun.jumlah_pokok || '';
  document.getElementById('inputKebunTarget').value = kebun.target_panen_ton || '';
  document.getElementById('inputKebunVarietas').value = kebun.varietas_bibit || '';
  document.getElementById('inputKebunTahunTanam').value = kebun.tahun_tanam || '';
  document.getElementById('inputKebunRAM').value = kebun.pengumpul_utama || '';

  // Lokasi
  document.getElementById('inputKebunLokasiBlok').value = kebun.lokasi_desa_blok || '';
  document.getElementById('inputKebunKecamatan').value = kebun.kecamatan || '';
  document.getElementById('inputKebunKabupaten').value = kebun.kabupaten || '';
  document.getElementById('inputKebunProvinsi').value = kebun.provinsi || '';
  document.getElementById('inputKebunLat').value = kebun.koordinat_lat || '';
  document.getElementById('inputKebunLng').value = kebun.koordinat_lng || '';

  const btnHapus = document.getElementById('btnHapusKebun');
  btnHapus.style.display = appData.kebun_list.length > 1 ? 'block' : 'none';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function openModalTambahKebun() {
  const modal = document.getElementById('modalKebun');
  document.getElementById('modalKebunTitle').textContent = 'Tambah Kebun / Blok Baru';
  document.getElementById('formKebun').reset();
  document.getElementById('formKebunId').value = '';

  const active = getActiveKebun();
  if (active) {
    document.getElementById('inputKebunNamaPemilik').value = active.nama_pemilik;
    document.getElementById('inputKebunNoHP').value = active.no_hp;
    document.getElementById('inputKebunNIK').value = active.nik;
    document.getElementById('inputKebunAlamatPemilik').value = active.alamat_pemilik;
    document.getElementById('inputKebunRAM').value = active.pengumpul_utama;
    document.getElementById('inputKebunKecamatan').value = active.kecamatan;
    document.getElementById('inputKebunKabupaten').value = active.kabupaten;
    document.getElementById('inputKebunProvinsi').value = active.provinsi;
    document.getElementById('inputKebunLat').value = active.koordinat_lat;
    document.getElementById('inputKebunLng').value = active.koordinat_lng;
  }

  document.getElementById('btnHapusKebun').style.display = 'none';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModalKebun() {
  const modal = document.getElementById('modalKebun');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function saveKebun(e) {
  e.preventDefault();
  const id = document.getElementById('formKebunId').value;

  const kebunPayload = {
    nama_pemilik: document.getElementById('inputKebunNamaPemilik').value,
    no_hp: document.getElementById('inputKebunNoHP').value,
    nik: document.getElementById('inputKebunNIK').value,
    alamat_pemilik: document.getElementById('inputKebunAlamatPemilik').value,

    nama_kebun: document.getElementById('inputKebunNama').value,
    status_lahan: document.getElementById('inputKebunStatusLahan').value,
    luas_lahan_ha: parseFloat(document.getElementById('inputKebunLuas').value) || 0,
    jumlah_pokok: parseInt(document.getElementById('inputKebunPokok').value) || 0,
    target_panen_ton: parseFloat(document.getElementById('inputKebunTarget').value) || 0,
    varietas_bibit: document.getElementById('inputKebunVarietas').value,
    tahun_tanam: parseInt(document.getElementById('inputKebunTahunTanam').value) || 2017,
    pengumpul_utama: document.getElementById('inputKebunRAM').value,

    lokasi_desa_blok: document.getElementById('inputKebunLokasiBlok').value,
    kecamatan: document.getElementById('inputKebunKecamatan').value,
    kabupaten: document.getElementById('inputKebunKabupaten').value,
    provinsi: document.getElementById('inputKebunProvinsi').value,
    koordinat_lat: parseFloat(document.getElementById('inputKebunLat').value) || 0.612450,
    koordinat_lng: parseFloat(document.getElementById('inputKebunLng').value) || 101.214560
  };

  if (id) {
    const idx = appData.kebun_list.findIndex(k => k.id === id);
    if (idx !== -1) {
      appData.kebun_list[idx] = { ...appData.kebun_list[idx], ...kebunPayload };
      showToast('Data kebun berhasil disimpan.');
    }
  } else {
    const newId = 'kebun-' + Date.now();
    const newKebun = { id: newId, ...kebunPayload };
    appData.kebun_list.push(newKebun);
    appData.active_kebun_id = newId;
    showToast('Kebun baru berhasil didaftarkan ke sistem.');
  }

  saveData();
  closeModalKebun();
  renderApp();
}

function deleteActiveKebun() {
  const id = document.getElementById('formKebunId').value;
  if (!id) return;

  if (appData.kebun_list.length <= 1) {
    alert('Tidak dapat menghapus kebun utama satu-satunya.');
    return;
  }

  if (confirm('Yakin ingin menghapus kebun ini dan semua data terkait?')) {
    appData.kebun_list = appData.kebun_list.filter(k => k.id !== id);
    appData.penjualan_tbs = (appData.penjualan_tbs || []).filter(p => p.kebun_id !== id);
    appData.pengeluaran_biaya = (appData.pengeluaran_biaya || []).filter(k => k.kebun_id !== id);

    appData.active_kebun_id = appData.kebun_list[0].id;
    saveData();
    closeModalKebun();
    renderApp();
    showToast('Kebun berhasil dihapus.');
  }
}

// Backup & Restore
function openModalBackup() {
  const modal = document.getElementById('modalBackup');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModalBackup() {
  const modal = document.getElementById('modalBackup');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function downloadBackupJSON() {
  const jsonStr = JSON.stringify(appData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `backup_kebun_sawit_${d}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('File cadangan JSON berhasil diunduh.');
}

function restoreFromJSON() {
  const fileInput = document.getElementById('fileRestore');
  if (!fileInput.files || fileInput.files.length === 0) {
    alert('Silakan pilih file backup .json terlebih dahulu.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.kebun_list) {
        appData = data;
        saveData();
        closeModalBackup();
        renderApp();
        showToast('Database berhasil dipulihkan dari file backup!');
      } else {
        alert('Format file JSON tidak sesuai dengan sistem Kebun Sawit.');
      }
    } catch (err) {
      alert('Gagal membaca file JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetToDefaultData() {
  if (confirm('Yakin ingin mereset data ke contoh awal sesuai dokumen PDF? Semua perubahan baru akan ditimpa.')) {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    saveData();
    closeModalBackup();
    renderApp();
    showToast('Data berhasil di-reset ke data bawaan dokumen.');
  }
}

// Export CSV
function exportToCSV() {
  const kebun = getActiveKebun();
  const { penjualan, pengeluaran } = getFilteredTransactions();
  const fin = calculateFinancials(penjualan, pengeluaran, kebun);

  let csv = `BUKU KAS & LOGBOOK KEUANGAN KEBUN SAWIT\n`;
  csv += `Periode,${NAMA_BULAN[selectedBulan]} ${selectedTahun}\n`;
  csv += `Pemilik,${kebun.nama_pemilik}\n`;
  csv += `Kebun,${kebun.nama_kebun}\n`;
  csv += `Luas Lahan,${kebun.luas_lahan_ha} Ha (${kebun.jumlah_pokok} Pokok)\n`;
  csv += `Lokasi,${kebun.lokasi_desa_blok}\n`;
  csv += `Pengumpul,${kebun.pengumpul_utama}\n\n`;

  csv += `1. RINGKASAN KEUANGAN\n`;
  csv += `Total Panen Netto (Kg),${fin.totalNetto}\n`;
  csv += `Target Panen (Ton),${fin.targetTon}\n`;
  csv += `Total Pemasukan (Rp),${fin.totalPemasukan}\n`;
  csv += `Total Pengeluaran (Rp),${fin.totalPengeluaran}\n`;
  csv += `Laba Bersih (Rp),${fin.labaBersih}\n`;
  csv += `HPP (Rp/Kg),${Math.round(fin.hppPerKg)}\n\n`;

  csv += `2. PENJUALAN TBS (ARUS KAS MASUK)\n`;
  csv += `Tanggal,Pengumpul / RAM,Bruto (Kg),Potongan (%),Netto (Kg),Harga (Rp/Kg),Total (Rp),Status,Nota\n`;
  penjualan.forEach(p => {
    csv += `${p.tgl},"${p.pengumpul_ram}",${p.bruto_kg},${p.pot_persen}%,${p.netto_kg},${p.harga_rp},${p.total_rp},"${p.status}","${p.no_nota || ''}"\n`;
  });
  csv += `TOTAL BULAN INI,,${fin.totalBruto},-,${fin.totalNetto},${Math.round(fin.rataHargaPerKg)},${fin.totalPemasukan},,\n\n`;

  csv += `3. PENGELUARAN BIAYA PERAWATAN & PANEN (ARUS KAS KELUAR)\n`;
  csv += `Tanggal,Kategori,Keterangan Rinci,Jumlah Biaya (Rp),Keterangan\n`;
  pengeluaran.forEach(k => {
    csv += `${k.tgl},"${k.kategori}","${k.rincian.replace(/"/g, '""')}",${k.jumlah_rp},"${k.keterangan || ''}"\n`;
  });
  csv += `TOTAL PENGELUARAN BULAN INI,,,${fin.totalPengeluaran},\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Logbook_Sawit_${kebun.nama_kebun.replace(/\s+/g, '_')}_${selectedTahun}_${selectedBulan}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Laporan CSV berhasil diekspor.');
}

// =========================================================================
// APP INITIALIZATION
// =========================================================================

function initApp() {
  // Bind Selectors
  const selKebun = document.getElementById('selectActiveKebun');
  if (selKebun) {
    selKebun.addEventListener('change', (e) => {
      setActiveKebun(e.target.value);
    });
  }

  const selBulan = document.getElementById('filterBulan');
  if (selBulan) {
    selBulan.value = selectedBulan;
    selBulan.addEventListener('change', (e) => {
      selectedBulan = parseInt(e.target.value);
      renderApp();
    });
  }

  const selTahun = document.getElementById('filterTahun');
  if (selTahun) {
    selTahun.value = selectedTahun;
    selTahun.addEventListener('change', (e) => {
      selectedTahun = parseInt(e.target.value);
      renderApp();
    });
  }

  // Initialize Map
  setTimeout(initMap, 200);

  // Initial Render
  renderApp();
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  loadData();
});
