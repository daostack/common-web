import Queue from 'bull';
declare type VotesQueueJob = 'processVote';
export declare const addVotesJob: (job: VotesQueueJob, voteId: string, options?: Queue.JobOptions | undefined) => void;
export {};
