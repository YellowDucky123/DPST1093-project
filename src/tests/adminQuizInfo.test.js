import { adminQuizInfo } from '../quiz';
import { getData, setData } from '../dataStore';
import { clear } from '../other';

beforeEach(() => {
  clear();
});
describe('adminQuizInfo Tests', () => {
  test('invalid user id', () => {
    const data = getData();
    data.quizzes = {
      321: {
        name: 'thisIsName'
      },
      111: {
        name: 'hello'
      }
    };
    data.users = {
      123: {
        authUserId: 123,
        quizzesUserHave: ['321']
      },
      124: {
        authUserId: 124,
        quizzesUserHave: ['111']
      }
    };
    setData(data);

    expect(adminQuizInfo(125, 111)).toStrictEqual({ error: 'adminQuizInfo: invalid user id' });
  });
  test('invalid quiz id', () => {
    const data = getData();
    data.quizzes = {
      321: {
        name: 'thisIsName'
      }
    };
    data.users = {
      123: {
        authUserId: 123,
        quizzesUserHave: ['321']
      },
      124: {
        authUserId: 124,
        quizzesUserHave: []
      }
    };
    setData(data);

    expect(adminQuizInfo(123, 2)).toStrictEqual({ error: 'adminQuizInfo: invalid quiz id' });
  });
  test('do not own this', () => {
    const data = getData();
    data.quizzes = {
      321: {
        name: 'thisIsName'
      }
    };
    data.users = {
      123: {
        authUserId: 123,
        quizzesUserHave: ['321']
      },
      124: {
        authUserId: 124,
        quizzesUserHave: []
      }
    };
    setData(data);

    expect(adminQuizInfo(124, 321)).toStrictEqual({ error: 'adminQuizInfo: you do not own this quiz' });
  });
});
