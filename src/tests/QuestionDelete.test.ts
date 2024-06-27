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

const qs1 = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/question`,
    {
        json: {
            authUserId: u_id.authUserId,
            quizId: q_id.quizId,
            question: 
        }
    }
)