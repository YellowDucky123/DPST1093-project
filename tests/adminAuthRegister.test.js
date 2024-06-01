import { adminAuthRegister } from '../src/auth.js'
import { getData, setData } from '../src/dataStore.js'
import { clear } from '../src/other.js'

beforeEach(() => {
    clear();
  });
  describe('adminAuthRegister Tests', () => {
    test('error email existed', () => {
      adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao');
      expect(adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao')).toStrictEqual({error : 'email existed'});
    });
    test('error email format', () => {
        expect(adminAuthRegister("goodgmail.com", 'abcd1234', 'victor', 'xiao')).toStrictEqual({error : 'email should have specific format'});
    });
    test('error password length', () => {
        expect(adminAuthRegister("good@gmail.com", 'abcd123', 'victor', 'xiao')).toStrictEqual({error: 'Password should be between 8 to 20 characters'});
    });
    test('error password contains', () => {
        expect(adminAuthRegister("good@gmail.com", 'abcdefgh', 'victor', 'xiao')).toStrictEqual({error: 'Password should contain at least one number and at least one letter'});
    });
    test('error password contains', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678', 'luffy', 'wang')).toStrictEqual({error: 'Password should contain at least one number and at least one letter'});
    });
    test('error first name contains', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'luffy@', 'wang')).toStrictEqual({error : 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    });
    test('error first name length', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'l', 'wang')).toStrictEqual({error : 'NameFirst should be between 2 to 20 characters'});
    });
    test('error last name contains', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'luffy', 'wang^-^')).toStrictEqual({error : 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    });
    test('error last name length', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'luffy', 'woshizhendefulezhegezuoyezhendeduo')).toStrictEqual({error : 'NameLast should be between 2 to 20 characters'});
    });
    test('correct input', () => {
        const a = adminAuthRegister("good@gmail.com", '12345abcde', 'victor', 'xiao');
        expect(a.authUserId).toStrictEqual(getData().users[a.authUserId].authUserId);
    });
  });