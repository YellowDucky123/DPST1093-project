    import request from 'sync-request-curl';
    import config from '../config.json';
    import { testCreateQuestion, testCreateQuiz, testJoinSession, testQuizInfo, testRegisterUser, testSessionInfo, testSessionState, testStartSession, testSubmitAnswer, testUpdateThumbnail } from './testFunc';
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

    const resCQQ1 = testCreateQuestion(token1, quizId1, 
        {
            question: "Who is the Monarch of England?",
            duration: 10,
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
    const questionId1 = JSON.parse(resCQQ1.body as string).questionId;

    const resCQQ2 = testCreateQuestion(token1, quizId1, 
        {
            question: "Second Question!",
            duration: 10,
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
const questionId2 = JSON.parse(resCQQ2.body as string).questionId;

const sessionId1 = (JSON.parse(testStartSession(token1, quizId1, 30).body as string)).sessionId;

const playerId1 = JSON.parse(testJoinSession(sessionId1, "Kei").body as string).playerId;

describe('Update session state test: ', () => {
    test('Invalid token: ', () => {
        const res1 = testSessionState(token1+1, quizId1, sessionId1, QuizSessionAction.NEXT_QUESTION);

        expect(res1.statusCode).toBe(401);
    });

    test('Not owning this quiz: ', () => {
        const res1 = testSessionState(token2, quizId1, sessionId1, QuizSessionAction.NEXT_QUESTION);

        expect(res1.statusCode).toBe(403);
    });

    test('QuizId invalid: ', () => {
        const res1 = testSessionState(token1, quizId1+1, sessionId1, QuizSessionAction.NEXT_QUESTION);

        expect(res1.statusCode).toBe(403);
    });

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

//   test('[SUCCESS] QUESTION_OPEN => (GO_TO_ANSWER) => ANSWER_SHOW: ', () => {
//     console.log((JSON.parse(testSessionInfo(token1, quizId1, sessionId1).body as string)));
//     const answerId1 = (JSON.parse(testSessionInfo(token1, quizId1, sessionId1).body as string)).metadata.questions[0].answers.answerId;
//     let ary: number[] = [answerId1];

//     testSubmitAnswer(playerId1, 1, ary);
//     const res1 = testSessionState(token1, quizId1, sessionId1, QuizSessionAction.GO_TO_ANSWER);

//     expect(res1.statusCode).toBe(OK);

//     const sessionState = (JSON.parse(testSessionInfo(token1, quizId1, sessionId1).body as string)).state;
//     expect(sessionState).toStrictEqual(QuizSessionState.ANSWER_SHOW);
//   });
});