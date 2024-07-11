import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);

const reg1 = request(
  'POST',
  SERVER_URL + '/v1/admin/auth/register',
  {
    json: {
      email: 'test@email.com',
      password: 'newPassword123',
      nameFirst: 'Kelvin',
      nameLast: 'Yoga'
    }
  }
);
const token1 = JSON.parse(reg1.body as string).token;

const reg2 = request(
  'POST',
  SERVER_URL + '/v1/admin/auth/register',
  {
    json: {
      email: 'test2@email.com',
      password: 'newPassword123',
      nameFirst: 'Kei',
      nameLast: 'Ikushima'
    }
  }
);
const token2 = JSON.parse(reg2.body as string).token;

const QC1 = request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      token: token1,
      name: 'Test Quiz',
      description: 'This is a quiz for test'
    }
  }
);
const targetId = JSON.parse(QC1.body as string).quizId;

request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      token: token2,
      name: 'Test Quiz 2',
      description: 'This is a quiz 2 for test'
    }
  }
);

describe('Quiz info test: ', () => {
  test('test token error: ', () => {
    const info = request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/' + targetId,
      {
        qs: {
          token: token1 + 1,
          quizId: targetId
        }
      }
    );
    expect(info.statusCode).toBe(401);
  });

  test('test do not own quiz error: ', () => {
    const info = request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/' + targetId,
      {
        qs: {
          token: token2,
          quizId: targetId
        }
      }
    );
    expect(info.statusCode).toBe(403);
  });

  test('test succesfull: ', () => {
    const info = request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/' + targetId,
      {
        qs: {
          token: token1,
          quizId: targetId
        }
      }
    );
    expect(info.statusCode).toBe(OK);
  });
});
