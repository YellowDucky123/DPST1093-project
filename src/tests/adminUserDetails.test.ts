import { adminUserDetails } from '../auth';
import { clear } from '../other';
import { adminAuthRegister } from '../auth';

clear();
const idfor86 = adminAuthRegister('86@163.com', '1111aaaa', 'sin', 'zano');
const idfor721 = adminAuthRegister('721@163.com', 'ciallo111', 'ning', 'ning');
if (!('authUserId' in idfor721)) throw Error;
if (!('authUserId' in idfor86)) throw Error;

test('no such a member', () => {
  if (!('authUserId' in idfor721)) throw Error;
  if (!('authUserId' in idfor86)) throw Error;
  let i = 1;
  for (i; i === idfor721.authUserId || i === idfor86.authUserId; i++);
  expect(adminUserDetails(i)).toEqual({ error: 'can not find such a member' });
});
test('get the detail of some one', () => {
  if (!('authUserId' in idfor721)) throw Error;
  if (!('authUserId' in idfor86)) throw Error;
  expect(adminUserDetails(idfor721.authUserId)).toEqual({
    user: {
      userId: idfor721.authUserId,
      name: 'ning ning',
      email: '721@163.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  });
});
test('get detail of another one', () => {
  if (!('authUserId' in idfor721)) throw Error;
  if (!('authUserId' in idfor86)) throw Error;
  expect(adminUserDetails(idfor86.authUserId)).toEqual({
    user: {
      userId: idfor86.authUserId,
      name: 'sin zano',
      email: '86@163.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  });
});
