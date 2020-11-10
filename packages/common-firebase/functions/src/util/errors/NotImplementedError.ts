import { CommonError } from './CommonError';

/**
 * The error that is thrown when a requested method
 * or operation is not implemented.
 */
export class NotImplementedError extends CommonError {
  constructor(message?: string) {
    super(message || 'Not implemented!');
  }
}