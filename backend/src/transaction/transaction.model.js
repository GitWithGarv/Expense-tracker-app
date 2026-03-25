import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["Credit", "Debit"],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
