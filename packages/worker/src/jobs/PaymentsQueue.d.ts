import Queue from 'bull';
declare type PaymentsQueueJob = 'process' | 'updateStatus';
export declare const addPaymentJob: (job: PaymentsQueueJob, paymentId: string, options?: Queue.JobOptions | undefined) => void;
export {};
