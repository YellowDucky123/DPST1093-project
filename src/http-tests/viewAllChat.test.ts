import request from 'sync-request-curl';
import config from '../config.json';
import { allMessagesInSession } from '../quiz';

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
      SERVER_URL + '/v1/player/:playerId/chat',
      {
        qs: {}
      }
    );
    expect(() => allMessagesInSession(playerId)).toThrow(Error);
  });
  
  test('correct implementation', () => {
    const res = request(
        'GET',
        SERVER_URL + '/v1/player/:playerId/chat',
        {
            qs: {}
        }
    );
    expect(() => allMessagesInSession(playerId)).toEqual({});
  })
});

