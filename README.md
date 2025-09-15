# Jadwal Kuliah - Course Schedule App

Aplikasi web jadwal kuliah dengan desain modern dan minimalis yang terinspirasi dari Apple Reminders. Dibangun menggunakan Next.js 15 dengan App Router, TypeScript, Tailwind CSS, dan shadcn/ui.

## 🎨 Fitur Desain

- **Apple Reminders-inspired UI**: Desain minimalis, clean, dan modern
- **Card-based Layout**: Menggunakan kartu dengan rounded-2xl, soft shadow, dan warna pastel
- **Typography**: Font besar dan jelas, tidak kaku seperti tabel tradisional
- **Grid Layout**: Layout berbasis grid yang responsif
- **Lucide Icons**: Ikon sederhana dan konsisten

## ✨ Fitur Aplikasi

### 1. Dashboard
- Menampilkan daftar jadwal kuliah dalam bentuk kartu
- Setiap kartu berisi: Hari, Jam, Nama Mata Kuliah, Ruang, Dosen
- Hover effects dan animasi smooth
- Responsive design untuk berbagai ukuran layar

### 2. Filter & Pencarian
- Filter berdasarkan hari (Senin - Minggu)
- Filter berdasarkan dosen pengampu
- Pencarian berdasarkan nama mata kuliah, kode mata kuliah, atau nama dosen
- Tombol clear untuk menghapus semua filter

### 3. CRUD Operations
- **Create**: Tambah jadwal kuliah baru
- **Read**: Lihat daftar jadwal kuliah
- **Update**: Edit jadwal kuliah yang sudah ada
- **Delete**: Hapus jadwal kuliah

### 4. Floating Action Button
- Tombol + (plus) floating di pojok kanan bawah
- Menggunakan dialog modal untuk form tambah jadwal
- Desain yang konsisten dengan tema aplikasi

## 🛠️ Teknologi yang Digunakan

- **Next.js 15**: Framework React dengan App Router
- **TypeScript**: Type safety dan developer experience yang lebih baik
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Komponen UI modern dan accessible
- **Lucide React**: Library ikon yang ringan dan konsisten

## 📁 Struktur Project

```
src/
├── app/
│   ├── globals.css          # Global styles dengan custom design tokens
│   ├── layout.tsx           # Root layout dengan metadata
│   └── page.tsx             # Home page yang menggunakan Dashboard
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard.tsx        # Komponen utama dashboard
│   └── schedule-form.tsx    # Form untuk CRUD operations
├── data/
│   └── sample-data.ts       # Data sample jadwal kuliah
├── types/
│   └── schedule.ts          # TypeScript interfaces
└── lib/
    └── utils.ts             # Utility functions
```

## 🚀 Cara Menjalankan

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   ```

3. **Buka browser:**
   ```
   http://localhost:3000
   ```

## 📱 Responsive Design

Aplikasi ini fully responsive dan dapat digunakan di:
- Desktop (grid 3 kolom)
- Tablet (grid 2 kolom)
- Mobile (grid 1 kolom)

## 🎨 Custom Design Tokens

Aplikasi menggunakan custom design tokens yang terinspirasi Apple Reminders:
- Pastel colors untuk kartu
- Rounded corners (rounded-2xl)
- Soft shadows
- Gradient background
- Smooth transitions dan hover effects

## 📊 Data Sample

Aplikasi dilengkapi dengan data sample berdasarkan jadwal kuliah semester gasal-1 2025/2026 untuk mahasiswa Teknik Informatika, termasuk:
- 6 mata kuliah dengan jadwal lengkap
- Informasi dosen pengampu
- Detail ruang dan waktu
- Sistem kredit semester (SKS)

## 🔧 Pengembangan Lebih Lanjut

Aplikasi ini dapat dikembangkan lebih lanjut dengan fitur:
- Authentication dan user management
- Database integration (PostgreSQL, MongoDB)
- Real-time updates
- Export ke PDF/Excel
- Notifikasi reminder
- Dark mode toggle
- Mobile app dengan React Native