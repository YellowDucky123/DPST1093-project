import { findUserIdByToken, getData, setData } from './dataStore';
import {
  createNewAuth,
  checkEmailNameFirstNameLast,
  checkPasswordContain,
  findAuthUserIdByEmail,
  checkPasswordLength
} from './helpers';
export function someNewFeature(array: []) {
  for (const item of array) {
    console.log(item);
  }
}
import { customAlphabet } from 'nanoid';
/*
'oldPassword' is the current password,
'newPassword' is the password you want to set to.
every password should follow the same standard,
the oldPassword have to be correct,
the newPassword can't equal to oldPassword,
the newPassword can also not be any password used in the past
*/
export function adminUserPasswordUpdate(authUserId: number, oldPassword: string, newPassword: string) {
  const data = getData();
  // check whether the password is valid
  if (!checkPasswordLength(newPassword)) { return { error: 'Password should be at least than 8 characters' }; }
  if (!checkPasswordContain(newPassword)) { return { error: 'Password should contain at least one number and at least one letter' }; }

  // check whether the new password is suitable
  if (!(oldPassword === data.users[authUserId].password)) { return { error: 'password incorrecrt' }; }
  if (oldPassword === newPassword) { return { error: "new Password can't be the old password" }; }
  if (data.users[authUserId].pastPassword.includes(newPassword)) { return { error: 'This password has been used in past' }; }

  // update new password
  data.users[authUserId].password = newPassword;
  data.users[authUserId].pastPassword.push(oldPassword);
  setData(data);
  return {};
}
/** *******************************************************************************************|
|*Given an admin user's "authUserId", return details about the user.                         *|
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them *|
|*********************************************************************************************/
export function adminUserDetails(authUserId: number) {
  const dataStore = getData();
  const data = dataStore.users[authUserId];
  if (data === undefined) {
    return { error: 'can not find such a member' };
  }
  if (data.name === undefined) {
    data.name = data.nameFirst + ' ' + data.nameLast;
  }
  return {
    user: {
      userId: data.authUserId,
      name: data.name,
      email: data.email,
      numSuccessfulLogins: data.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: data.numFailedPasswordsSinceLastLogin,
    }
  };
}

// Register a new admin user with provided email, password, first name, last name.
export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): { error?: string } | { authUserId: number } {
  const check = checkEmailNameFirstNameLast(email, nameFirst, nameLast);
  if ('error' in check) {
    return check;
  }
  if (checkPasswordLength(password) === false) {
    return { error: 'Password should be between 8 to 20 characters' };
  }
  if (checkPasswordContain(password) === false) {
    return { error: 'Password should contain at least one number and at least one letter' };
  }
  const data = getData();
  const nanoId = customAlphabet('0123456789', 5);
  let userId = parseInt(nanoId());
  while (1) {
    if (data.users[userId] === undefined) {
      break;
    }
    userId = parseInt(nanoId());
  }
  createNewAuth(nameFirst, nameLast, userId, email, password);
  return { authUserId: userId };
}

/*             test for adminAuthLogin
adminAuthRegister("sd@163.com", "111a1aaa", "thyr", "soirgn")
console.log(adminAuthLogin ("sd@163.com", "111a1aaa"))
console.log(getData())
console.log(adminAuthLogin ("sd@163.com", "111a1aaa"))
console.log(getData())
*/
// Authenticates an admin user with the provided email and password.
export function adminAuthLogin(email: string, password: string) {
  console.log('adminAuthLogin');
  const data = getData();
  const authUserId = findAuthUserIdByEmail(email);
  if (authUserId) {
    if (data.users[authUserId].password === password) {
      data.users[authUserId].numSuccessfulLogins += 1;
      data.users[authUserId].numFailedPasswordsSinceLastLogin = 0;
      setData(data);
      return {
        authUserId: authUserId
      };
    } else {
      data.users[authUserId].numFailedPasswordsSinceLastLogin += 1;
      setData(data);
      return { error: 'Passord is not correct for the given email' };
    }
  }
  return { error: 'Email address does not exist' };
}

// Updates the details of an autheticated admin user with the provided details.
export function adminUserDetailsUpdate(authUserId: number, email: string, nameFirst: string, nameLast: string): object {
  console.log('adminUserDetailsUpdate');
  const check = checkEmailNameFirstNameLast(email, nameFirst, nameLast);
  if ('error' in check && !(check.error === 'email existed' && getData().users[authUserId].email === email)) {
    return check;
  }
  const data = getData();
  data.users[authUserId].email = email;
  data.users[authUserId].nameFirst = nameFirst;
  data.users[authUserId].nameLast = nameLast;
  data.users[authUserId].name = nameFirst + ' ' + nameLast;
  setData(data);
  return {};
}

export function adminAuthLogout(token: string): { error?: string } | any {
  const userId = findUserIdByToken(token);
  if (!userId) {
    return { error: 'Token is empty or invalid (does not refer to a valid logged-in user session)' };
  }
  const data = getData();
  delete data.tokenUserIdList[token];
  setData(data);
  return {};
}
