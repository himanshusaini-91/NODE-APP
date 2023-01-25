import express from "express";
import catchError from "../error/catch-error";
import IAuthenticatedRequest from "./authenticated.request";

async function authenticationGuard(
    req: IAuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction,
) {
    try {
        next();
    } catch (err) {
        catchError(err, next);
    }
}

export default authenticationGuard;
