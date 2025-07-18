import { RequestHandler } from "express";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Admin credentials
const ADMIN_EMAIL = "coinkrazy00@gmail.com";
const ADMIN_PASSWORD = "Woot6969!";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Check admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Simple session token (in production, use proper JWT or session management)
      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      res.json({
        success: true,
        message: "Login successful",
        user: {
          email: ADMIN_EMAIL,
          role: "admin",
          token,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid request data",
    });
  }
};

export const handleRegister: RequestHandler = async (req, res) => {
  // For now, just return success for demo purposes
  res.json({
    success: true,
    message: "Registration successful",
  });
};

export const handleForgotPassword: RequestHandler = async (req, res) => {
  // For now, just return success for demo purposes
  res.json({
    success: true,
    message: "Password reset email sent",
  });
};
