import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
// const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const port = config.port;
const url = config.url;
const PATH = `${url}:${port}/v1/admin/user/details`;
beforeAll(() => (request('DELETE', url + ':' + port + '/v1/clear')));
afterAll(() => (request('DELETE', url + ':' + port + '/v1/clear')));
describe('test for adminUserDetails.PUT.v1', () => {
  const details: {token? :string, email? : string, nameFirst?: string, nameLast?: string} = { email: 'test@email.com', nameFirst: 'name', nameLast: 'test' };
  test('test for error token', () => {
    let res = request('PUT', `${PATH}`, { json: details });
    expect(res.statusCode).toBe(TOKEN_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'A token is required' });
    details.token = '1';
    res = request('PUT', `${PATH}`, { json: details });
    expect(res.statusCode).toBe(TOKEN_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'token incorrect or not found' });
    res = request('PUT', `${PATH}`, { json: details });
  });
  test('test for change email', () => {
    // create a user
    let res = request('POST', `${url}:${port}/v1/admin/auth/register`, { json: { email: details.email, password: 'testRunning123', nameFirst: details.nameFirst, nameLast: details.nameLast } });
    const token = JSON.parse(res.body as string);
    details.token = token.token;
    res = request('PUT', PATH, { json: details });
    expect(JSON.parse(res.body as string)).toEqual({});
    expect(res.statusCode).toBe(OK);

    // test if error email is used
    details.email = 'erroremail.com';
    res = request('PUT', PATH, { json: details });
    expect(JSON.parse(res.body as string)).toEqual({ error: 'email should have specific format' });
    expect(res.statusCode).toBe(400);
    details.email = 'test@email.com';
    res = request('GET', url + ':' + port + '/v1/admin/user/details?token=' + details.token);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });

    // test if change a email successfully
    details.email = 'newemail@email.com';
    res = request('PUT', PATH, { json: details });
    expect(JSON.parse(res.body as string)).toEqual({});
    expect(res.statusCode).toBe(OK);
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });

    // test create a new user
    details.email = 'test@email.com';
    res = request('POST', `${url}:${port}/v1/admin/auth/register`, { json: { email: details.email, password: 'testRunning123', nameFirst: details.nameFirst, nameLast: details.nameLast } });
    expect(res.statusCode).toBe(OK);

    // test if used a used email to change
    res = request('PUT', PATH, { json: details });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'email existed' });
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: 'newemail@email.com',
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    details.email = 'newemail@email.com';
  });
  test('test for change name', () => {
    // change user name
    details.nameFirst = 'newFirstName';
    details.nameLast = 'newLastName';
    let res = request('PUT', PATH, { json: details });
    expect(JSON.parse(res.body as string)).toEqual({});
    expect(res.statusCode).toBe(OK);
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
  });
  test('test for change nameFirst with contains stange typy', () => {
    // change user nameFirst with complex elmement
    details.nameFirst = "low UP --- '''";
    let res = request('PUT', PATH, { json: details });
    expect(JSON.parse(res.body as string)).toEqual({});
    expect(res.statusCode).toBe(OK);
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });

    // change user nameFirst with contains stange typy
    details.nameFirst = '\\\\';
    res = request('PUT', PATH, { json: details });
    details.nameFirst = "low UP --- '''";
    expect(JSON.parse(res.body as string)).toEqual({ error: 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
    expect(res.statusCode).toBe(400);
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
  });
  test('test for change nameLast with contains stange typy', () => {
    // change user nameLast with complex elmement
    details.nameLast = "low UP --- '''";
    let res = request('PUT', PATH, { json: details });
    expect(JSON.parse(res.body as string)).toEqual({});
    expect(res.statusCode).toBe(OK);
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });

    // change user nameLast with contains stange typy
    details.nameLast = '++++';
    res = request('PUT', PATH, { json: details });
    expect(JSON.parse(res.body as string)).toEqual({ error: 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
    details.nameLast = "low UP --- '''";
    expect(res.statusCode).toBe(400);
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
  });
  test('test for change nameFirst with incorrect name lenth', () => {
    // check nameFirst with too short letter
    details.nameFirst = 'A';
    let res = request('PUT', PATH, { json: details });
    details.nameFirst = "low UP --- '''";
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'NameFirst should be between 2 to 20 characters' });
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    // check nameFirst with too long letter
    details.nameFirst = 'ABCDEABCDEABCDEABCDEA';
    res = request('PUT', PATH, { json: details });
    details.nameFirst = "low UP --- '''";
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'NameFirst should be between 2 to 20 characters' });
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
  });
  test('test for change nameLast with incorrect name lenth', () => {
    // check nameLast with too short letter
    details.nameLast = 'A';
    let res = request('PUT', PATH, { json: details });
    details.nameLast = "low UP --- '''";
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'NameLast should be between 2 to 20 characters' });
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });

    // check nameLast with too long letter
    details.nameLast = 'ABCDEABCDEABCDEABCDEA';
    res = request('PUT', PATH, { json: details });
    details.nameLast = "low UP --- '''";
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'NameLast should be between 2 to 20 characters' });
    res = request('GET', `${url}:${port}/v1/admin/user/details?token=${details.token}`);
    expect(JSON.parse(res.body as string)).toEqual({
      user: {
        userId: expect.any(Number),
        email: details.email,
        name: details.nameFirst + ' ' + details.nameLast,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
  });
});
