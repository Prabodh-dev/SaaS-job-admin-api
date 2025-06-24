import express from "express";
import { requireAuth, requireUser, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/private", requireAuth, requireUser, (req, res) => {
  res.json({ message: "you are an authenticated user" });
});

router.get("/admin", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "welcome Admin" });
});

export default router;
