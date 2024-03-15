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

// router.get('/product', productList);

// router.post('/product', newProduct);

router.post('/populate', populateProduct);

router
  .route("/product")
  .get(productList)
  .post(newProduct);

router
  .route("/product/:id")
  .get(productListById)
  .put(updateProduct)
  .delete(deleteProduct);


export default router;