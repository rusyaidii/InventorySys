import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

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
    return async (req, res, next) => {
        try {
            console.log(req.user);
            const userRole = req.user.role; // Assuming req.user.role contains the role ID
            const role = await Role.findOne({ name: userRole });
            
            if (!role) {
                res.status(403);
                throw new Error('Role not found!');
            }

            const hasPermission = role.permissions.includes(permission);

            if (!hasPermission) {
                res.status(403);
                throw new Error('You do not have permission to perform this action!');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export { protect, restrict, checkPermission };