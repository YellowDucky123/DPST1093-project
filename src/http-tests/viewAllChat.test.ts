import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
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
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({});
    })
})