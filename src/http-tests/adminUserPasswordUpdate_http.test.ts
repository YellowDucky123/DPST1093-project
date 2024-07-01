import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { clear } from '../other';

const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;
const adminUserLogin = `${SERVER_URL}/v1/admin/auth/login`;
const adminUserPasswordUpdate = `${SERVER_URL}/v1/admin/user/password`;

beforeAll(() => {
  clear();
  request('DELETE', SERVER_URL + '/v1/clear');
});
beforeEach(() => {
  clear();
  request('DELETE', SERVER_URL + '/v1/clear');
  const user = {
    email: 'test@163.com',
    password: '123456aaaa',
    nameFirst: 'Victor',
    nameLast: 'Xiao'
  };
  request('POST', adminUserRegister, {
    json: user
  });
});

describe('Admin user password change', () => {
  test('should return correct password change', () => {
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    const res = request('POST', adminUserLogin, {
      json: newUser
    });

    const result = JSON.parse(res.body as string);
    const newToken = result.token;
    const newPassword = {
      token: newToken,
      oldPassword: '123456aaaa',
      newPassword: '123456bbbb'
    };
    const newRes = request('PUT', adminUserPasswordUpdate, {
      json: newPassword
    });
    const newResult = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(200);
    expect(newResult).toStrictEqual({});
  });

  test('should return wrong password input', () => {
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    const res = request('POST', adminUserLogin, {
      json: newUser
    });

    const result = JSON.parse(res.body as string);
    const newToken = result.token;
    const newPassword = {
      token: newToken,
      oldPassword: '123456aabb',
      newPassword: '123456bbbb'
    };
    const newRes = request('PUT', adminUserPasswordUpdate, {
      json: newPassword
    });
    const newResult = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(400);
    expect(newResult).toStrictEqual({ error: 'password incorrecrt' });
  });

  test('should return old password and new password cannot be the same', () => {
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    const res = request('POST', adminUserLogin, {
      json: newUser
    });

    const result = JSON.parse(res.body as string);
    const newToken = result.token;
    const newPassword = {
      token: newToken,
      oldPassword: '123456aaaa',
      newPassword: '123456aaaa'
    };
    const newRes = request('PUT', adminUserPasswordUpdate, {
      json: newPassword
    });
    const newResult = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(400);
    expect(newResult).toStrictEqual({ error: "new Password can't be the old password" });
  });

  test('should return password has already been used before', () => {
    const oldUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    const res = request('POST', adminUserLogin, {
      json: oldUser
    });

    const result = JSON.parse(res.body as string);
    const oldToken = result.token;
    const oldPassword = {
      token: oldToken,
      oldPassword: '123456aaaa',
      newPassword: '123456bbbb'
    };
    request('PUT', adminUserPasswordUpdate, {
      json: oldPassword
    });
    const newPassword = {
      token: oldToken,
      oldPassword: '123456bbbb',
      newPassword: '123456aaaa'
    };
    const newRes = request('PUT', adminUserPasswordUpdate, {
      json: newPassword
    });
    const newResult = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(400);
    expect(newResult).toStrictEqual({ error: 'This password has been used in past' });
  });

  test('should return new password length wrong', () => {
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    const res = request('POST', adminUserLogin, {
      json: newUser
    });

    const result = JSON.parse(res.body as string);
    const newToken = result.token;
    const newPassword = {
      token: newToken,
      oldPassword: '123456aaaa',
      newPassword: '12bbbb'
    };
    const newRes = request('PUT', adminUserPasswordUpdate, {
      json: newPassword
    });
    const newResult = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(400);
    expect(newResult).toStrictEqual({ error: 'Password should be at least than 8 characters' });
  });

  test('should return new password contains wrong', () => {
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    const res = request('POST', adminUserLogin, {
      json: newUser
    });

    const result = JSON.parse(res.body as string);
    const newToken = result.token;
    const newPassword = {
      token: newToken,
      oldPassword: '123456aaaa',
      newPassword: '123456789'
    };
    const newRes = request('PUT', adminUserPasswordUpdate, {
      json: newPassword
    });
    const newResult = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(400);
    expect(newResult).toStrictEqual({ error: 'Password should contain at least one number and at least one letter' });
  });

  test('should return token is empty or invalid', () => {
    const newUser = {
      email: 'test@163.com',
      password: '123456aaaa',
    };
    request('POST', adminUserLogin, {
      json: newUser
    });
    const newPassword = {
      token: 'InvalidToken',
      oldPassword: '123456aaaa',
      newPassword: '123456aabb'
    };
    const newRes = request('PUT', adminUserPasswordUpdate, {
      json: newPassword
    });
    const newResult = JSON.parse(newRes.body as string);
    expect(newRes.statusCode).toBe(401);
    expect(newResult).toStrictEqual({ error: 'the token is incorrect or not found' });
  });
});
