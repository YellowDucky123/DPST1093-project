import { adminAuthRegister, adminUserDetailsUpdate} from '../auth'
import { clear } from '../other'

beforeEach(() => {
    clear();   
  });
  describe('adminUserDetailsUpdate Tests', () => {
    test('Error email existed', () => {
        adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        const userId2 = adminAuthRegister("good2@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        expect(adminUserDetailsUpdate(userId2, "good@gmail.com", 'victor', 'xiao')).toStrictEqual({error : 'email existed'});
    });
    test('Error email format', () => {
        const userId = adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        expect(adminUserDetailsUpdate(userId, "goodgmail.com", 'victor', 'xiao')).toStrictEqual({error : 'email should have specific format'});
    });
    test('Error first name contains', () => {
        const userId = adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        expect(adminUserDetailsUpdate(userId, "good@gcmail.com", 'luffy@', 'wang')).toStrictEqual({error : 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    });
    test('Error first name length', () => {
        const userId = adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        expect(adminUserDetailsUpdate(userId, "good@gcmail.com", 'l', 'wang')).toStrictEqual({error : 'NameFirst should be between 2 to 20 characters'});
    });
    test('Error last name contains', () => {
        const userId = adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        expect(adminUserDetailsUpdate(userId, "good@gcmail.com", 'luffy', 'wang@')).toStrictEqual({error : 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    });
    test('Error last name length', () => {
        const userId = adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        expect(adminUserDetailsUpdate(userId, "good@gcmail.com", 'luffy', 'wangzuoyeshizhendezhendehaoduoa')).toStrictEqual({error : 'NameLast should be between 2 to 20 characters'});
    });
    test('Correct update', () => {
        const userId = adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao').authUserId;
        expect(adminUserDetailsUpdate(userId, "good@gcmail.com", 'luffy', 'wang')).toStrictEqual({});
    });  
  });