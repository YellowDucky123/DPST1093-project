import { getData } from './dataStore.js'
import validator from 'validator';
function someNewFeature(array) {
    for (const item of array) {
        console.log(item);
    }
}

/*********************************************************************************************|
|*Given an admin user's "authUserId", return details about the user.                         *|
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them *|
|*********************************************************************************************/
function adminUserDetails(authUserId) {
    return { 
        user : {
          userId: 1,
          name: 'Jar Jar Brinks',
          email: 'mesasosorry@naboo.com.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
        }
    };
}

function adminAuthRegister(email, password, nameFirst, nameLast) {
    if (dataExist(email) === true)  {
        return {error : 'email existed'};
    }
    if (validator.isEmail(email) === false) {
        return {error : 'wrong email'};    
    }
    if (checkName(nameFirst) === false) {
        return {error : 'wrong first name'};    
    }
    if (checkName(nameLast) === false) {
        return {error : 'wrong last name'};    
    }      
}

function checkName (nameFirst) {
    for (let i = 0; i < nameFirst.length; i++) {
        if ((nameFirst[i] !== validator.isAlpha) || (checkNameFirstLength === false)) {
            return false;
        }
        if ((nameFirst !== '') || (checkNameFirstLength === false)) {
            return false;
        }
        if ((nameFirst !== '-') || (checkNameFirstLength === false)) {
            return false;
        }
        if ((nameFirst !== '\'') || (checkNameFirstLength === false)) {
            return false;
        }
    }
    
    return true;
}

function checkNameFirstLength(nameFirst) {
    if (nameFirst.length < 0) {
        return false;
    }
    if (nameFirst.length <= 20 && nameFirst.length >= 2) {
        return false;
    }
    return true;
}

function dataExist(email) {
    const currentData = getData();
    for (i = 0; i < currentData.length; i++) {
        if (email === currentData[i].email) {
            return true;
        }
    }
    return false;
}

function adminAuthLogin(email, password) {
    return {
        authUserId: 1
    };
}
console.log("Can work");