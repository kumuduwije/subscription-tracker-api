import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post(
  "/subscription/reminder",
  (req, res, next) => {
    next();
  },
  sendReminders
);

export default workflowRouter;
