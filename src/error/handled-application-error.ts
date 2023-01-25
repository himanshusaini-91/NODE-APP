import ApplicationError from "./application-error";
class HandledApplicationError extends ApplicationError {
    constructor(status: number, message: any) {
        super(status, message, true);
    }
}

export default HandledApplicationError;
