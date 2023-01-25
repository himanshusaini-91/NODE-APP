import { Request } from "express";

interface IAuthenticatedRequest extends Request {
  email: string;
}

export default IAuthenticatedRequest;
