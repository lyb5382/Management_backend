import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        booking: { 
            type: Schema.Types.ObjectId, 
            ref: "Booking", 
            required: true 
        },
        paymentKey: String,
        orderId: { type: String, required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "cancelled", "failed"],
            default: "pending",
        },
        raw: Object, // PG사 응답 원본
    },
    { timestamps: true }
);

export default model("Payment", paymentSchema);