import express from 'express';
const router = express.Router();

import {
    addNewRole,
    getRoleList
} from "../controller/roleController.js";
import { protect, restrict, checkPermission } from "../middleware/authMiddleware.js";

router.get('/', protect, restrict('admin'),  getRoleList);

router.post('/new', protect, checkPermission('create'), addNewRole);

export default router;