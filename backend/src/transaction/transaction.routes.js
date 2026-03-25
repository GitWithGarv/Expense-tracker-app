import { Router } from "express";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from "./transaction.controller.js";
import { AdminUserGuard as guard } from "../middleware/guard.middleware.js";

const router = Router();

router.route("/")
    .post(guard, createTransaction)
    .get(guard, getTransactions);

router.route("/:id")
    .put(guard, updateTransaction)
    .delete(guard, deleteTransaction);

export default router;
