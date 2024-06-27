import { adminAuthRegister, adminAuthLogin } from '../auth'
import { getData, setData } from '../dataStore'
import { clear } from '../other'

beforeEach(() => {
    clear();
  });
  describe('adminAuthLogin Tests', () => {
    test('Error email does not exist', () => {  
        adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao')    
        expect(adminAuthLogin("good@cmail.com", 'abcd1234')).toStrictEqual({error: 'Email address does not exist'});
    });
    test('Password is not correct for the given address', () => {
        adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao')
        expect(adminAuthLogin("good@gmail.com", 'abcd12345')).toStrictEqual({error: 'Passord is not correct for the given email'});
    });
    test('Successful login', () => {
        const checkUser = adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao');
        expect(checkUser.authUserId).toStrictEqual(getData().users[checkUser.authUserId].authUserId);
    });    
  });