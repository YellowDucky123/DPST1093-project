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
  'DELETE',
  SERVER_URL + '/v1/admin/quiz/' + targetId,
  {
    qs: {
      token: token1,
      quizId: targetId
    }
  }
);

const QC2 = request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      token: token2,
      name: 'Test Quiz',
      description: 'This is a quiz for test'
    }
  }
);
const targetId2 = JSON.parse(QC2.body as string).quizId;

request(
  'DELETE',
  SERVER_URL + '/v1/admin/quiz/' + targetId2,
  {
    qs: {
      token: token2,
      quizId: targetId2
    }
  }
);

const QC3 = request(
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
const targetId3 = JSON.parse(QC3.body as string).quizId;

request(
  'DELETE',
  SERVER_URL + '/v1/admin/quiz/' + targetId3,
  {
    qs: {
      token: token2,
      quizId: targetId3
    }
  }
);

const before = request(
  'GET',
  SERVER_URL + '/v1/admin/quiz/list',
  {
    qs: {
      token: token1
    }
  }
);
const beforeRes = JSON.parse(before.body as string);

describe('Restore quiz test: ', () => {
  test('test token error: ', () => {
    const res1 = request(
      'POST',
      SERVER_URL + '/v1/admin/quiz/' + targetId + '/restore',
      {
        json: {
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
    expect(res1.statusCode).toBe(401);
  });

  test('test quiz id invalid: ', () => {
    const res1 = request(
      'POST',
      SERVER_URL + '/v1/admin/quiz/' + targetId + 1 + '/restore',
      {
        json: {
          token: token1,
          quizId: targetId + 1
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
    expect(res1.statusCode).toBe(400);
  });

  test('test quiz name already used: ', () => {
    request(
      'POST',
      SERVER_URL + '/v1/admin/quiz/' + targetId + '/restore',
      {
        json: {
          token: token1,
          quizId: targetId
        }
      }
    );
    const restore2 = request(
      'POST',
      SERVER_URL + '/v1/admin/quiz/' + targetId2 + '/restore',
      {
        json: {
          token: token1,
          quizId: targetId2
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
    expect(restore2.statusCode).toBe(403);
  });

  test('test succesfull: ', () => {
    const res1 = request(
      'POST',
      SERVER_URL + '/v1/admin/quiz/' + targetId3 + '/restore',
      {
        json: {
          token: token2,
          quizId: targetId3
        }
      }
    );
    const res2 = request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/list',
      {
        qs: {
          token: token2
        }
      }
    );
    const result = JSON.parse(res2.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(beforeRes).toStrictEqual({
      quizzes: []
    });
    expect(result.quizzes[0].name).toStrictEqual('Test Quiz 2');
  });
});
