import request from 'sync-request-curl';
import config from '../config.json';
import { testCreateQuiz, testRegisterUser, testCreateQuestion, testStartSession, testSessionState, testListSessions } from './testFunc';
import { QuizSessionAction } from '../dataStore';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);

const token1 = testRegisterUser('test@email.com', 'newPassword123', 'Kei', 'Ikushima');
const token2 = testRegisterUser('test2@email.com', 'newPassword123', 'Kelvin', 'Yoga');

const quizId1 = (JSON.parse(testCreateQuiz(token1, 'Test Quiz', 'This is test quiz').body as string)).quizId;

testCreateQuestion(token1, quizId1,
  {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: true
      },
      {
        answer: 'Example',
        correct: false
      }
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  }
);

const sessionId1 = (JSON.parse(testStartSession(token1, quizId1, 30).body as string)).sessionId;
const sessionId2 = (JSON.parse(testStartSession(token1, quizId1, 30).body as string)).sessionId;

testSessionState(token1, quizId1, sessionId2, QuizSessionAction.END);

describe('List sessions test: ', () => {
  test('test succesfull: ', () => {
    const result = JSON.parse(testListSessions(token1, quizId1).body as string);
    expect(result).toStrictEqual({
      activeSessions: [sessionId1],
      inactiveSessions: [sessionId2]
    });
  });

  test('invalid token: ', () => {
    const result = testListSessions(token1 + 1, quizId1);
    expect(result.statusCode).toBe(401);
  });

  test('Not owning the quiz: ', () => {
    const result = testListSessions(token2, quizId1);
    expect(result.statusCode).toBe(403);
  });
});
