import request from 'sync-request-curl';
import config from '../config.json';
import { findUserIdByToken } from '../dataStore';

const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
        json: {
            email: 'test@email.com',
            password: 'newPassword123',
            nameFirst: 'Kelvin',
            nameLast: 'Yoga'
        }
    }
);

describe('Quiz create test: ', () => {
    test('test succesfull: ', () => {
        const token1 = JSON.parse(res.body as string);
        const res1 = request(
            'POST',
            SERVER_URL + '/v1/admin/quiz',
            {
                json: {
                    qs: token1,
                    name: "Test Quiz",
                    description: "This is a quiz for test"
                }
            }
        )
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(OK);
        expect(result).toStrictEqual({});
    });
});
