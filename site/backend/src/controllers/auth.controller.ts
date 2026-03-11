import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import { successResponse, errorResponse } from "../utils/response.utils";
import { AuthRequest } from "../middleware/auth.middleware";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
      errorResponse(res, "All fields are required", 400);
      return;
    }

    if (!["driver", "customer"].includes(role)) {
      errorResponse(res, "Role must be driver or customer", 400);
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      const field = existingUser.email === email ? "email" : "phone";
      errorResponse(res, `User with this ${field} already exists`, 409);
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      fullName,
      email,
      phone,
      passwordHash,
      role,
    });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    successResponse(
      res,
      {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
        },
        accessToken,
        refreshToken,
      },
      "Account created successfully",
      201
    );
  } catch (error) {
    errorResponse(res, "Signup failed");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      errorResponse(res, "Email and password are required", 400);
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      errorResponse(res, "Invalid email or password", 401);
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      errorResponse(res, "Invalid email or password", 401);
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    successResponse(res, {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
      },
      accessToken,
      refreshToken,
    }, "Login successful");
  } catch (error) {
    errorResponse(res, "Login failed");
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  // Phase 1 stub: JWT stored in localStorage on frontend.
  // No server-side token invalidation — client simply deletes the token.
  successResponse(res, null, "Logged out successfully");
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-passwordHash");
    if (!user) {
      errorResponse(res, "User not found", 404);
      return;
    }

    successResponse(res, { user }, "User retrieved successfully");
  } catch (error) {
    errorResponse(res, "Failed to get user");
  }
};
