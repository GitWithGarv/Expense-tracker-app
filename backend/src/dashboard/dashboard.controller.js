import Transaction from "../transaction/transaction.model.js";
import UserModel from "../user/user.model.js";
import dayjs from "dayjs";

export const getDashboardSummary = async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        let transactions = [];
        
        if (role === "admin") {
            // Find all active users
            const activeUsers = await UserModel.find({ status: true, role: "user" }).select("_id");
            const activeUserIds = activeUsers.map(u => u._id);
            
            // Only get transactions from active users
            transactions = await Transaction.find({ user: { $in: activeUserIds } });
        } else {
            // Check if current user is active
            const user = await UserModel.findById(userId);
            if (!user || !user.status) {
                return res.json({
                    summary: { totalTransactions: 0, totalCredit: 0, totalDebit: 0, balance: 0 },
                    chartData: Array.from({ length: 30 }, (_, i) => ({
                        name: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
                        amount: 0
                    }))
                });
            }
            transactions = await Transaction.find({ user: userId });
        }

        // Calculate summary
        let totalCredit = 0;
        let totalDebit = 0;
        
        transactions.forEach(t => {
            if (t.type === "Credit") totalCredit += t.amount;
            else totalDebit += t.amount;
        });

        const summary = {
            totalTransactions: transactions.length,
            totalCredit,
            totalDebit,
            balance: totalCredit - totalDebit
        };

        // Calculate daily chart data (last 30 days)
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            last30Days.push({ name: date, amount: 0 });
        }

        transactions.forEach(t => {
            const tDate = dayjs(t.date).format('YYYY-MM-DD');
            const dayData = last30Days.find(d => d.name === tDate);
            if (dayData) {
                dayData.amount += t.amount;
            }
        });

        res.json({
            summary,
            chartData: last30Days
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
