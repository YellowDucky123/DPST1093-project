import { adminQuizInfo } from '../src/quiz.js'
import { getData, setData } from '../src/dataStore.js'
import { clear } from '../src/other.js'

beforeEach(() => {
    clear();
  });
  describe('adminQuizInfo Tests', () => {
    test('invalid user id', () => {
      adminQuizInfo("1", '2');
      expect(adminQuizInfo("1", '2')).toStrictEqual({error: 'adminQuizInfo: invalid user id'});
    });
    test('invalid quiz id', () => {
        adminQuizInfo("1", '2');
        expect(adminQuizInfo("1", '2')).toStrictEqual({error: 'adminQuizInfo: invalid quiz id'});
    });
    test('do not own this', () => {
        adminQuizInfo("1", '2');
        expect(adminQuizInfo("1", '2')).toStrictEqual({error: 'adminQuizInfo: you do not own this quiz'});
    });
});