import request from 'sync-request-curl';
import config from '../config.json';
import { questionResults } from '../quiz';
import { error } from 'console';
import { requestHelper} from './requestHelper_fn'
import HTTPError from 'http-errors';
import { send } from 'process';
import { create } from 'ts-node';
import { before } from 'node:test';

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

function joinSession(sessionId: number, userName: string) {
    // return requestHelper('POST', '/v1/player/join', {sessionId, userName})
    return request(
        'POST',
        SERVER_URL + '/v1/player/join',
        {
            json: {
                sessionId: sessionId,
                name: userName
            }
        }
    )

}

function sendChat(message: string, playerId: number, token:string) {
    return requestHelper('POST', `/v1/player/${playerId}/chat`, {message}, {token});
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
createQuestion(quizId, userToken);


const sessionId = startSession(quizId, 3, userToken);
const playerId = joinSession(sessionId.sessionId, 'player');

// console.log(sessionId.sessionId);
console.log(playerId)

requestHelper('DELETE', '/v2/clear', {});