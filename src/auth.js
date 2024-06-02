import { getData, setData} from './dataStore.js'
import validator from 'validator';
import { checkDuplicateUserId, createNewAuth, checkEmailNameFirstNameLast, checkPasswordContain, 
    emailExist, findAuthUserIdByEmail, findPasswordByAuthUserId, checkPasswordCorrect, checkPasswordLength} from './helpers.js';
function someNewFeature(array) {
    for (const item of array) {
        console.log(item);
    }
}
export function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
    if (!checkPasswordLength(newPassword)) return { error: 'Password should be at least than 8 characters' };
    if (checkPasswordContain(newPassword) === false) return { error: 'Password should contain at least one number and at least one letter' };
    let data = getData();
    if (!(oldPassword === data.users[authUserId].password)) return { error: "password incorrecrt" };
    if (oldPassword === newPassword) return { error: "new Password can't be the old password" };
    if (data.users[authUserId].pastPassword.includes(newPassword)) return { error: "This password has been used in past" };
    data.users[authUserId].password = newPassword;
    data.users[authUserId].pastPassword.push(oldPassword);
    setData(data);
    return {};
}
/*********************************************************************************************|
|*Given an admin user's "authUserId", return details about the user.                         *|
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them *|
|*********************************************************************************************/
export function adminUserDetails(authUserId) {
    let dataStore = getData();
    let data = dataStore.users[authUserId];
    if (data === undefined) {
        return { error: "can not find such a member" };
    }
    if (dataStore.users[authUserId].name === undefined) {
        dataStore.users[authUserId].name = dataStore.users[authUserId].nameFirst + " " + dataStore.users.nameLast;
    }
    return {
        user: {
            userId: data.authUserId,
            name: data.name,
            email: data.email,
            numSuccessfulLogin: data.numSuccessfulLogin,
            numFailedPasswordsSinceLastLogin: data.numFailedPasswordsSinceLastLogin,
        }
    };
}

// Register a new admin user with provided email, password, first name, last name.
export function adminAuthRegister(email, password, nameFirst, nameLast) {
    if (checkEmailNameFirstNameLast(email, nameFirst, nameLast) !== true) {
        return checkEmailNameFirstNameLast(email, nameFirst, nameLast);
    }
    if (checkPasswordLength(password) === false) {
        return { error: 'Password should be between 8 to 20 characters' };
    }
    if (checkPasswordContain(password) === false) {
        return { error: 'Password should contain at least one number and at least one letter' };
    }
    let userId;
    while (1) {
        userId = Math.floor(10000000 + Math.random() * 90000000).toString();
        if (checkDuplicateUserId(userId) != true) {
            break;
        }
    }
    createNewAuth(nameFirst, nameLast, userId, email, password); 
    return { authUserId : userId };      
}

// Authenticates an admin user with the provided email and password.
export function adminAuthLogin(email, password) {
    if (emailExist(email)) {
        if (checkPasswordCorrect(password)) {
            return {
                authUserId: findAuthUserIdByEmail(email)
            };
        }
        return { error: 'Passord is not correct for the given email' };
    }
    return { error: 'Email address does not exist' };
}

// Updates the details of an autheticated admin user with the provided details.
export function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
    if (checkEmailNameFirstNameLast(email, nameFirst, nameLast) !== true)  {
        return checkEmailNameFirstNameLast(email, nameFirst, nameLast)
    }
    let password = findPasswordByAuthUserId(authUserId);
    createNewAuth(nameFirst, nameLast, authUserId, email, password) 
    return {};
}