/**
 * SI-KEBUN SAWIT - Server Aplikasi Lokal
 * Buku Kas & Logbook Keuangan Kebun Sawit Terpadu
 * 
 * Server mandiri (tanpa dependensi eksternal) menggunakan modul bawaan Node.js (http, fs, path).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'keuangan_sawit.json');

// Pastikan folder data dan file ada
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readDatabase() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Gagal membaca data/keuangan_sawit.json:', err.message);
  }
  return { active_kebun_id: null, kebun_list: [], penjualan_tbs: [], pengeluaran_biaya: [] };
}

function writeDatabase(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers jika dibuka dari origin lain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/data' && req.method === 'GET') {
    const data = readDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data }));
    return;
  }

  if (pathname === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        writeDatabase(payload);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'Data berhasil disimpan ke sistem!' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Format data tidak valid: ' + err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/backup' && req.method === 'GET') {
    const data = readDatabase();
    const dateStr = new Date().toISOString().slice(0, 10);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="backup_kebun_sawit_${dateStr}.json"`
    });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  // Serve Static Files
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  let safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback ke index.html untuk Single Page Application
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Terjadi kesalahan pada server saat memuat file: ' + readErr.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log('================================================================');
    console.log('   🌴 SISTEM INFORMASI & LOGBOOK KEUANGAN KEBUN SAWIT 🌴        ');
    console.log('   Buku Kas Penjualan TBS, Biaya Perawatan & Posisi Kas Kebun   ');
    console.log('================================================================');
    console.log(` ✅ Server berhasil berjalan di: http://localhost:${port}`);
    console.log(` 📂 File Database lokal: ${DATA_FILE}`);
    console.log(' Tekan Ctrl + C di terminal ini untuk menghentikan server.');
    console.log('================================================================');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} sedang dipakai, mencoba port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Gagal menjalankan server:', err);
    }
  });
}

startServer(DEFAULT_PORT);
