import request from 'sync-request-curl';
import config from '../config.json';
import { testCreateQuestion, testCreateQuiz, testRegisterUser, testStartSession, testUpdateThumbnail } from './testHelper';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);

const token1 = testRegisterUser("test@email.com", 'newPassword123', 'Kei', 'Ikushima');
const token2 = testRegisterUser("test2@email.com", 'newPassword123', 'Kelvin', 'Yoga');

const quizId1 = (JSON.parse(testCreateQuiz(token1, "Test Quiz", "This is test quiz").body as string)).quizId;

testCreateQuestion(token1, quizId1, 
    {
        "questionBody": {
        "question": "Who is the Monarch of England?",
        "duration": 4,
        "points": 5,
        "answers": [
            {
                "answer": "Prince Charles",
                "correct": true
            }
        ],
        "thumbnailUrl": "http://google.com/some/image/path.jpg"
    }
    }
);

describe('Quiz create test: ', () => {
  test('test succesfull: ', () => {
    const res1 = testStartSession(token1, quizId1, 30);
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(result).toStrictEqual({});
  });
});
