import { CommonError } from './errors';
import { stringify } from 'flatted';

interface IExternalErrorData {
  errorCode: string;

  message?: string;
  userMessage?: string;

  [key: string]: any;
}

export const externalRequestExecutor = async <T = any>(func: () => T | Promise<T>, data: IExternalErrorData): Promise<T> => {
  try {
    const result = await func();

    logger.info('External request made successfully');

    return result;
  } catch (err) {
    logger.warn('Circle error response: ', err.response?.data);

    throw new CommonError(
      data.message || `External service failed. ErrorCode: ${data.errorCode}`, {
        userMessage: 'Request to external service failed. Please try again later',
        data,
        response: stringify(err.response?.data)
      }
    );

    // @todo The request and response objects on the error are huge, so
    //    for now I'm not including them in the error or logs. Once we have trace
    //    or debug logger include them there
  }
};




