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

// register 1
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

// register 2
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

// Quiz create 1 by user1
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

// Quiz create 2 by user1
const QC2 = request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      token: token1,
      name: 'Test Quiz 2',
      description: 'This is a quiz 2 for test'
    }
  }
);
const targetId2 = JSON.parse(QC2.body as string).quizId;

// Quiz create 3 by user2
const QC3 = request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      token: token2,
      name: 'Test Quiz 3',
      description: 'This is a quiz 3 for test'
    }
  }
);
const targetId3 = JSON.parse(QC3.body as string).quizId;

describe('Quiz remove test: ', () => {
  test('test token error: ', () => {
    const del = request(
      'DELETE',
      SERVER_URL + '/v1/admin/quiz/' + targetId,
      {
        qs: {
          token: token1 + 1,
          quizId: targetId
        }
      }
    );
    request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/list',
      {
        qs: {
          token: token1
        }
      }
    );
    expect(del.statusCode).toBe(401);
  });

  test('test do not own error: ', () => {
    const del = request(
      'DELETE',
      SERVER_URL + '/v1/admin/quiz/' + targetId3,
      {
        qs: {
          token: token1,
          quizId: targetId3
        }
      }
    );
    request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/list',
      {
        qs: {
          token: token1
        }
      }
    );
    expect(del.statusCode).toBe(403);
  });

  test('test succesfull: ', () => {
    const del = request(
      'DELETE',
      SERVER_URL + '/v1/admin/quiz/' + targetId,
      {
        qs: {
          token: token1,
          quizId: targetId
        }
      }
    );
    const list = request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/list',
      {
        qs: {
          token: token1
        }
      }
    );
    const result = JSON.parse(list.body as string);
    expect(del.statusCode).toBe(OK);
    expect(result).toStrictEqual({
      quizzes: [
        {
          quizId: targetId2,
          name: 'Test Quiz 2'
        }
      ]
    });
  });
});
