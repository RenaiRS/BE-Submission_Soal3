function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/auth/login');
}
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/auth/login');
    }
}
function isUser(req, res, next) {
    if (req.session.user && req.session.user.role === 'user') {
        next();
    } else {
        res.redirect('/auth/login');
    }
}
// function isSeller(req, res, next) {
//     if (req.session.user && req.session.user.role === 'seller') {
//         next();
//     } else {
//         res.redirect('/auth/login');
//     }
// }

module.exports = { isAdmin, isUser, isAuthenticated };
