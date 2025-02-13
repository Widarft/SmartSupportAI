import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes example
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// Admin only route example
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Admin access granted",
  });
});

export default router;
