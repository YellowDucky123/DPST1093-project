import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { adminAuthRegister } from '../auth';
import { clear } from '../other';

const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;
console.log(adminUserRegister);
beforeAll(()=>clear())
request('DELETE', SERVER_URL+'/v1/clear')
describe('Admin user register', () => {
    test('should return 200 OK', () => {
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

    test('should return 400 Invalid email', () => {
        const user = adminAuthRegister('testtest.com', '123456', 'Victor', 'Xiao')
        const res = request('POST', adminUserRegister, {
            json: user
        });
        let result;
        try {
            result = JSON.parse(res.body as string);
        }
        catch (e) {
            result = res.body;
        }

        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'email should have specific format' });
    })
})