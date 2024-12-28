const express = require('express');
const database = require('../config/database');
const router = express.Router();
const { isAuthenticated, isAdmin, isUser } = require('../middlewares/isAuthenticated');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
router.get('/admin/products', isAuthenticated, isAdmin, (req, res) => {
    const query = "SELECT * FROM products";
    database.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.render('admin/products', { products: results, user: req.session.user });
    });
});

router.post('/admin', isAuthenticated, isAdmin, upload.single('image'), (req, res) => {
    const { name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const query = "INSERT INTO products (name, price, description, image, created_at) VALUES (?, ?, ?, ?, NOW())";
    database.query(query, [name, price, description, image], (err) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.redirect('/admin/products');
    });
});

router.post('/admin/update/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    if (req.session.user.role !== 'admin') {
        return res.status(403).send('Forbidden. Only admins can update products.');
    }
    const query = "UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?";
    database.query(query, [name, price, description, id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.redirect('/admin/products');
    });
});
router.post('/admin/delete/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;

    // Periksa apakah ada entri terkait di tabel cart
    const checkCartQuery = "SELECT * FROM cart WHERE product_id = ?";
    database.query(checkCartQuery, [id], (err, results) => {
        if (err) {
            console.error('Error checking related entries in cart:', err);
            return res.status(500).send('Database error');
        }
        if (results.length > 0) {
            return res.status(400).send('Cannot delete product because it is still in cart.');
        }
        // Jika tidak ada entri terkait, lanjutkan dengan penghapusan produk
        const deleteProductQuery = "DELETE FROM products WHERE id = ?";
        database.query(deleteProductQuery, [id], (deleteErr) => {
            if (deleteErr) {
                console.error('Error while deleting product:', deleteErr);
                return res.status(500).send('Failed to delete product');
            }
            res.redirect('/admin/products');
        });
    });
});

// Menampilkan Produk oleh Pengguna
router.get('/user/user', isAuthenticated, isUser, (req, res) => {
    const query = `
        SELECT p.*, u.username AS created_by_name 
        FROM products p 
        LEFT JOIN users u ON p.created_by = u.id
    `;
    database.query(query, (err, products) => {
        if (err) return res.status(500).send('Database error');
        res.render('user/user', { user: req.session.user, products });
    });
});

// Menambah Produk oleh Pengguna
router.post('/user', isAuthenticated, isUser, upload.single('image'), (req, res) => {
    const { name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Menyimpan gambar produk jika ada

    const query = 'INSERT INTO products (name, price, description, created_by, image) VALUES (?, ?, ?, ?, ?)';
    database.query(query, [name, price, description, req.session.user.id, image], (err) => {
        if (err) {
            console.error('Error saat menambah produk:', err);
            return res.status(500).send('Terjadi kesalahan saat menambah produk');
        }
        res.redirect('/user/user');
    });
});

// Mengupdate Produk oleh Pengguna
router.post('/user/update/:id', isAuthenticated, isUser, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Menangani upload gambar baru

    const query = `UPDATE products SET name = ?, price = ?, description = ?, image = COALESCE(?, image) WHERE id = ? AND created_by = ?`;
    database.query(query, [name, price, description, image, id, req.session.user.id], (err) => {
        if (err) return res.status(500).send('Failed to update product');
        res.redirect('/user/user');
    });
});

// Menghapus Produk oleh Pengguna
router.post('/user/user/delete/:id', isAuthenticated, isUser, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ? AND created_by = ?';
    
    database.query(query, [id, req.session.user.id], (err) => {
        if (err) return res.status(500).send('Failed to delete product');
        res.redirect('/user/user');
    });
});


module.exports = router;
