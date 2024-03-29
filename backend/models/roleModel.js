import mongoose from 'mongoose';

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    permissions: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
