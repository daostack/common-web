export const getTestAuthenticationToken = (userId = 'test-user'): string => JSON.stringify({
  uid: userId
});