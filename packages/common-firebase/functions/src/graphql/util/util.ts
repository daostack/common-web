import { CommonError } from '../../util/errors';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validateBlockNumber = (blockNumber: any) : number | null => {
    let currBlockNumber: number | any = null;
    if (blockNumber) {
        currBlockNumber = Number(blockNumber);
        if (Number.isNaN(currBlockNumber)) {
            throw new CommonError(`The blockNumber parameter should be a number between 0 and ${Number.MAX_SAFE_INTEGER}`);
        }
    }
    return currBlockNumber;
}