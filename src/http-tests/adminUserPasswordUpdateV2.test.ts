import request from 'sync-request-curl';
import config from '../config.json';
import { testRegisterUser, testAdminUserPassword } from './testFunc';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
    request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);

const token1 = testRegisterUser("test@email.com", 'Xiao12345', 'Vic', 'Xiao');

describe('Admin password test: ', () => {
    test('test succesfull: ', () => {
        const res1 = testAdminUserPassword(token1, 'Xiao12345', 'xiaO12345');
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(OK);
        expect(result).toStrictEqual({
        });
    });
    test('old password incorrect', () => {
        const res1 = testAdminUserPassword(token1, 'xiao12345', 'xiaO12345');
        expect(res1.statusCode).toBe(400);
    });
    test('old password and new password are the same', () => {
        const res1 = testAdminUserPassword(token1, 'Xiao12345', 'Xiao12345');
        expect(res1.statusCode).toBe(400);
    });
    test('old password incorrect', () => {
        const res1 = testAdminUserPassword(token1, 'Xiao12345', 'xiaO12345');
        const res2 = testAdminUserPassword(token1, 'xiaO12345', 'Xiao12345');
        expect(res2.statusCode).toBe(400);
    });
    test('new password length less than 8', () => {
        const res1 = testAdminUserPassword(token1, 'Xiao12345', 'Xiao123');
        expect(res1.statusCode).toBe(400);
    });
    test('new password incorrect', () => {
        const res1 = testAdminUserPassword(token1, 'Xiao12345', 'xiao12345');
        expect(res1.statusCode).toBe(400);
    });
    test('test succesfull: ', () => {
        const res1 = testAdminUserPassword('123', 'Xiao12345', 'xiaO12345');
        expect(res1.statusCode).toBe(401);
    });
});
