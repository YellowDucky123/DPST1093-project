import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
    request('DELETE', SERVER_URL + '/v1/clear');
})

request('DELETE', `${url}:${port}/v1/clear`);

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
const token1 = JSON.parse(res.body as string).token;


describe('Quiz create test: ', () => {
    test('test succesfull: ', () => {
        const res1 = request(
            'POST',
            SERVER_URL + '/v1/admin/quiz',
            {
                json: {
                    token: token1,
                    name: "Test Quiz",
                    description: "This is a quiz for test"
                }
            }
        )
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(OK);
        expect(result).toStrictEqual({
            quizId: result.quizId
        });
    });

    test('test invalid name: ', () => {
        const res1 = request(
            'POST',
            SERVER_URL + '/v1/admin/quiz',
            {
                json: {
                    token: token1,
                    name: "Te",
                    description: "This is a quiz for test"
                }
            }
        )
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(400);
        expect(result).toStrictEqual({"error": "adminQuizCreate: invalid quiz name length"});
    });

    test('test invalid description: ', () => {
        let long = [];
        for (let i = 0; i < 120; ++i) {
            long.push('1');
        }
        const res1 = request(
            'POST',
            SERVER_URL + '/v1/admin/quiz',
            {
                json: {
                    token: token1,
                    name: "Test Quiz 2",
                    description: long
                }
            }
        )
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(400);
        expect(result).toStrictEqual({"error": "adminQuizCreate: quiz description is too long"});
    });

    test('test quiz name already used: ', () => {
        const res1 = request(
            'POST',
            SERVER_URL + '/v1/admin/quiz',
            {
                json: {
                    token: token1,
                    name: "Test Quiz",
                    description: "This is test"
                }
            }
        )
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(400);
        expect(result).toStrictEqual({"error": "adminQuizCreate: quiz name already used by another user"});
    });

    test('test token error: ', () => {
        const res1 = request(
            'POST',
            SERVER_URL + '/v1/admin/quiz',
            {
                json: {
                    token: token1+1,
                    name: "Test Quiz 3",
                    description: "This is a quiz for test"
                }
            }
        )
        const result = JSON.parse(res1.body as string);
        expect(res1.statusCode).toBe(401);
    });
});
