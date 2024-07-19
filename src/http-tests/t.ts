import request from 'sync-request-curl';
import config from '../config.json';
import { questionResults } from '../quiz';
import { requestHelper } from './requestHelper_fn';
import HTTPError from 'http-errors';
import { QuizSessionAction } from '../dataStore';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

// afterAll(() => {
//     requestHelper('DELETE', '/v2/clear', {});
// });

// beforeAll(() => {
//     requestHelper('DELETE', '/v2/clear', {});
// });

requestHelper('DELETE', '/v2/clear', {});

function authRegister(email: string, password: string, nameFirst: string, nameLast: string) {
    return requestHelper('POST', '/v1/admin/auth/register', {email, password, nameFirst, nameLast});
}

function loginUser(email: string, password: string) {
    return requestHelper('POST', '/v1/admin/auth/login', {email, password});
}
function createQuiz(token: number, name: string, description: string) {
    return requestHelper('POST', '/v1/admin/quiz', {token, name, description});
}

function createQuestion(quizId: number, token: string) {
    return requestHelper('POST', `/v2/admin/quiz/${quizId}/question`, {
        "questionBody": {
          "question": "Who is the Monarch of England?",
          "duration": 4,
          "points": 5,
          "answers": [
            {
              "answer": "Prince Charles",
              "correct": true
            },
            {
                answer: 'Queen Bels',
                correct: false
            }
          ],
          "thumbnailUrl": "http://google.com/some/image/path.jpg"
        }
      }, {token});
}

function startSession(quizId: number, autoStartNum: number, token: string) {
    return requestHelper('POST', `/v1/admin/quiz/${quizId}/session/start`, {autoStartNum}, {token});
}

function joinSession(sessionId: number, name: string) {
    return requestHelper('POST', '/v1/player/join', { sessionId, name });
}

function changeState(quizId: number, sessionId: number, action: QuizSessionAction, token: string) {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/session/${sessionId}`, {action}, {token});
}

function sessionStatusRoute(quizId: number, sessionId: number, token: string) {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionId}`, {}, { token });
}

function submitAnswer(playerId: number, questionPosition: number, answerIds: number) {
  return requestHelper('PUT', `/v1/player/${playerId}/question/${questionPosition}/answer`, {answerIds});
}

function questionResult(playerId: number, questionPosition: number, token: string) {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionPosition}/results`, {}, {token});
}

const authToken = authRegister(
    'kelvinjyoga@gmail.com',
    'password123@!',
    'Kelvin',
    'Yoga'
);

const Token = loginUser('kelvinjyoga@gmail.com', 'password123@!');
const userToken = Token.token;

const qzId = createQuiz(userToken, 'question1', 'this is a test q');
const quizId = qzId.quizId;
const questionId = createQuestion(quizId, userToken);

const sessionId = startSession(quizId, 3, userToken);
const pId = joinSession(sessionId.sessionId, 'player1');
const playerId = pId.playerId;

console.log(questionResult(playerId, 1, userToken))

requestHelper('DELETE', '/v2/clear', {});