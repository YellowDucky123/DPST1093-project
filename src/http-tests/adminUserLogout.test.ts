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
        }
        request('POST', adminUserRegister, {
            json: user
        });
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });
        let new_token = JSON.parse(res.body as string).token;
        const token = {
            token: new_token
        }
        let new_res = request('POST', adminUserLogout, {
            json: token
        });
        let result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(200);
        expect(result).toStrictEqual({});
    })

    test('should return 401 for invalid token', () => {
        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        request('POST', adminUserRegister, {
            json: user
        });
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });
        let new_token = JSON.parse(res.body as string).token;
        const token = {
            token: 'invalidToken'
        }
        let new_res = request('POST', adminUserLogout, {
            json: token
        });
        let result = JSON.parse(new_res.body as string);
        expect(new_res.statusCode).toBe(401);
        expect(result).toStrictEqual({ error: "Token is empty or invalid (does not refer to a valid logged-in user session)" });
    })
})