import { Router } from "express";
import { registerUser, login, logout } from "../controllers/auth.controller";
import { validateRequestBody, validatePassword } from "../middlewares/validation.middleware";

const router = Router();

router.post(
  "/register",
  validateRequestBody(["fname", "lname", "email", "phone", "password", "confirmPassword"]), 
  validatePassword,
  registerUser
);
router.post(
  "/login",
  validateRequestBody(["email", "password"]), 
  login
);
router.post("/logout/:userID", logout); 

export default router;