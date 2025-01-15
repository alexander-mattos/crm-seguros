
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      statusCode: error.statusCode
    });
    return;
  }

  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    statusCode: 500
  });
};

