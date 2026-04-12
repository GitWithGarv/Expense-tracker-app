import { Router } from "express";
import { getDashboardSummary, getReportData } from "./dashboard.controller.js";
import { AdminUserGuard as guard } from "../middleware/guard.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/report", guard, getDashboardSummary);
dashboardRouter.get("/detailed-report", guard, getReportData);
dashboardRouter.get("/test", (req, res) => res.json({ message: "Dashboard router works!" }));

export default dashboardRouter;
