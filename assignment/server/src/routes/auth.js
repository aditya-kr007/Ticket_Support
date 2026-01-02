const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Static admin credentials
const ADMIN_USER = {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@support.com',
    password: 'admin123',
    role: 'admin',
    department: 'general'
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '7d'
    });
};

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check against static credentials
        if (email !== ADMIN_USER.email || password !== ADMIN_USER.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(ADMIN_USER.id);

        res.json({
            success: true,
            data: {
                user: {
                    id: ADMIN_USER.id,
                    name: ADMIN_USER.name,
                    email: ADMIN_USER.email,
                    role: ADMIN_USER.role,
                    department: ADMIN_USER.department
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/me', (req, res) => {
    // Check if token is valid from middleware
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

        if (decoded.id === ADMIN_USER.id) {
            res.json({
                success: true,
                data: {
                    id: ADMIN_USER.id,
                    name: ADMIN_USER.name,
                    email: ADMIN_USER.email,
                    role: ADMIN_USER.role,
                    department: ADMIN_USER.department
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
});

// Export admin user for use in other routes
module.exports = router;
module.exports.ADMIN_USER = ADMIN_USER;
