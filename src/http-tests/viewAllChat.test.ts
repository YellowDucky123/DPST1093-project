import request from 'sync-request-curl';
import config from '../config.json';
import { allMessagesInSession } from '../quiz';
import { requestHelper } from './requestHelper_fn';
import HTTPError from 'http-errors';
import exp from 'constants';
import { send } from 'process';
import { string } from 'yaml/dist/schema/common/string';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request(
    'DELETE', SERVER_URL + '/v1/clear'
  );
});

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

function sendChat(message: string, playerId: number, token:string) {
  return requestHelper('POST', `/v1/player/${playerId}/chat`, {message:{messageBody: message}}, {token});
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
const pId = joinSession(sessionId.sessionId, 'player1');
const playerId = pId.playerId;
const pId2 = joinSession(sessionId.sessionId, 'player2');
const playerId2 = pId2.playerId;

function allChat(playerId: number, token: string) {
    return requestHelper('GET', `/v1/player/${playerId}/chat`, {}, {token});
}

describe('error', () => {
  test('player does not exist', () => {
    expect(() => allChat(playerId + 1, userToken)).toThrow(HTTPError[400]);
  });
});

test('correct implementation', () => {
  sendChat('message1', playerId, userToken);
  sendChat('message2', playerId, userToken);
  sendChat('message1', playerId2, userToken);
  sendChat('message2', playerId2, userToken);
  expect(allChat(playerId, userToken)).toStrictEqual([
    {
      messageBody: 'message1',
      playerId: playerId,
      playerName: expect.any(String),
      timeSent: expect.any(Number)
    },
    {
      messageBody: 'message2',
      playerId: playerId,
      playerName: expect.any(String),
      timeSent: expect.any(Number)
    },
    {
      messageBody: 'message1',
      playerId: playerId2,
      playerName: expect.any(String),
      timeSent: expect.any(Number)
    },
    {
      messageBody: 'message2',
      playerId: playerId2,
      playerName: expect.any(String),
      timeSent: expect.any(Number)
    }
  ]);
});
