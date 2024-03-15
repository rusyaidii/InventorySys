import asyncHandler from 'express-async-handler';
import Role from '../models/roleModel.js';

// @desc Add new role
// route POST api/role/new
// @access Private
const addNewRole = asyncHandler(async (req, res) => {
    const { name, permissions } = req.body;

    const role = await Role.create({
        name,
        permissions
    });

    if(role){
        res.status(201).json({
            _id: role._id,
            name: role.name,
            permissions: role.permissions
        });
    } else {
        res.status(400);
        throw new Error('Invalid role data');
    }
});

// @desc Get role list
// route GET api/role
// @access Private
const getRoleList = asyncHandler(async (req, res) => {

    const role = await Role.find({});
    res.status(201).json(role);
});

export { addNewRole, getRoleList };