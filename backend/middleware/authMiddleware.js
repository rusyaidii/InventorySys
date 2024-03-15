import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorised, invalid token')
        }
    } else {
        res.status(401);
        throw new Error('Not authorised, no token!')
    }
})

const restrict = (...role) => {
    return (req, res, next) => {
        if (role.includes(req.user.role)) {
            next();
        } else {
            res.status(403);
            throw new Error('You do not have permission!')
        }
    }
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        console.log(req.user)
        const userRoles = req.user.roles || [];
        const hasPermission = userRoles.some((role) => role.permissions.includes(permission));

        if (!hasPermission) {
            res.status(403);
            throw new Error('You do not have permission to perform this action!');
        }

        next();
    }
}

export { protect, restrict, checkPermission };