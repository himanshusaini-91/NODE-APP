import ApplicationError from "./application-error";
class UnhandledApplicationError extends ApplicationError {
    constructor(message: any) {
        super(500, message, false);
    }
}

export default UnhandledApplicationError;
