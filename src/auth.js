import { getData, setData} from './dataStore.js'
import validator from 'validator';
function someNewFeature(array) {
    for (const item of array) {
        console.log(item);
    }
}
export function adminUserPasswordUpdate ( authUserId, oldPassword, newPassword ) {
    if (checkPasswordLength(newPassword)) return { error: 'Password should be less than 8 characters' };
    if (checkPasswordContain(newPassword) === false) return { error: 'Password should contain at least one number and at least one letter' };    
    let data = getData();
    if (!(oldPassword === data.users[authUserId].password)) return { error : "password incorrecrt" };
    if (oldPassword === newPassword) return { error : "new Password can't be the old password" };
    if (data.users[authUserId].pastPassword.find(newPassword)) return { error : "This password has been used in past" };
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
        return {error : "can not find such a member"};
    }
    if (dataStore.users[authUserId].name === undefined) {
        dataStore.users[authUserId].name = dataStore.users[authUserId].nameFirst + " " + dataStore.users.nameLast;
    }
    return {
        user : {
          userId: data.authUserId,
          name: data.name,
          email: data.email,
          numSuccessfulLogin: data.numSuccessfulLogin,
          numFailedPasswordsSinceLastLogin: data.numFailedPasswordsSinceLastLogin,
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
        return {error: 'Password should be less than 8 characters'};
    }
    if (checkPasswordContain(password) === false) {
        return {error: 'Password should contain at least one number and at least one letter'};    
    }
    if (checkNameContains(nameFirst) === false) {
        return {error : 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'};    
    }
    if (checkNameFirstLength(nameFirst) === false) {
        return {error : 'NameFirst is less than 2 characters or more than 20 characters'};    
    }
    if (checkNameContains(nameLast) === false) {
        return {error : 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'};    
    }
    if (checkNameFirstLength(nameLast) === false) {
        return {error : 'NameLast less than 2 characters or more than 20 characters'};    
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
    return { authUserId : userId };      
}


//const a = adminAuthRegister("good@gmail.com", 'abcd11', 'a', 'b');
//const b = adminAuthRegister("cdod@gmail.com", 'ewcd11', 'a', 'b');


function checkPasswordLength(password) {
    if (password.length <= 8 && password.length > 0) {
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
        return false;
    }
    return true;
}

function emailExist(email) {
    const currentData = getData();
    for (let i = 0; i < currentData.length; i++) {
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
//console.log(getData());
//console.log("Can work");
