import { adminQuizRemove } from '../src/quiz.js'
import { getData, setData } from '../src/dataStore.js'
import { clear } from '../src/other.js'

beforeEach(() => {
    clear();
  });
  describe('adminQuizRemove Tests', () => {
    test('invalid user id', () => {
      adminQuizRemove("1", '2');
      expect(adminQuizRemove("1", '2')).toStrictEqual({error: 'adminQuizRemove: invalid user id'});
    });
    test('invalid quiz id', () => {
        adminQuizRemove("1", '2');
        expect(adminQuizRemove("1", '2')).toStrictEqual({error: 'adminQuizRemove: invalid quiz id'});
    });
    test('do not own this', () => {
        adminQuizRemove("1", '2');
        expect(adminQuizRemove("1", '2')).toStrictEqual({error: 'adminQuizRemove: you do not own this quiz'});
    });
});