import express from 'express';
const router = express.Router();

import {
  supplierList,
  supplierDetailById,
  newSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controller/supplierController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";

router
  .route("/supplier")
  .get(supplierList)
  .post(protect, checkPermission('create'), newSupplier);

router
  .route("/supplier/:id")
  .get(supplierDetailById)
  .put(protect, checkPermission('update'), updateSupplier)
  .delete(protect, checkPermission('delete'), deleteSupplier);


export default router;