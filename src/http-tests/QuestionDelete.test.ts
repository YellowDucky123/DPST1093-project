import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const OWNER_ERROR = 403;
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

// create user 2
const u2 = request(
  'POST',
  SERVER_URL + '/v1/admin/auth/register',
  {
    json: {
      email: 'tesgt@email.com',
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
      token: tId.token,
      name: 'old quiz name',
      description: 'describing'
    }
  }
);
JSON.parse(q2.body as string);

const ques = request(
  'POST',
  SERVER_URL + `/v1/admin/quiz/${qId.quizId}/question`,
  {
    json: {
      token: tId.token,
      questionBody: {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Queen Bels',
            correct: false
          }
        ]
      }
    }
  }
);
const quesId = JSON.parse(ques.body as string);

/// ///////////////////////////////////////////////////////////////////////////////////////////
describe('Delete Question test :', () => {
  test('test succesfull:', () => {
    const res = request(
      'DELETE',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/question/${quesId.questionId}`,
      {
        qs: {
          token: tId.token
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(result).toStrictEqual({});
  });

  test('Deletion confirmation:', () => {
    const res = request(
      'GET',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}`,
      {
        qs: {
          token: tId.token
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(result.questions).toStrictEqual([]);
  });

  test('Invalid Token:', () => {
    const res = request(
      'DELETE',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/question/${quesId.questionId}`,
      {
        qs: {
          token: tId.token + 1
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(TOKEN_ERROR);
    expect(result).toStrictEqual({ error: 'Token is empty or invalid' });
  });

  test('Invalid QuestionId:', () => {
    const res = request(
      'DELETE',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/question/${quesId.questionId + 1}`,
      {
        qs: {
          token: tId.token
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(result).toStrictEqual({ error: 'Question Id does not refer to a valid question within this quiz' });
  });

  test('User does not own quiz:', () => {
    const res = request(
      'DELETE',
      SERVER_URL + `/v1/admin/quiz/${qId.quizId}/question/${quesId.questionId}`,
      {
        qs: {
          token: t2Id.token
        }
      }
    );
    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OWNER_ERROR);
    expect(result).toStrictEqual({ error: 'This user does not own this quiz' });
  });
});
