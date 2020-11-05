import { CommonError } from './CommonError';

export class NotImplementedError extends CommonError {
  constructor(message?: string) {
    super(message || 'Not implemented!');
  }
}