import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;
const createNewQuiz = `${SERVER_URL}/v1/admin/quiz`;
beforeAll(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
});
let token: string;
let quizId: number;
let questionId: number;
beforeEach(() => {
  request('DELETE', SERVER_URL + '/v1/clear');
  const user = {
    email: 'test@163.com',
    password: '123456aaaa',
    nameFirst: 'Victor',
    nameLast: 'Xiao'
  };
  const response = request('POST', adminUserRegister, {
    json: user
  });
  token = JSON.parse(response.body as string).token;

  const quizData = {
    token: token,
    name: 'My Quiz Name',
    description: 'A description of my quiz'
  };
  const quizRes = request('POST', createNewQuiz, {
    json: quizData
  });
  quizId = JSON.parse(quizRes.body as string).quizId;

  const details = {
    token: token,
    questionBody: {
      question: 'hello world',
      duration: 10,
      points: 5,
      answers: [
        {
          answer: 'yes',
          correct: true
        },
        {
          answer: 'no',
          correct: false
        }
      ]
    }
  };
  const createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quizId}/question`, {
    json: details
  });
  questionId = JSON.parse(createQuizRes.body as string).questionId;
});

describe('Quiz question update', () => {
  test('should return 200, correct input', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello word',
        duration: 9,
        points: 4,
        answers: [
          {
            answer: 'yess',
            correct: true
          },
          {
            answer: 'nos',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(result).toStrictEqual({});
  });

  test('should return 400, icorrect questionId input', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello world',
        duration: 10,
        points: 5,
        answers: [
          {
            answer: 'yes2',
            correct: true
          },
          {
            answer: 'no2',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId + 1}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'Question Id does not refer to a valid question within this quiz' });
  });

  test('should return 400, incorrect question length', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'h',
        duration: 9,
        points: 4,
        answers: [
          {
            answer: 'yess',
            correct: true
          },
          {
            answer: 'nos',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'Question string is less than 5 characters in length or greater than 50 characters in length' });
  });

  test('should return 400, incorrect answer length', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello new world',
        duration: 9,
        points: 4,
        answers: [
          {
            answer: 'yess',
            correct: true
          },
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'The question has more than 6 answers or less than 2 answers' });
  });

  test('should return 400, question duration is not a positive number', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello new world',
        duration: -9,
        points: 4,
        answers: [
          {
            answer: 'yess',
            correct: true
          },
          {
            answer: 'no',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'The question duration is not a positive number' });
  });

  test('should return 400, question duration is not a positive number', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello new world',
        duration: 181,
        points: 4,
        answers: [
          {
            answer: 'yess',
            correct: true
          },
          {
            answer: 'no',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes' });
  });

  test('should return 400, incorrect points awarded for the question', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello new world',
        duration: 23,
        points: 0,
        answers: [
          {
            answer: 'yess',
            correct: true
          },
          {
            answer: 'no',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'The points awarded for the question are less than 1 or greater than 10' });
  });

  test('should return 400, incorrect length for the answer', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello new world',
        duration: 23,
        points: 2,
        answers: [
          {
            answer: '',
            correct: true
          },
          {
            answer: 'no',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'An answer string is less than 1 character in length or greater than 50 characters in length' });
  });

  test('should return 400, answer strings are duplicate', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello world',
        duration: 10,
        points: 5,
        answers: [
          {
            answer: 'yes',
            correct: true
          },
          {
            answer: 'no',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'There are duplicate answers in this question' });
  });

  test('should return 400, there is no correct answers', () => {
    const newDetails = {
      token: token,
      questionBody: {
        question: 'hello  new world',
        duration: 10,
        points: 5,
        answers: [
          {
            answer: 'yes',
            correct: false
          },
          {
            answer: 'no',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(400);
    expect(result).toStrictEqual({ error: 'There is no correct answer in this question' });
  });

  test('should return 401, not found token', () => {
    const newDetails = {
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(401);
    expect(result).toStrictEqual({ error: 'Token not found' });
  });

  test('should return 403, This user does not own this quiz', () => {
    const newDetails = {
      token: token + 1,
      questionBody: {
        question: 'hello  new world',
        duration: 10,
        points: 5,
        answers: [
          {
            answer: 'yes',
            correct: true
          },
          {
            answer: 'no',
            correct: false
          }
        ]
      }
    };
    const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: newDetails
    });

    const result = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(403);
    expect(result).toStrictEqual({ error: 'This user does not own this quiz' });
  });
});
