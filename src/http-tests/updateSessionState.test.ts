import request from 'sync-request-curl';
import config from '../config.json';
import { testCreateQuestion, testCreateQuiz, testRegisterUser, testSessionState, testStartSession, testUpdateThumbnail } from './testFunc';
import { getSessionStatus } from '../session';
import { quizIdValidator } from '../helpers';

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

const sessionId1 = (JSON.parse(testStartSession(token1, quizId1, 30).body as string)).sessionId;

describe('Update session state test: ', () => {
  test('[SUCCESS] LOBBY => NEXT_QUESTION: ', () => {
    const res1 = testSessionState(token1, quizId1, sessionId1, "NEXT_QUESTION");
    const result = JSON.parse(res1.body as string);
    console.log(quizIdValidator(quizId1));
    expect(res1.statusCode).toBe(OK);
    // expect(result).toStrictEqual({});
    //expect(getSessionStatus(token1, quizId1, sessionId1).state).toStrictEqual("LOBBY");
  });
//   test('[SUCCESS] NEXT_QUESTION: ', () => {
//     const res1 = testSessionState(token1, quizId1, sessionId1, "NEXT_QUESTION");
//     expect(res1.statusCode).toBe(OK);
//   });
});
