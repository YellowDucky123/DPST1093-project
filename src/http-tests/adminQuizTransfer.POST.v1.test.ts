import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const OWNER_ERROR = 403;
const root = config.url + ':' + config.port;
beforeAll(() => { request('DELETE', root + '/v1/clear'); });
afterAll(() => { request('DELETE', root + '/v1/clear'); });
describe('POST /v1/admin/quiz/transfer', () => {
  let quizId = 1;
  const body = {
    token: '1',
    userEmail: 'test2@unsw.edu.au'
  };
  const quiz = {
    token: '1',
    name: 'test',
    description: ''
  };
  const user1details = {
    email: 'test1@unsw.edu.au',
    password: 'testRuning123',
    nameFirst: 'name',
    nameLast: 'last'
  };
  let token1 = '1';
  const user2details = {
    email: 'test2@unsw.edu.au',
    password: 'testRuning123',
    nameFirst: 'name',
    nameLast: 'last'
  };
  let token2 = '2';
  test('test token error', () => {
    let res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(TOKEN_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'token incorrect or not found' });

    res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`);
    expect(res.statusCode).toEqual(TOKEN_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'A token is required' });
  });
  test('test quiId error', () => {
    // regist user1
    let res = request('POST', root + '/v1/admin/auth/register', { json: user1details });
    expect(res.statusCode).toEqual(OK);
    token1 = quiz.token = body.token = JSON.parse(res.body as string).token;

    // regist user2
    res = request('POST', root + '/v1/admin/auth/register', { json: user2details });
    expect(res.statusCode).toEqual(OK);
    token2 = JSON.parse(res.body as string).token;

    // try to transfer this user's quiz by no quizId
    quizId = undefined;
    res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(OWNER_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'You must provide a quizId' });

    // regist quiz for user1
    res = request('POST', root + '/v1/admin/quiz', { json: quiz });
    expect(res.statusCode).toBe(OK);
    quizId = JSON.parse(res.body as string).quizId;

    // try to transfer a quiz by error quizId
    quizId++;
    res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(OWNER_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'You do not own this quiz' });
    quizId--;
  });
  test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    // create quiz for user2 with same name to user1
    quiz.token = token2;
    let res = request('POST', root + '/v1/admin/quiz', { json: quiz });
    expect(res.statusCode).toBe(OK);

    // try to transfer a quiz by with name
    res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Quiz ID refers to a quiz that has a name that is already used by the target user' });
  });
  test('test email error', () => {
    // create a new quiz for user1 to transfer
    quiz.token = token1;
    quiz.name = 'testing email';
    let res = request('POST', root + '/v1/admin/quiz', { json: quiz });
    expect(res.statusCode).toBe(OK);
    quizId = JSON.parse(res.body as string).quizId;

    // try to transfer a quiz by no email
    body.userEmail = undefined;
    res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'You must provide a valid email' });

    // try to transfer a quiz by not exist email
    body.userEmail = 'invalid email';
    res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'This email does not exist' });
  });
  test('userEmail is the current logged in user', () => {
    // send to himself
    body.userEmail = user1details.email;
    const res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'You cannot transfer to yourself' });
  });
  test('tansfer a quiz successfully', () => {
    // transfer qui2 to user2
    body.userEmail = user2details.email;
    const res = request('POST', root + `/v1/admin/quiz/${quizId}/transfer`, { json: body });
    expect(res.statusCode).toEqual(OK);
    expect(JSON.parse(res.body as string)).toEqual({});
  });
  test('test quizzes for each user', () => {
    // test quizzes for user1
    let res = request('GET', root + '/v1/admin/quiz/list', { qs: { token: token1 } });
    expect(res.statusCode).toEqual(OK);
    expect(JSON.parse(res.body as string)).toEqual({
      quizzes: [
        {
          quizId: expect.any(Number),
          name: 'test'
        }
      ]
    });

    // test quizzes for user2
    res = request('GET', root + '/v1/admin/quiz/list', { qs: { token: token2 } });
    expect(res.statusCode).toEqual(OK);
    expect(JSON.parse(res.body as string)).toEqual({
      quizzes: [
        {
          quizId: expect.any(Number),
          name: 'test'
        },
        {
          quizId: expect.any(Number),
          name: 'testing email'
        }
      ]
    });
  });
});
