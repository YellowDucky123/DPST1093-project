import request from 'sync-request-curl';
import config from '../config.json';
import { questionResults } from '../quiz';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request(
    'DELETE', SERVER_URL + '/v1/clear'
  );
});



describe('error', () => {
  test('player does not exist', () => {
    const res = request(
      'GET',
      SERVER_URL + '/v1/player/:playerId/question/:questionPosition/results',
      {
        qs: {}
      }
    );
    expect(() => questionResults(playerId, questionPosition)).toThrow(Error);
  });

  test('question position invalid', () => {
    const res = request(
        'GET',
        SERVER_URL + '/v1/player/:playerId/question/:questionPosition/results',
        {
          qs: {}
        }
      );
      expect(() => questionResults(playerId, questionPosition)).toThrow(Error);
  });

  test('quiz session state wrong', () => {
    const res = request(
        'GET',
        SERVER_URL + '/v1/player/:playerId/question/:questionPosition/results',
        {
          qs: {}
        }
      );
      expect(() => questionResults(playerId, questionPosition)).toThrow(Error);
  });

  test('question position more than what exists', () => {
    const res = request(
        'GET',
        SERVER_URL + '/v1/player/:playerId/question/:questionPosition/results',
        {
          qs: {}
        }
      );
      expect(() => questionResults(playerId, questionPosition)).toThrow(Error);
  });
});

test('succesfull', () => {
    const res = request(
        'GET',
        SERVER_URL + '/v1/player/:playerId/question/:questionPosition/results',
        {
          qs: {}
        }
      );
      expect(() => questionResults(playerId, questionPosition)).toEqual({});
  });

