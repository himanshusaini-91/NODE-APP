class ApplicationError extends Error {
  public status: number;
  public message: any;
  public isHandledError: boolean;
  constructor(status: number, message: any, isHandledError: boolean) {
      super(message);
      this.status = status;
      this.message = message;
      this.isHandledError = isHandledError;
  }
}

export default ApplicationError;
