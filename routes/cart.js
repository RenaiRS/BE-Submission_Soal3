const express = require('express');
const router = express.Router();
const database = require('../config/database');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const query = `
        SELECT c.id AS cart_id, p.name, p.price, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `;

    database.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart:', err);
            return res.status(500).send('Database error');
        }
        res.render('cart', { user: req.session.user, cart: results }); // Mengirimkan data cart ke view
    });
});


// Menambahkan produk ke keranjang
router.post('/add/:productId', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const query = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;

    // Menjalankan query untuk menambahkan produk ke keranjang
    database.query(query, [userId, productId, quantity], (err) => {
        if (err) {
            console.error('Error adding to cart:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/cart');
    });
});


// Menghapus produk dari keranjang
router.post('/remove/:cartId', isAuthenticated, (req, res) => {
    const { cartId } = req.params;

    const query = `DELETE FROM cart WHERE id = ?`;

    database.query(query, [cartId], (err) => {
        if (err) {
            console.error('Error removing from cart:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/cart');
    });
});

module.exports = router;
