import { adminQuizRemove } from '../quiz.ts'
import { getData, setData } from '../dataStore.ts'
import { clear } from '../other.ts'

beforeEach(() => {
    clear();
  });
  describe('adminQuizRemove Tests', () => {
    test('invalid user id', () => {
        let data = getData();
        data.quizzes = {
            '321': {
                name: 'thisIsName'
            }
        }
        data.users = {
            '123': {
                authUserId: 123
            }
        };
        setData(data);
      expect(adminQuizRemove('124', '321')).toStrictEqual({error: 'adminQuizRemove: invalid user id'});
    });
    test('invalid quiz id', () => {
        let data = getData();
        data.quizzes = {
            '1': {
                name: 'thisIsName'
            }
        }
        data.users = {
            '123': {
                authUserId: 123
            }
        };
        setData(data);
        expect(adminQuizRemove('123', '2')).toStrictEqual({error: 'adminQuizRemove: invalid quiz id'});
    });
    test('do not own this', () => {
        let data = getData();
        data.quizzes = {
            '321': {
                name: 'thisIsName'
            }
        }
        data.users = {
            '123': {
                authUserId: 123,
                quizzesUserHave : ['321']
            },
            '124': {
                authUserId: 124,
                quizzesUserHave : []
            }
        };
        setData(data);
        expect(adminQuizRemove('124', '321')).toStrictEqual({error: 'adminQuizRemove: you do not own this quiz'});
    });
});