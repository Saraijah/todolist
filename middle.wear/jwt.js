import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'


dotenv.config()

const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Token required' });

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        // Attach user info to the request object
        req.user = user;

        // Proceed to the next middleware/route
        next();
    });
};


export { authenticateToken}