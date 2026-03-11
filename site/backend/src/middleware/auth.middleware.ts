import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "No token provided", code: 401 });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token", code: 401 });
  }
};
