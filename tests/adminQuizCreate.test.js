import { adminQuizCreate } from '../src/quiz.js'
import { getData, setData } from '../src/dataStore.js'
import { clear } from '../src/other.js'

beforeEach(() => {
    clear();
  });
  describe('adminQuizCreate Tests', () => {
    test('invalid user id', () => {
        let data = getData();
        data.users = {
            '123': {
                authUserId: 123
            }
        };
        setData(data);

        expect(adminQuizCreate(124, 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: invalid user id'});
    });
    test('quiz name length', () => {
        let data = getData();
        data.users = {
            '123': {
                authUserId: '123'
            }
        };
        setData(data);

        expect(adminQuizCreate('123', 'th', 'hello world')).toStrictEqual({error: 'adminQuizCreate: invalid quiz name length'});
    });
    test('invalid letters', () => {
        let data = getData();
        data.users = {
            '123': {
                authUserId: '123'
            }
        };
        setData(data);

        expect(adminQuizCreate(123, 'thisIsName%%%', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz name contains invalid letters'});
    });
    test('description too long', () => {
        let data = getData();
        data.users = {
            '123': {
                authUserId: '123'
            }
        };
        setData(data);

        let long = [];
        for(let i = 0; i < 120; ++i){
            long.push('1');
        }

        expect(adminQuizCreate(123, 'thisIsName', long)).toStrictEqual({error: 'adminQuizCreate: quiz description is too long'});
    });
    test('quiz name used', () => {
        let data = getData();
        data.quizzes = {
            '1': {
                name: 'thisIsName'
            }
        }
        data.users = {
            '123': {
                authUserId: '123'
            }
        };
        setData(data);

        expect(adminQuizCreate('123', 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz name already used by another user'});
    });
});