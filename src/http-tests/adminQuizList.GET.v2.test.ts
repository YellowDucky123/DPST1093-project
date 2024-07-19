import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
// const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const port = config.port;
const url = config.url;

beforeAll(() => { request('DELETE', `${url}:${port}/v2/clear`); });
afterAll(() => { request('DELETE', `${url}:${port}/v2/clear`); });

describe('/v2/admin/quiz/List', () => {
  let token : {token : string};
  const user = {
    email: 'test@unsw.edu.au',
    password: 'testingUsed123',
    nameFirst: 'test',
    nameLast: 'test'
  };
  test("the one who doesn't logined", () => {
    let res = request('GET', `${url}:${port}/v2/admin/quiz/List`, { headers: token });
    expect(res.statusCode).toBe(TOKEN_ERROR);
    res = request('GET', `${url}:${port}/v2/admin/quiz/List`);
    expect(res.statusCode).toBe(TOKEN_ERROR);
  });
  test('the one with no quizzes', () => {
    let res = request('POST', `${url}:${port}/v1/admin/auth/register`, { json: user});
    expect(res.statusCode).toBe(OK);
    token = JSON.parse(res.body as string);
    res = request('GET', `${url}:${port}/v2/admin/quiz/List`, { headers: token });
    expect(res.statusCode).toBe(OK);
    expect(JSON.parse(res.body as string)).toEqual({ quizzes: [] });
  });
  test('the one with quizzes', () => {
    let res = request('POST', `${url}:${port}/v2/admin/quiz`, { headers : {token :  token.token}, json: { name: 'test', description: '' } });
    const quizId = JSON.parse(res.body as string).quizId;
    res = request('POST', `${url}:${port}/v2/admin/quiz`, { headers : {token :  token.token}, json: { name: 'test1', description: '' } });
    const quizId1 = JSON.parse(res.body as string).quizId;
    res = request('POST', `${url}:${port}/v2/admin/quiz`, { headers : {token :  token.token}, json: { name: 'test2', description: '' } });
    const quizId2 = JSON.parse(res.body as string).quizId;
    res = request('GET', `${url}:${port}/v2/admin/quiz/List`, { headers: token });
    expect(res.statusCode).toBe(OK);
    expect(JSON.parse(res.body as string)).toEqual({
      quizzes: [
        { quizId: quizId, name: 'test' },
        { quizId: quizId1, name: 'test1' },
        { quizId: quizId2, name: 'test2' }
      ]
    });
  });
});
