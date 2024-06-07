import { getData, setData } from './dataStore.js'
import validator from 'validator';
import {
    checkDuplicateUserId, createNewAuth, checkEmailNameFirstNameLast, checkPasswordContain,
    emailExist, findAuthUserIdByEmail, findPasswordByAuthUserId, checkPasswordCorrect, checkPasswordLength
} from './helpers.js';
export function someNewFeature(array) {
    for (const item of array) {
        console.log(item);
    }
}

/*
'oldPassword' is the current password,
'newPassword' is the password you want to set to.
every password should follow the same standard,
the oldPassword have to be correct,
the newPassword can't equal to oldPassword,
the newPassword can also not be any password used in the past
*/
export function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
    let data = getData();    
    // check whether the password is valid
    if (!checkPasswordLength(newPassword)) 
        return { error: 'Password should be at least than 8 characters' };
    if (!checkPasswordContain(newPassword)) 
        return { error: 'Password should contain at least one number and at least one letter' };

    // check whether the new password is suitable
    if (!(oldPassword === data.users[authUserId].password)) 
        return { error: "password incorrecrt" };
    if (oldPassword === newPassword) 
        return { error: "new Password can't be the old password" };
    if (data.users[authUserId].pastPassword.includes(newPassword)) 
        return { error: "This password has been used in past" };

    // update new password
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
    if (data.name === undefined) {
        data.name = data.nameFirst + " " + data.nameLast;
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
    var data = getData();
    const userId = Object.keys(data.users).length + 1;
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
export function adminAuthLogin(email, password) {
    console.log("adminAuthLogin")
    if (emailExist(email)) {
        if (checkPasswordCorrect(password, email)) {
            let useId = findAuthUserIdByEmail(email)
            var data = getData();
            data.users[useId].numSuccessfulLogins += 1;
            data.users[useId].numFailedPasswordsSinceLastLogin = 0;
            setData(data);
            return {
                authUserId: useId
            };
        }
        let useId = findAuthUserIdByEmail(email)
        var data = getData();
        data.users[useId].numFailedPasswordsSinceLastLogin += 1;
        setData(data)
        return { error: 'Passord is not correct for the given email' };
    }
    return { error: 'Email address does not exist' };
}

// Updates the details of an autheticated admin user with the provided details.
export function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
    console.log("adminUserDetailsUpdate")
    if (checkEmailNameFirstNameLast(email, nameFirst, nameLast) !== true) {
        return checkEmailNameFirstNameLast(email, nameFirst, nameLast)
    }
    let data = getData()
    data.users[authUserId].email = email;
    data.users[authUserId].nameFirst = nameFirst;
    data.users[authUserId].nameLast = nameLast;
    setData(data);
    return {};
}