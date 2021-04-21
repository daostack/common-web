// --- Short utils
export const sleep = (duration: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, duration));

// --- Reexports
export { poll } from './pollingUtils';
export * as stringUtils from './stringUtils';