const express = require('express');
const bcrypt = require('bcrypt');
const database = require('../config/database');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";
    database.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
            const user = results[0];
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };
            if (user.role === 'admin') {
                return res.redirect('/products/admin/products');
            }
            else if (user.role === 'user') {
                return res.redirect('/products/user/user');
            }
        } else {
            return res.redirect('/auth/login');
        }
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password, gmail, fullname, address } = req.body;

    if (!username || !password || !gmail || !fullname ) {
        return res.status(400).send('Please fill all required fields');
    }

    const checkQuery = "SELECT * FROM users WHERE username = ? OR gmail = ?";
    database.query(checkQuery, [username, gmail], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).send('Username or Email already registered');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;

            const query = "INSERT INTO users (username, password, gmail, fullname, address) VALUES (?, ?, ?, ?, ?)";
            database.query(query, [username, hashedPassword, gmail, fullname, address], (err) => {
                if (err) throw err;
                res.redirect('/auth/login');
            });
        });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('login');
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/auth/login');
    });
});


module.exports = router;
