import express from 'express';
const router = express.Router();

import {
  productList,
  productListById,
  populateProduct,
  newProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";

router.post('/populate', protect, checkPermission('create'), populateProduct);

router
  .route("/product")
  .get(protect, productList)
  .post(protect, checkPermission('create'), newProduct);

router
  .route("/product/:id")
  .get(productListById)
  .put(protect, checkPermission('update'), updateProduct)
  .delete(protect, checkPermission('delete'), deleteProduct);


export default router;