const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const database = require('./config/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRouter = require('./routes/cart');
const profileRoutes = require('./routes/profile');
const { isAuthenticated, isAdmin, isUser } = require('./middlewares/isAuthenticated');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);
// Pastikan Anda sudah mengimpor dan menggunakan route dengan benar
app.use('/user', require('./routes/products'));
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/profile', profileRoutes);
app.use('/cart', cartRouter);
app.use(express.static('public'));
app.use((req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
        res.locals.role = req.session.user.role;
    }
    next();
});

app.get('/', isAuthenticated, (req, res) => {
    const query = "SELECT * FROM products";
    database.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        res.render('index', { products: results });
    });
});

app.get('/admin/products', isAuthenticated, isAdmin, (req, res) => {
    const query = "SELECT * FROM products";
    database.query(query, (err, results) => {
        if (err) 
            return res.status(500).send('Database error.');
        res.render('admin/products', { products: results, user: req.session.user });
    });
});

app.get('/user/user', isAuthenticated, isUser, (req, res) => {
    const query = "SELECT * FROM products";
    database.query(query, (err, results) => {
        if (err) 
            return res.status(500).send('Database error.');
        res.render('user/user', { products: results, user: req.session.user });
    });
});

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.get('/cart', (req, res) => {
    // Ambil data cart untuk user
    const userCart = getCartForUser(req.user.id);
    res.render('cart', { cart: userCart, user: req.user });
});


app.listen(3002, function() {
    console.log("Listening to http://localhost:3002");
    console.log("Bisa Bang GG");
});
