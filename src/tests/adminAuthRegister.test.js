import { adminAuthRegister } from '../src/auth.ts'
import { getData, setData } from '../src/dataStore.ts'
import { clear } from '../src/other.ts'

beforeEach(() => {
    clear();
  });
  describe('adminAuthRegister Tests', () => {
    test('Error email existed', () => {
      adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao');
      expect(adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao')).toStrictEqual({error : 'email existed'});
    });
    test('Error email format', () => {
        expect(adminAuthRegister("goodgmail.com", 'abcd1234', 'victor', 'xiao')).toStrictEqual({error : 'email should have specific format'});
    });
    test('Error password length', () => {
        expect(adminAuthRegister("good@gmail.com", 'abcd123', 'victor', 'xiao')).toStrictEqual({error: 'Password should be between 8 to 20 characters'});
    });
    test('Error password contains', () => {
        expect(adminAuthRegister("good@gmail.com", 'abcdefgh', 'victor', 'xiao')).toStrictEqual({error: 'Password should contain at least one number and at least one letter'});
    });
    test('Error password contains', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678', 'luffy', 'wang')).toStrictEqual({error: 'Password should contain at least one number and at least one letter'});
    });
    test('Error first name contains', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'luffy@', 'wang')).toStrictEqual({error : 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    });
    test('Error first name length', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'l', 'wang')).toStrictEqual({error : 'NameFirst should be between 2 to 20 characters'});
    });
    test('Error last name contains', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'luffy', 'wang^-^')).toStrictEqual({error : 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    });
    test('Error last name length', () => {
        expect(adminAuthRegister("good@gmail.com", '12345678abc', 'luffy', 'woshizhendefulezhegezuoyezhendeduo')).toStrictEqual({error : 'NameLast should be between 2 to 20 characters'});
    });
    test('Correct input', () => {
        const checkUser = adminAuthRegister("good@gmail.com", '12345abcde', 'victor', 'xiao');
        expect(checkUser.authUserId).toStrictEqual(getData().users[checkUser.authUserId].authUserId);
    });
  });