import Transaction from "./transaction.model.js";

export const createTransaction = async (req, res) => {
    try {
        const { title, amount, type, paymentMethod, notes, date } = req.body;
        const transaction = new Transaction({
            user: req.user.id,
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
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
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
        const transaction = await Transaction.findOneAndDelete({ _id: id, user: req.user.id });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
