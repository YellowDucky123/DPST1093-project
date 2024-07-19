import request from 'sync-request-curl';
import config from '../config.json';
import { questionResults } from '../quiz';
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
    return requestHelper('POST', `/v1/admin/quiz/${quizId}/sessions/start`, {autoStartNum}, token);
}

function questionResult(playerId: number, questionPosition: number, token) {
    return requestHelper('GET', `/v1/player/${playerId}/question/${questionPosition}/results`, {}, token);
}

describe('error', () => {
  test('player does not exist', () => {
    expect(questionResult()).toThrow(HTTPError[400]);
  });

  test('question position invalid', () => {
    expect(questionResult()).toThrow(HTTPError[400]);
  });

  test('quiz session state wrong', () => {
    expect(questionResult()).toThrow(HTTPError[400]);
  });

  test('question position more than what exists', () => {
    expect(questionResult()).toThrow(HTTPError[400]);
  });
});

test('succesfull', () => {
    expect(questionResult()).toEqual({

    });
});

