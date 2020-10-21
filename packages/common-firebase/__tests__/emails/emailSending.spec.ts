import { getTemplatedEmail } from '../../functions/src/email';
import { runTest } from '../helpers/runTest';
import '../../functions/src';

const requestToJoinStubs = {
  name: 'Test Name',
  link: 'https://google.com',
  commonName: 'Test Common Name'
};

const requestToJoinPartialStubs = {
  name: 'Test Name'
};

runTest(() => {
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