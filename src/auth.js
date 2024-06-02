import { getData, setData} from './dataStore.js'
import validator from 'validator';
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

// Check whether user ID is duplicate.
function checkDuplicateUserId(useId) {
    const currentData = getData();
    for (let index in currentData.users) {       
        if (useId === currentData.users[index].authUserId) {
            return true;
        }
    }
    return useId;    
}

// Create a new authticated user with the provided details.
function createNewAuth(nameFirst, nameLast, userId, email, password) {
    let name = nameFirst + ' ' + nameLast
    const newUser = {
        name: name,
        nameFirst: nameFirst,
        nameLast: nameLast,
        authUserId: userId,
        email: email,
        password: password,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
        quizzesUserHave: [],
        pastPassword: []
    };
    let dataStore = getData();
    dataStore.users[userId] = newUser;
    setData(dataStore);
}

// Checks the validity of the provided email, first name, and last name.
function checkEmailNameFirstNameLast(email, nameFirst, nameLast) {
    if (emailExist(email) === true) {
        return { error: 'email existed' };
    }
    if (validator.isEmail(email) === false) {
        return { error: 'email should have specific format' };
    }
    if (checkNameContains(nameFirst) === false) {
        return { error: 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
    }
    if (checkNameFirstLength(nameFirst) === false) {
        return { error: 'NameFirst should be between 2 to 20 characters' };
    }
    if (checkNameContains(nameLast) === false) {
        return { error: 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
    }
    if (checkNameFirstLength(nameLast) === false) {
        return { error: 'NameLast should be between 2 to 20 characters' };
    }
    return true;
}

// Check whether password length is valid.
function checkPasswordLength(password) {
    if (password.length >= 8) {
        return true;
    }
    return false;
}

// Check whether password contains is valid.
function checkPasswordContain(password) {
    let checkNumber = 0;
    let checkLetter = 0;
    for (let i = 0; i < password.length; i++) {
        if (validator.isAlpha(password[i])) {
            checkLetter = 1;
        }
        if (password[i] <= 9 && password[i] >= 0) {
            checkNumber = 1;
        }
    }
    if (checkLetter === 1 && checkNumber === 1) {
        return true;
    }
    return false;
}

// Check whether name contains is valid.
function checkNameContains (nameFirst) {
    for (let i = 0; i < nameFirst.length; i++) {
        if ((!validator.isAlpha(nameFirst[i])) && (nameFirst[i] !== '-') && (nameFirst[i] !== ' ') && (nameFirst[i] !== '\'')) {
            return false;
        }
    }
    return true;
}

// Check whether name length is valid.
function checkNameFirstLength(nameFirst) {
    if (nameFirst.length < 0) {
        return false;
    }
    if (nameFirst.length <= 20 && nameFirst.length >= 2) {
        return true;
    }
    return false;
}

// Check whether email existed.
function emailExist(email) {
    const currentData = getData();
    for (let index in currentData.users) {
        if (email === currentData.users[index].email) {
            return true;
        }
    }
    return false;
}

// Finds the authticated user ID by email address.
function findAuthUserIdByEmail(email) {
    const currentData = getData();
    for (let index in currentData.users) {
        if (email === currentData.users[index].email) {
            return currentData.users[index].authUserId;
        }
    }
    return false;
}

// Check whether password is correct for the user.
function checkPasswordCorrect(password) {
    const currentData = getData();
    for (let index in currentData.users) {
        if (password === currentData.users[index].password) {
            return true;
        }
    }
    return false;
}

// Finds the authticated user password by user ID.
function findPasswordByAuthUserId(authUserId) {
    const currentData = getData();
    for (let index in currentData.users) {
        if (authUserId === currentData.users[index].authUserId) {
            return currentData.users[index].password;
        }
    }
    return false;    
}