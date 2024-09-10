import mongoose from "mongoose";

const VerificationModel = new mongoose.Schema({
    phone: {
        type: 'String',
        required: true,
    },
    verificationCode: {
        type: 'String',
        required: true,
    }
})

export default mongoose.model('Verification', VerificationModel)