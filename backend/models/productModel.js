import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productCat: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: false
    },
    supplierId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Supplier"
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;