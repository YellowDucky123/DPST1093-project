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

        expect(adminQuizCreate(123, 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: invalid user id'});
    });
    test('quiz name length', () => {
        let data = getData();
        data.users = {
            '123': {
                authUserId: '123'
            }
        };
        setData(data);

        adminQuizCreate('123', 'th', 'hello world');
        expect(adminQuizCreate('123', 'th', 'hello world')).toStrictEqual({error: 'adminQuizCreate: invalid quiz name length'});
    });
    // test('invalid letters', () => {
    //     let data = getData();
    //     const userData = {
    //         name: 'aaa'
    //     };
    //     data.users['1'] = userData;
    //     setData(data);
    //     adminQuizCreate('1', 'thisIsName', 'hello world');
    //     expect(adminQuizCreate('1', 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz name contains invalid letters'});
    // });
    // test('description too long', () => {
    //     let data = getData();
    //     const userData = {
    //         name: 'aaa'
    //     };
    //     data.users['1'] = userData;
    //     setData(data);
    //     adminQuizCreate('1', 'thisIsName', 'hello world');
    //     expect(adminQuizCreate('1', 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz description too long'});
    // });
    // test('quiz name used', () => {
    //     let data = getData();
    //     const userData = {
    //         name: 'aaa'
    //     };
    //     data.users['1'] = userData;
    //     setData(data);
    //     adminQuizCreate('1', 'thisIsName', 'hello world');
    //     expect(adminQuizCreate('1', 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz name already used by another user'});
    // });
});