import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { clear } from '../other';

const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;


beforeAll(() => {
    clear();
    request('DELETE', SERVER_URL + '/v1/clear');
});
beforeEach(() => {
    clear();
    request('DELETE', SERVER_URL + '/v1/clear');
});

describe('Admin user register', () => {
    test('should return 200, correct input', () => {
        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect("token" in result).toStrictEqual(true);
        expect(res.statusCode).toBe(200);

    });

    test('should return email existed', () => {
        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let res = request('POST', adminUserRegister, {
            json: user
        });
        const new_user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        res = request('POST', adminUserRegister, {
            json: new_user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'email existed' });
    })

    test('should return Invalid email format', () => {
        const user = {
            email: 'test163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'email should have specific format' });
    })

    test('should return Invalid password length', () => {
        const user = {
            email: 'test@163.com',
            password: '123456',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'Password should be between 8 to 20 characters' });
    })

    test('should return Invalid password contains', () => {
        const user = {
            email: 'test@163.com',
            password: '123456789',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'Password should contain at least one number and at least one letter' });
    })

    test('should return Invalid NameFirst contains', () => {
        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Vic_tor',
            nameLast: 'Xiao'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
    })

    test('should return Invalid NameFirst length', () => {
        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'V',
            nameLast: 'Xiao'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'NameFirst should be between 2 to 20 characters' });
    })

    test('should return Invalid NameLast contains', () => {
        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xi_ao'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
    })

    test('should return Invalid NameLast length', () => {
        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiaowoshizhendebuzhidaozenmzheduo'
        }
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'NameLast should be between 2 to 20 characters' });
    })
})