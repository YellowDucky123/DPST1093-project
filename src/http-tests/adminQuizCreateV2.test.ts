import request from 'sync-request-curl';
import config from '../config.json';
import { testCreateQuiz, testRegisterUser} from './testFunc';
import { getData } from '../dataStore';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);

const token1 = testRegisterUser("test@email.com", 'newPassword123', 'Kei', 'Ikushima');

describe('Quiz create test: ', () => {
  test('test succesfull: ', () => {
    const res1 = testCreateQuiz(token1, "Test Quiz", "This is test quiz");
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(result).toStrictEqual({
      quizId: result.quizId
    });
  });

  test('test invalid name: ', () => {
    const res1 = testCreateQuiz(token1, "Th", "This is test quiz");
    expect(res1.statusCode).toBe(400);
  });

  test('test invalid description: ', () => {
    const res1 = testCreateQuiz(token1, "Test quiz", "a".repeat(200));
    expect(res1.statusCode).toBe(400);
  });

  test('test quiz name already used: ', () => {
    const res1 = testCreateQuiz(token1, "Test Quiz", "This is test quiz");
    expect(res1.statusCode).toBe(400);
  });

  test('test token error: ', () => {
    const res1 = testCreateQuiz(token1+1, "Test Quiz 2", "This is test quiz");
    expect(res1.statusCode).toBe(401);
  });
});
