# B-Silsilah

B-Silsilah adalah aplikasi berbasis web yang dirancang untuk mempermudah Anda dalam membuat, mengelola, dan memvisualisasikan silsilah keluarga secara interaktif.

## Fitur Utama

- **Visualisasi Interaktif**: Menampilkan silsilah keluarga dalam bentuk bagan interaktif (menggunakan React Flow & Dagre).
- **Multi-Silsilah**: Mendukung pembuatan banyak silsilah yang berbeda dalam satu akun pengguna.
- **Drag & Drop Layout**: Anda dapat mengubah tata letak posisi anggota keluarga dengan mudah, dan posisi tersebut akan tersimpan secara otomatis ke database.
- **Manajemen Relasi Lengkap**: Mendukung penambahan berbagai jenis relasi seperti Orang Tua, Anak, dan Pasangan.
- **Sistem Autentikasi**: Fitur pendaftaran dan login pengguna yang aman menggunakan JWT.

## Teknologi yang Digunakan

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Flow (untuk visualisasi kanvas interaktif)
- Dagre (untuk algoritma *auto-layout*)
- React Router DOM
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- JWT (JSON Web Token) untuk Autentikasi

## Cara Menjalankan Secara Lokal

1. **Install dependensi**
   - Buka terminal untuk direktori *backend*: `cd server && npm install`
   - Buka terminal untuk direktori *frontend*: `npm install`

2. **Konfigurasi Environment Variable (.env)**
   - Buat file `.env` di dalam folder `server` dengan konfigurasi dasar berikut:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/bsilsilah
     JWT_SECRET=rahasia_jwt_anda
     ```
   - Buat file `.env` di direktori utama (*root*) aplikasi (untuk *frontend*) berisi:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

3. **Jalankan Aplikasi**
   - Menjalankan Backend: `cd server && npm run dev`
   - Menjalankan Frontend: `npm run dev`

---

## Kontak Person

Aplikasi ini dikembangkan oleh:

- **Nama / Username:** bud1gata
- **GitHub:** [https://github.com/bud1gata](https://github.com/bud1gata)
- **Email:** [me@budiputra"dot"web"dot"id]
