const jwt = require('jsonwebtoken');

// Static admin user
const ADMIN_USER = {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@support.com',
    role: 'admin',
    department: 'general'
};

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

        // Use static admin user
        if (decoded.id === ADMIN_USER.id) {
            req.user = ADMIN_USER;
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize, ADMIN_USER };
