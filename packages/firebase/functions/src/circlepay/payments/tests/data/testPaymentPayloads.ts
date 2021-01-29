export const createPaymentInvalidPayload = {
  userId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  cardId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  proposalId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  ipAddress: '127.0.0.1',
  sessionId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  amount: 10000,
  type: 'subscription'
};

export const createPaymentValidPayload = {
  userId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  cardId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  proposalId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  ipAddress: '127.0.0.1',
  sessionId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  amount: 10000,
  type: 'one-time'
};

export const createProposalPaymentInvalidPayload = {
  proposalId: 'malformed-proposal-id',
  sessionId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  ipAddress: '127.0.0.1'
};

export const createProposalPaymentValidPayload = {
  proposalId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  sessionId: 'ae6b689c-5dcb-41ed-84a7-51e6ce7faa76',
  ipAddress: '127.0.0.1'
};