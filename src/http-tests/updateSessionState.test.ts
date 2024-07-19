import request from 'sync-request-curl';
import config from '../config.json';
import { testCreateQuestion, testCreateQuiz, testJoinSession, testQuizInfo, testRegisterUser, testSessionInfo, testSessionState, testStartSession, testUpdateThumbnail } from './testFunc';
import { getSessionStatus } from '../session';
import { quizIdValidator } from '../helpers';
import { QuizSessionAction, QuizSessionState, getData } from '../dataStore';

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
        duration: 30,
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

testCreateQuestion(token1, quizId1, 
    {
        question: "Second Question!",
        duration: 30,
        points: 5,
        answers: [
            {
                answer: "Answer A",
                correct: true
            },
            {
                answer: "Answer B",
                correct: false
            }
        ],
        "thumbnailUrl": "http://google.com/some/image/path.jpg"
    }
);

const sessionId1 = (JSON.parse(testStartSession(token1, quizId1, 30).body as string)).sessionId;

const playerId1 = testJoinSession(sessionId1, "Kei");
console.log(playerId1);

describe('Update session state test: ', () => {
  test('[SUCCESS] LOBBY => (NEXT_QUESTION) => QUESTION_COUNTDOWN: ', () => {
    const res1 = testSessionState(token1, quizId1, sessionId1, QuizSessionAction.NEXT_QUESTION);

    expect(res1.statusCode).toBe(OK);

    const sessionState = (JSON.parse(testSessionInfo(token1, quizId1, sessionId1).body as string)).state;
    expect(sessionState).toStrictEqual(QuizSessionState.QUESTION_COUNTDOWN);
  });

  test('[SUCCESS] QUESTION_COUNTDOWN => (SKIP_COUNTDOWN) => QUESTION_OPEN: ', () => {
    const res1 = testSessionState(token1, quizId1, sessionId1, QuizSessionAction.SKIP_COUNTDOWN);

    expect(res1.statusCode).toBe(OK);

    const sessionState = (JSON.parse(testSessionInfo(token1, quizId1, sessionId1).body as string)).state;
    expect(sessionState).toStrictEqual(QuizSessionState.QUESTION_OPEN);
  });

  test('[SUCCESS] QUESTION_OPEN => (GO_TO_ANSWER) => ANSWER_SHOW: ', () => {
    const res1 = testSessionState(token1, quizId1, sessionId1, QuizSessionAction.GO_TO_ANSWER);

    expect(res1.statusCode).toBe(OK);

    const sessionState = (JSON.parse(testSessionInfo(token1, quizId1, sessionId1).body as string)).state;
    expect(sessionState).toStrictEqual(QuizSessionState.ANSWER_SHOW);
  });
});
