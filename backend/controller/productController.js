import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc Get product list
// route GET api/product
// @access Public
const productList = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'productName', sortOrder = 'asc', productCat = '' } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Construct the sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Construct the filter object
    const filter = {};
    if (productCat) {
        filter.productCat = productCat;
    }

    // Fetch products with pagination, sorting, and filtering
    const products = await Product.find(filter)
        .sort(sortOptions)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    // Fetch the total count of products (for pagination)
    const totalCount = await Product.countDocuments(filter);

    res.status(200).json({
        count: products.length,
        total: totalCount,
        data: products
    });
});

// @desc Get product list by ID
// route GET api/product/:id
// @access Public
const productListById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.status(200).json(product);
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
    const count = await Product.countDocuments();
    if (count >= 10) {
        res.status(400);
        throw new Error('Database already populated with 1000 or more products.')
    }

    // Get list of supplier
    // Get list of category

    // Generate and insert products into the database
    const productsToInsert = [];
    for (let i = 0; i < 10; i++) {
        productsToInsert.push({
            productName: `Product ${i + 1}`,
            productPrice: Math.floor(Math.random() * 10) + 1,
            //productCat: `Category ${i % 3 + 1}`,
            //supplierId: `Supplier ${i % 2 + 1}`
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

export { productList, productListById, newProduct, populateProduct, updateProduct, deleteProduct };