import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
// const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;
request('DELETE', `${url}:${port}/v2/clear`);
describe("Tests for 'get' /v2/admin/user/details", () => {
  let token1 = { token: '1' };
  // test when no token sent
  test('no token send', () => {
    const res = request('GET', `${url}:${port}/v2/admin/user/details`);

    expect(res.statusCode).toBe(401);
  });
  // test when token is not valid
  test('send unused token', () => {
    const res = request('GET', `${url}:${port}/v2/admin/user/details`, { headers: token1 });
    expect(res.statusCode).toBe(401);
  });
  // test when token suitable
  test('Should return 200 OK', () => {
    const user = {
      email: 'test@unsw.edu.au',
      password: 'testingUsed123',
      nameFirst: 'test',
      nameLast: 'test'
    };
    const res1 = request('POST', `${url}:${port}/v2/admin/auth/register`, { json: user });
    token1 = JSON.parse(res1.body as string);
    const res = request('GET', `${url}:${port}/v2/admin/user/details`, { headers: token1 });
    expect(res.statusCode).toBe(OK);
    const list = JSON.parse(res.body as string);
    expect('user' in list).toBe(true);
    const content = list.user;
    expect(typeof content.userId).toBe('number');
    expect(content.name).toBe('test test');
    expect(content.email).toBe('test@unsw.edu.au');
    expect(content.numSuccessfulLogins).toBe(1);
    expect(content.numFailedPasswordsSinceLastLogin).toBe(0);
  });

  test('check someone logined several times', () => {
    // logout and login again
    request('POST', url + ':' + port + '/v2/admin/auth/logout', { headers: token1 });
    token1 = JSON.parse(request('POST', url + ':' + port + '/v2/admin/auth/login', { json: { email: 'test@unsw.edu.au', password: 'testingUsed123' } }).body as string);
    let res = request('GET', `${url}:${port}/v2/admin/user/details`, { headers: token1 });
    // check the details of the user//
    expect(res.statusCode).toBe(OK);
    let list = JSON.parse(res.body as string);
    expect('user' in list).toBe(true);
    const content = list.user;
    expect(typeof content.userId).toBe('number');
    expect(content.name).toBe('test test');
    expect(content.email).toBe('test@unsw.edu.au');
    expect(content.numSuccessfulLogins).toBe(2);
    expect(content.numFailedPasswordsSinceLastLogin).toBe(0);

    // logout and login again
    request('POST', url + ':' + port + '/v1/admin/auth/logout', { json: token1 });
    token1 = JSON.parse(request('POST', url + ':' + port + '/v1/admin/auth/login', { json: { email: 'test@unsw.edu.au', password: 'testingUsed123' } }).body as string);
    // check the details of the user
    res = request('GET', `${url}:${port}/v1/admin/user/details`, { qs: token1 });
    expect(res.statusCode).toBe(OK);
    list = JSON.parse(res.body as string);
    expect('user' in list).toBe(true);
    expect(list.user.numSuccessfulLogins).toBe(3);
    // logout and login again
    request('POST', url + ':' + port + '/v1/admin/auth/logout', { json: token1 });
    token1 = JSON.parse(request('POST', url + ':' + port + '/v1/admin/auth/login', { json: { email: 'test@unsw.edu.au', password: 'testingUsed123' } }).body as string);
    // check the details of the user
    res = request('GET', `${url}:${port}/v1/admin/user/details`, { qs: token1 });
    expect(res.statusCode).toBe(OK);
    list = JSON.parse(res.body as string);
    expect('user' in list).toBe(true);
    expect(list.user.numSuccessfulLogins).toBe(4);
  });

  test('check someone login failed several times', () => {
    // login twice with error password
    request('POST', url + ':' + port + '/v2/admin/auth/login', { json: { email: 'test@unsw.edu.au', password: 'testingUsed23' } });
    request('POST', url + ':' + port + '/v2/admin/auth/login', { json: { email: 'test@unsw.edu.au', password: 'testingUsed23' } });
    // check the details of the user
    let res = request('GET', `${url}:${port}/v2/admin/user/details`, { headers: token1 });
    expect(res.statusCode).toBe(OK);
    let list = JSON.parse(res.body as string);
    expect('user' in list).toBe(true);
    expect(list.user.numFailedPasswordsSinceLastLogin).toBe(2);
    // login with error passwordn
    request('POST', url + ':' + port + '/v2/admin/auth/login', { json: { email: 'test@unsw.edu.au', password: 'testingUsed23' } });
    // check the details of the user
    res = request('GET', `${url}:${port}/v2/admin/user/details`, { headers: token1 });
    expect(res.statusCode).toBe(OK);
    list = JSON.parse(res.body as string);
    expect('user' in list).toBe(true);
    expect(list.user.numFailedPasswordsSinceLastLogin).toBe(3);
  });
});
afterAll(() => request('DELETE', `${url}:${port}/v2/clear`));
