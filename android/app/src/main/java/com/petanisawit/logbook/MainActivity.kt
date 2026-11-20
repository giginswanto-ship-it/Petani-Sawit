package com.petanisawit.logbook

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.textfield.TextInputEditText
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale

/**
 * SI-KEBUN SAWIT - MainActivity
 * Sistem Pencatatan Penjualan TBS, Biaya Perawatan Kebun & Posisi Kas Mandiri
 * Standar Desain Android: Satuan dp & sp, NestedScrollView, Layout Adaptif, Keterbacaan Tinggi
 */
class MainActivity : AppCompatActivity() {

    // Data Model Sederhana
    data class PenjualanTBS(
        val tgl: String,
        val pengumpul: String,
        val brutoKg: Double,
        val potPersen: Double,
        val nettoKg: Double,
        val hargaRp: Double,
        val totalRp: Double,
        val status: String = "Lunas"
    )

    data class PengeluaranBiaya(
        val tgl: String,
        val kategori: String,
        val rincian: String,
        val jumlahRp: Double,
        val keterangan: String
    )

    // Data State (Inisialisasi Sesuai Dokumen Lampiran PDF Periode November 2026)
    private val listPenjualan = mutableListOf(
        PenjualanTBS("05/11", "RAM Makmur Jaya", 2500.0, 2.0, 2450.0, 2850.0, 6982500.0, "Lunas"),
        PenjualanTBS("19/11", "RAM Makmur Jaya", 2650.0, 2.0, 2597.0, 2900.0, 7531300.0, "Lunas")
    )

    private val listPengeluaran = mutableListOf(
        PengeluaranBiaya("01/11", "Pemupukan", "Beli 10 sak NPK Kujang @ Rp 440.000 + Transportasi", 4440000.0, "Toko Tani"),
        PengeluaranBiaya("02/11", "Upah Perawatan", "Upah tabur pupuk 2 Orang (2 Hari Kerja / HK)", 300000.0, "Tunai"),
        PengeluaranBiaya("05/11", "Upah Panen & Langsir", "Ongkos pemanen & langsir motor 2.450 Kg @ Rp 250/Kg", 612500.0, "Pemanen A"),
        PengeluaranBiaya("19/11", "Upah Panen & Langsir", "Ongkos pemanen & langsir motor 2.597 Kg @ Rp 250/Kg", 649250.0, "Pemanen A")
    )

    // UI View References
    private lateinit var tvTotalPanenNetto: TextView
    private lateinit var tvTotalPemasukan: TextView
    private lateinit var tvTotalPengeluaran: TextView
    private lateinit var tvLabaBersih: TextView
    private lateinit var tvHppPerKg: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()
        calculateAndRenderDashboard()
        setupListeners()
    }

    private fun initViews() {
        tvTotalPanenNetto = findViewById(R.id.tvTotalPanenNetto)
        tvTotalPemasukan = findViewById(R.id.tvTotalPemasukan)
        tvTotalPengeluaran = findViewById(R.id.tvTotalPengeluaran)
        tvLabaBersih = findViewById(R.id.tvLabaBersih)
        tvHppPerKg = findViewById(R.id.tvHppPerKg)
    }

    private fun setupListeners() {
        findViewById<ExtendedFloatingActionButton>(R.id.fabJualTBS).setOnClickListener {
            showDialogInputPanen()
        }

        findViewById<FloatingActionButton>(R.id.fabCatatBiaya).setOnClickListener {
            showDialogInputBiaya()
        }

        findViewById<MaterialButton>(R.id.btnEditProfilKebun).setOnClickListener {
            Toast.makeText(this, "Fitur ubah profil kebun & koordinat GPS siap digunakan", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Menghitung & Memperbarui Seluruh Nilai Dashboard Finansial Secara Otomatis
     */
    private fun calculateAndRenderDashboard() {
        val totalNetto = listPenjualan.sumOf { it.nettoKg }
        val totalPemasukan = listPenjualan.sumOf { it.totalRp }
        val totalPengeluaran = listPengeluaran.sumOf { it.jumlahRp }
        val labaBersih = totalPemasukan - totalPengeluaran
        val hppPerKg = if (totalNetto > 0) totalPengeluaran / totalNetto else 0.0

        tvTotalPanenNetto.text = "${formatAngka(totalNetto)} Kg"
        tvTotalPemasukan.text = formatRupiah(totalPemasukan)
        tvTotalPengeluaran.text = formatRupiah(totalPengeluaran)
        tvLabaBersih.text = formatRupiah(labaBersih)

        val status = if (labaBersih >= 0) "UNTUNG" else "DEFISIT"
        tvHppPerKg.text = "HPP: ${formatRupiah(hppPerKg)}/Kg ($status)"
    }

    /**
     * Dialog Input TBS (Arus Kas Masuk) - Dibungkus ScrollView & Touch Target >= 48dp
     */
    private fun showDialogInputPanen() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_input_panen, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .setCancelable(true)
            .create()

        val etTgl = dialogView.findViewById<TextInputEditText>(R.id.etTglPanen)
        val etRAM = dialogView.findViewById<TextInputEditText>(R.id.etNamaRAM)
        val etBruto = dialogView.findViewById<TextInputEditText>(R.id.etBrutoKg)
        val etPot = dialogView.findViewById<TextInputEditText>(R.id.etPotPersen)
        val etHarga = dialogView.findViewById<TextInputEditText>(R.id.etHargaKg)

        val tvPreviewNetto = dialogView.findViewById<TextView>(R.id.tvPreviewNetto)
        val tvPreviewTotal = dialogView.findViewById<TextView>(R.id.tvPreviewTotalDiterima)

        etTgl.setText("2026-11-20")
        etRAM.setText("RAM Makmur Jaya")
        etPot.setText("2.0")

        // Kalkulasi Live Otomatis Saat Mengetik
        val watcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val bruto = etBruto.text.toString().toDoubleOrNull() ?: 0.0
                val pot = etPot.text.toString().toDoubleOrNull() ?: 0.0
                val harga = etHarga.text.toString().toDoubleOrNull() ?: 0.0

                val netto = bruto * (1.0 - (pot / 100.0))
                val total = netto * harga

                tvPreviewNetto.text = "Netto Otomatis: ${formatAngka(netto)} Kg"
                tvPreviewTotal.text = "Total Diterima: ${formatRupiah(total)}"
            }
            override fun afterTextChanged(s: Editable?) {}
        }

        etBruto.addTextChangedListener(watcher)
        etPot.addTextChangedListener(watcher)
        etHarga.addTextChangedListener(watcher)

        dialogView.findViewById<MaterialButton>(R.id.btnBatalPanen).setOnClickListener {
            dialog.dismiss()
        }

        dialogView.findViewById<MaterialButton>(R.id.btnSimpanPanen).setOnClickListener {
            val bruto = etBruto.text.toString().toDoubleOrNull() ?: 0.0
            val pot = etPot.text.toString().toDoubleOrNull() ?: 0.0
            val harga = etHarga.text.toString().toDoubleOrNull() ?: 0.0

            if (bruto <= 0 || harga <= 0) {
                Toast.makeText(this, "Silakan isi berat bruto dan harga satuan TBS", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val netto = bruto * (1.0 - (pot / 100.0))
            val total = netto * harga

            listPenjualan.add(
                PenjualanTBS(
                    tgl = etTgl.text.toString(),
                    pengumpul = etRAM.text.toString().ifEmpty { "RAM Utama" },
                    brutoKg = bruto,
                    potPersen = pot,
                    nettoKg = netto,
                    hargaRp = harga,
                    totalRp = total
                )
            )

            calculateAndRenderDashboard()
            dialog.dismiss()
            Toast.makeText(this, "Penjualan TBS berhasil disimpan!", Toast.LENGTH_SHORT).show()
        }

        dialog.show()
    }

    /**
     * Dialog Input Pengeluaran Biaya Kebun (Arus Kas Keluar)
     */
    private fun showDialogInputBiaya() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_input_biaya, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .setCancelable(true)
            .create()

        val etTgl = dialogView.findViewById<TextInputEditText>(R.id.etTglBiaya)
        val etRincian = dialogView.findViewById<TextInputEditText>(R.id.etRincianBiaya)
        val etJumlah = dialogView.findViewById<TextInputEditText>(R.id.etJumlahBiaya)
        val etPenerima = dialogView.findViewById<TextInputEditText>(R.id.etPenerimaBiaya)

        etTgl.setText("2026-11-20")

        dialogView.findViewById<MaterialButton>(R.id.btnBatalBiaya).setOnClickListener {
            dialog.dismiss()
        }

        dialogView.findViewById<MaterialButton>(R.id.btnSimpanBiaya).setOnClickListener {
            val jumlah = etJumlah.text.toString().toDoubleOrNull() ?: 0.0
            val rincian = etRincian.text.toString().trim()

            if (jumlah <= 0 || rincian.isEmpty()) {
                Toast.makeText(this, "Silakan isi rincian dan jumlah biaya pengeluaran", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            listPengeluaran.add(
                PengeluaranBiaya(
                    tgl = etTgl.text.toString(),
                    kategori = "Pemupukan",
                    rincian = rincian,
                    jumlahRp = jumlah,
                    keterangan = etPenerima.text.toString().ifEmpty { "Tunai" }
                )
            )

            calculateAndRenderDashboard()
            dialog.dismiss()
            Toast.makeText(this, "Pengeluaran kebun berhasil dicatat!", Toast.LENGTH_SHORT).show()
        }

        dialog.show()
    }

    // Helper Format Rupiah & Angka Desimal Indonesia
    private fun formatRupiah(nominal: Double): String {
        val format = DecimalFormat("#,###", DecimalFormatSymbols(Locale("id", "ID")))
        return "Rp " + format.format(nominal.toLong())
    }

    private fun formatAngka(angka: Double): String {
        val format = DecimalFormat("#,###.##", DecimalFormatSymbols(Locale("id", "ID")))
        return format.format(angka)
    }
}
