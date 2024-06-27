import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

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
        json: {
            token: token1,
            quizId: targetId
        }
    }
)

describe('View deleted quiz test: ', () => {
    test('test succesfull: ', () => {
        const res = request(
            'GET',
            SERVER_URL + '/v1/admin/quiz/trash',
            {
                json: {
                    token: token1
                }
            }
        )
        const result = JSON.parse(res.body as string);
        //expect(res.statusCode).toBe(OK);
        expect(result).toStrictEqual({});
    });
});
