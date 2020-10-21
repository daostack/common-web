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

    console.log('External request made successfully');

    return result;
  } catch (e) {
    throw new CommonError(
      data.message || `External service failed. ErrorCode: ${data.errorCode}`,
      data.userMessage || `A call to an external service failed. Please try again later`,
      {
        ...data
      }
    );
  }
};




