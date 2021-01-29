import supertest from 'supertest';
import * as functions from '../../..';

export const commonApp = supertest(functions.commons);
export const circleApp = supertest(functions.circlepay);
export const proposalsApp = supertest(functions.proposals);