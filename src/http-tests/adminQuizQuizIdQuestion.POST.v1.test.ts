import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const OWNER_ERROR = 403;
const port = config.port;
const url = config.url;
const root = url + ':' + port;
beforeAll(() => (request('DELETE', root + '/v1/clear')));
afterAll(() => (request('DELETE', root + '/v1/clear')));
describe('POST /v1/admin/quiz/:quizId/question', () => {
  const details = {
    token: '1',
    questionBody: {
      question: 'Who is the Monarch of England?',
      duration: 50,
      points: 5,
      answers: [
        {
          answer: 'ans1',
          correct: true
        },
        {
          answer: 'ans2',
          correct: false
        }
      ]
    }
  };
  let quizId = 1;
  const userDetails1 = {
    email: 'test1@unsw.edu.au',
    password: 'testRunning123',
    nameFirst: 'name',
    nameLast: 'test',
    token: '1'
  };
  const userDetails2 = {
    email: 'test2@unsw.edu.au',
    password: 'testRunning123',
    nameFirst: 'name',
    nameLast: 'test',
    token: '2'
  };
  test('error invalid token test', () => {
    // test about no body
    let res = request('POST', root + `/v1/admin/quiz/${quizId}/question`);
    expect(res.statusCode).toBe(TOKEN_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'A correct token is required' });
    // test about not exist token
    res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(TOKEN_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'token incorrect or not found' });
  });
  test('error of valid token is provided, but user is not an owner of this quiz', () => {
    // regist user1
    let res = request('POST', root + '/v1/admin/auth/register', { json: userDetails1 });
    expect(res.statusCode).toBe(OK);
    userDetails1.token = JSON.parse(res.body as string).token;

    // regist user2
    res = request('POST', root + '/v1/admin/auth/register', { json: userDetails2 });
    expect(res.statusCode).toBe(OK);
    userDetails2.token = JSON.parse(res.body as string).token;

    // create a quiz for user1
    res = request('POST', root + '/v1/admin/quiz', { json: { token: userDetails1.token, name: 'test quiz', description: 'quiz of user1' } });
    quizId = parseInt(JSON.parse(res.body as string).quizId);
    expect(res.statusCode).toBe(OK);

    // test for not owner
    details.token = userDetails2.token;
    res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(OWNER_ERROR);
  });
  test('create successful for user1', () => {
    details.token = userDetails1.token;
    const res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(OK);
    expect(JSON.parse(res.body as string)).toEqual({ questionId: expect.any(Number) });
  });
  test('error Question string is less than 5 characters in length or greater than 50 characters in length', () => {
    // question less than 5 characters
    details.token = userDetails1.token;
    details.questionBody.question = '1234';
    let res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid question length' });

    // question greater than 50 characters
    details.questionBody.question = '123456789012345678901234567890123456789012345678901'; // 51 characters long
    res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid question length' });

    // fix details
    details.questionBody.question = 'a suitable question';
  });
  test('error The question has more than 6 answers or less than 2 answers', () => {
    // question has more than 6 answers
    details.questionBody.answers = [
      { answer: 'ans1', correct: true },
      { answer: 'ans2', correct: false },
      { answer: 'ans3', correct: false },
      { answer: 'ans4', correct: false },
      { answer: 'ans5', correct: false },
      { answer: 'ans6', correct: false },
      { answer: 'ans7', correct: false },
    ];
    let res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid answers number' });

    // question has less than 2 answers
    details.questionBody.answers = [
      { answer: 'ans1', correct: true }
    ];
    res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid answers number' });

    // fix details
    details.questionBody.answers.push({ answer: 'ans2', correct: false });
  });
  test('The question duration is not a positive number', () => {
    details.questionBody.duration = -1;
    const res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid duration' });
  });
  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    // set the total time as 181 seconds
    details.questionBody.duration = 131;
    const res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Quiz duration exceeds 3 minutes' });

    // repair details
    details.questionBody.duration = 50;
  });
  test('The points awarded for the question are less than 1 or greater than 10', () => {
    // points less than 1
    details.questionBody.points = 0;
    let res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid points' });

    // points greater than 10
    details.questionBody.points = 11;
    res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid points' });

    // repair details
    details.questionBody.points = 5;
  });
  test('The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
    // answer shorter than 1 character
    details.questionBody.answers[0].answer = '';
    let res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid answer length' });

    // answer longer than 30 characters
    details.questionBody.answers[0].answer = 'a'.repeat(31);
    res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Invalid answer length' });

    // repair details
    details.questionBody.answers[0].answer = 'ans1';
  });
  test('Any answer strings are duplicates of one another (within the same question)', () => {
    // duplicate answers
    details.questionBody.answers[0].answer = details.questionBody.answers[1].answer;
    const res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'Duplicate answer' });

    // repair details
    details.questionBody.answers[0].answer = 'ans1';
  });
  test('There are no correct answers', () => {
    // no correct answers
    details.questionBody.answers[0].correct = false;
    const res = request('POST', root + `/v1/admin/quiz/${quizId}/question`, { json: details });
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'No correct answer' });
  });
});
