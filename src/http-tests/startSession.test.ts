import request from 'sync-request-curl';
import config from '../config.json';
import { testCreateQuestion, testCreateQuiz, testRegisterUser, testStartSession, testUpdateThumbnail } from './testFunc';

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
const quizId2 = (JSON.parse(testCreateQuiz(token1, "Test Quiz 2", "This is test quiz").body as string)).quizId;

testCreateQuestion(token1, quizId1, 
    {
        question: "Who is the Monarch of England?",
        duration: 4,
        points: 5,
        answers: [
            {
                answer: "Prince Charles",
                correct: true
            },
            {
                answer: "Example",
                correct: false
            }
        ],
        "thumbnailUrl": "http://google.com/some/image/path.jpg"
    }
);

describe('Start session test: ', () => {
  test('test succesfull: ', () => {
    const res1 = testStartSession(token1, quizId1, 30);
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(result).toStrictEqual({
        sessionId: result.sessionId
    });
  });
  
  test('Invalid autoStartNum: ', () => {
    const res1 = testStartSession(token1, quizId1, 100);
    expect(res1.statusCode).toBe(400);
  });

  test('Quesion empty: ', () => {
    const res1 = testStartSession(token1, quizId2, 30);
    expect(res1.statusCode).toBe(400);
  });

  test('Invalid token: ', () => {
    const res1 = testStartSession(token1+1, quizId1, 30);
    expect(res1.statusCode).toBe(401);
  });

  test('Not owning the quiz: ', () => {
    const res1 = testStartSession(token2, quizId1, 30);
    expect(res1.statusCode).toBe(403);
  });

  test('Over maximum of 10 session: ', () => {
    for(let i = 0; i < 9; ++i) {
        testStartSession(token1, quizId1, 30);
    }
    const res1 = testStartSession(token1, quizId1, 30);
    expect(res1.statusCode).toBe(400);
  });
});
