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

request(
  'DELETE',
  SERVER_URL + '/v1/clear'
);
// create user 1
const u1 = request(
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
const tId = JSON.parse(u1.body as string);

// create user2
const u2 = request(
  'POST',
  SERVER_URL + '/v1/admin/auth/register',
  {
    json: {
      email: 'testh@email.com',
      password: 'newPassword123',
      nameFirst: 'Kelvin',
      nameLast: 'Yoga'
    }
  }
);
const t2Id = JSON.parse(u2.body as string);

// create quiz1
const q1 = request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      token: tId.token,
      name: 'old quiz name',
      description: 'describing'
    }
  }
);
const qId = JSON.parse(q1.body as string);

// create quiz2
const q2 = request(
  'POST',
  SERVER_URL + '/v1/admin/quiz',
  {
    json: {
      token: t2Id.token,
      name: 'old quiz2',
      description: 'descrie'
    }
  }
);
const q2Id = JSON.parse(q2.body as string);

/// //////////////////////////////////////////////////////////////////////////////
describe('Update Quiz Name http test: ', () => {
  test('test succesfull: ', () => {
    const res = request(
      'PUT',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/description`,
      {
        json: {
          token: tId.token,
          quizId: qId.quizId,
          description: 'new description'
        },
        timeout: 100
      }
    );
    console.log(res.body);
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(result).toStrictEqual({});
  });

  test('invalid quizId: ', () => {
    const res = request(
      'PUT',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId + 1}/description`,
      {
        json: {
          token: t2Id.token,
          quizId: qId.quizId + 1,
          description: 'new description'
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(result).toStrictEqual({ error: 'Quiz Id invalid' });
  });

  test('invalid token', () => {
    const res = request(
      'PUT',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/description`,
      {
        json: {
          token: t2Id.token + 1,
          quizId: qId.quizId,
          description: 'new description'
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(TOKEN_ERROR);
    expect(result).toStrictEqual({ error: 'Token is empty or invalid' });
  });

  test('description too long:', () => {
    const input: any = [];
    for (let i = 0; i < 101; i++) {
      input[i] += 'a';
    }
    const res = request(
      'PUT',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/description`,
      {
        json: {
          token: t2Id.token,
          quizId: qId.quizId,
          description: input
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(result).toStrictEqual({ error: 'Description too long' });
  });

  test('User does not have ownership: ', () => {
    const res = request(
      'PUT',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/description`,
      {
        json: {
          token: t2Id.token,
          quizId: q2Id.quizId,
          description: 'new description'
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(403);
    expect(result).toStrictEqual({ error: 'This user does not own this quiz' });
  });
});
