import { setData, getData, data, users, quizzes, quiz } from './dataStore'
import validator from 'validator';
import { user } from './dataStore'; 

export function userIdValidator(UserId: number) {
    let wh_data = getData();
    let data = wh_data.users;
    for(const i in data) {
        if(parseInt(i) === UserId) {
            return true;
        }
    }

    return false;
}

export function quizIdValidator(quizId: number) {
    let wh_data = getData();
    let data = wh_data.quizzes;
    for(const i in data) {
        if(parseInt(i) === quizId) {
            return true;
        }
    }

    return false;
}

export function deletedQuizIdValidator(quizId: number) {
    let wh_data = getData();
    let data = wh_data.quizzesDeleted;
    for(const i in data) {
        if(parseInt(i) === quizId) {
            return true;
        }
    }

    return false;
}

export function quizOwnership(userId: number, quizId: number) {
    let wh_data = getData();
    let q_data = wh_data.quizzes;
    let owned_quizzes = wh_data['users'][userId]['quizzesUserHave'];
    let flag = 0;

    for(const i in q_data) {
        if(parseInt(`${i}`) === quizId) {
            // let q_name = q_data[i]['name'];

            for(const n of owned_quizzes) {
                if(n === parseInt(i)) return true;
            }
            
            return false;
        }
    }
}

export function deletedQuizOwnership(userId: number, quizId: number) {
    let wh_data = getData();
    let q_data = wh_data.quizzesDeleted;
    let owned_quizzes = wh_data['users'][userId].quizzesUserDeleted;
    let flag = 0;

    for(const i in q_data) {
        if(parseInt(`${i}`) === quizId) {
            // let q_name = q_data[i]['name'];

            for(const n of owned_quizzes) {
                if(n === parseInt(i)) return true;
            }
            
            return false;
        }
    }
}

export function nameLen(name: string) {
    if(name.length < 3) {
        return false;
    }
    else if(name.length > 30) {
        return false;
    }

    return true;
}

export function isNameAlphaNumeric(str: string) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123) && // lower alpha (a-z)
          !(code == 32)) { // space ' '
        return false;
      }
    }
    return true;
  };

export function description_length_valid(description: string) {
    if(description.length > 100) {
        return false;
    }

    return true;
}

export function isUsedQuizName(name: string){
    const data = getData();
    for(let item in data.quizzes){
        if(data.quizzes[item].name == name) {
            return false;
        }
    }
    return true;
}

// Check whether user ID is duplicate.
export function checkDuplicateUserId(useId: number) {
    const currentData = getData();
    for (let index in currentData.users) {       
        if (useId === currentData.users[index].authUserId) {
            return true;
        }
    }
    return useId;    
}

// Create a new authticated user with the provided details.
export function createNewAuth(nameFirst: string, nameLast: string, userId: number, email: string, password: string) {
    let name = nameFirst + ' ' + nameLast
    const newUser: user = {
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
export function checkEmailNameFirstNameLast(email: string, nameFirst: string, nameLast: string) {
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
    return undefined;
}

// Check whether password length is valid.
export function checkPasswordLength(password: string) {
    if (password.length >= 8) {
        return true;
    }
    return false;
}

// Check whether password contains is valid.
export function checkPasswordContain(password: string) {
    let checkNumber = 0;
    let checkLetter = 0;
    for (let i = 0; i < password.length; i++) {
        if (validator.isAlpha(password[i])) {
            checkLetter = 1;
        }
        if (password[i] <= '9' && password[i] >= '0') {
            checkNumber = 1;
        }
    }
    if (checkLetter === 1 && checkNumber === 1) {
        return true;
    }
    return false;
}

// Check whether name contains is valid.
export function checkNameContains (nameFirst: string) {
    for (let i = 0; i < nameFirst.length; i++) {
        if ((!validator.isAlpha(nameFirst[i])) && (nameFirst[i] !== '-') && (nameFirst[i] !== ' ') && (nameFirst[i] !== '\'')) {
            return false;
        }
    }
    return true;
}

// Check whether name length is valid.
export function checkNameFirstLength(nameFirst: string) {
    if (nameFirst.length < 0) {
        return false;
    }
    if (nameFirst.length <= 20 && nameFirst.length >= 2) {
        return true;
    }
    return false;
}

// Check whether email existed.
export function emailExist(email: string) {
    const currentData = getData();
    for (let authUserId in currentData.users) {
        if (email === currentData.users[authUserId].email) {
            return true;
        }
    }
    return false;
}

// Finds the authticated user ID by email address.
export function findAuthUserIdByEmail(email: string) {
    const currentData = getData();
    for (let index in currentData.users) {
        if (email === currentData.users[index].email) {
            return currentData.users[index].authUserId;
        }
    }
    return false;
}

// Check whether password is correct for the user.
export function checkPasswordCorrect(password: string, email: string) {
    const currentData = getData();
    for (let index in currentData.users) {
        if (password === currentData.users[index].password && currentData.users[index].email === email) {
            return true;
        }
    }
    return false;
}

// Finds the authticated user password by user ID.
export function findPasswordByAuthUserId(authUserId: number) {
    const currentData = getData();
    for (let index in currentData.users) {
        if (authUserId === currentData.users[index].authUserId) {
            return currentData.users[index].password;
        }
    }
    return false;    
}

//checks whether the question exists within the specified quiz
export function questionFinder(quizId: number, questionId: number): Boolean {
    const data = getData();
    for(const d of data.quizzes[quizId].questions) {
        if(d.questionId === questionId) return true;
    }
    return false;
}

function checkIdDuplicate(id: number, object: users | quizzes): boolean {
    let flag: boolean = false;
    for(const item in object) {
        if(id === parseInt(item)) {
            flag = true;
        }
    }
    return flag;
}

//create an Id, and check duplication within given object
export function createId(obejct: users | quizzes): number {
    const Digit = 1000;
    let id: number = Math.floor(Math.random()*Digit);

    while(checkIdDuplicate(id, obejct) != false) {
        id = Math.floor(Math.random()*Digit);
    }

    return id;
}