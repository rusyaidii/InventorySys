import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
    supplierName: {
        type: String,
        required: true
    },
    supplierAddress: {
        type: String,
        required: true
    },
    supplierContact: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;