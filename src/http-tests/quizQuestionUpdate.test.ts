import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { getData } from '../dataStore';
import { get } from 'http';

const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;
const createNewQuiz = `${SERVER_URL}/v1/admin/quiz`;
beforeAll(() =>{
    request('DELETE', SERVER_URL + '/v1/clear');
});

beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear');
})

describe('Quiz question update', () => {
    test('should return 200, correct input', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;
        console.log(token);

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;
        console.log(quiz_id);

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;

        console.log(questionId);


        let new_details = {
            token: token,
            questionBody: {
                question: "hello word",
                duration: 9,
                points: 4,
                answers: [
                    {
                        answer: "yess",
                        correct: true
                    },
                    {
                        answer: "nos",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({});
    });
})