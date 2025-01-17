import { setData, getData, users, quizzes, getPlayerData, Sessions } from './dataStore';
import validator from 'validator';
import { user } from './dataStore';
import { customAlphabet } from 'nanoid';
import { createHash } from 'crypto';
import { QuizSessionState } from './dataStore';
import request from 'sync-request-curl';
import config from './config.json';

export function userIdValidator(UserId: number) {
  const whData = getData();
  const data = whData.users;
  for (const i in data) {
    if (parseInt(i) === UserId) {
      return true;
    }
  }

  return false;
}

export function quizIdValidator(quizId: number) {
  const whData = getData();
  const data = whData.quizzes;
  for (const i in data) {
    if (parseInt(i) === quizId) {
      return true;
    }
  }

  return false;
}

export function deletedQuizIdValidator(quizId: number) {
  const whData = getData();
  const data = whData.quizzesDeleted;
  for (const i in data) {
    if (parseInt(i) === quizId) {
      return true;
    }
  }

  return false;
}

export function quizOwnership(userId: number, quizId: number) {
  const whData = getData();
  const qData = whData.quizzes;
  const ownedQuizzes = whData.users[userId].quizzesUserHave;

  for (const i in qData) {
    if (parseInt(`${i}`) === quizId) {
      // let q_name = q_data[i]['name'];

      for (const n of ownedQuizzes) {
        if (n === parseInt(i)) return true;
      }

      return false;
    }
  }
}

export function deletedQuizOwnership(userId: number, quizId: number) {
  const whData = getData();
  const qData = whData.quizzesDeleted;
  const ownedQuizzes = whData.users[userId].quizzesUserDeleted;

  for (const i in qData) {
    if (parseInt(`${i}`) === quizId) {
      // let q_name = q_data[i]['name'];

      for (const n of ownedQuizzes) {
        if (n === parseInt(i)) return true;
      }

      return false;
    }
  }
}

export function nameLen(name: string) {
  if (name.length < 3) {
    return false;
  } else if (name.length > 30) {
    return false;
  }

  return true;
}

export function isNameAlphaNumeric(str: string) {
  let code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code === 32)) { // space ' '
      return false;
    }
  }
  return true;
}

export function descriptionLengthValid(description: string) {
  if (description.length > 100) {
    return false;
  }

  return true;
}

export function isUsedQuizName(name: string, userId : number) {
  const data = getData();
  for (const item of data.users[userId].quizzesUserHave) {
    if (data.quizzes[`${item}`].name === name) {
      return false;
    }
  }
  return true;
}

// Check whether user ID is duplicate.
export function checkDuplicateUserId(useId: number) {
  const currentData = getData();
  for (const index in currentData.users) {
    if (useId === currentData.users[index].authUserId) {
      return true;
    }
  }
  return useId;
}

// Create a new authticated user with the provided details.
export function createNewAuth(nameFirst: string, nameLast: string, userId: number, email: string, password: string) {
  const name = nameFirst + ' ' + nameLast;
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
    quizzesUserDeleted: [],
    pastPassword: []
  };
  const dataStore = getData();
  dataStore.users[userId] = newUser;
  setData(dataStore);
}

// Checks the validity of the provided email, first name, and last name.
export function checkEmailNameFirstNameLast(email: string, nameFirst: string, nameLast: string): { error?: string } {
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
  if (emailExist(email) === true) {
    return { error: 'email existed' };
  }
  return {};
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
export function checkNameContains(nameFirst: string) {
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
  for (const authUserId in currentData.users) {
    if (email === currentData.users[authUserId].email) {
      return true;
    }
  }
  return false;
}

// Finds the authticated user ID by email address.
export function findAuthUserIdByEmail(email: string) {
  const currentData = getData();
  for (const index in currentData.users) {
    if (email === currentData.users[index].email) {
      return currentData.users[index].authUserId;
    }
  }
  return NaN;
}

// Check whether password is correct for the user.
export function checkPasswordCorrect(password: string, email: string) {
  const currentData = getData();
  for (const index in currentData.users) {
    if (password === currentData.users[index].password && currentData.users[index].email === email) {
      return true;
    }
  }
  return false;
}

// Finds the authticated user password by user ID.
export function findPasswordByAuthUserId(authUserId: number) {
  const currentData = getData();
  for (const index in currentData.users) {
    if (authUserId === currentData.users[index].authUserId) {
      return currentData.users[index].password;
    }
  }
  return false;
}

// checks whether the question exists within the specified quiz
export function questionFinder(quizId: number, questionId: number): boolean {
  const data = getData();
  if (!data.quizzes[quizId]) {
    return false;
  }

  const questions = data.quizzes[quizId].questions;
  if (!questions || questions.length === 0) {
    return false;
  }

  for (let i = 0; i < data.quizzes[quizId].questions.length; i++) {
    if (data.quizzes[quizId].questions[i].questionId === questionId) {
      return true;
    }
  }
  return false;
}

function checkIdDuplicate(id: number, object: users | quizzes | Sessions): boolean {
  let flag = false;
  for (const item in object) {
    if (id === parseInt(item)) {
      flag = true;
    }
  }
  return flag;
}

// create an Id, and check duplication within given object
export function createId(object: users | quizzes | Sessions): number {
  const Digit = 1000;
  let id: number = Math.floor(Math.random() * Digit);

  while (checkIdDuplicate(id, object) !== false) {
    id = Math.floor(Math.random() * Digit);
  }

  return id;
}

export function createQuestionId(quizId: number) {
  const data = getData();

  const nanoId = customAlphabet('01234567890', 3);
  let questionId = parseInt(nanoId());
  questionId = questionId * Math.pow(10, quizId.toString().length) + quizId;
  console.log('creating unique question id');
  while (1) {
    if (data.quizzes[quizId].questions.every(question => (question.questionId !== questionId * Math.pow(10, quizId.toString().length) + quizId))) {
      break;
    }
    questionId = parseInt(nanoId());
  }

  return questionId;
}

export function getCurrentTime() {
  return Math.floor(new Date().getTime() / 1000);
}

export function isPlayerExist(playerId: number) {
  // const P = getPlayerData();

  // for (const k in P) {
  //   if (parseInt(k) === playerId) return true;
  // }
  // return false;
  const data = getData();
  if(data.playerData[playerId] === undefined) {
    return false;
  } else {
    return true;
  }
}

// SHA-256 hash
export function hash(string: string) {
  return createHash('sha256').update(string).digest('hex');
}

// check file extension, and begin with "http"
export function urlCheck(url: string) {
  const allowExtensions = /.(jpeg|jpg|png)$/i;
  if (allowExtensions.test(url)) {
    const allowStart = /^(http:\/\/|https:\/\/)/;
    if (allowStart.test(url)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function countSessionNotEnd(quizId: number) {
  let cnt = 0;
  const data = getData();
  for (const item in data.Sessions) {
    if (data.Sessions[item].metadata.quizId === quizId) {
      if (data.Sessions[item].state != QuizSessionState.END) {
        cnt++;
      }
    }
  }

  return cnt;
}

export function sessionIdValidator(sessionId: number) {
  const data = getData();
  if (data.Sessions[sessionId] === undefined) {
    return false;
  } else {
    return true;
  }
}
