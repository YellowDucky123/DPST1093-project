import { nextDay } from 'date-fns/fp/nextDay';
import { getData, setData} from './dataStore.js'
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

export function adminAuthRegister(email, password, nameFirst, nameLast) {
    if (emailExist(email) === true)  {
        return {error : 'email existed'};
    }
    if (validator.isEmail(email) === false) {
        return {error : 'email should have specific format'};    
    }
    if (checkPasswordLength(password) === false) {
        return {error: 'Password should be between 8 to 20 characters'};
    }
    if (checkPasswordContain(password) === false) {
        return {error: 'Password should contain at least one number and at least one letter'};    
    }
    if (checkNameContains(nameFirst) === false) {
        return {error : 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'};    
    }
    if (checkNameFirstLength(nameFirst) === false) {
        return {error : 'NameFirst should be between 2 to 20 characters'};    
    }
    if (checkNameContains(nameLast) === false) {
        return {error : 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'};    
    }
    if (checkNameFirstLength(nameLast) === false) {
        return {error : 'NameLast should be between 2 to 20 characters'};    
    }
    let userId = Math.floor(10000000 + Math.random() * 90000000).toString();
    let name = nameFirst + ' ' + nameLast
    const newUser = {
        name : name,
        nameFirst : nameFirst,
        nameLast : nameLast,
        authUserId : userId,
        email : email,
        password : password,
        numSuccessfulLogins : 1,
        numFailedPasswordsSinceLastLogin : 0,
        quizzesUserHave : [],
        pastPassword: []
    };
    let dataStore = getData(); 
    dataStore.users[userId] = newUser;
    setData(dataStore);
    return { authUserId : userId };      
}


//adminAuthRegister("good@gmail.com", 'abcd1234', 'victor', 'xiao');
//const b = adminAuthRegister("good@gmail.com", 'ewcd11', 'a', 'b');


function checkPasswordLength(password) {
    if (password.length >= 8) {
        return true;
    }
    return false;
}

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

function checkNameContains (nameFirst) {
    for (let i = 0; i < nameFirst.length; i++) {
        if ((!validator.isAlpha(nameFirst[i])) && (nameFirst[i] !== '-') && (nameFirst[i] !== ' ') && (nameFirst[i] !== '\'')) {
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
        return true;
    }
    return false;
}

function emailExist(email) {
    const currentData = getData();
    for (let index in currentData.users) {       
        if (email === currentData.users[index].email) {
            return true;
        }
    }
    return false;
}

function findAuthUserIdByEmail(email) {
    const currentData = getData();
    for (let index in currentData.users) {       
        if (email === currentData.users[index].email) {
            return currentData.users[index].authUserId;
        }
    }
    return false;
}

export function adminAuthLogin(email, password) {
    if (emailExist(email)) {
        if (checkPasswordCorrect(password)) {
            return {
                authUserId: findAuthUserIdByEmail(email)
            };
        }
        return {error: 'Passord is not correct for the given email'};
    }
    return {error: 'Email address does not exist'};  
}

function checkPasswordCorrect(password) {
    const currentData = getData();
    for (let index in currentData.users) {       
        if (password === currentData.users[index].password) {
            return true;
        }
    }
    return false;
}
//console.log(adminAuthLogin("good@gmail.com", 'abcd1234'));
//console.log(b);