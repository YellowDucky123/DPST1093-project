import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { clear } from '../other';

const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;
const adminUserLogin = `${SERVER_URL}/v1/admin/auth/login`;

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
    let res = request('POST', adminUserRegister, {
        json: user
    });
});

describe('Admin user Login', () => {
    test('should return correct login', () => {
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(200);
        expect(result).toHaveProperty('token');
        expect(typeof result.token).toBe('string');
    })

    test('should return email address does not exist', () => {
        const new_user = {
            email: 'test@164.com',
            password: '123456aaaa',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: "Email address does not exist" });
    })

    test('Password is not correct for the given email', () => {
        const new_user = {
            email: 'test@163.com',
            password: '123456aaab',
        }
        let res = request('POST', adminUserLogin, {
            json: new_user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: "Passord is not correct for the given email" });
    })
});