import asyncHandler from 'express-async-handler';
import Supplier from '../models/supplierModel.js';

// @desc Get product list
// route GET api/supplier
// @access Public
const supplierList = asyncHandler(async (req, res) => {

    const suppliers = await Supplier.find({})

    res.status(200).json({
        count: suppliers.length,
        data: suppliers
    });
});

// @desc Get supplier detail by ID
// route GET api/supplier/:id
// @access Public
const supplierDetailById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    res.status(200).json(supplier);
});

// @desc Create new supplier
// route POST api/supplier
// @access Private
const newSupplier = asyncHandler(async (req, res) => {
    const { supplierName, supplierAddress, supplierContact } = req.body;

    const supplier = await Supplier.create({
        supplierName,
        supplierAddress,
        supplierContact,
    });

    if (supplier) {
        res.status(201).json({
            _id: supplier._id,
            supplierName: supplier.supplierName,
            supplierAddress: supplier.supplierAddress,
            supplierContact: supplier.supplierContact,
        })
    } else {
        res.status(400);
        throw new Error('Invalid data')
    }

});

// @desc Populate new product with min 1000 data
// route POST api/supplier
// @access Private
// const populateProduct = asyncHandler(async (req, res) => {
//     // Check if the database already has 1000 or more products
//     // const count = await Product.countDocuments();
//     // if (count >= 100) {
//     //     res.status(400);
//     //     throw new Error('Database already populated with 1000 or more products.')
//     // }

//     // Get list of supplier
//     // Get list of category

//     // Generate and insert products into the database
//     const productsToInsert = [];
//     for (let i = 0; i < 10; i++) {
//         productsToInsert.push({
//             productName: `Product ${i + 1}`,
//             productPrice: Math.floor(Math.random() * 10) + 1,
//             productCat: `Antibiotic`,
//             supplierId: Math.floor(Math.random() * 100) + 1
//         });
//     }
//     await Product.insertMany(productsToInsert);
//     res.status(200).json('Database populated successfully');
// })

// @desc Update supplier detail
// route PUT api/supplier
// @access Private
const updateSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { supplierName, supplierAddress, supplierContact } = req.body;
    const supplier = await Supplier.findById(id);

    if (supplier) {
        supplier.supplierName = supplierName || supplier.supplierName;
        supplier.supplierAddress = supplierAddress || supplier.supplierAddress;
        supplier.supplierContact = supplierContact || supplier.supplierContact;

        const updatedSupplier = await supplier.save();

        res.status(200).json({
            _id: updatedSupplier._id,
            supplierName: updatedSupplier.supplierName,
            supplierAddress: updatedSupplier.supplierAddress,
            supplierContact: updatedSupplier.supplierContact,
        })
    } else {
        res.status(404);
        throw new Error('Product not found!');
    }
});

// @desc Delete supplier detail
// route DELETE api/supplier
// @access Private
const deleteSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await Supplier.findByIdAndDelete(id);

    if(result){
        res.status(200).json('Supplier delete successfully!')
    } else {
        res.status(404);
        throw new Error('Supplier not found!');
    }
});

export { supplierList, supplierDetailById, newSupplier, updateSupplier, deleteSupplier };