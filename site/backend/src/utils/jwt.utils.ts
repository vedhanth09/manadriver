import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export const generateAccessToken = (userId: string, role: string): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ userId, role }, JWT_SECRET, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, options);
};

export const verifyToken = (token: string, secret: string): jwt.JwtPayload => {
  return jwt.verify(token, secret) as jwt.JwtPayload;
};
