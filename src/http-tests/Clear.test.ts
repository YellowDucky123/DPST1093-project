import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

const u1 = request(
  'POST',
  SERVER_URL + '/v1/admin/auth/register',
  {
    json: {
      email: 'clear@email.com',
      password: 'newPassword123',
      nameFirst: 'Kelvin',
      nameLast: 'Yoga'
    }
  }
);
const uId = JSON.parse(u1.getBody() as string);

request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      authUserId: uId.authUserId,
      name: 'old quiz name',
      description: 'describing'
    }
  }
);

test('Clear Server Test: ', () => {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/clear',
    {
      qs: {},
      timeout: 100
    }
  );
  const result = JSON.parse(res.body as string);
  expect(res.statusCode).toBe(OK);
  expect(result).toStrictEqual({});
  // users : {},
  // quizzes : {},
  // quizzesDeleted : {},
  // tokenUserIdList : {}
});
