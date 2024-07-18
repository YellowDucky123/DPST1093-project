import request from 'sync-request-curl';
import config from '../config.json';

// Register user function for http testing.
// Returns token, if error occurs, return the result
export function registerUser(email: string, password: string, nameFirst: string, nameLast: string) {
  const port = config.port;
  const url = config.url;

  const SERVER_URL = `${url}:${port}`;

  const res = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/register',
      {
          json: {
              email: email,
              password: password,
              nameFirst: nameFirst,
              nameLast: nameLast
          }
      }
  );
  const token = JSON.parse(res.body as string).token;

  if('error' in res) {
      return res;
  } else {
      return token;
  }
}

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);


const token1 = registerUser("test@email.com", 'newPassword123', 'Kei', 'Ikushima');


describe('Quiz create test: ', () => {
  test('test succesfull: ', () => {
    const res1 = request(
      'POST',
      SERVER_URL + '/v2/admin/quiz',
      {
        json: {
          token: token1,
          name: 'Test Quiz',
          description: 'This is a quiz for test'
        }
      }
    );
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(result).toStrictEqual({
      quizId: result.quizId
    });
  });

  test('test invalid name: ', () => {
    const res1 = request(
      'POST',
      SERVER_URL + '/v2/admin/quiz',
      {
        json: {
          token: token1,
          name: 'Te',
          description: 'This is a quiz for test'
        }
      }
    );
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'Invalid quiz name length' });
  });

  test('test invalid description: ', () => {
    const long = [];
    for (let i = 0; i < 120; ++i) {
      long.push('1');
    }
    const res1 = request(
      'POST',
      SERVER_URL + '/v2/admin/quiz',
      {
        json: {
          token: token1,
          name: 'Test Quiz 2',
          description: long
        }
      }
    );
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'Invalid quiz description length' });
  });

  test('test quiz name already used: ', () => {
    const res1 = request(
      'POST',
      SERVER_URL + '/v2/admin/quiz',
      {
        json: {
          token: token1,
          name: 'Test Quiz',
          description: 'This is test'
        }
      }
    );
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'Quiz name is already used' });
  });

  test('test token error: ', () => {
    const res1 = request(
      'POST',
      SERVER_URL + '/v2/admin/quiz',
      {
        json: {
          token: token1 + 1,
          name: 'Test Quiz 3',
          description: 'This is a quiz for test'
        }
      }
    );
    expect(res1.statusCode).toBe(401);
  });
});
