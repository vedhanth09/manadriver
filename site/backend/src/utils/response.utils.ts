import { Response } from "express";

export const successResponse = (
  res: Response,
  data: unknown = null,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (
  res: Response,
  error: string = "Something went wrong",
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    success: false,
    error,
    code: statusCode,
  });
};
