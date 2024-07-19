import request from 'sync-request-curl';
import config from '../config.json';
import { allMessagesInSession } from '../quiz';
import { requestHelper } from './requestHelper_fn';
import HTTPError from 'http-errors';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request(
    'DELETE', SERVER_URL + '/v1/clear'
  );
});

function startSession(quizId: number, autoStartNum: number, token) {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/sessions/start`, { autoStartNum }, token);
}

function allChat(playerId: number, token) {
  return requestHelper('GET', `/v1/player/${playerId}/chat`, {}, token);
}

describe('error', () => {
  test('player does not exist', () => {
    expect(() => allChat(playerId, token)).toThrow(HTTPError[400]);
  });

  test('correct implementation', () => {
    expect(() => allChat(playerId, token)).toEqual({

    });
  });
});
