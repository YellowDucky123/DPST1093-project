import request from 'sync-request-curl';
import config from '../config.json';
import { questionResults } from '../quiz';
import { error } from 'console';
import { requestHelper} from './requestHelper_fn'
import HTTPError from 'http-errors';
import { send } from 'process';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request(
    'DELETE', SERVER_URL + '/v1/clear'
  );
});

function sendChat(message: string, playerId: number, token) {
    return requestHelper('POST', `/v1/player/${playerId}/chat`, {message}, token);
}



describe('error', () => {
  test('player does not exist', () => {
    expect(() => sendChat('Hello Everyone', playerId, token)).toThrow(HTTPError[400]);
  });

  test('message too Long', () => {
    let str: string = '';
    str = String(str).padStart(110, '*');
    expect(() => sendChat(str, )).toThrow(HTTPError[400]);
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
      const result = JSON.parse(res.body as string);
  });

