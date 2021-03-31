const BaseQueue = 'Common.Queue';

export const VotingQueue = `${BaseQueue}.Proposals.Voting`;

export const FinalizeProposalQueue = `${BaseQueue}.Proposals.Finalize`;
export const ExpireProposalsQueue = `${BaseQueue}.Proposals.Expire`;
export const ProcessProposalPayment = `${BaseQueue}.Proposals.Payments.Process`;

export const EventsQueue = `${BaseQueue}.Events`;

export const PaymentsProcessingQueue = `${BaseQueue}.Payments.Processing`;
