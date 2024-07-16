import * as fs from 'fs';
const dataStoreFile = './src/dataStoreFile.json';
/// //////////////////////////////////////////////////////////
/// ////////////////type definition start here////////////////
/// //////////////////////////////////////////////////////////
export type Id = number;

/// ////////definition of type question
export type answer = {
  answerId: number,
  answer: string,
  colour: string,
  correct: boolean
}
function isanswer(answer: any): boolean {
  if ('answerId' in answer && typeof answer.answerId === 'number' &&
    'answer' in answer && typeof answer.answer === 'string' && answer.answer.length >= 1 && answer.answer.length <= 30 &&
    'colour' in answer && typeof answer.colour === 'string' &&
    'correct' in answer && typeof answer.correct === 'boolean') {
    return true;
  }
  console.log('this answer is incorrect : ', answer);
  return false;
}
export type question = {
  questionId: number,
  question: string,
  duration: number,
  points: number,
  answers: answer[]
}
function isAnswers(answers: any): boolean {
  if (Array.isArray(answers) && answers.every(isanswer) &&
    answers.filter((answer) => (answer.correct === true)).length > 0) {
    return true;
  }
  console.log('answers incorrect');
  return false;
}
function isQuestion(question: any): boolean {
  if ('questionId' in question && typeof question.questionId === 'number' &&
    'question' in question && typeof question.question === 'string' && question.question.length >= 5 && question.question.length <= 50 &&
    'duration' in question && typeof question.duration === 'number' && question.duration > 0 &&
    'points' in question && typeof question.points === 'number' && question.points > 0 && question.points <= 10 &&
    'answers' in question.answers && Array.isArray(question.answers) && isAnswers(question.answers)) {
    return true;
  }
  console.log('This question is invalid', question);
  return false;
}
/// //////definition of type question

/// ////////definition of type user
export type user = {
  name: string,
  nameFirst?: string,
  nameLast?: string,
  authUserId: number,
  email: string,
  password: string,
  numSuccessfulLogins: number, // This should be 0 at first
  numFailedPasswordsSinceLastLogin: number, // This should be 0 at first
  quizzesUserHave: Id[],
  quizzesUserDeleted: Id[],
  pastPassword: string[],
}
function isUser(user: any): boolean {
  if ('authUserId' in user && typeof user.authUserId === 'number' &&
    'email' in user && typeof user.email === 'string' &&
    'password' in user && typeof user.password === 'string' &&
    'name' in user && typeof user.name === 'string' &&
    'numSuccessfulLogins' in user && typeof user.numSuccessfulLogins === 'number' &&
    'numFailedPasswordsSinceLastLogin' in user && typeof user.numFailedPasswordsSinceLastLogin === 'number' &&
    'quizzesUserHave' in user && Array.isArray(user.quizzesUserHave) &&
    'quizzesUserDeleted' in user && Array.isArray(user.quizzesUserDeleted) &&
    'pastPassword' in user && Array.isArray(user.pastPassword)) {
    return true;
  }
  console.log('user is not valid, which is \n', user, '\n');
  return false;
}
/// ////////definition of type user

/// //////definition of type quiz
export type quiz = {
  quizId: number,
  name: string,
  description?: string | undefined | null,
  timeCreated: number,
  timeLastEdited: number
  numQuizQuestion: number // this is used to count the num of questions.
  questions: question[]
};
function isQuestions(questions: any): boolean {
  if (questions.every(isQuestion)) return true;
  console.log('questions incorrect');
  return false;
}
function isQuiz(quiz: any): boolean {
  if ('quizId' in quiz && typeof quiz.quizId === 'number' &&
    'name' in quiz && typeof quiz.name === 'string' &&
    'timeCreated' in quiz && typeof quiz.timeCreated === 'number' &&
    'timeLastEdited' in quiz && typeof quiz.timeLastEdited === 'number' &&
    'numQuizQuestion' in quiz && typeof quiz.numQuizQuestion === 'number' &&
    'questions' in quiz && Array.isArray(quiz.questions) && isQuestions(quiz.questions)
  ) {
    if ('description' in quiz && typeof quiz.description !== 'string') return false;
    return true;
  }
  console.log('quiz is not valid, which is \n', quiz, '\n');
  return false;
}
/// //////definition of type quiz

/// //////definition of type users and quizzes
export type users = {
  [authUserId: number]: user;
}
function isUsers(users: any): boolean {
  for (const userId in users) {
    if (!isUser(users[userId])) {
      console.log('error in users');
      console.log();
      return false;
    }
  }
  console.log('users check pass');
  return true;
}
export type quizzes = {
  [quizId: number]: quiz
};
function isQuizzes(quizzes: any): boolean {
  for (const quizId in quizzes) {
    if (!isQuiz(quizzes[quizId])) {
      console.log('error in quizzes');
      return false;
    }
  }
  console.log('quizzes check pass');
  return true;
}
/// //////definition of type users and quizzes

/// //////definition of type data and tokenUserIdList
export type tokenUserIdList = {
  [token: string]: number
}
function isTokenUserIdList(tokenUserIdList: any): boolean {
  for (const token in tokenUserIdList) {
    if (!tokenUserIdList[token] || typeof tokenUserIdList[token] !== 'number') {
      console.log('error in tokenUserIdList');
      return false;
    }
  }
  console.log('tokenUserIdList check pass');
  return true;
}
export type data = {
  users: users,
  quizzes: quizzes,
  quizzesDeleted: quizzes,
  tokenUserIdList: tokenUserIdList,
  Sessions: Sessions,
  playerData: playerData
};
function isdata(data: any): boolean {
  if ('users' in data && 'quizzes' in data && 'quizzesDeleted' in data && 'tokenUserIdList' in data) {
    if (isUsers(data.users) && isQuizzes(data.quizzes) && isQuizzes(data.quizzesDeleted) && isTokenUserIdList(data.tokenUserIdList)) {
      console.log('data check pass');
      return true;
    }
  }
  return false;
}
/// ////////////////////////////////////////
let dataStore: data = {
  users: {},
  quizzes: {},
  quizzesDeleted: {},
  tokenUserIdList: {},
  Sessions: {},
  playerData: {}
};


//quizSession
export enum QuizSessionState {
  LOBBY,
  QUESTION_COUNTDOWN,
  QUESTION_OPEN,
  QUESTION_CLOSE,
  ANSWER_SHOW,
  FINAL_RESULTS,
  END
};

enum QuizSessionAction {
  NEXT_QUESTION,
  SKIP_COUNTDOWN,
  GO_TO_ANSWER,
  GO_TO_FINAL_RESULTS,
  END,
};

interface Player {
  id: number;
  name: string;
  sessionId: number; // id of current session they are in
  questionAnswered: question[];
  messages: message[];
  // add anything else?
};

export interface message {
  messageBody: string;
  playerId: number;
  playerName: string;
  timeSent: number;
}

interface QuizSessionResults {
  // TODO : What is the best way to represent results????
};

interface QuizSession {
  id: number;
  autoStartNum: number;
  state : QuizSessionState;
  atQuestion : number;
  players: Player[];
  metadata: quiz;
  results: QuizSessionResults;
  messages: message[];
};

type Sessions = {
  [sessionId: number]: QuizSession
}

type playerData = {
  [playerId: number] : Player;
}

// quizSession store

export function getSessionData() {
  return dataStore.Sessions;
}

export function setSessionData(newData: Sessions) {
  dataStore.Sessions = newData;
}

export function getPlayerData() {
  return dataStore.playerData;
}

export function setPlayerData(newData) {
  dataStore.playerData = newData;
}


/// ///////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////
/// /DATA DEFINE FINISHED //////////////// DATA DEFINE FINISHED////
/// ///////////////////////////////////////////////////////////////

function setJSONbyDataStore() {
  console.log(`saving data into ${dataStoreFile}, please wait.`);
  fs.writeFileSync(dataStoreFile, JSON.stringify(dataStore), 'utf-8');
}
function setDataStorebyJSON() {
  const json = JSON.parse(fs.readFileSync(dataStoreFile, 'utf-8'));
  if (isdata(json)) {
    dataStore = json;
    return dataStore;
  }
  console.log('data store broken, please check it and fix it');
  throw Error;
}
function findUserIdByToken(Token: string) {
  console.log("finding user id by token (from function 'findUserIdByToken')");
  if (Token.length === 0) return NaN;
  const data = getData();
  if (data.tokenUserIdList[Token]) {
    console.log('found success');
    return data.tokenUserIdList[Token];
  } else {
    console.log(`%cnot found the userId, ${Token} might not refer to an current logged user`, 'color : red;');
    return NaN;
  }
}

function findTokenByUserId(userId: number) {
  console.log("finding token by user id (from function 'findTokenByUserId')");
  const data = getData();
  for (const [key, value] of Object.entries(data.tokenUserIdList)) {
    if (value === userId) { return key; }
  }
  return null;
}

function getData(): data {
  return dataStore;
}
// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: data) {
  dataStore = newData;
}

function checkDuplicateToken(token: string) {
  const data = getData();
  for (const key in data.tokenUserIdList) {
    if (key === token) { return true; }
  }
  return false;
}
export {
  setDataStorebyJSON,
  setJSONbyDataStore,
  findUserIdByToken,
  getData, setData,
  findTokenByUserId,
  checkDuplicateToken
};

