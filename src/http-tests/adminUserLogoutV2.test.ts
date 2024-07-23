import request from 'sync-request-curl';
import config from '../config.json';
import { testRegisterUser, testAdminLogout } from './testFunc';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
    request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);

const token1 = testRegisterUser("test@email.com", 'newPassword123', 'Vic', 'Xiao');

describe('Admin logout test: ', () => {
    test('test succesfull: ', () => {
        const res1 = testAdminLogout(token1);
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(OK);
        expect(result).toStrictEqual({
        });
    });
    test('test succesfull: ', () => {
        const res1 = testAdminLogout('1');
        expect(res1.statusCode).toBe(401);
    });
});
