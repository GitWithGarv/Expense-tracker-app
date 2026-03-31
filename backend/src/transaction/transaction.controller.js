import Transaction from "./transaction.model.js";
import UserModel from "../user/user.model.js";

export const createTransaction = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const user = await UserModel.findById(userId);
        if (!user || !user.status) {
            return res.status(403).json({ message: "Account inactive. Cannot add transactions." });
        }

        const { title, amount, type, paymentMethod, notes, date } = req.body;
        const transaction = new Transaction({
            user: userId,
            title,
            amount,
            type,
            paymentMethod,
            notes,
            date,
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        let transactions = [];
        if (role === "admin") {
            const activeUsers = await UserModel.find({ status: true, role: "user" }).select("_id");
            const activeUserIds = activeUsers.map(u => u._id);
            transactions = await Transaction.find({ user: { $in: activeUserIds } }).populate("user", "fullname email").sort({ date: -1 });
        } else {
            const user = await UserModel.findById(userId);
            if (!user || !user.status) return res.json([]);
            transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
        }
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;
        let query = { _id: id };
        if (role !== "admin") {
            query.user = userId;
        }
        const transaction = await Transaction.findOneAndUpdate(query, req.body, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;
        let query = { _id: id };
        if (role !== "admin") {
            query.user = userId;
        }
        const transaction = await Transaction.findOneAndDelete(query);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
