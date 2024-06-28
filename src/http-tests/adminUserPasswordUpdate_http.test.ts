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
    }
    request('POST', adminUserRegister, {
        json: user
    });
});

describe('Admin user password change', () => {
    test('should return correct password change', () => {
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });

        let result = JSON.parse(res.body as string);
        let new_token = result.token;
        const new_password = {
            token: new_token,
            oldPassword: '123456aaaa',
            newPassword: '123456bbbb'
        }
        let new_res = request('PUT', adminUserPasswordUpdate, {
            json: new_password
        });
        let new_result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(200);
        expect(new_result).toStrictEqual({});
    })

    test('should return wrong password input', () => {
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });

        let result = JSON.parse(res.body as string);
        let new_token = result.token;
        const new_password = {
            token: new_token,
            oldPassword: '123456aabb',
            newPassword: '123456bbbb'
        }
        let new_res = request('PUT', adminUserPasswordUpdate, {
            json: new_password
        });
        let new_result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(400);
        expect(new_result).toStrictEqual({ "error": "password incorrecrt" });
    })

    test('should return old password and new password cannot be the same', () => {
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });

        let result = JSON.parse(res.body as string);
        let new_token = result.token;
        const new_password = {
            token: new_token,
            oldPassword: '123456aaaa',
            newPassword: '123456aaaa'
        }
        let new_res = request('PUT', adminUserPasswordUpdate, {
            json: new_password
        });
        let new_result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(400);
        expect(new_result).toStrictEqual({ "error": "new Password can't be the old password" });
    })

    test('should return password has already been used before', () => {
        const old_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: old_user
        });

        let result = JSON.parse(res.body as string);
        let old_token = result.token;
        const old_password = {
            token: old_token,
            oldPassword: '123456aaaa',
            newPassword: '123456bbbb'
        }
        request('PUT', adminUserPasswordUpdate, {
            json: old_password
        });
        const new_password = {
            token: old_token,
            oldPassword: '123456bbbb',
            newPassword: '123456aaaa'
        }
        let new_res = request('PUT', adminUserPasswordUpdate, {
            json: new_password
        });
        let new_result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(400);
        expect(new_result).toStrictEqual({ "error": "This password has been used in past" });
    })

    test('should return new password length wrong', () => {
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });

        let result = JSON.parse(res.body as string);
        let new_token = result.token;
        const new_password = {
            token: new_token,
            oldPassword: '123456aaaa',
            newPassword: '12bbbb'
        }
        let new_res = request('PUT', adminUserPasswordUpdate, {
            json: new_password
        });
        let new_result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(400);
        expect(new_result).toStrictEqual({ "error": "Password should be at least than 8 characters" });
    })

    test('should return new password contains wrong', () => {
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });

        let result = JSON.parse(res.body as string);
        let new_token = result.token;
        const new_password = {
            token: new_token,
            oldPassword: '123456aaaa',
            newPassword: '123456789'
        }
        let new_res = request('PUT', adminUserPasswordUpdate, {
            json: new_password
        });
        let new_result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(400);
        expect(new_result).toStrictEqual({ "error": "Password should contain at least one number and at least one letter" });
    })

    test('should return token is empty or invalid', () => {

        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });
        const new_password = {
            token: 'InvalidToken',
            oldPassword: '123456aaaa',
            newPassword: '123456aabb'
        }
        let new_res = request('PUT', adminUserPasswordUpdate, {
            json: new_password
        });
        let new_result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(401);
        expect(new_result).toStrictEqual({ "error": "the token is incorrect or not found" });
    })
})