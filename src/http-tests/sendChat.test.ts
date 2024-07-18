import request from 'sync-request-curl';
import config from '../config.json';
import { questionResults } from '../quiz';
import { error } from 'console';
import { requestHelper} from './requestHelper_fn'

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
        'POST',
        SERVER_URL + '/v1/player/:playerId/chat',
        {
            json:{
                message: {
                    messageBody: "Hello everyone!";
                }
            }
        }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toThrow(Error);
  })
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

