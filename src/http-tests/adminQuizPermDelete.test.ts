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

const register = request(
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
const token1 = JSON.parse(register.body as string).token;

const register2 = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
        json: {
            email: 'test2@email.com',
            password: 'newPassword123',
            nameFirst: 'Kei',
            nameLast: 'Ikushima'
        }
    }
);
const token2 = JSON.parse(register2.body as string).token;

const QC = request(
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
const targetId = JSON.parse(QC.body as string).quizId;

request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/'+targetId,
    {
        qs: {
            token: token1,
            quizId: targetId
        }
    }
)

const QC2 = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
        json: {
            token: token1,
            name: "Test Quiz 2",
            description: "This is a quiz 2 for test"
        }
    }
)
const targetId2 = JSON.parse(QC2.body as string).quizId;

request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/'+targetId2,
    {
        qs: {
            token: token1,
            quizId: targetId2
        }
    }
)

const before = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/trash',
    {
        qs: {
            token: token1
        }
    }
)
const beforeRes = JSON.parse(before.body as string);

describe('Empty trash test: ', () => {
    test('test token error: ', () => {
        const res1 = request(
            'DELETE',
            SERVER_URL + '/v1/admin/quiz/trash/empty',
            {
                qs: {
                    token: token1+1,
                    quizIds: [targetId, targetId2]
                }
            }
        )
        const res2 = request(
            'GET',
            SERVER_URL + '/v1/admin/quiz/trash',
            {
                qs: {
                    token: token1
                }
            }
        )
        const result = JSON.parse(res2.body as string);
        expect(res1.statusCode).toBe(401);
    });

    test('test quizId not exist: ', () => {
        const res1 = request(
            'DELETE',
            SERVER_URL + '/v1/admin/quiz/trash/empty',
            {
                qs: {
                    token: token1,
                    quizIds: [targetId, targetId2, 1]
                }
            }
        )
        const res2 = request(
            'GET',
            SERVER_URL + '/v1/admin/quiz/trash',
            {
                qs: {
                    token: token1
                }
            }
        )
        const result = JSON.parse(res2.body as string);
        expect(res1.statusCode).toBe(400);
    });

    test('test do not own: ', () => {
        const res1 = request(
            'DELETE',
            SERVER_URL + '/v1/admin/quiz/trash/empty',
            {
                qs: {
                    token: token2,
                    quizIds: [targetId, targetId2]
                }
            }
        )
        const res2 = request(
            'GET',
            SERVER_URL + '/v1/admin/quiz/trash',
            {
                qs: {
                    token: token2
                }
            }
        )
        const result = JSON.parse(res2.body as string);
        expect(res1.statusCode).toBe(403);
    });

    test('test succesfull: ', () => {
        const res1 = request(
            'DELETE',
            SERVER_URL + '/v1/admin/quiz/trash/empty',
            {
                qs: {
                    token: token1,
                    quizIds: [targetId, targetId2]
                }
            }
        )
        const res2 = request(
            'GET',
            SERVER_URL + '/v1/admin/quiz/trash',
            {
                qs: {
                    token: token1
                }
            }
        )
        const result = JSON.parse(res2.body as string);
        expect(res1.statusCode).toBe(OK);
        expect(result).toStrictEqual({
            quizzes: []
        });
    });
});
