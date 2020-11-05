import { CommonError } from './errors';

interface IExternalErrorData {
  errorCode: string;

  message?: string;
  userMessage?: string;

  [key: string]: any;
}

export const externalRequestExecutor = async (func: () => any, data: IExternalErrorData): Promise<any> => {
  try {
    const result = await func();

    console.info('External request made successfully');

    return result;
  } catch (e) {
    if (!data.userMessage) {
      data.userMessage = `A call to an external service failed. Please try again later`;
    }

    throw new CommonError(
      data.message || `External service failed. ErrorCode: ${data.errorCode}`,
      data
    );
  }
};




