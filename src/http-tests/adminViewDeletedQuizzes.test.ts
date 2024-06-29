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

const reg1 = request(
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
const token1 = JSON.parse(reg1.body as string).token;

const reg2 = request(
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
const token2 = JSON.parse(reg2.body as string).token;

const QC1 = request(
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
const targetId = JSON.parse(QC1.body as string).quizId;

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

describe('View deleted quiz test: ', () => {
    test('test token error: ', () => {
        const res = request(
            'GET',
            SERVER_URL + '/v1/admin/quiz/trash',
            {
                qs: {
                    token: token1+1
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(401);
    });

    test('test succesfull: ', () => {
        const res = request(
            'GET',
            SERVER_URL + '/v1/admin/quiz/trash',
            {
                qs: {
                    token: token1
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(OK);
        expect(result.quizzes[0].name).toStrictEqual("Test Quiz");
    });
});
