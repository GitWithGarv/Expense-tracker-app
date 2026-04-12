import { Router } from "express";
import { getDashboardSummary, getReportData } from "./dashboard.controller.js";
import { AdminUserGuard as guard } from "../middleware/guard.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/summary", guard, getDashboardSummary);
dashboardRouter.get("/charts", guard, getReportData);

export default dashboardRouter;
