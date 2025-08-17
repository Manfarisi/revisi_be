// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // lanjut jika admin
  } else {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }
};

export default isAdmin