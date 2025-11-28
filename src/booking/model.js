import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
        room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        price: Number,
        nights: Number,
        totalPrice: Number,
        status: {
            type: String,
            enum: ["pending", "booked", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
        paymentProvider: { type: String },
        paymentId: { type: String },
        refunded: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model("Booking", bookingSchema);