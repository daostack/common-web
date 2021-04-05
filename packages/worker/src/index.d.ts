/// <reference types="bull" />
export declare const worker: {
    addPaymentJob: (job: "process" | "updateStatus", paymentId: string, options?: import("bull").JobOptions | undefined) => void;
    addVotesJob: (job: "processVote", voteId: string, options?: import("bull").JobOptions | undefined) => void;
};
