import request from 'sync-request-curl';
import config from '../config.json';
import { testCreateQuiz, testRegisterUser, testUpdateThumbnail } from './testHelper';

const OK = 200;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

afterAll(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
});

request('DELETE', `${url}:${port}/v1/clear`);

const token1 = testRegisterUser("test@email.com", 'newPassword123', 'Kei', 'Ikushima');
const token2 = testRegisterUser("test2@email.com", 'newPassword123', 'Kelvin', 'Yoga');

const quizId1 = (JSON.parse(testCreateQuiz(token1, "Test Quiz", "This is test quiz").body as string)).quizId;

describe('Update quiz thumbnail test: ', () => {
  test('test succesfull: ', () => {
    const res1 = testUpdateThumbnail(token1, quizId1, "https://www.test.com/a.jpg");
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(result).toStrictEqual({});
  });

  test("Invalid filetype in url: ", () => {
    const res1 = testUpdateThumbnail(token1, quizId1, "https://www.test.com/a.pmx");
    expect(res1.statusCode).toBe(400);
  });

  test("Invalid url: ", () => {
    const res1 = testUpdateThumbnail(token1, quizId1, "htps://www.test.com/a.png");
    expect(res1.statusCode).toBe(400);
  });

  test("Token invalid: ", () => {
    const res1 = testUpdateThumbnail(token1+1, quizId1, "https://www.test.com/a.png");
    expect(res1.statusCode).toBe(401);
  });

  test("Not owner of the quiz: ", () => {
    const res1 = testUpdateThumbnail(token2, quizId1, "https://www.test.com/a.png");
    expect(res1.statusCode).toBe(403);
  });
});
