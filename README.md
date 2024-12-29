# BE Program - Dokumentasi
## Gambaran Umum Proyek
Proyek ini adalah sistem backend untuk sebuah toko online yang memiliki fitur seperti autentikasi pengguna, manajemen produk, sistem keranjang belanja, dan profil pengguna. Sistem ini dibangun menggunakan Node.js, Express.js, dan MySQL untuk manajemen basis data.

Akun Admin : Admin1 Password : pwadmin1
Akun User : seller password : seller

terdapat kekurangan dari sistem ini yaitu rute setelah user ingin membeli produk, rute dialihkan hanya ke nomor admin. Sehingga, ketika user lain menambahkan produk mereka sendiri di web dan user lain ingin membeli produknya, jalur "beli sekarang" hanya direct ke nomor admin (disini adalah nomor saya sendiri/nomor teman) sehingga admin(dalam hal ini adalah si pemilik toko) harus melakukan verifikasi ulang ke user yang menjualkan produknya. saya juga tidak menambahkan data tambahan yaitu "nomor user" untuk keperluan transaksi.
## Struktur Folder
BE_Submission_Soal3/
├── config/
│   └── database.js
├── middlewares/
│   └── isAuthenticated.js
├── routes/
│   ├── auth.js
│   ├── cart.js
│   ├── products.js
│   └── profile.js
├── views/
│   ├── admin/
│   │   └── products.ejs
│   ├── user/
│   │   └── products.ejs
│   ├── cart.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── register.ejs
├── server.js
└── README.md

## Instalasi

Untuk menjalankan proyek ini secara lokal:

1. Clone repository:
    ```bash
    git clone https://github.com/RenaiRS/BE_Submission_Soal3.git
    ```

2. Install dependencies (library yang dibutuhkan):
    ```bash
    npm install
    ```

3. Jalankan server:
    ```bash
    npm start
    ```

Server akan berjalan di `http://localhost:3002`.

---

## Endpoint Autentikasi

### POST /auth/login
- **Deskripsi**: Digunakan untuk login ke sistem.
- **Request Body**:
    ```json
    {
        "username": "string",
        "password": "string"
    }
    ```
- **Respons**:
    - **200 OK**: Login berhasil.
    - **401 Unauthorized**: Jika kredensial salah.

### POST /auth/register
- **Deskripsi**: Digunakan untuk mendaftar akun baru.
- **Request Body**:
    ```json
    {
        "username": "string",
        "gmail": "string",
        "password": "string",
        "fullname": "string",
        "address": "string"
    }
    ```
- **Respons**:
    - **201 Created**: Pendaftaran berhasil.
    - **400 Bad Request**: Jika ada input yang salah.

---

## Endpoint Produk

### GET /products
- **Deskripsi**: Menampilkan semua produk yang tersedia.
- **Respons**:
    - **200 OK**: Mengembalikan daftar produk.
    - **200 OK (Kosong)**: Jika tidak ada produk.

### POST /products/admin
- **Deskripsi**: Menambahkan produk baru (hanya admin).
- **Request Body**:
    ```json
    {
        "name": "string",
        "price": "integer",
        "description": "string",
        "image": "file"  // Opsional
    }
    ```
- **Respons**:
    - **201 Created**: Produk berhasil ditambahkan.
    - **400 Bad Request**: Jika ada input yang salah.

### POST /products/user
- **Deskripsi**: Menambahkan produk baru (untuk penjual).
- **Request Body**:
    ```json
    {
        "name": "string",
        "price": "integer",
        "description": "string",
        "image": "file"  // Opsional
    }
    ```
- **Respons**:
    - **201 Created**: Produk berhasil ditambahkan.
    - **400 Bad Request**: Jika ada input yang salah.

### POST /products/admin/update/:id
- **Deskripsi**: Memperbarui produk yang sudah ada (hanya admin).
- **Request Body**:
    ```json
    {
        "name": "string",
        "price": "integer",
        "description": "string",
        "image": "file"  // Opsional
    }
    ```
- **Respons**:
    - **200 OK**: Produk berhasil diperbarui.
    - **404 Not Found**: Jika produk tidak ditemukan.

### POST /products/user/update/:id
- **Deskripsi**: Memperbarui produk yang sudah ada (untuk penjual).
- **Request Body**:
    ```json
    {
        "name": "string",
        "price": "integer",
        "description": "string",
        "image": "file"  // Opsional
    }
    ```
- **Respons**:
    - **200 OK**: Produk berhasil diperbarui.
    - **404 Not Found**: Jika produk tidak ditemukan.

### POST /products/admin/delete/:id
- **Deskripsi**: Menghapus produk (hanya admin).
- **Respons**:
    - **200 OK**: Produk berhasil dihapus.
    - **404 Not Found**: Jika produk tidak ditemukan.

### POST /products/user/delete/:id
- **Deskripsi**: Menghapus produk (untuk penjual).
- **Respons**:
    - **200 OK**: Produk berhasil dihapus.
    - **404 Not Found**: Jika produk tidak ditemukan.

---

## Endpoint Keranjang Belanja

### GET /cart
- **Deskripsi**: Menampilkan semua item dalam keranjang belanja.
- **Respons**:
    - **200 OK**: Menampilkan item dalam keranjang.
    - **200 OK (Kosong)**: Jika keranjang kosong.

### POST /cart/add/:id
- **Deskripsi**: Menambahkan item ke keranjang belanja.
- **Respons**:
    - **201 Created**: Item berhasil ditambahkan ke keranjang.

### POST /cart/remove/:id
- **Deskripsi**: Menghapus item dari keranjang belanja.
- **Respons**:
    - **200 OK**: Item berhasil dihapus dari keranjang.

---

## Endpoint Profil Pengguna

### GET /profile
- **Deskripsi**: Menampilkan informasi profil pengguna.
- **Respons**:
    - **200 OK**: Menampilkan data profil pengguna.

### POST /profile/update
- **Deskripsi**: Memperbarui informasi profil pengguna.
- **Request Body**:
    ```json
    {
        "fullname": "string",
        "address": "string"
    }
    ```
- **Respons**:
    - **200 OK**: Profil berhasil diperbarui.

---

## Middleware

### isAuthenticated
- **Deskripsi**: Middleware untuk memastikan pengguna sudah login.

### isAdmin
- **Deskripsi**: Middleware untuk memastikan pengguna adalah admin.

### isUser
- **Deskripsi**: Middleware untuk memastikan pengguna adalah pengguna biasa.

---

## Keamanan dan Validasi

- **Autentikasi berbasis sesi**: Pengguna harus login untuk mengakses sebagian besar endpoint.
- **Kontrol Akses Berdasarkan Peran**: Admin dan pengguna biasa memiliki hak akses yang berbeda.
- **Validasi Input**: Semua endpoint yang menerima data dari klien memvalidasi input untuk memastikan data yang diterima benar dan aman.

---

