import express from 'express';
const router = express.Router();

import {
  productList,
  productCatList,
  productListById,
  populateProduct,
  newProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../controller/productController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";

router.post('/populate', protect, checkPermission('create'), populateProduct);

router.get('/cat', productCatList);

router.post('/upload', protect, checkPermission('update'), uploadProductImage);

router
  .route("/product")
  .get(productList)
  .post(protect, checkPermission('create'), newProduct);

router
  .route("/product/:id")
  .get(productListById)
  .put(protect, checkPermission('update'), updateProduct)
  .delete(protect, checkPermission('delete'), deleteProduct);


export default router;