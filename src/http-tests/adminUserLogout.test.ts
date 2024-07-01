import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { clear } from '../other';
const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;
const adminUserLogin = `${SERVER_URL}/v1/admin/auth/login`;
const adminUserLogout = `${SERVER_URL}/v1/admin/auth/logout`;

beforeEach(() => {
  clear();
  request('DELETE', SERVER_URL + '/v1/clear');
});

describe('Admin user Login', () => {
  test('should return correct login', () => {
    const user = {
      email: 'test@163.com',
      password: '123456aaaa',
      nameFirst: 'Victor',
      nameLast: 'Xiao'
    };
    request('POST', adminUserRegister, {
      json: user
    });
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    const res = request('POST', adminUserLogin, {
      json: newUser
    });
    const newToken = JSON.parse(res.body as string).token;
    const token = {
      token: newToken
    };
    const newRes = request('POST', adminUserLogout, {
      json: token
    });
    const result = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(200);
    expect(result).toStrictEqual({});
  });

  test('should return 401 for invalid token', () => {
    const user = {
      email: 'test@163.com',
      password: '123456aaaa',
      nameFirst: 'Victor',
      nameLast: 'Xiao'
    };
    request('POST', adminUserRegister, {
      json: user
    });
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    request('POST', adminUserLogin, {
      json: newUser
    });
    const token = {
      token: 'invalidToken'
    };
    const newRes = request('POST', adminUserLogout, {
      json: token
    });
    const result = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(401);
    expect(result).toStrictEqual({ error: 'Token is empty or invalid (does not refer to a valid logged-in user session)' });
  });
});
