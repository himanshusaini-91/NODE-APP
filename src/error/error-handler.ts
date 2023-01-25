import { NextFunction, Request, Response } from "express";
import ApplicationError from "./application-error";

function errorHandler(
    error: ApplicationError,
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const status = error.status || 500;
    let message: string;

    if (!error.isHandledError) {
        message = "Something went wrong";
    } else {
        message = error.message;
    }
    response.status(status).send({ message, status });
}

export default errorHandler;
