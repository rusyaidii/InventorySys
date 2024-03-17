import asyncHandler from 'express-async-handler';
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import crypto from 'crypto'
import sharp from 'sharp';

import Product from '../models/productModel.js';
import Supplier from '../models/supplierModel.js';

const bucketName = process.env.BUCKET_NAME || 'inventorysys-bucket';
const bucketRegion = process.env.BUCKET_REGION || 'ap-southeast-1';
const s3AccessID = process.env.S3_ACCESS_ID || 'AKIA2UC3EML434RGEJAI';
const s3SecretKey = process.env.S3_SECRET_KEY || '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';

const s3 = new S3Client({
    credentials: {
        accessKeyId: s3AccessID,
        secretAccessKey: s3SecretKey,
    },
    region: bucketRegion,
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @desc Get product list
// route GET api/product
// @access Public
const productList = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'productName', sortOrder = 'asc', productCat = '' } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Ensure page number is not less than 1
    const validPageNumber = Math.max(1, pageNumber);

    // Construct the sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Construct the filter object
    const filter = {};
    if (productCat) {
        filter.productCat = productCat;
    }

    try {
        // Calculate skip value, ensuring it's not negative
        const skipValue = Math.max(0, (validPageNumber - 1) * limitNumber);
        const actualSkip = skipValue === 0 ? 0 : skipValue + 1;
        const actualValue = actualSkip + 1;

        // Fetch products with pagination, sorting, and filtering
        const products = await Product.find(filter)
            .populate('supplierId')
            .sort(sortOptions)
            .skip(actualValue)
            .limit(limitNumber);

        // Fetch the total count of products (for pagination)
        const totalCount = await Product.countDocuments(filter);

        res.status(200).json({
            count: products.length,
            total: totalCount,
            data: products.map(product => ({
                _id: product._id,
                productName: product.productName,
                productPrice: product.productPrice,
                productCat: product.productCat,
                productImage: product.productImage,
                supplierName: product.supplierId.supplierName
              }))
        });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// @desc Get product category list
// route GET api/product/cat
// @access Public
const productCatList = asyncHandler(async (req, res) => {
    const distinctCategories = await Product.distinct('productCat');

    res.status(200).json(distinctCategories);
});

// @desc Get product list by ID
// route GET api/product/:id
// @access Public
const productListById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product) {
        let url = null;
        if (product.productImage) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: product.productImage,
            };

            const command = new GetObjectCommand(getObjectParams);
            url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        }
        const supplier = await Supplier.findById(product.supplierId);
        res.status(200).json({
            _id: product._id,
            productName: product.productName,
            productPrice: product.productPrice,
            productCat: product.productCat,
            supplierId: product.supplierId,
            supplierName: supplier.supplierName,
            productImage: url
        })
    } else {
        res.status(400);
        throw new Error('Invalid data')
    }
});

// @desc Create new product
// route POST api/product
// @access Private
const newProduct = asyncHandler(async (req, res) => {
    const { productName, productPrice, productCat, supplierId, productImage } = req.body;

    const product = await Product.create({
        productName,
        productPrice,
        productCat,
        supplierId,
        productImage
    });

    if (product) {
        res.status(201).json({
            _id: product._id,
            productName: product.productName,
            productPrice: product.productPrice,
            productCat: product.productCat,
            supplierId: product.supplierId,
            productImage: product.productImage
        })
    } else {
        res.status(400);
        throw new Error('Invalid data')
    }

});

// @desc Populate new product with min 1000 data
// route POST api/product
// @access Private
const populateProduct = asyncHandler(async (req, res) => {
    // Check if the database already has 1000 or more products
    // const count = await Product.countDocuments();
    // if (count >= 100) {
    //     res.status(400);
    //     throw new Error('Database already populated with 1000 or more products.')
    // }

    // Get list of supplier and randomize
    const suppliers = await Supplier.find({});
    const supplierIds = suppliers.map(supplier => supplier._id);
    // Get list of category and randomize
    const categories = await Product.distinct('productCat');
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Generate and insert products into the database
    const productsToInsert = [];
    for (let i = 0; i < 1000; i++) {
        const randomSupplierId = supplierIds[Math.floor(Math.random() * supplierIds.length)];

        productsToInsert.push({
            productName: `Product ${i + 1}`,
            productPrice: Math.floor(Math.random() * 10) + 1,
            productCat: randomCategory,
            supplierId: randomSupplierId
        });
    }
    await Product.insertMany(productsToInsert);
    res.status(200).json('Database populated successfully');
})

// @desc Update product detail
// route PUT api/product
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { productName, productPrice, productCat, supplierId, productImage } = req.body;
    const product = await Product.findById(id);
    const supplier = await Supplier.findById(supplierId);

    if (product) {
        product.productName = productName || product.productName;
        product.productPrice = productPrice || product.productPrice;
        product.productCat = productCat || product.productCat;
        product.supplierId = supplierId || product.supplierId;
        product.productImage = productImage || product.productImage

        const updatedProduct = await product.save();

        res.status(200).json({
            _id: updatedProduct._id,
            productName: updatedProduct.productName,
            productPrice: updatedProduct.productPrice,
            productCat: updatedProduct.productCat,
            supplierId: updatedProduct.supplierId,
            supplierName: supplier.supplierName,
            productImage: updatedProduct.productImage
        })
    } else {
        res.status(404);
        throw new Error('Product not found!');
    }
});

// @desc Delete product detail
// route DELETE api/product
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await Product.findByIdAndDelete(id);

    if(result){
        res.status(200).json('Product delete successfully!')
    } else {
        res.status(404);
        throw new Error('Product not found!');
    }
});

// @desc Upload product image
// route POST api/upload
// @access Private
const uploadProductImage = asyncHandler(async (req, res) => {
  upload.single("file")(req, res, async function (err) {
    if (err) {
      res.status(400);
      throw new Error("Failed to upload file!");
    } else {
      const file = req.file;
      const { id } = req.body;

      if (!file) {
        res.status(400);
        throw new Error("No file uploaded!");
      }

      try {
        // Resize the image
        const buffer = await sharp(file.buffer).resize({ height: 1080, width: 1920, fit: "contain" }).toBuffer();

        const randImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
        const imageName = randImageName();
        const params = {
          Bucket: bucketName,
          Key: imageName,
          Body: buffer,
          ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        const product = await Product.findById(id);

        if (product) {
            product.productImage = imageName || product.productImage
    
            const updatedProduct = await product.save();
    
            res.status(200).json({
                _id: updatedProduct._id,
                productName: updatedProduct.productName,
            })
        } else {
            res.status(404);
            throw new Error('Product not found!');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to upload file to S3.");
      }
    }
  });
});

export { productList, productCatList, productListById, newProduct, populateProduct, updateProduct, deleteProduct, uploadProductImage };