export const getTestAuthToken = (userId = 'test-user'): string => JSON.stringify({
  uid: userId
});