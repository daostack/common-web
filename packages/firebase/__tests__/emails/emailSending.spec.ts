import { getTemplatedEmail } from '../../functions/src/notification/email';
import { runTest } from '../helpers/runTest';
import '../../functions/src';

const requestToJoinStubs = {
  userName: 'Test Name',
  link: 'https://google.com',
  commonName: 'Test Common Name',
  fromEmail: 'staging@common.io',
};

const requestToJoinPartialStubs = {
  userName: 'Test Name'
};

runTest(async () => {
  it('should be successful with all stubs', () => {
    const templatedEmail = getTemplatedEmail('requestToJoinSubmitted', {
      emailStubs: requestToJoinStubs
    });

    expect(templatedEmail).not.toBe(null);
    expect(templatedEmail).not.toBe(undefined);
  });

  it('should produce the same email for the same stubs', () => {
    const templatedEmail = getTemplatedEmail('requestToJoinSubmitted', {
      emailStubs: requestToJoinStubs
    });

    expect(templatedEmail).toMatchSnapshot();
  });

  it('should throw on missing stub', () => {
    expect(() => {
      getTemplatedEmail('requestToJoinSubmitted', {
        emailStubs: requestToJoinPartialStubs
      })
    }).toThrow();
  });
})