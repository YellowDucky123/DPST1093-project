import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
    request(
        'DELETE', SERVER_URL + '/v1/clear'
    )
})

request(
    'DELETE',
    SERVER_URL + '/v1/clear',
)
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
const t_id = JSON.parse(u1.body as string);

//create quiz1
const q1 = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
        json: {
            token: t_id.token,
            name: 'old quiz name',
            description: 'describing'
        }
    }
)
const q_id = JSON.parse(q1.body as string);

const ques = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/question`,
    {
        json: {
            token: t_id.token,
            questionBody: {
                question: "Who is the Monarch of England?",
                duration: 4,
                points: 5,
                answers: [
                    {
                        answer: "Prince Charles",
                        correct: true
                    }
                ]
            }
        }
    }
)
const ques_id = JSON.parse(ques.body as string);

//////////////////////////////////////////////////////////////////////////////////////////////
describe('Duplicate Question test :', () => {
    test('test succesfull:', () => {
        const res = request(
            'POST',
            SERVER_URL + `/v1/admin/quiz/${q_id.quizId}/question/${ques_id.questionId}`,
            {
                json: {
                    token: t_id.token
                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(OK);
        expect(result).toStrictEqual({});
    })
})