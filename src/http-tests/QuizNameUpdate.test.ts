import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

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
            email: 'test@email.com',
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
describe('Update Quiz Name http test: ', () => {
    test('test succesfull: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/name`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q_id.quizId,
                    name: 'new name'
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(OK);
        expect(result).toStrictEqual({});
    });

    test('invalid quizId: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId + 1}/name`,
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
    })

    test('invalid userId', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/name`,
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
    })

    test('invalid name length (too short):', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/name`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q_id.quizId,
                    name: ''
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(result.statusCode).toBe(INPUT_ERROR);
        expect(result).toStrictEqual({ error: 'Invalid name length' });
    })
    
    test('invalid name length (too long):', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/name`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q_id.quizId,
                    name: 'lllllllllllllllllllllllllllllll'
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(result.statusCode).toBe(INPUT_ERROR);
        expect(result).toStrictEqual({ error: 'Invalid name length' });
    })

    test('User does not have ownership: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/name`,
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
    })

    test('Name contains Invalid Characters :', () => {
        const res = request(
            'PUT',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/name`,
            {
                json: {
                    authUserId: u_id.authUserId,
                    quizId: q_id.quizId,
                    name: 'k@#lvin'
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(result.statusCode).toBe(INPUT_ERROR);
        expect(result).toStrictEqual({ error: 'Invalid character used in name' });
    })
});
