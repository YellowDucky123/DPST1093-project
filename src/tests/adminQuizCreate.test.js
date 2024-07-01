import { adminQuizCreate } from '../quiz';
import { clear } from '../other';
import { adminAuthRegister } from '../auth';

beforeEach(() => {
  clear();
});
describe('adminQuizCreate Tests', () => {
  test('invalid user id', () => {
    const ID = adminAuthRegister('hello@gmail.com', '12345abcde', 'first', 'last');

    expect(adminQuizCreate(ID.authUserId + 1, 'thisIsName', 'hello world')).toStrictEqual({ error: 'adminQuizCreate: invalid user id' });
  });
  test('quiz name length', () => {
    const ID = adminAuthRegister('hello@gmail.com', '12345abcde', 'first', 'last');

    expect(adminQuizCreate(ID.authUserId, 'th', 'hello world')).toStrictEqual({ error: 'adminQuizCreate: invalid quiz name length' });
  });
  test('invalid letters', () => {
    const ID = adminAuthRegister('hello@gmail.com', '12345abcde', 'first', 'last');

    expect(adminQuizCreate(ID.authUserId, 'thisIsName%%%', 'hello world')).toStrictEqual({ error: 'adminQuizCreate: quiz name contains invalid letters' });
  });
  test('description too long', () => {
    const ID = adminAuthRegister('hello@gmail.com', '12345abcde', 'first', 'last');

    const long = [];
    for (let i = 0; i < 120; ++i) {
      long.push('1');
    }

    expect(adminQuizCreate(ID.authUserId, 'thisIsName', long)).toStrictEqual({ error: 'adminQuizCreate: quiz description is too long' });
  });
  test('quiz name used', () => {
    clear();
    const uid = adminAuthRegister('test@mail.com', 'password1', 'name', 'try');
    adminQuizCreate(uid.authUserId, 'thisIsName', 'hello world');
    expect(adminQuizCreate(uid.authUserId, 'thisIsName', 'hello world')).toStrictEqual({ error: 'adminQuizCreate: quiz name already used by another user' });
  });
});
clear();
