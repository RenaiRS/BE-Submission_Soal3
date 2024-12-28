const express = require('express');
const database = require('../config/database'); // Pastikan koneksi database diatur dengan benar
const { isAuthenticated } = require('../middlewares/isAuthenticated'); // Middleware untuk memastikan user login
const router = express.Router();

// Profile
router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    // Query untuk mendapatkan data lengkap user dari database
    const query = `
        SELECT username, fullname, gmail, role, created_at 
        FROM users 
        WHERE id = ? LIMIT 1
    `;

    database.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        // Mengirim data user ke template
        const user = results[0];
        res.render('profile', { user });
    });
});

module.exports = router;
