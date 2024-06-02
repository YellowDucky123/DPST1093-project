import { adminQuizCreate } from '../src/quiz.js'
import { getData, setData } from '../src/dataStore.js'
import { clear } from '../src/other.js'

beforeEach(() => {
    clear();
  });
  describe('adminQuizCreate Tests', () => {
    test('invalid user id', () => {
      adminQuizCreate("1", 'thisIsName', 'hello world');
      expect(adminQuizCreate("1", 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: invalid user id'});
    });
    test('quiz name length', () => {
      adminQuizCreate("1", 'thisIsName', 'hello world');
      expect(adminQuizCreate("1", 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: invalid quiz name length'});
    });
    test('invalid letters', () => {
        adminQuizCreate("1", 'thisIsName', 'hello world');
        expect(adminQuizCreate("1", 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz name contains invalid letters'});
    });
    test('description too long', () => {
        adminQuizCreate("1", 'thisIsName', 'hello world');
        expect(adminQuizCreate("1", 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz description too long'});
    });
    test('quiz name used', () => {
        adminQuizCreate("1", 'thisIsName', 'hello world');
        expect(adminQuizCreate("1", 'thisIsName', 'hello world')).toStrictEqual({error: 'adminQuizCreate: quiz name already used by another user'});
    });
});