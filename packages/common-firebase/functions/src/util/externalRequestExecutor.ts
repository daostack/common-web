import { CommonError } from './errors';

interface IExternalErrorData {
  errorCode: string;

  message?: string;
  userMessage?: string;

  [key: string]: any;
}

export const externalRequestExecutor = async <T = any,>(func: () => any, data: IExternalErrorData): Promise<T> => {
  try {
    const result = await func();

    console.info('External request made successfully');

    return result;
  } catch (err) {
    console.error(`External service error: ${err.toString()}`, err);

    throw new CommonError(
      data.message || `External service failed. ErrorCode: ${data.errorCode}`, {
        userMessage: 'Request to external service failed. Please try again later',
        data,
        error: err,
        errorString: JSON.stringify(err)
      }
    );
  }
};




