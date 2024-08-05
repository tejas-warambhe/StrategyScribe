import { Request, Response, NextFunction } from 'express';

// Custom error class to handle operational errors
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Interface for the error response
interface ErrorResponse {
    status: string;
    message: string;
    stack?: string;
}

// Error handler middleware
const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    const errorResponse: ErrorResponse = {
        status: statusCode >= 500 ? 'error' : 'fail',
        message: message,
    };

    // Include stack trace in development environment
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;