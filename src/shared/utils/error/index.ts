import { ErrorCode } from "@/shared/constants";

interface GeneralErrorOptions {
  message?: string;
  code?: ErrorCode;
}

export const isGeneralError = (error: any): error is GeneralError =>
  error instanceof GeneralError;

export class GeneralError extends Error {
  public readonly code?: ErrorCode;
  public readonly detail?: string;

  constructor(options: GeneralErrorOptions = {}) {
    super(options.message || "");

    this.code = options.code;
    this.detail = this.message || undefined;
  }
}
