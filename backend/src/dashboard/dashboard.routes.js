import { Router } from "express";
import { getDashboardSummary } from "./dashboard.controller.js";
import { AdminUserGuard as guard } from "../middleware/guard.middleware.js";

const router = Router();

router.get("/report", guard, getDashboardSummary);

export default router;
