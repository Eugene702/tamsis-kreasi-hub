-----

# Aturan dan Panduan untuk AI Coding Assistant

Dokumen ini berisi serangkaian aturan yang wajib diikuti oleh AI assistant dalam membantu pengembangan proyek. Kepatuhan terhadap aturan ini sangat penting untuk menjaga konsistensi, kualitas, dan keterbacaan kode.

## 1\. Arsitektur Komponen & Struktur File

### Pola Komponen

  - **`page.tsx` Wajib Server Component**: Setiap file `page.tsx` harus merupakan **Server Component**. Jangan pernah mengubahnya menjadi Client Component (`'use client'`).
  - **Komponen Interaktif**: Untuk fungsionalitas yang memerlukan interaksi di sisi klien (seperti `onClick`, `useState`, `useEffect`), buatlah komponen terpisah di dalam folder `_components` dan tandai dengan `'use client'`.
  - **Import Dinamis**: Semua komponen *custom* wajib diimpor menggunakan `next/dynamic` untuk mengoptimalkan pemuatan halaman.
    ```tsx
    import dynamic from 'next/dynamic';

    const MyComponent = dynamic(() => import('./_components/MyComponent'));
    ```

### Lokasi Komponen

Struktur komponen dibagi menjadi dua kategori berdasarkan cakupan penggunaannya:

1.  **Global**: Komponen yang digunakan berulang kali di berbagai halaman.
      - **Lokasi**: `app/components/`
2.  **Lokal**: Komponen yang hanya digunakan pada satu halaman spesifik.
      - **Lokasi**: `app/path/to/page/_components/` (di dalam folder `_components` yang berada satu direktori dengan `page.tsx` terkait).

-----

## 2\. Logika Backend

### Prioritas Server Actions

  - **Gunakan Server Actions**: Semua logika backend (operasi database, pemrosesan form, dll.) wajib diimplementasikan menggunakan **Server Actions**.
  - **File `action.ts`**: Buat file bernama `action.ts` di dalam direktori yang sama dengan `page.tsx`. Satu file `action.ts` ini dikhususkan untuk menangani semua *actions* yang relevan untuk halaman tersebut.

### Penggunaan Route Handler (API)

  - **Kondisi Khusus**: Penggunaan Route Handler (API Routes) hanya diperbolehkan jika kasusnya sangat spesifik dan tidak dapat ditangani secara efektif oleh Server Actions (misalnya untuk webhook atau endpoint publik).
  - **Prioritas Tetap**: Server Actions tetap menjadi pilihan utama.

-----

## 3\. Format Penulisan Kode & Konvensi Penamaan

### `page.tsx`

File utama untuk halaman harus selalu bernama `page.tsx` dan mengikuti format berikut:

```tsx
const page = () => {
  // Konten halaman di sini
  return (
    <div>
      <h1>Halaman Utama</h1>
    </div>
  );
}

export default page;
```

### Komponen

Nama *file* komponen harus menggunakan **PascalCase** (contoh: `MyButton.tsx`), dan nama fungsi komponen di dalamnya harus sama persis dengan nama filenya.

```tsx
// Nama file: MyButton.tsx
const MyButton = () => {
  // Konten komponen di sini
  return (
    <button>Ini Tombol</button>
  );
}

export default MyButton;
```

-----

## 4\. Styling

  - **Framework**: Proyek ini menggunakan **Tailwind CSS** dengan plugin **daisyUI**.
  - **Prioritaskan daisyUI**: Selalu utamakan penggunaan kelas utilitas yang disediakan oleh daisyUI (contoh: `btn`, `card`, `input`, dll.).
  - **Kustomisasi**: Diperbolehkan melakukan kustomisasi, namun harus tetap berbasis pada kelas daisyUI untuk menjaga konsistensi (misalnya, menambahkan kelas Tailwind di samping kelas daisyUI).

-----

## 5\. Perilaku AI Assistant

  - **Ikuti Instruksi**: Kerjakan **hanya** apa yang diinstruksikan. Jangan menambahkan fitur, fungsionalitas, atau elemen apa pun di luar dari permintaan yang diberikan.
  - **Tanpa Komentar Kode**: Kode yang dihasilkan harus bersih dan **tidak boleh mengandung komentar** dalam bentuk apapun (`//`, `/* */`).

-----

## 6\. Prinsip Desain

  - **Konsistensi**: Pola desain di seluruh aplikasi harus konsisten.
  - **Modern dan Bersih**: Terapkan gaya desain yang **modern, minimalis, dan bersih** (*clean*).
  - **Tema Warna**: Skema warna utama adalah **hitam dan putih**. Anda dapat mendesain ulang elemen agar terlihat se-modern mungkin dengan tetap berpegang pada tema ini.

-----

## 7\. Akses Database (Prisma)

  - **Satu Pintu Masuk**: Untuk berinteraksi dengan database, selalu gunakan instance Prisma Client yang sudah dikonfigurasi.
  - **Lokasi File**: Impor instance Prisma dari `'/prisma/database.ts'`. Jangan membuat instance baru di tempat lain.

<!-- end list -->

```typescript
import prisma from "@/prisma/database";

// Contoh penggunaan
const users = await prisma.user.findMany();
```