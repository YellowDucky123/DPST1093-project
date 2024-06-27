import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

beforeAll(() => {
    request(
        'DELETE',
        SERVER_URL + '/v1/clear',
        {
            qs: {}
        }
    )
})
afterAll(() => {
    request(
        'DELETE',
        SERVER_URL + '/v1/clear',
        {
            qs: {}
        }
    )
})
//create user 1
const u1 = request(
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
)
const u_id = JSON.parse(u1.body as string);

//create user2
const u2 = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
        json: {
            email: 'testh@email.com',
            password: 'newPassword123',
            nameFirst: 'Kelvin',
            nameLast: 'Yoga'
        }
    }
)
const u2_id = JSON.parse(u2.body as string);

//create quiz1
const q1 = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
        json: {
            authUserId: u_id.authUserId,
            name: 'old quiz name',
            description: 'describing'
        }
    }
)
const q_id = JSON.parse(q1.body as string);

//create quiz2
const q2 = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
        json: {
            authUserId: u2_id.authUserId,
            name: 'old quiz2',
            description: 'descrie'
        }
    }
)
const q2_id = JSON.parse(q2.body as string);

/////////////////////////////////////////////////////////////////////////////////
describe('Update Quiz Description http test: ', () => {
    test('test succesfull: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/description`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q_id.quizId,
                    name: 'new name'
                },
                timeout: 100
            }
        )
        console.log(q_id.quizId);
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(OK);
        expect(result).toStrictEqual({});
    });

    test('invalid quizId: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId + 1}/description`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q_id.quizId + 1,
                    name: 'new name'
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(INPUT_ERROR);
        expect(result).toStrictEqual({ error: 'Quiz Id invalid' });
    });

    test('invalid userId', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/description`,
            {
                json: {
                    authUserId: u_id.authUserId + 1,
                    quizId: q_id.quizId,
                    name: 'new name'
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(result.statusCode).toBe(TOKEN_ERROR);
        expect(result).toStrictEqual({ error: 'User Id invalid' });
    });

    
    test('Description too long', () => {
        let input: any = [];
        for(let i = 0; i < 101; i++) {
            input[i] += 'a';
        }

        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/description`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q2_id.quizId,
                    description: input
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(INPUT_ERROR);
        expect(result).toStrictEqual({ error: 'Description too long' });
    });

    test('User does not have ownership: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/description`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q2_id.quizId,
                    name: 'New Name'
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(result.statusCode).toBe(403);
        expect(result).toStrictEqual({ error: 'This user does not own this quiz'});
    });
});
