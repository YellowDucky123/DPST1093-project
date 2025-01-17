import { adminAuthRegister, adminUserPasswordUpdate } from '../auth';
import { clear } from '../other';
clear();
const idForCommonOne = adminAuthRegister('commonMan@163.com', 'Suitable123', 'common', 'human');

test('Change password correctly', () => {
  if (!('authUserId' in idForCommonOne)) throw Error;
  expect(adminUserPasswordUpdate(idForCommonOne.authUserId, 'Suitable123', 'Suitable456')).toEqual({});
});

test('new password not suitable', () => {
  if (!('authUserId' in idForCommonOne)) throw Error;
  expect(adminUserPasswordUpdate(idForCommonOne.authUserId, 'Suitable456', 'a111111')).toEqual({ error: 'Password should be at least than 8 characters' });
  expect(adminUserPasswordUpdate(idForCommonOne.authUserId, 'Suitable456', '1111111111111111111111')).toEqual({ error: 'Password should contain at least one number and at least one letter' });
  expect(adminUserPasswordUpdate(idForCommonOne.authUserId, 'Suitable456', 'aaaaaaaaaaaaaaaa')).toEqual({ error: 'Password should contain at least one number and at least one letter' });
});

test('change password by a wrong password', () => {
  if (!('authUserId' in idForCommonOne)) throw Error;
  expect(adminUserPasswordUpdate(idForCommonOne.authUserId, 'Suitable123', 'Suitable456')).toEqual({ error: 'password incorrecrt' });
});

test('change password by a used password', () => {
  if (!('authUserId' in idForCommonOne)) throw Error;
  expect(adminUserPasswordUpdate(idForCommonOne.authUserId, 'Suitable456', 'Suitable123')).toEqual({ error: 'This password has been used in past' });
});

test('change password by the password right now', () => {
  if (!('authUserId' in idForCommonOne)) throw Error;
  expect(adminUserPasswordUpdate(idForCommonOne.authUserId, 'Suitable456', 'Suitable456')).toEqual({ error: "new Password can't be the old password" });
});
