import supertest from 'supertest';
import * as functions from '../../functions/src';

export const commonApp = supertest(functions.commons);
export const proposalsApp = supertest(functions.proposals);